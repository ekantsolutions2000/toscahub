import React, { Component } from "react";
import Steps from "./CollectionOrderNavigation";
import TextBox from "../../../components/FormControls/TextBox";
import TextArea from "../../../components/FormControls/TextArea";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import CloneDeep from "lodash/cloneDeep";
import ToscaField from "../../../components/FormControls/ToscaField";
import ToolTip from "../../../components/Tooltip";
import { collectionOrders } from "../../../images";
import _ from "lodash";
import { config } from "../../../utils/conf";
import InfoIcon from "../../../components/InfoIcon";
import CollectionOrderList from "./CollectionOrderList";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";
import Button from "../../../components/Button/Button";

export class OrderDetail extends Component {
  state = {
    formName: "orderDetails",
    showRPCModal: false,
    currentlySelectedRPC: "",
    noOfcurrentlySelectedRPC: 0,
    modalError: "",
    showLeadTimeWarning: false,
    leadTimeDuration: 48,
    width: window.innerWidth,
  };

  componentDidMount = () => {
    window.addEventListener("resize", this.updateDimensions);
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  handleDateChange = (date, field) => {
    this.props.form.onChange(field, date);

    if (field === "pickupDate") {
      let deteDiff = moment(date).diff(moment(), "hours");
      if (deteDiff < this.state.leadTimeDuration - 24) {
        this.setState({ showLeadTimeWarning: true });
      }
    }

    if (field === "pickupTimeStart") {
      const startDate = moment(this.props.form.pickupDate.value).format(
        "YYYY-MM-DD",
      );
      const startTime = moment(date).format("HH:mm");
      const startDateTime = moment(startDate + " " + startTime);
      const diff = moment(startDateTime).diff(moment(), "hours");

      if (diff < this.state.leadTimeDuration) {
        this.setState({ showLeadTimeWarning: true });
      }
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  removeItem = (itmIndex) => {
    let items = CloneDeep(this.props.form.rpcItems.value);
    let newItems = items.filter((i, index) => index !== itmIndex);

    this.props.form.onChange("rpcItems", newItems);
  };

  showRPCModal = () => {
    this.setState({ showRPCModal: true });
  };

  onModalClose = () => {
    this.setState({ showRPCModal: false });
    this.resetModalForm();
  };

  resetModalForm = () => {
    this.setState({ currentlySelectedRPC: "", noOfcurrentlySelectedRPC: 0 });
  };

  addItem = () => {
    this.setState({ modalError: "" });

    let qty = parseFloat(this.state.noOfcurrentlySelectedRPC);
    let rpcId = this.state.currentlySelectedRPC.itemId;

    if (!rpcId || rpcId.toString().trim() === "") {
      this.setState({ modalError: `Please select an RPC Size` });
      return null;
    }

    if (qty === "" || qty === "0" || qty <= 0) {
      this.setState({ modalError: `Please enter a valid quantity` });
      return null;
    }

    let selectedItem = {
      ...this.props.formData.rpcSizeOptions.find((i) => i.itemId === rpcId),
      qty: qty,
    };
    let updatedItems = CloneDeep(this.props.form.rpcItems.value);
    let totalQty = updatedItems.reduce((acc, cur) => {
      return acc + parseFloat(cur.qty);
    }, 0);
    if (totalQty + qty > 60) {
      this.setState({
        modalError: `Total number of pallets cannot exceed 60. Total: ${
          totalQty + qty
        }`,
      });
      return null;
    }

    let itm = updatedItems.find((itm) => itm.itemId === rpcId);
    if (itm) {
      itm.qty = itm.qty + qty;
    } else {
      updatedItems.push(selectedItem);
    }
    this.props.form.onChange("rpcItems", updatedItems);
    this.resetModalForm();

    return true;
  };

  submitItem = () => {
    if (this.addItem()) this.onModalClose();
  };

  gotoStep = (step) => {
    this.props.navigateTo(step);
  };

  render() {
    let form = this.props.form;
    let isLiveLoading = this.props.methods.isLiveLoad();
    let selectedRpcItems = this.props.form.rpcItems.value;
    let rpcSizeOptions = this.props.methods.getRpcSizeOptions();
    let minPickupDate = moment();
    if (
      !moment(form.pickupDate.value)
        .startOf("day")
        .isSame(moment().startOf("day"))
    ) {
      minPickupDate = moment(minPickupDate).startOf("day");
    }
    // const minStartTime = moment(minPickupDate)
    //   .hours(moment(minPickupDate).hours())
    //   .minutes(moment(minPickupDate).minutes());
    // const minEndTime = moment()
    //   .hours(moment(form.pickupTimeStart.value).hours())
    //   .minute(moment(form.pickupTimeStart.value).minutes());

    return (
      <div className="tw-bg-white tw-mx-auto tw-p-2 tw-p-4 tw-rounded tw-shadow-2xl md:tw-px-12">
        <Steps gotoStep={(step) => this.gotoStep(step)} activeStep={1}></Steps>

        <ConfirmationModal
          title="Lead time warning"
          brand="default"
          show={this.state.showLeadTimeWarning}
          onClose={() => this.setState({ showLeadTimeWarning: false })}
        >
          <p>
            The carrier needs to have a 48 hour lead time for pick up. If the
            order is booked for less than 48 hours, please note it may not be
            picked up at the scheduled time.
          </p>

          <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
            <Button
              brand="secondary"
              type="button"
              fullwidth="true"
              onClick={() => {
                this.setState({ showLeadTimeWarning: false });
              }}
            >
              OK
            </Button>
          </div>
        </ConfirmationModal>

        <div className="tw-mt-16">
          <div className="md:tw-flex md:tw-items-center tw-mb-6">
            <ToscaField
              name="orderType"
              elementType="reactselect"
              value={form.orderType.value}
              label="Order Type*:"
              options={form.orderType.options}
              getOptionLabel={(option) => option.displayValue}
              onBlur={(e) => form.onBlur("orderType")}
              onChange={(option) => form.onChange("orderType", option)}
              disabled={true}
            />
          </div>

          <div className="md:tw-flex md:tw-items-start tw-mb-6">
            <ToscaField
              name="loadingType"
              elementType="reactselect"
              value={form.loadingType.value}
              label="Loading Type*:"
              options={form.loadingType.options}
              getOptionLabel={(option) => option.displayValue}
              hasError={!form.loadingType.isValid}
              errorMsg={form.loadingType.errorMsg}
              onBlur={(e) => form.onBlur("loadingType")}
              onChange={(option) => form.onChange("loadingType", option)}
            />
          </div>

          {isLiveLoading ? null : (
            <React.Fragment>
              {/* <div className="md:tw-flex md:tw-items-start tw-mb-6">
                        <ToscaField name="carrier"
                            elementType="reactselect"
                            value={form.carrier.value} 
                            label="Carrier*:"
                            options={form.carrier.options}
                            getOptionLabel={(option) => option.displayValue}
                            hasError={!form.carrier.isValid}
                            errorMsg={form.carrier.errorMsg}
                            onBlur={(e) => form.onBlur('carrier')}
                            onChange={(option) => form.onChange('carrier', option)} 
                        />                       
                    </div> */}

              <div className="md:tw-flex md:tw-items-center tw-mb-6">
                <ToscaField
                  name="trailerNo"
                  value={form.trailerNo.value}
                  label="Trailer Number*:"
                  hasError={!form.trailerNo.isValid}
                  errorMsg={form.trailerNo.errorMsg}
                  onBlur={(e) => form.onBlur("trailerNo")}
                  onChange={(e) => form.onChange("trailerNo", e.target.value)}
                  placeholder=""
                />
              </div>
            </React.Fragment>
          )}

          <div className="md:tw-flex md:tw-items-center tw-mb-6">
            <div className="md:tw-w-1/3">
              <label className="tw-block tw-text-tosca-orange tw-font-bold md:tw-text-right-- tw-mb-1 md:tw-mb-0 tw-pr-4">
                RPC Details*:
              </label>
            </div>
            <div className="md:tw-w-1/3">
              <table className="md:tw-table-fixed tw-w-full tw-text-xs tw-grid ">
                <thead>
                  <tr>
                    <th className="tw-w-2/3 tw-px-4 tw-py-2 tw-border-b tw-border-gray-400 tw-align-middle">
                      <div className="tw-flex">
                        RPC Size
                        <ToolTip
                          disabled={this.state.width <= 768}
                          content={
                            <p className="tw-text-left tw-m-0 tw-py-2 tw-text-gray-600 tw-font-light tw-text-sm">
                              {"TL-64XX: Tosca/GP produce RPCs"}
                              <br />
                              {"TL-64XXX: Hays/Orbis produce RPCs"}
                              <br />
                              {"TL-6428: Tosca/GP 6428 RPCs"}
                              <br />
                              {"TL-6428HH: Food Lion pork RPCs"}
                              <br />
                              {"TL-63XX: Tosca egg RPCs"}
                              <br />
                              {"TL-65XXX: Tosca meat RPCs"}
                              <br />
                              {"PL-64XX: Polymer produce RPCs"}
                              <br />
                              {"PL-63XX: Polymer egg RPCs"}
                              <br />
                              {"PL-65XXX: Polymer meat RPCs"}
                              <br />
                              {
                                "I-PDSort: Mixed produce RPCs (all Poolers: IFCO, Polymer, Tosca)"
                              }
                              <br />
                            </p>
                          }
                          config={{ arrow: false, theme: "light" }}
                        >
                          <img
                            src={collectionOrders.info}
                            alt="info"
                            className="tw-w-5 tw-h-5 tw-ml tw-ml-2"
                          />
                        </ToolTip>
                      </div>
                    </th>
                    <th className="tw-w-2/3 tw-px-4 tw-py-2 tw-border-b tw-border-gray-400">
                      Number of Pallets
                    </th>
                    <th className="tw-w-10 tw-px-4 tw-py-2 tw-border-b tw-border-gray-400"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRpcItems.map((itm, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "tw-bg-gray-100" : null}
                    >
                      <td className="tw-border tw-w-2/3 tw-px-4">
                        <div className="tw-flex tw-justify-between">
                          <div className="md:tw-pr-4 tw-py-2">
                            {itm.modelSize}
                          </div>
                          {!config.hideCopProductDescriptions ? (
                            <ToolTip
                              disabled={this.state.width <= 768}
                              content={
                                <div className="tw-p-4">
                                  <div className="tw-text-tosca-orange">
                                    {itm.modelSize} :
                                  </div>
                                  <p className="tw-text-left tw-m-0 tw-py-2 tw-text-gray-600 tw-font-light tw-text-sm">
                                    {itm.productDescription}
                                  </p>
                                </div>
                              }
                              config={{
                                arrow: true,
                                theme: "light",
                                placement: "right",
                              }}
                            >
                              <div>
                                <InfoIcon />
                              </div>
                            </ToolTip>
                          ) : (
                            ""
                          )}
                        </div>
                      </td>
                      <td className="tw-border tw-px-4 md:tw-py-2 tw-w-2/3">
                        {itm.qty}
                      </td>
                      <td className="tw-border md:tw-px-4 md:tw-py-2">
                        <button
                          className="tw-bg-transparent"
                          onClick={() => this.removeItem(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="tw-fill-current tw-w-4"
                          >
                            <path d="M8 6V4c0-1.1.9-2 2-2h4a2 2 0 012 2v2h5a1 1 0 010 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8H3a1 1 0 110-2h5zM6 8v12h12V8H6zm8-2V4h-4v2h4zm-4 4a1 1 0 011 1v6a1 1 0 01-2 0v-6a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 01-2 0v-6a1 1 0 011-1z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={this.showRPCModal}
                className="tw-bg-transparent tw-p-2 tw-text-tosca-orange"
              >
                {_.isEmpty(selectedRpcItems)
                  ? "+ Add item"
                  : "+ Add another item"}
              </button>
              <ConfirmationModal
                show={this.state.showRPCModal}
                onClose={this.onModalClose}
                title={null}
                size="md"
                headerElement={
                  <div className="tw-bg-gray-200 tw-px-4 sm:tw-px-6 tw-py-4 tw-border-b">
                    <span className="tw-text-dark tw-text-xl md:tw-text-2xl tw-mb-3 tw-tracking-normal tw-font-normal">
                      Select RPC and Pallets
                    </span>
                  </div>
                }
              >
                <div className="tw-text-sm">
                  <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-5 tw-gap-3 tw-items-end">
                    <div className="md:tw-col-span-3">
                      <ToscaField
                        isVertical={true}
                        elementType="reactselect"
                        name="currentlySelectedRPC"
                        label="RPC Size:"
                        value={this.state.currentlySelectedRPC}
                        options={rpcSizeOptions}
                        onChange={(options) =>
                          this.setState({ currentlySelectedRPC: options })
                        }
                        getOptionLabel={(op) => op.modelSize}
                        getOptionValue={(option) => option.itemId}
                        defaultSelectText="Select..."
                        placeholder="Select an option"
                        menuPortalTarget={document.body}
                      />
                    </div>
                    <div className="md:tw-col-span-2">
                      <ToscaField
                        isVertical={true}
                        elementType="input"
                        inputType="number"
                        name="noOfcurrentlySelectedRPC"
                        value={this.state.noOfcurrentlySelectedRPC}
                        label="Number of Pallets"
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  {!config.hideCopProductDescriptions ? (
                    !_.isEmpty(
                      this.state.currentlySelectedRPC.productDescription,
                    ) ? (
                      <div className="tw-mt-3">
                        <ToscaField
                          isVertical={true}
                          elementType="description"
                          name="descriptionRPC"
                          elementClass="tw-h-16"
                          value={
                            this.state.currentlySelectedRPC.productDescription
                          }
                          label="RPC Description"
                        />
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </div>
                <div className="tw-w-full md:tw-mb-0 tw-block tw-justify-end tw-pt-4">
                  <p className="tw-text-red-600 tw-text-right tw-font-medium">
                    {this.state.modalError}
                  </p>
                  <div className="tw-flex tw-justify-end tw-gap-2">
                    <Button brand="secondary" onClick={this.addItem}>
                      Add
                    </Button>
                    <Button brand="primary" onClick={this.submitItem}>
                      Submit
                    </Button>
                  </div>
                </div>
              </ConfirmationModal>
            </div>
          </div>

          <div className="md:tw-flex md:tw-items-start tw-mb-6">
            <ToscaField
              elementType="date"
              name="pickupDate"
              label="Requested pick up date*:"
              value={form.pickupDate.value}
              onChange={(date) => this.handleDateChange(date, "pickupDate")}
              datePickerConfig={{ minDate: minPickupDate }}
            />
          </div>

          {/* <div className="md:tw-flex md:tw-items-start tw-mb-6">
            <ToscaField label="Requested pick up time*:">
              <div className="tw-flex tw-items-center tw-w-2/4">
                <div className="tw-mr-4">Between</div>
                <ToscaField
                  hasError={!form.pickupTimeStart.isValid}
                  errorMsg={form.pickupTimeStart.errorMsg}
                  showLabel={false}>
                  <DatePicker
                    id="pickupTimeStart"
                    className="tw-inline-block tw-appearance-none tw-w-full tw-bg-white tw-border tw-border-gray-400 hover:tw-border-gray-500 tw-px-4 tw-py-2 tw-text-center tw-rounded tw-shadow tw-leading-tight focus:tw-outline-none focus:tw-border-tosca-orange disabled:tw-bg-gray-200 disabled:tw-border-transparent tw-border-red-500"
                    name="pickupTimeStart"
                    dateFormat="h:mm a"
                    selected={form.pickupTimeStart.value}
                    onChange={(date) =>
                      this.handleDateChange(date, "pickupTimeStart")
                    }
                    onChangeRaw={(e) => e.preventDefault()}
                    onBlur={(e) => form.onBlur("pickupTimeStart")}
                    minTime={minStartTime}
                    maxTime={moment().hours(23).minutes(59)}
                    popperPlacement="bottom-start"
                    showTimeSelect
                    showTimeSelectOnly
                    autoComplete="off"
                    placeholderText="Select"
                    popperModifiers={{
                      flip: {
                        enabled: false,
                      },
                      preventOverflow: {
                        enabled: true,
                        escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                      },
                    }}
                  />
                </ToscaField>
                <div className="tw-ml-4 tw-mr-4">And</div>
                <ToscaField
                  hasError={!form.pickupTimeEnd.isValid}
                  errorMsg={form.pickupTimeEnd.errorMsg}
                  showLabel={false}>
                  <DatePicker
                    id="pickupTimeEnd"
                    autoComplete="off"
                    className="tw-inline-block tw-appearance-none tw-w-full tw-bg-white tw-border tw-border-gray-400 hover:tw-border-gray-500 tw-px-4 tw-py-2 tw-text-center tw-rounded tw-shadow tw-leading-tight focus:tw-outline-none focus:tw-border-tosca-orange disabled:tw-bg-gray-200 disabled:tw-border-transparent tw-border-red-500"
                    name="pickupTimeEnd"
                    dateFormat="h:mm a"
                    selected={form.pickupTimeEnd.value}
                    onChange={(date) =>
                      this.handleDateChange(date, "pickupTimeEnd")
                    }
                    onChangeRaw={(e) => e.preventDefault()}
                    onBlur={(e) => form.onBlur("pickupTimeEnd")}
                    minDate={moment()}
                    popperPlacement="bottom-start"
                    showTimeSelect
                    showTimeSelectOnly
                    minTime={minEndTime}
                    maxTime={moment().hours(23).minutes(59)}
                    placeholderText="Select"
                    popperModifiers={{
                      flip: {
                        enabled: false,
                      },
                      preventOverflow: {
                        enabled: true,
                        escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                      },
                    }}
                  />
                </ToscaField>
              </div>
            </ToscaField>
          </div> */}

          <div className="md:tw-flex md:tw-items-center tw-mb-6">
            <TextBox
              name="shipperRefno"
              value={form.shipperRefno.value}
              label="Shipper Reference Number:"
              hasError={!form.shipperRefno.isValid}
              errorMsg={form.shipperRefno.errorMsg}
              onBlur={() => form.onBlur("shipperRefno")}
              onChange={(e) => form.onChange("shipperRefno", e.target.value)}
            />
          </div>

          {config.hideCopCarrier || isLiveLoading ? null : (
            <div className="md:tw-flex md:tw-items-center tw-mb-6">
              <ToscaField
                name="carrier"
                elementType="reactselect"
                value={form.carrier.value}
                label="Carrier:"
                options={form.carrier.options}
                getOptionLabel={(option) => option.displayValue}
                getOptionValue={(option) => option?.scac}
                hasError={!form.carrier.isValid}
                errorMsg={form.carrier.errorMsg}
                onBlur={(e) => form.onBlur("carrier")}
                onChange={(option) => form.onChange("carrier", option)}
              />
            </div>
          )}

          <div className="md:tw-flex md:tw-items-start tw-mb-6">
            <TextArea
              name="additionalInfo"
              value={form.additionalInfo.value}
              label="Additional Information:"
              maxLength={80}
              hasError={!form.additionalInfo.isValid}
              errorMsg={form.additionalInfo.errorMsg}
              onBlur={() => form.onBlur("additionalInfo")}
              onChange={(e) => form.onChange("additionalInfo", e.target.value)}
            />
          </div>
        </div>

        <div className="md:tw-flex md:tw-items-start tw-mb-6 tw-justify-between">
          <div className="tw-mr-4">
            Want to repeat the same order, type in the number of times you would
            like to replicate the same:
          </div>
          <input
            type="number"
            value={this.props.copyOrderNumber}
            className="tw-mr-2 tw-float-right"
            placeholder="Number of Orders"
            onChange={(e) => this.props.setCopyOrderNumber(e.target.value)}
          />
        </div>
        <div className="tw-flex tw-justify-end tw-mt-4 tw-pt-3">
          <button
            title={form.formErrorMsg}
            disabled={!form.isFormValid || !this.props.updatingId}
            onClick={() =>
              this.props.methods.updateOrder(this.props.updatingId)
            }
            className="tw-relative tw-bg-tosca-blue hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500 tw-mr-2"
          >
            <span>Update</span>
          </button>
          <button
            title={form.formErrorMsg}
            disabled={!form.isFormValid}
            onClick={this.props.methods.addOrder}
            className="tw-relative tw-bg-tosca-blue hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
          >
            <span>Add</span>
          </button>
        </div>

        <CollectionOrderList
          orderList={this.props.orderList}
          methods={this.props.methods}
          isDeleteAvailable={true}
          isStatusVisible={this.props.isStatusVisible}
        />

        <div className="tw-flex tw-justify-between tw-mt-4">
          <button
            title={form.formErrorMsg}
            onClick={() => this.gotoStep(0)}
            className="tw-bg-tosca-blue hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
          >
            Back
          </button>
          <button
            title={form.formErrorMsg}
            disabled={this.props.orderList.length < 1}
            onClick={() => this.gotoStep(2)}
            className="tw-relative tw-bg-tosca-blue hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
          >
            <span>Continue</span>
          </button>
        </div>
      </div>
    );
  }
}

export default OrderDetail;
