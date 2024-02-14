import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { invoiceActions, emailActions, customerActions } from "../../actions";
import { InvoiceList } from "../../components";
import { determineNavStyling } from "../../components/Nav/determineNavStyling";
import { icons, logos } from "../../images";
import { Link } from "react-router-dom";
import {
  emailConfigs,
  EmailConfigHelper,
} from "./../../components/HOC/withEmail/withEmail";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import Button from "../../components/Button/Button";
class Invoices extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showFilter: false,
      filterOptions: null,
      thankYou: false,
    };
  }

  componentDidMount() {
    const { accessToken, invoices } = this.props;
    if (accessToken && invoices.length < 1) this.getInvoices();
    determineNavStyling(this.props.location.pathname);
    this.props.dispatch(
      customerActions.fetchCustomerInfo(this.props.user.CustomerInfo.CustID),
    );

    this.props.dispatch(
      customerActions.fetchCustomerInfo(
        this.props.accessToken,
        this.props.user.CustomerInfo.CustID,
      ),
    );
  }

  componentDidUpdate(prevProps) {
    const { accessToken } = this.props;
    if (accessToken !== prevProps.accessToken) this.getInvoices();
  }

  componentWillUnmount() {
    this.resetEmail();
  }

  getInvoices = () => {
    const { accessToken, dispatch, user } = this.props;

    dispatch(invoiceActions.fetchInvoices(accessToken));
    if (user.CustomerInfo.CustID)
      dispatch(invoiceActions.fetchATC(user.CustomerInfo.CustID));
  };

  requestProofOfDelivery = (invoiceNumber, emailConfig) => {
    const { accessToken, dispatch, user } = this.props,
      { sendEmail } = emailActions,
      email = {
        Recipients: emailConfig.getReciepients(),
        CopyRecipients: emailConfig.getCopyReciepients(),
        Subject: `Proof Of Delivery Request`,
        Body: `Please send proof of delivery for invoice ${invoiceNumber}`,
      };

    dispatch(
      sendEmail(
        accessToken,
        {
          ...user.CustomerInfo,
          CustName: this.props.customerInfo.customerName,
          ContactEmail: user.Email,
        },
        email,
      ),
    );
  };

  resetEmail = () => {
    this.props.dispatch(emailActions.reset());
  };

  render() {
    const { loading, atc, sendEmail } = this.props;
    const { info } = icons;
    const { anytimeCollect } = logos;

    return (
      <div className="page">
        <div id="invoicing-page">
          <div style={{ display: this.state.showFilter ? "none" : "block" }}>
            <ConfirmationModal
              title="Request Submitted"
              show={sendEmail.sent}
              onClose={() => this.resetEmail()}
            >
              <p>You will receive an email confirming Proof of Delivery.</p>
              <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
                <Button
                  brand="secondary"
                  type="button"
                  onClick={() => this.resetEmail()}
                >
                  View Invoices
                </Button>
                <Button
                  brand="primary"
                  type="button"
                  onClick={() => this.context.router.history.push("/")}
                >
                  Return to Dashboard
                </Button>
              </div>
            </ConfirmationModal>

            <div
              className="header-info header-info tw-flex tw-flex-row tw-items-center tw-justify-start
                            tab:tw-flex-col tab:tw-items-start xs:tw-flex-col xs:tw-items-start"
            >
              <h3 className="tw-mr-16 xs:tw-mr-0">Invoices</h3>
              <div
                className="atc-link xs:tw-pt-2"
                style={{ display: atc.Result && !loading ? "flex" : "none" }}
              >
                <img className="info" src={info} alt="Anytime Collect info" />
                <p className="donwload-link">
                  To view and download individual invoices, visit{" "}
                  <a target="_blank" rel="noopener noreferrer" href={atc.Value}>
                    Anytime Collect.
                  </a>
                </p>
                <a
                  className="atc-logo-link"
                  href={atc.Value}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="atc-logo tab:tw-ml-4"
                    src={anytimeCollect}
                    alt="Anytime Collect logo"
                  />
                </a>
              </div>
            </div>
            <div
              className="err-msg"
              style={{ display: sendEmail.error ? "block" : "none" }}
            >
              Unable to send email, please try again later or contact{" "}
              <Link to="/resources/customer-service">customer service.</Link>
            </div>
          </div>
          <EmailConfigHelper configName={emailConfigs.PROOF_OF_DELIVERY}>
            {(emailConfig) => (
              <InvoiceList
                invoices={this.props.invoices}
                loading={loading}
                requestProofOfDelivery={(invoiceNumber) =>
                  this.requestProofOfDelivery(invoiceNumber, emailConfig)
                }
                filter_options={this.state.filterOptions}
                showFilter={(val) => this.setState({ showFilter: val })}
              />
            )}
          </EmailConfigHelper>
        </div>
      </div>
    );
  }
}

const { array, string, object, bool } = PropTypes;

Invoices.propTypes = {
  user: object,
  invoices: array,
  atc: object,
  accessToken: string,
  error: object,
  loading: bool,
};

const mapState = ({ invoices, session, sendEmail, customer }) => ({
  user: session.user,
  invoices: invoices.invoices,
  atc: invoices.atcURL,
  error: invoices.error,
  accessToken: session.user.accessToken,
  loading: invoices.fetching,
  sendEmail: sendEmail,
  customerInfo: customer.customerInfo,
});

export default connect(mapState)(Invoices);
