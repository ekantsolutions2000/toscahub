import React from "react";
import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { sessionActions, userActions } from "../../actions";
import AccountNav from "./AccountNav";
import { logos } from "../../images";
import { config } from "../../utils/conf";
import { Roles, authorize } from "../../utils/AuthService";
import InboundNav from "./InboundNav";
import OutboundNav from "./OutboundNav";
import useGetCustomer from "../../hooks/CustomerProfile/useGetCustomer";
import useSession from "../../hooks/Auth/useSession";
import { nav } from "../../images";
import { Link } from "react-router-dom";
import * as UserTypes from "../../utils/UserTypes";
function Nav(props) {
  const { userType } = useSession();

  const isInboundCustomer = userType === UserTypes.INBOUND;

  const onSwitchToAdminAccount = () => {
    props.dispatch(
      sessionActions.removeOrg(props.user.accessToken, props.user.initialUser),
    );
    window.location.reload(false);
  };

  const logoutClick = () => {
    props.dispatch(sessionActions.destroy());
    props.dispatch(userActions.logout());
  };

  let isCssRole = authorize(
    props.user,
    Roles.ADMINISTRATOR,
    Roles.CUSTOMER_SERVICE,
  );

  let NavLink;

  NavLink = isInboundCustomer ? InboundNav : OutboundNav;

  const { logo_white_bg_black_text } = logos;
  const { customerId } = useSession();

  const { data: customer, isLoading } = useGetCustomer(customerId);
  const customerName = customer?.customerName;

  return (
    !isLoading && (
      <nav className="nav-wrapper tw-py-2">
        <div className="tw-flex tw-mx-auto tw-px-2 md:tw-px-20 tw-items-center tw-gap-4">
          {/* left */}
          <div className="tw-flex tw-space-x-4 tw-items-center">
            <a
              className="navbar-brand-"
              href="https://www.toscaltd.com/"
              target="_blank"
              rel="noopener noreferrer">
              <img src={logo_white_bg_black_text} alt="home" />
            </a>
            <div className="navbar-environment">{config.environmentName}</div>
          </div>

          <div className="tw-flex-1 tw-flex tw-justify-center">
            <div className="collapse navbar-collapse">
              {NavLink ? (
                <ul className="nav navbar-nav">
                  <NavLink user={props.user} />

                  <li>
                    <Link to="/all-users" id="nav-users">
                      Users
                    </Link>
                  </li>
                </ul>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Right */}
          <div className="tw-flex tw-items-center tw-gap-2">
            <div className="tw-hidden">
              <img className="" src={nav.setting} alt="setting" />
              <img className="" src={nav.notification} alt="notification" />
            </div>

            <ul className="nav navbar-nav navbar-right-">
              <AccountNav
                accountName={props.userName}
                customerName={customerName}
                isCssRole={isCssRole}
                onLogout={logoutClick}
                onSwitchToAdminAccount={onSwitchToAdminAccount}
                user={props.user}
              />
            </ul>
          </div>
        </div>
      </nav>
    )
  );
}

const { string, bool } = PropTypes;

Nav.propTypes = {
  authenticated: bool.isRequired,
  checked: bool.isRequired,
  userName: string,
};

const mapState = ({ session }) => ({
  userName: session.user.UserName,
  checked: session.checked,
  authenticated: session.authenticated,
  user: session.user,
  session: session,
});

export default connect(mapState)(withRouter(Nav));
