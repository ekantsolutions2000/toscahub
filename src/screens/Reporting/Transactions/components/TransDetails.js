import React, { Component } from "react";
import PropTypes from "prop-types";
//import moment from 'moment'
import { transActions } from "../../../../actions";
import { connect } from "react-redux";

class TransDetail extends Component {
  handleDeleteClick = (transactionId) => {
    const { orgId, dispatch } = this.props;
    dispatch(
      transActions.deletePendingTrans(
        orgId,
        transactionId,
        this.props.accessToken,
      ),
    );
  };

  render() {
    const { data } = this.props;
    return data ? (
      <div className="trans-detail-hover">
        <span
          className="glyphicon glyphicon-remove-circle"
          onClick={() => this.handleDeleteClick(data._id)}
        />
      </div>
    ) : (
      <div style={{ display: "none" }} />
    );
  }
}

const { object } = PropTypes;

TransDetail.propTypes = {
  data: object.isRequired,
};

const mapState = ({ session }) => ({
  orgId: session.user.OrgId,
  accessToken: session.user.accessToken,
});

export default connect(mapState)(TransDetail);
