import React, { Component } from "react";
import Steps from "./CollectionOrderNavigation";
import TextBox from "../../../components/FormControls/TextBox";
import ToscaField from "../../../components/FormControls/ToscaField";
export class BasicInfo extends Component {
  state = {
    formName: "basic",
  };

  gotoStep = (step) => {
    if (this.props.form.isFormValid) {
      this.props.navigateTo(step);
    }
  };

  render() {
    let form = this.props.form;
    return (
      // <div className=" tw-bg-white tw-mx-auto tw-p-2 tw-p-4 tw-rounded tw-shadow-2xl md:tw-px-12">
      <div className=" tw-bg-white tw-mx-auto tw-p-2 tw-p-4 tw-rounded tw-shadow-2xl md:tw-px-12">
        <Steps gotoStep={(step) => this.gotoStep(step)} activeStep={0}></Steps>
        <div className="tw-mt-16">
          <div className="md:tw-flex md:tw-items-start tw-mb-6">
            <ToscaField
              elementType="input"
              name="companyName"
              label="Company Name:"
              disabled={true}
              value={form.companyName.value || ""}
              hasError={!form.companyName.isValid}
              errorMsg={form.companyName.errorMsg}
              onBlur={(e) => form.onBlur("companyName")}
              onChange={(e) => form.onChange("companyName", e.target.value)}
            />
          </div>

          <div className="md:tw-flex md:tw-items-strt tw-mb-6">
            <TextBox
              name="shipFromType"
              value={form.shipFromType.value}
              label="Ship From Type:"
              disabled={true}
              hasError={!form.shipFromType.isValid}
              errorMsg={form.shipFromType.errorMsg}
              onBlur={form.onChange}
              onChange={form.onBlur}
            />
          </div>

          <div className="md:tw-flex md:tw-items-start tw-mb-6">
            <ToscaField
              elementType="reactselect"
              name="shipFrom"
              label="Ship From:"
              options={form.shipFrom.options}
              value={form.shipFrom.value}
              hasError={!form.shipFrom.isValid}
              errorMsg={form.shipFrom.errorMsg}
              onChange={(option) => form.onChange("shipFrom", option)}
              onBlur={() => form.onBlur("shipFrom")}
              getOptionLabel={(option) => option.addressName}
              getOptionValue={(option) => option.addressId}
              isLoading={this.props.isLoadingAddresses}
            />
          </div>

          <div className="md:tw-flex md:tw-items-center tw-mb-6">
            <TextBox
              name="shipFromAddress"
              value={form.shipFromAddress.value}
              label="Ship From Address:"
              disabled={true}
              hasError={!form.shipFromAddress.isValid}
              errorMsg={form.shipFromAddress.errorMsg}
            />
          </div>

          <div className="md:tw-flex md:tw-items-center tw-mb-6">
            <TextBox
              name="contactPerson"
              value={form.contactPerson.value}
              label="Contact Person:"
              disabled={true}
            />
          </div>

          <div className="md:tw-flex md:tw-items-center tw-mb-6">
            <TextBox
              name="contactEmail"
              value={form.contactEmail.value}
              label="Contact Email:"
              disabled={true}
            />
          </div>

          <div className="md:tw-flex md:tw-items-center tw-mb-6">
            <TextBox
              name="contactPhone"
              value={form.contactPhone.value}
              label="Contact Phone:"
              disabled={true}
            />
          </div>
        </div>
        <div className="tw-flex tw-justify-end tw-mt-4">
          <button
            title={form.formErrorMsg}
            disabled={!form.isFormValid}
            onClick={() => this.gotoStep(1)}
            className="tw-relative tw-bg-tosca-blue hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
          >
            <span>Continue</span>
          </button>
        </div>
      </div>
    );
  }
}

export default BasicInfo;
