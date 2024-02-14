import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const sendEmail = (accessToken, user_object, email_object) => {
  return {
    type: "SEND_EMAIL",
    payload: axios.post(
      `${config.apiUrl}/email`,
      {
        user: user_object,
        email: email_object,
      },
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};

export const sendNonAuth = (user_id) => {
  return {
    type: "SEND_NONAUTH_EMAIL",
    payload: axios.get(`${config.apiUrl}/email?user_id=${user_id}`, {
      headers: requestHeaders(),
    }),
  };
};

export const reset = () => {
  return {
    type: "RESET_EMAIL",
  };
};
