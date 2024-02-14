import React, { Component } from "react";
import { icons } from "../../images";
import { config } from "../../utils/conf";
import Tooltip from "../../components/Tooltip";

class TrackShipment extends Component {
  trackForm = React.createRef();

  submitForm = (e) => {
    e.preventDefault();
    if (!this.props.isActive) return;

    if (this.trackForm.current) {
      e.stopPropagation();
      this.trackForm.current.submit();
    }
  };

  getActionUrl = () => {
    return `${
      config.transplaceBaseUrl
    }/tracking/search?ts=${new Date().getTime().toString()}`;
  };

  render() {
    return (
      <div>
        <form
          ref={this.trackForm}
          method="POST"
          target="_blank"
          action={this.getActionUrl()}>
          <input
            type="hidden"
            name="reference"
            value={this.props.referenceNo}
          />
          <input
            type="hidden"
            name="auth-token"
            value={config.transplaceAuthToken}
          />
        </form>

        <Tooltip
          content={
            <div className="tw-font-light tw-text-sm">
              {!this.props.isActive
                ? this.props.inActiveHoverText
                : this.props.activeHoverText}
            </div>
          }
          disabled={false}
          config={{ arrow: false, theme: "light" }}>
          <div>
            <div
              onClick={this.submitForm}
              className={
                this.props.padding
                  ? "tw-bg-transparent tw-text-tosca-orange"
                  : "tw-p-2 tw-bg-transparent tw-text-tosca-orange"
              }>
              <img
                src={icons.van}
                alt={"Reference No: " + this.props.referenceNo}
                className="tw-w-8 tw-h-8"
                style={{
                  filter: !this.props.isActive ? "grayscale(1)" : "none",
                  width: this.props.width ? this.props.width : "",
                  height: this.props.height ? this.props.height : "",
                  padding: this.props.padding ? this.props.padding : "",
                }}
              />
            </div>
          </div>
        </Tooltip>
      </div>
    );
  }
}

TrackShipment.defaultProps = {
  isActive: true,
  activeHoverText: "Click to see shipping status.",
  inActiveHoverText: "Your order has not been shipped. Please check in later.",
  //inActiveHoverText: 'Transplace will deliver this feature by July 12th.'
};

export default TrackShipment;
