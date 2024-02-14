import React, { Component } from "react";
import "./style.css";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import { logo } from "../../../../../images";

export default class ThankYouModal extends Component {
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
          zIndex: 2,
          display: visible ? "" : "none",
        }}>
        <div
          id="thank-you-modal"
          className="container"
          onClick={(e) => e.stopPropagation()}>
          <span
            className="glyphicon glyphicon-remove-sign warning-close"
            onClick={() => response(false)}
          />
          <div className="row warning-header">
            <img src={logo} alt="Tosca" />
            <h1>Thank you for your feedback.</h1>
          </div>
          <hr />
          <div>
            <p>Your feedback will help us to better serve our customers.</p>
          </div>
          <div className="header-btn">
            <Link
              to="/resources/feedback"
              className="btn button-main"
              onClick={() => response(false)}>
              Provide More Feedback
            </Link>
          </div>
          <div className="secondary-btn">
            <Link
              to="/"
              className="btn button-secondary"
              onClick={() => response(false)}>
              Place Another Order
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

ThankYouModal.propTypes = {
  visible: PropTypes.bool.isRequired,
};
