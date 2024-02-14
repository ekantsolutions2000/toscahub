import React, { Component } from "react";
import "./style.css";
import { connect } from "react-redux";

class ViewOrders extends Component {
  render() {
    return (
      <div>
        <h1>View Orders Page</h1>
      </div>
    );
  }
}

export default connect((store) => {
  return {};
})(ViewOrders);
