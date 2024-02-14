import React, { Component } from "react";
import "./style.css";
import "react-datepicker/dist/react-datepicker.css";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import {
  addressActions,
  inventoryActions,
  transActions,
  shipToActions,
  customerActions,
} from "../../../actions";
import _ from "lodash";
import moment from "moment";
import Modal from "react-modal";
import Loader from "react-loader-spinner";
import { icons } from "../../../images";
import { country_list, state_list } from "./models/address";
import ReportItem from "./components/ReportItem";
import { determineNavStyling } from "../../../components/Nav/determineNavStyling";

import Select, { components } from "react-select";
import { pagination_icons } from "../../../images";
import { Prompt } from "react-router";
import Form from "./components/Form";
import ToscaField from "./../../../components/FormControls/ToscaField";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";
import Button from "../../../components/Button/Button";

Modal.setAppElement("#root");

const LoadingScreen = (props) => {
  return (
    <div className="content-row tw-w-full tw-text-center">
      <div
        className="loader-container  tw-w-full tw-mr-0 tw-fixed tw-flex tw-inset-0 tw-items-center tw-justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: "1" }}
      >
        <Loader
          type="ThreeDots"
          color="rgba(246,130,32,1)"
          height="50"
          width="50"
        />
      </div>
    </div>
  );
};

const initState = {
  isUpdated: false,
  addedNew: false,
  thankYou: false,
  showNewShipTo: false,
  newShipTo: {
    ToCustomer: {
      ToCustomerLocation: "",
      ToAddress: {
        Line1: "",
        Line2: "",
      },
      ToCountry: { label: "United States", value: "United States" },
      ToCity: "",
      ToState: "",
      ToZip: "",
    },
  },
  newShipToValidation: false,
  width: window.innerWidth,
  isEditMode: false,
};

class Transactions extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      ...initState,
      form: this.initForm(),
    };
  }

  initForm = () => {
    return Form(this, {
      date: { value: moment(), rules: "required" },
    });
  };

  onFormChange = () => {
    this.forceUpdate();
  };

  resetState = () => {
    this.setState(initState);
  };

  componentDidMount() {
    this.fetchSourceAddressList();
    this.fetchOrderInventory();
    this.fetchShipTos();
    this.fetchPendingTrans();
    this.fetchCustomerInfo();
    determineNavStyling(this.props.location.pathname);
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  checkIsEditMode = (isEdit) => {
    this.setState({ isEditMode: isEdit });
  };

  componentWillUpdate(nextProps) {
    if (
      (nextProps.posted && nextProps.posted !== this.props.posted) ||
      (nextProps.updated && nextProps.updated !== this.props.updated) ||
      (nextProps.deleted && nextProps.deleted !== this.props.deleted)
    ) {
      this.resetState();
      this.fetchPendingTrans();
    }

    if (
      nextProps.shipToAddresses.submitted &&
      nextProps.shipToAddresses.submitted !==
        this.props.shipToAddresses.submitted
    ) {
      this.setState({
        ...this.state,
        showNewShipTo: false,
        newShipTo: initState.newShipTo,
      });
      this.props.dispatch(
        shipToActions.fetchShipTo(this.props.user.accessToken, true),
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.fetchSourceAddressList();
    this.fetchOrderInventory();

    let { form } = this.state;
    if (!prevProps.accessToken && this.props.accessToken) {
      this.fetchShipTos();
      this.fetchCustomerInfo();
      this.fetchPendingTrans();
    }
    if (!_.isEqual(prevState, this.state)) {
      this.setState({ isUpdated: true });
    }

    if (
      (prevProps.isPostingTransaction && !this.props.isPostingTransaction) ||
      (prevProps.committing && !this.props.committing)
    ) {
      let form = this.initForm();
      //Reset form
      this.setState({ form: form });
    }

    if (prevProps.committing && this.props.committed) {
      this.props.dispatch(
        shipToActions.deleteAllNewShipTos(
          this.props.user.OrgId,
          this.props.user.accessToken,
        ),
      );
      this.setState({ thankYou: true });
    }

    if (
      this.props.newShipTos.length !== prevProps.newShipTos.length &&
      this.state.addedNew
    ) {
      const last = this.props.newShipTos[this.props.newShipTos.length - 1];
      const shipTo = {
        label: last.ToCustomer.ToCustomerLocation,
        value: last._id,
        obj: last,
      };

      form.shipTo.value = shipTo;

      this.setState({
        addedNew: false,
      });
    }

    const { ToCustomerLocation, ToState, ToCity } =
      this.state.newShipTo.ToCustomer;

    if (!_.isEqual(prevState, this.state)) {
      if (
        !_.isEmpty(ToCustomerLocation) &&
        !_.isEmpty(ToState) &&
        !_.isEmpty(ToCity)
      ) {
        this.setState({ newShipToValidation: true });
      }
      if (
        _.isEmpty(ToCustomerLocation) ||
        _.isEmpty(ToState) ||
        _.isEmpty(ToCity)
      ) {
        this.setState({ newShipToValidation: false });
      }
    }
  }

  fetchSourceAddressList = () => {
    if (this.props.accessToken) {
      if (
        !this.props.sourceAddresses.fetching &&
        !this.props.sourceAddresses.fetched
      ) {
        this.props.dispatch(
          addressActions.fetchSourceAddressList(this.props.accessToken),
        );
      }
    }
  };

  fetchOrderInventory = () => {
    if (this.props.accessToken) {
      if (
        !this.props.orderInventory.fetching &&
        !this.props.orderInventory.fetched
      ) {
        this.props.dispatch(
          inventoryActions.fetchOrderInventory(this.props.accessToken, {
            customerId: this.props.user.CustomerInfo.CustID,
            outbound: true,
          }),
        );
      }
    }
  };

  fetchShipTos = () => {
    if (this.props.user.accessToken) {
      this.props.dispatch(
        shipToActions.fetchShipTo(this.props.user.accessToken, true),
      );
    }
  };

  fetchCustomerInfo = () => {
    if (this.props.user.accessToken) {
      this.props.dispatch(
        customerActions.fetchCustomerInfo(
          this.props.user.accessToken,
          this.props.user.CustomerInfo.CustID,
        ),
      );
    }
  };

  fetchPendingTrans = () => {
    if (!this.props.user.accessToken) return;

    let filter = "unsubmitted";
    this.props.user.CustomerInfo.CustID
      ? this.props.dispatch(
          transActions.fetchTransactions(
            this.props.user.CustomerInfo.CustID,
            filter,
            this.props.user.accessToken,
          ),
        )
      : setTimeout(this.fetchPendingTrans, 0);
  };
  onInputChange = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      [e.target.id]: e.target.value,
    });
  };

  addTransaction = (e) => {
    e.preventDefault();
    const { form } = this.state;
    const { user, dispatch } = this.props;

    if (!form.isFormValid) return alert(form.formErrorMsg);

    if (_.isEmpty(this.props.customerInfo)) {
      alert("No customer information found, please refresh the page");
      return;
    }
    let transObject = {
      customerId: this.props.customerInfo.customerId,
      shipFromId: form.shipFrom.value.obj.addressId,
      shipFromName: form.shipFrom.value.obj.addressName,
      shipToId: form.shipTo.value.obj.id,
      shipToName: form.shipTo.value.obj.addressName,
      transactionDetail: {
        itemId: form.containerSize.value.obj.itemId,
        itemClassId: form.containerSize.value.obj.itemClassId,
        quantity: form.qty.value,
        billOfLading: form.bolNo.value,
        purchaseOrder: form.poNo.value,
        transactionDate: form.date.value,
      },
    };

    dispatch(
      transActions.saveNewTrans(user.OrgId, transObject, user.accessToken),
    );
  };

  addShipto = (e) => {
    e.preventDefault();

    this.setState({
      addedNew: true,
    });

    const { ToCustomerLocation, ToAddress, ToCountry, ToCity, ToState, ToZip } =
        this.state.newShipTo.ToCustomer,
      { user, customerInfo, dispatch } = this.props,
      shipTo = {
        ToCustomer: {
          ToCustomerLocation: ToCustomerLocation,
          ToAddress: ToAddress.Line2
            ? `${ToAddress.Line1}, ${ToAddress.Line2}`
            : ToAddress.Line1,
          ToCountry: ToCountry.value,
          ToCity: ToCity,
          ToState: ToState.value,
          ToZip: ToZip,
        },
        Audit: {
          CreatedBy: user.Email,
          CreatedOn: moment(),
        },
        orgId: parseInt(customerInfo.customerId.slice(1)),
      };

    if (!_.isEmpty(shipTo))
      dispatch(shipToActions.submitNewShipTo(shipTo, user.accessToken));

    this.setState({
      newShipTo: {
        ToCustomer: {
          ToCustomerLocation: "",
          ToAddress: {
            Line1: "",
            Line2: "",
          },
          ToCountry: { label: "United States", value: "United States" },
          ToCity: "",
          ToState: "",
          ToZip: "",
        },
      },
    });
  };

  postTransactions = () => {
    const { pendingTrans, dispatch, user } = this.props;

    if (pendingTrans.length > 0 && user.accessToken) {
      dispatch(transActions.commitPendingTrans(user.accessToken));
    }
  };

  deleteReportItem = (id) => {
    this.setState(initState);
    return this.props.dispatch(
      transActions.deletePendingTrans(
        this.props.user.OrgId,
        id,
        this.props.user.accessToken,
      ),
    );
  };

  render() {
    let { user } = this.props;
    let { form, newShipToValidation } = this.state;
    let contClassList = [];
    let contTypeList = [];

    form.shipTo.shipTos = this.props.shipTos;
    form.shipTo.newShipTos = this.props.newShipTos;

    if (!_.isEmpty(user)) {
      this.props.orderInventory.orderInventory
        .filter(
          (val, i, arr) =>
            arr.findIndex((t) => t.itemClassKey === val.itemClassKey) === i,
        )
        .forEach((orderClass) => {
          contClassList.push({
            value: orderClass.itemClassKey,
            label:
              orderClass.itemClassId === "Handheld"
                ? "Case Ready Meat"
                : orderClass.itemClassId === "640"
                ? "Cheese"
                : orderClass.itemClassId,
          });
        });

      this.props.orderInventory.orderInventory
        .filter((item) => item.itemClassId === form.containerType.value.value)
        .forEach((orderType) => {
          contTypeList.push({
            value: orderType.itemId,
            label: orderType.modelSize,
            "data-contclass": orderType.itemClassKey,
            "data-contqty": orderType.totalQuantity,
            obj: orderType,
          });
        });

      return (
        <div id="trans-reporting-page">
          {this.props.isPostingTransaction ||
          this.props.isFetchingAddress ||
          this.props.isFetchingTransactions ||
          this.props.committing ||
          this.props.deleting ? (
            <LoadingScreen />
          ) : null}

          <Prompt when={form.isUpdated} message="" />

          <ConfirmationModal
            title="Thank you!"
            brand="default"
            show={this.state.thankYou}
            onClose={() => this.setState({ thankYou: false })}
          >
            <p>Your transaction report has been submitted.</p>

            <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
              <Button
                brand="secondary"
                type="button"
                fullwidth="true"
                onClick={() => this.setState({ thankYou: false })}
              >
                Submit Another Report
              </Button>
              <Button
                brand="primary"
                type="button"
                fullwidth="true"
                onClick={() => this.context.router.history.push("/")}
              >
                Return to Dashboard
              </Button>
            </div>
          </ConfirmationModal>

          <div className="trans-reporting-page-header">
            <div className="header-info">
              <h3>Transaction Reporting</h3>
              <p>Add transaction details for each of your orders.</p>
            </div>
          </div>
          <div className="row shipping-info">
            <div className="header">
              <h4>1. Shipping Information</h4>
            </div>
            <div className="content">
              <div className="content-row2">
                <div
                  id="ship-from-container"
                  style={{
                    marginBottom:
                      form.shipFrom.getAddress().trim().length > 0 &&
                      this.state.width < 426
                        ? "5px"
                        : "20px",
                  }}
                >
                  <div className="form-group">
                    <ToscaField
                      elementType="reactselect"
                      options={form.shipFrom.options(
                        this.props.sourceAddressList,
                      )}
                      value={form.shipFrom.value}
                      onChange={(option) => form.onChange("shipFrom", option)}
                      onBlur={() => form.onBlur("shipFrom")}
                      hasError={!form.shipFrom.isValid}
                      errorMsg={form.shipFrom.errorMsg}
                      backspaceRemovesValue={false}
                      showLabel={true}
                      label="Ship From"
                      isVertical={true}
                      inputWrapperClass={(provided) => [
                        ...provided,
                        "tw-bg-white tw-font-light",
                      ]}
                      labelClass={(provided) =>
                        provided.filter((c) => c !== "tw-text-tosca-orange")
                      }
                    />
                  </div>
                  <div className="form-group">
                    {((this.state.width > 425 &&
                      (form.shipFrom.getAddress().trim().length > 0 ||
                        form.shipTo.getAddress().trim().length > 0)) ||
                      (this.state.width < 426 &&
                        form.shipFrom.getAddress().trim().length > 0)) && (
                      <textarea
                        id="shipFromAddy"
                        className="form-control"
                        value={form.shipFrom.getAddress()}
                        disabled
                      />
                    )}
                  </div>
                </div>
                <div
                  id="shipto-form-group"
                  style={{
                    marginBottom:
                      form.shipTo.getAddress().trim().length > 0 &&
                      this.state.width < 426
                        ? "5px"
                        : "20px",
                  }}
                >
                  <div
                    className="form-group"
                    style={{
                      display: "inline-block",
                      width: "100%",
                    }}
                  >
                    <ToscaField
                      elementType="reactselect"
                      options={form.shipTo.options(form.shipFrom.value.value)}
                      value={form.shipTo.value}
                      label="Ship To"
                      onChange={(option) => form.onChange("shipTo", option)}
                      onBlur={() => form.onBlur("shipTo")}
                      isVertical={true}
                      inputWrapperClass={(provided) => [
                        ...provided,
                        "tw-bg-white tw-font-light",
                      ]}
                      labelClass={(provided) =>
                        provided.filter((c) => c !== "tw-text-tosca-orange")
                      }
                      hasError={!form.shipTo.isValid}
                      errorMsg={form.shipTo.errorMsg}
                      backspaceRemovesValue={true}
                    />
                  </div>
                  <span
                    className={`glyphicon ${
                      this.state.showNewShipTo
                        ? "glyphicon-remove"
                        : "glyphicon-plus"
                    }`}
                    onClick={() => {
                      form.shipTo.value = {
                        label: <span style={{ color: "hsl(0,0%,50%)" }} />,
                        value: 0,
                      };
                      this.setState({
                        showNewShipTo: !this.state.showNewShipTo,
                      });
                    }}
                    title="Click to add new ship-to location"
                  />
                  <div className="form-group">
                    {((this.state.width > 425 &&
                      (form.shipTo.getAddress().trim().length > 0 ||
                        form.shipFrom.getAddress().trim().length > 0)) ||
                      (this.state.width < 426 &&
                        form.shipTo.getAddress().trim().length > 0)) && (
                      <textarea
                        id="shipToAddy"
                        className="form-control"
                        style={{
                          marginBottom:
                            (this.state.width > 425 &&
                              (form.shipTo.getAddress().trim().length > 0 ||
                                form.shipFrom.getAddress().trim().length >
                                  0)) ||
                            (this.state.width < 426 &&
                              form.shipTo.getAddress().trim().length > 0)
                              ? "0px"
                              : "20px",
                        }}
                        value={form.shipTo.getAddress()}
                        disabled
                      />
                    )}
                  </div>
                </div>
              </div>
              <div
                className="content-row add-shipto"
                style={{ display: this.state.showNewShipTo ? "flex" : "none" }}
              >
                <form onSubmit={this.addShipto} style={{ width: "100%" }}>
                  <div className="info-row">
                    <div className="contact-col">
                      <div className="form-group">
                        <label htmlFor="ToContactName">Contact Name</label>
                        <input
                          type="text"
                          id="ToContactName"
                          className="submitto-input form-control"
                          placeholder="Name"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="ToContactNo">
                          Contact Phone Number
                        </label>
                        <input
                          type="phone"
                          id="ToContactNo"
                          className="submitto-input form-control"
                          placeholder="###-###-####"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="ToContactEmail">Contact Email</label>
                        <input
                          type="email"
                          id="ToContactEmail"
                          className="submitto-input form-control"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    <div className="address-col">
                      <div className="form-group">
                        <label htmlFor="ToLocation">Location Name</label>
                        <input
                          id="ToLocation"
                          type="text"
                          placeholder="Location Name"
                          className="submitto-input form-control"
                          value={
                            this.state.newShipTo.ToCustomer.ToCustomerLocation
                          }
                          onChange={(e) =>
                            this.setState({
                              ...this.state,
                              newShipTo: {
                                ...this.state.newShipTo,
                                ToCustomer: {
                                  ...this.state.newShipTo.ToCustomer,
                                  ToCustomerLocation: e.target.value,
                                },
                              },
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <div id="ToAddress" style={{ width: "100%" }}>
                          <label htmlFor="ToAddressL1">
                            Street Address Line 1
                          </label>
                          <input
                            id="ToAddressL1"
                            type="text"
                            placeholder="Street Address"
                            className="submitto-input form-control"
                            value={
                              this.state.newShipTo.ToCustomer.ToAddress.Line1
                            }
                            onChange={(e) =>
                              this.setState({
                                ...this.state,
                                newShipTo: {
                                  ...this.state.newShipTo,
                                  ToCustomer: {
                                    ...this.state.newShipTo.ToCustomer,
                                    ToAddress: {
                                      ...this.state.newShipTo.ToCustomer
                                        .ToAddress,
                                      Line1: e.target.value,
                                    },
                                  },
                                },
                              })
                            }
                            // required
                          />
                          <label htmlFor="ToAddressL2">
                            Street Address Line 2
                          </label>
                          <input
                            id="ToAddressL2"
                            type="text"
                            className="submitto-input form-control"
                            value={
                              this.state.newShipTo.ToCustomer.ToAddress.Line2
                            }
                            placeholder="Street Address"
                            onChange={(e) =>
                              this.setState({
                                ...this.state,
                                newShipTo: {
                                  ...this.state.newShipTo,
                                  ToCustomer: {
                                    ...this.state.newShipTo.ToCustomer,
                                    ToAddress: {
                                      ...this.state.newShipTo.ToCustomer
                                        .ToAddress,
                                      Line2: e.target.value,
                                    },
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="country-col">
                      <div className="form-group">
                        <label htmlFor="ToCountry">Country</label>
                        <Select
                          id="ToCountry"
                          className="react-select"
                          options={country_list.map((country) => ({
                            label: country,
                            value: country,
                          }))}
                          components={{ DropdownIndicator }}
                          required
                          isDisabled={false}
                          value={this.state.newShipTo.ToCustomer.ToCountry}
                          backspaceRemovesValue={false}
                          onChange={(e) =>
                            this.setState({
                              ...this.state,
                              newShipTo: {
                                ...this.state.newShipTo,
                                ToCustomer: {
                                  ...this.state.newShipTo.ToCustomer,
                                  ToCountry: e,
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="ToCity">City</label>
                        <input
                          id="ToCity"
                          style={{ marginRight: 0 }}
                          type="text"
                          placeholder="City"
                          className="submitto-input form-control"
                          value={this.state.newShipTo.ToCustomer.ToCity}
                          onChange={(e) =>
                            this.setState({
                              ...this.state,
                              newShipTo: {
                                ...this.state.newShipTo,
                                ToCustomer: {
                                  ...this.state.newShipTo.ToCustomer,
                                  ToCity: e.target.value,
                                },
                              },
                            })
                          }
                          required
                        />
                      </div>
                      <div
                        id="StateZip"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <div className="form-group">
                          <label htmlFor="ToState">State</label>
                          <Select
                            id="ToState"
                            className="react-select"
                            options={state_list.map((state) => ({
                              label: state,
                              value: state,
                            }))}
                            components={{ DropdownIndicator }}
                            required
                            isDisabled={false}
                            backspaceRemovesValue={false}
                            onChange={(e) =>
                              this.setState({
                                ...this.state,
                                newShipTo: {
                                  ...this.state.newShipTo,
                                  ToCustomer: {
                                    ...this.state.newShipTo.ToCustomer,
                                    ToState: e,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="ToZip">Zip</label>
                          <input
                            id="ToZip"
                            type="text"
                            placeholder="Zip Code"
                            className="submitto-input form-control"
                            value={this.state.newShipTo.ToCustomer.ToZip}
                            onChange={(e) =>
                              this.setState({
                                ...this.state,
                                newShipTo: {
                                  ...this.state.newShipTo,
                                  ToCustomer: {
                                    ...this.state.newShipTo.ToCustomer,
                                    ToZip: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="btn-row">
                    <button
                      id="submit-btn"
                      disabled={!newShipToValidation}
                      style={{ color: "#414042" }}
                      className="btn btn-primary"
                      type="submit"
                    >
                      Add Location
                    </button>
                    <input
                      id="cancel-btn"
                      className="btn btn-link"
                      type="button"
                      value="Cancel"
                      style={{ width: 130, color: "#414042", fontSize: 16 }}
                      onClick={() =>
                        this.setState({
                          showNewShipTo: !this.state.showNewShipTo,
                        })
                      }
                    />
                  </div>
                </form>
              </div>
              <div className="content-row">
                <div
                  className="shipping-info-bottom-row"
                  style={{ position: "relative" }}
                >
                  <ToscaField
                    elementType="date"
                    value={form.date.value}
                    label="Transaction Date"
                    isVertical={true}
                    hasError={!form.date.isValid}
                    errorMsg={form.date.errorMsg}
                    inputWrapperClass={(provided) => [
                      ...provided,
                      "tw-bg-white",
                    ]}
                    dateClass="tw-w-full"
                    labelClass={(provided) =>
                      provided.filter((c) => c !== "tw-text-tosca-orange")
                    }
                    datePickerConfig={{
                      onSelect: (date) => form.onChange("date", date),
                      maxDate: moment(),
                      onChangeRaw: (e) => e.preventDefault(),
                    }}
                    innerRef={(c) => (this._calendar = c)}
                  />
                  <img
                    src={icons.calendar}
                    alt="datepicker"
                    onClick={() => this._calendar.setOpen(true)}
                    style={{
                      width: 20,
                      position: "absolute",
                      right: "5%",
                      top: "50%",
                    }}
                  />
                </div>
                <div className="shipping-info-bottom-row shipping-info-bottom-row2">
                  <ToscaField
                    value={form.poNo.value}
                    onChange={(e) => form.onChange("poNo", e.target.value)}
                    onBlur={() => form.onBlur("poNo")}
                    hasError={!form.poNo.isValid}
                    errorMsg={form.poNo.errorMsg}
                    isVertical={true}
                    label="Purchase Order Number"
                    inputWrapperClass={(provided) => [
                      ...provided,
                      "tw-bg-white tw-font-light",
                    ]}
                    labelClass={(provided) =>
                      provided.filter((c) => c !== "tw-text-tosca-orange")
                    }
                  />
                </div>
                <div className="shipping-info-bottom-row shipping-info-bottom-row2">
                  <ToscaField
                    value={form.bolNo.value}
                    onChange={(e) => form.onChange("bolNo", e.target.value)}
                    onBlur={() => form.onBlur("bolNo")}
                    hasError={!form.bolNo.isValid}
                    errorMsg={form.bolNo.errorMsg}
                    isVertical={true}
                    label="Bill of Lading Number"
                    inputWrapperClass={(provided) => [
                      ...provided,
                      "tw-bg-white tw-font-light",
                    ]}
                    labelClass={(provided) =>
                      provided.filter((c) => c !== "tw-text-tosca-orange")
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row container-info">
            <div className="header">
              <h4>2. Container Information</h4>
            </div>
            <div className="content">
              <div className="content-row">
                <div className="tw-flex tw-flex-col sm:tw-flex-row tw-mb-0 sm:tw-mb-6 tw-w-full">
                  <div className="tw-flex tw-flex-col tw-w-3/3 sm:tw-w-1/3 tw-my-2 sm:tw-my-0">
                    <ToscaField
                      elementType="reactselect"
                      options={form.brand.options(
                        this.props.orderInventory.orderInventory,
                        form.brand,
                        form.color,
                      )}
                      value={form.brand.value}
                      onChange={(option) => form.onChange("brand", option)}
                      onBlur={() => form.onBlur("brand")}
                      label="Container Type"
                      isVertical={true}
                      labelClass={(provided) =>
                        provided.filter((c) => c !== "tw-text-tosca-orange")
                      }
                      inputWrapperClass={(provided) => [
                        ...provided,
                        "tw-bg-white tw-font-light",
                      ]}
                    />
                  </div>
                  <div className="tw-flex tw-flex-col tw-w-3/3 sm:tw-w-1/3 sm:tw-mx-4 tw-my-2 sm:tw-my-0">
                    <ToscaField
                      elementType="reactselect"
                      options={form.color.options(
                        this.props.orderInventory.orderInventory,
                        form.brand.value.value,
                      )}
                      value={form.color.value}
                      onChange={(option) => form.onChange("color", option)}
                      onBlur={() => form.onBlur("color")}
                      label="Color"
                      isVertical={true}
                      labelClass={(provided) =>
                        provided.filter((c) => c !== "tw-text-tosca-orange")
                      }
                      inputWrapperClass={(provided) => [
                        ...provided,
                        "tw-bg-white tw-font-light",
                      ]}
                    />
                  </div>

                  <div className="tw-w-3/3 sm:tw-w-1/3 tw-my-2 sm:tw-my-0">
                    <ToscaField
                      elementType="reactselect"
                      options={form.containerType.options(
                        this.props.orderInventory.orderInventory,
                        form.brand.value.value,
                        form.color.value.value,
                      )}
                      value={form.containerType.value}
                      onChange={(option) =>
                        form.onChange("containerType", option)
                      }
                      onBlur={() => form.onBlur("containerType")}
                      hasError={!form.containerType.isValid}
                      errorMsg={form.containerType.errorMsg}
                      label="Type"
                      isVertical={true}
                      labelClass={(provided) =>
                        provided.filter((c) => c !== "tw-text-tosca-orange")
                      }
                      inputWrapperClass={(provided) => [
                        ...provided,
                        "tw-bg-white tw-font-light",
                      ]}
                    />
                  </div>
                </div>
                <div className="tw-flex tw-flex-col sm:tw-flex-row tw-w-full">
                  <div className="tw-w-3/3 sm:tw-w-1/3 tw-my-2 sm:tw-my-0 tw-mx-0 sm:tw-mr-4">
                    <ToscaField
                      elementType="reactselect"
                      options={form.containerSize.options(
                        contTypeList,
                        form.brand.value.value,
                        form.color.value.value,
                      )}
                      value={form.containerSize.value}
                      onChange={(option) =>
                        form.onChange("containerSize", option)
                      }
                      onBlur={() => form.onBlur("containerSize")}
                      hasError={!form.containerSize.isValid}
                      errorMsg={form.containerSize.errorMsg}
                      label="Container"
                      isVertical={true}
                      labelClass={(provided) =>
                        provided.filter((c) => c !== "tw-text-tosca-orange")
                      }
                      inputWrapperClass={(provided) => [
                        ...provided,
                        "tw-bg-white tw-font-light",
                      ]}
                    />
                  </div>
                  <div className="tw-w-3/3 sm:tw-w-1/3 tw-my-2 sm:tw-my-0 sm:tw-mr-4">
                    <ToscaField
                      inputType="number"
                      name="qty"
                      value={form.qty.value}
                      onBlur={(e) => form.onBlur("qty")}
                      onChange={(e) => form.onChange("qty", e.target.value)}
                      isVertical={true}
                      label="Quantity"
                      inputWrapperClass={(provided) => [
                        ...provided,
                        "tw-bg-white tw-font-light",
                      ]}
                      labelClass={(provided) =>
                        provided.filter((c) => c !== "tw-text-tosca-orange")
                      }
                      hasError={!form.qty.isValid}
                      errorMsg={form.qty.errorMsg}
                    />
                  </div>
                  <div className="tw-flex tw-w-3/3 sm:tw-w-1/3 tw-my-2 sm:tw-my-0 tw-items-end">
                    <button
                      type="button"
                      style={{ color: "#414042" }}
                      disabled={!form.isFormValid}
                      onClick={this.addTransaction}
                      className="btn btn-primary pull-right"
                      id="add-trans"
                    >
                      Add Report to Queue{" "}
                      <span
                        style={{ marginLeft: 5, fontWeight: 100 }}
                        className="glyphicon glyphicon-plus"
                      />
                    </button>
                  </div>
                </div>
              </div>
              {!_.isEmpty(
                _.get(form.containerSize, "value.obj.productDescription", ""),
              ) ? (
                <div className="tw-flex tw-flex-col tw-mt-5 tw-w-full">
                  <ToscaField
                    isVertical={true}
                    elementType="description"
                    name="descriptionRPC"
                    elementClass="tw-h-28"
                    value={_.get(
                      form.containerSize,
                      "value.obj.productDescription",
                      "",
                    )}
                    label="RPC Description"
                    labelClass={(provided) =>
                      provided.filter((c) => c !== "tw-text-tosca-orange")
                    }
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="row report-queue">
            <div className="header">
              <h4>3. Reports Queue</h4>
            </div>
            <div className="content">
              <div
                className="report-content"
                style={{
                  minHeight:
                    this.state.isEditMode && this.state.width > 1024
                      ? "600px"
                      : "",
                }}
              >
                {this.props.pendingTrans &&
                this.props.pendingTrans.length > 0 ? (
                  this.props.pendingTrans.map((trans, i) => (
                    <ReportItem
                      key={i}
                      report={trans}
                      user={this.props.user}
                      orderInventory={this.props.orderInventory.orderInventory}
                      contType={contClassList[0]}
                      contClassList={contClassList}
                      deleteReportItem={this.deleteReportItem}
                      width={this.state.width}
                      checkIsEditMode={this.checkIsEditMode}
                    />
                  ))
                ) : (
                  <div style={{ display: "none" }} />
                )}
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                paddingTop: 20,
                display:
                  this.props.pendingTrans && this.props.pendingTrans.length > 0
                    ? "block"
                    : "none",
                width: "100%",
              }}
            >
              <button
                type="button"
                className="btn btn-primary pull-right"
                style={{
                  width: 116,
                  height: 48,
                  marginTop: 10,
                  backgroundColor: "#ec710a",
                  fontSize: 20,
                }}
                onClick={this.postTransactions}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      );
    } else return <div>Loading...</div>;
  }
}

const { object, bool, string, array } = PropTypes;

Transactions.propTypes = {
  user: object.isRequired,
  authenticated: bool.isRequired,
  checked: bool.isRequired,
  accessToken: string,
  pendingTrans: array,
  orderInventory: object.isRequired,
};

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

const mapState = ({
  session,
  transactions,
  shipToAddresses,
  sourceAddresses,
  orderInventory,
  customer,
}) => ({
  user: session.user,
  authenticated: session.authenticated,
  checked: session.checked,
  accessToken: session.user.accessToken,
  pendingTrans: transactions.pendingTrans,
  posted: transactions.posted,
  transError: transactions.error,
  sourceAddresses: sourceAddresses,
  sourceAddressList: sourceAddresses.sourceAddressList,
  shipTos: shipToAddresses.addresses,
  newShipTos: shipToAddresses.newShipTos || [],
  shipToAddresses: shipToAddresses,
  committing: transactions.committing,
  committed: transactions.committed,
  updating: transactions.updating,
  updated: transactions.updated,
  deleting: transactions.deleting,
  deleted: transactions.deleting,
  isPostingTransaction: transactions.posting,
  isFetchingTransactions: transactions.fetching,
  isFetchingAddress: shipToAddresses.fetching,
  orderInventory: orderInventory,
  customerInfo: customer.customerInfo,
});

export default connect(mapState)(Transactions);
