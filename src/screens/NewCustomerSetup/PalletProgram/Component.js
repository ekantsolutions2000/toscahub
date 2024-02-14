import React, { Component } from "react";
import ToscaField from "./../../../components/FormControls/ToscaField";
import Footer from "./../Components/Footer";
import _ from "lodash";

export default class PalletProgramComponent extends Component {
  navigateTo = (step) => {
    if (step < 1 || this.props.form.isFormValid) this.props.navigateTo(step);
  };

  isFormEmpty = () => {
    let { form } = this.props;
    return _.isEmpty(form.selectedPalletPrograms.value) &&
      form.otherValue.value === "" &&
      form.ChepValue.value === ""
      ? true
      : false;
  };

  formClearForm = () => {
    this.props.form.clearData();
    this.props.form.selectedPalletPrograms.value = [];
  };

  render() {
    let { form, activeItemIndex } = this.props;

    return (
      <div>
        <div className="tw-w-3/4 tw-pr-4 tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
          <h4 className="tw-text-tosca-orange">
            Are you on any of the following pallet programs? (check all that
            apply)
          </h4>
          {form.palletOptions.value.map((field, i) => (
            <div className="md:tw-flex md:tw-items-center tw-mb-6" key={i}>
              <ToscaField label={field.label}>
                <div className="tw-flex">
                  <div className="tw-mr-4">
                    <input
                      className="leading-tight tw-h-6 tw-w-6"
                      name={field.label}
                      type="checkbox"
                      checked={form[field.label].value}
                      onChange={(e) =>
                        form.onChange(field.label, e.target.checked)
                      }
                    />
                  </div>

                  {field.label === "Other" && form.Other.value ? (
                    // <input type="text" value="ssss"></input>
                    <ToscaField
                      name="otherValue"
                      value={form.otherValue.value}
                      showLabel={false}
                      onBlur={(e) => form.onBlur("otherValue")}
                      onChange={(e) =>
                        form.onChange("otherValue", e.target.value)
                      }
                      hasError={!form.otherValue.isValid}
                      errorMsg={form.otherValue.errorMsg}
                      placeholder="Enter Pallet Program"
                    />
                  ) : null}

                  {field.label === "Chep" && form.Chep.value ? (
                    <ToscaField
                      name="ChepValue"
                      value={form.ChepValue.value}
                      showLabel={false}
                      onBlur={(e) => form.onBlur("ChepValue")}
                      onChange={(e) =>
                        form.onChange("ChepValue", e.target.value)
                      }
                      hasError={!form.ChepValue.isValid}
                      errorMsg={form.ChepValue.errorMsg}
                      placeholder="Enter Code"
                    />
                  ) : null}
                </div>
              </ToscaField>
            </div>
          ))}
        </div>
        <Footer
          form={form}
          showBackButton={true}
          showClearButton={true}
          clearBtnActive={this.isFormEmpty()}
          clearButtonClick={this.formClearForm}
          onContinueButtonClick={() => this.navigateTo(activeItemIndex + 1)}
          onBackButtonClick={() => this.props.navigateTo(activeItemIndex - 1)}
          onSaveLaterButtonClick={this.props.onSaveLater}
        />
      </div>
    );
  }
}
