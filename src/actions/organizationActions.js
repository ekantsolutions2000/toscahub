import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchOrganizations = (accessToken, type = undefined) => {
  return {
    type: "FETCH_ORGANIZATIONS",
    payload: axios.get(`${config.customerProfileApiUrl}/v1/customers`, {
      params: {
        type,
      },
      headers: requestHeaders(accessToken),
    }),
  };
};

export const resetState = () => {
  return {
    type: "RESET_STATE",
  };
};
