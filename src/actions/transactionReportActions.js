import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchTransactionReportList = (customerId, filter, accessToken) => {
  return {
    type: "FETCH_TRANSACTION_REPORT_LIST",
    payload: axios.get(`${config.inventoryApiUrl}/v1/transaction-reports`, {
      headers: requestHeaders(accessToken),
      params: {
        customerId: customerId,
        filter,
      },
    }),
  };
};
