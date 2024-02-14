/* eslint-disable array-callback-return */
import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import Select, { components } from "react-select";
import "./style.css";
import { pagination_icons } from "../../../images";
import { determineNavStyling } from "../../../components/Nav/determineNavStyling";
import {
  addressActions,
  inventoryActions,
  emailActions,
  customerActions,
} from "../../../actions";
import ToscaField from "../../../components/FormControls/ToscaField";
import {
  emailConfigs,
  EmailConfigHelper,
} from "./../../../components/HOC/withEmail/withEmail";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";
import Button from "../../../components/Button/Button";

const initState = {
  containerType: "",
  containerSize: "",
  monthQty: "",
  commodity: "",
  shipTo: "",
  chkJan: false,
  chkFeb: false,
  chkMar: false,
  chkApr: false,
  chkMay: false,
  chkJun: false,
  chkJul: false,
  chkAug: false,
  chkSep: false,
  chkOct: false,
  chkNov: false,
  chkDec: false,
  allYear: false,
  containerSizeList: [],
  containerTypeList: [],
  notes: "",
  containerTypeBlank: false,
  containerSizeBlank: false,
  shippingMonthsBlank: false,
  shippingMonthsBlankCheck: false,
  monthQtyBlank: false,
  commodityBlank: false,
  shipToBlank: false,
};

class RequestQuote extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = initState;
  }

  static getDerivedStateFromProps(props, state) {
    const containerTypeList = [],
      containerSizeList = [];
    // Build containerType and containerSize lists
    if (props.orderInventory) {
      props.orderInventory
        .filter(
          (val, i, arr) =>
            arr.findIndex((t) => t.itemClassKey === val.itemClassKey) === i,
        )
        .map((orderClass) => {
          containerTypeList.push({
            value: orderClass.itemClassId,
            label: orderClass.itemClassId,
          });
        });

      props.orderInventory
        .filter((item) =>
          state["containerType"].value
            ? item.itemClassId === state["containerType"].value
            : item,
        )
        .map((orderType) => {
          containerSizeList.push({
            value: orderType.modelSize,
            label: orderType.modelSize,
          });
        });
    }

    let shippingMonthsBlank = false;
    if (
      state.chkJan ||
      state.chkFeb ||
      state.chkMar ||
      state.chkApr ||
      state.chkMay ||
      state.chkJun ||
      state.chkJul ||
      state.chkAug ||
      state.chkSep ||
      state.chkOct ||
      state.chkNov ||
      state.chkDec
    ) {
      shippingMonthsBlank = false;
    } else {
      shippingMonthsBlank = true;
    }

    let allYear = false;
    if (
      !state.chkJan ||
      !state.chkFeb ||
      !state.chkMar ||
      !state.chkApr ||
      !state.chkMay ||
      !state.chkJun ||
      !state.chkJul ||
      !state.chkAug ||
      !state.chkSep ||
      !state.chkOct ||
      !state.chkNov ||
      !state.chkDec
    ) {
      allYear = false;
    } else {
      allYear = true;
    }
    return {
      containerTypeList,
      containerSizeList,
      shippingMonthsBlank,
      allYear,
    };
  }

  componentDidMount() {
    this.props.dispatch(
      addressActions.fetchSourceAddressList(this.props.accessToken),
    );
    this.props.dispatch(
      inventoryActions.fetchOrderInventory(this.props.accessToken, {
        customerId: this.props.user.CustomerInfo.CustID,
        outbound: true,
      }),
    );
    determineNavStyling(this.props.location.pathname);

    this.props.dispatch(
      customerActions.fetchCustomerInfo(
        this.props.accessToken,
        this.props.user.CustomerInfo.CustID,
      ),
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.containerType === "" &&
      this.state.containerTypeList.length
    ) {
      this.setState({
        containerType: this.state.containerTypeList[0],
      });
    } else if (
      prevState.containerType.value !== this.state.containerType.value
    ) {
      this.setState({
        containerType: this.state.containerType,
      });
    }
  }

  onMonthQtyChange = (e) => {
    this.setState({
      monthQtyBlank: e.target.value === "" || e.target.value === 0,
      monthQty: e.target.value,
    });
  };

  onCommodityChange = (e) => {
    this.setState({
      commodityBlank: e.target.value === "",
      commodity: e.target.value,
    });
  };

  onContainerTypeChange = (option, user) => {
    this.setState({
      containerTypeBlank: option.value ? false : true,
      containerType: option,
      containerSize: "",
      containerSizeBlank: false,
    });
  };

  onContainerSizeChange = (option, user) => {
    this.setState({
      containerSizeBlank: option.value ? false : true,
      containerSize: option,
    });
  };

  onShipToChange = (option, user) => {
    this.setState({
      shipToBlank: option.value ? false : true,
      shipTo: option,
    });
  };

  yearRoundClick = () => {
    this.setState({
      chkJan: !this.state.allYear,
      chkFeb: !this.state.allYear,
      chkMar: !this.state.allYear,
      chkApr: !this.state.allYear,
      chkMay: !this.state.allYear,
      chkJun: !this.state.allYear,
      chkJul: !this.state.allYear,
      chkAug: !this.state.allYear,
      chkSep: !this.state.allYear,
      chkOct: !this.state.allYear,
      chkNov: !this.state.allYear,
      chkDec: !this.state.allYear,
      shippingMonthsBlankCheck: true,
      allYear: !this.state.allYear,
    });
  };

  requestQuote = (e, emailConfig) => {
    e.preventDefault();
    const {
        containerType,
        containerSize,
        monthQty,
        commodity,
        shipTo,
        chkJan,
        chkFeb,
        chkMar,
        chkApr,
        chkMay,
        chkJun,
        chkJul,
        chkAug,
        chkSep,
        chkOct,
        chkNov,
        chkDec,
        notes,
      } = this.state,
      { dispatch, accessToken, user } = this.props,
      { sendEmail } = emailActions,
      email = {
        Recipients: emailConfig.getReciepients(),
        CopyRecipients: emailConfig.getCopyReciepients(),
        Subject: `Request a Quote - ${this.props.customerInfo.customerName}`,
        Body: `
Type = ${containerType.label}
Size = ${containerSize.label}
Quantity/month = ${monthQty}
Commodity type = ${commodity}
Ship To = ${shipTo.label}
Needed in = ${[
          chkJan ? "Jan" : "",
          chkFeb ? "Feb" : "",
          chkMar ? "Mar" : "",
          chkApr ? "Apr" : "",
          chkMay ? "May" : "",
          chkJun ? "Jun" : "",
          chkJul ? "Jul" : "",
          chkAug ? "Aug" : "",
          chkSep ? "Sep" : "",
          chkOct ? "Oct" : "",
          chkNov ? "Nov" : "",
          chkDec ? "Dec" : "",
        ]
          .filter(Boolean)
          .join(", ")}
Notes = ${notes}`,
      };

    dispatch(
      sendEmail(
        accessToken,
        {
          ...user.CustomerInfo,
          ContactEmail: user.Email,
          CustName: this.props.customerInfo.customerName,
        },
        email,
      ),
    );
  };

  resetEmail = () => {
    this.setState(initState);
    this.props.dispatch(emailActions.reset());
  };

  render() {
    const { user } = this.props;
    const containerTypeList = this.state.containerTypeList;
    const containerSizeList = this.state.containerSizeList;
    const shipToList = [];
    const { containerType, containerSize, commodity, shipTo, monthQty, notes } =
      this.state;

    const submitDisabled =
      (containerType.value ? false : true) ||
      (containerSize.value ? false : true) ||
      monthQty === "" ||
      monthQty === 0 ||
      (shipTo.value ? false : true) ||
      this.state.shippingMonthsBlank;

    // Build shipToList
    if (this.props.sourceAddressList) {
      this.props.sourceAddressList.map((address) => {
        shipToList.push({
          value: address.addressId,
          label: address.addressName,
        });
      });
    }

    return (
      <div id="request-quote-page">
        <ConfirmationModal
          title="Your request has been submitted."
          brand="default"
          show={this.props.sendEmail.sent}
          onClose={this.resetEmail}
        >
          <p>
            Thank you for your interest. Your Tosca representative will contact
            you by either email or phone with the quote details.
          </p>

          <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
            <Button
              brand="secondary"
              type="button"
              fullwidth="true"
              onClick={this.resetEmail}
            >
              Request Another Quote
            </Button>
            <Button
              brand="primary"
              type="button"
              fullwidth="true"
              onClick={() => {
                this.context.router.history.push("/");
                this.resetEmail();
              }}
            >
              Return to Dashboard
            </Button>
          </div>
        </ConfirmationModal>
        <div className="rq-header">
          <div className="rq-title">
            <h3>Request A Quote</h3>
            <p>Complete the fields below to request a quote.</p>
          </div>
        </div>
        <EmailConfigHelper configName={emailConfigs.QUOTE_REQUEST}>
          {(emailConfig) => (
            <div className="rq-content">
              <form onSubmit={(e) => this.requestQuote(e, emailConfig)}>
                <div className="content">
                  <div className="left">
                    <div
                      className="form-group>"
                      style={{ marginBottom: "20px" }}
                    >
                      <ToscaField
                        name="containerType"
                        elementType="input"
                        isVertical={true}
                        inputType="text"
                        label="Commodity Type*"
                        hasError={this.state.containerTypeBlank}
                        errorMsg={"Commodity type is required"}
                      >
                        <Select
                          id="containerType"
                          options={containerTypeList}
                          value={containerType}
                          className="react-select"
                          components={{ DropdownIndicator }}
                          onChange={(option) =>
                            this.onContainerTypeChange(option, user)
                          }
                          isDisabled={false}
                        />
                      </ToscaField>
                    </div>
                    <div
                      className="form-group>"
                      style={{ marginBottom: "20px" }}
                    >
                      <ToscaField
                        name="containerSize"
                        elementType="input"
                        isVertical={true}
                        inputType="text"
                        label="RPC Size*"
                        hasError={this.state.containerSizeBlank}
                        errorMsg={"RPC Size is required"}
                      >
                        <Select
                          id="containerSize"
                          options={containerSizeList}
                          value={containerSize}
                          className="react-select"
                          components={{ DropdownIndicator }}
                          onChange={(option) =>
                            this.onContainerSizeChange(option, user)
                          }
                          isDisabled={false}
                        />
                      </ToscaField>
                    </div>
                  </div>
                  <div className="middle">
                    <ToscaField
                      name="containerSize"
                      elementType="input"
                      isVertical={true}
                      inputType="text"
                      label="What months are you actively shipping?*"
                      hasError={
                        this.state.shippingMonthsBlankCheck &&
                        this.state.shippingMonthsBlank
                      }
                      errorMsg={"Month selection is required"}
                    >
                      <div className="sub-content">
                        <div className="far-left">
                          <div>
                            <label htmlFor="chkJan">jan</label>
                          </div>
                          <div>
                            <label htmlFor="chkMay">may</label>
                          </div>
                          <div>
                            <label htmlFor="chkSep">sep</label>
                          </div>
                        </div>
                        <div className="left-left-center">
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkJan"
                              checked={this.state.chkJan}
                              onChange={() =>
                                this.setState({
                                  chkJan: !this.state.chkJan,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkMay"
                              checked={this.state.chkMay}
                              onChange={() =>
                                this.setState({
                                  chkMay: !this.state.chkMay,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkSep"
                              checked={this.state.chkSep}
                              onChange={() =>
                                this.setState({
                                  chkSep: !this.state.chkSep,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="left-center">
                          <div>
                            <label htmlFor="chkFeb">feb</label>
                          </div>
                          <div>
                            <label htmlFor="chkJun">jun</label>
                          </div>
                          <div>
                            <label htmlFor="chkOct">oct</label>
                          </div>
                        </div>
                        <div className="left-center-right">
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkFeb"
                              checked={this.state.chkFeb}
                              onChange={() =>
                                this.setState({
                                  chkFeb: !this.state.chkFeb,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkJun"
                              checked={this.state.chkJun}
                              onChange={() =>
                                this.setState({
                                  chkJun: !this.state.chkJun,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkOct"
                              checked={this.state.chkOct}
                              onChange={() =>
                                this.setState({
                                  chkOct: !this.state.chkOct,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="right-center">
                          <div>
                            <label htmlFor="chkMar">mar</label>
                          </div>
                          <div>
                            <label htmlFor="chkJul">jul</label>
                          </div>
                          <div>
                            <label htmlFor="chkNov">nov</label>
                          </div>
                        </div>
                        <div className="right-center-left">
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkMar"
                              checked={this.state.chkMar}
                              onChange={() =>
                                this.setState({
                                  chkMar: !this.state.chkMar,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkJul"
                              checked={this.state.chkJul}
                              onChange={() =>
                                this.setState({
                                  chkJul: !this.state.chkJul,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkNov"
                              checked={this.state.chkNov}
                              onChange={() =>
                                this.setState({
                                  chkNov: !this.state.chkNov,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="far-right">
                          <div>
                            <label htmlFor="chkApr">apr</label>
                          </div>
                          <div>
                            <label htmlFor="chkAug">aug</label>
                          </div>
                          <div>
                            <label htmlFor="chkDec">dec</label>
                          </div>
                        </div>
                        <div className="far-right-right">
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkApr"
                              checked={this.state.chkApr}
                              onChange={() =>
                                this.setState({
                                  chkApr: !this.state.chkApr,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkAug"
                              checked={this.state.chkAug}
                              onChange={() =>
                                this.setState({
                                  chkAug: !this.state.chkAug,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                          <div style={{ height: "33%" }}>
                            <input
                              type="checkbox"
                              id="chkDec"
                              checked={this.state.chkDec}
                              onChange={() =>
                                this.setState({
                                  chkDec: !this.state.chkDec,
                                  shippingMonthsBlankCheck: true,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-default"
                        style={{
                          fontSize: 11,
                          fontWeight: 100,
                          lineHeight: 1.15,
                          color: "#6e6f71",
                          textTransform: "uppercase",
                          padding: "3px 3px 1px 3px",
                          margin: 0,
                        }}
                        onClick={this.yearRoundClick}
                      >
                        All Year
                      </button>
                    </ToscaField>

                    <div
                      className="form-group quantity-by-month"
                      style={{ marginTop: "20px" }}
                    >
                      <ToscaField
                        name="monthQty"
                        isVertical={true}
                        elementType="input"
                        inputType="text"
                        value={monthQty}
                        label="quantity by month*"
                        onChange={this.onMonthQtyChange}
                        onBlur={this.onMonthQtyChange}
                        hasError={this.state.monthQtyBlank}
                        errorMsg={"Quantity by month is required"}
                      />
                    </div>
                  </div>
                  <div className="right">
                    <div
                      className="form-group>"
                      style={{ marginBottom: "20px" }}
                    >
                      <ToscaField
                        name="commodity"
                        isVertical={true}
                        elementType="input"
                        inputType="text"
                        value={commodity}
                        label="Describe what will you ship?"
                        onChange={this.onCommodityChange}
                        onBlur={this.onCommodityChange}
                      />
                    </div>
                    <div
                      className="form-group>"
                      style={{ marginBottom: "20px" }}
                    >
                      <ToscaField
                        name="shipTo"
                        elementType="input"
                        isVertical={true}
                        inputType="text"
                        label="Ship to Location*"
                        hasError={this.state.shipToBlank}
                        errorMsg={"Ship to location is required"}
                      >
                        <Select
                          id="shipTo"
                          options={shipToList}
                          value={shipTo}
                          className="react-select"
                          components={{ DropdownIndicator }}
                          onChange={(option) =>
                            this.onShipToChange(option, user)
                          }
                          isDisabled={false}
                        />
                      </ToscaField>
                    </div>
                  </div>
                </div>
                <div className="content-bottom">
                  <div className="tw-w-full">
                    <div
                      className="form-group>"
                      style={{ marginBottom: "20px" }}
                    >
                      <ToscaField
                        name=""
                        isVertical={true}
                        elementType="input"
                        inputType="text"
                        label="Notes"
                      >
                        <textarea
                          type="text"
                          maxLength="256"
                          id="notes"
                          className="form-control"
                          onChange={(e) =>
                            this.setState({ notes: e.target.value })
                          }
                          style={{ borderBottomColor: "" }}
                          value={notes}
                        />
                      </ToscaField>
                    </div>
                  </div>
                </div>
                <div className="footer">
                  <div className="submit">
                    <input
                      className={
                        submitDisabled ? "submit-btn disabled" : "submit-btn"
                      }
                      type="submit"
                      value="Submit"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
        </EmailConfigHelper>
      </div>
    );
  }
}

const { object, bool, string } = PropTypes;

RequestQuote.propTypes = {
  user: object.isRequired,
  authenticated: bool.isRequired,
  checked: bool.isRequired,
  accessToken: string,
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
  sendEmail,
  sourceAddresses,
  orderInventory,
  customer,
}) => ({
  user: session.user,
  authenticated: session.authenticated,
  checked: session.checked,
  accessToken: session.user.accessToken,
  sendEmail: sendEmail,
  sourceAddressList: sourceAddresses.sourceAddressList,
  orderInventory: orderInventory.orderInventory,
  customerInfo: customer.customerInfo,
});

export default connect(mapState)(RequestQuote);
