import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import "./style.css";
import { determineNavStyling } from "../../../../components/Nav/determineNavStyling";
import { customerService } from "../../../../images";
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
              For support, please contact one of our customer service
              representatives.
            </p>
          </div>

          <div className="cs-content">
            <div className="left">
              <div className="left-top cs-tile">
                <img src={customerService.produce} alt="produce" />
                <div className="wording">
                  <div>Produce Customer Experience</div>
                  <div style={{ marginTop: "8px" }}>
                    <div>
                      <img src={customerService.email} alt="email" />
                      <a
                        href={`mailto:DL_ProduceSupplyChain@toscaltd.com?subject=${encodeURIComponent(
                          this.props.customerInfo.customerName,
                        )}`}
                      >
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-bottom cs-tile">
                <img src={customerService.beef} alt="beef" />
                <div className="wording">
                  <div>Beef &amp; Pork Customer Experience</div>
                  <div style={{ marginTop: "8px" }}>
                    <div>
                      <img src={customerService.email} alt="email" />
                      <a
                        href={`mailto:DL_ProteinSupplyChain@toscaltd.com?subject=${encodeURIComponent(
                          this.props.customerInfo.customerName,
                        )}`}
                      >
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right">
              <div
                className="right-top cs-tile"
                style={{ paddingRight: "0px" }}
              >
                <img src={customerService.poultry} alt="poultry" />
                <div className="wording">
                  <div>Poultry and Seafood Customer Experience</div>
                  <div style={{ marginTop: "8px" }}>
                    <div>
                      <img src={customerService.email} alt="email" />
                      <a
                        href={`mailto:PoultrySupplyChain@toscaltd.com?subject=${encodeURIComponent(
                          this.props.customerInfo.customerName,
                        )}`}
                      >
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right-bottom cs-tile">
                <img src={customerService.eggs} alt="eggs" />
                <div className="wording">
                  <div>Eggs Customer Experience</div>
                  <div style={{ marginTop: "8px" }}>
                    <div>
                      <img src={customerService.email} alt="email" />
                      <a
                        href={`mailto:DL_EggSupplyChain@toscaltd.com?subject=${encodeURIComponent(
                          this.props.customerInfo.customerName,
                        )}`}
                      >
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
