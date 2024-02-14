import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export function logout() {
  return {
    type: "USER_LOGOUT",
  };
}

export function acknowledgeError() {
  return {
    type: "ACK_ERROR",
  };
}

export function fetchAllUsers(accessToken) {
  console.log("action fetching");
  return {
    type: "USER_FETCH_ALL",
    payload: axios.get(`${config.authenticationApiUrl}/v1/users`, {
      headers: requestHeaders(accessToken),
    }),
  };
}

export function fetchAllRoles(accessToken) {
  console.log("action fetching");
  return {
    type: "ROLES_FETCH_ALL",
    payload: axios.get(`${config.authenticationApiUrl}/v1/roles`, {
      headers: requestHeaders(accessToken),
    }),
  };
}

export function fetchAllLocations(queryParameters = {}) {
  const { accessToken, customerType, customerId = null } = queryParameters;
  return {
    type: "LOCATION_FETCH_ALL",
    payload: axios.get(`${config.customerProfileApiUrl}/v1/addresses`, {
      params: {
        type: "source",
        customerType,
        ...(customerId ? { customerId: customerId } : {}),
      },
      headers: requestHeaders(accessToken),
    }),
  };
}

export function fetchAllCollectionSites(accessToken) {
  console.log("action fetching");
  return {
    type: "COLLECTION_SITES_FETCH_ALL",
    payload: axios.get(`${config.authenticationApiUrl}/v1/collection-sites`, {
      headers: requestHeaders(accessToken),
    }),
  };
}

export const submitNewUser = (accessToken, userDetails) => {
  return {
    type: "SUBMIT_NEW_USER",
    payload: axios.post(
      `${config.authenticationApiUrl}/v1/users`,
      userDetails,
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};

export const deleteUser = (accessToken, user) => {
  return {
    type: "SUBMIT_DELETE_USER",
    payload: axios.delete(
      `${config.authenticationApiUrl}/v1/users/${user.oid}`,
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};

export const resetState = () => {
  return {
    type: "RESET_STATE",
  };
};
