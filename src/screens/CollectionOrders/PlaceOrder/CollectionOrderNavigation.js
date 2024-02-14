import React, { Component } from "react";

export class CollectionOrderNavigation extends Component {
  state = {
    steps: ["Basic Information", "Order Details", "Order Confirmation"],
  };

  validate = () => {
    console.log("Validating");
  };

  render() {
    const { steps } = { ...this.state };
    return (
      <div className="tw-flex tw-justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              onClick={(step) => this.props.gotoStep(index)}
              className={
                "tw-cursor-pointer tw-relative tw-h-12 tw-w-12 md:tw-h-16 md:tw-w-16 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xl " +
                (this.props.activeStep === index
                  ? "tw-bg-tosca-orange"
                  : "tw-bg-gray-500")
              }
            >
              <div>{index + 1}</div>
              <div
                className={`tw-absolute tw-bottom-0 tw-text-xs tw-whitespace-nowrap tw--mb-6 pl-30 pr-30 ${
                  index === 0 ? "tw-left-[1%] sm:tw-left-auto" : ""
                } ${
                  index === steps.length - 1
                    ? "tw-right-[1%] sm:tw-right-auto"
                    : ""
                }`}
              >
                {step}
              </div>
            </div>
            {steps.length !== index + 1 ? (
              <div className="tw-flex tw-items-center">
                <span className="tw-inline-block tw-h-1 tw-w-20 tw-bg-tosca-orange"></span>
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default CollectionOrderNavigation;
