import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
// import { bulkOrderlogActions, organizationActions } from "../../../actions";
import { organizationActions } from "../../../actions";
import Loader from "react-loader-spinner";
import Paginator from "../../../utils/paginator/Paginator";
import FilterByText from "../../../utils/Filter/FilterByText";
import { SortFilterBar } from "../../../components";
import _ from "lodash";
import { determineNavStyling } from "../../../components/Nav/determineNavStyling";
import SortButton from "../../../components/SortButton";
import { AdvancedFilter } from "../../../components";

class OrderLogs extends Component {
  state = {
    orders: [],
    headers: [
      { colTitle: "Customer", field: "cust_name" },
      { colTitle: "Created Date", field: "createdAt" },
      { colTitle: "PO No", field: "poNo" },
      { colTitle: "RPC Size", field: "modelSize" },
      { colTitle: "QTY", field: "quantity" },
      { colTitle: "Self Pickup", field: "customerPickUp" },
      { colTitle: "Ship to location", field: "ship_to_address_name" },
      { colTitle: "Submitted By", field: "user_name" },
      { colTitle: "Req Delivery Date", field: "reqDelDate" },
      { colTitle: "Successfully Transmitted", field: "isSuccess" },
    ],
    exportHeaders: [
      { label: "Customer", key: "cust_name" },
      { label: "Created Date", key: "export_createdAt" },
      { label: "PO No", key: "poNo" },
      { label: "RPC Size", key: "modelSize" },
      { label: "QTY", key: "quantity" },
      { label: "Self Pickup", key: "export_customerPickUp" },
      { label: "Ship to Location", key: "ship_to_address_name" },
      { label: "Submitted By", key: "user_name" },
      { label: "Req Delivery Date", key: "export_reqDelDate" },
      { label: "Successfully Transmitted", key: "export_isSuccess" },
    ],
    perPage: 25,
    currentPage: 1,
    sort_list: [
      {
        value: "",
        label: "",
      },
    ],
    sortedColumn: "",
    customerOptions: [],
    showFilter: false,
    filterOptions: null,
    searchKeyword: "",
    filteredOrders: [],
    initialLoad: true,
    filteredItems: null,
  };

  componentDidMount = () => {
    let { orders, accessToken, fetching, fetched, error } = this.props;
    if (accessToken && !fetching && !fetched && orders.length === 0 && !error) {
      this.getOrders();
      this.getOrganizations();
    } else {
      this.updateOrder();
    }
    determineNavStyling(this.props.location.pathname);
  };

  static getDerivedStateFromProps(props, state) {
    let filteredItems;
    let displayOrders;
    let searchFields = [
      "cust_name",
      "poNo",
      "user_name",
      "quantity",
      "ship_to_address_name",
      "modelSize",
    ];

    if (state.initialLoad) {
      displayOrders = state.orders;

      filteredItems = FilterByText.filter(displayOrders)
        .keyword(state.searchKeyword, searchFields)
        .get();
    } else {
      displayOrders = state.filteredOrders;

      filteredItems = FilterByText.filter(displayOrders)
        .keyword(state.searchKeyword, searchFields)
        .get();
    }

    return {
      filteredItems: filteredItems,
    };
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    let { orders, accessToken, fetching, fetched, error } = this.props;
    if (accessToken && !fetching && !fetched && orders.length === 0 && !error) {
      // this.getOrders();
      // this.getOrganizations();
    }
    if (prevProps.fetching && this.props.fetched) {
      this.updateOrder();
    }
    if (
      prevProps.loading !== this.props.loading ||
      !_.isEqual(prevProps.filter_options, this.props.filter_options) ||
      prevProps.orders.length !== this.props.orders.length
    ) {
      this.setState({ searchKeyword: "", currentPage: 1 });
    }
  };

  updateOrder = () => {
    let ordersFlat = [];
    let customerOptions = [];

    this.props.orders.forEach((order) => {
      order.order_detail.forEach((od) => {
        let tmp = {
          ...order,
          ...od,
          ...order.order_header,
          ...od.containerInfo,
        };
        ordersFlat.push(tmp);
      });
    });
    ordersFlat = _.orderBy(ordersFlat, "createdAt", "desc");

    customerOptions = this.props.organizations.map((organization) => {
      return {
        label: organization["organizationName"],
        value: organization["organizationId"],
      };
    });

    customerOptions = [{ label: "ALL", value: 0 }].concat(customerOptions);

    this.setState({
      orders: ordersFlat,
      customerOptions: customerOptions,
    });
  };

  orderSort = (desc, field) => {
    if (this.state.initialLoad) {
      let { orders } = this.state;
      let sortedOrders = _.orderBy(orders, field, desc ? "desc" : "asc");
      this.setState({
        orders: sortedOrders,
        sortedColumn: field,
      });
    } else {
      let { filteredOrders } = this.state;
      let sortedOrders = _.orderBy(
        filteredOrders,
        field,
        desc ? "desc" : "asc",
      );
      this.setState({
        filteredOrders: sortedOrders,
        sortedColumn: field,
      });
    }
  };

  getOrders = () => {
    // const { accessToken, dispatch, user } = this.props;
    // const customerId = _.get(user, "CustomerInfo.CustID", undefined);
    // dispatch(bulkOrderlogActions.fetchBulkOrders(accessToken, customerId));
    return true;
  };

  getOrganizations = () => {
    const { accessToken, dispatch } = this.props;

    dispatch(organizationActions.fetchOrganizations(accessToken));
    return true;
  };

  onKeywordSearch = (value) => {
    this.setState({ searchKeyword: value.toString(), currentPage: 1 });
  };

  showFilter = (val) => {
    this.setState({ showFilter: val });
  };

  setFilterOptions = (filterObject, result) => {
    this.setState({
      showFilter: false,
      filterOptions: filterObject,
      filteredOrders: result,
      initialLoad: false,
      currentPage: 1,
      searchKeyword: "",
    });
  };

  sendExportData = (allData) => {
    const orders = allData ? this.state.orders : this.state.filteredItems;
    let formattedOrders;
    if (orders.length > 0) {
      formattedOrders = orders.map((order) => {
        order["export_createdAt"] = moment.utc(order["createdAt"]).format("ll");
        order["export_reqDelDate"] = moment
          .utc(order["reqDelDate"])
          .format("ll");
        order["export_isSuccess"] = order["isSuccess"] ? "Yes" : "No";
        order["export_customerPickUp"] = order["customerPickUp"] ? "Yes" : "No";

        return order;
      });
    }

    return formattedOrders;
  };

  render() {
    const { organizations } = this.props;
    let headers = this.state.headers;
    let loading = this.props.fetching;

    let paginator = Paginator.paginate(
      this.state.filteredItems,
      this.state.currentPage,
      this.state.perPage,
    );

    let orders = paginator.getItems();

    return (
      <div className="">
        {this.state.showFilter ? (
          <AdvancedFilter
            backButtonLabel="Order Logs"
            filterList={this.state.orders}
            setFilter={this.setFilterOptions}
            type="orderLog"
            onClick={this.showModal}
            filterOptions={this.state.filterOptions}
            organizations={organizations.map((organization) => {
              return organization["organizationName"];
            })}
            onBackButtonClick={() => this.setState({ showFilter: false })}
          />
        ) : (
          <div style={{ display: "none" }} />
        )}
        <div style={{ display: this.state.showFilter ? "none" : "block" }}>
          <div className="header-info">
            <div className="">
              <h3>Bulk Order Logs</h3>
              <p>This list shows only bulk orders placed in the Hub.</p>
            </div>
          </div>
          <div className="tw-bg-white tw-px-2 tw-py-2">
            <SortFilterBar
              searchKeyword={this.state.searchKeyword}
              onKeywordChange={this.onKeywordSearch}
              showSort={false}
              orderSort={this.orderSort}
              list={this.state.sort_list}
              getExportData={this.sendExportData}
              headers={this.state.exportHeaders}
              disabled={orders.length <= 0}
              showFilter={() => {
                this.showFilter(true);
              }}
              SearchFieldLabel="Enter Search Criteria"
              searchPlaceholderText="Customer, PO #, QTY"
              HideFilterOption={false}
              filter_options={this.state.filterOptions}
              fileType="Order Logs"
            />
            <div className="tw-flex tw-flex-col tw-bg-white">
              <div className="tw--my-2 tw-py-2 tw-overflow-x-auto tw-sm:-mx-6 tw-sm:px-6 tw-lg:-mx-8 tw-lg:px-8">
                <div className="tw-align-middle tw-inline-block tw-min-w-full tw-shadow tw-overflow-hidden tw-sm:rounded-lg tw-border-b tw-border-gray-200">
                  {loading ? (
                    <div className="loader-container tw-flex tw-justify-center tw-py-10">
                      <Loader
                        type="Oval"
                        color="rgba(246,130,32,1)"
                        height="50"
                        width="50"
                      />
                    </div>
                  ) : (
                    <table className="tw-min-w-full">
                      <thead>
                        <tr className="tw-bg-tosca-gray">
                          {headers.map((h, index) => (
                            <SortButton
                              key={index}
                              orderSort={this.orderSort}
                              sortField={h.field}
                              render={({ data }) => (
                                <th
                                  onClick={data.clickHandler}
                                  className="tw-px-3 tw-py-3 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-medium tw-text-gray-900 tw-uppercase tw-tracking-wider tw-cursor-pointer hover:tw-bg-gray-300 tw-underline col-sort-header"
                                  style={{
                                    position: "relative",
                                  }}>
                                  <div className="tw-w-3/4 tw-inline-block">
                                    {h.colTitle}
                                  </div>
                                  <div
                                    className="tw-w-1/4 tw-inline-block sort-arrow tw-text-right"
                                    style={{
                                      position: "absolute",
                                      top: "33%",
                                      right: 10,
                                    }}>
                                    {this.state.sortedColumn === h.field
                                      ? data.activeIcon
                                      : null}
                                  </div>
                                </th>
                              )}
                            />
                          ))}
                        </tr>
                      </thead>
                      <tbody className="tw-bg-white">
                        {orders.length < 0 ? (
                          orders.map((order, index) => (
                            <React.Fragment key={index}>
                              <tr
                                className={
                                  order.isSuccess
                                    ? "hover:tw-bg-tosca-alice-blue hover:tw-text-gray-900"
                                    : "hover:tw-bg-red-300 hover:tw-text-gray-900 tw-bg-red-200"
                                }>
                                <td className="tw-px-3 tw-py-4 tw-border-b">
                                  {order.cust_name}
                                </td>
                                <td className="tw-px-3 tw-py-4 tw-border-b tw-whitespace-nowrap">
                                  {moment.utc(order.order_date).format("ll")}
                                </td>
                                <td className="tw-px-3 tw-py-4 tw-border-b">
                                  {order.poNo}
                                </td>
                                <td className="tw-px-3 tw-py-4 tw-border-b">
                                  {_.get(order, "modelSize", "-")}
                                </td>
                                <td className="tw-px-3 tw-py-4 tw-border-b">
                                  {order.quantity}
                                </td>
                                <td className="tw-px-3 tw-py-4 tw-border-b">
                                  {order.order_header.customerPickUp
                                    ? "YES"
                                    : "NO"}
                                </td>
                                <td className="tw-px-3 tw-py-4 tw-border-b">
                                  {order.ship_to_address_name}
                                </td>
                                <td className="tw-px-3 tw-py-4 tw-border-b tw-whitespace-nowrap-">
                                  {order.user_name}
                                </td>
                                <td className="tw-px-3 tw-py-4 tw-border-b tw-whitespace-nowrap">
                                  {moment.utc(order.reqDelDate).format("ll")}
                                </td>
                                <td className="tw-px-3 tw-py-4 tw-border-b">
                                  {order.isSuccess ? "YES" : "NO"}
                                </td>
                              </tr>
                            </React.Fragment>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={10}>
                              <div
                                style={{
                                  fontSize: 24,
                                  fontWeight: 500,
                                  fontStyle: "italic",
                                  textAlign: "center",
                                }}>
                                No order logs to show...
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            <div
              className="pagination-comp tw-flex tw-justify-center"
              style={{ display: loading ? "none" : "" }}>
              {paginator.links((num) => this.setState({ currentPage: num }))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = ({ session, logs, organizations }) => ({
  sess: session,
  accessToken: session.user.accessToken,
  organizations: _.orderBy(
    organizations.organizations,
    "organizationName",
    "asc",
  ),
  fetching: logs.fetching,
  fetched: logs.fetched,
  error: logs.error,
  orders: logs.orders,
  user: session.user,
});

export default connect(mapState)(OrderLogs);
