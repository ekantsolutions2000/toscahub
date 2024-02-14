import React, { Component } from "react";
import ToscaField from "../../../components/FormControls/ToscaField";
import Moment from "moment";
import HoursRow from "./HoursRow";
// import logger from "redux-logger";
export default class ShippingFormComponent extends Component {
  state = {
    addressValidationShow: false,
    addressValidationResult: [],
    shippingInforRegions: [],
    zipFieldLableSi: "Zip Code",
    regionsLableSi: "State",
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.props !== prevProps)
  //     this.getWhitelist();
  // }

  // getWhitelist = () => {
  //   if (this.props.form.siExport.value) {
  //     this.setState({ whiteList: ["CA", "MX"] });
  //   } else {
  //     this.setState({ whiteList: ["US"] });
  //   }
  // }

  save = async (addNew, id) => {
    const form = this.props.form;

    if (form.siCountry.value === "United States") {
      let addresses = [
        {
          addressKey: "SI",
          address1ine1: form.siStreetAddressLine1.value,
          address1ine2: form.siStreetAddressLine2.value,
          city: form.siCity.value,
          state: form.siState.value,
          zip5: form.siZipCode.value,
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
  };

  siCountryOnChange = async (option) => {
    let { form, onChangeCountry } = this.props;
    form.onChange("siCountry", option);
    form.siState.value = "";

    this.setState({
      shippingInforRegions: (await onChangeCountry(option.code)).data.data,
      zipFieldLableSi:
        option.code === "MX" || option.code === "CA"
          ? "Postal Code"
          : "Zip Code",
      regionsLableSi:
        option.code === "MX" || option.code === "CA" ? "Province" : "State",
    });
  };

  componentDidUpdate = async () => {
    let { form, onChangeCountry } = this.props;

    if (
      form.siCountry.value.code &&
      this.state.shippingInforRegions.length === 0
    ) {
      this.setState({
        shippingInforRegions: (await onChangeCountry(form.siCountry.value.code))
          .data.data,
        zipFieldLableSi:
          form.siCountry.value.code === "MX" ||
          form.siCountry.value.code === "CA"
            ? "Postal Code"
            : "Zip Code",
        regionsLableSi:
          form.siCountry.value.code === "MX" ||
          form.siCountry.value.code === "CA"
            ? "Province"
            : "State",
      });
    }
  };

  render() {
    let { form } = this.props;

    return (
      <div>
        <div className="tw-mb-12 ">
          <h4 className="tw-text-tosca-orange tw-mb-4">
            Shipping Address {this.props.id}:
          </h4>

          {/* Delivery Type */}
          <div>
            <div className="tw-mb-4 tw-w-2/12 tw-inline-block">
              <label className="tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                Choose: *
              </label>
            </div>

            <div className="tw-mb-4 tw-w-5/12 tw-inline-block">
              <ToscaField label="" name="siPickUp">
                <input
                  className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
                  type="checkbox"
                  checked={form.siPickUp.value}
                  onChange={(e) => {
                    form.onChange("siPickUp", true);
                    form.onChange("siDelivery", false);
                  }}
                />
                <label className="tw-pl-2 tw-pt-1 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                  Customer Pick Up
                </label>
              </ToscaField>
            </div>

            <div className="tw-mb-4 tw-w-5/12 tw-inline-block">
              <ToscaField label="" name="siDelivery">
                <input
                  className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
                  type="checkbox"
                  checked={form.siDelivery.value}
                  onChange={(e) => {
                    form.onChange("siDelivery", true);
                    form.onChange("siPickUp", false);
                  }}
                />
                <label className="tw-pl-2 tw-pt-1 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                  Delivered
                </label>
              </ToscaField>
            </div>
          </div>

          <div className="">
            {/* Location Name */}
            <div className="tw-mb-4">
              <ToscaField
                name="siLocationName"
                value={form.siLocationName.value}
                label="Location Name: *"
                hasError={!form.siLocationName.isValid}
                errorMsg={form.siLocationName.errorMsg}
                onBlur={(e) => form.onBlur("siLocationName")}
                onChange={(e) =>
                  form.onChange("siLocationName", e.target.value)
                }
                placeholder="Location Name"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
              />
            </div>

            {/* Location Address */}
            <div className="tw-mb-4">
              <ToscaField
                name="siStreetAddressLine1"
                value={form.siStreetAddressLine1.value}
                label="Address: *"
                hasError={!form.siStreetAddressLine1.isValid}
                errorMsg={form.siStreetAddressLine1.errorMsg}
                onBlur={(e) => form.onBlur("siStreetAddressLine1")}
                onChange={(e) =>
                  form.onChange("siStreetAddressLine1", e.target.value)
                }
                placeholder="Street Address Line 1"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
              />
            </div>
            <div className="tw-mb-4">
              <ToscaField
                name="siStreetAddressLine2"
                value={form.siStreetAddressLine2.value}
                label=" "
                hasError={!form.siStreetAddressLine2.isValid}
                errorMsg={form.siStreetAddressLine2.errorMsg}
                onBlur={(e) => form.onBlur("siStreetAddressLine2")}
                onChange={(e) =>
                  form.onChange("siStreetAddressLine2", e.target.value)
                }
                placeholder="Street Addres Line 2"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
              />
            </div>
          </div>

          {/* City */}
          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="siCity"
              value={form.siCity.value}
              label=" "
              hasError={!form.siCity.isValid}
              errorMsg={form.siCity.errorMsg}
              onBlur={(e) => form.onBlur("siCity")}
              onChange={(e) => form.onChange("siCity", e.target.value)}
              placeholder="City"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
            />
          </div>

          {/* ZipCode */}
          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="siZipCode"
              value={form.siZipCode.value}
              label=" "
              hasError={!form.siZipCode.isValid}
              errorMsg={form.siZipCode.errorMsg}
              onBlur={(e) => form.onBlur("siZipCode")}
              onChange={(e) => form.onChange("siZipCode", e.target.value)}
              placeholder={this.state.zipFieldLableSi}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
            />
          </div>

          {/* Country */}
          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
            <ToscaField
              elementType="reactselect"
              name="siCountry"
              value={form.siCountry.value}
              options={this.props.countries}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.code}
              label=""
              hasError={!form.siCountry.isValid}
              errorMsg={form.siCountry.errorMsg}
              onBlur={(e) => form.onBlur("siCountry")}
              onChange={(option) => this.siCountryOnChange(option)}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              placeholder="Country"
              isMulti={false}
            />
          </div>

          {/* State */}
          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
            <ToscaField
              elementType="reactselect"
              name="siState"
              value={form.siState.value}
              options={this.state.shippingInforRegions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.code}
              label=""
              hasError={!form.siState.isValid}
              errorMsg={form.siState.errorMsg}
              onBlur={(e) => form.onBlur("siState")}
              onChange={(option) => {
                form.onChange("siState", option);
              }}
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              placeholder={this.state.regionsLableSi}
              isMulti={false}
            />
          </div>

          {this.state.addressValidationResult.find(
            (item) => item.addressKey === "SI",
          ) &&
            this.state.addressValidationResult.find(
              (item) => item.validate === false,
            ) && (
              <div className="tw-mb-4">
                <div className="validation-error-popup">
                  {
                    this.state.addressValidationResult.find(
                      (item) => item.addressKey === "SI",
                    ).errorMsg
                  }
                </div>
              </div>
            )}

          {/* Contacr Name */}
          <div>
            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
              <ToscaField
                name="siFirstName"
                value={form.siFirstName.value}
                label="Contact Name: *"
                hasError={!form.siFirstName.isValid}
                errorMsg={form.siFirstName.errorMsg}
                onBlur={(e) => form.onBlur("siFirstName")}
                onChange={(e) => form.onChange("siFirstName", e.target.value)}
                placeholder="First Name"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
              />
            </div>
            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pl-2">
              <ToscaField
                name="siLastName"
                value={form.siLastName.value}
                label=" "
                hasError={!form.siLastName.isValid}
                errorMsg={form.siLastName.errorMsg}
                onBlur={(e) => form.onBlur("siLastName")}
                onChange={(e) => form.onChange("siLastName", e.target.value)}
                placeholder="Last Name"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
              />
            </div>
          </div>

          {/* Email */}
          <div className="tw-mb-4">
            <ToscaField
              name="siEmail"
              value={form.siEmail.value}
              label="Email: *"
              hasError={!form.siEmail.isValid}
              errorMsg={form.siEmail.errorMsg}
              onBlur={(e) => {
                form.siEmail.rules = form.siEmail.rulesOnBlur;
                form.onBlur("siEmail");
              }}
              onChange={(e) => {
                form.onChange("siEmail", e.target.value);
              }}
              onFocus={(e) => {
                form.siEmail.rules = form.siEmail.rulesOnChange;
              }}
              placeholder="Email"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
            />
          </div>

          {/* Phone number Office */}
          <div>
            <label className="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              {`Phone Number ( Office ): *`}
            </label>
          </div>
          <div className="tw-mb-4 tw-w-full tw-inline-block ">
            <ToscaField
              inputType="number"
              name="siOfficePhoneNumber"
              value={form.siOfficePhoneNumber.value}
              label=" "
              hasError={!form.siOfficePhoneNumber.isValid}
              errorMsg={form.siOfficePhoneNumber.errorMsg}
              onBlur={(e) => form.onBlur("siOfficePhoneNumber")}
              onChange={(e) =>
                form.onChange("siOfficePhoneNumber", e.target.value)
              }
              placeholder="Phone Number"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
            />
          </div>

          {/* Phone number Mobile */}
          <div>
            <label className="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              {`Phone Number ( Mobile ): *`}
            </label>
          </div>
          <div className="tw-mb-4 tw-w-full tw-inline-block ">
            <ToscaField
              inputType="number"
              name="siMobileNumber"
              value={form.siMobileNumber.value}
              label=""
              hasError={!form.siMobileNumber.isValid}
              errorMsg={form.siMobileNumber.errorMsg}
              onBlur={(e) => form.onBlur("siMobileNumber")}
              onChange={(e) => form.onChange("siMobileNumber", e.target.value)}
              placeholder="Mobile Number"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
            />
          </div>

          {/* Phone number Fax */}
          <div>
            <label className="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              Fax Number:
            </label>
          </div>
          <div className="tw-mb-4 tw-w-full tw-inline-block">
            <ToscaField
              inputType="number"
              name="siFaxNumber"
              value={form.siFaxNumber.value}
              label=" "
              hasError={!form.siFaxNumber.isValid}
              errorMsg={form.siFaxNumber.errorMsg}
              onBlur={(e) => form.onBlur("siFaxNumber")}
              onChange={(e) => form.onChange("siFaxNumber", e.target.value)}
              placeholder="Fax Number"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
            />
          </div>

          {/* Shipping Hours */}
          <div>
            <label className="tw-block tw-mb-4 tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              {" "}
              Shipping Hours: *
            </label>

            <div className="tw-mb-4 tw-inline-block tw-w-4/12">
              <ToscaField
                elementType="reactselect"
                name="siShippingDays"
                value={form.siShippingDays.value}
                options={this.props.shippingFormMethods.shippingDayDropdownFilter(
                  form.siShippingDays.options,
                )}
                label="Days:"
                hasError={!form.siShippingDays.isValid}
                errorMsg={form.siShippingDays.errorMsg}
                onBlur={(e) => form.onBlur("siShippingDays")}
                onChange={(option) => {
                  form.onChange("siShippingDays", option);
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
                name="siShippingTimeFrom"
                label="From:"
                value={form.siShippingTimeFrom.value}
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder="From"
                onChange={(date) => form.onChange("siShippingTimeFrom", date)}
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
                name="siShippingTimeTo"
                label="To:"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder="To"
                value={form.siShippingTimeTo.value}
                onChange={(date) => form.onChange("siShippingTimeTo", date)}
                datePickerConfig={{
                  showTimeSelect: true,
                  showTimeSelectOnly: true,
                  dateFormat: "h:mm aa",
                  minTime: Moment(form.siShippingTimeFrom.value).add(
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
                  !form.siShippingDays.value ||
                  !form.siShippingDays.value.length ||
                  !form.siShippingTimeFrom.value ||
                  !form.siShippingTimeTo.value
                }
                onClick={() =>
                  this.props.shippingFormMethods.onAddShippingHoursCick(form)
                }
                className="tw-relative tw-bg-tosca-orange hover:tw-bg-tosca-orange-500 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-rounded disabled:tw-bg-gray-500 tw-block tw-w-full tw-justify-center"
              >
                Add
              </button>
            </div>

            <div>
              {this.props.shippingHours.map((hour, index) => {
                return (
                  <HoursRow
                    key={"shour-" + hour.id}
                    hour={hour}
                    onRemoveHoursClick={() =>
                      this.props.shippingFormMethods.onRemoveShippingHoursClick(
                        hour,
                      )
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* Receiving Hours */}
          <div>
            <label className="tw-block tw-mb-4 tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
              {" "}
              Receiving Hours: *
            </label>

            <div className="tw-mb-4 tw-inline-block tw-w-4/12">
              <ToscaField
                elementType="reactselect"
                name="siReceivingDays"
                value={form.siReceivingDays.value}
                options={this.props.shippingFormMethods.receivingDayDropdownFilter(
                  form.siReceivingDays.options,
                )}
                label="Days:"
                hasError={!form.siReceivingDays.isValid}
                errorMsg={form.siReceivingDays.errorMsg}
                onBlur={(e) => form.onBlur("siReceivingDays")}
                onChange={(option) => {
                  form.onChange("siReceivingDays", option);
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
                name="siReceivingTimeFrom"
                label="From:"
                value={form.siReceivingTimeFrom.value}
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder="From"
                onChange={(date) => form.onChange("siReceivingTimeFrom", date)}
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
                name="siTimeTo"
                label="To:"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder="To"
                value={form.siReceivingTimeTo.value}
                onChange={(date) => form.onChange("siReceivingTimeTo", date)}
                datePickerConfig={{
                  showTimeSelect: true,
                  showTimeSelectOnly: true,
                  dateFormat: "h:mm aa",
                  minTime: Moment(form.siReceivingTimeFrom.value).add(
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
                  !form.siReceivingDays.value ||
                  !form.siReceivingDays.value.length ||
                  !form.siReceivingTimeTo.value ||
                  !form.siReceivingTimeFrom.value
                }
                onClick={() =>
                  this.props.shippingFormMethods.onAddReceivingHoursCick(form)
                }
                className="tw-relative tw-bg-tosca-orange hover:tw-bg-tosca-orange-500 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-rounded disabled:tw-bg-gray-500 tw-block tw-w-full tw-justify-center"
              >
                Add
              </button>
            </div>

            <div>
              {this.props.receivingHours.map((hour, index) => (
                <HoursRow
                  key={"rhour-" + hour.id}
                  hour={hour}
                  onRemoveHoursClick={
                    this.props.shippingFormMethods.onRemoveReceivingHoursClick
                  }
                />
              ))}
            </div>
          </div>

          <h4 className="tw-mt-10 tw-text-tosca-orange">{`Customer Preferences i.e. - bagging, heat treated pallets (may incur additional cost).`}</h4>

          {/* Bagged Pallets */}
          <div>
            <label className="tw-pr-4 tw-w-4/12 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
              Do you want pallets bagged? *
            </label>

            <div className="tw-mb-4 tw-w-2/12 tw-inline-block">
              <ToscaField
                elementType="reactselect"
                name="siBaggedPallets"
                value={form.siBaggedPallets.value}
                options={form.siBaggedPallets.options}
                label=""
                hasError={!form.siBaggedPallets.isValid}
                errorMsg={form.siBaggedPallets.errorMsg}
                onBlur={(e) => form.onBlur("siBaggedPallets")}
                onChange={(option) => form.onChange("siBaggedPallets", option)}
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder="Yes/No"
                // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
              />
            </div>
          </div>

          {/* Heat Treated Pallets */}
          <div>
            <label className="tw-pr-4 tw-w-4/12 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
              Do you want heat treated pallets? *
            </label>

            <div className="tw-mb-4 tw-w-2/12 tw-inline-block">
              <ToscaField
                elementType="reactselect"
                name="siHeatTreatedPallets"
                value={form.siHeatTreatedPallets.value}
                options={form.siHeatTreatedPallets.options}
                label=""
                hasError={!form.siHeatTreatedPallets.isValid}
                errorMsg={form.siHeatTreatedPallets.errorMsg}
                onBlur={(e) => form.onBlur("siHeatTreatedPallets")}
                onChange={(option) =>
                  form.onChange("siHeatTreatedPallets", option)
                }
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder="Yes/No"
                // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
              />
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="tw-mb-4">
            <ToscaField
              name="siDeliveryInstructions"
              value={form.siDeliveryInstructions.value}
              label="Delivery Instructions  &nbsp; i.e.  &nbsp;- &nbsp; appt must be made, carrier entrance, truck wash required (may incur additional cost):"
              hasError={!form.siDeliveryInstructions.isValid}
              errorMsg={form.siDeliveryInstructions.errorMsg}
              onBlur={(e) => form.onBlur("siDeliveryInstructions")}
              onChange={(e) =>
                form.onChange("siDeliveryInstructions", e.target.value)
              }
              placeholder="Delivery Instructions"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
              // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
            />
          </div>

          {/* Flatbed */}
          <div>
            <label className="tw-pr-4 tw-w-4/12 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
              Do you require flatbed? *
            </label>
            <div className="tw-mb-4 tw-w-2/12 tw-inline-block">
              <ToscaField
                elementType="reactselect"
                name="siFlatbed"
                value={form.siFlatbed.value}
                options={form.siFlatbed.options}
                label=""
                hasError={!form.siFlatbed.isValid}
                errorMsg={form.siFlatbed.errorMsg}
                onBlur={(e) => form.onBlur("siFlatbed")}
                onChange={(option) => form.onChange("siFlatbed", option)}
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
                placeholder="Yes/No"
                // styleElement={{ inputElement: () => ({backgroundColor: 'red'})  }}
              />
            </div>
          </div>

          <div>
            <label className="tw-w-full tw-text-tosca-orange text-center tw-mt-5 tw-mb-10 tw-italic">
              *If you have more "ship to" locations, please complete another
              form.
            </label>
          </div>

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
              disabled={
                !form.isFormValid ||
                !this.props.receivingHours.length ||
                !this.props.shippingHours.length
              }
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
