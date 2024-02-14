import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";

export const sendFeedback = (
  accessToken,
  topic,
  subject,
  description,
  user,
) => {
  return {
    type: "SUBMIT_FEEDBACK",
    payload: axios.post(
      `${config.communicationApiUrl}/v1/feedbacks`,
      {
        topic,
        subject,
        description,
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
