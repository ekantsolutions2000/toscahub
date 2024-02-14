import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchBulkOrders = (accessToken, customerId) => {
  return {
    type: "FETCH_BULK_ORDER_LOG",
    payload: axios.get(`${config.orderApiUrl}v1/orders/uploads`, {
      headers: requestHeaders(accessToken),
      params: {
        customerId: customerId,
        timespan: 1440,
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
