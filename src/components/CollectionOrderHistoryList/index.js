import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import Loader from "react-loader-spinner";
import OrderHistoryItem from "./components/OrderHistoryItem";
import { SortFilterBar } from "../../components";
import SortButton from "./../../components/SortButton";
import { pagination_icons } from "../../images";
import Select, { components } from "react-select";
import _ from "lodash";
import moment from "moment";
import FilterByText from "./../../utils/Filter/FilterByText";
import Paginator from "./../../utils/paginator/Paginator";

export default class CollectionOrderHistoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      per_page: 25,
      active_page: 1,
      sortedColumn: "",
      searchKeyword: "",
      searchableFields: [
        "purchaseOrderNumber",
        "quantity",
        "containerType",
        "orderNumber",
        "trailerNumber",
        "shipFromLocationName",
      ],
      exportHeaders: [
        { label: "Status", key: "statusDesc" },
        { label: "Requested Pickup Date", key: "scheduledShipDate" },
        { label: "Ship From", key: "shipFromLocationName" },
        { label: "BOL No", key: "orderNumber" },
        { label: "Carrier Name", key: "carrierName" },
        { label: "Trailer Number", key: "trailerNumber" },
        { label: "RPC Size", key: "containerType" },
        { label: "Quantity", key: "quantity" },
        { label: "Added By", key: "addedBy" },
      ],
      width: 0,
    };
  }

  componentDidMount() {
    this.resetData();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.orders.length !== this.props.orders.length) {
      this.setState({ filtered: this.props.orders });
    }

    if (prevProps.myOrdersOnly !== this.props.myOrdersOnly) {
      this.setState({ active_page: 1 });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  resetData = () => {
    this.setState({
      filtered: this.props.orders,
      searchKeyword: "",
      active_page: 1,
    });
  };

  orderSort = (desc, field) => {
    this.setState({
      filtered: _.orderBy(this.state.filtered, [field], desc ? "desc" : "asc"),
      sortedColumn: field,
    });
  };

  onKeywordChange = (value) => {
    this.setState({
      active_page: 1,
      searchKeyword: value,
    });
  };

  sendExportData = (allData) => {
    let orders = allData ? this.props.orders : this.state.filtered;
    orders = orders.map((order) => {
      order["scheduledShipDate"] = moment
        .utc(order["scheduledShipDate"])
        .format("ll");

      return order;
    });

    return orders;
  };

  render() {
    const { active_page, per_page } = this.state;
    const { loading } = this.props;

    let orders = this.state.filtered;

    //Filter the result by search text
    orders = FilterByText.filter(orders)
      .keyword(this.state.searchKeyword, this.state.searchableFields)
      .get();

    //Paginate the result
    let paginator = Paginator.paginate(
      orders,
      active_page,
      per_page,
      this.state.width > 515 ? 6 : 1,
    );
    orders = paginator.getItems();

    return (
      <div id="order-history-list">
        <SortFilterBar
          searchKeyword={this.state.searchKeyword}
          onKeywordChange={this.onKeywordChange}
          showSort={false}
          orderSort={this.orderSort}
          getExportData={this.sendExportData}
          headers={this.state.exportHeaders}
          disabled={orders.length <= 0}
          showFilter={this.props.showFilter}
          SearchFieldLabel="Search"
          HideFilterOption={true}
          fileType="Collection Orders"
          searchPlaceholderText="Enter BOL #, RPC Size, Ship from"
          hideFilteredOption={true}
          changeFilters={this.props.changeFilters}
          myOrdersOnly={this.props.myOrdersOnly}
        />
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
              <div className="tw-w-14"></div>
              <SortButton
                orderSort={this.orderSort}
                sortField="statusDesc"
                render={({ data }) => (
                  <div
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline header-item-inbound-order-item"
                    onClick={data.clickHandler}
                  >
                    <div>
                      <div className="tw-flex">
                        Status
                        {this.state.sortedColumn === "statusDesc"
                          ? data.activeIcon
                          : null}
                      </div>
                    </div>
                  </div>
                )}
              />

              <SortButton
                orderSort={this.orderSort}
                sortField="requestedDeliveryDate"
                render={({ data }) => (
                  <div
                    style={{ marginLeft: "5px" }}
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline header-item-inbound-order-item"
                    onClick={data.clickHandler}
                  >
                    <div>
                      <div className="tw-flex">
                        Req Pick Up Date
                        {this.state.sortedColumn === "requestedDeliveryDate"
                          ? data.activeIcon
                          : null}
                      </div>
                    </div>
                  </div>
                )}
              />

              <SortButton
                orderSort={this.orderSort}
                sortField="shipFromLocationName"
                render={({ data }) => (
                  <div
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline header-item-inbound-order-item"
                    onClick={data.clickHandler}
                  >
                    <div>
                      <div className="tw-flex">
                        Ship From
                        {this.state.sortedColumn === "shipFromLocationName"
                          ? data.activeIcon
                          : null}
                      </div>
                    </div>
                  </div>
                )}
              />

              <SortButton
                orderSort={this.orderSort}
                sortField="orderNumber"
                render={({ data }) => (
                  <div
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline header-item-inbound-order-item"
                    onClick={data.clickHandler}
                  >
                    <div>
                      <div className="tw-flex">
                        BOL #
                        {this.state.sortedColumn === "orderNumber"
                          ? data.activeIcon
                          : null}
                      </div>
                    </div>
                  </div>
                )}
              />

              {/*
              <SortButton
                orderSort={this.orderSort}
                sortField="trailerNumber"
                render={({ data }) => (
                  <div
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline header-item-inbound-order-item"
                    onClick={data.clickHandler}
                  >
                    <div>
                      <div className="tw-flex">
                        Trailer
                        {this.state.sortedColumn === "trailerNumber"
                          ? data.activeIcon
                          : null}
                      </div>
                    </div>
                  </div>
                )}
              />*/}

              <SortButton
                orderSort={this.orderSort}
                sortField="carrierName"
                render={({ data }) => (
                  <div
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline header-item-inbound-order-item header-item-shipper"
                    onClick={data.clickHandler}
                  >
                    <div>
                      <div className="tw-flex">
                        Carrier Name
                        {this.state.sortedColumn === "carrierName"
                          ? data.activeIcon
                          : null}
                      </div>
                    </div>
                  </div>
                )}
              />

              <SortButton
                orderSort={this.orderSort}
                sortField="trailerNumber"
                render={({ data }) => (
                  <div
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline header-item-inbound-order-item header-item-shipper"
                    onClick={data.clickHandler}
                  >
                    <div>
                      <div className="tw-flex">
                        Trailer Number#
                        {this.state.sortedColumn === "trailerNumber"
                          ? data.activeIcon
                          : null}
                      </div>
                    </div>
                  </div>
                )}
              />

              <SortButton
                orderSort={this.orderSort}
                sortField="containerType"
                render={({ data }) => (
                  <div
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline header-item-inbound-order-item header-item-rpcsize"
                    onClick={data.clickHandler}
                  >
                    <div>
                      <div className="tw-flex">
                        RPC Size
                        {this.state.sortedColumn === "containerType"
                          ? data.activeIcon
                          : null}
                      </div>
                    </div>
                  </div>
                )}
              />

              <SortButton
                orderSort={this.orderSort}
                sortField="quantity"
                render={({ data }) => (
                  <div
                    className="tw-cursor-pointer hover:tw-bg-gray-300 tw-underline header-item-inbound-order-item header-item-qty"
                    onClick={data.clickHandler}
                  >
                    <div>
                      <div className="tw-flex">
                        Quantity
                        {this.state.sortedColumn === "quantity"
                          ? data.activeIcon
                          : null}
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>

            {orders.map((order, index, array) => (
              <OrderHistoryItem
                key={index}
                order={order}
                index={index}
                expanded={false}
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
          <div>
            {paginator.links((num) => this.setState({ active_page: num }))}
          </div>
          <Select
            value={{ value: active_page, label: active_page.toString() }}
            options={Paginator.getPageOptions()}
            className="react-select pagination-select"
            onChange={(option) => this.setState({ active_page: option.value })}
            components={{ DropdownIndicator }}
            backspaceRemovesValue={false}
            menuPlacement="top"
          />
        </div>
      </div>
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

const { array, bool } = PropTypes;

CollectionOrderHistoryList.propTypes = {
  orders: array.isRequired,
  loading: bool.isRequired,
};
