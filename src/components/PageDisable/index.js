import React, { Component } from "react";
import "./style.css";
import { PropTypes } from "prop-types";
import Loader from "react-loader-spinner";

export default class PageDisable extends Component {
  render() {
    const { disabled, message } = this.props;
    return (
      <div id="page-disable" style={{ display: disabled ? "block" : "none" }}>
        <div className="message tw-text-xl md:tw-text-3xl">{message}</div>
        <div className="md:tw-hidden">
          <Loader
            type="ThreeDots"
            height="55"
            width="55"
            color="rgba(246,130,32,0.8)"
          />
        </div>
        <div className="tw-hidden md:tw-block">
          <Loader
            type="ThreeDots"
            height="100px"
            width="100px"
            color="rgba(246,130,32,0.8)"
          />
        </div>
      </div>
    );
  }
}

const { bool, string } = PropTypes;

PageDisable.propTypes = {
  disabled: bool.isRequired,
  message: string.isRequired,
};
