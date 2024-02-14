import React, { Component } from "react";
import "./styles.css";
import CreateOrRequestUserButton from "./CreateOrRequestUserButton";
import { connect } from "react-redux";
import { userActions, organizationActions } from "../../../actions";
import Select from "react-select";
import { icons } from "../../../images";
import Loader from "react-loader-spinner";
import {
  Filter,
  UserRolesOrganizations,
  EditUserOption,
  CreateUserPopup,
  RequestUserPopup,
  PageDisable,
  NotificationPopup,
} from "../../../components";
import FilterByText from "./../../../utils/Filter/FilterByText";
import _ from "lodash";
import Pagination from "react-js-pagination";
import Paginator from "./../../../utils/paginator/Paginator";
import { Roles, authorize } from "../../../utils/AuthService";
import { determineNavStyling } from "../../../components/Nav/determineNavStyling";
import * as userTypes from "../../../utils/UserTypes";
import AlphabeticalFilter from "./AlphabeticalFilter";
import DeleteUserOption from "../../../components/DeleteUserOption";

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
class Users extends Component {
  state = {
    filterLetter: "",
    filterStatus: { label: "Active", value: true },
    filterOptions: null,
    filteredUsers: [],
    filteredUsersByStatus: [],
    status: null,
    statusOptions: [
      { label: "All", value: -1 },
      { label: "Active", value: true },
      { label: "Inactive", value: false },
    ],
    perPage: 25,
    activePage: 1,
    showCreateUserPopup: false,
    showRequestUserPopup: false,
    allRoles: [],
    editUser: null,
    initialLoading: true,
    toastMessage: "",
    toastMessageType: "",
    displayToastMessage: false,
  };

  componentDidMount() {
    determineNavStyling(this.props.location.pathname);

    this.props.dispatch(userActions.fetchAllUsers(this.props.user.accessToken));
    this.props.dispatch(userActions.fetchAllRoles(this.props.user.accessToken));
    this.props.dispatch(
      organizationActions.fetchOrganizations(
        this.props.user.accessToken,
        this.props.user.UserType,
      ),
    );
  }

  fetchCopCustomerLocations = (customerId) => {
    this.props.dispatch(
      userActions.fetchAllLocations({
        accessToken: this.props.user.accessToken,
        customerType: "cop",
        customerId,
      }),
    );
  };

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.props.dispatch(
        userActions.fetchAllUsers(this.props.user.accessToken),
      );
      this.props.dispatch(
        userActions.fetchAllRoles(this.props.user.accessToken),
      );
      this.props.dispatch(
        organizationActions.fetchOrganizations(
          this.props.user.accessToken,
          this.props.user.UserType,
        ),
      );
    }

    if (this.props.roles !== prevProps.roles && !this.props.fetchingRoles) {
      var allRoles = [];

      if (this.props.user.UserType === userTypes.OUTBOUND) {
        if (this.props.roles) {
          this.props.roles.map((role) => {
            return allRoles.push({
              label: role.roleName.replace(/([a-z])([A-Z])/g, "$1 $2"),
              value: role.roleName,
            });
          });

          allRoles = _.uniqBy(allRoles, "value");
        }
      }

      if (this.props.user.UserType === userTypes.INBOUND) {
        const inboundUserRoles = [
          Roles.ADMINISTRATOR,
          Roles.STANDARD_USER,
          Roles.USER_ACCOUNT_MANAGER,
        ];

        if (this.props.roles) {
          this.props.roles.map((role) => {
            if (inboundUserRoles.includes(role.roleName)) {
              return allRoles.push({
                label: role.roleName.replace(/([a-z])([A-Z])/g, "$1 $2"),
                value: role.roleName,
              });
            }
            return [];
          });

          allRoles = _.uniqBy(allRoles, "value");
        }
      }

      allRoles =
        this.props.userType === userTypes.INBOUND
          ? allRoles.filter((x) => x.value !== "MultiOrganizationCustomerUser")
          : allRoles;
      this.setState({ allRoles: allRoles });
    }

    if (prevProps.submittingNewUser && this.props.errorSubmittedNewUser) {
      this.setState({
        toastMessage: this.props.errorSubmittedNewUser?.message,
        toastMessageType: "danger",
        displayToastMessage: true,
      });

      setTimeout(this.closeNotificationPopup, 9000);
    }

    if (prevProps.submittingDeleteUser && this.props.errorSubmittedDeleteUser) {
      this.setState({
        toastMessage: this.props.errorSubmittedDeleteUser?.message,
        toastMessageType: "danger",
        displayToastMessage: true,
      });

      setTimeout(this.closeNotificationPopup, 9000);
    }

    if (
      prevProps.submittingDeleteUser === true &&
      this.props.submittedDeleteUser === true
    ) {
      const toastMessage = "User Deleted Successfully";
      this.setState({
        toastMessage: toastMessage,
        toastMessageType: "success",
        displayToastMessage: true,
      });

      setTimeout(this.closeNotificationPopup, 9000);

      this.props.dispatch(
        userActions.fetchAllUsers(this.props.user.accessToken),
      );
    }

    if (
      prevProps.submittingNewUser === true &&
      this.props.submittedNewUser === true
    ) {
      this.setState({ showCreateUserPopup: false });

      const toastMessage = this.state.editUser
        ? "User Updated Successfully"
        : "User Created Successfully";
      this.setState({
        toastMessage: toastMessage,
        toastMessageType: "success",
        displayToastMessage: true,
      });

      setTimeout(this.closeNotificationPopup, 9000);

      this.props.dispatch(
        userActions.fetchAllUsers(this.props.user.accessToken),
      );
    }

    // request new user success tost
    if (
      prevProps.sendEmail.sending === true &&
      this.props.sendEmail.sent === true
    ) {
      this.setState({ showCreateUserPopup: false });

      const toastMessage = "New User Requested Successfully";
      this.setState({
        toastMessage: toastMessage,
        toastMessageType: "success",
        displayToastMessage: true,
      });
      this.onModalClose();
      setTimeout(this.closeNotificationPopup, 5000);
    }

    // request new user error tost
    if (
      prevProps.sendEmail.sending === true &&
      this.props.sendEmail.sent === false &&
      this.props.sendEmail.error
    ) {
      this.setState({ showCreateUserPopup: false });

      const toastMessage = "There was an error in completing your request";
      this.setState({
        toastMessage: toastMessage,
        toastMessageType: "danger",
        displayToastMessage: true,
      });
      setTimeout(this.closeNotificationPopup, 9000);
    }

    if (this.props.fetchingUsers === true && prevProps.fetchedUsers === true) {
      this.setState({
        filteredUsers: [],
        filteredUsersByStatus: [],
        status: null,
        initialLoading: true,
      });
    }
  }

  static activeUsers = (users) => {
    let activeUsers = FilterByText.filter(users)
      .where((user) => user.active === true)
      .get();

    return activeUsers;
  };

  static getDerivedStateFromProps(props, state) {
    if (state.status) {
      return {};
    }

    if (state.filterOptions && state.status === null) {
      return { filteredUsersByStatus: state.filteredUsers };
    }

    if (!_.isEmpty(state.filteredUsersByStatus) && state.initialLoading) {
      return {
        status: { label: "Active", value: true },
        initialLoading: false,
        filteredUsers: props.users,
        filteredUsersByStatus: Users.activeUsers(props.users),
      };
    }

    return {
      filteredUsers: props.users,
      filteredUsersByStatus: Users.activeUsers(props.users),
    };
  }

  componentWillUnmount() {
    this.props.dispatch(userActions.resetState());
  }

  setFilterOptions = (filterObject) => {
    this.setState({ filterOptions: filterObject, activePage: 1 });
  };

  closeNotificationPopup = () => {
    this.setState({ displayToastMessage: false });
  };

  openNav = () => {
    if (document.getElementById("rightFilterPanel"))
      document.getElementById("rightFilterPanel").style.width = "340px";
  };

  showModal = (user = null) => {
    this.setState({
      showCreateUserPopup: true,
      editUser: user,
    });
  };

  closeCreateUserPopup = () => {
    this.setState({ showCreateUserPopup: false });
  };

  onModalOpen = () => {
    this.setState({
      showRequestUserPopup: true,
    });
  };

  onModalClose = () => {
    this.setState({ showRequestUserPopup: false });
  };

  onStatusChange = (option) => {
    this.setState({ filterStatus: option, activePage: 1 });
  };

  setStatusOnFilter = () => {
    this.setState({
      initialLoading: true,
    });
  };

  pageSelect = (selectedPage) => {
    this.setState({
      activePage: selectedPage.value,
    });
  };

  pageClick = (pageNumber) => {
    this.setState({
      activePage: pageNumber,
    });
  };

  createNewUser = (e, userDetails) => {
    e.preventDefault();
    this.props.dispatch(
      userActions.submitNewUser(this.props.user.accessToken, userDetails),
    );
  };

  deleteUser = (user) => {
    this.props.dispatch(
      userActions.deleteUser(this.props.user.accessToken, user),
    );
  };

  newUserEmailFocusOut = (e) => {
    let splitedEmail = e.target.value.split("@");

    if (splitedEmail.length > 1) {
      if (
        authorize(this.props.user, Roles.ADMINISTRATOR) === false &&
        splitedEmail[splitedEmail.length - 1] !== "toscaltd.com"
      ) {
        this.setState({
          allRoles: this.state.allRoles.filter(
            (x) => x.value !== Roles.CUSTOMER_SERVICE,
          ),
        });
      } else {
        if (
          this.state.allRoles.findIndex(
            (x) => x.value === Roles.CUSTOMER_SERVICE,
          ) === -1
        ) {
          this.setState({
            allRoles: [
              ...this.state.allRoles,
              {
                value: "Customer Service",
                label: "Customer Service",
              },
            ],
          });
        }
      }
    }
  };

  handelFilterLetterChange = (letterKey) => {
    this.setState({ filterLetter: letterKey, activePage: 1 });
  };

  userFilters = (userList) => {
    let filteredUserList = userList;

    // users filter by alphabeticaly
    if (this.state.filterLetter === "" || this.state.filterLetter === "all") {
      filteredUserList = userList;
    } else {
      filteredUserList = filteredUserList.filter(
        (item) =>
          item.firstName.charAt(0).toUpperCase() === this.state.filterLetter,
      );
    }

    // users filter by status
    if (this.state.filterStatus && this.state.filterStatus.value !== -1) {
      let query = FilterByText.filter(filteredUserList);
      filteredUserList = query
        .where((user) => user.active === this.state.filterStatus.value)
        .get();
    }

    // users filter by side panel filter options
    if (this.state.filterOptions) {
      let query = FilterByText.filter(filteredUserList);
      if (this.state.filterOptions.name) {
        query.keyword(this.state.filterOptions.name, [
          "firstName",
          "lastName",
          "fullName",
        ]);
      }

      if (this.state.filterOptions.email) {
        query.where((user) => user.email === this.state.filterOptions.email);
      }

      if (!_.isEmpty(this.state.filterOptions.organization)) {
        query.where(
          (user) =>
            user.customerId === this.state.filterOptions.organization.value,
        );
      }

      if (!_.isEmpty(this.state.filterOptions.role)) {
        query.where((user) => {
          if (user.roles) {
            return user.roles.includes(this.state.filterOptions.role.value);
          }
          return false;
        });
      }
      filteredUserList = query.get();
    }

    //filtered user list sort
    filteredUserList = _.orderBy(
      filteredUserList,
      [
        (user) =>
          typeof user.fullName === "string"
            ? user.fullName.toLowerCase()
            : user.fullName.props.orgcontent.toLowerCase(),
      ],
      ["asc"],
    );

    return filteredUserList;
  };

  render() {
    // filter letters belongsto all users
    let letterArray = alphabet.map((letter) =>
      this.props.users.filter(
        (item) => item.firstName.charAt(0).toUpperCase() === letter,
      ).length !== 0
        ? letter
        : null,
    );
    letterArray = letterArray.filter((el) => el != null);

    const { fetchingUsers } = this.props;

    const { locations } = this.props.login;
    const users = this.userFilters(this.props.users);

    const { activePage, perPage } = this.state;

    const paginator = Paginator.paginate(users, activePage, perPage);
    const paginatedItems = paginator.getItems();

    let selectList = [];
    if (users.length !== 0) {
      for (let i = 1; i <= Math.ceil(users.length / perPage); i++)
        selectList.push({ value: i, label: i.toString() });
    }

    let organizationsOptionsList = this.props.organizations.map(
      (organization) => {
        return {
          organizationId: organization.organizationId,
          organizationName: organization.organizationName,
        };
      },
    );

    let organizationsOptions = [];

    if (this.props.users) {
      organizationsOptions = this.props.users.map((user) => {
        return {
          label: user.customerName,
          value: user.customerId,
        };
      });

      organizationsOptions = _.uniqBy(organizationsOptions, "value");
    }

    let rolesOptions = [];

    if (this.props.users) {
      this.props.users.map((user) => {
        if (user.roles) {
          user.roles.map((role) => {
            rolesOptions.push({
              label: role.replace(/([a-z])([A-Z])/g, "$1 $2"),
              value: role,
            });

            return true;
          });
        }
        return false;
      });

      rolesOptions = _.uniqBy(rolesOptions, "value");
    }

    return (
      <div id="user-management-page">
        <NotificationPopup
          message={this.state.toastMessage}
          visible={this.state.displayToastMessage}
          closeModal={this.closeNotificationPopup}
          type={this.state.toastMessageType}
        />
        <PageDisable
          disabled={this.props.submittingNewUser}
          message={
            this.state.editUser === null
              ? "Create user in progress"
              : "Update user in progress"
          }
        />

        <PageDisable
          disabled={this.props.submittingDeleteUser}
          message="Delete user in progress"
        />

        <PageDisable
          disabled={this.props.sendEmail.sending}
          message={"New User Request Email Sending"}
        />

        {this.state.showRequestUserPopup && (
          <RequestUserPopup
            createNewUser={this.createNewUser}
            visible={true}
            closeModal={this.onModalClose}
          />
        )}

        {this.state.showCreateUserPopup && (
          <CreateUserPopup
            rolesOptions={this.state.allRoles}
            fetchingRoles={this.props.fetchingRoles}
            locationOptions={locations}
            fetchingLocation={this.props.fetchingLocations}
            organizationsOptions={organizationsOptionsList}
            fetchingOrganizations={
              this.props.user.UserType === "COLLECTION"
                ? this.props.fetchingCollectionSites
                : this.props.fetchingOrganizations
            }
            createNewUser={this.createNewUser}
            deleteUser={this.deleteUser}
            EmailFocusOut={(e) => this.newUserEmailFocusOut(e)}
            visible={true}
            closeModal={this.closeCreateUserPopup}
            user={this.state.editUser}
            userDetails={this.props.user}
            fetchCopCustomerLocations={this.fetchCopCustomerLocations}
          />
        )}

        <Filter
          users={this.props.users}
          rolesOptions={rolesOptions}
          organizationsOptions={organizationsOptions}
          filterOptions={this.state.filterOptions}
          setFilterOptions={this.setFilterOptions}
          setStatusOnFilter={this.setStatusOnFilter}
        />
        <div className="flx-space-between">
          <div className="flx-float-left">
            <h3>User Management</h3>
            <CreateOrRequestUserButton
              showModal={this.showModal}
              showModalUsreRequest={this.onModalOpen}
              user={this.props.user}
            />
          </div>
          <div className="flx-float-right">
            <div className="status-filter" style={{ width: "120px" }}>
              <Select
                name="status"
                className="react-select"
                styles={customStyles}
                options={this.state.statusOptions}
                placeholder={"Status"}
                value={this.state.filterStatus}
                onChange={(option) => this.onStatusChange(option)}
              />
            </div>
            <img
              src={icons.filterIcon}
              alt="Filter"
              onClick={() => this.openNav()}
            />
          </div>
        </div>

        <div>
          <AlphabeticalFilter
            lettersList={letterArray}
            letterChange={(filterKey) =>
              this.handelFilterLetterChange(filterKey)
            }
          />
        </div>

        <div className="tw-bg-white tw-mb-4 table-wrapper">
          <div className="table-content-wrapper">
            <table className="tw-min-w-full user-table">
              <thead className="tw-pb-6">
                <tr className="">
                  <th
                    className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                    style={{
                      position: "relative",
                    }}
                  >
                    <div className="tw-w-3/4 tw-inline-block">Name</div>
                  </th>

                  <th
                    className="tw-px-3 tw-pt-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                    style={{
                      position: "relative",
                    }}
                  >
                    <div className="tw-w-3/4 tw-inline-block">Email</div>
                  </th>

                  <th
                    className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                    style={{
                      position: "relative",
                    }}
                  >
                    <div className="tw-w-3/4 tw-inline-block">Status</div>
                  </th>

                  <th
                    className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-center tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                    style={{
                      position: "relative",
                    }}
                  >
                    <div className="tw-w-3/4 tw-px-1 tw-inline-block">
                      Organization - Role
                    </div>
                  </th>

                  <th
                    className="tw-px-3 tw-pt-3 tw-pb-6 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-semibold tw-text-gray-900 tw-tracking-wider tw-cursor-pointer tw-underline col-sort-header"
                    style={{
                      position: "relative",
                    }}
                  >
                    <div className="tw-w-3/4 tw-inline-block"></div>
                  </th>
                </tr>
              </thead>

              <tbody className="tw-bg-white">
                {!fetchingUsers && _.isEmpty(users) && (
                  <tr>
                    <td colSpan="5">
                      <div className="loader-container  tw-flex tw-items-center tw-justify-center tw-py-10">
                        <h4>No users to display</h4>
                      </div>
                    </td>
                  </tr>
                )}
                {fetchingUsers && (
                  <tr>
                    <td colSpan="5">
                      <div className="loader-container  tw-flex tw-items-center tw-justify-center tw-py-10">
                        <Loader
                          type="Oval"
                          color="rgba(246,130,32,1)"
                          height="50"
                          width="50"
                        />
                      </div>
                    </td>
                  </tr>
                )}

                {!fetchingUsers &&
                  users &&
                  paginatedItems.map((user, index) => (
                    <React.Fragment key={index}>
                      <tr className="hover:tw-bg-tosca-alice-blue hover:tw-text-gray-900">
                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          <div className="name-component">
                            <div className="profile-pic-icon tw-min-w-[40px]">
                              <h5>
                                {_.isObject(user.firstName)
                                  ? user.firstName.props.orgcontent.charAt(0)
                                  : user.firstName.charAt(0)}
                              </h5>
                            </div>
                            {user.fullName}
                          </div>
                        </td>

                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {user.email}
                        </td>

                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          {user.active ? (
                            <div className="active-status-trait">Active</div>
                          ) : (
                            <div className="inactive-status-trait">
                              Inactive
                            </div>
                          )}
                        </td>

                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          <div className="details-icon">
                            <UserRolesOrganizations user={user} />
                          </div>
                        </td>

                        <td className="tw-px-3 tw-py-4 tw-border-b tw-font-light">
                          <div className="tw-flex tw-gap-4 tw-justify-end">
                            <EditUserOption
                              authorized={authorize(
                                this.props.user,
                                Roles.USER_ACCOUNT_MANAGER,
                              )}
                              showModal={this.showModal}
                              user={user}
                            />
                            <DeleteUserOption
                              authorized={authorize(
                                this.props.user,
                                Roles.USER_ACCOUNT_MANAGER,
                              )}
                              showModal={this.showModal}
                              user={user}
                              deleteUser={() => this.deleteUser(user)}
                            />
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>
          <div
            className="pagination-comp"
            style={{
              display: fetchingUsers || _.isEmpty(users) ? "none" : "",
            }}
          >
            <Pagination
              activePage={activePage}
              itemsCountPerPage={perPage}
              totalItemsCount={users.length}
              pageRangeDisplayed={1}
              onChange={this.pageClick}
              itemClass="page-item"
              linkClass="page-link"
            />
            <div className="active-page">
              <label>Active Page</label>
              <Select
                value={{ value: activePage, label: activePage.toString() }}
                options={selectList}
                className="react-select"
                onChange={this.pageSelect}
                backspaceRemovesValue={false}
                menuPlacement="top"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = ({ login, session, organizations, sendEmail }) => ({
  login: login,
  user: session.user,
  users: login.users,
  fetchingUsers: login.fetchingUsers,
  fetchedUsers: login.fetchedUsers,
  newUser: login.newUser,
  submittingNewUser: login.submittingNewUser,
  submittedNewUser: login.submittedNewUser,
  errorSubmittedNewUser: login.errorSubmittedNewUser,
  roles: login.roles,
  fetchingRoles: login.fetchingRoles,
  errorFetchingUsers: login.errorFetchingUsers,
  organizations: _.orderBy(
    organizations.organizations,
    "organizationName",
    "asc",
  ),
  fetchingOrganizations: organizations.fetching,
  errorFetchOrganizations: organizations.error,
  sendEmail: sendEmail,
  submittingDeleteUser: login.submittingDeleteUser,
  submittedDeleteUser: login.submittedDeleteUser,
  fetchingLocations: login.fetchingLocations,
});

export default connect(mapState)(Users);

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "hidden",
  }),
};
