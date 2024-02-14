import React, { Component } from "react";
import { connect } from "react-redux";
import { customerListActions, sessionActions } from "./../../../actions";
import _ from "lodash";
import { PropTypes } from "prop-types";
import { RightPanel } from "../../../components";
import "./style.css";
import Select from "react-select";
import useGetCustomer from "../../../hooks/CustomerProfile/useGetCustomer";
import useSession from "../../../hooks/Auth/useSession";
import Button from "../../Button/Button";

function CustomerName() {
  const { customerId } = useSession();

  const { data: customer, isLoading } = useGetCustomer(customerId);
  const customerName = customer?.customerName;

  return <div>{isLoading ? "Loading..." : customerName}</div>;
}
class SwitchAccount extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  state = {
    showModal: false,
    dropDownPlaceholder: "Select a user",
    selectedCustomer: null,
    showRightPanel: false,
  };

  onModalOpen = () => {};

  showModal = (e) => {
    if (e) e.preventDefault();
    // this.setState({ showModal: true });
    if (this.props.changeOrgPending || this.props.fetching) return;

    const { accessToken, dispatch, user } = this.props;

    if (this.props.customers && this.props.customers.length) {
      return;
    }
    dispatch(customerListActions.fetchCustomers(accessToken, user.UserType));
  };

  onModalClose = () => {
    this.props.dispatch(sessionActions.resetChangeOrgState());
    this.props.dispatch(customerListActions.resetState());

    this.setState({ showModal: false });
  };

  componentWillUnmount() {
    this.props.dispatch(sessionActions.resetChangeOrgState());
    this.props.dispatch(customerListActions.resetState());
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.changeOrgPending &&
      this.props.changeOrgCompleted &&
      this.props.user.CustomerInfo
    ) {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };
  onSwitchUserClick = () => {
    const customerId = this.state.selectedCustomer.id;

    let history = this.context.router.history;
    history.push({
      pathname: "/switch-account",
      state: { ...history.location.state, customerId },
    });
  };

  openNav = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.showModal();
    this.setState((previousState) => ({
      showRightPanel: !previousState.showRightPanel,
    }));
  };

  closeFilterPanel = () => {
    this.setState({ showRightPanel: false, selectedCustomer: null });
  };

  render() {
    let customers = [...this.props.customers];

    return (
      <React.Fragment>
        {
          <>
            <a href="/" role="button" onClick={this.openNav}>
              Switch Account
            </a>

            <RightPanel
              display={this.state.showRightPanel}
              close={() => {
                this.setState({ showRightPanel: false });
              }}
            >
              <div className="tw-p-8 tw-pt-12 tw-font-inter ">
                <div className="tw-font-semibold tw-text-dark tw-text-base tw-mb-10">
                  Switch Account
                </div>

                <p className="tw-text-xs tw-font-semibold tw-mb-0">
                  Your current account
                </p>
                <div className="tw-text-tosca-orange tw-text-2xl">
                  <CustomerName />
                </div>

                <p className="tw-text-xs tw-font-semibold tw-mt-8">
                  Switch Account To
                </p>
                <Select
                  id="filterCustomer"
                  name="customer"
                  className="react-select tw-font-museo"
                  backspaceRemovesValue={true}
                  options={customers}
                  value={this.state.selectedCustomer}
                  isLoading={this.props.changeOrgPending || this.props.fetching}
                  isDisabled={
                    this.props.changeOrgPending || this.props.fetching
                  }
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: "4px",
                    colors: {
                      ...theme.colors,
                      primary25: "#E0E0E0",
                      primary: "#E0E0E0",
                    },
                  })}
                  onChange={(option) => {
                    this.setState({
                      selectedCustomer: option,
                    });
                  }}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  onFocus={() => {
                    this.setState({
                      dropDownPlaceholder: "All",
                    });
                  }}
                  onBlur={() => {
                    this.setState({
                      dropDownPlaceholder: "Select a user",
                    });
                  }}
                  labelWrapperClass="tw-mb-2"
                  inputWrapperClass=""
                  placeholder={this.state.dropDownPlaceholder}
                />
                <div className="tw-text-sm tw-mt-2 tw-text-red-500 tw-font-semibold">
                  {this.props.fetchError && !this.props.fetching ? (
                    <p>Could not fetch customers</p>
                  ) : (
                    ""
                  )}
                  {this.props.changeOrgError ? (
                    <p>
                      {_.get(
                        this.props.changeOrgError,
                        "response.data.message",
                        "Network error.",
                      )}
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                {this.props.changeOrgCompleted &&
                this.props.user.CustomerInfo ? (
                  <div className="tw-text-green-500 tw-mt-2">
                    <p className="tw-text-green-500 tw-font-semibold tw-text-sm">
                      Success.
                    </p>
                  </div>
                ) : null}

                <div className="tw-mt-8 tw-grid tw-grid-cols-2 tw-gap-4">
                  <Button
                    brand="primary"
                    size="md"
                    disabled={
                      !this.state.selectedCustomer ||
                      this.props.changeOrgPending
                    }
                    onClick={this.onSwitchUserClick}
                  >
                    Switch User
                  </Button>
                  <Button
                    size="md"
                    brand="secondary"
                    onClick={this.closeFilterPanel}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </RightPanel>
          </>
        }
      </React.Fragment>
    );
  }
}

const mapState = ({ session, customers, login }) => ({
  user: session.user,
  accessToken: session.user.accessToken,
  customers: _.orderBy(customers.customers, "name", "asc"),
  fetching: customers.fetching,
  fetchError: customers.error,
  changeOrgPending: login.changeOrgFetching,
  changeOrgCompleted: login.changeOrgFetched,
  changeOrgError: login.changeOrgError,
});

export default connect(mapState)(SwitchAccount);
