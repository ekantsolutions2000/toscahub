import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchTransactionSummary = (accessToken) => {
  return {
    type: "FETCH_TRANSACTION_SUMMARY",
    payload: axios.get(`${config.orderApiUrl}/v1/transaction-summary`, {
      headers: requestHeaders(accessToken),
    }),
  };
};

export const resetState = () => {
  return {
    type: "RESET_STATE",
  };
};
