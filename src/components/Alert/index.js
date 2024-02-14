import React, { Component } from "react";

export class Alert extends Component {
  state = {
    _icons: {
      warning: {
        icon: (
          <svg
            className="tw-fill-current tw-h-6 tw-w-6 tw-text-orange-500 tw-mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
          </svg>
        ),
        colorClass: "tw-bg-orange-100 tw-border-orange-500 tw-text-orange-700",
      },
      info: {
        icon: (
          <svg
            className="tw-fill-current tw-h-6 tw-w-6 tw-text-blue-500 tw-mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
          </svg>
        ),
        colorClass: "tw-bg-blue-100 tw-border-blue-500 tw-text-blue-700",
      },
    },
  };

  getIcon = () => {
    if (this.props.customSvgIcon) return this.props.customSvgIcon;
    return this.state._icons[this.props.type].icon;
  };

  getColorClass = () => {
    if (this.props.colorClass) return this.props.colorClass;
    return this.state._icons[this.props.type].colorClass;
  };

  render() {
    let icon = this.getIcon();
    let colorClass = this.getColorClass();

    return (
      <React.Fragment>
        {this.props.show ? (
          <div className={" tw-border-l-4 tw-p-4 " + colorClass} role="alert">
            <div className="tw-flex tw-items-center">
              {icon}
              <p className="tw-m-0 tw-p-0">{this.props.msg}</p>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}
Alert.defaultProps = {
  meg: "Your message here!",
  customSvgIcon: null,
  type: "warning",
  colorClass: "tw-bg-orange-100 tw-border-orange-500 tw-text-orange-700",
  show: true,
};
export default Alert;
