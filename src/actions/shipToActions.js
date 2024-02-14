import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchShipTo = (accessToken, withPending = false) => {
  return {
    type: "FETCH_ADDYS",
    payload: axios.get(
      `${config.customerProfileApiUrl}/v1/addresses?type=destination${
        withPending ? "&includePending=true" : ""
      }`,
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};

export const submitNewShipTo = (shipto, accessToken) => {
  return {
    type: "SUBMIT_SHIPTO",
    payload: axios.post(`${config.apiUrl}/shiptos`, shipto, {
      headers: requestHeaders(accessToken),
    }),
  };
};

export const deleteAllNewShipTos = (orgId, accessToken) => {
  return {
    type: "DELETE_NEWSHIPTO_CACHE",
    payload: axios.delete(`${config.apiUrl}/shiptos`, {
      headers: requestHeaders(accessToken),
      data: {
        orgId: orgId,
      },
    }),
  };
};
