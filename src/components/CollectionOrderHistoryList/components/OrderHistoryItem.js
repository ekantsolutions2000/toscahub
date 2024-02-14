import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import StatusIcon from "../../StatusIcon";

export default class OrderHistoryItem extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  placeReorder = (e, order) => {
    e.preventDefault();
    e.stopPropagation();

    this.context.router.history.push({
      pathname: "/collection-orders/new",
      state: { copy: order },
    });
  };

  render() {
    const { order } = this.props;
    const date_format = "ll";
    return (
      <div
        className={`collection-order-history-item`}
        style={{
          backgroundColor: "white",
        }}
        onClick={() =>
          this.props.showModal(
            order,
            this.props.reorder,
            this.props.orders,
            this.props.index,
          )
        }
      >
        <div className="order-history-header header-style">
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <div className="header-style">
              <StatusIcon order={order} />
              <div className="header-item">
                <div className="header-label lg:tw-hidden">Status</div>

                <div className="row-value">
                  <div className="tw-flex">
                    <span className="lg:tw-ml-2 tw-text-[14px] sm:tw-text-base">
                      {order.statusDesc}
                    </span>
                  </div>
                </div>
              </div>

              <div className="header-item" style={{ marginLeft: "10px" }}>
                <div className="header-label lg:tw-hidden">
                  Req Pick Up Date
                </div>
                <div className="row-value">
                  {moment(order.requestedDeliveryDate).isValid()
                    ? moment(order.requestedDeliveryDate).format(date_format)
                    : ""}
                </div>
              </div>

              <div className="header-item">
                <div className="header-label lg:tw-hidden">Ship From</div>
                <div className="row-value">{order.shipFromLocationName}</div>
              </div>

              <div className="header-item">
                <div className="header-label lg:tw-hidden">BOL #</div>
                <div className="row-value">{order.orderNumber}</div>
              </div>

              {/*
              <div className="header-item">
                <div className="header-label lg:tw-hidden">Trailer</div>
                <div className="row-value">{order.trailerNumber}</div>
              </div>
              */}

              <div className="header-item line-item-Sshipper">
                <div className="header-label lg:tw-hidden">Carrier Name</div>
                <div className="row-value tw-overflow-x-hidden">
                  {order.carrierName ? order.carrierName : "N/A"}
                </div>
              </div>

              <div className="header-item line-item-Sshipper">
                <div className="header-label lg:tw-hidden">Trailer Number#</div>
                <div className="row-value tw-overflow-x-hidden">
                  {order.trailerNumber ? order.trailerNumber : "N/A"}
                </div>
              </div>

              {/* <div className="header-item">
                <div className="header-label lg:tw-hidden">BOL NO.</div>
                <div className="row-value">{order.billOfLading}</div>
              </div> */}

              <div className="header-item line-item-rpcsize">
                <div className="header-label lg:tw-hidden">RPC Size</div>
                <div className="row-value">{order.containerType}</div>
              </div>

              <div className="header-item line-item-qty">
                <div className="header-label lg:tw-hidden">Quantity</div>
                <div className="row-value">{order.quantity}</div>
              </div>

              {/* <div className="header-item">
                <div className="header-label lg:tw-hidden">Status</div>

                <div className="row-value">
                  <div className="tw-flex">
                    <StatusIcon order={order} />{" "}
                    <span className="tw-ml-2">{order.statusDesc}</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="order-history-details"></div>
      </div>
    );
  }
}

const { object, bool } = PropTypes;

OrderHistoryItem.propTypes = {
  order: object.isRequired,
  expanded: bool,
  reorder: bool,
};
