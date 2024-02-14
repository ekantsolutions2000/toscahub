import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchCustomerInfo = (accessToken, customerId) => {
  return {
    type: "FETCH_CUSTOMER",
    payload: axios.get(
      `${config.customerProfileApiUrl}/v1/customers/${customerId}`,
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
