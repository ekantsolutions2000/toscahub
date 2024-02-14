import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import Select from "react-select";
import _ from "lodash";

const Filter = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState(null);
  const [role, setRole] = useState(null);

  const onNameChange = (e) => {
    setName(e.target.value);
  };
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const onOrganizationChange = (option) => {
    setOrganization(option);
  };
  const onRoleChange = (option) => {
    setRole(option);
  };

  const closeFilterPanel = () => {
    setName("");
    setEmail("");
    setOrganization(null);
    setRole(null);

    if (document.getElementById("rightFilterPanel"))
      document.getElementById("rightFilterPanel").style.width = "0";
  };

  const clearFilterPanel = () => {
    setName("");
    setEmail("");
    setOrganization(null);
    setRole(null);

    props.setFilterOptions(null);
    props.setStatusOnFilter();

    if (document.getElementById("rightFilterPanel"))
      document.getElementById("rightFilterPanel").style.width = "0";
  };

  const hideFilterPanel = () => {
    if (document.getElementById("rightFilterPanel"))
      document.getElementById("rightFilterPanel").style.width = "0";
  };

  const setFilter = (e) => {
    e.preventDefault();
    const { setFilterOptions } = props;
    let filterObject = {
      name: name || "",
      email: email || "",
      role: role || null,
      organization: organization || null,
    };

    setFilterOptions(filterObject);
  };

  const useOutsideClick = (modal) => {
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (modal.current && !modal.current.contains(e.target)) {
          hideFilterPanel();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [modal]);
  };
  const modal = useRef();
  useOutsideClick(modal);

  return (
    <div id="rightFilterPanel" ref={modal}>
      <div id="filterContainer">
        <h2>Filter Panel</h2>
        <form onSubmit={setFilter}>
          <div className="form-group input-text" style={{ width: "100%" }}>
            <label htmlFor="name">Name</label>
            <input
              id="filterUserName"
              className="css-bg1rzq-control"
              name="name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e)}
            />
          </div>

          <div className="form-group input-text" style={{ width: "100%" }}>
            <label htmlFor="name">Email</label>
            <input
              id="filterEmail"
              className="css-bg1rzq-control"
              name="email"
              type="text"
              value={email}
              onChange={(e) => onEmailChange(e)}
            />
          </div>

          <div className="form-group" style={{ width: "100%" }}>
            <label htmlFor="organization">Organization</label>
            <Select
              id="filterOrganization"
              name="organization"
              className="react-select"
              options={props.organizationsOptions}
              value={organization}
              onChange={(option) => onOrganizationChange(option)}
            />
          </div>

          <div className="form-group" style={{ width: "100%" }}>
            <label htmlFor="role">Role</label>
            <Select
              id="filterRole"
              name="role"
              className="react-select"
              options={props.rolesOptions}
              value={role}
              onChange={(option) => onRoleChange(option)}
            />
          </div>

          <div className="filter-bottom">
            <button
              type="submit"
              style={{ ...button, backgroundColor: "#FF8B2B" }}>
              Search
            </button>
            {props.filterOptions && !_.isEmpty(props.filterOptions) ? (
              <button
                type="button"
                style={{ ...button, backgroundColor: "#AFAFAF" }}
                onClick={() => clearFilterPanel()}>
                Clear
              </button>
            ) : (
              <button
                type="button"
                style={{ ...button, backgroundColor: "#AFAFAF" }}
                onClick={() => closeFilterPanel()}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Filter;

const button = {
  width: 110,
  height: 38,
  borderRadius: 4,
  border: "none",
  fontSize: 14,
  fontWeight: 300,
  color: "white",
};
