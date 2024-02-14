import React, { Component } from "react";
import { connect } from "react-redux";
import userHelper from "./userHelper";

const withUser = (WrappedComponent) => {
  class WithUser extends Component {
    render() {
      return (
        <WrappedComponent
          {...this.props}
          userHelper={new userHelper(this.props.user)}
        />
      );
    }
  }

  const mapState = ({ session }) => ({
    user: session.user,
    session: session,
  });
  return connect(mapState)(WithUser);
};

export default withUser;
