import React, { Component } from "react";
import "./style.css";
import { PropTypes } from "prop-types";
import { logo } from "../../../../images";

export default class LeadTimeWarning extends Component {
  render() {
    const { visible, response } = this.props;
    return (
      <div
        className="warning-overlay"
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
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
            <h1>{this.props.title}</h1>
          </div>
          <hr />
          <div className="row warning-message">{this.props.body}</div>
          <div className="row">
            <div className="form-group pull-right">
              {this.props.showCancelButton && (
                <button
                  className="btn btn-primary"
                  onClick={() => response(false)}>
                  Cancel
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => response(true)}>
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const { bool, func } = PropTypes;

LeadTimeWarning.propTypes = {
  visible: bool.isRequired,
  response: func.isRequired,
};

const body = (
  <p>
    The requested delivery date is less than 7 days from today.{" "}
    <b>Expedited shipping fees may apply.</b> To continue, click OK or click
    Cancel to request a new date. If you have questions, please contact your
    Customer Service Representative.
  </p>
);

LeadTimeWarning.defaultProps = {
  title: "Expedited Shipping",
  body: body,
  showCancelButton: true,
};
