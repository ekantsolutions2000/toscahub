import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { now } from "moment";
import RSelect, { components } from "react-select";
import { pagination_icons } from "../../images";
import Tooltip from "../../components/Tooltip";
import _ from "lodash";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import moment from "moment";

const inputWrapperClass = ["md:tw-w-2/3", "tw-relative"];
const labelClass = [
  "tw-block",
  "tw-text-tosca-orange",
  "tw-font-bold",
  "tw-mb-1",
  "md:tw-mb-0",
  "tw-pr-4",
];
export class ToscaField extends Component {
  getInputWrapperClass = () => {
    if (typeof this.props.inputWrapperClass !== "function") {
      return this.props.inputWrapperClass;
    }

    return this.props.inputWrapperClass(inputWrapperClass).join(" ");
  };

  onChangeHandler = (e, type) => {
    let val = e;
    if (type === "datepicker") {
      val = moment(val).isValid ? moment(val) : null;
    }
    return this.props.onChange(val);
  };

  styleInputElement = () => {
    let result = {};
    if (this.props.leadingComponent) {
      result = { borderTopLeftRadius: "0", borderBottomLeftRadius: "0" };
    }

    if (
      this.props.styleElement.inputElement &&
      typeof this.props.styleElement.inputElement === "function"
    ) {
      result = this.props.styleElement.inputElement(result);
    }
    return result;
  };

  styleLeadingElement = () => {
    let result = {};
    if (
      this.props.styleElement.leadingElement &&
      typeof this.props.styleElement.leadingElement === "function"
    ) {
      result = this.props.styleElement.leadingElement(result);
    }
    return result;
  };

  onKeyPressHandler = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    let reg = /^\d+$/;
    if (!reg.test(keyValue)) {
      event.preventDefault();
    }
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  render() {
    let inputElement = null;
    let ref = this.props.innerRef;

    let defaultDatePickerConfig = {
      onSelect: () => {},
      minDat: now(),
      popperPlacement: "top-start",
      popperModifiers: [
        {
          name: "flip",
          enabled: true,
        },
        {
          name: "preventOverflow",
          enabled: true,
          options: {
            escapeWithReference: false,
          },
        },
      ],
    };

    let datePickerConfig = {
      ...defaultDatePickerConfig,
      ...this.props.datePickerConfig,
    };

    if (datePickerConfig.minDate) {
      datePickerConfig.minDate = new Date(datePickerConfig.minDate);
    }

    if (datePickerConfig.maxDate) {
      datePickerConfig.maxDate = new Date(datePickerConfig.maxDate);
    }

    if (datePickerConfig.onSelect) {
      let fn = datePickerConfig.onSelect;
      datePickerConfig.onSelect = (e) => {
        fn(moment(e));
      };
    }

    if (datePickerConfig.minTime) {
      datePickerConfig.minTime = new Date(datePickerConfig.minTime);
    }

    if (datePickerConfig.maxTime) {
      datePickerConfig.maxTime = new Date(datePickerConfig.maxTime);
    }

    switch (this.props.elementType) {
      case "input":
        inputElement = (
          <div className="tw-relative tw-flex">
            {this.props.leadingComponent ? (
              <span
                style={this.styleLeadingElement()}
                className="tw-bg-gray-400 tw-flex tw-items-center tw-px-3 tw-rounded-l tw-text-gray-600"
              >
                {this.props.leadingComponent}
              </span>
            ) : null}
            <span className="tw-flex-1">
              {this.props.inputType === "number" ? (
                <input
                  name={this.props.name}
                  value={this.props.value}
                  min={this.props.min}
                  max={this.props.max}
                  style={this.styleInputElement()}
                  ref={ref}
                  disabled={this.props.disabled}
                  onChange={(e) => this.onChangeHandler(e)}
                  onKeyPress={(e) => this.onKeyPressHandler(e)}
                  onBlur={(e) => this.props.onBlur(e)}
                  placeholder={this.props.placeholder}
                  className={
                    this.props.inputClass +
                    " " +
                    (this.props.hasError ? "has-error" : "")
                  }
                  type={this.props.inputType}
                />
              ) : (
                <input
                  name={this.props.name}
                  value={this.props.value}
                  pattern={this.props.pattern}
                  style={this.styleInputElement()}
                  ref={ref}
                  disabled={this.props.disabled}
                  onChange={(e) => this.onChangeHandler(e)}
                  onBlur={(e) => this.props.onBlur(e)}
                  placeholder={this.props.placeholder}
                  className={
                    this.props.inputClass +
                    " " +
                    (this.props.hasError ? "has-error" : "")
                  }
                  type={this.props.inputType}
                />
              )}
            </span>
          </div>
        );
        break;
      case "date":
        inputElement = (
          <div className={`tw-inline-block ${this.props.dateClass}`}>
            <DatePicker
              name={this.props.name}
              ref={ref}
              onChangeRaw={(e) => this.handleDateChangeRaw(e)}
              onChange={(e) => this.onChangeHandler(e, "datepicker")}
              onBlur={(e) => this.props.onBlur(e)}
              selected={this.props.value ? new Date(this.props.value) : null}
              className={
                this.props.inputClass +
                " " +
                (this.props.hasError ? "has-error" : "")
              }
              type={this.props.inputType}
              {...datePickerConfig}
            />
          </div>
        );
        break;
      case "reactselect":
        inputElement = (
          <div className="tw-relative tw-flex">
            {this.props.leadingComponent ? (
              <div
                className="tw-absolute tw-bg-transparent tw-flex tw-h-full tw-items-center tw-z-10"
                style={{ zIndex: "1", padding: "0.1rem" }}
              >
                <div
                  className="tw-bg-gray-400 tw-flex tw-h-full tw-items-center tw-px-4"
                  style={{
                    borderTopLeftRadius: "3px",
                    borderBottomLeftRadius: "3px",
                  }}
                >
                  {this.props.leadingComponent}
                </div>
              </div>
            ) : null}
            <div className="tw-flex-1">
              <div className="tw-inline-block tw-relative tw-w-full">
                <RSelect
                  className="react-select tw-block tw-appearance-none tw-w-full"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      paddingLeft: this.props.leadingComponent && "50px",
                      border:
                        this.props.hasError && this.props.errorMsg
                          ? "1px solid red"
                          : "1px solid rgba(126, 212,247,1)",
                    }),
                    indicatorSeparator: (provided, state) => ({
                      ...provided,
                      display: "none",
                    }),
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 41,
                    }),
                  }}
                  isDisabled={this.props.disabled}
                  backspaceRemovesValue={this.props.isMulti ? true : false}
                  components={{ DropdownIndicator }}
                  {...this.props}
                  ref={ref}
                />
              </div>
            </div>
          </div>
        );
        break;
      case "select":
        inputElement = (
          <div className={this.props.selectWrapperClass}>
            <select
              name={this.props.name}
              ref={ref}
              value={this.props.value}
              onChange={(e) => this.props.onChange(e)}
              onBlur={(e) => this.props.onBlur(e)}
              className={
                this.props.selectClass +
                " " +
                (this.props.hasError ? "tw-border-red-500" : "")
              }
              disabled={this.props.disabled}
            >
              <option key={-1} value="">
                {this.props.defaultSelectText}
              </option>
              {this.props.options.map((option, index) => (
                <option key={index} value={option[this.props.optionValue]}>
                  {option[this.props.optionDisplayValue]}
                </option>
              ))}
            </select>
            <div className={this.props.svgWrapperClass}>
              <svg
                className={this.props.svgClass}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        );
        break;
      case "country":
        inputElement = (
          <div className="tw-relative tw-flex">
            <CountryDropdown
              name={this.props.name}
              ref={ref}
              whitelist={this.props.whitelist}
              defaultOptionLabel={this.props.defaultOptionLabel}
              value={this.props.value}
              onChange={(e) => this.onChangeHandler(e)}
              onBlur={(e) => this.props.onBlur(e)}
              disabled={this.props.isDisabled}
              classes={
                !_.isEmpty(this.props.value)
                  ? this.props.inputClass
                  : this.props.countryRegionClass
              }
              style={
                this.props.hasError
                  ? { border: "1px solid #f56565" }
                  : { border: "1px solid #7ed4f7" }
              }
            />
            <div className={this.props.svgWrapperClass}>
              <img
                src={pagination_icons.DownArrow}
                alt="left arrow"
                width={20}
                height={20}
              />
            </div>
          </div>
        );
        break;
      case "region":
        inputElement = (
          <div className="tw-relative tw-flex">
            <RegionDropdown
              name={this.props.name}
              country={this.props.country}
              ref={ref}
              blacklist={{
                US: [
                  "Armed Forces Americas",
                  "Armed Forces Europe, Canada, Africa and Middle East",
                  "Armed Forces Pacific",
                ],
              }}
              blankOptionLabel={this.props.blankOptionLabel}
              defaultOptionLabel={this.props.defaultOptionLabel}
              value={this.props.value}
              labelType={this.props.labelType}
              valueType={this.props.valueType}
              onChange={(e) => this.onChangeHandler(e)}
              onBlur={(e) => this.props.onBlur(e)}
              classes={
                !_.isEmpty(this.props.value)
                  ? this.props.inputClass
                  : this.props.countryRegionClass
              }
              style={
                this.props.hasError
                  ? { border: "1px solid #f56565" }
                  : { border: "1px solid #7ed4f7" }
              }
            />
            <div className={this.props.svgWrapperClass}>
              <img
                src={pagination_icons.DownArrow}
                alt="left arrow"
                width={20}
                height={20}
              />
            </div>
          </div>
        );
        break;
      case "description":
        inputElement = (
          <div className="tw-relative tw-flex">
            <span className="tw-flex-1">
              <textarea
                name={this.props.name}
                value={this.props.value}
                onChange={(e) => this.onChangeHandler(e)}
                style={this.styleInputElement()}
                ref={ref}
                className={
                  this.props.descriptionClass + " " + this.props.elementClass
                }
                type={this.props.inputType}
              />
            </span>
          </div>
        );
        break;
      default:
        inputElement = <input></input>;
    }

    return (
      <React.Fragment>
        {this.props.showLabel ? (
          <div
            className={
              (this.props.isVertical
                ? this.props.labelWrapperClass
                    .split(" ")
                    .filter((x) => !x.includes("md:tw-w"))
                    .join(" ")
                : this.props.labelWrapperClass) +
              (this.props.isVertical ? " md:tw-w-full " : "")
            }
          >
            <label
              className={
                this.props.labelClass(labelClass).join(" ") +
                (this.props.isVertical ? " md:tw-mb-1 " : "")
              }
            >
              {this.props.label}
            </label>
          </div>
        ) : null}

        <div
          className={
            (this.props.isVertical
              ? this.getInputWrapperClass()
                  .split(" ")
                  .filter((x) => !x.includes("md:tw-w"))
                  .join(" ")
              : this.getInputWrapperClass()) +
            (this.props.isVertical ? " md:tw-w-full " : "")
          }
        >
          <React.Fragment>
            <Tooltip
              content={this.props.errorMsg}
              show={this.props.errorMsg && this.props.hasError}
              config={{
                zIndex: "unset",
                theme: "error",
                trigger: "manual",
                hideOnClick: false,
                placement: "top-end",
                ...this.props.tippyConfig,
              }}
            >
              <div>
                {this.props.children ? this.props.children : inputElement}
              </div>
            </Tooltip>
          </React.Fragment>
        </div>
      </React.Fragment>
    );
  }
}

ToscaField.propTypes = {
  onChange: PropTypes.func,
};

ToscaField.defaultProps = {
  onChange: () => {},
  styleElement: {},
  leadingComponent: null,
  showLabel: true,
  elementType: "input",
  option: [],
  optionValue: "value",
  optionDisplayValue: "displayValue",
  defaultSelectText: "Select an option",
  onBlur: () => {},
  isVertical: false,
  inputType: "text",
  onChangeRules: "",
  hasError: false,
  errorMsg: "",
  placeholder: undefined,
  value: "",
  disabled: false,
  labelWrapperClass: "md:tw-w-1/3 ",
  // labelClass: 'tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4',
  labelClass: (provided) => provided,
  label: "Label:",
  // inputWrapperClass: 'md:tw-w-2/3 tw-relative',
  inputWrapperClass: (provided) => {
    return provided;
  },
  inputClass:
    " tw-placeholder-gray-500 tw-bg-white tw-appearance-none tw-border-2 tw-border-gray-200 tw-rounded tw-w-full tw-py-2 tw-px-4 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-bg-white focus:tw-border-tosca-orange disabled:tw-bg-gray-200 disabled:tw-border-gray-200",
  descriptionClass:
    " tw-placeholder-gray-500 tw-appearance-none tw-border-2 tw-border-gray-200 tw-rounded tw-w-full tw-py-2 tw-px-4 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-bg-white focus:tw-border-tosca-orange disabled:tw-bg-gray-200 disabled:tw-border-gray-200 tw-bg-tosca-gray-light tw-font-light",
  selectClass:
    "tw-block tw-appearance-none tw-w-full tw-bg-white tw-border tw-border-gray-400 hover:tw-border-gray-500 tw-px-4 tw-py-2 tw-pr-8 tw-rounded tw-shadow tw-leading-tight focus:tw-outline-none disabled:tw-bg-gray-200 disabled:tw-border-transparent",
  selectWrapperClass: "tw-inline-block tw-relative tw-w-full",
  svgWrapperClass:
    "tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-px-2 tw-text-tosca-orange",
  svgClass: "tw-fill-current tw-h-4 tw-w-4",
  countryRegionClass:
    " country-options tw-placeholder-gray-500 tw-bg-white tw-appearance-none tw-border-2 tw-border-gray-200 tw-rounded tw-w-full tw-py-2 tw-px-4 tw-text-gray-500 tw-leading-tight focus:tw-outline-none focus:tw-bg-white focus:tw-border-tosca-orange disabled:tw-bg-gray-200 disabled:tw-border-gray-200",
  datePickerConfig: {
    onSelect: () => {},
    minDat: now(),
    popperPlacement: "bottom-start",
    popperModifiers: [
      {
        name: "flip",
        enabled: true,
      },
      {
        name: "preventOverflow",
        enabled: true,
        options: {
          escapeWithReference: false,
        },
      },
    ],
  },
};

const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <img
          src={pagination_icons.DownArrow}
          alt="left arrow"
          width={20}
          height={20}
        />
      </components.DropdownIndicator>
    )
  );
};

export default React.forwardRef((props, ref) => (
  <ToscaField innerRef={ref} {...props} />
));
