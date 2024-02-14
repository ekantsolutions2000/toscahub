import React, { Component } from "react";
import "./style.css";
import { PropTypes } from "prop-types";

export default class ThankYouModal extends Component {
  render() {
    const { visible, closeModal, title, isWarning } = this.props;
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
        <div id="ty-modal" onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}>
            <span
              className="glyphicon glyphicon-remove pull-right"
              onClick={() => closeModal()}
            />
          </div>
          <div className="warning-header">
            <h1 className={isWarning ? "warning-title" : null}>
              {title ? title : "Thank you!"}
            </h1>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

ThankYouModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.any,
};
