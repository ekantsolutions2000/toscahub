import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchCarrierList = (accessToken) => {
  return {
    type: "FETCH_CARRIER_LIST",
    payload: axios.get(`${config.orderApiUrl}/v1/carriers`, {
      headers: requestHeaders(accessToken),
    }),
  };
};

export const resetState = () => {
  return {
    type: "RESET_STATE",
  };
};
