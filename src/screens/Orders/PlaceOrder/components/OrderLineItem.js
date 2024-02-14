import React, { Component } from "react";
import moment from "moment";
import ToscaField from "../../../../components/FormControls/ToscaField";
import Select, { components } from "react-select";
import { pagination_icons } from "../../../../images";
import LeadTimeWarning from "./LeadTimeWarning";
import CloneDeep from "lodash/cloneDeep";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { crate_icons } from "./../../../../images/index";
import Tooltip from "../../../../components/Tooltip";
import ImageContent from "../../../../components/Inventory/ImageContent";
import RpcOptionWithImage from "../../../../components/Inventory/RpcOptionWithImage";

export class OrderLineItem extends Component {
  state = {
    isEdit: false,
    showDelWarning: false,
    resetContType: false,
    updatedOrder: {},
    req_del_dateBlank: false,
    selectedClass: "",
  };

  editOrSave = () => {
    if (this.state.isEdit) {
      //If in edit mode then save

      let ord = this.state.updatedOrder;
      if (ord.quantity === "" || ord.quantity === "0" || isNaN(ord.quantity)) {
        return toast.error("Quantity is required");
      }

      if (ord.poNo === "") {
        return toast.error("PO Number is required");
      }

      this.props
        .checkDuplication(this.state.updatedOrder, this.props.index)
        .then((proceed) => {
          if (proceed) {
            let updatedOrder = CloneDeep(this.state.updatedOrder);
            for (let property in this.props.order) {
              this.props.order[property] = updatedOrder[property];
            }
            this.setState({ isEdit: false });
          } else {
            this.resetUpdatedOrder();
          }
        });
    } else {
      this.setState({ isEdit: true });
    }
  };

  resetUpdatedOrder = () => {
    this.setState({ updatedOrder: CloneDeep(this.props.order) });
  };

  closeEdit = () => {
    this.setState({
      isEdit: false,
      resetContType: false,
      updatedOrder: CloneDeep(this.props.order),
      req_del_dateBlank: false,
    });
  };

  onAddInstChange = (e) => {
    e.preventDefault();

    let updatedOrder = {
      ...this.state.updatedOrder,
      additionalInstructions: e.target.value,
    };

    this.setState({
      ...this.state,
      updatedOrder,
    });
  };

  handleLeadtimeWarningResponse = (response) => {
    if (response) {
      this.setState({ showDelWarning: false });
    } else {
      let updatedOrder = {
        ...this.state.updatedOrder,
        reqDelDate: moment().add(7, "days"),
      };
      this.setState({
        showDelWarning: false,
        updatedOrder,
      });
    }
  };

  handleDateSelect = (date) => {
    if (date && moment(date).isValid()) {
      if (date.isBefore(moment().add(6, "days"))) {
        this.setState({
          showDelWarning: true,
        });
      }

      this.setState({
        req_del_dateBlank: false,
      });
    } else {
      this.setState({
        req_del_dateBlank: true,
      });
    }
  };

  handleDateChange = (date) => {
    if (date && moment(date).isValid()) {
      date.set({
        hour: 12,
        minute: 0,
        second: 0,
      });

      let updatedOrder = { ...this.state.updatedOrder, reqDelDate: date };

      this.setState({
        updatedOrder,
        req_del_dateBlank: false,
      });
    } else {
      this.setState({
        req_del_dateBlank: true,
      });
    }
  };

  onPOChange = (e) => {
    e.preventDefault();

    const disallowed = [
      "@",
      "#",
      "$",
      "%",
      "/",
      "\\",
      "!",
      "&",
      "*",
      "^",
      "(",
      ")",
      "|",
      "'",
      '"',
      "<",
      ">",
      "+",
      "_",
    ];
    if (disallowed.some((sub) => e.target.value.includes(sub))) {
      return window.alert(
        `The character '${
          e.target.value[e.target.value.length - 1]
        }' is not allowed. Please use only letters, numbers, hyphens or periods.`,
      );
    }

    let updatedOrder = { ...this.state.updatedOrder, poNo: e.target.value };

    this.setState({
      ...this.state,
      updatedOrder,
    });
  };

  onContQuantityChange = (e) => {
    let updatedOrder = {
      ...this.state.updatedOrder,
      quantity: parseInt(e.target.value, 10),
    };

    this.setState({
      updatedOrder,
    });
  };

  onContClassChange = (option) => {
    this.setState({ resetContType: true, selectedClass: option });
  };

  onContTypeChange = (option) => {
    if (option.value) {
      this.setState({ resetContType: false });

      const containerInfo = this.props.orderInventory.find(
        (container) => container.itemId === option.value,
      );

      let updatedOrder = {
        ...this.state.updatedOrder,
        containerInfo: containerInfo,
        quantity: option["data-contqty"],
      };

      this.setState({
        updatedOrder,
      });
    }
  };

  componentDidMount = () => {
    this.props.order["getContType"] = function () {
      return {
        value: this.containerInfo.itemId,
        label: String(this.containerInfo.modelSize),
      };
    };

    this.props.order["getContClass"] = function () {
      return {
        value: this.containerInfo.itemClassKey,
        label: this.containerInfo.itemClassId,
      };
    };

    // Set the state values for that item
    // Put the orderStatus = 'EDIT'
    this.setState({
      updatedOrder: CloneDeep(this.props.order),
      selectedClass: this.props.options.contClassList.find(
        (x) => x.value === this.props.order.containerInfo.itemClassKey,
      ),
    });
  };

  checkQuantityWarning = (order) => {
    let result = {
      show: false,
      msg: "",
    };

    if (
      !this.props.customerPickUp &&
      order.quantity < order.containerInfo.totalQuantity
    ) {
      result = {
        show: true,
        msg: "Quantity is less than one (1) truckload and will require review after submitting this order.",
      };
    } else if (
      !this.props.customerPickUp &&
      order.quantity > order.containerInfo.totalQuantity
    ) {
      result = {
        show: true,
        msg: "Quantity is more than one (1) truckload and will be split into multiple orders.",
      };
    }

    return result;
  };

  quantityErrorMsg() {
    let { customerPickUp } = this.props;
    let { updatedOrder } = this.state;

    if (customerPickUp) {
      return updatedOrder.quantity === "0" || updatedOrder.quantity === ""
        ? "Quantity Required"
        : "";
    } else {
      return updatedOrder.quantity === "0" || updatedOrder.quantity === ""
        ? "Quantity Required"
        : "Uneven Truckload";
    }
  }

  render() {
    let { order, index, customerPickUp, validationStatus } = this.props;
    let { updatedOrder } = this.state;
    let { contClassList } = this.props.options;

    const contTypeList = this.props.options.contTypeList.filter((item) =>
      this.state["selectedClass"].value
        ? item["data-contclass"] ===
          parseInt(this.state["selectedClass"].value, 10)
        : item,
    );

    if (this.props.children) {
      return this.props.render(this);
    }

    return (
      <div>
        <ToastContainer />
        <div
          onClick={this.closeEdit}
          className={
            "tw-fixed tw-inset-0 " + (this.state.isEdit ? " " : " tw-hidden ")
          }
          style={{ background: "rgba(0,0,0,0.5)", zIndex: "1" }}
        ></div>

        <div
          className={`${
            this.state.isEdit
              ? "tw-fixed md:tw-relative tw-top-[50%] md:tw-top-auto tw-left-[50%]  md:tw-left-auto md:tw-translate-x-0 md:tw-translate-y-0 tw-translate-x-[-50%] tw-translate-y-[-50%] tw-z-30"
              : ""
          }`}
        >
          <div
            style={{
              zIndex: this.state.isEdit ? "1" : "initial",
              width:
                this.state.isEdit && this.props.width <= 425 ? "89vw" : "100%",
              borderRadius:
                this.state.isEdit && this.props.width < 1024 ? "2%" : "",
            }}
            className={
              (this.state.isEdit ? "tw-items-end" : "") +
              "tw-items-center tw-relative tw-cursor-pointer tw-flex tw-bg-white  tw-border-b hover:tw-bg-white hover:tw-text-gray-500 " +
              (this.state.isEdit ? "tw-py-3 " : " ") +
              (this.state.isEdit && this.props.width <= 425
                ? "tw-flex-col tw-py-3"
                : "") +
              (this.state.isEdit && this.props.width >= 768
                ? this.props.width < 1024 && this.props.width >= 768
                  ? "tw-flex-col tw-py-3"
                  : "tw-flex-row tw-py-3"
                : "")
            }
          >
            <div
              className={`tw-flex  
              ${
                this.state.isEdit && this.props.width >= 1024
                  ? "tw-w-[30%]"
                  : "tw-w-[100%]"
              } 
              ${
                this.state.isEdit && this.props.width <= 425
                  ? "tw-flex-col"
                  : "tw-flex-row"
              }`}
            >
              <div
                className={
                  this.state.isEdit
                    ? this.props.width <= 425
                      ? "tw-self-start tw-w-[100%]"
                      : "tw-w-1/2 tw-self-end"
                    : "tw-w-[50%] tw-self-center md:tw-self-center"
                }
              >
                {this.state.isEdit ? (
                  <div className="tw-px-2">
                    <ToscaField
                      name=""
                      isVertical={true}
                      label="Commodity Type"
                      showLabel={true}
                    >
                      <Select
                        options={contClassList}
                        value={this.state.selectedClass}
                        className="react-select"
                        components={{ DropdownIndicator }}
                        onChange={(option) => this.onContClassChange(option)}
                        isDisabled={false}
                      />
                    </ToscaField>
                  </div>
                ) : (
                  <div className=" tw-px-2 tw-py-3">
                    {this.state.selectedClass.label}
                  </div>
                )}
              </div>
              <div
                className={
                  this.state.isEdit
                    ? this.props.width <= 425
                      ? "tw-self-start tw-w-[100%]"
                      : "tw-w-1/2 tw-self-end"
                    : "tw-w-[33%] tw-self-center "
                }
                style={{ marginTop: this.state.isEdit ? "9px" : "" }}
              >
                {this.state.isEdit ? (
                  <div className="tw-px-2">
                    <ToscaField
                      name=""
                      isVertical={true}
                      label="RPC Size"
                      showLabel={true}
                    >
                      <Select
                        id="contType"
                        options={contTypeList}
                        value={
                          this.state.resetContType
                            ? null
                            : updatedOrder.getContType()
                        }
                        className="react-select"
                        components={{
                          DropdownIndicator,
                          ...(this.state.width >= 1024
                            ? { Option: RpcOptionWithImage }
                            : {}),
                        }}
                        onChange={(option) => this.onContTypeChange(option)}
                        isDisabled={false}
                      />
                    </ToscaField>
                  </div>
                ) : (
                  <div className=" tw-px-2 tw-py-3">
                    <div>
                      <Tooltip
                        content={
                          <div className="tw-w-52 tw-h-52 tw-text-center tw-px-4 tw-py-4">
                            <span className="tw-uppercase">
                              {order.containerInfo.itemBrand}{" "}
                              {order.containerInfo.itemClassId}
                            </span>
                            <p className="tw-font-bold">
                              {order.containerInfo.modelSize}
                            </p>
                            <div className="tw-relative tw-w-full tw-h-32">
                              <ImageContent rawData={order.containerInfo} />
                            </div>
                          </div>
                        }
                        config={{
                          zIndex: "99",
                          theme: "light",
                          trigger: "mouseenter focus",
                          placement: "top",
                        }}
                      >
                        <img
                          src={crate_icons.crate}
                          alt="Crate icon"
                          className="tw-w-8 tw-mr-2"
                        />
                      </Tooltip>
                      {order.containerInfo.modelSize}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* --------------------- */}
            <div
              className={`tw-flex  
              ${
                this.state.isEdit && this.props.width >= 1024
                  ? "tw-w-[25%]"
                  : "tw-w-[100%]"
              } 
              ${
                this.state.isEdit && this.props.width <= 425
                  ? "tw-flex-col"
                  : "tw-flex-row"
              }`}
            >
              <div
                className={
                  this.state.isEdit
                    ? this.props.width <= 425
                      ? "tw-self-start tw-w-[100%]"
                      : "tw-w-1/2 tw-self-end"
                    : "tw-w-[50%] tw-self-center "
                }
                style={{ marginTop: this.state.isEdit ? "9px" : "" }}
              >
                {this.state.isEdit ? (
                  <div className="tw-px-2">
                    <ToscaField
                      name=""
                      isVertical={true}
                      elementType="input"
                      inputType="number"
                      min="0"
                      value={updatedOrder.quantity}
                      label="Quantity"
                      showLabel={true}
                      hasError={this.checkQuantityWarning(updatedOrder).show}
                      errorMsg={this.quantityErrorMsg()}
                      onChange={this.onContQuantityChange}
                    />
                  </div>
                ) : (
                  <div className=" tw-px-2 tw-py-3">{order.quantity}</div>
                )}
              </div>

              <div
                className={
                  this.state.isEdit
                    ? this.props.width <= 425
                      ? "tw-self-start tw-w-[100%]"
                      : "tw-w-1/2 tw-self-end"
                    : "tw-w-[50%] tw-self-center "
                }
                style={{ marginTop: this.state.isEdit ? "9px" : "" }}
              >
                {this.state.isEdit ? (
                  <div className="tw-px-2">
                    <ToscaField
                      name=""
                      isVertical={true}
                      elementType="input"
                      inputType="text"
                      value={updatedOrder.poNo}
                      label="PO Number"
                      placeholder="#"
                      onChange={this.onPOChange}
                      hasError={this.state.updatedOrder.poNo.length === 0}
                      errorMsg={
                        this.state.updatedOrder.poNo.length === 0
                          ? "PO Number Required"
                          : ""
                      }
                      showLabel={true}
                    />
                  </div>
                ) : (
                  <div className=" tw-px-2 tw-py-3">{order.poNo}</div>
                )}
              </div>
            </div>
            {/* --------------------- */}
            <div
              className={`tw-flex  
              ${
                this.state.isEdit && this.props.width >= 1024
                  ? "tw-w-[25%]"
                  : "tw-w-[100%]"
              } 
              ${
                this.state.isEdit && this.props.width <= 425
                  ? "tw-flex-col"
                  : "tw-flex-row"
              }`}
            >
              <div
                className={
                  this.state.isEdit
                    ? this.props.width <= 425
                      ? "tw-self-start tw-w-[100%]"
                      : "tw-w-1/2 tw-self-end"
                    : "tw-w-[50%] tw-self-center "
                }
                style={{ marginTop: this.state.isEdit ? "9px" : "" }}
              >
                {this.state.isEdit ? (
                  <div className="tw-px-2">
                    <ToscaField
                      dateClass="tw-w-full"
                      name="req_del_date"
                      isVertical={true}
                      elementType="date"
                      value={this.state.updatedOrder.reqDelDate}
                      showLabel={true}
                      label={
                        customerPickUp
                          ? "Requested Pickup Date"
                          : "Requested Delivery Date"
                      }
                      onChange={this.handleDateChange}
                      hasError={this.state.req_del_dateBlank}
                      errorMsg="Date is Required"
                      datePickerConfig={{
                        onSelect: this.handleDateSelect,
                        minDat: moment(),
                      }}
                    />
                  </div>
                ) : (
                  <div className=" tw-px-2 tw-py-3">
                    {moment(order.reqDelDate).isValid()
                      ? moment(order.reqDelDate).format("MM/DD/YYYY")
                      : ""}
                  </div>
                )}
              </div>
              <div
                className={`tw-flex  
              ${
                this.state.isEdit && this.props.width >= 1024
                  ? "tw-items-end tw-w-[50%]"
                  : "md:tw-w-[50%]"
              } 
              ${
                this.state.isEdit && this.props.width <= 425
                  ? "tw-flex-col"
                  : "tw-flex-row"
              }`}
                style={{ marginTop: this.state.isEdit ? "9px" : "" }}
              >
                {this.state.isEdit ? (
                  <div className="tw-px-2 tw-w-full">
                    <ToscaField
                      name=""
                      isVertical={true}
                      value={updatedOrder.quantity}
                      label="Additional Instructions"
                      showLabel={true}
                    >
                      <textarea
                        className="form-control select-color"
                        id="additional_instructions"
                        style={{ height: "38px" }}
                        value={updatedOrder.additionalInstructions}
                        onChange={this.onAddInstChange}
                      />
                    </ToscaField>
                  </div>
                ) : (
                  <div className=" tw-px-2 tw-py-3">
                    {order.additionalInstructions}
                  </div>
                )}
              </div>
            </div>

            <div
              className="tw-flex tw-flex-col sm:tw-flex-row"
              style={{
                marginTop: this.state.isEdit ? "9px" : "",
                width:
                  this.state.isEdit && this.props.width <= 768
                    ? "100%"
                    : this.state.isEdit && this.props.width > 768
                    ? "20%"
                    : "50%",
                alignItems:
                  this.state.isEdit && this.props.width <= 768
                    ? "flex-start"
                    : "flex-end",
              }}
            >
              <div className="tw-px-2 tw-py-3- tw-flex tw-w-full">
                <button
                  disabled={
                    !this.state.resetContType &&
                    updatedOrder.quantity !== "0" &&
                    updatedOrder.quantity !== "" &&
                    updatedOrder.poNo !== "" &&
                    !isNaN(updatedOrder.quantity) &&
                    !this.state.req_del_dateBlank
                      ? false
                      : true
                  }
                  onClick={(e) => this.editOrSave(e, index)}
                  className="tw-text-white tw-text-right tw-px-4 tw-mr-2 tw-whitespace-nowrap- tw-bg-tosca-orange tw-rounded disabled:tw-bg-gray-400"
                >
                  {this.state.isEdit
                    ? validationStatus === "loading"
                      ? "Wait..."
                      : "Save"
                    : "Edit"}
                </button>

                {this.state.isEdit ? (
                  <button
                    onClick={(e) => {
                      this.closeEdit();
                    }}
                    className="tw-text-tosca-orange tw-text-right tw-whitespace-nowrap- tw-rounded tw-border tw-border-gray-500 tw-bg-white tw-px-3 tw-py-2"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      this.props.remove(e);
                    }}
                    className="tw-text-tosca-orange tw-text-right tw-whitespace-nowrap- tw-rounded tw-border tw-border-gray-500 tw-bg-white tw-px-4 tw-py-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            <LeadTimeWarning
              visible={this.state.showDelWarning}
              response={this.handleLeadtimeWarningResponse}
            />
          </div>
        </div>
      </div>
    );
  }
}

const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <img
          src={pagination_icons.DownArrow}
          alt="left arrow"
          width={20}
          height={20}
        />
      </components.DropdownIndicator>
    )
  );
};

export default OrderLineItem;
