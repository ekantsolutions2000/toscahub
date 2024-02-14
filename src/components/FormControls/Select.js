import React, { Component } from "react";
import PropTypes from "prop-types";

export class Select extends Component {
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
          <div className={this.props.selectWrapperClass}>
            <select
              name={this.props.name}
              value={this.props.value}
              onChange={(e) => this.props.onChange(e)}
              onBlur={(e) => this.props.onBlur(e)}
              className={
                this.props.selectClass +
                " " +
                (this.props.hasError ? "tw-border-red-500" : "")
              }
              disabled={this.props.disabled}>
              <option key={-1} value="">
                {this.props.defaultSelectText}
              </option>
              {this.props.options.map((option, index) => (
                <option key={index} value={option[this.props.optionValue]}>
                  {option[this.props.optionDisplayLabel]}
                </option>
              ))}
            </select>
            <div className={this.props.svgWrapperClass}>
              <svg
                className={this.props.svgClass}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {this.props.hasError ? (
            <p className="tw-text-red-500 tw-text-xs tw-italic tw-mt-1 tw-mb-0 tw-text-left">
              {this.props.errorMsg}
            </p>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

Select.propTypes = {
  onChange: PropTypes.func,
};

Select.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  isVertical: false,
  option: [],
  optionValue: "id",
  optionDisplayLabel: "value",
  defaultSelectText: "Select an option",
  type: "text",
  onChangeRules: "",
  hasError: false,
  errorMsg: "",
  value: "",
  disabled: false,
  labelWrapperClass: "md:tw-w-1/3",
  labelClass:
    "tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4",
  label: "Label:",
  inputWrapperClass: "md:tw-w-2/3",
  selectWrapperClass: "tw-inline-block tw-relative tw-w-full",
  selectClass:
    "tw-block tw-appearance-none tw-w-full tw-bg-white tw-border tw-border-gray-400 hover:tw-border-gray-500 tw-px-4 tw-py-2 tw-pr-8 tw-rounded tw-shadow tw-leading-tight focus:tw-outline-none disabled:tw-bg-gray-200 disabled:tw-border-transparent",
  svgWrapperClass:
    "tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-px-2 tw-text-tosca-orange",
  svgClass: "tw-fill-current tw-h-4 tw-w-4",
};

export default Select;
