import React, { Component } from "react";
import { status_icons } from "../../images";
import ToolTip from "../Tooltip";
import { MdInfo as Default } from "react-icons/md";

const hoverTexts = {
  Unplanned: "This order is being reviewed and prepared.",
  Tendered: "Your order is being planned and worked on to secure carrier.",
  TenderAccept: "Your order is planned, and carrier is assigned.",
  Shipped: "Your order is being shipped.",
  InTransit: "Your order is shipped and can be tracked.",
  Delivered: "Your order has been delivered.",
  Canceled: "This order has been canceled and will not be shipped.",
  Pending:
    "Your order is being reviewed by Tosca’s Planning Team for delivery.",
  Received: "Tosca has received the order.",
  "In-Process": "Your order is being reviewed and prepared.",
};

class StatusIcon extends Component {
  statusIcon = (status) => {
    const {
      Shipped,
      Canceled,
      Received,
      InReview,
      Processing,
      InTransit,
      TenderAccept,
    } = status_icons;

    switch (status) {
      case "Shipped": {
        return <img src={Shipped} alt={status} className="tw-w-8 tw-h-8"></img>;
      }
      case "Canceled": {
        return (
          <img src={Canceled} alt={status} className="tw-w-8 tw-h-8"></img>
        );
      }
      case "Tendered": {
        return (
          <img src={Processing} alt={status} className="tw-w-8 tw-h-8"></img>
        );
      }
      case "Delivered":
      case "Received": {
        return (
          <img src={Received} alt={status} className="tw-w-8 tw-h-8"></img>
        );
      }
      case "In-Review": {
        return (
          <img src={InReview} alt={status} className="tw-w-8 tw-h-8"></img>
        );
      }
      case "InTransit": {
        return (
          <img src={InTransit} alt={status} className="tw-w-8 tw-h-8"></img>
        );
      }
      case "TenderAccept": {
        return (
          <img src={TenderAccept} alt={status} className="tw-w-8 tw-h-8"></img>
        );
      }
      case "Unplanned": {
        return <Default className="tw-w-8 tw-h-8" />;
      }
      default: {
        return <Default className="tw-w-8 tw-h-8" />;
      }
    }
  };

  render() {
    const { order } = this.props;
    const cellStyle =
      "status-icon-container tw-px-2 tw-no-underline tw-self-start tw-text-left row-icon";
    const hoverText = hoverTexts[order.statusDesc];

    return (
      <ToolTip
        disabled={!hoverText}
        content={
          <p className="tw-text-center tw-m-0 tw-py-2 tw-text-gray-600 tw-font-light tw-text-sm">
            {hoverText}
          </p>
        }
        config={{ arrow: false, theme: "light" }}
      >
        <div className={cellStyle}>{this.statusIcon(order.statusDesc)}</div>
      </ToolTip>
    );
  }
}

export default StatusIcon;
