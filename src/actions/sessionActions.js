// import { sessionService } from "redux-react-session";
import { sessionService } from "./../auth-service/index";
import axios from "axios";
import { config } from "../utils/conf";
import { validateTokenAsync } from "../utils/JwtService";
import { requestHeaders } from "../utils/http";
import { getUser } from "../utils/JwtService";

export const resetChangeOrgState = () => {
  return {
    type: "RESET_CHANGE_ORG_STATE",
  };
};

async function _saveSessionOnChange(accessToken, response, user) {
  let effectiveUser = getUser(response.data.accessToken);
  await sessionService.saveSession(accessToken);
  await sessionService.saveUser({
    ...effectiveUser,
    initialUser: user,
    accessToken: response.data.accessToken,
  });
  return true;
}

async function _saveSessionOnRemove(accessToken, user) {
  await sessionService.saveSession(accessToken);
  await sessionService.saveUser({
    ...user,
    initialUser: { ...user },
  });
  return true;
}

export const changeOrg = (customerId, accessToken, user) => {
  let url = `${config.authenticationApiUrl}/v1/organization-switch`;

  return {
    type: "CHANGE_ORGANIZATION",
    payload: axios
      .post(
        url,
        { customerId },
        {
          headers: requestHeaders(accessToken),
        },
      )
      .then(async (response) => {
        const { accessToken } = response.data;
        await _saveSessionOnChange(accessToken, response, user);
        return response;
      })
      .catch((err) => {
        throw err;
      }),
  };
};

export const removeOrg = (accessToken, user) => {
  console.log(user);
  return {
    type: "REMOVE_ORGANIZATION",
    payload: async () => {
      await _saveSessionOnRemove(accessToken, user);
    },
  };
};

export const destroy = () => {
  return {
    type: "LOGOUT",
    payload: sessionService.deleteSession().then(() => {
      sessionService.deleteUser();
    }),
  };
};

export const refresh = () => {
  return {
    type: "REFRESH",
    payload: sessionService.refreshFromLocalStorage(),
  };
};

export const validate = (user) => {
  return {
    type: "VALIDATE_SESSION",
    payload: validateTokenAsync(user.accessToken),
  };
};
