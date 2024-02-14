import React, { Component } from "react";
import "./style.css";
import { PropTypes } from "prop-types";
import { logo } from "../../../../images";

export default class TruckloadWarning extends Component {
  render() {
    const { visible, response, quantity, truckload, container } = this.props;
    let percentage = ((quantity / truckload) * 100).toFixed(2);
    return (
      <div
        className="warning-overlay"
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          display: visible ? "" : "none",
        }}
        onClick={() => response(false)}>
        <div
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            display: visible ? "" : "none",
          }}
          onClick={() => response(false)}>
          <div
            id="lead-time-warning"
            className="container"
            onClick={(e) => e.stopPropagation()}>
            <span
              className="glyphicon glyphicon-remove-sign warning-close"
              onClick={() => response(false)}
            />
            <div className="row warning-header">
              <img src={logo} alt="Tosca" />
              <h1>Truckload Quantity</h1>
            </div>
            <hr />
            <div className="row warning-message">
              <p>
                <b>Notice:</b> The entered order quantity for container type{" "}
                {container} is for {percentage}% of a truckload. A truckload
                quantity for this container is {truckload}.
              </p>
            </div>
            <div className="row">
              <div className="form-group pull-right">
                <input
                  type="button"
                  className="btn btn-primary"
                  value="OK"
                  onClick={() => response(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const { bool, func, number, string } = PropTypes;

TruckloadWarning.propTypes = {
  visible: bool.isRequired,
  response: func.isRequired,
  quantity: number.isRequired,
  truckload: number.isRequired,
  container: string.isRequired,
};
