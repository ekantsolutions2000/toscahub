import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchTransactions = (customerId, filter, accessToken) => {
  return {
    type: "FETCH_TRANS",
    payload: axios.get(`${config.inventoryApiUrl}/v1/transactions`, {
      headers: requestHeaders(accessToken),
      params: {
        submitted: false,
      },
    }),
  };
};

export const saveNewTrans = (orgId, transaction, accessToken) => {
  return {
    type: "SUBMIT_TRANS",
    payload: axios.post(
      `${config.inventoryApiUrl}/v1/transactions`,
      transaction,
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};

export const deleteAllPending = (orgId, accessToken) => {
  return {
    type: "DELETE_TRANS_CACHE",
    payload: axios.delete(`${config.inventoryApiUrl}/v1/transactions`, {
      headers: requestHeaders(accessToken),
    }),
  };
};

export const deletePendingTrans = (orgId, transId, accessToken) => {
  return {
    type: "DELETE_PENDING_TRANS",
    payload: axios
      .delete(`${config.inventoryApiUrl}/v1/transactions/${transId}`, {
        headers: requestHeaders(accessToken),
      })
      .then(() => transId),
  };
};

export const commitPendingTrans = (accessToken) => {
  return {
    type: "COMMIT_TRANS",
    payload: axios.post(
      `${config.inventoryApiUrl}/v1/transaction/commit-pending`,
      {},
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};

export const updatePendingTrans = (
  orgId,
  transId,
  transaction,
  accessToken,
) => {
  return {
    type: "UPDATE_PENDING_TRANS",
    payload: axios.put(
      `${config.inventoryApiUrl}/v1/transactions/${transaction.id}`,
      transaction,
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};
