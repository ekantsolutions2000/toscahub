import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { sessionActions, userActions } from "../../../actions";
import { useMsal } from "@azure/msal-react";

export default function Logout(props) {
  const { instance } = useMsal();

  const handleLogout = (logoutType) => {
    if (logoutType === "popup") {
      instance.logoutPopup({
        postLogoutRedirectUri: "/login",
        mainWindowRedirectUri: "/login",
      });
    } else if (logoutType === "redirect") {
      instance.logoutRedirect({
        postLogoutRedirectUri: "/login",
      });
    }
  };
  handleLogout("redirect");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(sessionActions.destroy());
    dispatch(userActions.logout());
  }, [dispatch]);

  return <Redirect to="/login" />;
}
