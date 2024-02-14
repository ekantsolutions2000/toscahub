import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { ToolTip } from "../../components";
import Tooltip from "../../components/Tooltip";
import "./style.css";
import ActiveStatus from "./activeStatus";
import _ from "lodash";
import { Roles, authorize } from "../../utils/AuthService";
import * as UserTypes from "../../utils/UserTypes";

const CreateUserPopup = (props) => {
  const { fetchCopCustomerLocations } = props;

  const isInbound = props.userDetails.UserType === UserTypes.INBOUND;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [activeStatus, setActiveStatus] = useState(false);
  const [defaultRoles, setDefaultRoles] = useState([]);
  const [defaultOrganization, setDefaultOrganization] = useState(null);
  const [additionalRoles, setAdditionalRoles] = useState([]);
  const [additionalOrganization, setAdditionalOrganization] = useState(null);
  const [additionalOrgRoles, setAdditionalOrgRoles] = useState([]);
  const [organizationsList, setOrganizationsList] = useState([]);
  const [additionalOrganizationsList, setAdditionalOrganizationsList] =
    useState([]);

  const [onSubmiting, setOnSubmiting] = useState(false);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [defaultLocationErrorMessage, setDefaultLocationErrorMessage] =
    useState("");
  const [defaultRoleErrorMessage, setDefaultRoleErrorMessage] = useState("");
  const [userLocationErrorMessage, setUserLocationErrorMessage] = useState("");
  const [
    mustSelectAdditionalOrganizationError,
    setMustSelectAdditionalOrganizationError,
  ] = useState("");
  const [userRoleValidation, setUserRoleValidation] = useState(true);
  useEffect(() => {
    let organizations = [...props.organizationsOptions];
    _.remove(organizations, {
      organizationId: defaultOrganization?.organizationId,
    });
    additionalOrgRoles?.forEach((org) => {
      _.remove(organizations, { organizationId: org.customer.customerId });
    });
    setOrganizationsList(organizations);
    setAdditionalOrganizationsList(organizations);
  }, [defaultOrganization, additionalOrgRoles]); // eslint-disable-line

  const locationOptions = props.locationOptions?.map((item) => ({
    value: item.addressId,
    label: item.addressName,
  }));

  const selectedLocations = locationOptions?.filter((x) =>
    props.user.locations.includes(x.value),
  );

  const [_userLocation, setUserLocation] = useState(null);

  const userLocation = _userLocation ?? selectedLocations;

  useEffect(() => {
    if (defaultOrganization && isInbound) {
      setUserLocation(null);
      fetchCopCustomerLocations(defaultOrganization.organizationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOrganization]);

  useEffect(() => {
    if (props.user !== null) {
      setFirstName(props.user.firstName);
      setLastName(props.user.lastName);
      setEmail(props.user.email);
      setActiveStatus(props.user.active);
      setDefaultRoles(
        props.user.roles.map((role) => {
          return {
            label: role.replace(/([a-z])([A-Z])/g, "$1 $2"),
            value: role,
          };
        }),
      );
      setDefaultOrganization({
        organizationId: props.user.customerId,
        organizationName: props.user.customerName,
      });
      if (props.user.organizations)
        setAdditionalOrgRoles(props.user.organizations);
    } else {
      clear();
    }
  }, [props.user]);

  useEffect(() => {
    if (props.user?.organizations) {
      setAdditionalOrgRoles(props.user.organizations);
    }
  }, [props.user?.organizations, defaultRoles]);

  const onFirstNameChange = (e) => {
    clearErrors("cu-first-name");
    setFirstName(e.target.value);
  };

  const onLastNameChange = (e) => {
    clearErrors("cu-last-name");
    setLastName(e.target.value);
  };

  const onEmailChange = (e) => {
    clearErrors("cu-email");
    setEmail(e.target.value);
  };

  const onDefaultRoleChange = (option) => {
    clearErrors("selectDefaultRole");
    setDefaultRoles(option);
  };

  const onUserLocationChange = (option) => {
    clearErrors("selectUserLocation");
    setUserLocation(option);
  };

  useEffect(() => {
    const hasMultiOrgRole = defaultRoles.some(
      (x) => x.value === "MultiOrganizationCustomerUser",
    );
    if (!hasMultiOrgRole) {
      setAdditionalOrgRoles([]);
    }
  }, [defaultRoles]);

  useEffect(() => {
    setUserRoleValidation(true);
    const hasMultiOrgRole = defaultRoles.some(
      (x) => x.value === "MultiOrganizationCustomerUser",
    );

    if (hasMultiOrgRole && additionalOrgRoles.length) {
      setMustSelectAdditionalOrganizationError("");
    }
  }, [additionalOrgRoles, defaultRoles]);

  const onDefaultOrganizationChange = (option) => {
    clearErrors("selectDefaultOrganization");
    setDefaultOrganization(option);

    let orgs = [...props.organizationsOptions];
    _.remove(orgs, { organizationId: option.organizationId });

    additionalOrgRoles.map((additionalOrgRole) => {
      return _.remove(orgs, {
        organizationId: additionalOrgRole.customer.customerId,
      });
    });

    setOrganizationsList(orgs);
  };

  const onAdditionalRoles = (option) => {
    setAdditionalRoles(option);
  };

  const onAdditionalOrganization = (option) => {
    setAdditionalOrganization(option);
  };

  const addOrganization = (e) => {
    e.preventDefault();

    const roles = additionalRoles.map((role) => {
      return role.value;
    });

    const organizationRoles = {
      customer: {
        customerId: additionalOrganization.organizationId,
        customerName: additionalOrganization.organizationName,
      },
      roles: roles,
    };

    let organizationRolesList = additionalOrgRoles;
    organizationRolesList.push(organizationRoles);

    let orgs = [...organizationsList];
    _.remove(orgs, { organizationId: additionalOrganization.organizationId });
    setOrganizationsList(orgs);

    setAdditionalOrgRoles([...organizationRolesList]);
    setAdditionalRoles([]);
    setAdditionalOrganization(null);
  };

  const removeOrganization = (customerId) => {
    const updatedOrgRoles = _.remove(additionalOrgRoles, (element) => {
      return element.customer.customerId !== customerId;
    });

    setAdditionalOrgRoles(updatedOrgRoles);

    let orgs = [...props.organizationsOptions];
    _.remove(orgs, { organizationId: defaultOrganization.organizationId });
    updatedOrgRoles.map((additionalOrgRole) => {
      return _.remove(orgs, {
        organizationId: additionalOrgRole.customer.customerId,
      });
    });

    setOrganizationsList(orgs);
  };

  const isFormValidate = () => {
    let validate = true;

    if (!firstName) {
      setFirstNameErrorMessage("Please enter the first name");
      validate = false;
    }

    if (!lastName) {
      setLastNameErrorMessage("Please enter the last name");
      validate = false;
    }

    const emailPattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,10}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
    );
    if (!email || !emailPattern.test(email)) {
      setEmailErrorMessage("Please enter the valid e-mail");
      validate = false;
    }

    if (!defaultOrganization) {
      setDefaultLocationErrorMessage("Please select default organization");
      validate = false;
    }

    if (!defaultRoles.length) {
      setDefaultRoleErrorMessage("Please select default role");
      validate = false;
    }

    const hasMultiOrgRole = defaultRoles.some(
      (x) => x.value === "MultiOrganizationCustomerUser",
    );
    if (hasMultiOrgRole && additionalOrgRoles.length === 0) {
      setMustSelectAdditionalOrganizationError(
        "Please add at lease one additional organization.",
      );
      validate = false;
    }

    return validate;
  };

  const roleStateValidation = () => {
    let roleState = false;

    let splitedEmail = email.split("@");

    let organizationsRoleStatus = false;
    if (additionalOrgRoles.length > 0) {
      for (let i = 0; i < additionalOrgRoles.length; i++) {
        organizationsRoleStatus = additionalOrgRoles[i].roles.includes(
          Roles.CUSTOMER_SERVICE,
        );

        if (
          additionalOrgRoles[i].roles.includes(Roles.CUSTOMER_SERVICE) === true
        ) {
          break;
        }
      }
    }

    if (
      authorize(props.userDetails, Roles.ADMINISTRATOR) === false &&
      splitedEmail[splitedEmail.length - 1] !== "toscaltd.com"
    ) {
      if (
        defaultRoles.findIndex((x) => x.value === Roles.CUSTOMER_SERVICE) ===
          -1 &&
        organizationsRoleStatus === false
      ) {
        roleState = true;
        setUserRoleValidation(true);
      } else {
        roleState = false;
        setUserRoleValidation(false);
      }
    } else {
      setUserRoleValidation(true);
      roleState = true;
    }
    return roleState;
  };

  const createNewUser = (e) => {
    e.preventDefault();
    setOnSubmiting(true);
    let newUser;

    if (isFormValidate() && roleStateValidation()) {
      if (props.user === null) {
        newUser = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          customerId: defaultOrganization?.organizationId,
          customerName: defaultOrganization?.organizationName,
          roles: defaultRoles.map((role) => {
            return role.value;
          }),
          userType: props.userDetails.UserType,
          toscaUser:
            email.substring(email.lastIndexOf("@") + 1) === "toscaltd.com",
          active: activeStatus,
          organizations: additionalOrgRoles,
        };
      } else {
        newUser = {
          id: props.user.id,
          oid: props.user.oid,
          firstName: _.isObject(firstName)
            ? firstName.props.orgcontent
            : firstName,
          lastName: _.isObject(lastName) ? lastName.props.orgcontent : lastName,
          email: email,
          customerId: defaultOrganization.organizationId,
          customerName: defaultOrganization?.organizationName,
          roles: defaultRoles.map((role) => {
            return role.value;
          }),
          userType: props.userDetails.UserType,
          toscaUser:
            email.substring(email.lastIndexOf("@") + 1) === "toscaltd.com",
          active: activeStatus,
          organizations: additionalOrgRoles,
        };
      }

      if (isInbound) {
        newUser.locations = userLocation.map((item) => {
          return item.value;
        });
      }

      props.createNewUser(e, newUser);
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    setOrganizationsList(props.organizationsOptions);
  }, [props.organizationsOptions]);

  const handleKeyUp = (e) => {
    const keys = {
      27: () => {
        e.preventDefault();
        props.closeModal();
      },
    };

    if (keys[e.keyCode]) {
      keys[e.keyCode]();
    }
  };

  const modal = useRef();

  const closePopup = () => {
    clearErrors("all");
    clear();
    props.closeModal();
  };

  const clear = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setActiveStatus(false);
    setDefaultRoles([]);
    setDefaultOrganization(null);
    setAdditionalRoles([]);
    setAdditionalOrganization(null);
    setAdditionalOrgRoles([]);
  };

  const clearErrors = (formField) => {
    setFirstNameErrorMessage(
      formField === "cu-first-name" ? "" : firstNameErrorMessage,
    );
    setLastNameErrorMessage(
      formField === "cu-last-name" ? "" : lastNameErrorMessage,
    );
    setEmailErrorMessage(formField === "cu-email" ? "" : emailErrorMessage);
    setDefaultLocationErrorMessage(
      formField === "selectDefaultOrganization"
        ? ""
        : defaultLocationErrorMessage,
    );
    setDefaultRoleErrorMessage(
      formField === "selectDefaultRole" ? "" : defaultRoleErrorMessage,
    );
    setUserLocationErrorMessage(
      formField === "selectUserLocation" ? "" : userLocationErrorMessage,
    );

    if (formField === "all") {
      setOnSubmiting(false);
      setFirstNameErrorMessage("");
      setLastNameErrorMessage("");
      setDefaultLocationErrorMessage("");
      setDefaultRoleErrorMessage("");
      setUserLocationErrorMessage("");
    }
  };

  useEffect(() => {
    return () => {
      clearErrors("all");
    };
  }, []); // eslint-disable-line

  return (
    <div
      className="info-overlay"
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        display: props.visible ? "" : "none",
      }}
    >
      <div id="create-user" ref={modal}>
        <div id="create-user-top">
          <div id="create-user-header">
            <h2>{props.user === null ? "Create a New User" : "Update User"}</h2>
            <div
              id="cu-close-button"
              style={{ position: "absolute !important" }}
            >
              <span
                className="glyphicon glyphicon-remove"
                onClick={closePopup}
              />
            </div>
          </div>
        </div>
        <div className="create-user-bottom">
          <form onSubmit={createNewUser}>
            <div className="create-user-bottom-container">
              <div className="cu-input-horizontal2">
                <div className="form-group input-text cu-width-half cu-input-width-right">
                  <label htmlFor="first-name">FIRST NAME</label>
                  <Tooltip
                    content={firstNameErrorMessage}
                    show={onSubmiting === true && firstNameErrorMessage}
                    config={{
                      zIndex: 100,
                      theme: "error",
                      trigger: "manual",
                      hideOnClick: false,
                      placement: "top-end",
                    }}
                  >
                    <input
                      id="cu-first-name"
                      className="css-bg1rzq-control"
                      name="first-name"
                      type="text"
                      style={
                        onSubmiting === true && firstNameErrorMessage
                          ? { border: "1px solid red" }
                          : null
                      }
                      value={
                        _.isObject(firstName)
                          ? firstName.props.orgcontent
                          : firstName
                      }
                      onChange={(e) => onFirstNameChange(e)}
                    />
                  </Tooltip>
                </div>
                <div className="form-group cu-width-half cu-input-width-left">
                  <div id="cu-active-status">
                    <ActiveStatus
                      activeStatus={activeStatus}
                      setActiveStatus={setActiveStatus}
                      wrapperClassName="active-status-wrapper"
                    />
                  </div>
                </div>
              </div>
              <div className="cu-input-horizontal">
                <div className="form-group input-text cu-width-half cu-input-width-right">
                  <label htmlFor="last-name">LAST NAME</label>
                  <Tooltip
                    content={lastNameErrorMessage}
                    show={onSubmiting === true && lastNameErrorMessage}
                    config={{
                      zIndex: 100,
                      theme: "error",
                      trigger: "manual",
                      hideOnClick: false,
                      placement: "top-end",
                    }}
                  >
                    <input
                      id="cu-last-name"
                      className="css-bg1rzq-control"
                      style={
                        onSubmiting === true && lastNameErrorMessage
                          ? { border: "1px solid red" }
                          : null
                      }
                      name="last-name"
                      type="text"
                      value={
                        _.isObject(lastName)
                          ? lastName.props.orgcontent
                          : lastName
                      }
                      onChange={(e) => onLastNameChange(e)}
                    />
                  </Tooltip>
                </div>
                <div className="form-group input-text cu-width-half cu-input-width-left">
                  <label htmlFor="email">EMAIL ADDRESS</label>
                  <Tooltip
                    content={emailErrorMessage}
                    show={onSubmiting === true && emailErrorMessage}
                    config={{
                      zIndex: 100,
                      theme: "error",
                      trigger: "manual",
                      hideOnClick: false,
                      placement: "top-end",
                    }}
                  >
                    <input
                      id="cu-email"
                      className="css-bg1rzq-control"
                      style={
                        onSubmiting === true && emailErrorMessage
                          ? { border: "1px solid red" }
                          : null
                      }
                      name="email"
                      type="text"
                      value={email}
                      onChange={(e) => onEmailChange(e)}
                      onBlur={(e) => props.EmailFocusOut(e)}
                    />
                  </Tooltip>
                </div>
              </div>
              <div className="cu-input-horizontal">
                <div className="form-group cu-input-width-right">
                  <label htmlFor="default-organization">
                    DEFAULT ORGANIZATION
                  </label>
                  <Tooltip
                    content={defaultLocationErrorMessage}
                    show={onSubmiting === true && defaultLocationErrorMessage}
                    config={{
                      zIndex: 100,
                      theme: "error",
                      trigger: "manual",
                      hideOnClick: false,
                      placement: "top-end",
                    }}
                  >
                    <div>
                      <Select
                        required
                        id="selectDefaultOrganization"
                        name="default-organization"
                        className="react-select"
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            border:
                              onSubmiting === true &&
                              defaultLocationErrorMessage
                                ? "1px solid red"
                                : "1px solid rgba(126, 212,247,1)",
                          }),
                        }}
                        disabled={props.fetchingOrganizations}
                        options={organizationsList}
                        value={defaultOrganization}
                        getOptionLabel={(option) => option.organizationName}
                        getOptionValue={(option) => option.organizationId}
                        onChange={(option) =>
                          onDefaultOrganizationChange(option)
                        }
                        menuPortalTarget={document.target}
                        menuPlacement="auto"
                        menuPosition="absolute"
                        classNamePrefix="tosca"
                      />
                    </div>
                  </Tooltip>
                </div>
                <div className="form-group cu-input-width-left">
                  <label htmlFor="default-role">DEFAULT ROLE</label>
                  <Tooltip
                    content={defaultRoleErrorMessage}
                    show={onSubmiting === true && defaultRoleErrorMessage}
                    config={{
                      zIndex: 100,
                      theme: "error",
                      trigger: "manual",
                      hideOnClick: false,
                      placement: "top-end",
                    }}
                  >
                    <div>
                      <Select
                        id="selectDefaultRole"
                        name="default-role"
                        className="react-select"
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            border:
                              onSubmiting === true && defaultRoleErrorMessage
                                ? "1px solid red"
                                : "1px solid rgba(126, 212,247,1)",
                          }),
                        }}
                        disabled={props.fetchingRoles}
                        isMulti
                        isClearable={false}
                        closeMenuOnSelect={false}
                        options={props.rolesOptions}
                        value={defaultRoles}
                        onChange={(option) => onDefaultRoleChange(option)}
                        menuPortalTarget={document.target}
                        menuPlacement="auto"
                        menuPosition="absolute"
                        classNamePrefix="tosca"
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>

              {isInbound && (
                <div className="cu-input-horizontal">
                  <div className="form-group cu-input-width-right">
                    <label htmlFor="default-role">LOCATION</label>
                    <Tooltip
                      content={userLocationErrorMessage}
                      show={onSubmiting === true && userLocationErrorMessage}
                      config={{
                        zIndex: 100,
                        theme: "error",
                        trigger: "manual",
                        hideOnClick: false,
                        placement: "top-end",
                      }}
                    >
                      <div>
                        <Select
                          id="selectUserLocation"
                          name="user-location"
                          className="react-select"
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              border:
                                onSubmiting === true && userLocationErrorMessage
                                  ? "1px solid red"
                                  : "1px solid rgba(126, 212,247,1)",
                            }),
                          }}
                          disabled={props.fetchingLocation}
                          isMulti
                          isLoading={props.fetchingLocation}
                          isClearable={false}
                          closeMenuOnSelect={false}
                          options={locationOptions}
                          value={userLocation}
                          onChange={(option) => onUserLocationChange(option)}
                          menuPortalTarget={document.target}
                          menuPlacement="auto"
                          menuPosition="absolute"
                          classNamePrefix="tosca"
                        />
                      </div>
                    </Tooltip>
                  </div>

                  <div className="form-group cu-input-width-left"></div>
                </div>
              )}
            </div>

            {_.findIndex(
              defaultRoles,
              (role) => role.value === "MultiOrganizationCustomerUser",
            ) !== -1 && (
              <div id="additionalOrgRoles">
                <h5>ADDITIONAL ORGANIZATIONS AND ROLES</h5>
                <p className="tw-text-red-500">
                  {mustSelectAdditionalOrganizationError}
                </p>
                {_.isEmpty(additionalOrgRoles) ? (
                  ""
                ) : (
                  <div id="organization-roles-list">
                    <div>
                      <table>
                        <tbody>
                          {additionalOrgRoles.map((organization, index) => {
                            return (
                              <tr key={index}>
                                <td className="cu-col-org">
                                  {organization.customer.customerName}
                                </td>
                                {organization.roles.length > 1 ? (
                                  <ToolTip
                                    content={
                                      <p className="sm:tw-m-2 sm:tw-py-2 tw-text-gray-600 tw-font-light tw-text-sm">
                                        {organization.roles.map(
                                          (role, index) => {
                                            return (
                                              <tr key={index}>
                                                <td>
                                                  {role.replace(
                                                    /([a-z])([A-Z])/g,
                                                    "$1 $2",
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          },
                                        )}
                                      </p>
                                    }
                                    config={{
                                      arrow: false,
                                      theme: "light",
                                      placement: "top",
                                    }}
                                  >
                                    <td className="cu-col-role">
                                      Multiple roles selected
                                    </td>
                                  </ToolTip>
                                ) : (
                                  <td className="cu-col-role">
                                    {organization.roles[0].replace(
                                      /([a-z])([A-Z])/g,
                                      "$1 $2",
                                    )}
                                  </td>
                                )}
                                <td className="cu-col-btn">
                                  <span
                                    onClick={() =>
                                      removeOrganization(
                                        organization.customer.customerId,
                                      )
                                    }
                                  >
                                    X
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <hr className="divider" />
                <div className="cu-input-horizontal">
                  <div className="form-group cu-input-width-right">
                    <label htmlFor="additional-organization">
                      ORGANIZATION
                    </label>
                    <Select
                      id="selectAdditionalOrganization"
                      name="additional-organization"
                      className="react-select"
                      disabled={props.fetchingOrganizations}
                      options={additionalOrganizationsList}
                      value={additionalOrganization}
                      getOptionLabel={(option) => option?.organizationName}
                      getOptionValue={(option) => option?.organizationId}
                      onChange={(option) => onAdditionalOrganization(option)}
                    />
                  </div>
                  <div className="form-group cu-input-width-left">
                    <label htmlFor="additional-role">ROLE</label>
                    <Select
                      id="selectAdditionalRole"
                      name="additional-role"
                      className="react-select"
                      disabled={props.fetchingRoles}
                      isMulti
                      isClearable={false}
                      closeMenuOnSelect={false}
                      options={props.rolesOptions}
                      value={additionalRoles}
                      onChange={(option) => onAdditionalRoles(option)}
                    />
                  </div>
                  <div
                    id="cu-add-additional-org"
                    className="tw-ml-1 sm:tw-ml-3"
                  >
                    <span
                      onClick={addOrganization}
                      className="tw-text-2xl tw-text-[#EC710A] tw-mt-7 xs:tw-mt-0"
                    >
                      +
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!userRoleValidation && (
              <div className="validation-message-wrapper">
                <p className="validation-message">
                  * Please remove the "Customer Service" role from the default
                  role or additional organization role.
                </p>
              </div>
            )}
            <div className="cu-footer">
              <button
                type="button"
                style={{ ...button, backgroundColor: "#AFAFAF" }}
                onClick={() => closePopup()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button"
                style={{
                  ...button,
                  backgroundColor: "#FF8B2B",
                }}
              >
                {props.user === null ? "Create" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPopup;

const button = {
  width: 110,
  height: 38,
  borderRadius: 4,
  border: "none",
  fontSize: 14,
  fontWeight: 300,
  color: "white",
};
