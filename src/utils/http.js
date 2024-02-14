import { config } from "./conf";

export const requestHeaders = (accessToken) => {
  let headers = {
    "Ocp-Apim-Subscription-Key": config.enterpriseApiKey,
    "Ocp-Apim-Trace": config.enterpriseApiTrace,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};
