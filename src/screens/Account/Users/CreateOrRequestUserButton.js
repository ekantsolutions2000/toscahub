import React from "react";
import { Roles, authorize } from "../../../utils/AuthService";

export default function CreateOrRequestUserButton(props) {
  return (
    <div id="createUserButtonWrapper">
      {authorize(props.user, Roles.USER_ACCOUNT_MANAGER) ? (
        <button
          type="button"
          id="createOrRequestBtn"
          onClick={() => props.showModal()}
        >
          + &nbsp; Create a new User
        </button>
      ) : (
        <>
          <button
            type="button"
            id="createOrRequestBtn"
            onClick={() => props.showModalUsreRequest()}
          >
            + &nbsp; Request a new user
          </button>
        </>
      )}
    </div>
  );
}
