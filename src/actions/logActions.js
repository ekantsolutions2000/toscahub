import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchOrders = (accessToken, customerId) => {
  return {
    type: "FETCH_ORDER_LOG",
    payload: axios.get(`${config.logsApiUrl}/v1/aggregate`, {
      headers: requestHeaders(accessToken),
      params: {
        customerId: customerId, //'C1100179',
        timespan: 1440, // 720, 12000
        queryType: "APIM",
      },
    }),
  };
};

export const resetState = () => {
  return {
    type: "RESET_STATE",
  };
};
