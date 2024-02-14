import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const requestContainerReturn = (accessToken, user, returnRequest) => {
  return {
    type: "SUBMIT_RETURN_REQUEST",
    payload: axios.post(
      `${config.apiUrl}/return-requests`,
      {
        user,
        returnRequest,
      },
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};

export const reset = () => {
  return {
    type: "RESET_STATE",
  };
};
