import axios from "axios";
import { config } from "../utils/conf";
import { requestHeaders } from "../utils/http";
// import { sessionService } from "redux-react-session";
import { sessionService } from "./../auth-service/index";
import { getUser } from "../utils/JwtService";

export const updatePassword = (accessToken, user) => {
  return {
    type: "PASSWORD_UPDATE",
    payload: axios.post(
      `${config.authenticationApiUrl}/v1/users/password-update`,
      user,
      {
        headers: requestHeaders(accessToken),
      },
    ),
  };
};

export const login = (user) => {
  return {
    type: "LOGIN",
    payload: axios
      .post(
        `${config.authenticationApiUrl}/v1/login`,
        {
          userName: user.userName,
          password: user.password,
        },
        {
          headers: requestHeaders(),
        },
      )
      .then(async (response) => {
        await saveSession(response);
        return response;
      })
      .catch((err) => {
        sessionService.saveUser({ error: err });
        throw err;
      }),
  };
};

export const authorization = (token) => {
  return {
    type: "AUTHORIZATION",
    payload: axios
      .post(
        `${config.authenticationApiUrl}/v1/authorize`,
        {},
        {
          headers: requestHeaders(token),
        },
      )
      .then(async (response) => {
        await saveSession(response);
        return response;
      })
      .catch((err) => {
        sessionService.saveUser({ error: err });
        throw err;
      }),
  };
};

async function saveSession(response) {
  const user = getUser(response.data.accessToken);
  await sessionService.saveSession(response.data.accessToken);
  await sessionService.saveUser({
    ...user,
    initialUser: {
      ...user,
      accessToken: response.data.accessToken,
    },
    accessToken: response.data.accessToken,
  });
  return true;
}
