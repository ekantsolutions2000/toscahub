import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { determineNavStyling } from "../../../components/Nav/determineNavStyling";
import { pagination_icons } from "../../../images";
import { ThankYouModal } from "../../../components";
import { addressActions, emailActions } from "../../../actions";
import Select, { components } from "react-select";
import {
  EmailConfigHelper,
  emailConfigs,
} from "../../../components/HOC/withEmail/withEmail";

class RequestUser extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  constructor(props, context) {
    super(props, context);

    this.state = {
      firstName: "",
      lastName: "",
      reqUserId: "",
      email: "",
      phone: "",
      locationName: "",
      notInvExpanded: false,
      notDailyPlanExpanded: false,
      notShipExpanded: false,
    };
  }

  componentDidMount() {
    this.fetchSourceAddressList();
    determineNavStyling(this.props.location.pathname);
  }

  componentDidUpdate() {
    this.fetchSourceAddressList();
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

  requestUser = (e, emailConfig) => {
    e.preventDefault();

    const { firstName, lastName, email, phone, locationName } = this.state,
      { accessToken, dispatch, user } = this.props,
      { sendEmail } = emailActions,
      _email = {
        Recipients: emailConfig.getReciepients(),
        CopyRecipients: emailConfig.getCopyReciepients(),
        Subject: `Requesting a New User${
          user.CustomerInfo && user.CustomerInfo.CustName
            ? " - " + user.CustomerInfo.CustName
            : ""
        }`,
        Body: `<br/>
        First Name: ${firstName}<br/> 
        Last Name: ${lastName}<br/>
        Email: ${email}<br/>
        Phone: ${phone}<br/>
        Location: ${locationName.label ? locationName.label : ""}<br/>
        Requested by: ${user.UserName}`,
      };

    dispatch(
      sendEmail(
        accessToken,
        { ...user.CustomerInfo, ContactEmail: user.Email },
        _email,
      ),
    );
  };

  resetEmail = () => {
    this.props.dispatch(emailActions.reset());
    window.location.reload();
  };

  toggleNotificationDropdown = (notificationId) => {
    this.setState({
      [`${notificationId}Expanded`]: !this.state[`${notificationId}Expanded`],
    });
  };

  render() {
    const { user } = this.props;
    const addressList = [];
    const notificationList = [
      {
        title: "Invoices",
        id: "notInv",
      },
      {
        title: "Daily Planned Order Report",
        id: "notDailyPlan",
      },
      {
        title: "Shipping By Location",
        id: "notShip",
      },
    ];
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

    if (this.props.sourceAddressList) {
      this.props.sourceAddressList.map((address) => {
        if (address.addressName !== "") {
          addressList.push({
            value: address.addressId,
            label: address.addressName,
          });
        }
        return true;
      });
    }

    return (
      <div id="request-user-page">
        <ThankYouModal
          visible={this.props.sendEmail.sent}
          closeModal={this.resetEmail}
          title="User Request Submitted.">
          <p>
            Your Tosca customer service representative will be in contact to
            complete user setup.
          </p>
          <div className="modal-btns">
            <button type="button" onClick={this.resetEmail}>
              Request Another User
            </button>
            <button
              type="button"
              className="home-nav_btn"
              onClick={() => {
                this.context.router.history.push("/");
                this.resetEmail();
              }}>
              Return to Dashboard
            </button>
          </div>
        </ThankYouModal>
        <div className="ru-header">
          <div className="ru-title">
            <h3>Request Additional User</h3>
            <p>
              Complete the fields below to add an additional user to your
              account.
            </p>
          </div>
        </div>

        <div className="ru-content">
          <EmailConfigHelper configName={emailConfigs.REQUEST_USER}>
            {(emailConfig) => (
              <form onSubmit={(e) => this.requestUser(e, emailConfig)}>
                <div className="ruc-header">
                  <div className="left">
                    <div className="user-info">
                      <div className="title">
                        <h2>User Information</h2>
                      </div>
                      <div className="content">
                        <div className="left">
                          <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                              type="text"
                              id="firstName"
                              className="form-control"
                              value={this.state.firstName}
                              onChange={(e) => {
                                this.setState({ firstName: e.target.value });
                              }}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                              type="text"
                              id="lastName"
                              className="form-control"
                              value={this.state.lastName}
                              onChange={(e) => {
                                this.setState({ lastName: e.target.value });
                              }}
                              required
                            />
                          </div>
                        </div>
                        <div className="right">
                          <div className="form-group">
                            <label htmlFor="email">email</label>
                            <input
                              type="email"
                              id="email"
                              className="form-control"
                              value={this.state.email}
                              onChange={(e) => {
                                this.setState({ email: e.target.value });
                              }}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="phone">phone</label>
                            <input
                              type="tel"
                              id="phone"
                              className="form-control"
                              value={this.state.phone}
                              onChange={(e) => {
                                this.setState({ phone: e.target.value });
                              }}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="loc-info">
                      <div className="title">
                        <h2>Location Information</h2>
                        <div className="message">(optional)</div>
                      </div>
                      <div className="content">
                        <div className="left">
                          <div className="form-group">
                            <label htmlFor="locationName">location name</label>

                            <Select
                              id="locationName"
                              options={addressList}
                              value={this.state.locationName}
                              className="react-select"
                              components={{ DropdownIndicator }}
                              onChange={(option) => {
                                this.setState({ locationName: option });
                              }}
                              isDisabled={false}
                              backspaceRemovesValue={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="right tw-opacity-0">
                    <div className="notifications">
                      <div className="title">
                        <div className="left">
                          <h2>Notifications</h2>
                        </div>
                        <div className="middle">
                          <span
                            className="glyphicon glyphicon-envelope"
                            style={{ paddingTop: "50%" }}
                          />
                        </div>
                        <div className="right">
                          <span
                            className="glyphicon glyphicon-phone"
                            style={{ paddingTop: "50%" }}
                          />
                        </div>
                      </div>
                      <div style={{ fontStyle: "italic", fontWeight: 500 }}>
                        Notification options coming soon...
                      </div>
                      <div style={{ display: "none" }} className="content">
                        {notificationList ? (
                          notificationList.map((notification, nIdx) => (
                            <div
                              className="item"
                              style={{
                                backgroundColor: this.state[
                                  `${notification.id}Expanded`
                                ]
                                  ? "rgba(126,212,247, .1)"
                                  : "white",
                              }}
                              key={`notificationItem${nIdx}`}>
                              <div
                                className="title"
                                onClick={() =>
                                  this.toggleNotificationDropdown(
                                    notification.id,
                                  )
                                }>
                                <div className="left">{notification.title}</div>
                                <div className="middle" />
                                <div className="right">
                                  {this.state[`${notification.id}Expanded`] ? (
                                    <img
                                      src={pagination_icons.UpArrow}
                                      alt="shrink notification"
                                      style={{
                                        width: "50%",
                                        marginLeft: "15%",
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src={pagination_icons.DownArrow}
                                      alt="expand notification"
                                      style={{
                                        width: "50%",
                                        marginLeft: "15%",
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                              {this.state[`${notification.id}Expanded`] ? (
                                <div className="detail">
                                  {this.props.sourceAddressList ? (
                                    this.props.sourceAddressList.map(
                                      (location, lIdx) => (
                                        <div
                                          className="row"
                                          key={`notificationSubItem-${nIdx}-${lIdx}`}>
                                          <div className="left">
                                            {location.addressName}
                                          </div>
                                          <div className="middle">
                                            <input
                                              type="checkbox"
                                              className="form-control"
                                              id={`inp-${notification.id}-email-${nIdx}-${lIdx}`}
                                              style={{
                                                boxShadow: "none",
                                                display: "inline",
                                                margin: "0 0 0 10px",
                                                height: "20px",
                                              }}
                                            />
                                          </div>
                                          <div className="right">
                                            <input
                                              type="checkbox"
                                              className="form-control"
                                              id={`inp-${notification.id}-text-${nIdx}-${lIdx}`}
                                              style={{
                                                boxShadow: "none",
                                                display: "inline",
                                                margin: "0 0 0 10px",
                                                height: "20px",
                                              }}
                                              disabled={true}
                                            />
                                          </div>
                                        </div>
                                      ),
                                    )
                                  ) : (
                                    <div />
                                  )}
                                </div>
                              ) : (
                                <div />
                              )}
                            </div>
                          ))
                        ) : (
                          <div />
                        )}
                      </div>
                      <div className="footer">
                        <span className="glyphicon glyphicon-envelope" /> Emails{" "}
                        <span
                          className="glyphicon glyphicon-phone"
                          style={{ paddingLeft: "26px" }}
                        />{" "}
                        Text Message
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ruc-footer">
                  <div className="create-pass">
                    <div className="title">
                      <h4>Requester</h4>
                    </div>
                    <div className="content">
                      <div className="left">
                        <div className="form-group">
                          <label htmlFor="userId">User Id</label>
                          <input
                            type="text"
                            id="userId"
                            className="form-control"
                            value={user.UserName}
                            style={{
                              fontSize: 16,
                              background: "none",
                              border: "none",
                              boxShadow: "none",
                              backgroundImage: "none",
                              marginLeft: "-10px",
                            }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="submit">
                        <input
                          style={{
                            color: "white",
                            fontSize: 20,
                            width: 124,
                            height: 48,
                          }}
                          className="submit-btn"
                          type="submit"
                          value="Submit"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </EmailConfigHelper>
        </div>
      </div>
    );
  }
}

const { object, bool, string } = PropTypes;

RequestUser.propTypes = {
  user: object.isRequired,
  authenticated: bool.isRequired,
  checked: bool.isRequired,
  accessToken: string,
};

const mapState = ({ session, sendEmail, sourceAddresses }) => ({
  user: session.user,
  authenticated: session.authenticated,
  checked: session.checked,
  accessToken: session.user.accessToken,
  sendEmail: sendEmail,
  sourceAddresses: sourceAddresses,
  sourceAddressList: sourceAddresses.sourceAddressList,
});

export default connect(mapState)(RequestUser);
