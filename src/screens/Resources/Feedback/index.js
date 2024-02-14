import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import Select, { components } from "react-select";
import "./style.css";
import { pagination_icons } from "../../../images";
import { determineNavStyling } from "../../../components/Nav/determineNavStyling";
import { feedbackActions } from "../../../actions";
import _ from "lodash";
import { Prompt } from "react-router";
import { customerActions } from "../../../actions";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";
import Button from "../../../components/Button/Button";

class Feedback extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  getInitialState = () => {
    return {
      topic: [],
      subject: "",
      description: "",
      showSuccessModal: false,
      isUpdated: false,
    };
  };

  constructor(props, context) {
    super(props, context);
    this.state = this.getInitialState();
  }

  isEqualWithout = (obj1, obj2, excludeAttr = []) => {
    let first = _.cloneDeep(obj1);
    let second = _.cloneDeep(obj2);

    excludeAttr.forEach((attr) => {
      delete first[attr];
      delete second[attr];
    });

    return _.isEqual(first, second);
  };

  componentDidMount() {
    determineNavStyling(this.props.location.pathname);

    this.props.dispatch(
      customerActions.fetchCustomerInfo(
        this.props.accessToken,
        this.props.user.CustomerInfo.CustID,
      ),
    );
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      !this.isEqualWithout(prevState, this.state, [
        "isUpdated",
        "showSuccessModal",
      ])
    ) {
      if (
        this.isEqualWithout(this.state, this.getInitialState(), [
          "isUpdated",
          "showSuccessModal",
        ])
      ) {
        this.setState({ isUpdated: false });
      } else {
        this.setState({ isUpdated: true });
      }
    }

    if (prevProps.submitting && this.props.submitted) {
      this.setState({ showSuccessModal: true });
      this.resetEmail();
    }
  };

  closeModal = () => {
    this.setState({ showSuccessModal: false });
  };

  submitFeedback = (e) => {
    e.preventDefault();

    const { topic, subject, description } = this.state;
    const { accessToken, dispatch } = this.props;
    let user = this.props.user;
    user.CustomerInfo = this.props.customerInfo;
    user.CustomerInfo.CustName = this.props.customerInfo.customerName;

    dispatch(
      feedbackActions.sendFeedback(
        accessToken,
        topic.value,
        subject,
        description,
        this.props.user,
      ),
    );
  };

  resetEmail = () => {
    this.setState({
      topic: [],
      subject: "",
      description: "",
    });
  };

  render() {
    const topicList = [
      {
        label: "Customer Experience",
        value: "Customer Experience",
      },
      {
        label: "Billing",
        value: "Billing",
      },
      {
        label: "Container Returns",
        value: "Container Returns",
      },
      {
        label: "Sales",
        value: "Sales",
      },
      {
        label: "Customer Portal",
        value: "Customer Portal",
      },
      {
        label: "Other",
        value: "Other",
      },
    ];
    const { topic, subject, description } = this.state;

    return (
      <div id="feedback-page">
        <Prompt when={this.state.isUpdated} message="" />

        <ConfirmationModal
          title="Thank you for your feedback."
          brand="default"
          show={this.state.showSuccessModal}
          onClose={() => this.setState({ showSuccessModal: false })}
        >
          <p>Your feedback will help us to better serve our customers.</p>

          <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
            <Button
              brand="secondary"
              type="button"
              fullwidth="true"
              onClick={this.closeModal}
            >
              Provide More Feedback
            </Button>
            <Button
              brand="primary"
              type="button"
              fullwidth="true"
              onClick={() => {
                this.closeModal();
                this.context.router.history.push("/");
              }}
            >
              Return to Dashboard
            </Button>
          </div>
        </ConfirmationModal>

        <div className="fb-header">
          <div className="fb-title">
            <h3>Feedback</h3>
            <p>
              If you have any thoughts or suggestions on how your experience can
              improve, please let us know by completing the fields below.
            </p>
          </div>
        </div>

        <div className="fb-content">
          <form onSubmit={this.submitFeedback}>
            {this.props.feedbackError ? (
              <p className="tw-text-red-600">
                {this.props.feedbackError.message}
              </p>
            ) : null}

            <div className="content">
              <div className="left">
                <div className="form-group>" style={{ marginBottom: "20px" }}>
                  <label htmlFor="topic">topic</label>
                  <Select
                    id="topic"
                    options={topicList}
                    value={topic}
                    className="react-select"
                    components={{ DropdownIndicator }}
                    onChange={(option) => this.setState({ topic: option })}
                    isDisabled={false}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="form-control"
                    value={subject}
                    onChange={(e) => {
                      this.setState({ subject: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
              <div className="right">
                <div className="form-group">
                  <label htmlFor="description">description</label>
                  <textarea
                    required
                    type="text"
                    id="description"
                    className="form-control"
                    value={description}
                    onChange={(e) => {
                      this.setState({ description: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="footer">
              <div className="submit">
                <input className="submit-btn" type="submit" value="Submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const { object, bool, string } = PropTypes;

Feedback.propTypes = {
  user: object.isRequired,
  authenticated: bool.isRequired,
  checked: bool.isRequired,
  accessToken: string,
};

const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <img
          src={pagination_icons.DownArrow}
          alt="left arrow"
          width={20}
          height={20}
        />
      </components.DropdownIndicator>
    )
  );
};

const mapState = ({ session, feedback, customer }) => ({
  user: session.user,
  authenticated: session.authenticated,
  checked: session.checked,
  accessToken: session.user.accessToken,
  submitting: feedback.submitting,
  submitted: feedback.submitted,
  feedbackError: feedback.error,
  customerInfo: customer.customerInfo,
});

export default connect(mapState)(Feedback);
