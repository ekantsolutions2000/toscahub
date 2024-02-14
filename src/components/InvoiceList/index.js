import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import Loader from "react-loader-spinner";
import InvoiceItem from "./components/InvoiceItem";
import { SortFilterBar, AdvancedFilter } from "../../components";
import { pagination_icons } from "../../images";
import Select, { components } from "react-select";
import _ from "lodash";
import SortButton from "./../../components/SortButton";
import FilterByText from "./../../utils/Filter/FilterByText";
import Paginator from "./../../utils/paginator/Paginator";
import Transformer from "../../utils/Transform";
import moment from "moment";
import { Accordion, AccordionItem } from "./../../components/Accordion";
import { InvoiceAging } from "./../../components/Charts";
import MessagePopup from "../MessagePopup";

export default class InvoiceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilter: false,
      filterOptions: null,
      filteredInvoices: [],
      searchKeyword: "",
      searchableFields: [
        "customerPurchaseOrderNumber",
        "billOfLading",
        "invoice",
        "salesOrder",
      ],
      per_page: 25,
      active_page: 1,
      sort_list: [
        {
          value: "",
          label: "",
        },
      ],
      sortedColumn: "",
      showMessgePopup: false,
      width: window.innerWidth,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.invoices.length === 0) {
      return {};
    }

    let sort_list = _.orderBy(
      Object.keys(props.invoices[0]).map((item) => ({
        value: item,
        label: (item.charAt(0).toUpperCase() + item.slice(1))
          .replace(/([A-Z])/g, " $1")
          .trim(),
      })),
      ["value"],
      "asc",
    );

    return { sort_list };
  }

  componentDidMount = () => {
    this.resetData();
    window.addEventListener("resize", this.updateDimensions);
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.hasInvoicesUpdatedFromTheParent(prevProps)) {
      this.resetData();
    }
  };

  hasInvoicesUpdatedFromTheParent = (prevProps) => {
    return prevProps.invoices.length !== this.props.invoices.length;
  };

  resetData = () => {
    this.setState({
      filteredInvoices: this.props.invoices,
      searchKeyword: "",
      active_page: 1,
      filterOptions: null,
    });
  };

  invoiceSort = (desc, field) => {
    const { filteredInvoices } = this.state;
    let sorted = _.orderBy(filteredInvoices, field, desc ? "desc" : "asc");
    this.setState({
      filteredInvoices: sorted,
      sortedColumn: field,
      active_page: 1,
    });
  };

  onKeywordChange = (value) => {
    this.setState({
      active_page: 1,
      searchKeyword: value,
    });
  };

  sendExportData = (allData) => {
    let data = allData ? this.props.invoices : this.state.filteredInvoices;

    data = data.map((item) => {
      delete item.proofOfDeliveryRef;
      return item;
    });

    return Transformer.transform(data)
      .process((item) => {
        const invoiceDate = moment(item.invoiceDate);
        const dueDate = moment(item.dueDate);

        item.invoiceDate = invoiceDate.isValid()
          ? invoiceDate.utc().format("YYYY-MM-DD T HH:mm:ss")
          : item.invoiceDate;
        item.dueDate = dueDate.isValid()
          ? dueDate.utc().format("YYYY-MM-DD T HH:mm:ss")
          : item.dueDate;
        return item;
      })
      .get();
  };

  showFilter = (val) => {
    this.props.showFilter(val);
    this.setState({ showFilter: val });
  };

  setFilterOptions = (filterObject, filteredInvoices) => {
    this.showFilter(false);
    this.setState({
      filterOptions: filterObject,
      filteredInvoices,
      searchKeyword: "",
      active_page: 1,
    });
  };

  openMessagePopup = () => {
    this.setState({
      showMessgePopup: true,
    });
  };

  closeMessagePopup = () => {
    this.setState({
      showMessgePopup: false,
    });
  };

  render() {
    const { active_page, sort_list } = this.state;
    const { loading, requestProofOfDelivery } = this.props;

    //If there is no filter applied or if the component is mounted for the first time invoices will take data from props.invoices
    //Advanced filter result will be aopplied to filteredInvoices
    let invoices = this.state.filteredInvoices;

    //Filter the result by search text
    invoices = FilterByText.filter(invoices)
      .keyword(this.state.searchKeyword, this.state.searchableFields)
      .get();

    //Paginate the result
    let paginator = Paginator.paginate(
      invoices,
      this.state.active_page,
      this.state.per_page,
      this.state.width > 375 ? 6 : 1,
    );
    invoices = paginator.getItems();

    return (
      <React.Fragment>
        {this.state.showMessgePopup && (
          <MessagePopup
            visible={true}
            messageType="danger"
            messageTitel="Proof Of Delivery Document Does Not Exist"
            closeModal={this.closeMessagePopup}
          >
            <p style={{ textAlign: "justify" }}>
              {" "}
              The requested proof of delivery document does not exist. Please
              contact &nbsp;
              <a
                href={`mailto:customerexperience@toscaltd.com?subject=Proof Of Delivery Does Not Exist`}
              >
                customerexperience@toscaltd.com
              </a>{" "}
              &nbsp; for assistance.
            </p>
          </MessagePopup>
        )}

        {!this.state.showFilter && (
          <div className="tw-mb-8">
            <Accordion>
              <AccordionItem
                withShadow={false}
                headerClass="tw-bg-gray-600- tw-py-2 tw-border-b-2-  tw-font-medium tw-text-lg tw-pr-4 tw-cursor-pointer"
                visibleOnLoad={false}
                header={(vm) => (
                  <div className="tw-text-tosca-orange tw-flex">
                    <span>Invoices Aging Summary</span>
                    {vm.state.isOpened ? (
                      <img
                        src={pagination_icons.UpArrow}
                        alt="open"
                        className="tw-ml-2"
                      />
                    ) : (
                      <img
                        src={pagination_icons.DownArrow}
                        alt="close"
                        className="tw-ml-2"
                      />
                    )}
                  </div>
                )}
              >
                {(data) => (
                  <InvoiceAging
                    height={
                      this.state.width > 768
                        ? 90
                        : this.state.width < 425
                        ? 190
                        : 120
                    }
                  />
                )}
              </AccordionItem>
            </Accordion>
          </div>
        )}

        <div className="banner-section tw-text-tosca-orange">
          <p>
            Use the download button to download your PDF for Proof of Delivery
            inline within the invoices. Unable to download, please reach
            Customer Experience at &nbsp;
            <a
              className="tw-text-tosca-orange"
              href={`mailto:CustomerExperience@toscaltd.com?subject=Proof Of Delivery Does Not Exist`}
            >
              CustomerExperience@toscaltd.com
            </a>
          </p>
        </div>

        <div id="invoice-list">
          {this.state.showFilter ? (
            <AdvancedFilter
              backButtonLabel="Invoices"
              filterList={this.props.invoices}
              setFilter={this.setFilterOptions}
              type="invoice"
              filterOptions={this.state.filterOptions}
              onBackButtonClick={() => {
                this.showFilter(false);
              }}
            />
          ) : (
            <SortFilterBar
              searchKeyword={this.state.searchKeyword}
              onKeywordChange={this.onKeywordChange}
              orderSort={this.invoiceSort}
              list={sort_list}
              getExportData={this.sendExportData}
              disabled={invoices.length <= 0}
              showFilter={() => {
                this.showFilter(true);
              }}
              SearchFieldLabel="Search"
              searchPlaceholderText="Enter PO #, BOL #, or Invoice #"
              filter_options={this.state.filterOptions}
              fileType="Invoices"
            />
          )}
          {!this.state.showFilter && (
            <React.Fragment>
              {loading ? (
                <div className="loader-container">
                  <Loader
                    type="Oval"
                    color="rgba(246,130,32,1)"
                    height="50"
                    width="50"
                  />
                </div>
              ) : invoices.length > 0 ? (
                <div
                  className={
                    this.state.showFilter
                      ? "tw-hidden"
                      : "tw-block xs:tw-grid xs:tw-overflow-x-auto"
                  }
                >
                  <div
                    id="grid-flow"
                    // className="tw-flex lg:tw-flex tw-uppercase tw-font-semibold tw-bg-tosca-gray"
                    className="tw-flex tw-justify-start tw-flex-row tw-font-semibold tw-bg-tosca-gray tw-py-5 tw-border-b tw-text-xs tw-uppercase"
                  >
                    <SortButton
                      orderSort={this.invoiceSort}
                      sortField="invoice"
                      render={({ data }) => (
                        <div
                          className={
                            "grid-col tab:tw-w-48 xs:tw-w-40 xs:tw-pl-5 tab:tw-pl-3 tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                          }
                          onClick={data.clickHandler}
                        >
                          <div className="tw-flex">
                            <span>Invoice No</span>
                            <span className="xs:tw-w-6 tab:tw-w-6">
                              {this.state.sortedColumn === "invoice"
                                ? data.activeIcon
                                : null}{" "}
                            </span>
                          </div>
                        </div>
                      )}
                    />

                    <SortButton
                      orderSort={this.invoiceSort}
                      sortField="salesOrder"
                      render={({ data }) => (
                        <div
                          className={
                            "grid-col tw-w-56 tab:tw-w-46 xs:tw-w-40 xs:tw-pl-7 tab:tw-pl-8 tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                          }
                          onClick={data.clickHandler}
                        >
                          <div className="tw-flex">
                            <span>Order No</span>
                            <span className="xs:tw-w-6 tab:tw-w-6">
                              {this.state.sortedColumn === "salesOrder"
                                ? data.activeIcon
                                : null}{" "}
                            </span>
                          </div>
                        </div>
                      )}
                    />

                    <SortButton
                      orderSort={this.invoiceSort}
                      sortField="invoiceAmount"
                      render={({ data }) => (
                        <div
                          className={
                            "grid-col tw-w-72 tab:tw-w-48 xs:tw-w-40 xs:tw-pl-9 tab:tw-pl-9 tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                          }
                          onClick={data.clickHandler}
                        >
                          <div className="tw-flex">
                            Invoice Amt
                            <span className="tab:tw-w-6">
                              {this.state.sortedColumn === "invoiceAmount"
                                ? data.activeIcon
                                : null}{" "}
                            </span>
                          </div>
                        </div>
                      )}
                    />

                    <SortButton
                      orderSort={this.invoiceSort}
                      sortField="dueDate"
                      render={({ data }) => (
                        <div
                          id="dueDateId"
                          className={
                            "grid-col tw-w-48 tab:tw-w-48 xs:tw-w-40 xs:tw-pl-11 tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                          }
                          onClick={data.clickHandler}
                        >
                          <div className="tw-flex">
                            Due Date
                            <span className="tw-w-6">
                              {this.state.sortedColumn === "dueDate"
                                ? data.activeIcon
                                : null}{" "}
                            </span>
                          </div>
                        </div>
                      )}
                    />

                    <SortButton
                      orderSort={this.invoiceSort}
                      sortField="customerPurchaseOrderNumber"
                      render={({ data }) => (
                        <div
                          id="poNoId"
                          className={
                            "grid-col tw-w-48 tab:tw-w-48 xs:tw-w-40 xs:tw-pl-14 tab:tw-pl-12 tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                          }
                          onClick={data.clickHandler}
                        >
                          <div className="tw-flex">
                            PO No
                            <span className="tw-w-6">
                              {this.state.sortedColumn ===
                              "customerPurchaseOrderNumber"
                                ? data.activeIcon
                                : null}{" "}
                            </span>
                          </div>
                        </div>
                      )}
                    />

                    <SortButton
                      orderSort={this.invoiceSort}
                      sortField="billOfLading"
                      render={({ data }) => (
                        <div
                          className={
                            "grid-col tw-w-14 tab:tw-w-48 xs:tw-w-40 tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                          }
                          onClick={data.clickHandler}
                        >
                          {/* <div className="tw-flex">
                          BOL No
                          <span className="tw-w-6">
                            {this.state.sortedColumn === "billOfLading"
                              ? data.activeIcon
                              : null}{" "}
                          </span>
                        </div> */}
                        </div>
                      )}
                    />
                  </div>
                  {invoices.map((invoice, index) => (
                    <InvoiceItem
                      showMessagePopup={this.openMessagePopup}
                      key={index}
                      index={index} // temp added, need eo remove ........... !
                      invoice={invoice}
                      expanded={false}
                      requestProofOfDelivery={requestProofOfDelivery}
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  No invoices to show...
                </div>
              )}
              <div className="pagination-comp">
                <div>
                  {paginator.links((num) =>
                    this.setState({ active_page: num }),
                  )}
                </div>

                <Select
                  value={{ value: active_page, label: active_page.toString() }}
                  options={Paginator.getPageOptions()}
                  className="react-select"
                  onChange={(option) =>
                    this.setState({ active_page: option.value })
                  }
                  components={{ DropdownIndicator }}
                  backspaceRemovesValue={false}
                />
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <img
          src={pagination_icons.DownArrow}
          alt="left arrow"
          width={20}
          height={20}
        />
      </components.DropdownIndicator>
    )
  );
};

const { array, bool, func } = PropTypes;

InvoiceList.propTypes = {
  invoices: array.isRequired,
  loading: bool.isRequired,
  requestProofOfDelivery: func.isRequired,
};
