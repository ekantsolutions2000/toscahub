import React, { useEffect } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import $ from "jquery";
import { nav } from "../../../images";
import SwitchAccount from "../SwitchAccount";
import { Roles, authorize } from "../../../utils/AuthService";
import useSession from "../../../hooks/Auth/useSession";
import useGetCustomer from "../../../hooks/CustomerProfile/useGetCustomer";

function NewCustomerNav() {
  return (
    <React.Fragment>
      <li>
        <Link to="/new-customer-setup">New Customer</Link>
      </li>
      <li className="divider" />
    </React.Fragment>
  );
}

function SwitchCustomerNav({ user }) {
  if (
    authorize(
      user,
      Roles.ADMINISTRATOR,
      Roles.MULTI_ORGANIZATION_CUSTOMER_USER,
      Roles.CUSTOMER_SERVICE,
    )
  ) {
    return (
      <li>
        <SwitchAccount />
      </li>
    );
  }
  return null;
}

export default function AccountNav(props) {
  const { user, customerId } = useSession();

  const { data: customer } = useGetCustomer(customerId);
  const customerName = customer?.customerName;

  useEffect(() => {
    $("ul.nav li.dropdown").hover(
      function () {
        $(this)
          .find(".dropdown-menu")
          .stop(true, true)
          .delay(50)
          .slideDown(150);
      },
      function () {
        $(this).find(".dropdown-menu").stop(true, true).delay(50).slideUp(150);
      },
    );

    $("ul.nav li.dropdown").click(function () {
      $(this).find(".dropdown-menu").stop(true, true).delay(0).fadeIn(0);
    });
  }, []);

  const stringTruncate = (string, length, ending) => {
    if (length == null) {
      length = 25;
    }
    if (ending == null) {
      ending = "...";
    }
    if (string.length > length) {
      return string.substring(0, length - ending.length).trim() + ending;
    } else {
      return string;
    }
  };

  return (
    <li className="dropdown">
      <div>
        <span
          id="nav-account-"
          to="/account/information"
          className="tw-gap-2 nav-account"
        >
          <img className="" src={nav.user} alt="user" />

          <div className="tw-flex tw-flex-col">
            <span>{user.UserName}</span>
            <span className="customer-name">
              {` [${stringTruncate(customerName || "...")}]`}
            </span>
          </div>
        </span>
      </div>

      <ul className="dropdown-menu tw-space-y-2">
        <li>
          <Link to="/account/information">Account</Link>
        </li>

        <li>
          <Link to="/account/locations">Locations</Link>
        </li>
        {/* {!props.isCssRole && (
            <li>
              <Link to="/account/request-user">Request User</Link>
            </li>
          )} */}

        <SwitchCustomerNav user={user} />

        <NewCustomerNav user={user} />
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </li>
  );
}

const { string } = PropTypes;

AccountNav.propTypes = {
  accountName: string,
  customerName: string,
};
