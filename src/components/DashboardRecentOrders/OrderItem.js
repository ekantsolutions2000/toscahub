import React, { Component } from "react";
import "./style.css";
import moment from "moment";
import TrackShipment from "../TrackShipment";
import StatusDescription from "../StatusDescription";
import StatusIcon from "../StatusIcon";
import { config } from "../../utils/conf";
import PropTypes from "prop-types";
import _ from "lodash";
class OrderItem extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  state = {
    rowClickable: true,
  };

  placeReorder = (e, order) => {
    e.preventDefault();
    e.stopPropagation();

    this.context.router.history.push({
      pathname: "/ordering/new",
      state: { copy: order },
    });
  };

  render() {
    const date_format = "ll";

    const { order, reorder } = this.props;
    let cellStyle =
      "row-item tw-px-2 tw-no-underline tw-self-start tw-text-left tw-self-center";
    return (
      <div
        className={
          "tw-cursor-pointer tRow tw-flex tw-flex-row tw-w-full tw-no-underline tw-py-3 tw-border-b tw-font-light hover:tw-bg-tosca-alice-blue hover:tw-text-gray-900"
        }
        onClick={() => {
          this.context.router.history.push("/ordering");
        }}
      >
        <StatusIcon order={order} />

        <StatusDescription order={order} />

        <div
          className={cellStyle}
          style={{ width: "160px", paddingLeft: "16px" }}
        >
          {moment(order.orderDate).isValid()
            ? moment(order.orderDate).format(date_format)
            : ""}
        </div>
        <div
          className={cellStyle}
          style={{ width: "140px", paddingLeft: "12px" }}
        >
          {order.purchaseOrderNumber}
        </div>
        <div
          className={
            config.showTransplaceIcon ? cellStyle : cellStyle + " extra-width"
          }
          style={{ width: "160px", paddingLeft: "12px" }}
        >
          {moment(order.requestedDeliveryDate).isValid()
            ? moment(order.requestedDeliveryDate).format(date_format)
            : ""}
        </div>

        {config.showTransplaceIcon ? (
          <div
            className={cellStyle}
            style={{ width: "145px", paddingLeft: "16px" }}
          >
            <TrackShipment
              PONo={order.purchaseOrderNumber}
              referenceNo={`${
                _.get(order, "orderNumber", "").toString().split(".")[0]
              }-${_.get(order, "billOfLading", "").toString().split(".")[0]}`}
              isActive={!!order.billOfLading}
            />
          </div>
        ) : null}
        <div
          className={cellStyle}
          style={{ width: "190px", paddingLeft: "54px" }}
        >
          {order.containerType}
        </div>
        <div
          className={cellStyle}
          style={{ width: "90px", paddingLeft: "16px" }}
        >
          {order.quantity}
        </div>

        <div
          className="row-item tw-flex tw-flex-col tw-text-center"
          style={{ flex: "1", alignItems: "flex-start" }}
        >
          <div
            style={{ display: reorder ? "block" : "none" }}
            className="btn tw-py-1 tw-px-4 tw-bg-tosca-blue tw-w-auto tw-no-underline tw-text-center tw-cursor-pointer tw-rounded hover:tw-bg-tosca-blue-light"
            onClick={(e) => this.placeReorder(e, order)}
          >
            Reorder
          </div>
        </div>
      </div>
    );
  }
}

export default OrderItem;
