import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchOrderInventory = (accessToken, queryParameters) => {
  return {
    type: "FETCH_ORDER_INVENTORY",
    payload: axios.get(`${config.inventoryApiUrl}/v1/order-inventories`, {
      headers: requestHeaders(accessToken),
      params: { ...queryParameters },
    }),
  };
};
