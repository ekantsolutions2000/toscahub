import React, { Component } from "react";
import "./style.css";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";

export default class ThankYouModal extends Component {
  render() {
    const { visible } = this.props;
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
        }}>
        <div
          id="thank-you-modal"
          className="container"
          onClick={(e) => e.stopPropagation()}>
          {/* <span
            className="glyphicon glyphicon-remove-sign warning-close"
            onClick={() => response(false)}
          /> */}
          <div className="thank-you-close" onClick={this.props.close}>
            X
          </div>
          <div className="warning-header">Thank you!</div>
          <div>
            <p>
              A Tosca customer service representaive will be in contact with
              you.
            </p>
          </div>
          <div className="header-btn">
            <input
              type="button"
              value="Return to Invoices"
              className="btn button-main"
              onClick={this.props.close}
            />
            {/* <Link
              to="/invoicing"
              className="btn button-main"
              onClick={() => response(false)}
            >
              Return to Invoices
            </Link> */}
          </div>
          <div className="secondary-btn">
            <Link
              to="/"
              className="btn button-secondary"
              onClick={this.props.close}>
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

ThankYouModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
