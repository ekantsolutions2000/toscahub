import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const fetchNewCustomerData = (token, newCustomerKey) => {
  return {
    type: "FETCH_NEW_CUSTOMER_DATA",
    payload: axios.get(
      `${config.customerProfileApiUrl}/v1/caches/${newCustomerKey}`,
      {
        headers: requestHeaders(token),
      },
    ),
  };
};

export const submitNewCustomerData = (token, newCustomerData) => {
  return {
    type: "SUBMIT_NEW_CUSTOMER_DATA",
    payload: axios.post(
      `${config.communicationApiUrl}/v1/customer-inquiries`,
      {
        ...newCustomerData,
      },
      {
        headers: requestHeaders(token),
      },
    ),
  };
};

export const getSaveLaterNewCustomerData = (token, newCustomerKey) => {
  return {
    type: "GET_SAVE_LATER_NEW_CUSTOMER_DATA",
    payload: axios.get(
      `${config.customerProfileApiUrl}/v1/caches/${newCustomerKey}`,
      {
        headers: requestHeaders(token),
      },
    ),
  };
};

export const saveLaterNewCustomerData = (
  token,
  newCustomerKey,
  newCustomerData,
) => {
  const formatter = new Intl.DateTimeFormat("en-us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "UTC",
    timeZoneName: "short",
  });
  const expireDate = new Date();
  expireDate.setDate(new Date().getDate() + 30);
  const parts = formatter.formatToParts(expireDate);

  let year = parts.find((x) => x.type === "year").value;
  let month = parts.find((x) => x.type === "month").value;
  let day = parts.find((x) => x.type === "day").value;
  let hour = parts.find((x) => x.type === "hour").value;
  let minute = parts.find((x) => x.type === "minute").value;
  let dayPeriod = parts.find((x) => x.type === "dayPeriod").value;
  let timezone = parts.find((x) => x.type === "timeZoneName").value;

  let dateFormatted = `${year}-${month}-${day} ${hour}:${minute} ${dayPeriod} ${timezone}`;

  return {
    type: "SAVE_LATER_NEW_CUSTOMER_DATA",
    payload: axios.post(
      `${config.customerProfileApiUrl}/v1/caches`,
      {
        expiry: dateFormatted,
        dataKey: newCustomerKey,
        dataValue: JSON.stringify(newCustomerData),
      },
      {
        headers: requestHeaders(token),
      },
    ),
  };
};

export const updayeLaterNewCustomerData = (
  token,
  newCustomerKey,
  newCustomerData,
) => {
  const formatter = new Intl.DateTimeFormat("en-us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "UTC",
    timeZoneName: "short",
  });
  const expireDate = new Date();
  expireDate.setDate(new Date().getDate() + 30);
  const parts = formatter.formatToParts(expireDate);

  let year = parts.find((x) => x.type === "year").value;
  let month = parts.find((x) => x.type === "month").value;
  let day = parts.find((x) => x.type === "day").value;
  let hour = parts.find((x) => x.type === "hour").value;
  let minute = parts.find((x) => x.type === "minute").value;
  let dayPeriod = parts.find((x) => x.type === "dayPeriod").value;
  let timezone = parts.find((x) => x.type === "timeZoneName").value;

  let dateFormatted = `${year}-${month}-${day} ${hour}:${minute} ${dayPeriod} ${timezone}`;

  return {
    type: "UPDATE_SAVE_LATER_NEW_CUSTOMER_DATA",
    payload: axios.put(
      `${config.customerProfileApiUrl}/v1/caches/${newCustomerKey}`,

      {
        expiry: dateFormatted,
        dataKey: newCustomerKey,
        dataValue: JSON.stringify(newCustomerData),
      },
      {
        headers: requestHeaders(token),
      },
    ),
  };
};

export const deleteSavedForLaterNewCustomerData = (token, newCustomerKey) => {
  return {
    type: "DELETE_SAVED_CUSTOMER_DATA",
    payload: axios.delete(
      `${config.customerProfileApiUrl}/v1/caches/${newCustomerKey}`,
      {
        headers: requestHeaders(token),
      },
    ),
  };
};

export const getCountries = (token) => {
  return {
    type: "GET_CUSTOMER_PROFILE_COUNTRIES",
    payload: axios.get(`${config.customerProfileApiUrl}/v1/countries`, {
      headers: requestHeaders(token),
    }),
  };
};
