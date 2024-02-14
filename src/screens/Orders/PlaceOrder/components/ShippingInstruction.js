import React, { Component } from "react";
import ToscaField from "./../../../../components/FormControls/ToscaField";
import Alert from "./../../../../components/Alert";
import Select from "react-select";

export default class ShippingInstruction extends Component {
  render() {
    let {
      newOrder,
      handleCustomerPickUpChange,
      shipTo,
      shipToList,
      isSelfPickup,
      DropdownIndicator,
      user,
      onShipToChange,
      reqShipTo,
      address,
      gotoDetails,
    } = this.props;
    return (
      <div>
        <div id="orderdiv" className="order-date-mobile">
          <p className="tw-m-0 tw-text-tosca-orange tw-text-left md:tw-text-right">
            Order Date
          </p>
          <p className="tw-m-0 tw-text-left tw-text-gray-600 md:tw-text-right">
            {newOrder.order_date}
          </p>
        </div>
        <div className="md:tw-flex md:tw-items-center tw-mb-6">
          <ToscaField
            name="orderType"
            elementType="input"
            inputType="text"
            value={"form.orderType.value"}
            label="Self Pick-up:"
            optionDisplayLabel="displayValue"
            optionValue="value"
            disabled={true}
          >
            <input
              className="mr-2 leading-tight tw-h-6 tw-w-6"
              type="checkbox"
              checked={newOrder.customerPickUp}
              onChange={handleCustomerPickUpChange}
            />
          </ToscaField>
        </div>

        <div className="md:tw-flex md:tw-items-center tw-mb-6">
          <ToscaField
            name="shipToLocation"
            elementType="input"
            inputType="text"
            value={"form.orderType.value"}
            label={isSelfPickup ? "My Order Location:" : "Ship to location:"}
            optionDisplayLabel="displayValue"
            optionValue="value"
          >
            <Select
              id="ship_to"
              options={shipToList}
              value={shipTo}
              className="react-select"
              components={{ DropdownIndicator }}
              onChange={(option) => onShipToChange(option, user)}
              isDisabled={false}
              backspaceRemovesValue={false}
              isLoading={this.props.isFetchingSourceAddresses}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  border: reqShipTo
                    ? "1px solid red"
                    : "1px solid rgba(126, 212,247,1)",
                }),
              }}
            />
          </ToscaField>
        </div>

        <div className="md:tw-flex md:tw-items-center tw-mb-6">
          <ToscaField
            name="shipToLocation"
            elementType="input"
            inputType="text"
            value={"form.orderType.value"}
            label={isSelfPickup ? "Location Address:" : "Shipping Address:"}
            optionDisplayLabel="displayValue"
            optionValue="value"
          >
            <textarea
              id="ship-to-address"
              className="form-control remove-border"
              value={address}
              readOnly
            />
          </ToscaField>
        </div>

        <div className="md:tw-flex md:tw-items-center tw-mb-6">
          <ToscaField
            name="shipToLocation"
            elementType="input"
            inputType="text"
            value={"form.orderType.value"}
            label="Transportation Instructions:"
            optionDisplayLabel="displayValue"
            optionValue="value"
          >
            <textarea
              className="form-control remove-border top-border-dark"
              id="transport"
              value={newOrder.transport_instructions}
              readOnly
              placeholder={
                shipTo !== ""
                  ? "To save Transportation Instructions for this location, please contact Customer Experience."
                  : null
              }
            />
          </ToscaField>
        </div>

        <div className="md:tw-flex md:tw-items-center tw-mb-6">
          <ToscaField
            name="shipToLocation"
            elementType="input"
            inputType="text"
            value={"form.orderType.value"}
            label="Loading Instructions:"
            optionDisplayLabel="displayValue"
            optionValue="value"
          >
            <textarea
              className="form-control remove-border top-border-dark"
              id="transport"
              value={newOrder.transport_instructions}
              readOnly
              placeholder={
                shipTo !== ""
                  ? "To save Loading Instructions for this location, please contact Customer Experience."
                  : null
              }
            />
          </ToscaField>
        </div>

        <div className="tw-flex tw-justify-end tw-mt-4">
          <div className="md:tw-w-1/3 hidden"></div>
          <div className="md:tw-w-2/3 md:tw-w-3/3">
            <Alert
              type="warning"
              msg="Include additional instructions for specific orders on Order Details form on the next page."
            />
          </div>
        </div>

        <div className="tw-flex tw-justify-end tw-mt-4">
          <button
            onClick={gotoDetails}
            className="tw-relative tw-bg-tosca-orange hover:tw-bg-orange-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
          >
            <span>Continue</span>
          </button>
        </div>
      </div>
    );
  }
}
