import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { inventoryActions, orderActions } from "../../../actions";
import {
  OrderHistoryList,
  AdvancedFilter,
  OrderHistoryItemPopup,
} from "../../../components";
import { determineNavStyling } from "../../../components/Nav/determineNavStyling";
import _ from "lodash";
import { config } from "../../../utils/conf";

class Orders extends Component {
  constructor() {
    super();
    this.state = {
      showFilter: false,
      filterOptions: null,
      filteredOrders: [],
      showOrderHistoryItemPopup: false,
      orderInfo: {},
      reorder: null,
      carouselOrders: [],
      carouselIndex: null,
    };

    this.orderHistoryListRef = React.createRef();
  }

  onRefresh = () => {
    this.getOrders();
  };

  componentDidMount() {
    const { accessToken, orders } = this.props;
    if (accessToken && orders.length < 1) this.getOrders();
    this.fetchOrderInventory();
    determineNavStyling(this.props.location.pathname);
  }

  componentWillUnmount() {
    this.props.dispatch(orderActions.resetState());
  }

  static getDerivedStateFromProps(props, state) {
    if (state.filterOptions) {
      return {};
    }
    return { filteredOrders: props.orders };
  }

  componentDidUpdate(prevProps) {
    const { accessToken } = this.props;
    if (accessToken !== prevProps.accessToken) this.getOrders();
    this.fetchOrderInventory();
  }

  getOrders = () => {
    const { accessToken, dispatch } = this.props;
    dispatch(orderActions.fetchOrders(accessToken));
  };

  fetchOrderInventory = () => {
    if (this.props.accessToken) {
      if (
        !this.props.orderInventory.fetching &&
        !this.props.orderInventory.fetched
      ) {
        this.props.dispatch(
          inventoryActions.fetchOrderInventory(this.props.accessToken, {
            customerId: this.props.user.CustomerInfo.CustID,
            outbound: true,
          }),
        );
      }
    }
  };

  setFilterOptions = (filterObject, result) => {
    this.setState({
      showFilter: false,
      filterOptions: filterObject,
      filteredOrders: result,
    });
  };

  closeOrderHistoryItemPopup = () => {
    this.setState({ showOrderHistoryItemPopup: false });
  };

  showModal = (order, reorder, orders, index) => {
    this.setState({
      showOrderHistoryItemPopup: true,
      orderInfo: order,
      reorder: reorder,
      carouselOrders: orders,
      carouselIndex: index,
    });
  };

  updateOrder = (orders, index, flag) => {
    if (flag === "next" && !_.isEmpty(orders[index + 1])) {
      this.setState({
        orderInfo: orders[index + 1],
        carouselIndex: index + 1,
      });
    }

    if (flag === "prev" && !_.isEmpty(orders[index - 1])) {
      this.setState({
        orderInfo: orders[index - 1],
        carouselIndex: index - 1,
      });
    }
  };

  render() {
    const { loading, orderInventory } = this.props;
    const orders = this.state.filteredOrders;
    return (
      <div className="page" id="outbound-order-history-page">
        <OrderHistoryItemPopup
          visible={this.state.showOrderHistoryItemPopup}
          closeModal={this.closeOrderHistoryItemPopup}
          orderInfo={this.state.orderInfo}
          reorder={this.state.reorder}
          updateOrder={this.updateOrder}
          orders={this.state.carouselOrders}
          index={this.state.carouselIndex}
          user={this.props.user}
          outSideClick={false}
        />
        {this.state.showFilter ? (
          <AdvancedFilter
            filterList={this.props.orders}
            setFilter={this.setFilterOptions}
            type="order"
            filterOptions={this.state.filterOptions}
            onBackButtonClick={() => this.setState({ showFilter: false })}
          />
        ) : (
          <div style={{ display: "none" }} />
        )}
        <div
          id="order-history-page"
          style={{ display: this.state.showFilter ? "none" : "block" }}
        >
          <div className="order-page-header">
            <div className="header-info">
              <div className="tw-flex tw-items-baseline">
                <h3>Order History</h3>
              </div>
              <p>View details, check status or order again.</p>
              <button
                className="tw-rounded tw-text-white hover:tw-bg-orange-700 tw-bg-tosca-orange tw-border-none tw-py-1 tw-px-3 lg:tw-text-lg md:tw-text-base tw-mt-4 md:tw-mt-2 tw-mb-2"
                type="button"
                onClick={this.onRefresh}
              >
                Refresh
              </button>

              <p className="order-history-page-info">
                * Please allow 1-2 minutes for new orders to be displayed in
                Order History.
              </p>
            </div>

            <div className="header-btn">
              {config.bulkOrderEnable && (
                <>
                  <Link to="/ordering/new" className="btn pull-right buttons">
                    Place New Single Order
                  </Link>
                  <Link
                    to="/ordering/new-bulk-order"
                    className="btn pull-right buttons"
                  >
                    Place Bulk Order
                  </Link>
                </>
              )}
              {!config.bulkOrderEnable && (
                <>
                  <Link
                    to="/ordering/new"
                    className="btn pull-right"
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      fontSize: 16,
                    }}
                  >
                    Place New Order
                  </Link>
                </>
              )}
            </div>
          </div>
          <OrderHistoryList
            ref={this.orderHistoryListRef}
            orders={orders}
            allOrders={this.props.orders}
            loading={loading}
            orderInventory={orderInventory.orderInventory}
            filter_options={this.state.filterOptions}
            showFilter={() => this.setState({ showFilter: true })}
            showFilterState={this.state.showFilter}
            showModal={this.showModal}
          />
        </div>
      </div>
    );
  }
}

const { array, string, object, bool } = PropTypes;

Orders.propTypes = {
  orders: array,
  accessToken: string,
  user: object,
  error: object,
  loading: bool,
  orderInventory: object,
};

const mapState = ({ orders, session, orderInventory }) => ({
  orders: orders.orders,
  error: orders.error,
  accessToken: session.user.accessToken,
  user: session.user,
  loading: orders.fetching,
  orderInventory: orderInventory,
});

export default connect(mapState)(Orders);
