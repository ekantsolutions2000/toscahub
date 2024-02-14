import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { authorize } from "../../utils/AuthService";

const AuthorizeComponent = (props) => {
  if (!props.roles || props.roles.length === 0) {
    return React.createElement(props.component, props.componentProps);
  }

  if (!props.user.isLoggedIn()) return null;

  if (authorize(props.user, ...props.roles)) {
    return React.createElement(props.component, props.componentProps);
  } else {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-64 tw-text-2xl tw-font-light">
        Unauthorized.
      </div>
    );
  }
};

export default class PrivateRoute extends Component {
  render() {
    return (
      <Route
        exact={this.props.exact}
        path={this.props.path}
        render={(props) =>
          this.props.authenticated ? (
            <AuthorizeComponent
              component={this.props.component}
              componentProps={props}
              roles={this.props.authorizeRoles}
              user={this.props.userHelper}
            />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );
  }
}

const { object, bool, string, func } = PropTypes;

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([func.isRequired, object.isRequired]),
  exact: bool,
  path: string.isRequired,
  authenticated: bool.isRequired,
  location: object,
};
