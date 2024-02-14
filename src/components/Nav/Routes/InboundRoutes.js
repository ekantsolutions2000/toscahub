import React, { Component } from "react";
import { PrivateRoute } from "../../../components";
import { Route, Redirect } from "react-router-dom";

import {
  Home,
  Ordering,
  Account,
  Locations,
  RequestUser,
  RequestAccount,
  Resources,
  CollectionOrders,
  CopDashboard,
  NewCustomerSetup,
  OrderLogs,
  Logout,
  SwitchAccount,
} from "../../../screens";

class InboundRoutes extends Component {
  render() {
    const { authenticated } = this.props;

    return (
      <React.Fragment>
        <PrivateRoute
          exact
          path="/"
          component={CopDashboard}
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
          path="/resources/feedback"
          component={Resources.Feedback}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/resources/customer-service"
          component={Resources.InboundCustomerService}
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
          exact
          path="/collection-orders"
          component={CollectionOrders.ViewOrders}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/collection-orders/new"
          component={CollectionOrders.PlaceOrder}
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
export default InboundRoutes;
