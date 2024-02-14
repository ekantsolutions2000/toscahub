import React, { Component } from "react";
import ToscaField from "./../../../components/FormControls/ToscaField";
import Moment from "moment";
import HoursRow from "./HoursRow";

export default class CustomsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressValidationShow: false,
      addressValidationResult: [],
      borkerInforRegions: [],
      zipFieldLableCbi: "Zip Code",
      regionsLableCbi: "State",
    };
  }
  save = async (addNew, id) => {
    const form = this.props.form;

    if (this.props.shipingCountry.name === "Mexico") {
      if (form.eeuCountry.value === "United States") {
        let addresses = [
          {
            addressKey: "CIM",
            address1ine1: form.eeuStreetAddressLine1.value,
            address1ine2: form.eeuStreetAddressLine2.value,
            city: form.eeuCity.value,
            state: form.eeuState.value,
            zip5: form.eeuZipCode.value,
            zip4: "",
          },
        ];

        let promises = [];

        addresses.forEach((addressItem) => {
          promises.push(this.props.getAddressValidation(addressItem));
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
          this.props.onSaveButtonClick(addNew, id, form);
        }
      } else {
        this.props.onSaveButtonClick(addNew, id, form);
      }
    } else {
      this.props.onSaveButtonClick(addNew, id, form);
    }
  };

  handleExportOnlyMexico = () => {
    if (this.props.form.cbiCountry.value.code !== "MX") {
      this.props.form.eeuFirstName.rules = "";
      this.props.form.eeuLastName.rules = "";
      this.props.form.eeuStreetAddressLine1.rules = "";
      this.props.form.eeuStreetAddressLine2.rules = "";
      this.props.form.eeuCity.rules = "";
      this.props.form.eeuCountry.rules = "";
      this.props.form.eeuState.rules = "";
      this.props.form.eeuZipCode.rules = "";
      this.props.form.eeuCountryCode.rules = "";
      this.props.form.eeuContactFirstName.rules = "";
      this.props.form.eeuContactLastName.rules = "";
      this.props.form.eeuPhoneNumber.rules = "";
      this.props.form.eeuEmail.rules = "";

      this.props.form.eeuFirstName.value = "";
      this.props.form.eeuLastName.value = "";
      this.props.form.eeuStreetAddressLine1.value = "";
      this.props.form.eeuStreetAddressLine2.value = "";
      this.props.form.eeuCity.value = "";
      this.props.form.eeuCountry.value = "";
      this.props.form.eeuState.value = "";
      this.props.form.eeuZipCode.value = "";
      this.props.form.eeuCountryCode.value = "";
      this.props.form.eeuContactFirstName.value = "";
      this.props.form.eeuContactLastName.value = "";
      this.props.form.eeuPhoneNumber.value = "";
      this.props.form.eeuEmail.value = "";
    } else {
      this.props.form.eeuFirstName.rules = "required";
      this.props.form.eeuLastName.rules = "required";
      this.props.form.eeuStreetAddressLine1.rules = "required";
      this.props.form.eeuStreetAddressLine2.rules = "";
      this.props.form.eeuCity.rules = "required";
      this.props.form.eeuCountry.value = "Mexico";
      this.props.form.eeuCountry.rules = "required";
      this.props.form.eeuState.rules = "required";
      this.props.form.eeuZipCode.rules = "required|minLen:2|maxLen:10";
      this.props.form.eeuCountryCode.rules =
        "required|number|minLen:2|maxLen:4";
      this.props.form.eeuContactFirstName.rules = "required";
      this.props.form.eeuContactLastName.rules = "required";
      this.props.form.eeuPhoneNumber.rules =
        "required|number|minLen:2|maxLen:15";
      this.props.form.eeuEmail.rules = "required|email";
    }
  };

  cbiCountryOnChange = async (option) => {
    let { form, onChangeCountry } = this.props;
    form.onChange("cbiCountry", option);
    form.cbiState.value = "";
    form.eeuCountry.value = "Mexico";
    this.handleExportOnlyMexico();

    this.setState({
      borkerInforRegions: (await onChangeCountry(option.code)).data.data,
      zipFieldLableCbi:
        option.code === "MX" || option.code === "CA"
          ? "Postal Code"
          : "Zip Code",
      regionsLableCbi:
        option.code === "MX" || option.code === "CA" ? "Province" : "State",
    });
  };

  render() {
    let { form } = this.props;

    // console.log("broker details ----- > ",form);

    return (
      <div className="tw-my-8 tw-py-8 tw-border">
        <div className="tw-w-1/2 tw-pr-4 tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
          <h4 className="tw-text-tosca-orange">Customs Broker Information</h4>

          <div className="tw-mb-4 tw-w-full tw-inline-block tw-pr-2">
            <ToscaField
              name="cbiBrokerCompanyName"
              value={form.cbiBrokerCompanyName.value}
              label="Broker Company Name: *"
              hasError={!form.cbiBrokerCompanyName.isValid}
              errorMsg={form.cbiBrokerCompanyName.errorMsg}
              onBlur={(e) => form.onBlur("cbiBrokerCompanyName")}
              onChange={(e) =>
                form.onChange("cbiBrokerCompanyName", e.target.value)
              }
              placeholder="Company Name"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4">
            <ToscaField
              name="cbiBrokerAddressLine1"
              value={form.cbiBrokerAddressLine1.value}
              label="Broker Physical Address : *"
              hasError={!form.cbiBrokerAddressLine1.isValid}
              errorMsg={form.cbiBrokerAddressLine1.errorMsg}
              onBlur={(e) => form.onBlur("cbiBrokerAddressLine1")}
              onChange={(e) =>
                form.onChange("cbiBrokerAddressLine1", e.target.value)
              }
              placeholder="Street Address Line 1"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4">
            <ToscaField
              name="cbiBrokerAddressLine2"
              value={form.cbiBrokerAddressLine2.value}
              label=""
              hasError={!form.cbiBrokerAddressLine2.isValid}
              errorMsg={form.cbiBrokerAddressLine2.errorMsg}
              onBlur={(e) => form.onBlur("cbiBrokerAddressLine2")}
              onChange={(e) =>
                form.onChange("cbiBrokerAddressLine2", e.target.value)
              }
              placeholder="Street Address Line 2"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="cbiCity"
              value={form.cbiCity.value}
              label=""
              hasError={!form.cbiCity.isValid}
              errorMsg={form.cbiCity.errorMsg}
              onBlur={(e) => form.onBlur("cbiCity")}
              onChange={(e) => form.onChange("cbiCity", e.target.value)}
              placeholder="City"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="cbiZipCode"
              value={form.cbiZipCode.value}
              label=""
              hasError={!form.cbiZipCode.isValid}
              errorMsg={form.cbiZipCode.errorMsg}
              onBlur={(e) => form.onBlur("cbiZipCode")}
              onChange={(e) => form.onChange("cbiZipCode", e.target.value)}
              placeholder={this.state.zipFieldLableCbi}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
            <ToscaField
              elementType="reactselect"
              name="cbiCountry"
              value={form.cbiCountry.value}
              options={this.props.countries}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.code}
              label=""
              hasError={!form.cbiCountry.isValid}
              errorMsg={form.cbiCountry.errorMsg}
              onBlur={(e) => form.onBlur("cbiCountry")}
              onChange={(option) => this.cbiCountryOnChange(option)}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              placeholder="Country"
              isMulti={false}
            />
          </div>

          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
            <ToscaField
              elementType="reactselect"
              name="cbiState"
              value={form.cbiState.value}
              options={this.state.borkerInforRegions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.code}
              label=""
              hasError={!form.cbiState.isValid}
              errorMsg={form.cbiState.errorMsg}
              onBlur={(e) => form.onBlur("cbiState")}
              onChange={(option) => {
                form.onChange("cbiState", option);
              }}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              placeholder={this.state.regionsLableCbi}
              isMulti={false}
            />
          </div>

          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="cbiBrokerFirstName"
              value={form.cbiBrokerFirstName.value}
              label="Broker Contact Name: *"
              hasError={!form.cbiBrokerFirstName.isValid}
              errorMsg={form.cbiBrokerFirstName.errorMsg}
              onBlur={(e) => form.onBlur("cbiBrokerFirstName")}
              onChange={(e) =>
                form.onChange("cbiBrokerFirstName", e.target.value)
              }
              placeholder="First Name"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>
          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pl-2">
            <ToscaField
              name="cbiBrokerLastName"
              value={form.cbiBrokerLastName.value}
              label=" "
              hasError={!form.cbiBrokerLastName.isValid}
              errorMsg={form.cbiBrokerLastName.errorMsg}
              onBlur={(e) => form.onBlur("cbiBrokerLastName")}
              onChange={(e) =>
                form.onChange("cbiBrokerLastName", e.target.value)
              }
              placeholder="Last Name"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4">
            <ToscaField
              name="cbiEmcbil"
              value={form.cbiEmail.value}
              label="Broker Email: *"
              hasError={!form.cbiEmail.isValid}
              errorMsg={form.cbiEmail.errorMsg}
              onBlur={(e) => form.onBlur("cbiEmail")}
              onChange={(e) => form.onChange("cbiEmail", e.target.value)}
              placeholder="Email"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>
          <div className="tw-mb-4 tw-w-full tw-inline-block">
            <ToscaField
              inputType="number"
              name="cbiPhoneNumber"
              value={form.cbiPhoneNumber.value}
              label="Broker Phone Number (Office): *"
              hasError={!form.cbiPhoneNumber.isValid}
              errorMsg={form.cbiPhoneNumber.errorMsg}
              onBlur={(e) => form.onBlur("cbiPhoneNumber")}
              onChange={(e) => form.onChange("cbiPhoneNumber", e.target.value)}
              placeholder="Phone Number"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4 tw-w-full tw-inline-block ">
            <ToscaField
              inputType="number"
              name="cbiMobileNumber"
              value={form.cbiMobileNumber.value}
              label="Broker Phone Number (Mobile): *"
              hasError={!form.cbiMobileNumber.isValid}
              errorMsg={form.cbiMobileNumber.errorMsg}
              onBlur={(e) => form.onBlur("cbiMobileNumber")}
              onChange={(e) => form.onChange("cbiMobileNumber", e.target.value)}
              placeholder="Mobile Number"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div>
            <label className="tw-block tw-mb-4 tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              {" "}
              Broker Operation Hours: *
            </label>

            <div className="tw-mb-4 tw-inline-block tw-w-4/12">
              <ToscaField
                elementType="reactselect"
                name="cbiOperationDays"
                value={form.cbiOperationDays.value}
                options={this.props.brokerOperationMethods.operationDayDropdownFilter(
                  form.cbiOperationDays.options,
                )}
                label="Days:"
                hasError={!form.cbiOperationDays.isValid}
                errorMsg={form.cbiOperationDays.errorMsg}
                onBlur={(e) => form.onBlur("cbiOperationDays")}
                onChange={(option) => {
                  form.onChange("cbiOperationDays", option);
                }}
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder=""
                isMulti={true}
              />
            </div>

            <div className="tw-mb-4 tw-inline-block tw-w-1/12 tw-pl-2 tw-text-gray-400 tw-text-xs tw-self-center">
              Between
            </div>

            <div className="tw-mb-4 tw-inline-block tw-pl-4 tw-pr-2 tw-w-3/12">
              <ToscaField
                elementType="date"
                name="cbiOperationFromTime"
                label="From:"
                value={form.cbiOperationFromTime.value}
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder="From"
                onChange={(date) => form.onChange("cbiOperationFromTime", date)}
                datePickerConfig={{
                  showTimeSelect: true,
                  showTimeSelectOnly: true,
                  dateFormat: "h:mm aa",
                }}
              />
            </div>

            <div className="tw-mb-4 tw-inline-block tw-pl-2 tw-pr-4 tw-w-3/12 ">
              <ToscaField
                elementType="date"
                name="cbiOperationToTime"
                label="To:"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder="To"
                value={form.cbiOperationToTime.value}
                onChange={(date) => form.onChange("cbiOperationToTime", date)}
                datePickerConfig={{
                  showTimeSelect: true,
                  showTimeSelectOnly: true,
                  dateFormat: "h:mm aa",
                  minTime: Moment(form.cbiOperationFromTime.value).add(
                    "minute",
                    30,
                  ),
                  maxTime: Moment().endOf("day"),
                }}
              />
            </div>

            <div className="tw-mb-4 tw-inline-block tw-w-1/12">
              <button
                type="button"
                disabled={
                  !form.cbiOperationDays.value ||
                  !form.cbiOperationDays.value.length ||
                  !form.cbiOperationFromTime.value ||
                  !form.cbiOperationToTime.value
                }
                onClick={() =>
                  this.props.brokerOperationMethods.onClickAddOperationHours(
                    form,
                  )
                }
                className="tw-relative tw-bg-tosca-orange hover:tw-bg-tosca-orange-500 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-rounded disabled:tw-bg-gray-500 tw-block tw-w-full tw-justify-center"
              >
                Add
              </button>
            </div>

            <div>
              {this.props.brokerOperationHours.map((hour, index) => {
                return (
                  <HoursRow
                    key={"shour-" + hour.id}
                    hour={hour}
                    onRemoveHoursClick={() =>
                      this.props.brokerOperationMethods.onRemoveBrokerOperationHoursClick(
                        hour,
                      )
                    }
                  />
                );
              })}
            </div>
          </div>

          <div className="tw-mt-6">
            <label className="tw-block tw-mb-4 tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              {" "}
              Broker Lead Time: *
            </label>

            <div className="tw-mb-4 tw-inline-block tw-w-4/12">
              <ToscaField
                elementType="reactselect"
                name="cbiLeadTimeDays"
                value={form.cbiLeadTimeDays.value}
                options={this.props.brokerOperationMethods.LeadTimeDayDropdownFilter(
                  form.cbiLeadTimeDays.options,
                )}
                label="Days:"
                hasError={!form.cbiLeadTimeDays.isValid}
                errorMsg={form.cbiLeadTimeDays.errorMsg}
                onBlur={(e) => form.onBlur("cbiLeadTimeDays")}
                onChange={(option) => {
                  form.onChange("cbiLeadTimeDays", option);
                }}
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder=""
                isMulti={true}
              />
            </div>

            <div className="tw-mb-4 tw-inline-block tw-w-1/12 tw-pl-2 tw-text-gray-400 tw-text-xs tw-self-center">
              Between
            </div>

            <div className="tw-mb-4 tw-inline-block tw-pl-4 tw-pr-2 tw-w-3/12">
              <ToscaField
                elementType="date"
                name="cbiLeadTimeFromTime"
                label="From:"
                value={form.cbiLeadTimeFromTime.value}
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder="From"
                onChange={(date) => form.onChange("cbiLeadTimeFromTime", date)}
                datePickerConfig={{
                  showTimeSelect: true,
                  showTimeSelectOnly: true,
                  dateFormat: "h:mm aa",
                }}
              />
            </div>

            <div className="tw-mb-4 tw-inline-block tw-pl-2 tw-pr-4 tw-w-3/12 ">
              <ToscaField
                elementType="date"
                name="cbiLeadTimeToTime"
                label="To:"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder="To"
                value={form.cbiLeadTimeToTime.value}
                onChange={(date) => form.onChange("cbiLeadTimeToTime", date)}
                datePickerConfig={{
                  showTimeSelect: true,
                  showTimeSelectOnly: true,
                  dateFormat: "h:mm aa",
                  minTime: Moment(form.cbiLeadTimeFromTime.value).add(
                    "minute",
                    30,
                  ),
                  maxTime: Moment().endOf("day"),
                }}
              />
            </div>

            <div className="tw-mb-4 tw-inline-block tw-w-1/12">
              <button
                type="button"
                disabled={
                  !form.cbiLeadTimeDays.value ||
                  !form.cbiLeadTimeDays.value.length ||
                  !form.cbiLeadTimeFromTime.value ||
                  !form.cbiLeadTimeToTime.value
                }
                onClick={() =>
                  this.props.brokerOperationMethods.onClickAddLeadTimeHours(
                    form,
                  )
                }
                className="tw-relative tw-bg-tosca-orange hover:tw-bg-tosca-orange-500 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-rounded disabled:tw-bg-gray-500 tw-block tw-w-full tw-justify-center"
              >
                Add
              </button>
            </div>

            <div>
              {this.props.brokerLeadTimeHours.map((hour, index) => {
                return (
                  <HoursRow
                    key={"shour-" + hour.id}
                    hour={hour}
                    onRemoveHoursClick={() =>
                      this.props.brokerOperationMethods.onRemoveBrokerLeadTimeHoursClick(
                        hour,
                      )
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>

        {form.cbiCountry.value.name === "Mexico" && (
          <div className="tw-w-1/2 tw-pr-4 tw-inline-block  tw-pl-8 tw-pr-8 tw-border-l-2 tw-border-tosca-orange">
            <h4 className="tw-text-tosca-orange">Export End User: (Mexico)</h4>

            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
              <ToscaField
                name="eeuFirstName"
                value={form.eeuFirstName.value}
                label="Name: *"
                hasError={!form.eeuFirstName.isValid}
                errorMsg={form.eeuFirstName.errorMsg}
                onBlur={(e) => form.onBlur("eeuFirstName")}
                onChange={(e) => form.onChange("eeuFirstName", e.target.value)}
                placeholder="First Name"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>
            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pl-2">
              <ToscaField
                name="eeuLastName"
                value={form.eeuLastName.value}
                label=" "
                hasError={!form.eeuLastName.isValid}
                errorMsg={form.eeuLastName.errorMsg}
                onBlur={(e) => form.onBlur("eeuLastName")}
                onChange={(e) => form.onChange("eeuLastName", e.target.value)}
                placeholder="Last Name"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>

            <div className="tw-mb-4">
              <ToscaField
                name="eeuStreetAddressLine1"
                value={form.eeuStreetAddressLine1.value}
                label="Address: *"
                hasError={!form.eeuStreetAddressLine1.isValid}
                errorMsg={form.eeuStreetAddressLine1.errorMsg}
                onBlur={(e) => form.onBlur("eeuStreetAddressLine1")}
                onChange={(e) =>
                  form.onChange("eeuStreetAddressLine1", e.target.value)
                }
                placeholder="Street Address Line 1"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>
            <div className="tw-mb-4">
              <ToscaField
                name="eeuStreetAddressLine2"
                value={form.eeuStreetAddressLine2.value}
                label=" "
                hasError={!form.eeuStreetAddressLine2.isValid}
                errorMsg={form.eeuStreetAddressLine2.errorMsg}
                onBlur={(e) => form.onBlur("eeuStreetAddressLine2")}
                onChange={(e) =>
                  form.onChange("eeuStreetAddressLine2", e.target.value)
                }
                placeholder="Street Addres Line 2"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>
            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
              <ToscaField
                name="eeuCity"
                value={form.eeuCity.value}
                label=" "
                hasError={!form.eeuCity.isValid}
                errorMsg={form.eeuCity.errorMsg}
                onBlur={(e) => form.onBlur("eeuCity")}
                onChange={(e) => form.onChange("eeuCity", e.target.value)}
                placeholder="City"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>
            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
              <ToscaField
                name="eeuZipCode"
                value={form.eeuZipCode.value}
                label=" "
                hasError={!form.eeuZipCode.isValid}
                errorMsg={form.eeuZipCode.errorMsg}
                onBlur={(e) => form.onBlur("eeuZipCode")}
                onChange={(e) => form.onChange("eeuZipCode", e.target.value)}
                placeholder="Zip Code"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>
            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
              <ToscaField
                elementType="country"
                label=""
                name="eeuCountry"
                whitelist={["US", "CA", "MX"]}
                defaultOptionLabel="Country"
                value={form.eeuCountry.value}
                onChange={(option) => form.onChange("eeuCountry", option)}
                onBlur={(e) => form.onBlur("eeuCountry")}
                hasError={!form.eeuCountry.isValid}
                errorMsg={form.eeuCountry.errorMsg}
                style={{ border: "1px solid #7ed4f7" }}
                inputWrapperClass=""
                isDisabled={true}
              />
            </div>
            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
              <ToscaField
                elementType="region"
                label=""
                name="eeuState"
                country={form.eeuCountry.value}
                blankOptionLabel="State"
                defaultOptionLabel="State"
                value={form.eeuState.value}
                onChange={(option) => form.onChange("eeuState", option)}
                onBlur={(e) => form.onBlur("eeuState")}
                hasError={!form.eeuState.isValid}
                errorMsg={form.eeuState.errorMsg}
                style={{ border: "1px solid #7ed4f7" }}
                inputWrapperClass=""
              />
            </div>

            {this.state.addressValidationResult.find(
              (item) => item.addressKey === "CIM",
            ) &&
              this.state.addressValidationResult.find(
                (item) => item.validate === false,
              ) && (
                <div className="tw-mb-4">
                  <div className="validation-error-popup">
                    {
                      this.state.addressValidationResult.find(
                        (item) => item.addressKey === "CIM",
                      ).errorMsg
                    }
                  </div>
                </div>
              )}

            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
              <ToscaField
                inputType="number"
                name="eeuCountryCode"
                value={form.eeuCountryCode.value}
                label="End User Country Code: *"
                hasError={!form.eeuCountryCode.isValid}
                errorMsg={form.eeuCountryCode.errorMsg}
                onBlur={(e) => form.onBlur("eeuCountryCode")}
                onChange={(e) =>
                  form.onChange("eeuCountryCode", e.target.value)
                }
                placeholder="Country Code"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>
            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2" />

            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
              <ToscaField
                name="eeuContactFirstName"
                value={form.eeuContactFirstName.value}
                label="Contact Name: *"
                hasError={!form.eeuContactFirstName.isValid}
                errorMsg={form.eeuContactFirstName.errorMsg}
                onBlur={(e) => form.onBlur("eeuContactFirstName")}
                onChange={(e) =>
                  form.onChange("eeuContactFirstName", e.target.value)
                }
                placeholder="First Name"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>
            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pl-2">
              <ToscaField
                name="eeuContactLastName"
                value={form.eeuContactLastName.value}
                label=" "
                hasError={!form.eeuContactLastName.isValid}
                errorMsg={form.eeuContactLastName.errorMsg}
                onBlur={(e) => form.onBlur("eeuContactLastName")}
                onChange={(e) =>
                  form.onChange("eeuContactLastName", e.target.value)
                }
                placeholder="Last Name"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>

            <div>
              <label className="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
                Phone Number: *
              </label>
            </div>
            <div className="tw-mb-4 tw-w-full tw-inline-block">
              <ToscaField
                inputType="number"
                name="eeuPhoneNumber"
                value={form.eeuPhoneNumber.value}
                label=" "
                hasError={!form.eeuPhoneNumber.isValid}
                errorMsg={form.eeuPhoneNumber.errorMsg}
                onBlur={(e) => form.onBlur("eeuPhoneNumber")}
                onChange={(e) =>
                  form.onChange("eeuPhoneNumber", e.target.value)
                }
                placeholder="Phone Number"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>

            <div className="tw-mb-4">
              <ToscaField
                name="eeuEmail"
                value={form.eeuEmail.value}
                label="Email: *"
                hasError={!form.eeuEmail.isValid}
                errorMsg={form.eeuEmail.errorMsg}
                onBlur={(e) => form.onBlur("eeuEmail")}
                onChange={(e) => form.onChange("eeuEmail", e.target.value)}
                placeholder="Email"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>
          </div>
        )}
        <div className="tw-w-full tw-pr-4 tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
          {this.state.addressValidationShow && (
            <div className="tw-mb-4">
              <div className="validation-error-message-left">
                Address validation faild, Please review the address.
              </div>
            </div>
          )}
          <div className="tw-inline-block tw-mr-1 ">
            <button
              type="button"
              onClick={() => {
                this.props.onRemoveButtonClick(this.props.id);
              }}
              className="tw-mr-4 tw-mt-4 tw-bg-white hover:tw-bg-red-100 tw-text-red-700 tw-font-bold tw-py-2 tw-px-4 tw-border tw-border-red-700 tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
            >
              Remove This Address
            </button>
          </div>
          <div className="tw-inline-block">
            <button
              type="button"
              disabled={!form.isFormValid}
              onClick={() => this.save(this.props.addNew, this.props.id)}
              className="tw-relative tw-bg-tosca-orange hover:tw-bg-tosca-orange-500 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}
