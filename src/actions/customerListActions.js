import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchCustomers = (accessToken, type = undefined) => {
  return {
    type: "FETCH_CUSTOMERS",
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
