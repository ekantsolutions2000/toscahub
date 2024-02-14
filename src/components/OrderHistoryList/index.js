import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import Loader from "react-loader-spinner";
import OrderHistoryItem from "./components/OrderHistoryItem";
import { SortFilterBar } from "../../components";
import SortButton from "./../../components/SortButton";
import Pagination from "react-js-pagination";
import { pagination_icons } from "../../images";
import Select, { components } from "react-select";
import _ from "lodash";
import FilterByText from "./../../utils/Filter/FilterByText";
import Paginator from "./../../utils/paginator/Paginator";
import { config } from "../../utils/conf";
export default class OrderHistoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: "",
      searchableFields: ["purchaseOrderNumber", "orderNumber", "billOfLading"],
      orders: props.orders,
      orderInventory: props.orderInventory,
      per_page: 25,
      active_page: 1,
      sort_list: [
        {
          value: "",
          label: "",
        },
      ],
      sortedColumn: "",
      sortType: "asc",
      exportHeaders: [
        { label: "Order No", key: "orderNumber" },
        { label: "Order Type", key: "orderType" },
        { label: "Ship to Location", key: "shipToLocation" },
        { label: "Container Type", key: "containerType" },
        { label: "Quantity", key: "quantity" },
        { label: "Lid", key: "lid" },
        { label: "Purchase Order Number", key: "purchaseOrderNumber" },
        { label: "Shipment ID", key: "shipmentId" },
        { label: "Bill of Lading", key: "billOfLading" },
        { label: "Order Date", key: "orderDate" },
        { label: "Requested Delivery Date", key: "requestedDeliveryDate" },
        { label: "Scheduled Ship Date", key: "scheduledShipDate" },
        { label: "Status Desc", key: "statusDesc" },
        {
          label: "Estimated Delivery Date Time",
          key: "estimatedDeliveryDateTime",
        },
        { label: "Added By", key: "addedBy" },
        { label: "Additional Notes", key: "additionalInformation" },
      ],
      width: 0,
    };
    this.sortFilterBarRef = React.createRef();
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  componentDidMount() {
    if (this.props.orders.length > 0)
      this.setState({
        sort_list: _.orderBy(
          Object.keys(this.props.orders[0])
            .filter(
              (item) =>
                item !== "orderNumber" &&
                item !== "billOfLading" &&
                item !== "lid" &&
                item !== "shipmentId",
            )
            .map((item) => ({
              value: item,
              label: item.replace(/([A-Z])/g, " $1").trim(),
            })),
          ["value"],
          "asc",
        ),
      });
    window.addEventListener("resize", this.updateDimensions);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.loading !== this.props.loading ||
      !_.isEqual(prevProps.filter_options, this.props.filter_options) ||
      prevProps.orders.length !== this.props.orders.length
    ) {
      this.setState({ searchKeyword: "", active_page: 1 });
    }

    if (!_.isEqual(this.props.orders, prevState.orders))
      this.setState({
        orders: [...this.props.orders],
        orderInventory: this.props.orderInventory,
        sort_list: !this.props.length
          ? []
          : _.orderBy(
              Object.keys(this.props.orders[0])
                .filter(
                  (item) =>
                    item !== "orderNumber" &&
                    item !== "billOfLading" &&
                    item !== "lid" &&
                    item !== "shipmentId",
                )
                .map((item) => ({
                  value: item,
                  label: item.replace(/([A-Z])/g, " $1").trim(),
                })),
              ["value"],
              "asc",
            ),
      });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  pageClick = (pageNumber) => {
    this.setState({
      active_page: pageNumber,
    });
  };

  pageSelect = (selectedPage) => {
    this.setState({
      active_page: selectedPage.value,
    });
  };

  orderSort = (desc, field) => {
    const { orders } = this.state;
    this.setState({
      orders: _.orderBy(orders, [field], desc ? "desc" : "asc"),
      sortedColumn: field,
      sortType: desc ? "desc" : "asc",
    });
  };

  poSearch = (value) => {
    this.setState({ searchKeyword: value.toString(), active_page: 1 });
  };

  sendExportData = (allData) => {
    return allData ? this.props.allOrders : this.props.orders;
  };

  render() {
    const { active_page, per_page, sort_list, orderInventory } = this.state;
    const { loading } = this.props;
    const { LeftArrow, RightArrow } = pagination_icons;

    let orders = [];

    orders = FilterByText.filter(this.state.orders)
      .keyword(this.state.searchKeyword, this.state.searchableFields)
      .get();

    if (this.state.sortedColumn) {
      orders = _.orderBy(
        orders,
        [this.state.sortedColumn],
        this.state.sortType,
      );
    }
    const paginator = Paginator.paginate(orders, active_page, per_page);
    const paginatedItems = paginator.getItems();

    let selectList = [];
    if (orders.length !== 0) {
      for (let i = 1; i <= Math.ceil(orders.length / per_page); i++)
        selectList.push({ value: i, label: i.toString() });
    }

    return (
      <div id="order-history-list">
        {!this.props.showFilterState && (
          <SortFilterBar
            searchKeyword={this.state.searchKeyword}
            onKeywordChange={this.poSearch}
            ref={this.sortFilterBarRef}
            showSort={false}
            orderSort={this.orderSort}
            list={sort_list}
            getExportData={this.sendExportData}
            headers={this.state.exportHeaders}
            disabled={orders.length <= 0}
            showFilter={this.props.showFilter}
            SearchFieldLabel="Enter Search Criteria"
            HideFilterOption={false}
            filter_options={this.props.filter_options}
            fileType="Orders"
          />
        )}
        {loading ? (
          <div className="loader-container">
            <Loader
              type="Oval"
              color="rgba(246,130,32,1)"
              height="50"
              width="50"
            />
          </div>
        ) : orders.length > 0 ? (
          <div className="tw-grid tw-overflow-x-scroll">
            <div className="tw-flex tw-uppercase tw-font-semibold tw-bg-tosca-gray">
              <div className="tw-w-16"></div>
              <SortButton
                orderSort={this.orderSort}
                sortField="statusDesc"
                render={({ data }) => (
                  <div
                    style={{ ...headerItem }}
                    className={
                      "tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                    }
                    onClick={data.clickHandler}
                  >
                    <div className="tw-flex">
                      Status
                      {this.state.sortedColumn === "statusDesc"
                        ? data.activeIcon
                        : null}
                    </div>
                  </div>
                )}
              />

              <SortButton
                orderSort={this.orderSort}
                sortField="orderDate"
                render={({ data }) => (
                  <div
                    style={{ ...headerItem }}
                    className={
                      "tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                    }
                    onClick={data.clickHandler}
                  >
                    <div className="tw-flex">
                      Order Date
                      <span className="tw-w-6">
                        {this.state.sortedColumn === "orderDate"
                          ? data.activeIcon
                          : null}{" "}
                      </span>
                    </div>
                  </div>
                )}
              />

              <SortButton
                orderSort={this.orderSort}
                sortField="purchaseOrderNumber"
                render={({ data }) => (
                  <div
                    style={{ ...headerItem }}
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                    onClick={data.clickHandler}
                  >
                    <div className="tw-flex">
                      PO NO.
                      <span className="tw-w-6">
                        {this.state.sortedColumn === "purchaseOrderNumber"
                          ? data.activeIcon
                          : null}{" "}
                      </span>
                    </div>
                  </div>
                )}
              />

              <SortButton
                orderSort={this.orderSort}
                sortField="requestedDeliveryDate"
                render={({ data }) => (
                  <div
                    style={{ ...headerItem }}
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                    onClick={data.clickHandler}
                  >
                    <div className="tw-flex">
                      Requested Delivery
                      <span className="tw-w-6">
                        {this.state.sortedColumn === "requestedDeliveryDate"
                          ? data.activeIcon
                          : null}{" "}
                      </span>
                    </div>
                  </div>
                )}
              />
              {config.showTransplaceIcon ? (
                <SortButton
                  orderSort={this.orderSort}
                  sortField="estimatedDeliveryDateTime"
                  render={({ data }) => (
                    <div
                      style={{ ...headerItem }}
                      className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                      onClick={data.clickHandler}
                    >
                      <div className="tw-flex">
                        Track My Shipment
                        <span className="tw-w-6">
                          {this.state.sortedColumn ===
                          "estimatedDeliveryDateTime"
                            ? data.activeIcon
                            : null}{" "}
                        </span>
                      </div>
                    </div>
                  )}
                />
              ) : null}
              <SortButton
                orderSort={this.orderSort}
                sortField="containerType"
                render={({ data }) => (
                  <div
                    style={{ ...headerItem }}
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                    onClick={data.clickHandler}
                  >
                    <div className="tw-flex">
                      RPC Size
                      <span className="tw-w-6">
                        {this.state.sortedColumn === "containerType"
                          ? data.activeIcon
                          : null}{" "}
                      </span>
                    </div>
                  </div>
                )}
              />

              <SortButton
                orderSort={this.orderSort}
                sortField="quantity"
                render={({ data }) => (
                  <div
                    style={{ ...headerItem }}
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline"
                    onClick={data.clickHandler}
                  >
                    <div className="tw-flex">
                      Qty
                      <span className="tw-w-6">
                        {this.state.sortedColumn === "quantity"
                          ? data.activeIcon
                          : null}{" "}
                      </span>
                    </div>
                  </div>
                )}
              />
              {/* <div style={{ ...headerItem, flex: "unset", width: "50px" }}></div> */}
            </div>
            {paginatedItems.map((order, index, array) => (
              <OrderHistoryItem
                key={index}
                order={order}
                index={index}
                expanded={false}
                reorder={orderInventory
                  .map((container) => container.itemId)
                  .includes(order.containerType)}
                showModal={this.props.showModal}
                orders={array}
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
            No orders to show...
          </div>
        )}
        <div
          className="pagination-comp"
          style={{ display: loading ? "none" : "" }}
        >
          <Pagination
            activePage={active_page}
            itemsCountPerPage={per_page}
            totalItemsCount={orders.length}
            pageRangeDisplayed={this.state.width > 515 ? 6 : 1}
            onChange={this.pageClick}
            firstPageText={<FirstPageText arrow={LeftArrow} />}
            prevPageText={<img src={LeftArrow} alt="left arrow" />}
            nextPageText={<img src={RightArrow} alt="right arrow" />}
            lastPageText={<LastPageText arrow={RightArrow} />}
          />
          <Select
            value={{ value: active_page, label: active_page.toString() }}
            options={selectList}
            className="react-select pagination-select"
            onChange={this.pageSelect}
            components={{ DropdownIndicator }}
            backspaceRemovesValue={false}
            menuPlacement="auto"
          />
        </div>
      </div>
    );
  }
}

const FirstPageText = (props) => {
    return (
      <div style={pag_styles}>
        <img
          style={{ margin: 0, padding: 0 }}
          src={props.arrow}
          alt="start arrow"
        />
        <p style={{ ...pipe_styles, right: "13px" }}>|</p>
      </div>
    );
  },
  LastPageText = (props) => {
    return (
      <div style={pag_styles}>
        <p style={{ ...pipe_styles, left: "13px" }}>|</p>
        <img
          style={{ margin: 0, padding: 0 }}
          src={props.arrow}
          alt="end arrow"
        />
      </div>
    );
  };

const pag_styles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bolder",
    margin: 0,
    padding: 0,
  },
  pipe_styles = {
    position: "absolute",
    fontWeight: "bolder",
    fontSize: "15px",
    color: "rgb(236, 113, 10)",
    margin: 0,
    lineHeight: "100%",
    alignItems: "center",
    padding: 0,
  };
const headerItem = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  flex: "1",
  margin: "2px 0",
  padding: "10px 10px 10px 20px",
};

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

const { array, bool } = PropTypes;

OrderHistoryList.propTypes = {
  orders: array.isRequired,
  loading: bool.isRequired,
  orderInventory: array.isRequired,
};
