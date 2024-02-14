import React, { Component } from "react";
import Moment from "moment";
export default class AddressTileComponent extends Component {
  render() {
    let { form, shippingHours, receivingHours } = this.props.data;
    return (
      <div>
        <div className="tw-m-8 tw-border tw-p-4">
          <button
            type="button"
            onClick={() =>
              this.props.onEditAddressClick(
                this.props.data.id,
                form,
                shippingHours,
                receivingHours,
              )
            }
            className="tw-mr-4 tw-float-right tw-bg-white hover:tw-bg-gray-100 tw-text-gray-900 tw-font-bold tw-py-2 tw-px-4 tw-border tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
          >
            Edit
          </button>
          <h4 className="tw-text-tosca-orange tw-mb-4">
            Shipping Address {this.props.data.id}:
          </h4>
          <div className="tw-mb-4">
            {form.siPickUp.value ? " | Customer Pick Up" : ""}
            {form.siDelivery.value ? " | Delivered" : ""}
          </div>
          <div>Location Name: {form.siLocationName.value}</div>
          <div>
            Address:{" "}
            {form.siStreetAddressLine1.value +
              " " +
              form.siStreetAddressLine2.value +
              " " +
              form.siCity.value +
              " " +
              form.siState.value.name +
              " " +
              form.siZipCode.value +
              " " +
              form.siCountry.value.name}
          </div>
          <div>
            Name: {form.siFirstName.value + " " + form.siLastName.value}
          </div>
          <div>Phone: {form.siOfficePhoneNumber.value}</div>
          <div>Mobile: {form.siMobileNumber.value}</div>
          <div>Fax: {form.siFaxNumber.value}</div>
          <div>Email: {form.siEmail.value}</div>

          <div>Shipping Hours: </div>
          <div>
            {shippingHours.map((hour, index) => (
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

          <div>Receiving Hours: </div>
          <div>
            {receivingHours.map((hour, index) => (
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

          <div>Your Preferences:</div>

          {form.siFlatbed.value.value === "Yes" ? (
            <span className="tw-inline-block tw-p-1 tw-bg-gray-200 tw-m-1 tw-rounded-sm">
              Flatbed
            </span>
          ) : null}
          {form.siBaggedPallets.value.value === "Yes" ? (
            <span className="tw-inline-block tw-p-1 tw-bg-gray-200 tw-m-1 tw-rounded-sm">
              Bagged Pallets
            </span>
          ) : null}
          {form.siHeatTreatedPallets.value.value === "Yes" ? (
            <span className="tw-inline-block tw-p-1 tw-bg-gray-200 tw-m-1 tw-rounded-sm">
              Heat Treated Pallets
            </span>
          ) : null}

          <div>Delivery Instructions: {form.siDeliveryInstructions.value}</div>
        </div>
      </div>
    );
  }
}
