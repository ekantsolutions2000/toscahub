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
  containerReturnActions,
  inventoryActions,
  customerActions,
} from "../../../actions";
import {
  emailConfigs,
  EmailConfigHelper,
} from "../../../components/HOC/withEmail/withEmail";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";
import Button from "../../../components/Button/Button";

class Returns extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      contactName: "",
      contactNumber: "",
      returnQty: "",
      notes: "",
      shipFrom: "",
      commodityType: "",
      address: undefined,
      storedInside: false,
      storedOutside: false,
    };
  }

  componentDidMount() {
    this.fetchSourceAddressList();
    determineNavStyling(this.props.location.pathname);
    this.fetchOrderInventory();
    this.props.dispatch(
      customerActions.fetchCustomerInfo(
        this.props.accessToken,
        this.props.user.CustomerInfo?.CustID,
      ),
    );
  }

  componentDidUpdate(prevProps) {
    this.fetchSourceAddressList();
    this.fetchOrderInventory();
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

  getCommodityTypeList = () => {
    const contClassList = [];

    this.props.orderInventoryList
      .filter(
        (val, i, arr) =>
          arr.findIndex((t) => t.itemClassKey === val.itemClassKey) === i,
      )
      .map((orderClass) => {
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

    return contClassList;
  };

  requestReturn = (e, emailConfig) => {
    e.preventDefault();

    const returnRequest = {
      recipients: emailConfig.getReciepients(),
      copyRecipients: emailConfig.getCopyReciepients(),
      contactName: this.state.contactName,
      contactNumber: this.state.contactNumber,
      shipFrom: {
        ...this.state.shipFrom,
        address: this.state.address,
        value: parseInt(this.state.shipFrom.value),
      },
      qty: this.state.returnQty,
      storedInside: this.state.storedInside,
      notes: this.state.notes,
    };

    const { dispatch, user } = this.props;
    let userObj = user;
    userObj.CustomerInfo.CustName = this.props.customerInfo.customerName;
    userObj.CustomerInfo.CustKey = this.props.customerInfo.customerKey;

    dispatch(
      containerReturnActions.requestContainerReturn(
        user.accessToken,
        userObj,
        returnRequest,
      ),
    );
  };

  resetEmail = () => {
    this.props.dispatch(containerReturnActions.reset());
    this.setState({
      contactName: "",
      contactNumber: "",
      returnQty: "",
      notes: "",
      shipFrom: "",
      commodityType: "",
      address: "",
      storedInside: false,
      storedOutside: false,
    });
  };

  onShipFromChange = (option, user) => {
    const selectedAddress =
      this.props.sourceAddressList.filter(
        (address) => address.addressId === option.value,
      )[0] || user.CustomerInfo;
    this.setState({
      shipFrom: option,
      address: `${selectedAddress.addressLine1}, ${
        selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ", " : ""
      }\n${selectedAddress.city}, ${
        selectedAddress.state
      }, ${selectedAddress.postalCode.substr(0, 5)}, ${
        selectedAddress.country
      }`,
    });
  };

  onCommodityTypeChange = (option) => {
    this.setState({
      commodityType: option,
    });
  };

  onKeyPressNumberHandler = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    let reg = /^\d+$/;
    if (!reg.test(keyValue)) {
      event.preventDefault();
    }
  };

  isValidEntry = () => {
    return !(
      this.state.contactName &&
      this.state.commodityType &&
      this.state.shipFrom &&
      this.state.contactNumber &&
      this.state.returnQty &&
      this.state.notes
    );
  };

  enableSubmit = () => {
    return this.isValidEntry();
  };

  render() {
    const { user } = this.props;
    const shipFromList = [];
    const { address, commodityType } = this.state;

    // Build shipFromList
    if (this.props.sourceAddressList) {
      this.props.sourceAddressList.map((address) => {
        shipFromList.push({
          value: address.addressId,
          label: address.addressName,
        });
      });
    }

    return (
      <div id="returns-page">
        <ConfirmationModal
          title="Return request submitted."
          brand="default"
          show={this.props.submitted}
          onClose={this.resetEmail}
        >
          <p>
            A Tosca representative will contact you by either email or phone
            with collection details.
          </p>

          <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
            <Button
              brand="secondary"
              type="button"
              fullwidth="true"
              onClick={this.resetEmail}
            >
              Submit Another Return
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

        <div className="ret-header">
          <div className="ret-title">
            <h3>Returning Containers to Tosca</h3>
            <p>Complete the fields below to request container pickup.</p>
          </div>
        </div>

        <EmailConfigHelper
          configName={emailConfigs.RETURN_REQUEST}
          commodityTypes={[commodityType.label]}
        >
          {(emailConfig) => (
            <div className="ret-content">
              <form onSubmit={(e) => this.requestReturn(e, emailConfig)}>
                <div className="content">
                  <div className="left">
                    <div className="form-group">
                      <label htmlFor="returnQty">Contact Name</label>
                      <input
                        type="text"
                        id="contactName"
                        className="form-control"
                        value={this.state.contactName}
                        onChange={(e) => {
                          this.setState({ contactName: e.target.value });
                        }}
                        required
                      />
                    </div>
                    <div
                      className="form-group>"
                      style={{ marginBottom: "15px" }}
                    >
                      <label>how were the containers stored?</label>
                      <div>
                        <label
                          htmlFor="storedInside"
                          style={{ marginRight: "5px" }}
                        >
                          INSIDE
                        </label>
                        <input
                          type="radio"
                          id="storedInside"
                          checked={this.state.storedInside}
                          onChange={() =>
                            this.setState({
                              storedInside: true,
                              storedOutside: false,
                            })
                          }
                          style={{ marginRight: "15px" }}
                        />
                        <label
                          htmlFor="storedOutside"
                          style={{ marginRight: "5px" }}
                        >
                          OUTSIDE
                        </label>
                        <input
                          type="radio"
                          id="storedOutside"
                          checked={this.state.storedOutside}
                          onChange={() =>
                            this.setState({
                              storedInside: false,
                              storedOutside: true,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div
                      className="form-group>"
                      style={{ marginBottom: "15px" }}
                    >
                      <label htmlFor="commodity_type">COMMODITY TYPE</label>
                      <Select
                        id="commodity_type"
                        options={this.getCommodityTypeList()}
                        value={commodityType}
                        className="react-select"
                        components={{ DropdownIndicator }}
                        onChange={(option) =>
                          this.onCommodityTypeChange(option, user)
                        }
                        isDisabled={false}
                        backspaceRemovesValue={false}
                      />
                    </div>
                    <div className="form-group>">
                      <label htmlFor="ship_to">SHIP FROM LOCATION</label>
                      <Select
                        id="ship_to"
                        options={shipFromList}
                        value={this.state.shipFrom}
                        className="react-select"
                        components={{ DropdownIndicator }}
                        onChange={(option) =>
                          this.onShipFromChange(option, user)
                        }
                        isDisabled={false}
                        backspaceRemovesValue={false}
                      />
                      {address && (
                        <textarea
                          id="ship-to-address"
                          className="form-control remove-border"
                          value={address}
                          defaultValue=""
                          readOnly
                        />
                      )}
                    </div>
                  </div>
                  <div className="right">
                    <div className="form-group">
                      <label htmlFor="returnQty">Contact Number</label>
                      <input
                        type="text"
                        id="contactNumber"
                        className="form-control"
                        value={this.state.contactNumber}
                        onChange={(e) => {
                          this.setState({ contactNumber: e.target.value });
                        }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="returnQty">Quantity to Return</label>
                      <input
                        type="number"
                        id="returnQty"
                        className="form-control"
                        value={this.state.returnQty}
                        onChange={(e) => {
                          this.setState({ returnQty: e.target.value });
                        }}
                        onKeyPress={(e) => this.onKeyPressNumberHandler(e)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="notes">Notes</label>
                      <textarea
                        id="notes"
                        className="form-control"
                        value={this.state.notes}
                        onChange={(e) => {
                          this.setState({ notes: e.target.value });
                        }}
                        style={{ minHeight: "100px" }}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="footer">
                  <div className="submit">
                    <input
                      disabled={this.enableSubmit()}
                      className="tw-relative tw-bg-tosca-orange hover:tw-bg-orange-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
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

Returns.propTypes = {
  user: object.isRequired,
  authenticated: bool.isRequired,
  checked: bool.isRequired,
  accessToken: string,
  orderInventory: object,
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
  returnRequest,
  sourceAddresses,
  orderInventory,
  customer,
}) => ({
  authenticated: session.authenticated,
  checked: session.checked,
  accessToken: session.user.accessToken,
  user: session.user,
  submitting: returnRequest.submitting,
  submitted: returnRequest.submitted,
  sourceAddresses: sourceAddresses,
  sourceAddressList: sourceAddresses.sourceAddressList,
  orderInventory: orderInventory,
  orderInventoryList: orderInventory.orderInventory,
  customerInfo: customer.customerInfo,
});

export default connect(mapState)(Returns);
