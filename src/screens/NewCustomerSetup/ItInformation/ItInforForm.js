import React, { Component } from "react";
import ToscaField from "../../../components/FormControls/ToscaField";

export default class ItInforForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { form, itInforFormMethods } = this.props;

    return (
      <div className="tw-py-8">
        <div className="tw-w-full tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
          <div className="tw-w-1/2 tw-inline-block tw-pr-10  tw-align-top">
            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pr-2">
              <ToscaField
                name="itInforFirstName"
                value={form.itInforFirstName.value}
                label="IT Contact Name: *"
                hasError={!form.itInforFirstName.isValid}
                errorMsg={form.itInforFirstName.errorMsg}
                onBlur={(e) => form.onBlur("itInforFirstName")}
                onChange={(e) =>
                  form.onChange("itInforFirstName", e.target.value)
                }
                placeholder="First Name"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>

            <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pl-2">
              <ToscaField
                name="itInforLastName"
                value={form.itInforLastName.value}
                label=" "
                hasError={!form.itInforLastName.isValid}
                errorMsg={form.itInforLastName.errorMsg}
                onBlur={(e) => form.onBlur("itInforLastName")}
                onChange={(e) =>
                  form.onChange("itInforLastName", e.target.value)
                }
                placeholder="Last Name"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>

            <div className="tw-mb-4">
              <ToscaField
                name="itInforEmail"
                value={form.itInforEmail.value}
                label="Email: *"
                hasError={!form.itInforEmail.isValid}
                errorMsg={form.itInforEmail.errorMsg}
                onBlur={(e) => form.onBlur("itInforEmail")}
                onChange={(e) => form.onChange("itInforEmail", e.target.value)}
                placeholder="Email"
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
                name="itInforPhoneNumber"
                value={form.itInforPhoneNumber.value}
                label=" "
                hasError={!form.itInforPhoneNumber.isValid}
                errorMsg={form.itInforPhoneNumber.errorMsg}
                onBlur={(e) => form.onBlur("itInforPhoneNumber")}
                onChange={(e) =>
                  form.onChange("itInforPhoneNumber", e.target.value)
                }
                placeholder="Phone Number"
                labelWrapperClass="tw-mb-2"
                inputWrapperClass=""
              />
            </div>
          </div>

          <div className="tw-w-1/2 tw-inline-block tw-pl-10 tw-align-top">
            <div className="tw-mb-5">
              <div className="tw-mt-5 tw-mb-4 tw-w-full tw-inline-block">
                <label className="tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                  RPC Reporting Capabilities : *
                </label>
              </div>

              <div className="tw-mb-4 tw-w-full tw-inline-block">
                <ToscaField label="" name="itInforReportingSFTP">
                  <input
                    className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
                    type="checkbox"
                    checked={form.itInforReportingSFTP.value}
                    onChange={(e) => {
                      form.onChange("itInforReportingSFTP", true);
                      form.onChange("itInforReportingExcel", false);
                      form.onChange("itInforReportingFamous", false);
                      form.onChange("itInforReportingOnline", false);
                    }}
                  />
                  <label className="tw-pl-2 tw-pt-1 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                    : Secure File Transfer Protocol (SFTP)
                  </label>
                </ToscaField>
              </div>

              <div className="tw-mb-4 tw-w-full tw-inline-block">
                <ToscaField label="" name="itInforReportingExcel">
                  <input
                    className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
                    type="checkbox"
                    checked={form.itInforReportingExcel.value}
                    onChange={(e) => {
                      form.onChange("itInforReportingExcel", true);
                      form.onChange("itInforReportingSFTP", false);
                      form.onChange("itInforReportingFamous", false);
                      form.onChange("itInforReportingOnline", false);
                    }}
                  />
                  <label className="tw-pl-2 tw-pt-1 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                    : Excel Spreadsheet
                  </label>
                </ToscaField>
              </div>

              <div className="tw-mb-4 tw-w-full tw-inline-block">
                <ToscaField label="" name="itInforReportingFamous">
                  <input
                    className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
                    type="checkbox"
                    checked={form.itInforReportingFamous.value}
                    onChange={(e) => {
                      form.onChange("itInforReportingFamous", true);
                      form.onChange("itInforReportingExcel", false);
                      form.onChange("itInforReportingSFTP", false);
                      form.onChange("itInforReportingOnline", false);
                    }}
                  />
                  <label className="tw-pl-2 tw-pt-1 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                    : Famous
                  </label>
                </ToscaField>
              </div>

              <div className="tw-mb-4 tw-w-full tw-inline-block">
                <ToscaField label="" name="itInforReportingOnline">
                  <input
                    className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
                    type="checkbox"
                    checked={form.itInforReportingOnline.value}
                    onChange={(e) => {
                      form.onChange("itInforReportingOnline", true);
                      form.onChange("itInforReportingFamous", false);
                      form.onChange("itInforReportingExcel", false);
                      form.onChange("itInforReportingSFTP", false);
                    }}
                  />
                  <label className="tw-pl-2 tw-pt-1 tw-text-tosca-orange tw-align-middle leading-tight tw-h-5">
                    : Online reporting through Tosca portal
                  </label>
                </ToscaField>
              </div>
            </div>
          </div>

          <div className="tw-mb-4 tw-w-3/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="itInforReportingFirstName"
              value={form.itInforReportingFirstName.value}
              label="Reporting Contact First name: *"
              hasError={!form.itInforReportingFirstName.isValid}
              errorMsg={form.itInforReportingFirstName.errorMsg}
              onBlur={(e) => form.onBlur("itInforReportingFirstName")}
              onChange={(e) =>
                form.onChange("itInforReportingFirstName", e.target.value)
              }
              placeholder="First Name"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4 tw-w-3/12 tw-inline-block tw-pr-2">
            <ToscaField
              name="itInforReportingLastName"
              value={form.itInforReportingLastName.value}
              label=" "
              hasError={!form.itInforReportingLastName.isValid}
              errorMsg={form.itInforReportingLastName.errorMsg}
              onBlur={(e) => form.onBlur("itInforReportingLastName")}
              onChange={(e) =>
                form.onChange("itInforReportingLastName", e.target.value)
              }
              placeholder="Last Name"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>

          <div className="tw-mb-4 tw-w-6/12 tw-inline-block tw-pl-10">
            <ToscaField
              name="itInforReportingEmail"
              value={form.itInforReportingEmail.value}
              label="Reporting contact email: *"
              hasError={!form.itInforReportingEmail.isValid}
              errorMsg={form.itInforReportingEmail.errorMsg}
              onBlur={(e) => form.onBlur("itInforReportingEmail")}
              onChange={(e) =>
                form.onChange("itInforReportingEmail", e.target.value)
              }
              placeholder="Email"
              labelWrapperClass="tw-mb-2"
              inputWrapperClass=""
            />
          </div>
        </div>

        <div className="tw-w-full tw-pr-4 tw-inline-block tw-pl-8 tw-pr-8 tw-align-top">
          <h5 className="tw-mt-5 tw-text-tosca-orange">
            Reporting via Excel spreadsheet should be emailed to &nbsp;
            <a href={`mailto:Reporting@toscaltd.com`}>
              Reporting@toscaltd.com.
            </a>
          </h5>

          <h5 className="tw-mt-3 tw-text-tosca-orange">
            Reporting via Excel spreadsheet should be emailed to &nbsp;
            <a href={`mailto:RPC@toscaltd.com`}>RPC@toscaltd.com</a>
            &nbsp; and include the following information:
          </h5>
          <h5>
            Date, Location of Rejection, Receiver Name, RPC Size, Qty, Receiver
            Address, Receiver Contact Name, Receiver Contact Phone number
          </h5>

          <h4 className="tw-mb-2 tw-text-tosca-orange tw-text-center tw-text-2xl tw-mt-10">
            If final destination of product will be retailers, which retailers
            and Distribution Centers do you ship to?
          </h4>
        </div>

        <div className="tw-w-full tw-inline-block tw-pl-8 tw-pr-8 tw-mb-10 tw-align-top">
          <>
            <div className="tw-border-2 tw-inline-block tw-text-center tw-w-5/12 tw-py-2">
              Retailer/Final Location
            </div>
            <div className="tw-border-2 tw-inline-block tw-text-center tw-w-6/12 tw-py-2">
              Distribution Center Location (City,State)
            </div>
            <div className="tw-border-2 tw-inline-block tw-text-center tw-w-1/12 tw-py-2">
              &nbsp;
            </div>
          </>

          {form.itInforDestinations.value &&
            form.itInforDestinations.value.map((location, index) => (
              <>
                <div className="tw-border-2 tw-inline-block tw-w-5/12 tw-py-2 tw-pl-2">
                  <h5 className="tw-my-1">{location.finalLocation}</h5>
                </div>
                <div className="tw-border-2 tw-inline-block tw-w-6/12 tw-py-2 tw-pl-2">
                  <h5 className="tw-my-1">{`${location.destinationCity} - ${location.destinationState}`}</h5>
                </div>
                <div className="tw-border-2 tw-inline-block tw-text-center tw-w-1/12 tw-py-1">
                  <button
                    onClick={() =>
                      itInforFormMethods.removeDestination(location.id, form)
                    }
                    className="btn-delete-destination"
                  >
                    <span className="glyphicon glyphicon-remove" />
                  </button>
                </div>
              </>
            ))}

          <>
            <div className="tw-border-2 tw-inline-block tw-w-5/12">
              <div className="tw-w-full tw-inline-block">
                <ToscaField
                  name="itInforFinalLocation"
                  value={form.itInforFinalLocation.value}
                  label=" "
                  hasError={!form.itInforFinalLocation.isValid}
                  errorMsg={form.itInforFinalLocation.errorMsg}
                  onBlur={(e) => form.onBlur("itInforFinalLocation")}
                  onChange={(e) =>
                    form.onChange("itInforFinalLocation", e.target.value)
                  }
                  placeholder="Retailer or Final Location"
                  labelWrapperClass=""
                  inputWrapperClass=""
                />
              </div>
            </div>
            <div className="tw-border-2 tw-inline-block tw-w-6/12">
              <div className="tw-w-1/2 tw-inline-block ">
                <ToscaField
                  name="itInforDistributionCity"
                  value={form.itInforDistributionCity.value}
                  label=" "
                  hasError={!form.itInforDistributionCity.isValid}
                  errorMsg={form.itInforDistributionCity.errorMsg}
                  onBlur={(e) => form.onBlur("itInforDistributionCity")}
                  onChange={(e) =>
                    form.onChange("itInforDistributionCity", e.target.value)
                  }
                  placeholder="City"
                  labelWrapperClass=""
                  inputWrapperClass=""
                />
              </div>
              <div className="tw-w-1/2 tw-inline-block">
                <ToscaField
                  name="itInforDistributionState"
                  value={form.itInforDistributionState.value}
                  label=" "
                  hasError={!form.itInforDistributionState.isValid}
                  errorMsg={form.itInforDistributionState.errorMsg}
                  onBlur={(e) => form.onBlur("itInforDistributionState")}
                  onChange={(e) =>
                    form.onChange("itInforDistributionState", e.target.value)
                  }
                  placeholder="State"
                  labelWrapperClass=""
                  inputWrapperClass=""
                />
              </div>
            </div>
            <div className="tw-border-2 tw-inline-block tw-text-center tw-w-1/12">
              <button
                className={`btn-add-destination ${
                  !itInforFormMethods.isValidNewDestination(form)
                    ? "disabled"
                    : ""
                }`}
                disabled={!itInforFormMethods.isValidNewDestination(form)}
                onClick={() => itInforFormMethods.AddNewDestination(form)}
              >
                + ADD
              </button>
            </div>
          </>
        </div>
      </div>
    );
  }
}
