import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
import TrackShipment from "../../TrackShipment";
import StatusDescription from "../../StatusDescription";
import StatusIcon from "../../StatusIcon";
import { config } from "../../../utils/conf";
import _ from "lodash";

export default class OrderHistoryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded,
      rowClickable: true,
    };
  }

  render() {
    const { order } = this.props;
    const date_format = "ll";
    return (
      <div
        className={`order-history-item${this.state.expanded ? " active" : ""}`}
        style={{
          paddingLeft: "17px",
          backgroundColor: this.state.expanded
            ? "rgba(126,212,247, .1)"
            : "white",
        }}
        // onClick={() =>
        //   this.state.rowClickable
        //     ? this.setState({ expanded: !this.state.expanded })
        //     : null
        // }
        onClick={() =>
          this.props.showModal(
            order,
            this.props.reorder,
            this.props.orders,
            this.props.index,
          )
        }
        onMouseEnter={() => {
          this.setState({
            rowClickable: true,
          });
        }}
      >
        <div className="order-history-header header-style">
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <div className="header-style">
              <StatusIcon order={order} />
              <div className="header-item">
                <div
                  className={
                    "header-label" +
                    (this.state.expanded ? "" : " lg:tw-hidden")
                  }
                >
                  Status
                </div>
                <StatusDescription order={order} />
              </div>
              <div className="header-item">
                <div
                  className={
                    "header-label" +
                    (this.state.expanded ? "" : " lg:tw-hidden")
                  }
                >
                  Order Date
                </div>
                <div className="row-value">
                  {moment(order.orderDate).isValid()
                    ? moment(order.orderDate).format(date_format)
                    : ""}
                </div>
              </div>
              <div className="header-item">
                <div
                  className={
                    "header-label" +
                    (this.state.expanded ? "" : " lg:tw-hidden")
                  }
                >
                  PO NO.
                </div>
                <div className="row-value">{order.purchaseOrderNumber}</div>
              </div>
              <div className="header-item">
                <div
                  className={
                    "header-label" +
                    (this.state.expanded ? "" : " lg:tw-hidden")
                  }
                >
                  Requested Delivery
                </div>
                <div className="row-value">
                  {moment(order.requestedDeliveryDate).isValid()
                    ? moment(order.requestedDeliveryDate).format(date_format)
                    : ""}
                </div>
              </div>
              {config.showTransplaceIcon ? (
                <div className="header-item">
                  <div
                    className={
                      "header-label " +
                      (this.state.expanded ? "" : "lg:tw-hidden")
                    }
                  >
                    Track My Shipment
                  </div>
                  <TrackShipment
                    PONo={order.purchaseOrderNumber}
                    referenceNo={`${
                      _.get(order, "orderNumberRaw", "")
                        .toString()
                        .split(".")[0]
                    }`}
                    isActive={
                      !!order.billOfLadingRaw && order.statusDesc !== "Canceled"
                    }
                    onMouseEnter={() => {
                      this.setState({
                        rowClickable: false,
                      });
                    }}
                    onMouseLeave={() => {
                      this.setState({
                        rowClickable: true,
                      });
                    }}
                  />
                </div>
              ) : null}
              <div className="header-item">
                <div
                  className={
                    "header-label " +
                    (this.state.expanded ? "" : "lg:tw-hidden")
                  }
                >
                  Size
                </div>
                <div className="row-value">{order.containerType}</div>
              </div>
              <div className="header-item">
                <div
                  className={
                    "header-label " +
                    (this.state.expanded ? "" : "lg:tw-hidden")
                  }
                >
                  Qty
                </div>
                <div className="row-value">{order.quantity}</div>
                {order.containerType === "Pallet Stack" ? (
                  <div>
                    <div
                      className={
                        "header-label " +
                        (this.state.expanded ? "" : "lg:tw-hidden")
                      }
                    >
                      Unit Pallet QTY
                    </div>
                    <div className="row-value">{order.quantity * 40}</div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div
              className="order-detail"
              style={{
                display: this.state.expanded ? "flex" : "none",
                flexDirection: "column",
                alignItems: "flex-start",
                borderTop: "1px solid rgba(126,212,247,1)",
              }}
            >
              <div
                className="header-style"
                style={{
                  flexWrap: "wrap",
                  marginTop: "10px",
                  paddingTop: "10px",
                  justifyContent: "space-between",
                }}
              >
                <div
                  className="header-item"
                  style={{ minWidth: "276px", width: "30%" }}
                >
                  <div className="header-label">Ship to Location</div>
                  <div className="row-value">{order.shipToLocation}</div>
                </div>
                <div className="header-item">
                  <div className="header-label">Order No.</div>
                  <div className="row-value">{order.orderNumber}</div>
                </div>
                <div className="header-item">
                  <div className="header-label">BOL No.</div>
                  <div className="row-value">{order.billOfLading}</div>
                </div>
                <div className="header-item" style={{ minWidth: "200px" }}>
                  <div className="header-label">Scheduled Ship Date</div>
                  <div className="row-value">
                    {order.scheduledShipDate &&
                    moment(order.scheduledShipDate).isValid()
                      ? moment(order.scheduledShipDate).format(date_format)
                      : ""}
                  </div>
                </div>

                <div className="header-item">
                  <div className="header-label">Added by</div>
                  <div className="row-value tw-break-all">{order.addedBy}</div>
                </div>
                <div></div>
              </div>
              <div className="tw-self-end">
                <div
                  className="reorder-btn"
                  style={{
                    width: 148,
                    display: this.props.reorder ? "block" : "none",
                  }}
                >
                  <Link
                    className="btn"
                    style={{ width: "100%", fontSize: 16 }}
                    to={{
                      pathname: "/ordering/new",
                      state: { copy: order },
                    }}
                  >
                    Reorder
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="header-icon">
            {this.state.expanded ? (
              <img src={pagination_icons.UpArrow} alt="expand" />
            ) : (
              <img src={pagination_icons.DownArrow} alt="collapse" />
            )}
          </div> */}
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
