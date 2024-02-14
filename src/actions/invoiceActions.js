import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchInvoices = (accessToken) => {
  return {
    type: "FETCH_INVOICES",
    payload: axios.get(`${config.orderApiUrl}/v1/invoices`, {
      headers: requestHeaders(accessToken),
    }),
  };
};

export const fetchATC = (custKey) => {
  const axiosConfig = {
    url: "https://AppService.AnytimeCollect.com/APIService.svc/GetCustomerSignOnLinkForStatement",
    method: "POST",
    headers: {
      Authorization: config.anytimeCollectAuthorization,
    },
    data: {
      CompanyID: "TOS",
      CustID: custKey,
      UseSiteOptionsDefault: true,
      DaysToExpire: null,
      AllowedClicks: null,
    },
  };

  return {
    type: "FETCH_ATC",
    payload: axios(axiosConfig),
  };
};

export const removeATC = () => {
  return {
    type: "REMOVE_ATC_LINK",
  };
};
