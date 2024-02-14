import React, { Component } from "react";
import PropTypes from "prop-types";
import Validator from "./../../utils/FieldValidation";

export class TextArea extends Component {
  onChangeHandler = (e) => {
    let val = e.target.value;
    let validation = Validator.validate(val, this.props.onChangeRules);

    if (val === "" || validation.success) {
      return this.props.onChange(e);
    }
  };

  isLengthExceeded = () => {
    return (
      this.props.maxLength > 0 && this.props.value.length > this.props.maxLength
    );
  };

  render() {
    let count = this.props.value.length;

    return (
      <React.Fragment>
        <div
          className={
            this.props.labelWrapperClass +
            (this.props.isVertical ? " md:tw-w-full " : "")
          }>
          <label className={this.props.labelClass}>{this.props.label}</label>
        </div>
        <div
          className={
            this.props.inputWrapperClass +
            (this.props.isVertical ? " md:tw-w-full " : "")
          }>
          <textarea
            rows={this.props.rows}
            name={this.props.name}
            value={this.props.value}
            disabled={this.props.disabled}
            onChange={(e) => this.onChangeHandler(e)}
            onBlur={(e) => this.props.onBlur(e)}
            placeholder={this.props.placeholder}
            className={
              this.props.inputClass +
              " " +
              (this.props.hasError ? "tw-border-red-500" : "")
            }
            type={this.props.type}
          />

          <div className="tw-flex tw-justify-between">
            <p className="tw-text-red-500 tw-text-xs tw-italic tw-mt-1 tw-mb-0 tw-text-left">
              {" "}
              {this.props.hasError ? this.props.errorMsg : ""}
            </p>

            <div className="tw-text-right">
              <small className="tw-font-light">
                {count} / {this.props.maxLength}
              </small>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

TextArea.propTypes = {
  onChange: PropTypes.func,
};

TextArea.defaultProps = {
  maxLength: 220,
  rows: 5,
  isVertical: false,
  type: "text",
  onChangeRules: "",
  hasError: false,
  errorMsg: "",
  placeholder: "Type here...",
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

export default TextArea;
