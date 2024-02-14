import React, { Component } from "react";
import ToscaField from "../../../components/FormControls/ToscaField";
import "../style.css";
import moment from "moment";

export default class CreditApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressValidationShow: false,
      addressValidationResult: [],
      afcRegions: [],
      zipFieldLableAfc: "Zip Code",
      regionsLableAfc: "State",

      afcTradeRegions: [],
      zipFieldLableafcTrade: "Zip Code",
      regionsLableafcTrade: "State",

      zipFieldLableafcBank: "Zip Code",

      afcPartnerRegions: [],
      zipFieldLableaafcPartner: "Zip Code",
      regionsLableaafcPartner: "State",
    };
  }

  AddPrincipals = async (e) => {
    e.preventDefault();
    const form = this.props.form;
    let addresses = [
      {
        country: form.afcPartnerCountry.value.code,
        addressKey: "AFCP",
        address1ine1: form.afcPartnerAddressLine1.value,
        address1ine2: form.afcPartnerAddressLine2.value,
        city: form.afcPartnerAddressLine2.value,
        state: "",
        zip5: form.afcPartnerZipCode.value,
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
      this.props.creditApplicationFormMethods.addNewPartner(form);
    }
  };

  AddTradeRef = async (e) => {
    e.preventDefault();
    const form = this.props.form;
    let addresses = [
      {
        country: form.afcTradeCountry.value.code,
        addressKey: "AFCT",
        address1ine1: form.afcTradeAddressLine1.value,
        address1ine2: form.afcTradeAddressLine2.value,
        city: form.afcTradeCity.value,
        state: form.afcTradeState.value,
        zip5: form.afcTradeZipCode.value,
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
      this.props.creditApplicationFormMethods.addNewTradeReferences(form);
    }
  };

  afcCountryOnChange = async (option) => {
    let { form, onChangeCountry } = this.props;
    form.onChange("afcCountry", option);
    form.afcState.value = "";

    this.setState({
      afcRegions: (await onChangeCountry(option.code)).data.data,
      zipFieldLableAfc:
        option.code === "MX" || option.code === "CA"
          ? "Postal Code"
          : "Zip Code",
      regionsLableAfc:
        option.code === "MX" || option.code === "CA" ? "Province" : "State",
    });
  };

  afcPartnerCountryOnChange = async (option) => {
    let { form, onChangeCountry } = this.props;
    form.onChange("afcPartnerCountry", option);
    form.afcPartnerState.value = "";

    this.setState({
      afcPartnerRegions: (await onChangeCountry(option.code)).data.data,
      zipFieldLableaafcPartner:
        option.code === "MX" || option.code === "CA"
          ? "Postal Code"
          : "Zip Code",
      regionsLableaafcPartner:
        option.code === "MX" || option.code === "CA" ? "Province" : "State",
    });
  };

  afcTradeCountryOnChange = async (option) => {
    let { form, onChangeCountry } = this.props;
    form.onChange("afcTradeCountry", option);
    form.afcTradeState.value = "";

    this.setState({
      afcTradeRegions: (await onChangeCountry(option.code)).data.data,
      zipFieldLableafcTrade:
        option.code === "MX" || option.code === "CA"
          ? "Postal Code"
          : "Zip Code",
      regionsLableafcTrade:
        option.code === "MX" || option.code === "CA" ? "Province" : "State",
    });
  };

  afcBankCountryOnChange = async (option) => {
    let { form } = this.props;
    form.onChange("afcBankCountry", option);

    this.setState({
      zipFieldLableafcBank:
        option.code === "MX" || option.code === "CA"
          ? "Postal Code"
          : "Zip Code",
    });
  };

  componentDidUpdate = async () => {
    let { form, onChangeCountry } = this.props;

    if (form.afcCountry.value.code && this.state.afcRegions.length === 0) {
      this.setState({
        afcRegions: (await onChangeCountry(form.afcCountry.value.code)).data
          .data,
        zipFieldLableAfc:
          form.afcCountry.value.code === "MX" ||
          form.afcCountry.value.code === "CA"
            ? "Postal Code"
            : "Zip Code",
        regionsLableAfc:
          form.afcCountry.value.code === "MX" ||
          form.afcCountry.value.code === "CA"
            ? "Province"
            : "State",
      });
    }

    if (
      form.afcPartnerCountry.value.code &&
      this.state.afcPartnerRegions.length === 0
    ) {
      this.setState({
        afcPartnerRegions: (
          await onChangeCountry(form.afcPartnerCountry.value.code)
        ).data.data,
        zipFieldLableaafcPartner:
          form.afcPartnerCountry.value.code === "MX" ||
          form.afcPartnerCountry.value.code === "CA"
            ? "Postal Code"
            : "Zip Code",
        regionsLableaafcPartner:
          form.afcPartnerCountry.value.code === "MX" ||
          form.afcPartnerCountry.value.code === "CA"
            ? "Province"
            : "State",

        //===================================
        zipFieldLableafcBank:
          form.afcBankCountry.value.code === "MX" ||
          form.afcBankCountry.value.code === "CA"
            ? "Postal Code"
            : "Zip Code",
      });
    }

    if (
      form.afcTradeCountry.value.code &&
      this.state.afcTradeRegions.length === 0
    ) {
      this.setState({
        afcTradeRegions: (
          await onChangeCountry(form.afcTradeCountry.value.code)
        ).data.data,
        zipFieldLableafcTrade:
          form.afcTradeCountry.value.code === "MX" ||
          form.afcTradeCountry.value.code === "CA"
            ? "Postal Code"
            : "Zip Code",
        regionsLableafcTrade:
          form.afcTradeCountry.value.code === "MX" ||
          form.afcTradeCountry.value.code === "CA"
            ? "Province"
            : "State",
      });
    }
  };
  render() {
    let { form } = this.props;

    return (
      <div className="tw-py-8">
        {/* Application top section */}
        <div className="tw-w-9/12 tw-pr-4 tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
          <div className="tw-mb-4 tw-w-4/12 tw-inline-block tw-pr-2">
            <ToscaField
              elementType="date"
              name="afcDateOfApp"
              value={
                form.afcDateOfApp.value ? moment(form.afcDateOfApp.value) : ""
              }
              label="Date of Application: *"
              hasError={!form.afcDateOfApp.isValid}
              errorMsg={form.afcDateOfApp.errorMsg}
              onBlur={(e) => form.onBlur("afcDateOfApp")}
              onChange={(date) => {
                form.onChange("afcDateOfApp", date);
                form.onChange(
                  "afcFormatedDateOfApp",
                  moment(date).format("MM/DD/yyyy"),
                );
              }}
              placeholder="From"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              datePickerConfig={{
                dateFormat: "MM/dd/yyyy",
                minDate: new Date(),
              }}
            />
          </div>

          <div className="tw-mb-4 tw-w-8/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="afcCompanyName"
              value={form.afcCompanyName.value}
              label="Name of Company or Individual Requesting Credit: *"
              hasError={!form.afcCompanyName.isValid}
              errorMsg={form.afcCompanyName.errorMsg}
              onBlur={(e) => form.onBlur("afcCompanyName")}
              onChange={(e) => form.onChange("afcCompanyName", e.target.value)}
              placeholder="Company Name"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4 tw-w-full tw-inline-block tw-pr-2">
            <ToscaField
              name="afcCorporateId"
              value={form.afcCorporateId.value}
              label="Corporate ID# / SS#: *"
              hasError={!form.afcCorporateId.isValid}
              errorMsg={form.afcCorporateId.errorMsg}
              onBlur={(e) => form.onBlur("afcCorporateId")}
              onChange={(e) => form.onChange("afcCorporateId", e.target.value)}
              placeholder="Corporate ID"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
            <ToscaField
              name="afcAddressLine1"
              value={form.afcAddressLine1.value}
              label="Address: *"
              hasError={!form.afcAddressLine1.isValid}
              errorMsg={form.afcAddressLine1.errorMsg}
              onBlur={(e) => form.onBlur("afcAddressLine1")}
              onChange={(e) => form.onChange("afcAddressLine1", e.target.value)}
              placeholder="Address Line 1"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>
          <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
            <ToscaField
              name="afcAddressLine2"
              value={form.afcAddressLine2.value}
              label=""
              hasError={!form.afcAddressLine2.isValid}
              errorMsg={form.afcAddressLine2.errorMsg}
              onBlur={(e) => form.onBlur("afcAddressLine2")}
              onChange={(e) => form.onChange("afcAddressLine2", e.target.value)}
              placeholder="Address Line 2"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4 tw-w-3/12 tw-inline-block tw-pr-2">
            <ToscaField
              elementType="reactselect"
              name="afcCountry"
              value={form.afcCountry.value}
              options={this.props.countries}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.code}
              label="Country: *"
              hasError={!form.afcCountry.isValid}
              errorMsg={form.afcCountry.errorMsg}
              onBlur={(e) => form.onBlur("afcCountry")}
              onChange={(option) => this.afcCountryOnChange(option)}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              placeholder="Country"
              isMulti={false}
            />
          </div>
          <div className="tw-mb-4 tw-w-3/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="afcCity"
              value={form.afcCity.value}
              label="City: *"
              hasError={!form.afcCity.isValid}
              errorMsg={form.afcCity.errorMsg}
              onBlur={(e) => form.onBlur("afcCity")}
              onChange={(e) => form.onChange("afcCity", e.target.value)}
              placeholder="City"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4 tw-w-3/12 tw-inline-block tw-pr-2">
            <ToscaField
              elementType="reactselect"
              name="afcState"
              value={form.afcState.value}
              options={this.state.afcRegions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.code}
              label={`${this.state.regionsLableAfc}: *`}
              hasError={!form.afcState.isValid}
              errorMsg={form.afcState.errorMsg}
              onBlur={(e) => form.onBlur("afcState")}
              onChange={(option) => {
                form.onChange("afcState", option);
              }}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              placeholder={this.state.regionsLableAfc}
              isMulti={false}
            />
          </div>

          <div className="tw-mb-4 tw-w-3/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="afcZipCode"
              value={form.afcZipCode.value}
              label={`${this.state.zipFieldLableAfc}: *`}
              hasError={!form.afcZipCode.isValid}
              errorMsg={form.afcZipCode.errorMsg}
              onBlur={(e) => form.onBlur("afcZipCode")}
              onChange={(e) => form.onChange("afcZipCode", e.target.value)}
              placeholder={this.state.zipFieldLableAfc}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          {this.props.addressValidationResult.find(
            (item) => item.addressKey === "AFC",
          ) &&
            this.props.addressValidationResult.find(
              (item) => item.validate === false,
            ) && (
              <div className="tw-mb-4">
                <div className="validation-error-popup">
                  {
                    this.props.addressValidationResult.find(
                      (item) => item.addressKey === "AFC",
                    ).errorMsg
                  }
                </div>
              </div>
            )}

          <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
            <ToscaField
              name="afcEmail"
              value={form.afcEmail.value}
              label="Email: *"
              hasError={!form.afcEmail.isValid}
              errorMsg={form.afcEmail.errorMsg}
              onBlur={(e) => {
                form.afcEmail.rules = form.afcEmail.rulesOnBlur;
                form.onBlur("afcEmail");
              }}
              onChange={(e) => form.onChange("afcEmail", e.target.value)}
              placeholder="Email"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
            <ToscaField
              name="afcWebSite"
              value={form.afcWebSite.value}
              label="Web Site: *"
              hasError={!form.afcWebSite.isValid}
              errorMsg={form.afcWebSite.errorMsg}
              onBlur={(e) => form.onBlur("afcWebSite")}
              onChange={(e) => form.onChange("afcWebSite", e.target.value)}
              placeholder="https://sample.comz/abc"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>
        </div>

        {/* Ownership section */}
        <>
          <hr className="toscaHr" />

          <div className="tw-w-full tw-pt-5 tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
            <h5>
              THE FOLLOWING INFORMATION MUST BE PROVIDED. IT WILL BE HELD IN
              CONFIDENCE. PLEASE COMPLETE ALL FIELDS.
            </h5>

            <h4 className="tw-mt-5 tw-mb-2 tw-text-tosca-orange tw-text-center tw-text-2xl">
              Ownership
            </h4>
          </div>

          <div className="tw-w-full tw-pr-4 tw-inline-block tw-pl-8 tw-align-top">
            <div className="tw-mt-5 tw-mb-4 tw-w-8/12 tw-inline-block fieldsGroups">
              <span className="title">Choose : *</span>

              <div className="tw-mb-4 tw-w-6/12 tw-inline-block">
                <ToscaField label="" name="afcCorporation">
                  <input
                    className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
                    type="checkbox"
                    checked={form.afcCorporation.value}
                    onChange={(e) => {
                      form.onChange("afcCorporation", true);
                      form.onChange("afcIncorporated", false);
                      form.onChange("afcPartnership", false);
                      form.onChange("afcIndividual", false);
                    }}
                  />
                  <label className="tw-pl-2 tw-pt-1 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                    : Corporation
                  </label>
                </ToscaField>
              </div>

              <div className="tw-mb-4 tw-w-6/12 tw-inline-block">
                <ToscaField label="" name="afcIncorporated">
                  <input
                    className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
                    type="checkbox"
                    checked={form.afcIncorporated.value}
                    onChange={(e) => {
                      form.onChange("afcIncorporated", true);
                      form.onChange("afcCorporation", false);
                      form.onChange("afcPartnership", false);
                      form.onChange("afcIndividual", false);
                    }}
                  />
                  <label className="tw-pl-2 tw-pt-1 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                    : Incorporated last 12 mo
                  </label>
                </ToscaField>
              </div>

              <div className="tw-mb-4 tw-w-6/12 tw-inline-block">
                <ToscaField label="" name="afcPartnership">
                  <input
                    className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
                    type="checkbox"
                    checked={form.afcPartnership.value}
                    onChange={(e) => {
                      form.onChange("afcPartnership", true);
                      form.onChange("afcIncorporated", false);
                      form.onChange("afcCorporation", false);
                      form.onChange("afcIndividual", false);
                    }}
                  />
                  <label className="tw-pl-2 tw-pt-1 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                    : Partnership
                  </label>
                </ToscaField>
              </div>

              <div className="tw-mb-4 tw-w-6/12 tw-inline-block">
                <ToscaField label="" name="afcIndividual">
                  <input
                    className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
                    type="checkbox"
                    checked={form.afcIndividual.value}
                    onChange={(e) => {
                      form.onChange("afcIndividual", true);
                      form.onChange("afcPartnership", false);
                      form.onChange("afcIncorporated", false);
                      form.onChange("afcCorporation", false);
                    }}
                  />
                  <label className="tw-pl-2 tw-pt-1 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                    : Individual
                  </label>
                </ToscaField>
              </div>
            </div>
          </div>

          <div
            className="tw-w-full tw-pr-4 tw-inline-block tw-pl-8 tw-align-top"
            style={{ display: "flex", alignItems: "center" }}
          >
            <form onSubmit={(e) => this.AddPrincipals(e)}>
              <div className="tw-mt-5 tw-mb-4 tw-w-9/12 tw-inline-block">
                <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcPartnerName"
                    value={form.afcPartnerName.value}
                    label="Name(s) or Principal(s): *"
                    hasError={!form.afcPartnerName.isValid}
                    errorMsg={form.afcPartnerName.errorMsg}
                    onBlur={(e) => form.onBlur("afcPartnerName")}
                    onChange={(e) =>
                      form.onChange("afcPartnerName", e.target.value)
                    }
                    placeholder="Name or Principal"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
                  <ToscaField
                    inputType="email"
                    pattern="[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
                    name="afcPartnerEmail"
                    value={form.afcPartnerEmail.value}
                    label="Email: *"
                    hasError={!form.afcPartnerEmail.isValid}
                    errorMsg={form.afcPartnerEmail.errorMsg}
                    onBlur={(e) => {
                      form.afcPartnerEmail.rules =
                        form.afcPartnerEmail.rulesOnBlur;
                      form.onBlur("afcPartnerEmail");
                    }}
                    onChange={(e) =>
                      form.onChange("afcPartnerEmail", e.target.value)
                    }
                    placeholder="sample@email.com"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcPartnerAddressLine1"
                    value={form.afcPartnerAddressLine1.value}
                    label="Address: *"
                    hasError={!form.afcPartnerAddressLine1.isValid}
                    errorMsg={form.afcPartnerAddressLine1.errorMsg}
                    onBlur={(e) => form.onBlur("afcPartnerAddressLine1")}
                    onChange={(e) =>
                      form.onChange("afcPartnerAddressLine1", e.target.value)
                    }
                    placeholder="Address Line 1"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcPartnerAddressLine2"
                    value={form.afcPartnerAddressLine2.value}
                    label="City: *"
                    hasError={!form.afcPartnerAddressLine2.isValid}
                    errorMsg={form.afcPartnerAddressLine2.errorMsg}
                    onBlur={(e) => form.onBlur("afcPartnerAddressLine2")}
                    onChange={(e) =>
                      form.onChange("afcPartnerAddressLine2", e.target.value)
                    }
                    placeholder="City"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                <div className="tw-mb-4 tw-w-4/12 tw-inline-block tw-pr-2">
                  <ToscaField
                    elementType="reactselect"
                    name="afcPartnerCountry"
                    value={form.afcPartnerCountry.value}
                    options={this.props.countries}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.code}
                    label="Country: *"
                    hasError={!form.afcPartnerCountry.isValid}
                    errorMsg={form.afcPartnerCountry.errorMsg}
                    onBlur={(e) => form.onBlur("afcPartnerCountry")}
                    onChange={(option) =>
                      this.afcPartnerCountryOnChange(option)
                    }
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                    placeholder="Country"
                    isMulti={false}
                  />
                </div>

                <div className="tw-mb-4 tw-w-4/12 tw-inline-block tw-pr-2">
                  <ToscaField
                    elementType="reactselect"
                    name="afcPartnerState"
                    value={form.afcPartnerState.value}
                    options={this.state.afcPartnerRegions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.code}
                    label={`${this.state.regionsLableaafcPartner}: *`}
                    hasError={!form.afcPartnerState.isValid}
                    errorMsg={form.afcPartnerState.errorMsg}
                    onBlur={(e) => form.onBlur("afcPartnerState")}
                    onChange={(option) => {
                      form.onChange("afcPartnerState", option);
                    }}
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                    placeholder={this.state.regionsLableaafcPartner}
                    isMulti={false}
                  />
                </div>

                <div className="tw-mb-4 tw-w-4/12 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcPartnerZipCode"
                    value={form.afcPartnerZipCode.value}
                    label={`${this.state.zipFieldLableaafcPartner}: *`}
                    hasError={!form.afcPartnerZipCode.isValid}
                    errorMsg={form.afcPartnerZipCode.errorMsg}
                    onBlur={(e) => form.onBlur("afcPartnerZipCode")}
                    onChange={(e) =>
                      form.onChange("afcPartnerZipCode", e.target.value)
                    }
                    placeholder={this.state.zipFieldLableaafcPartner}
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                {this.state.addressValidationResult.find(
                  (item) => item.addressKey === "AFCP",
                ) &&
                  this.state.addressValidationResult.find(
                    (item) => item.validate === false,
                  ) && (
                    <div className="tw-mb-4">
                      <div className="validation-error-popup">
                        {
                          this.state.addressValidationResult.find(
                            (item) => item.addressKey === "AFCP",
                          ).errorMsg
                        }
                      </div>
                    </div>
                  )}

                <div className="tw-mb-4 tw-w-1/2 tw-inline-block ">
                  <div>
                    <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
                      {`Phone Number: *`}
                    </label>
                  </div>

                  <div className="tw-mb-4 tw-w-full tw-inline-block ">
                    <ToscaField
                      inputType="number"
                      name="afcPartnerMobileNumber"
                      value={form.afcPartnerMobileNumber.value}
                      label=" "
                      hasError={!form.afcPartnerMobileNumber.isValid}
                      errorMsg={form.afcPartnerMobileNumber.errorMsg}
                      onBlur={(e) => form.onBlur("afcPartnerMobileNumber")}
                      onChange={(e) =>
                        form.onChange("afcPartnerMobileNumber", e.target.value)
                      }
                      placeholder="Phone Number"
                      labelWrapperClass="tw-mb-2"
                      inputWrapperClass=""
                    />
                  </div>
                </div>

                {/* <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-px-2 ">

                </div> */}

                <div className="tw-mb-4 tw-w-1/2 tw-inline-block ">
                  <div>
                    <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
                      {`Fax: *`}
                    </label>
                  </div>
                  <div className="tw-mb-4 tw-w-full tw-inline-block tw-px-2">
                    <ToscaField
                      inputType="number"
                      name="afcPartnerFaxNumber"
                      value={form.afcPartnerFaxNumber.value}
                      label=" "
                      hasError={!form.afcPartnerFaxNumber.isValid}
                      errorMsg={form.afcPartnerFaxNumber.errorMsg}
                      onBlur={(e) => form.onBlur("afcPartnerFaxNumber")}
                      onChange={(e) =>
                        form.onChange("afcPartnerFaxNumber", e.target.value)
                      }
                      placeholder="Fax Number"
                      labelWrapperClass="tw-mb-2"
                      inputWrapperClass=""
                    />
                  </div>
                </div>

                <div className="tw-mb-4 tw-w-full tw-inline-block tw-px-2">
                  <input
                    Type="submit"
                    value={"+ ADD"}
                    className={`btn-wonership ${
                      !this.props.creditApplicationFormMethods.isValidNewPartner(
                        form,
                      )
                        ? "btn-wonership-disable"
                        : ""
                    }`}
                    disabled={
                      !this.props.creditApplicationFormMethods.isValidNewPartner(
                        form,
                      )
                    }
                  />
                </div>
              </div>
            </form>
          </div>

          {form.afcPartnerartners.value.length > 0 && (
            <div className="tw-w-full tw-pr-4 tw-inline-block tw-pl-8 tw-align-top summury-table-wrapper">
              <table className="tw-min-w-full">
                <thead className="tw-pb-6">
                  <tr className="">
                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">
                        Name(s) / Principal(s)
                      </div>
                    </th>

                    <th
                      className="tw-px-3 tw-pt-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">
                        Complete Address
                      </div>
                    </th>

                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">Zip Code</div>
                    </th>

                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-center tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-px-1 tw-inline-block">
                        Email
                      </div>
                    </th>

                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">Phone</div>
                    </th>
                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">Fax</div>
                    </th>

                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block"></div>
                    </th>
                  </tr>
                </thead>

                <tbody className="tw-bg-white">
                  {form.afcPartnerartners.value &&
                    form.afcPartnerartners.value.map((partner, index) => (
                      <tr
                        key={index}
                        className="hover:tw-bg-tosca-alice-blue hover:tw-text-gray-900"
                      >
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {partner.name}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {partner.country} - {partner.state} -{" "}
                          {partner.address}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {partner.zipCode}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {partner.email}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {partner.phone}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {partner.fax}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          <button
                            className="btn-delete-summary"
                            onClick={() =>
                              this.props.creditApplicationFormMethods.removePartner(
                                partner.id,
                                form,
                              )
                            }
                          >
                            <span className="glyphicon glyphicon-remove" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>

        {/* Financial section */}
        <>
          <hr className="toscaHr" />

          <div className="tw-w-full tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
            <h4 className=" tw-mb-2 tw-text-tosca-orange tw-text-center tw-text-2xl">
              Financial
            </h4>
          </div>

          <div
            className="tw-w-full tw-pr-4 tw-inline-block tw-pl-8 tw-align-top"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="tw-mt-5 tw-mb-4 tw-w-9/12 tw-inline-block">
              <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
                <ToscaField
                  name="afcBankName"
                  value={form.afcBankName.value}
                  label="Bank Name: *"
                  hasError={!form.afcBankName.isValid}
                  errorMsg={form.afcBankName.errorMsg}
                  onBlur={(e) => form.onBlur("afcBankName")}
                  onChange={(e) => form.onChange("afcBankName", e.target.value)}
                  placeholder="Corporate ID"
                  labelWrapperClass="tw-mb-2"
                  inputWrapperClass=""
                />
              </div>

              <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
                <ToscaField
                  name="afcBankEmail"
                  value={form.afcBankEmail.value}
                  label="Email: *"
                  hasError={!form.afcBankEmail.isValid}
                  errorMsg={form.afcBankEmail.errorMsg}
                  onBlur={(e) => {
                    form.afcBankEmail.rules = form.afcBankEmail.rulesOnBlur;
                    form.onBlur("afcBankEmail");
                  }}
                  onChange={(e) =>
                    form.onChange("afcBankEmail", e.target.value)
                  }
                  placeholder="Email"
                  labelWrapperClass="tw-mb-2"
                  inputWrapperClass=""
                />
              </div>

              <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
                <ToscaField
                  name="afcBankAddressLine1"
                  value={form.afcBankAddressLine1.value}
                  label="Complete Bank Address: *"
                  hasError={!form.afcBankAddressLine1.isValid}
                  errorMsg={form.afcBankAddressLine1.errorMsg}
                  onBlur={(e) => form.onBlur("afcBankAddressLine1")}
                  onChange={(e) =>
                    form.onChange("afcBankAddressLine1", e.target.value)
                  }
                  placeholder="Address Line 1"
                  labelWrapperClass="tw-mb-2"
                  inputWrapperClass=""
                />
              </div>

              <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
                <ToscaField
                  name="afcBankAddressLine2"
                  value={form.afcBankAddressLine2.value}
                  label=""
                  hasError={!form.afcBankAddressLine2.isValid}
                  errorMsg={form.afcBankAddressLine2.errorMsg}
                  onBlur={(e) => form.onBlur("afcBankAddressLine2")}
                  onChange={(e) =>
                    form.onChange("afcBankAddressLine2", e.target.value)
                  }
                  placeholder="Address Line 2"
                  labelWrapperClass="tw-mb-2"
                  inputWrapperClass=""
                />
              </div>

              <div className="tw-mb-4 tw-w-4/12 tw-inline-block tw-pr-2">
                <ToscaField
                  elementType="reactselect"
                  name="afcBankCountry"
                  value={form.afcBankCountry.value}
                  options={this.props.countries}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.code}
                  label="Country: *"
                  hasError={!form.afcBankCountry.isValid}
                  errorMsg={form.afcBankCountry.errorMsg}
                  onBlur={(e) => form.onBlur("afcBankCountry")}
                  onChange={(option) => this.afcBankCountryOnChange(option)}
                  labelWrapperClass="tw-mb-2"
                  inputWrapperClass=""
                  placeholder="Country"
                  isMulti={false}
                />
              </div>

              <div className="tw-mb-4 tw-w-4/12 tw-inline-block tw-pr-2">
                <ToscaField
                  name="afcBankCity"
                  value={form.afcBankCity.value}
                  label="City: *"
                  hasError={!form.afcBankCity.isValid}
                  errorMsg={form.afcBankCity.errorMsg}
                  onBlur={(e) => form.onBlur("afcBankCity")}
                  onChange={(e) => form.onChange("afcBankCity", e.target.value)}
                  placeholder="City"
                  labelWrapperClass="tw-mb-2"
                  inputWrapperClass=""
                />
              </div>

              <div className="tw-mb-4 tw-w-4/12 tw-inline-block tw-pr-2">
                <ToscaField
                  name="afcBankZipCode"
                  value={form.afcBankZipCode.value}
                  label={`${this.state.zipFieldLableafcBank}: *`}
                  hasError={!form.afcBankZipCode.isValid}
                  errorMsg={form.afcBankZipCode.errorMsg}
                  onBlur={(e) => form.onBlur("afcBankZipCode")}
                  onChange={(e) =>
                    form.onChange("afcBankZipCode", e.target.value)
                  }
                  placeholder={this.state.zipFieldLableafcBank}
                  labelWrapperClass="tw-mb-2"
                  inputWrapperClass=""
                />
              </div>

              {this.props.addressValidationResult.find(
                (item) => item.addressKey === "AFCB",
              ) &&
                this.props.addressValidationResult.find(
                  (item) => item.validate === false,
                ) && (
                  <div className="tw-mb-4">
                    <div className="validation-error-popup">
                      {
                        this.props.addressValidationResult.find(
                          (item) => item.addressKey === "AFCB",
                        ).errorMsg
                      }
                    </div>
                  </div>
                )}

              <div className="tw-w-1/2 tw-inline-block">
                <div>
                  <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
                    {`Bank Officer, Department, or Contact: *`}
                  </label>
                </div>
                <div className="tw-mb-4 tw-w-full tw-inline-block ">
                  <ToscaField
                    inputType="number"
                    name="afcBankOffcerNumber"
                    value={form.afcBankOffcerNumber.value}
                    label=" "
                    hasError={!form.afcBankOffcerNumber.isValid}
                    errorMsg={form.afcBankOffcerNumber.errorMsg}
                    onBlur={(e) => form.onBlur("afcBankOffcerNumber")}
                    onChange={(e) =>
                      form.onChange("afcBankOffcerNumber", e.target.value)
                    }
                    placeholder="Phone Number"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>
              </div>

              <div className="tw-w-1/2 tw-inline-block">
                <div>
                  <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
                    {`Phone Number: *`}
                  </label>
                </div>
                <div className="tw-mb-4 tw-w-full tw-inline-block tw-px-2">
                  <ToscaField
                    inputType="number"
                    name="afcBankMobileNumber"
                    value={form.afcBankMobileNumber.value}
                    label=" "
                    hasError={!form.afcBankMobileNumber.isValid}
                    errorMsg={form.afcBankMobileNumber.errorMsg}
                    onBlur={(e) => form.onBlur("afcBankMobileNumber")}
                    onChange={(e) =>
                      form.onChange("afcBankMobileNumber", e.target.value)
                    }
                    placeholder="Phone Number"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>
              </div>

              <div className="tw-w-1/2 tw-inline-block">
                <div>
                  <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
                    {`Fax Number:`}
                  </label>
                </div>
                <div className="tw-mb-4 tw-w-full tw-inline-block">
                  <ToscaField
                    inputType="number"
                    name="afcBankFaxNumber"
                    value={form.afcBankFaxNumber.value}
                    label=" "
                    hasError={!form.afcBankFaxNumber.isValid}
                    errorMsg={form.afcBankFaxNumber.errorMsg}
                    onBlur={(e) => form.onBlur("afcBankFaxNumber")}
                    onChange={(e) =>
                      form.onChange("afcBankFaxNumber", e.target.value)
                    }
                    placeholder="Fax Number"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>
              </div>
            </div>
          </div>
        </>

        {/* Trade References section */}
        <>
          <hr className="toscaHr" />

          <div className="tw-w-full tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
            <h4 className=" tw-mb-2 tw-text-tosca-orange tw-text-center tw-text-2xl">
              Trade References (Please complete all fields)
            </h4>
          </div>

          <div
            className="tw-w-full tw-pr-4 tw-inline-block tw-pl-8 tw-align-top"
            style={{ display: "flex", alignItems: "center" }}
          >
            <form onSubmit={(e) => this.AddTradeRef(e)}>
              <div className="tw-mt-5 tw-mb-4 tw-w-9/12 tw-inline-block">
                <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcTradeBusinessName"
                    value={form.afcTradeBusinessName.value}
                    label="Business Name: *"
                    hasError={!form.afcTradeBusinessName.isValid}
                    errorMsg={form.afcTradeBusinessName.errorMsg}
                    onBlur={(e) => form.onBlur("afcTradeBusinessName")}
                    onChange={(e) =>
                      form.onChange("afcTradeBusinessName", e.target.value)
                    }
                    placeholder="Business Name"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcTradeEmail"
                    inputType="email"
                    pattern="[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
                    value={form.afcTradeEmail.value}
                    label="Email: *"
                    hasError={!form.afcTradeEmail.isValid}
                    errorMsg={form.afcTradeEmail.errorMsg}
                    onBlur={(e) => form.onBlur("afcTradeEmail")}
                    onChange={(e) =>
                      form.onChange("afcTradeEmail", e.target.value)
                    }
                    placeholder="sample@email.com"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcTradeAddressLine1"
                    value={form.afcTradeAddressLine1.value}
                    label="Address: *"
                    hasError={!form.afcTradeAddressLine1.isValid}
                    errorMsg={form.afcTradeAddressLine1.errorMsg}
                    onBlur={(e) => form.onBlur("afcTradeAddressLine1")}
                    onChange={(e) =>
                      form.onChange("afcTradeAddressLine1", e.target.value)
                    }
                    placeholder="Address Line 1"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcTradeAddressLine2"
                    value={form.afcTradeAddressLine2.value}
                    label=""
                    hasError={!form.afcTradeAddressLine2.isValid}
                    errorMsg={form.afcTradeAddressLine2.errorMsg}
                    onBlur={(e) => form.onBlur("afcTradeAddressLine2")}
                    onChange={(e) =>
                      form.onChange("afcTradeAddressLine2", e.target.value)
                    }
                    placeholder="Address Line 2"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                <div className="tw-mb-4 tw-w-3/12 tw-inline-block tw-pr-2">
                  <ToscaField
                    elementType="reactselect"
                    name="afcTradeCountry"
                    value={form.afcTradeCountry.value}
                    options={this.props.countries}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.code}
                    label="Country: *"
                    hasError={!form.afcTradeCountry.isValid}
                    errorMsg={form.afcTradeCountry.errorMsg}
                    onBlur={(e) => form.onBlur("afcTradeCountry")}
                    onChange={(option) => this.afcTradeCountryOnChange(option)}
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                    placeholder="Country"
                    isMulti={false}
                  />
                </div>

                <div className="tw-mb-4 tw-w-3/12 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcTradeCity"
                    value={form.afcTradeCity.value}
                    label="City: *"
                    hasError={!form.afcTradeCity.isValid}
                    errorMsg={form.afcTradeCity.errorMsg}
                    onBlur={(e) => form.onBlur("afcTradeCity")}
                    onChange={(e) =>
                      form.onChange("afcTradeCity", e.target.value)
                    }
                    placeholder="City"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                <div className="tw-mb-4 tw-w-3/12 tw-inline-block tw-pr-2">
                  <ToscaField
                    elementType="reactselect"
                    name="afcTradeState"
                    value={form.afcTradeState.value}
                    options={this.state.afcTradeRegions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.code}
                    label={`${this.state.regionsLableafcTrade}: *`}
                    hasError={!form.afcTradeState.isValid}
                    errorMsg={form.afcTradeState.errorMsg}
                    onBlur={(e) => form.onBlur("afcTradeState")}
                    onChange={(option) => {
                      form.onChange("afcTradeState", option);
                    }}
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                    placeholder={this.state.regionsLableafcTrade}
                    isMulti={false}
                  />
                </div>

                <div className="tw-mb-4 tw-w-3/12 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcTradeZipCode"
                    value={form.afcTradeZipCode.value}
                    label={`${this.state.zipFieldLableafcTrade}: *`}
                    hasError={!form.afcTradeZipCode.isValid}
                    errorMsg={form.afcTradeZipCode.errorMsg}
                    onBlur={(e) => form.onBlur("afcTradeZipCode")}
                    onChange={(e) =>
                      form.onChange("afcTradeZipCode", e.target.value)
                    }
                    placeholder={this.state.zipFieldLableafcTrade}
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                {this.state.addressValidationResult.find(
                  (item) => item.addressKey === "AFCT",
                ) &&
                  this.state.addressValidationResult.find(
                    (item) => item.validate === false,
                  ) && (
                    <div className="tw-mb-4">
                      <div className="validation-error-popup">
                        {
                          this.state.addressValidationResult.find(
                            (item) => item.addressKey === "AFCT",
                          ).errorMsg
                        }
                      </div>
                    </div>
                  )}

                <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcTradeFirstName"
                    value={form.afcTradeFirstName.value}
                    label="Contact Name: *"
                    hasError={!form.afcTradeFirstName.isValid}
                    errorMsg={form.afcTradeFirstName.errorMsg}
                    onBlur={(e) => form.onBlur("afcTradeFirstName")}
                    onChange={(e) =>
                      form.onChange("afcTradeFirstName", e.target.value)
                    }
                    placeholder="Fast Name"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                <div className="tw-mb-4 tw-w-1/2 tw-inline-block tw-pr-2">
                  <ToscaField
                    name="afcTradeLastName"
                    value={form.afcTradeLastName.value}
                    label=""
                    hasError={!form.afcTradeLastName.isValid}
                    errorMsg={form.afcTradeLastName.errorMsg}
                    onBlur={(e) => form.onBlur("afcTradeLastName")}
                    onChange={(e) =>
                      form.onChange("afcTradeLastName", e.target.value)
                    }
                    placeholder="Last Name"
                    labelWrapperClass="tw-mb-2"
                    inputWrapperClass=""
                  />
                </div>

                <div className="tw-w-1/2 tw-inline-block">
                  <div>
                    <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
                      {`Phone Number: *`}
                    </label>
                  </div>
                  <div className="tw-mb-4 tw-w-full tw-inline-block ">
                    <ToscaField
                      inputType="number"
                      name="afcTradeMobileNumber"
                      value={form.afcTradeMobileNumber.value}
                      label=" "
                      hasError={!form.afcTradeMobileNumber.isValid}
                      errorMsg={form.afcTradeMobileNumber.errorMsg}
                      onBlur={(e) => form.onBlur("afcTradeMobileNumber")}
                      onChange={(e) =>
                        form.onChange("afcTradeMobileNumber", e.target.value)
                      }
                      placeholder="Phone Number"
                      labelWrapperClass="tw-mb-2"
                      inputWrapperClass=""
                    />
                  </div>
                </div>

                <div className="tw-w-1/2 tw-inline-block">
                  <div>
                    <label class="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
                      {`Fax Number:`}
                    </label>
                  </div>
                  <div className="tw-mb-4 tw-w-full tw-inline-block tw-px-2">
                    <ToscaField
                      inputType="number"
                      name="afcTradeFaxNumber"
                      value={form.afcTradeFaxNumber.value}
                      label=" "
                      hasError={!form.afcTradeFaxNumber.isValid}
                      errorMsg={form.afcTradeFaxNumber.errorMsg}
                      onBlur={(e) => form.onBlur("afcTradeFaxNumber")}
                      onChange={(e) =>
                        form.onChange("afcTradeFaxNumber", e.target.value)
                      }
                      placeholder="Fax Number"
                      labelWrapperClass="tw-mb-2"
                      inputWrapperClass=""
                    />
                  </div>
                </div>

                <div className="tw-mb-4 tw-w-full tw-inline-block tw-px-2">
                  <input
                    Type="submit"
                    value={"+ ADD"}
                    className={`btn-wonership ${
                      !this.props.creditApplicationFormMethods.isValidNewTradeReferenc(
                        form,
                      )
                        ? "btn-wonership-disable"
                        : ""
                    }`}
                    disabled={
                      !this.props.creditApplicationFormMethods.isValidNewTradeReferenc(
                        form,
                      )
                    }
                  />
                </div>
              </div>
            </form>
          </div>

          {form.afcTradeReferences.value.length > 0 && (
            <div className="tw-w-full tw-pr-4 tw-inline-block tw-pl-8 tw-align-top summury-table-wrapper">
              <table className="tw-min-w-full">
                <thead className="tw-pb-6">
                  <tr className="">
                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">
                        Business Name
                      </div>
                    </th>

                    <th
                      className="tw-px-3 tw-pt-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">Address</div>
                    </th>

                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">City</div>
                    </th>

                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-center tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-px-1 tw-inline-block">
                        State
                      </div>
                    </th>

                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">Zip Code</div>
                    </th>
                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">
                        Contact name
                      </div>
                    </th>
                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">
                        Phone Number
                      </div>
                    </th>
                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">Fax Number</div>
                    </th>
                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block">Email</div>
                    </th>

                    <th
                      className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="tw-w-3/4 tw-inline-block"></div>
                    </th>
                  </tr>
                </thead>

                <tbody className="tw-bg-white">
                  {form.afcTradeReferences.value &&
                    form.afcTradeReferences.value.map((trade, index) => (
                      <tr
                        key={index}
                        className="hover:tw-bg-tosca-alice-blue hover:tw-text-gray-900"
                      >
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {trade.businessName}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {trade.country} - {trade.state} - {trade.address}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {trade.city}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {trade.tradeState}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {trade.zipCode}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {trade.contactName}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {trade.phone}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {trade.fax}
                        </td>
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {trade.email}
                        </td>

                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          <button
                            className="btn-delete-summary"
                            onClick={() =>
                              this.props.creditApplicationFormMethods.removeTradeReferences(
                                trade.id,
                                form,
                              )
                            }
                          >
                            <span className="glyphicon glyphicon-remove" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="tw-w-full tw-inline-block tw-pl-8 tw-pr-8 tw-align-top  tw-text-tosca-orange tw-mt-5">
            <h5 style={{ textAlign: "justify" }}>
              Please note that our processing of your information is subject to
              the Tosca privacy policy available at{" "}
              <a
                style={{ color: "#e66700" }}
                href="https://www.toscaltd.com/privacy-policy/"
                target="blanck"
              >
                TOSCA Privacy Policy
              </a>
              .
            </h5>
          </div>

          <div className="tw-w-full tw-inline-block tw-pl-8 tw-pr-8 tw-align-top tw-mt-2">
            <h5 style={{ textAlign: "justify" }}>
              We certify that all the information on this form is correct and
              accurate. We fully understand Tosca’s credit terms and agree to
              the proper and timely payment in consideration of extended credit.
              Tosca is hereby authorized to investigate the trade references
              listed above and contact our bank reference for completing the
              requested information. Applicant agrees to pay any collection
              costs incurred to collect the amount balance, including reasonable
              attorney's fees immediately upon Tosca’s request.
            </h5>
          </div>

          <div className="tw-w-full tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
            <div className="tw-mb-4 tw-w-4/12 tw-inline-block tw-pr-2">
              <ToscaField
                name="afcSignature"
                value={form.afcSignature.value}
                label="Signature : *"
                hasError={!form.afcSignature.isValid}
                errorMsg={form.afcSignature.errorMsg}
                onBlur={(e) => form.onBlur("afcSignature")}
                onChange={(e) => form.onChange("afcSignature", e.target.value)}
                placeholder="signature"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>

            <div className="tw-mb-4 tw-w-4/12 tw-inline-block tw-pr-2">
              <ToscaField
                name="afcTitle"
                value={form.afcTitle.value}
                label="Title: *"
                hasError={!form.afcTitle.isValid}
                errorMsg={form.afcTitle.errorMsg}
                onBlur={(e) => form.onBlur("afcTitle")}
                onChange={(e) => form.onChange("afcTitle", e.target.value)}
                placeholder="Title"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>

            <div className="tw-mb-4 tw-w-4/12 tw-inline-block tw-pr-2">
              <ToscaField
                elementType="date"
                name="afcDateOfApplied"
                value={
                  form.afcDateOfApplied.value
                    ? moment(form.afcDateOfApplied.value)
                    : ""
                }
                label="Date: *"
                hasError={!form.afcDateOfApplied.isValid}
                errorMsg={form.afcDateOfApplied.errorMsg}
                onBlur={(e) => form.onBlur("afcDateOfApplied")}
                onChange={(date) => {
                  form.onChange("afcDateOfApplied", date);
                  form.onChange(
                    "afcFormatedDateOfApplied",
                    moment(date).format("MM/DD/yyyy"),
                  );
                }}
                placeholder="From"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                datePickerConfig={{
                  dateFormat: "MM/dd/yyyy",
                  minDate: new Date(),
                }}
              />
            </div>
          </div>
        </>

        <>
          <hr className="toscaHr" />

          <div className="tw-w-full tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
            <h4 className=" tw-mb-2 tw-text-tosca-orange tw-text-center tw-text-2xl">
              PERSONAL GUARANTEE
            </h4>
          </div>
          <div className="tw-w-full tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
            <h5 style={{ textAlign: "justify" }}>
              In consideration of credit being extended by Tosca Services, LLC.
              to the above named applicant for merchandise to be purchased
              whether applicant be an individual or individuals, a
              proprietorship, a partnership, a corporation, or other entity, the
              undersigned guarantor or guarantors each hereby contract and
              guarantee to Tosca Services, LLC. the faithful payment, when due,
              of all accounts of said applicant for purchases made within five
              years after the date of this application. The undersigned
              guarantor or guarantors each hereby expressly waive all notice of
              acceptance of this guarantee, notice of extension of credit to
              applicant, presentment, and demand for payment on applicant,
              protest and notice to undersigned guarantor or guarantors of
              dishonor or default by applicant or with respect to any security
              held by Tosca Services, LLC. extension of time of payment to
              applicant, acceptance of partial payment or partial compromise,
              all other notices to which the undersigned guarantor or guarantors
              might otherwise be entitled and demand for payment under this
              guarantee. Any revocation of this agreement shall be in writing
              and delivered to Tosca Services, LLC., 1175 Peachtree Street NE,
              Suite 1900, Atlanta, GA 30361.
            </h5>
          </div>

          <div className="tw-w-full tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
              <ToscaField
                name="afcAplicantName"
                value={form.afcAplicantName.value}
                label="Name : *"
                hasError={!form.afcAplicantName.isValid}
                errorMsg={form.afcAplicantName.errorMsg}
                onBlur={(e) => form.onBlur("afcAplicantName")}
                onChange={(e) =>
                  form.onChange("afcAplicantName", e.target.value)
                }
                placeholder="Name"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>

            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
              <ToscaField
                name="afcSocialSecurityNumber"
                value={form.afcSocialSecurityNumber.value}
                label="International Tax Payer Id: "
                hasError={!form.afcSocialSecurityNumber.isValid}
                errorMsg={form.afcSocialSecurityNumber.errorMsg}
                onBlur={(e) => form.onBlur("afcSocialSecurityNumber")}
                onChange={(e) =>
                  form.onChange("afcSocialSecurityNumber", e.target.value)
                }
                placeholder="International Tax Payer Id"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>
          </div>

          <div className="tw-w-full tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
            {this.props.addressValidationShow && (
              <div className="validation-error-message">
                Address validation faild, Please review the address.
              </div>
            )}
          </div>
        </>
      </div>
    );
  }
}
