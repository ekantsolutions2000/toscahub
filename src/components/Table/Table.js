import React, { Component } from "react";

export class Table extends Component {
  render() {
    let tblWrapperClass = this.props.tblBg;

    return <div className={tblWrapperClass}>Table here</div>;
  }
}

Table.defaultProps = {
  tblBg: "tw-bg-gray-500",
};

export default Table;
