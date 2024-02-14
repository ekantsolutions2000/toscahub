import React, { Component } from "react";
import Moment from "moment";

export default class CustomsTileComponent extends Component {
  render() {
    let { form, brokerOperationHours, brokerLeadTimeHours } = this.props.data;
    return (
      <div className="tw-w-1/2 tw-inline-block tw-border tw-my-5 tw-p-3">
        <button
          type="button"
          onClick={() =>
            this.props.onEditCustomsDetailsClick(
              this.props.data.id,
              form,
              brokerOperationHours,
              brokerLeadTimeHours,
            )
          }
          className="tw-mr-4 tw-float-right tw-bg-white hover:tw-bg-gray-100 tw-text-gray-900 tw-font-bold tw-py-2 tw-px-4 tw-border tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
        >
          Edit
        </button>
        <h4 className="tw-text-tosca-orange tw-mb-4">
          Customs details {this.props.data.id}:
        </h4>
        <div className="tw-mb-4"></div>
        <div>Broker Company Name : {`${form.cbiBrokerCompanyName.value}`}</div>
        <div>
          Address :{" "}
          {`${form.cbiBrokerAddressLine1.value} ${form.cbiBrokerAddressLine2.value}  ( ${form.cbiCountry.value.name} - ${form.cbiCity.value} - ${form.cbiState.value.name}- ${form.cbiZipCode.value})`}
        </div>
        <div>
          Custom Broker Name :{" "}
          {`${form.cbiBrokerFirstName.value} ${form.cbiBrokerLastName.value}`}
        </div>
        <div>Phone Number : {`${form.cbiPhoneNumber.value}`}</div>

        <div>Mobile Number : {`${form.cbiMobileNumber.value}`}</div>
        <div>E-Mail : {`${form.cbiEmail.value} `}</div>

        <div>Broker Operation Hours: </div>
        <div>
          {brokerOperationHours?.map((hour, index) => (
            <div key={index} className={hour.id > 1 ? "tw-border-t" : null}>
              {hour.days.map((day, i) => (
                <span
                  key={i}
                  className="tw-inline-block tw-p-1 tw-bg-gray-200 tw-m-1 tw-rounded-sm"
                >
                  {day.value}
                </span>
              ))}
              <span className="tw-inline-block tw-p-1 tw-bg-gray-200 tw-m-1 tw-rounded-sm">
                {" "}
                {"Between " +
                  Moment(hour.from).format("hh:mm A") +
                  " and  " +
                  Moment(hour.to).format("hh:mm A")}
              </span>
            </div>
          ))}
        </div>
        <div>Broker Lead Time Hours: </div>
        <div>
          {brokerLeadTimeHours?.map((hour, index) => (
            <div key={index} className={hour.id > 1 ? "tw-border-t" : null}>
              {hour.days.map((day, i) => (
                <span
                  key={i}
                  className="tw-inline-block tw-p-1 tw-bg-gray-200 tw-m-1 tw-rounded-sm"
                >
                  {day.value}
                </span>
              ))}
              <span className="tw-inline-block tw-p-1 tw-bg-gray-200 tw-m-1 tw-rounded-sm">
                {" "}
                {"Between " +
                  Moment(hour.from).format("hh:mm A") +
                  " and  " +
                  Moment(hour.to).format("hh:mm A")}
              </span>
            </div>
          ))}
        </div>

        {form.eeuFirstName.value && (
          <>
            <hr className=" tw-my-3" />
            <h4>Export End User: (Mexico)</h4>
            <div>
              Name : {`${form.eeuFirstName.value} ${form.eeuLastName.value}`}
            </div>
            <div>
              Address :{" "}
              {`${form.eeuStreetAddressLine1.value} ${form.eeuStreetAddressLine2.value}`}
              {` (
            ${form.eeuCountryCode.value} - 
            ${form.eeuCountry.value} - 
            ${form.eeuCity.value} - 
            ${form.eeuState.value} - 
            ${form.eeuZipCode.value}
            )`}
            </div>

            <div>
              Contact Name :{" "}
              {`${form.eeuContactFirstName.value} ${form.eeuContactLastName.value}`}
            </div>

            <div>Phone Number : {`${form.eeuPhoneNumber.value}`}</div>

            <div>Email : {`${form.eeuEmail.value}`}</div>
          </>
        )}
      </div>
    );
  }
}
