import React, { Component } from "react";

class StatusDescription extends Component {
  statusDescription = (status) => {
    if ("Accounting Hold" === status) {
      return "Pending";
    }
    return status;
  };

  render() {
    const { order } = this.props;
    const cellStyle =
      "status-description row-item tw-no-underline tw-self-start tw-text-left row-value";

    return (
      <div
        className={cellStyle}
        style={{ alignSelf: "center", width: "140px" }}
      >
        {this.statusDescription(order.statusDesc)}
      </div>
    );
  }
}

export default StatusDescription;
