import React, { Component } from "react";
import PropTypes from "prop-types";

export class TextBox extends Component {
  onChangeHandler = (e) => {
    return this.props.onChange(e);
  };

  render() {
    return (
      <React.Fragment>
        <div
          className={
            this.props.labelWrapperClass +
            (this.props.isVertical ? " md:tw-w-full " : "")
          }>
          <label
            className={
              this.props.labelClass +
              (this.props.isVertical ? " md:tw-mb-1 " : "")
            }>
            {this.props.label}
          </label>
        </div>
        <div
          className={
            this.props.inputWrapperClass +
            (this.props.isVertical ? " md:tw-w-full " : "")
          }>
          {this.props.children ? (
            this.props.children
          ) : (
            <React.Fragment>
              <input
                name={this.props.name}
                value={this.props.value}
                disabled={this.props.disabled}
                onChange={(e) => this.onChangeHandler(e)}
                onBlur={(e) => this.props.onBlur(e)}
                placeholder={this.props.placeholder}
                className={
                  this.props.inputClass +
                  " " +
                  (this.props.hasError ? "has-error" : "")
                }
                type={this.props.type}
              />
              {this.props.hasError ? (
                <p className="tw-text-red-500 tw-text-xs tw-italic tw-text-left tw-mt-1 tw-mb-0">
                  {this.props.errorMsg}
                </p>
              ) : null}
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

TextBox.propTypes = {
  onChange: PropTypes.func,
};

TextBox.defaultProps = {
  onBlur: () => {},
  isVertical: false,
  type: "text",
  onChangeRules: "",
  hasError: false,
  errorMsg: "",
  placeholder: "",
  value: "",
  disabled: false,
  labelWrapperClass: "md:tw-w-1/3",
  labelClass:
    "tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4",
  label: "Label:",
  inputWrapperClass: "md:tw-w-2/3",
  inputClass:
    "tw-bg-white tw-appearance-none tw-border-2 tw-border-gray-200 tw-rounded tw-w-full tw-py-2 tw-px-4 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-bg-white focus:tw-border-tosca-orange disabled:tw-bg-gray-200 disabled:tw-border-gray-200",
};

export default TextBox;
