import React from "react";
import { PrivateRoute } from "../..";
import { Route, Redirect } from "react-router-dom";
import * as URL from "./Url";
import useSession from "../../../hooks/Auth/useSession";
import _ from "lodash";
import * as UserTypes from "../../../utils/UserTypes";
import {
  Home,
  Account,
  RequestUser,
  NewLogin,
  RequestAccount,
  Reporting,
  Resources,
  CopDashboard,
  OrderLogs,
  BulkOrderLogs,
  CollectionOrderLogs,
  Logout,
  SwitchAccount,
  Users,
  TransactionHistory,
} from "../../../screens";

import inboundPages from "./InboundRoutePages";
import outboundPages from "./OutboundRoutePages";

const NotFound = (props) => {
  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-h-64 tw-text-2xl tw-font-light">
      The resource could not be found.
    </div>
  );
};

const Loading = (props) => {
  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-h-64 tw-text-2xl tw-font-light">
      Loading...
    </div>
  );
};

function Routes(props) {
  const { userType } = useSession();
  console.log("UserType: xxxxxxxxxxxxxx", userType);
  const isLoggedIn = _.get(props.user, "accessToken", undefined) ? true : false;

  const getUserComponent = (url) => {
    let page = Loading;

    if (userType === UserTypes.INBOUND) {
      page = inboundPages[url] || NotFound;
    }

    if (userType === UserTypes.OUTBOUND) {
      page = outboundPages[url] || NotFound;
    }

    if (
      ![UserTypes.INBOUND, UserTypes.OUTBOUND].includes(userType) &&
      isLoggedIn
    ) {
      page = outboundPages[url] || inboundPages[url] || NotFound;
    }

    return page;
  };
  const { authenticated } = props;

  return (
    <React.Fragment>
      <PrivateRoute
        exact
        path={URL.ROOT}
        component={getUserComponent(URL.ROOT)}
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
        path={URL.ACCOUNT_LOCATIONS}
        component={getUserComponent(URL.ACCOUNT_LOCATIONS)}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/account/request-user"
        component={RequestUser}
        authenticated={authenticated}
      />
      <PrivateRoute
        exact
        path={URL.ORDERING}
        component={getUserComponent(URL.ORDERING)}
        authenticated={authenticated}
      />
      <PrivateRoute
        path={URL.ORDERING_NEW_SINGLE_ORDER}
        component={getUserComponent(URL.ORDERING_NEW_SINGLE_ORDER)}
        authenticated={authenticated}
      />
      <PrivateRoute
        path={URL.ORDERING_NEW_BULK_ORDER}
        component={getUserComponent(URL.ORDERING_NEW_BULK_ORDER)}
        authenticated={authenticated}
      />
      <PrivateRoute
        path={URL.ORDERING_REQUEST_QUOTE}
        component={getUserComponent(URL.ORDERING_REQUEST_QUOTE)}
        authenticated={authenticated}
      />
      <PrivateRoute
        path={URL.INVOICING}
        component={getUserComponent(URL.INVOICING)}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/reporting/transactions"
        component={Reporting.Transactions}
        authenticated={authenticated}
      />
      <PrivateRoute
        path={URL.REPORTING_TRANSACTIONS_HISTORY}
        component={TransactionHistory}
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
        path={URL.RESOURCES_CUSTOMER_SERVICE}
        component={getUserComponent(URL.RESOURCES_CUSTOMER_SERVICE)}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/resources/faq"
        component={Resources.FAQ}
        authenticated={authenticated}
      />
      <PrivateRoute
        exact
        path={URL.NEW_CUSTOMER_SETUP}
        component={getUserComponent(URL.NEW_CUSTOMER_SETUP)}
        authenticated={authenticated}
        userHelper={props.userHelper}
      />
      <PrivateRoute
        exact
        path={URL.COLLECTION_ORDERS}
        component={getUserComponent(URL.COLLECTION_ORDERS)}
        authenticated={authenticated}
      />
      <PrivateRoute
        path={URL.COLLECTION_ORDERS_NEW}
        component={getUserComponent(URL.COLLECTION_ORDERS_NEW)}
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
      <PrivateRoute
        path="/logs/bulk-order"
        component={BulkOrderLogs}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/logs/collection-orders"
        component={CollectionOrderLogs}
        authenticated={authenticated}
      />
      <PrivateRoute
        path={URL.ALL_USERS}
        component={Users}
        authenticated={authenticated}
        userHelper={props.userHelper}
      />
      <Route path="/request_account" component={RequestAccount} />
      <Route path="/logout" component={Logout} />
      <Route path="/switch-account" component={SwitchAccount} />

      <Route
        path="/login"
        render={() => {
          if (!authenticated) {
            return <NewLogin />;
          }

          return <Redirect to="/" />;
        }}
      />
    </React.Fragment>
  );
}
export default Routes;
