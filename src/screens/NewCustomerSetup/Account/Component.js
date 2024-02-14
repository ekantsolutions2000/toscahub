import React, { Component } from "react";
import ToscaField from "./../../../components/FormControls/ToscaField";
import Footer from "./../Components/Footer";
import { sortfilter_icons } from "../../../images";
import Modal from "../../../components/Modal/SimpleModal";
import _ from "lodash";
// import logger from "redux-logger";
export default class AccountComponent extends Component {
  state = {
    fileName: "",
    showWarning: false,
    addressValidationShow: false,
    addressValidationResult: [],
    applicationInforRegions: [],
    zipFieldLableAi: "Zip Code",
    regionsLableAi: "State",
    billingInforRegions: [],
    zipFieldLableBi: "Zip Code",
    regionsLableBi: "State",
  };

  warningModelClose = () => {
    this.setState({
      showWarning: false,
    });
  };

  conformationYes = () => {
    this.navigateTo(this.props.activeItemIndex + 1);
  };

  conformationNo = () => {
    this.warningModelClose();
  };

  navigateTo = (step) => {
    if (step < 1 || this.props.form.isFormValid) this.props.navigateTo(step);
  };

  continue = async () => {
    const form = this.props.form;
    let addresses = [
      {
        country: form.aiCountry.value.code,
        addressKey: "AI",
        address1ine1: form.aiStreetAddressLine1.value,
        address1ine2: form.aiStreetAddressLine2.value,
        city: form.aiCity.value,
        state: form.aiState.value,
        zip5: form.aiZipCode.value,
        zip4: "",
      },
      {
        country: form.biCountry.value.code,
        addressKey: "BI",
        address1ine1: form.biStreetAddressLine1.value,
        address1ine2: form.biStreetAddressLine2.value,
        city: form.biCity.value,
        state: form.biState.value,
        zip5: form.biZipCode.value,
        zip4: "",
      },
    ];

    let promises = [];
    addresses.forEach((addressItem) => {
      if (addressItem.country === "US") {
        promises.push(this.props.getAddressValidation(addressItem));
      }
    });
    let result = await Promise.all(promises);

    if (result.find((item) => item.validate === false)) {
      this.setState({
        addressValidationShow: true,
        addressValidationResult: result.filter(
          (item) => item.validate === false,
        ),
      });
    } else {
      this.setState({
        addressValidationShow: false,
        addressValidationResult: [],
      });
      if (this.props.form.salesTaxExempt.value.value === "Yes") {
        _.isEqual(this.props.form.attachments.value, {})
          ? this.setState({ showWarning: true })
          : this.navigateTo(this.props.activeItemIndex + 1);
      } else {
        this.navigateTo(this.props.activeItemIndex + 1);
      }
    }
  };

  base64 = (file) => {
    return new Promise((resolve, reject) => {
      let base64 = "";
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        base64 = reader.result.split(",")[1];
        resolve(base64);
      };
    });
  };

  isFormEmpty = () => {
    let { form } = this.props;
    return form.biCompanyName.value === "" &&
      form.biStreetAddressLine1.value === "" &&
      form.biStreetAddressLine2.value === "" &&
      form.biCountry.value === "" &&
      form.biCity.value === "" &&
      form.biState.value === "" &&
      form.biZipCode.value === "" &&
      form.biFirstName.value === "" &&
      form.biLastName.value === "" &&
      form.biOfficcePhoneNumber.value === "" &&
      form.biMobileNumber.value === "" &&
      form.biFaxNumber.value === "" &&
      form.biEmail.value === "" &&
      form.biEmailForInvoice.value === "" &&
      form.aiCompanyName.value === "" &&
      form.aiStreetAddressLine1.value === "" &&
      form.aiStreetAddressLine2.value === "" &&
      form.aiCountry.value === "" &&
      form.aiCity.value === "" &&
      form.aiState.value === "" &&
      form.aiZipCode.value === "" &&
      form.aiFirstName.value === "" &&
      form.aiLastName.value === "" &&
      form.aiOfficePhoneNumber.value === "" &&
      form.aiMobileNumber.value === "" &&
      form.aiFaxNumber.value === "" &&
      form.aiEmail.value === "" &&
      form.aiEmailForInvoice.value === "" &&
      form.salesTaxExempt.value === "" &&
      form.TaxExemptCetificate.value === ""
      ? true
      : false;
  };

  aiCountryOnChange = async (option) => {
    let { form, onChangeCountry } = this.props;
    form.onChange("aiCountry", option);
    form.aiState.value = "";

    this.setState({
      applicationInforRegions: (await onChangeCountry(option.code)).data.data,
      zipFieldLableAi:
        option.code === "MX" || option.code === "CA"
          ? "Postal Code"
          : "Zip Code",
      regionsLableAi:
        option.code === "MX" || option.code === "CA" ? "Province" : "State",
    });
  };

  biCountryOnChange = async (option) => {
    let { form, onChangeCountry } = this.props;
    form.onChange("biCountry", option);
    form.biState.value = "";
    this.setState({
      billingInforRegions: (await onChangeCountry(option.code)).data.data,
      zipFieldLableBi:
        option.code === "MX" || option.code === "CA"
          ? "Postal Code"
          : "Zip Code",
      regionsLableBi:
        option.code === "MX" || option.code === "CA" ? "Province" : "State",
    });
  };

  componentDidUpdate = async () => {
    let { form, onChangeCountry } = this.props;

    if (
      form.aiCountry.value.code &&
      this.state.applicationInforRegions.length === 0
    ) {
      this.setState({
        applicationInforRegions: (
          await onChangeCountry(form.aiCountry.value.code)
        ).data.data,
        zipFieldLableAi:
          form.aiCountry.value.code === "MX" ||
          form.aiCountry.value.code === "CA"
            ? "Postal Code"
            : "Zip Code",
        regionsLableAi:
          form.aiCountry.value.code === "MX" ||
          form.aiCountry.value.code === "CA"
            ? "Province"
            : "State",
      });
    }

    if (
      form.biCountry.value.code &&
      this.state.billingInforRegions.length === 0
    ) {
      this.setState({
        billingInforRegions: (await onChangeCountry(form.biCountry.value.code))
          .data.data,
        zipFieldLableBi:
          form.biCountry.value.code === "MX" ||
          form.biCountry.value.code === "CA"
            ? "Postal Code"
            : "Zip Code",
        regionsLableBi:
          form.biCountry.value.code === "MX" ||
          form.biCountry.value.code === "CA"
            ? "Province"
            : "State",
      });
    }
  };

  render() {
    let { form } = this.props;

    if (form.sameAsAccountInfo.value) {
      form.biCompanyName.value = form.aiCompanyName.value;
      form.biStreetAddressLine1.value = form.aiStreetAddressLine1.value;
      form.biStreetAddressLine2.value = form.aiStreetAddressLine2.value;
      form.biCity.value = form.aiCity.value;
      form.biCountry.value = form.aiCountry.value;
      form.biState.value = form.aiState.value;
      form.biZipCode.value = form.aiZipCode.value;
      form.biFirstName.value = form.aiFirstName.value;
      form.biLastName.value = form.aiLastName.value;
      form.biOfficcePhoneNumber.value = form.aiOfficePhoneNumber.value;
      form.biMobileNumber.value = form.aiMobileNumber.value;
      form.biFaxNumber.value = form.aiFaxNumber.value;
      form.biEmail.value = form.aiEmail.value;
      form.biEmailForInvoice.value = form.aiEmailForInvoice.value;
    }

    return (
      <div>
        <Modal
          show={this.state.showWarning}
          modalClosed={this.warningModelClose}
          headerText="Warning Message !"
          modalStyle={{ width: "30%" }}
          modalHeaderStyle={{ backgroundColor: "#FF8B2A", color: "#FFF" }}
          outSideClick={true}
        >
          <div>
            <p className="msg-text">
              You have not uploaded the Tax Exemption Certificate. Do you wish
              to continue?
            </p>
            <div className="btn-wrapper">
              <button className="btn yes-btn" onClick={this.conformationYes}>
                Yes
              </button>
              <button className="btn no-btn" onClick={this.conformationNo}>
                No
              </button>
            </div>
          </div>
        </Modal>

        <div className="tw-w-1/2 tw-pr-4 tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
          <h4 className="tw-text-tosca-orange">Account Information</h4>

          <div className="tw-mb-6 tw-font-medium">
            <div>*Mandatory fields</div>
          </div>

          {/* A I Company Name */}
          <div className="tw-mb-4">
            <ToscaField
              name="aiCompanyName"
              value={form.aiCompanyName.value}
              label="Company Name: *"
              hasError={!form.aiCompanyName.isValid}
              errorMsg={form.aiCompanyName.errorMsg}
              onBlur={(e) => form.onBlur("aiCompanyName")}
              onChange={(e) =>
                this.props.form.onChange("aiCompanyName", e.target.value)
              }
              placeholder=""
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* A I Address */}
          <div className="tw-mb-4">
            <ToscaField
              name="aiStreetAddressLine1"
              value={form.aiStreetAddressLine1.value}
              label="Address: *"
              hasError={!form.aiStreetAddressLine1.isValid}
              errorMsg={form.aiStreetAddressLine1.errorMsg}
              onBlur={(e) => form.onBlur("aiStreetAddressLine1")}
              onChange={(e) =>
                this.props.form.onChange("aiStreetAddressLine1", e.target.value)
              }
              placeholder="Street Address Line 1"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>
          <div className="tw-mb-4">
            <ToscaField
              name="aiStreetAddressLine2"
              value={form.aiStreetAddressLine2.value}
              label=""
              hasError={!form.aiStreetAddressLine2.isValid}
              errorMsg={form.aiStreetAddressLine2.errorMsg}
              onBlur={(e) => form.onBlur("aiStreetAddressLine2")}
              onChange={(e) =>
                this.props.form.onChange("aiStreetAddressLine2", e.target.value)
              }
              placeholder="Street Address Line 2"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* A I Country */}
          <div className="tw-mb-4">
            <ToscaField
              elementType="reactselect"
              name="aiCountry"
              value={form.aiCountry.value}
              options={this.props.countries}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.code}
              label=""
              hasError={!form.aiCountry.isValid}
              errorMsg={form.aiCountry.errorMsg}
              onBlur={(e) => form.onBlur("aiCountry")}
              onChange={(option) => this.aiCountryOnChange(option)}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              placeholder="Country"
              isMulti={false}
            />
          </div>

          {/* A I City */}
          <div className="tw-mb-4 tw-w-4/12 tw-inline-block">
            <ToscaField
              name="aiCity"
              value={form.aiCity.value}
              label=""
              hasError={!form.aiCity.isValid}
              errorMsg={form.aiCity.errorMsg}
              onBlur={(e) => form.onBlur("aiCity")}
              onChange={(e) =>
                this.props.form.onChange("aiCity", e.target.value)
              }
              placeholder="City"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* A I State Code */}
          <div className="tw-mb-4 tw-w-5/12 tw-inline-block tw-pl-4 tw-pr-4">
            <ToscaField
              elementType="reactselect"
              name="aiState"
              value={form.aiState.value}
              options={this.state.applicationInforRegions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.code}
              label=""
              hasError={!form.aiState.isValid}
              errorMsg={form.aiState.errorMsg}
              onBlur={(e) => form.onBlur("aiState")}
              onChange={(option) => {
                form.onChange("aiState", option);
              }}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              placeholder={this.state.regionsLableAi}
              isMulti={false}
            />
          </div>

          {/* A I Zip Code */}
          <div className="tw-mb-4 tw-w-3/12 tw-inline-block">
            <ToscaField
              name="aiZipCode"
              value={form.aiZipCode.value}
              label=""
              hasError={!form.aiZipCode.isValid}
              errorMsg={form.aiZipCode.errorMsg}
              onBlur={(e) => form.onBlur("aiZipCode")}
              onChange={(e) =>
                this.props.form.onChange("aiZipCode", e.target.value)
              }
              placeholder={this.state.zipFieldLableAi}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {this.state.addressValidationResult.find(
            (item) => item.addressKey === "AI",
          ) &&
            this.state.addressValidationResult.find(
              (item) => item.validate === false,
            ) && (
              <div className="tw-mb-4">
                <div className="validation-error-popup">
                  {
                    this.state.addressValidationResult.find(
                      (item) => item.addressKey === "AI",
                    ).errorMsg
                  }
                </div>
              </div>
            )}

          {/* A I Contact Name */}
          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="aiFirstName"
              value={form.aiFirstName.value}
              label="Contact Name: *"
              hasError={!form.aiFirstName.isValid}
              errorMsg={form.aiFirstName.errorMsg}
              onBlur={(e) => form.onBlur("aiFirstName")}
              onChange={(e) =>
                this.props.form.onChange("aiFirstName", e.target.value)
              }
              placeholder="First Name"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>
          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pl-2">
            <ToscaField
              name="aiLastName"
              value={form.aiLastName.value}
              label=""
              hasError={!form.aiLastName.isValid}
              errorMsg={form.aiLastName.errorMsg}
              onBlur={(e) => form.onBlur("aiLastName")}
              onChange={(e) =>
                this.props.form.onChange("aiLastName", e.target.value)
              }
              placeholder="Last Name"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* A I contact Email */}
          <div className="tw-mb-4">
            <ToscaField
              name="aiEmail"
              value={form.aiEmail.value}
              label="Email: *"
              hasError={!form.aiEmail.isValid}
              errorMsg={form.aiEmail.errorMsg}
              onBlur={(e) => {
                form.aiEmail.rules = form.aiEmail.rulesOnBlur;
                form.onBlur("aiEmail");
              }}
              onChange={(e) => form.onChange("aiEmail", e.target.value)}
              placeholder="Email"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* A I contact Email for Receiving Invoice */}
          <div className="tw-mb-4">
            <ToscaField
              name="aiEmailForInvoice"
              value={form.aiEmailForInvoice.value}
              label="Email for Receiving Invoice: *"
              hasError={!form.aiEmailForInvoice.isValid}
              errorMsg={form.aiEmailForInvoice.errorMsg}
              onBlur={(e) => {
                form.aiEmailForInvoice.rules =
                  form.aiEmailForInvoice.rulesOnBlur;
                form.onBlur("aiEmailForInvoice");
              }}
              onChange={(e) =>
                form.onChange("aiEmailForInvoice", e.target.value)
              }
              placeholder="Email"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* A I Phone Number (office) */}
          <div>
            <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              {`Phone Number ( Office ): *`}
            </label>
          </div>
          <div className="tw-mb-4 tw-w-full tw-inline-block">
            <ToscaField
              elementType="input"
              inputType="number"
              name="aiOfficePhoneNumber"
              value={form.aiOfficePhoneNumber.value}
              label=""
              hasError={!form.aiOfficePhoneNumber.isValid}
              errorMsg={form.aiOfficePhoneNumber.errorMsg}
              onBlur={(e) => form.onBlur("aiOfficePhoneNumber")}
              onChange={(e) =>
                this.props.form.onChange("aiOfficePhoneNumber", e.target.value)
              }
              placeholder="Office Phone Number"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* A I Phone Number (Mobile) */}
          <div>
            <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              {`Phone Number ( Mobile ): *`}
            </label>
          </div>
          <div className="tw-mb-4 tw-w-full tw-inline-block">
            <ToscaField
              elementType="input"
              inputType="number"
              name="aiMobileNumber"
              value={form.aiMobileNumber.value}
              label=""
              hasError={!form.aiMobileNumber.isValid}
              errorMsg={form.aiMobileNumber.errorMsg}
              onBlur={(e) => form.onBlur("aiMobileNumber")}
              onChange={(e) =>
                this.props.form.onChange("aiMobileNumber", e.target.value)
              }
              placeholder="Mobile Number"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/*  A I Fax */}
          <div>
            <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              Fax Number:
            </label>
          </div>
          <div className="tw-mb-4 tw-w-full tw-inline-block">
            <ToscaField
              elementType="input"
              inputType="number"
              name="aiFaxNumber"
              value={form.aiFaxNumber.value}
              label=""
              hasError={!form.aiFaxNumber.isValid}
              errorMsg={form.aiFaxNumber.errorMsg}
              onBlur={(e) => form.onBlur("aiFaxNumber")}
              onChange={(e) =>
                this.props.form.onChange("aiFaxNumber", e.target.value)
              }
              placeholder="Fax Number"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>
        </div>

        <div className="tw-w-1/2 tw-pr-4 tw-inline-block  tw-pl-8 tw-pr-8 tw-border-l-2 tw-border-tosca-orange">
          <h4 className="tw-text-tosca-orange">Billing Information</h4>

          <div className="tw-mb-4">
            <ToscaField name="sameAsAccountInfo" label="">
              <input
                className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
                type="checkbox"
                checked={form.sameAsAccountInfo.value}
                onChange={(e) =>
                  this.props.form.onChange(
                    "sameAsAccountInfo",
                    e.target.checked,
                  )
                }
              />
              <label className="tw-pl-2 tw-pt-1 tw-align-middle leading-tight tw-h-5">
                Same as Account Information
              </label>
            </ToscaField>
          </div>

          {/* B I Company Name */}
          <div className="tw-mb-4">
            <ToscaField
              name="biCompanyName"
              value={form.biCompanyName.value}
              label="Company Name: *"
              hasError={!form.biCompanyName.isValid}
              errorMsg={form.biCompanyName.errorMsg}
              onBlur={(e) => form.onBlur("biCompanyName")}
              onChange={(e) =>
                this.props.form.onChange("biCompanyName", e.target.value)
              }
              placeholder=""
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* B I Address */}
          <div className="tw-mb-4">
            <ToscaField
              name="biStreetAddressLine1"
              value={form.biStreetAddressLine1.value}
              label="Address: *"
              hasError={!form.biStreetAddressLine1.isValid}
              errorMsg={form.biStreetAddressLine1.errorMsg}
              onBlur={(e) => form.onBlur("biStreetAddressLine1")}
              onChange={(e) =>
                this.props.form.onChange("biStreetAddressLine1", e.target.value)
              }
              placeholder="Street Address Line 1"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>
          <div className="tw-mb-4">
            <ToscaField
              name="biStreetAddressLine2"
              value={form.biStreetAddressLine2.value}
              label=""
              hasError={!form.biStreetAddressLine2.isValid}
              errorMsg={form.biStreetAddressLine2.errorMsg}
              onBlur={(e) => form.onBlur("biStreetAddressLine2")}
              onChange={(e) =>
                this.props.form.onChange("biStreetAddressLine2", e.target.value)
              }
              placeholder="Street Address Line 2"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* B I Country */}
          <div className="tw-mb-4">
            <ToscaField
              elementType="reactselect"
              name="biCountry"
              value={form.biCountry.value}
              options={this.props.countries}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.code}
              label=""
              hasError={!form.biCountry.isValid}
              errorMsg={form.biCountry.errorMsg}
              onBlur={(e) => form.onBlur("biCountry")}
              onChange={(option) => this.biCountryOnChange(option)}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              placeholder="Country"
              isMulti={false}
            />
          </div>

          {/* B I City */}
          <div className="tw-mb-4 tw-w-4/12 tw-inline-block">
            <ToscaField
              name="biCity"
              value={form.biCity.value}
              label=""
              hasError={!form.biCity.isValid}
              errorMsg={form.biCity.errorMsg}
              onBlur={(e) => form.onBlur("biCity")}
              onChange={(e) =>
                this.props.form.onChange("biCity", e.target.value)
              }
              placeholder="City"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* B I State Code */}
          <div className="tw-mb-4 tw-w-5/12 tw-inline-block tw-pl-4 tw-pr-4">
            <ToscaField
              elementType="reactselect"
              name="biState"
              value={form.biState.value}
              options={this.state.billingInforRegions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.code}
              label=""
              hasError={!form.biState.isValid}
              errorMsg={form.biState.errorMsg}
              onBlur={(e) => form.onBlur("biState")}
              onChange={(option) => {
                form.onChange("biState", option);
              }}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              placeholder={this.state.regionsLableBi}
              isMulti={false}
            />
          </div>

          {/* B I Zip Code */}
          <div className="tw-mb-4 tw-w-3/12 tw-inline-block">
            <ToscaField
              name="biZipCode"
              value={form.biZipCode.value}
              label=""
              hasError={!form.biZipCode.isValid}
              errorMsg={form.biZipCode.errorMsg}
              onBlur={(e) => form.onBlur("biZipCode")}
              onChange={(e) =>
                this.props.form.onChange("biZipCode", e.target.value)
              }
              placeholder={this.state.zipFieldLableBi}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {this.state.addressValidationResult.find(
            (item) => item.addressKey === "BI",
          ) &&
            this.state.addressValidationResult.find(
              (item) => item.validate === false,
            ) && (
              <div className="tw-mb-4">
                <div className="validation-error-popup">
                  {
                    this.state.addressValidationResult.find(
                      (item) => item.addressKey === "BI",
                    ).errorMsg
                  }
                </div>
              </div>
            )}

          {/* B I contact name */}
          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="biFirstName"
              value={form.biFirstName.value}
              label="Contact Name: *"
              hasError={!form.biFirstName.isValid}
              errorMsg={form.biFirstName.errorMsg}
              onBlur={(e) => form.onBlur("biFirstName")}
              onChange={(e) =>
                this.props.form.onChange("biFirstName", e.target.value)
              }
              placeholder="First Name"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>
          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pl-2">
            <ToscaField
              name="biLastName"
              value={form.biLastName.value}
              label=""
              hasError={!form.biLastName.isValid}
              errorMsg={form.biLastName.errorMsg}
              onBlur={(e) => form.onBlur("biLastName")}
              onChange={(e) =>
                this.props.form.onChange("biLastName", e.target.value)
              }
              placeholder="Last Name"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* B I contact Email */}
          <div className="tw-mb-4">
            <ToscaField
              name="biEmail"
              value={form.biEmail.value}
              label="Email: *"
              hasError={!form.biEmail.isValid}
              errorMsg={form.biEmail.errorMsg}
              onBlur={(e) => {
                form.biEmail.rules = form.biEmail.rulesOnBlur;
                form.onBlur("biEmail");
              }}
              onChange={(e) =>
                this.props.form.onChange("biEmail", e.target.value)
              }
              placeholder="Email"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* B I contact Email for Receiving Invoice */}
          <div className="tw-mb-4">
            <ToscaField
              name="biEmailForInvoice"
              value={form.biEmailForInvoice.value}
              label="Email for Receiving Invoice: *"
              hasError={!form.biEmailForInvoice.isValid}
              errorMsg={form.biEmailForInvoice.errorMsg}
              onBlur={(e) => {
                form.biEmailForInvoice.rules =
                  form.biEmailForInvoice.rulesOnBlur;
                form.onBlur("biEmailForInvoice");
              }}
              onChange={(e) =>
                form.onChange("biEmailForInvoice", e.target.value)
              }
              placeholder="Email"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* B I Phone Number (office) */}
          <div>
            <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              {`Phone Number ( Office ): *`}
            </label>
          </div>
          <div className="tw-mb-4 tw-w-full tw-inline-block ">
            <ToscaField
              elementType="input"
              inputType="number"
              name="biOfficcePhoneNumber"
              value={form.biOfficcePhoneNumber.value}
              label=""
              hasError={!form.biOfficcePhoneNumber.isValid}
              errorMsg={form.biOfficcePhoneNumber.errorMsg}
              onBlur={(e) => form.onBlur("biOfficcePhoneNumber")}
              onChange={(e) =>
                this.props.form.onChange("biOfficcePhoneNumber", e.target.value)
              }
              placeholder="Office Phone Number"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* B I Phone Number (mobile) */}
          <div>
            <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              {`Phone Number ( Mobile ): *`}
            </label>
          </div>
          <div className="tw-mb-4 tw-w-full tw-inline-block">
            <ToscaField
              elementType="input"
              inputType="number"
              name="biMobileNumber"
              value={form.biMobileNumber.value}
              label=""
              hasError={!form.biMobileNumber.isValid}
              errorMsg={form.biMobileNumber.errorMsg}
              onBlur={(e) => form.onBlur("biMobileNumber")}
              onChange={(e) =>
                this.props.form.onChange("biMobileNumber", e.target.value)
              }
              placeholder="Mobile Number"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* B I Fax Number */}
          <div>
            <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              Fax Number:
            </label>
          </div>
          <div className="tw-mb-4 tw-w-full tw-inline-block ">
            <ToscaField
              elementType="input"
              inputType="number"
              name="biFaxNumber"
              value={form.biFaxNumber.value}
              label=""
              hasError={!form.biFaxNumber.isValid}
              errorMsg={form.biFaxNumber.errorMsg}
              onBlur={(e) => form.onBlur("biFaxNumber")}
              onChange={(e) =>
                this.props.form.onChange("biFaxNumber", e.target.value)
              }
              placeholder="Fax Number"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {/* <div className="tw-mb-1 tw-w-9/12 tw-inline-block tw-align-top">
            <label htmlFor='single' className="tw-p-4 tw-cursor-pointer">
                            <img src={Upload} alt='Upload' />  Upload Forecast Sheet
                            <div className="tw-text-gray-700 tw-font-thin tw-pl-2 tw-italic">{this.state.fileName}</div>
                        </label>
            <div className="tw-hidden">
              <input
                type="file"
                id="single"
                onChange={(event) => {
                  if (event.target.files[0]) {
                    this.setState({
                      fileName: event.target.files[0].name,
                    });
                  } else {
                    this.setState({
                      fileName: "",
                    });
                  }
                }}
              />
            </div>
          </div> */}

          {/* B I Sales Text */}
          <h4 className="tw-text-tosca-orange">Tax Information</h4>

          <div>
            <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              Sales Tax Exempt (If YES - Provide Sales Tax Exempt Certificate):
            </label>
          </div>

          <div className="tw-mb-4 tw-w-3/12 tw-inline-block">
            <ToscaField
              elementType="reactselect"
              name="salesTaxExempt"
              value={form.salesTaxExempt.value}
              options={form.salesTaxExempt.options}
              label=""
              hasError={!form.salesTaxExempt.isValid}
              errorMsg={form.salesTaxExempt.errorMsg}
              onBlur={(e) => form.onBlur("salesTaxExempt")}
              onChange={(option) => {
                this.props.form.onChange("salesTaxExempt", option);
                if (option.value === "No") {
                  this.props.form.onChange("TaxExemptCetificate", {});
                  this.props.form.onChange("attachments", {});
                }
              }}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              placeholder="Yes/No"
            />
          </div>

          {form.salesTaxExempt.value.value === "Yes" && (
            <div className="tw-mb-4 tw-w-full tw-inline-block">
              <label
                htmlFor="single"
                className="tw-p-4 tw-cursor-pointer btn-file-upload"
              >
                <img src={sortfilter_icons.Upload} alt="Upload" /> Upload sales
                tax exemption certificate
                <div className="tw-text-gray-700 tw-font-thin tw-pl-2 tw-italic">
                  {form.attachments.value.name}
                </div>
              </label>
              <div className="tw-hidden">
                <input
                  type="file"
                  id="single"
                  onChange={async (event) => {
                    if (event.target.files[0]) {
                      this.props.form.onChange(
                        "TaxExemptCetificate",
                        event.target.files[0],
                      );

                      this.props.form.onChange("attachments", {
                        fileType: "application/pdf",
                        name: event.target.files[0].name,
                        content: await this.base64(event.target.files[0]),
                      });
                    } else {
                      this.props.form.onChange("TaxExemptCetificate", {});
                      this.props.form.onChange("attachments", {});
                    }
                  }}
                />
              </div>
            </div>
          )}

          {this.state.addressValidationShow && (
            <div className="tw-mb-4">
              <div className="validation-error-message">
                Address validation faild, Please review the address.
              </div>
            </div>
          )}
        </div>

        <Footer
          form={form}
          showBackButton={false}
          showClearButton={true}
          clearBtnActive={this.isFormEmpty()}
          clearButtonClick={() => this.props.form.clearData()}
          onContinueButtonClick={() => this.continue()}
          onSaveLaterButtonClick={this.props.onSaveLater}
        />
      </div>
    );
  }
}
