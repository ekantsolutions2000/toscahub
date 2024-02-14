import React, { Component } from "react";

export class BreadCrumb extends Component {
  render() {
    let { components } = this.props;
    return (
      <div className="tw-flex tw-justify-center">
        {components.map((page, index) => (
          <React.Fragment key={index}>
            <div
              onClick={(page) => this.props.navigateTo(index)}
              className={
                "tw-cursor-pointer tw-relative tw-h-10 tw-w-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xl " +
                (this.props.activeIndex === index
                  ? "tw-bg-tosca-orange tw-border tw-border-transparent"
                  : "tw-bg-white tw-border tw-border-gray-800")
              }>
              <div>{index + 1}</div>
              <div className="tw-absolute tw-bottom-0 tw-text-xs tw-whitespace-nowrap tw--mb-12 tw-w-32 tw-whitespace-pre-line tw-text-center tw-h-full">
                {page.name}
              </div>
            </div>
            {components.length !== index + 1 ? (
              <div className="tw-flex tw-items-center">
                <span className="tw-inline-block tw-h-1 tw-w-32 tw-bg-tosca-orange"></span>
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default BreadCrumb;
