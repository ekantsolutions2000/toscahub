import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchSourceAddressList = (accessToken) => {
  return {
    type: "FETCH_SOURCE_ADDRESS_LIST",
    payload: axios.get(
      `${config.customerProfileApiUrl}/v1/addresses?type=source`,
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};

export const fetchContactList = (accessToken) => {
  return {
    type: "FETCH_CONTACT_LIST",
    payload: axios.get(
      `${config.customerProfileApiUrl}/v1/customer-solutions-representatives`,
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};
