import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { inventoryActions, orderActions } from "../../actions";
import { Link } from "react-router-dom";
import OrderItem from "./OrderItem";
import { config } from "../../utils/conf";
class DashboardRecentOrders extends Component {
  componentDidMount() {
    this.fetchOrderInventory();
    const { accessToken, orders } = this.props;
    if (accessToken && orders.length < 1) this.getOrders();
  }
  componentWillUnmount() {
    this.props.dispatch(orderActions.resetState());
  }

  componentDidUpdate(prevProps) {
    this.fetchOrderInventory();
    const { accessToken } = this.props;
    if (accessToken !== prevProps.accessToken) this.getOrders();
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

  render() {
    let headerItemStyle = "header-item tw-text-left tw-px-2";
    return (
      <div className="dashboard-recent-orders">
        <div className="tw-flex tw-flex-row xs:tw-flex-col tw-justify-between">
          <div className="tw-py-2 tw-pr-2 tw-flex tw-flex-col tw-w-6/12 xs:tw-w-4/5">
            <h3 className="tw-mt-3 xs:tw-text-base xs:tw-font-semibold">
              My Recent Orders
            </h3>
            <p className="tw-m-0 tw-text-gray-600 tw-font-light xs:tw-text-xs xs:tw-font-normal">
              Click on an order to see more details
            </p>
          </div>
          {config.bulkOrderEnable && (
            <div className="tw-flex xs:tw-flex-flex">
              <div className="tw-flex tw- tw-flex-col tab:tw-w-52 tw-w-64 tw-text-center tw-py-2 tw-pl-2 tw-self-end xs:tw-w-1/2">
                <Link
                  to={{
                    pathname: "/ordering/new-bulk-order",
                  }}
                  className="tw-py-2 tw-mt-3 tw-bg-tosca-blue tw-no-underline tw-cursor-pointer tw-text-base tw-rounded hover:tw-bg-tosca-blue-light hover:tw-text-gray-900 xs:tw-text-sm"
                >
                  Place Bulk Order
                </Link>
              </div>

              <div className="tw-flex tw-flex-col tab:tw-w-52 tw-w-64 tw-text-center tw-py-2 tw-pl-2 tw-self-end xs:tw-w-1/2">
                <Link
                  to={{
                    pathname: "/ordering/new",
                  }}
                  className="tw-py-2 tw-mt-3 tw-bg-tosca-blue tw-no-underline tw-cursor-pointer tw-text-base tw-rounded hover:tw-bg-tosca-blue-light hover:tw-text-gray-900 xs:tw-text-sm"
                >
                  Place New Single Order
                </Link>
              </div>
            </div>
          )}
          {!config.bulkOrderEnable && (
            <div className="tw-flex xs:tw-flex-flex">
              <div className="tw-flex tw-flex-col tw-w-64 tw-text-center tw-py-2 tw-pl-2 tw-self-end xs:tw-w-1/2">
                <Link
                  to={{
                    pathname: "/ordering/new",
                  }}
                  className="tw-py-2 tw-py-2 tw-mt-3 tw-bg-tosca-blue tw-no-underline tw-cursor-pointer tw-text-base tw-rounded hover:tw-bg-tosca-blue-light hover:tw-text-gray-900 xs:tw-text-sm"
                >
                  Place New Order
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="tw-bg-white tw-p-4 xs:tw-overflow-x-auto tab:tw-overflow-x-auto">
          <div className="tw-min-w-[900px] tw-grid">
            <div className="tHeader tw-flex tw-justify-start tw-items-center tw-flex-row tw-bg-tosca-gray tw-py-5 tw-border-b tw-font-normal tw-text-xs tw-uppercase xs:tw-py-2">
              <div className="xs:tw-w-1 tw-text-left tw-px-2 tw-w-1/20"></div>

              <div className="header-item tw-text-left tw-px-2">Status</div>
              <div className="header-item tw-text-left tw-px-2">Order Date</div>
              <div className="xs:tw-w-24 header-item tw-text-left tw-px-2">
                PO Number
              </div>
              <div
                className={
                  config.showTransplaceIcon
                    ? headerItemStyle
                    : headerItemStyle + " extra-width"
                }
                style={{ marginLeft: "12px" }}
              >
                Requested Delivery
              </div>

              {config.showTransplaceIcon ? (
                <div className="header-item tw-text-left tw-px-2">
                  Track My Shipment
                </div>
              ) : null}

              <div className="header-item tw-text-left tw-px-2">RPC Size</div>
              <div
                className="header-item tw-text-left tw-px-2"
                style={{ width: "8%" }}
              >
                Quantity
              </div>
              <div className="tw-w-2"></div>
            </div>
            {this.props.orders.slice(0, 5).map((order, i) => (
              <OrderItem
                key={i}
                order={order}
                bgColor={i % 2 ? "tw-bg-orange-300" : ""}
                reorder={this.props.orderInventory.orderInventory
                  .map((container) => container.itemId)
                  .includes(order.containerType)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const { array, string, object, bool } = PropTypes;

DashboardRecentOrders.propTypes = {
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

export default connect(mapState)(DashboardRecentOrders);
