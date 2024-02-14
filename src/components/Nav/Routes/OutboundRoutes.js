import React, { Component } from "react";
import { PrivateRoute } from "../..";
import { Route, Redirect } from "react-router-dom";

import {
  Home,
  Ordering,
  Account,
  Locations,
  RequestUser,
  Invoicing,
  RequestAccount,
  Reporting,
  Resources,
  CopDashboard,
  NewCustomerSetup,
  OrderLogs,
  Logout,
  SwitchAccount,
} from "../../../screens";

class OutboundRoutes extends Component {
  render() {
    const { authenticated } = this.props;

    return (
      <React.Fragment>
        <PrivateRoute
          exact
          path="/"
          component={Home}
          authenticated={authenticated}
        />
        <PrivateRoute
          exact
          path="/home"
          component={Home}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/account/information"
          component={Account}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/account/locations"
          component={Locations}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/account/request-user"
          component={RequestUser}
          authenticated={authenticated}
        />
        <PrivateRoute
          exact
          path="/ordering"
          component={Ordering.Ordering}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/ordering/new"
          component={Ordering.PlaceOrder}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/ordering/request-quote"
          component={Ordering.RequestQuote}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/ordering/view"
          component={Ordering.ViewOrders}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/invoicing"
          component={Invoicing}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/reporting/transactions"
          component={Reporting.Transactions}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/reporting/returns"
          component={Reporting.Returns}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/resources/feedback"
          component={Resources.Feedback}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/resources/customer-service"
          component={Resources.OutboundCustomerService}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/resources/faq"
          component={Resources.FAQ}
          authenticated={authenticated}
        />
        <PrivateRoute
          exact
          path="/new-customer-setup"
          component={NewCustomerSetup}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/cop-dashboard"
          component={CopDashboard}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/logs/order"
          component={OrderLogs}
          authenticated={authenticated}
        />
        <Route path="/request_account" component={RequestAccount} />
        <Route path="/logout" component={Logout} />
        <Route path="/switch-account" component={SwitchAccount} />
      </React.Fragment>
    );
  }
}
export default OutboundRoutes;
