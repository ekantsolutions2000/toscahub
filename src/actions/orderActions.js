import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";
import { getUser } from "../utils/JwtService";

export const fetchOrders = (accessToken) => {
  let user = getUser(accessToken);
  return {
    type: "FETCH_ORDERS",
    payload: axios.get(
      `${config.orderApiUrl}/v1/orders?organizationId=${user.OrgId}&customerId=${user.CustomerInfo.CustID}&limit=500`,
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};

export const submitNewOrder = (
  accessToken,
  orderHeader,
  orderDetails,
  metaData,
) => {
  return {
    type: "SUBMIT_ORDER",
    payload: axios.post(
      `${config.orderApiUrl}/v1/orders`,
      {
        orderHeader,
        orderDetails,
        metaData,
      },
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};

export const cancelOrder = () => {
  return {
    type: "CANCEL_ORDER",
  };
};

export const resetState = () => {
  return {
    type: "RESET_STATE",
  };
};

export const validateOrder = (accessToken, orderDetails) => {
  return {
    type: "VALIDATE_ORDER",
    payload: axios.post(
      `${config.orderApiUrl}/v1/orders/validations`,
      {
        orderDetails,
      },
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};
