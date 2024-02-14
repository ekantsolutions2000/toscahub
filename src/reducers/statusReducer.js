import { config } from "../utils/conf";
import _ from "lodash";
import * as Response from "../utils/HttpResponse";

const tokenErrors = {
  TokenExpiredError: "Session has expired. Please sign-in again.",
  JsonWebTokenError: "Could not verify your identity. Please sign-in again.",
  NotBeforeError: "Could not verify your identity. Please sign-in again.",
};

export default function reducer(
  state = {
    userName: "",
    accessToken: null,
    isLoggedIn: false,
    fetching: false,
    fetched: false,
    error: null,
    tokenError: null,
  },
  action,
) {
  if (action.payload && action.payload.response) {
    if (action.payload.response.status >= Response.HTTP_INTERNAL_SERVER_ERROR) {
      if (
        !(action.payload.response.data instanceof String) &&
        "" !== action.payload.response.data
      ) {
        if (typeof action.payload.response.data === "object") {
          action.payload.response.data.message = config.serverErrorMessage;
        }
      }
      return {
        ...state,
        fetching: false,
        fetched: false,
        isLoggedIn: false,
        error: config.serverErrorMessage,
      };
    }

    const name = _.get(action.payload.response, "data.name", "");
    const status = _.get(action.payload.response, "data.statusCode", 0);

    if (status === Response.HTTP_FORBIDDEN && name in tokenErrors) {
      return {
        ...state,
        tokenError: tokenErrors[name],
      };
    }
  }

  switch (action.type) {
    case "VALIDATE_SESSION": {
      return {
        ...state,
        tokenError: !action.payload.success
          ? tokenErrors[action.payload.name]
          : null,
      };
    }
    default: {
      return { ...state };
    }
  }
}
