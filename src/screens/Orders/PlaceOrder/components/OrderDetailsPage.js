import React, { Component } from "react";
import Alert from "./../../../../components/Alert";
import ToscaField from "./../../../../components/FormControls/ToscaField";
import Select from "react-select";
import OrderLineItem from "./OrderLineItem";
import moment from "moment";
import _ from "lodash";

import RpcOptionWithImage from "./../../../../components/Inventory/RpcOptionWithImage";

export default class OrderDetailsPage extends Component {
  state = {
    palletStackId: 84,
    width: window.innerWidth,
  };
  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  isValidEntry = () => {
    return (
      this.props.contClass &&
      this.props.contType &&
      this.props.contQuantity !== "0" &&
      this.props.contQuantity !== "" &&
      !this.props.req_del_dateBlank &&
      this.props.po_no !== "" &&
      this.props.contType.value
    );
  };

  enableSubmit = () => {
    return (
      (this.isValidEntry() || this.props.newOrder.orderList.length !== 0) &&
      !this.props.submitting
    );
  };

  isSingleOrder = () => {
    return this.props.orderList.length === 0 ? true : false;
  };

  submitOrder = (e) => {
    let orderList = this.isSingleOrder()
      ? [this.buildOrderListItem()]
      : this.props.orderList;
    this.props.submitOrder(e, orderList);
  };

  buildOrderListItem = () => {
    const {
      contType,
      contQuantity,
      po_no,
      req_del_date,
      additional_instructions,
    } = this.props;
    const containerInfo = this.props.orderInventory.find(
      (container) => container.itemId === contType.rawData.itemId,
    );

    return {
      containerInfo,
      quantity: parseInt(contQuantity, 0),
      poNo: po_no,
      reqDelDate: moment(req_del_date).format("YYYY-MM-DD"),
      additionalInstructions: additional_instructions,
      useAsLid: false,
    };
  };

  quantityErrorMsg() {
    let { newOrder, contQuantity } = this.props;
    if (newOrder.customerPickUp) {
      return contQuantity === "0" || contQuantity === ""
        ? "Quantity Required"
        : "";
    } else {
      return contQuantity === "0" || contQuantity === ""
        ? "Quantity Required"
        : "Uneven Truckload";
    }
  }

  filterContClassList = (product, colour) => {
    if (product || colour) {
      const contClassList = [];

      this.props.orderInventory
        .filter((item) =>
          product.value ? item.itemBrand === product.value : item,
        )
        .filter((item) =>
          colour.value ? item.itemColor === colour.value : item,
        )
        .filter(
          (val, i, arr) =>
            arr.findIndex((t) => t.itemClassKey === val.itemClassKey) === i,
        )
        .map((orderClass) => {
          return contClassList.push({
            value: orderClass.itemClassKey,
            label:
              orderClass.itemClassId === "Handheld"
                ? "Case Ready Meat"
                : orderClass.itemClassId === "640"
                ? "Cheese"
                : orderClass.itemClassId,
          });
        });

      return contClassList;
    }

    return this.props.contClassList;
  };

  filterContTypeList = (product, colour) => {
    if (product || colour) {
      const contTypeList = [];

      this.props.orderInventory
        .filter((item) =>
          this.props.contClass.value
            ? item.itemClassKey === parseInt(this.props.contClass.value, 10)
            : item,
        )
        .filter((item) =>
          product.value ? item.itemBrand === product.value : item,
        )
        .filter((item) =>
          colour.value ? item.itemColor === colour.value : item,
        )
        .map((orderType) => {
          return contTypeList.push({
            value: orderType.itemId,
            label: orderType.modelSize,
            "data-contclass": orderType.itemClassKey,
            "data-contqty": orderType.totalQuantity,
            "data-item-description": orderType.itemDescription,
            rawData: orderType,
          });
        });

      return contTypeList;
    }

    return this.props.contTypeList;
  };

  render() {
    let {
      newOrder,
      quantityError,
      showQuantityWarning,
      contClassList,
      contProductsList,
      contColorList,
      DropdownIndicator,
      onContClassChange,
      onContProductChange,
      onContColorChange,
      contTypeList,
      contType,
      onContTypeChange,
      contQuantity,
      onContQuantityChange,
      poNo,
      po_no,
      onPOChange,
      poBlank,
      req_del_date,
      req_del_dateBlank,
      handleDateChange,
      handleDateSelect,
      additional_instructions,
      onAddInstChange,
      addOrderList,
      clearOrderItem,
      orderList,
      user,
      removeOrderListItem,
      alertDuplication,
      gotoBasic,
      contClass,
      contProduct,
      contColor,
      contItemDescription,
      validationStatus,
    } = this.props;

    return (
      <div id="orderMaindiv">
        <div>
          <p className="tw-m-0 w-text-left tw-text-tosca-orange  md:tw-text-right">
            Order Date
          </p>
          <p className="tw-m-0 tw-text-left tw-text-gray-600 md:tw-text-right">
            {newOrder.order_date}
          </p>
        </div>
        <div>
          <Alert
            type="warning"
            msg={quantityError}
            show={showQuantityWarning}
          />
        </div>
        <div id="orderdetaildivone" className="md:tw-grid tw-grid-cols-2">
          <div className="md:tw-flex tw-pt-4 tw-items-end tw--mx-2">
            <div className="tw-w-2/2 md:tw-w-1/2 tw-whitespace-nowrap-">
              <div className="tw-px-2">
                <ToscaField
                  name=""
                  isVertical={true}
                  elementType="input"
                  inputType="text"
                  label="Container Type"
                  optionDisplayLabel="displayValue"
                  optionValue="value"
                  hasError={true}
                >
                  <Select
                    id="contClass"
                    options={contProductsList}
                    value={contProduct}
                    className="react-select"
                    components={{ DropdownIndicator }}
                    onChange={(option) => onContProductChange(option)}
                    isDisabled={false}
                  />
                </ToscaField>
              </div>
            </div>
          </div>
          <div className="md:tw-flex tw-pt-4 tw-items-end tw--mx-2">
            <div className="tw-w-2/2 md:tw-w-1/2 tw-whitespace-nowrap-">
              <div className="tw-px-2">
                <ToscaField
                  name=""
                  isVertical={true}
                  elementType="input"
                  inputType="text"
                  label="Color"
                  optionDisplayLabel="displayValue"
                  optionValue="value"
                  hasError={true}
                >
                  <Select
                    id="contClass"
                    options={contColorList}
                    value={contColor}
                    className="react-select"
                    components={{ DropdownIndicator }}
                    onChange={(option) => onContColorChange(option)}
                    isDisabled={false}
                  />
                </ToscaField>
              </div>
            </div>
          </div>
        </div>
        <div
          id="orderdetaildivtwo"
          className="md:tw-flex tw-pt-4 tw-items-end tw--mx-2"
        >
          <div className="tw-w-2/2 md:tw-w-1/2 tw-whitespace-nowrap-">
            <div className="tw-px-2">
              <ToscaField
                name=""
                isVertical={true}
                elementType="input"
                inputType="text"
                label="Commodity Type"
                optionDisplayLabel="displayValue"
                optionValue="value"
                hasError={true}
              >
                <Select
                  id="contClass"
                  options={contClassList}
                  value={contClass}
                  className="react-select"
                  components={{ DropdownIndicator }}
                  onChange={(option) => onContClassChange(option)}
                  isDisabled={false}
                />
              </ToscaField>
            </div>
          </div>
          <div className="tw-w-2/2 order-details-margin md:tw-w-1/2">
            <div className="tw-px-2">
              <ToscaField
                name=""
                elementType="input"
                isVertical={true}
                inputType="text"
                label="RPC Size"
              >
                <Select
                  id="contType"
                  options={contTypeList}
                  value={contType}
                  className="react-select"
                  components={{
                    DropdownIndicator,
                    ...(this.state.width > 768
                      ? { Option: RpcOptionWithImage }
                      : {}),
                  }}
                  onChange={(option) => onContTypeChange(option, contClass)}
                  isDisabled={false}
                />
              </ToscaField>
            </div>
          </div>
          <div className="tw-w-2/2 order-details-margin md:tw-w-1/2 tw-relative">
            <div className="tw-px-2">
              <ToscaField
                name=""
                isVertical={true}
                elementType="input"
                inputType="number"
                value={contQuantity}
                label="Quantity"
                hasError={
                  showQuantityWarning ||
                  (contType && (contQuantity === "0" || contQuantity === ""))
                }
                errorMsg={this.quantityErrorMsg()}
                onChange={onContQuantityChange}
              />
            </div>
            {this.state.palletStackId === contClass.value ? (
              <div className="tw-px-2 tw-mt-2 tw-absolute">
                <ToscaField
                  name=""
                  isVertical={true}
                  elementType="input"
                  inputType="number"
                  value={contQuantity * 40}
                  label="Unit Pallet QTY "
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="tw-w-2/2 order-details-margin md:tw-w-1/2">
            <div className="tw-px-2">
              <ToscaField
                name=""
                ref={poNo}
                isVertical={true}
                elementType="input"
                inputType="text"
                value={po_no}
                label="PO Number"
                placeholder="#"
                onChange={onPOChange}
                onBlur={onPOChange}
                hasError={poBlank}
                errorMsg={po_no === "" ? "PO Number Required" : ""}
              />
              <div
                id="ponumbernote"
                style={{ width: this.state.width <= 768 ? "84px" : "" }}
                className="tw-absolute tw-text-gray-600 tw-text-xs xs:tw-whitespace-nowrap"
              >
                Enter "none" if unknown.
              </div>
            </div>
          </div>

          <div
            id="requestDate"
            className="tw-w-2/2 md:tw-w-1/2 order-details-margin"
          >
            <div className="tw-px-2">
              <ToscaField
                dateClass="tw-w-full"
                name="req_del_date"
                isVertical={true}
                elementType="date"
                value={req_del_date}
                label={
                  newOrder.customerPickUp
                    ? "Requested Pickup Date"
                    : "Requested Delivery Date"
                }
                onChange={handleDateChange}
                hasError={req_del_dateBlank}
                errorMsg="Date is Required"
                datePickerConfig={{
                  onSelect: handleDateSelect,
                  minDate: newOrder.customerPickUp
                    ? moment()
                    : moment().add(1, "days"),
                }}
              />
            </div>
          </div>
          <div className="tw-w-6/6 md:tw-w-5/6 tw-whitespace-nowrap- order-details-margin">
            <div className="tw-px-2">
              <ToscaField
                name="shipToLocation"
                elementType="input"
                isVertical={true}
                inputType="text"
                value={"form.orderType.value"}
                label="Additional Instructions"
                optionDisplayLabel="displayValue"
                optionValue="value"
              >
                <textarea
                  className="form-control select-color"
                  id="additional_instructions"
                  style={{ height: "38px" }}
                  value={additional_instructions}
                  onChange={onAddInstChange}
                />
              </ToscaField>
            </div>
          </div>
        </div>
        {!_.isEmpty(contItemDescription) ? (
          <div className="">
            <div
              id="descriptionRPC"
              className="tw-flex tw-flex-wrap tw-mt-5 tw-w-12/12 md:tw-w-9/12"
            >
              <ToscaField
                isVertical={true}
                elementType="description"
                name="descriptionRPC"
                elementClass="tw-h-20"
                value={contItemDescription}
                label="RPC Description"
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="tw-flex tw-justify-end tw-mt-3">
          <div className="tw-flex tw-justify-between">
            <button
              disabled={!this.isValidEntry()}
              onClick={() => addOrderList()}
              className="tw-text-white tw-text-right tw-px-4 tw-py-2 tw-mr-2 tw-whitespace-nowrap- tw-bg-tosca-orange tw-rounded disabled:tw-bg-gray-400"
            >
              {validationStatus === "loading"
                ? "Please wait..."
                : "Add to Order"}
            </button>
            <button
              onClick={() => {
                clearOrderItem();
              }}
              className="tw-text-tosca-orange tw-text-right tw-whitespace-nowrap- tw-rounded tw-border tw-border-gray-500 tw-bg-white tw-px-4 tw-py-2"
            >
              Clear
            </button>
          </div>
        </div>

        <div
          style={{
            overflow:
              orderList.length && this.state.width <= 425 ? "scroll" : "",
            display: orderList.length && this.state.width <= 425 ? "grid" : "",
          }}
          className={
            "tw-overflow-visible tw-border tw-mt-10 tw-overflow-hidden tw-rounded tw-rounded-lg tw-shadow " +
            (!orderList.length && "tw-hidden")
          }
        >
          <div className="tw-relative tw-cursor-pointer tw-w-[960px]  md:tw-w-full tw-flex tw-items-start tw-border-b hover:tw-bg-white hover:tw-text-gray-500  tw-bg-white  md:tw-hidden">
            <div className="tw-w-[14%] tw-self-center order-mobile-grid-width">
              <div className=" tw-px-2 tw-py-3">Commodity Type</div>
            </div>
            <div className="tw-w-[14%] tw-self-center order-mobile-grid-width">
              <div className=" tw-px-2 tw-py-3">RPC Size</div>
            </div>
            <div className="tw-w-[14%] tw-self-center order-mobile-grid-width">
              <div className=" tw-px-2 tw-py-3">Quantity</div>
            </div>
            <div className="tw-w-[14%] tw-self-center order-mobile-grid-width">
              <div className=" tw-px-2 tw-py-3">PO Number</div>
            </div>
            <div className="tw-w-[14%] tw-self-center order-mobile-grid-width">
              <div className=" tw-px-2 tw-py-3">Requested Deleivery Date</div>
            </div>
            <div className="tw-w-[14%] tw-self-center order-mobile-grid-width">
              <div className="tw-px-2 tw-py-3- tw-flex tw-justify-end">
                Additional Information
              </div>
            </div>
            <div className="tw-w-[14%] tw-self-center order-mobile-grid-width">
              <div className=" tw-px-2 tw-py-3"></div>
            </div>
          </div>

          {orderList.map((order, index) => (
            <OrderLineItem
              key={index}
              validationStatus={validationStatus}
              order={order}
              index={index}
              user={user}
              orderInventory={this.props.orderInventory}
              remove={(e) => removeOrderListItem(e, index)}
              checkDuplication={alertDuplication}
              customerPickUp={newOrder.customerPickUp}
              options={{
                contClassList: this.filterContClassList(
                  order.contProduct,
                  order.contColor,
                ),
                contTypeList: this.filterContTypeList(
                  order.contProduct,
                  order.contColor,
                ),
              }}
              width={this.state.width}
            />
          ))}
        </div>

        <div className="tw-flex tw-justify-between tw-mt-4">
          <button
            onClick={gotoBasic}
            className="tw-relative tw-bg-tosca-blue hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
          >
            <span>Back</span>
          </button>

          <button
            disabled={!this.enableSubmit()}
            onClick={this.submitOrder}
            className="tw-relative tw-bg-tosca-orange hover:tw-bg-orange-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
          >
            <span>Submit</span>
          </button>
        </div>
      </div>
    );
  }
}
