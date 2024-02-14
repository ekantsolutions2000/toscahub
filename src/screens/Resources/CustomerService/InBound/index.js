import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import "./style.css";
import { determineNavStyling } from "../../../../components/Nav/determineNavStyling";
import { customerActions } from "../../../../actions";

class CustomerService extends Component {
  componentDidMount() {
    determineNavStyling(this.props.location.pathname);

    this.props.dispatch(
      customerActions.fetchCustomerInfo(
        this.props.accessToken,
        this.props.user.CustomerInfo.CustID,
      ),
    );
  }

  render() {
    return (
      <div id="customer-service-page">
        <div className="cs-header">
          <div className="cs-title">
            <h3>Customer Service</h3>
            <p>
              For support, please contact{" "}
              <a
                href={`mailto:supplychain@toscaltd.com?subject=${this.props.customerInfo.customerName}`}>
                Supply Chain
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const { object, bool, string } = PropTypes;

CustomerService.propTypes = {
  user: object.isRequired,
  authenticated: bool.isRequired,
  checked: bool.isRequired,
  accessToken: string,
};

const mapState = ({ session, customer }) => ({
  user: session.user,
  authenticated: session.authenticated,
  checked: session.checked,
  accessToken: session.user.accessToken,
  customerInfo: customer.customerInfo,
});

export default connect(mapState)(CustomerService);
