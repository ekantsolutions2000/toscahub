import React, { Component } from "react";
import { connect } from "react-redux";
import { sessionActions, userActions } from "../../actions";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import _ from "lodash";
// import { sessionService } from "redux-react-session";
import { sessionService } from "./../../auth-service";
import { validateToken } from "./../../utils/JwtService";
import { Link } from "react-router-dom";
import ConfirmationModal from "../Modal/ConfirmationModal";
import Button from "../Button/Button";
class ValidateSession extends Component {
  constructor(props) {
    super(props);
    props.history.listen(_.debounce(this.onRouteChange, 300));
  }

  state = {
    firstLoad: true,
    prompt: false,
  };

  static getDerivedStateFromProps(props, state) {
    return { prompt: state.firstLoad ? false : true };
  }

  firstCheck = () => {
    const accessToken = _.get(this.props, "user.accessToken", undefined);
    if (accessToken) {
      validateToken(accessToken, (err) => {
        if (err) {
          this.props.dispatch(sessionActions.destroy());
          this.props.dispatch(userActions.logout());
        }
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (!prevProps.user.accessToken && this.props.user.accessToken) {
      this.firstCheck();
    }
  };

  onRouteChange = (location, action) => {
    sessionService
      .loadUser()
      .then((user) => {
        const dontCheck = ["/login", "/logout"];

        if (
          user &&
          user.accessToken &&
          !dontCheck.includes(location.pathname)
        ) {
          if (this.state.firstLoad) {
            this.setState({ firstLoad: false });
          }

          this.props.dispatch(sessionActions.validate(user));
        }
      })
      .catch((err) => false);
  };

  closeModal = () => {
    this.setState({ showWarning: false });
    this.props.dispatch(sessionActions.destroy());
    this.props.dispatch(userActions.logout());
  };

  render() {
    const prompt =
      (this.props.tokenError !== null ? true : false) && this.state.prompt;
    return prompt ? (
      <ConfirmationModal
        title="Caution!"
        brand="danger"
        show={true}
        onClose={this.closeModal}
      >
        <p> {this.props.tokenError} </p>
        <p>
          Click <b className="tw-text-gray-700">OK</b> to return to the login
          page.
        </p>
        <div className="tw-flex tw-gap-2 tw-mt-6">
          <Link to="/logout" className="tw-w-full">
            <Button brand="danger" type="button" fullwidth="true">
              OK
            </Button>
          </Link>
        </div>
      </ConfirmationModal>
    ) : null;
  }
}

const mapState = ({ statusReducer, session }) => ({
  tokenError: statusReducer.tokenError,
  user: session.user,
});

ValidateSession.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapState)(withRouter(ValidateSession));
