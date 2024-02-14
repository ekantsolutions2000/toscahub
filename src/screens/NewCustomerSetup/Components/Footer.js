import React, { Component } from "react";
import ToolTip from "./../../../components/Tooltip";

export default class Footer extends Component {
  render() {
    let {
      form,
      showClearButton,
      showBackButton,
      showCustomButton,
      customButtonText,
      continueButtonDisabled,
      isSubmit,
      clearButtonClick,
      clearBtnActive,
    } = this.props;

    return (
      <div className="tw-flex tw-justify-between">
        <div>
          {showBackButton ? (
            <button
              onClick={this.props.onBackButtonClick}
              className="tw-bg-tosca-blue hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-6 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500">
              Back
            </button>
          ) : null}
        </div>

        <div className="tw-flex">
          {showClearButton && (
            <button
              disabled={clearBtnActive}
              type="button"
              onClick={() => clearButtonClick()}
              className="tw-mr-4 tw-bg-gray-200 hover:tw-bg-gray-100 tw-text-gray-900 tw-font-bold tw-py-2 tw-px-10 tw-border tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500">
              Clear
            </button>
          )}
          {showCustomButton ? (
            <button
              type="button"
              onClick={this.props.onCustomButtonClick}
              className="tw-mr-4 tw-bg-white hover:tw-bg-gray-100 tw-text-gray-900 tw-font-bold tw-py-2 tw-px-4 tw-border tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500">
              {customButtonText}
            </button>
          ) : null}
          <button
            type="button"
            onClick={this.props.onSaveLaterButtonClick}
            className="tw-mr-4 tw-bg-white hover:tw-bg-gray-100 tw-text-gray-900 tw-font-bold tw-py-2 tw-px-4 tw-border tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500">
            Save For Later
          </button>

          <ToolTip
            content={form.formErrorMsg}
            disabled={form.isFormValid}
            config={{ arrow: false }}>
            <span>
              <button
                type="button"
                disabled={!form.isFormValid || continueButtonDisabled}
                onClick={this.props.onContinueButtonClick}
                className="tw-relative tw-bg-tosca-orange hover:tw-bg-tosca-orange-500 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500">
                {isSubmit ? "Submit" : "Continue"}
              </button>
            </span>
          </ToolTip>
        </div>
      </div>
    );
  }
}

Footer.defaultProps = {
  showClearButton: false,
  showBackButton: true,
  showCustomButton: false,
  customButtonText: "",
  continueButtonDisabled: false,
};
