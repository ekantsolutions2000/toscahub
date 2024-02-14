import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";
import { Layout, Announcement, NotificationPopup } from "./components";
import AppUpdate from "./components/AppUpdate";
import LeavingPageWarningModal from "./components/Modals/LeavingPageWarning";
import { config } from "./utils/conf";
import withUser from "./components/HOC/withUser";
import Routes from "./components/Nav/Routes";
import { CookiesProvider } from "react-cookie";
import { connect } from "react-redux";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { EventType, InteractionType } from "@azure/msal-browser";
import { b2cPolicies } from "./authConfig";
import useSession from "./hooks/Auth/useSession";
import { useSelector } from "react-redux";
import ValidateSessionNew from "./components/Session/ValidateSessionNew";

function usePreviousValue(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const AnnouncementWrapper = function () {
  const session = useSession();
  const login = useSelector((state) => state.login);
  const prevValue = usePreviousValue(login.authorizing);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (prevValue && !login.authorizing) {
      setShow(true);
    }
  }, [login.authorizing]); // eslint-disable-line

  return (
    session.userType &&
    session.userType !== "na" &&
    show && <Announcement user={session}></Announcement>
  );
};

const Pages = () => {
  const { instance } = useMsal();

  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotificationPopup, setSowNotificationPopup] = useState(false);

  const closeNotificationPopup = () => {
    setSowNotificationPopup(false);
  };

  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_FAILURE) {
        if (
          event.error &&
          event.error.errorMessage.indexOf("AADB2C90118") > -1
        ) {
          if (event.interactionType === InteractionType.Redirect) {
            instance.loginRedirect(b2cPolicies.authorities.forgotPassword);
          } else if (event.interactionType === InteractionType.Popup) {
            instance
              .loginPopup(b2cPolicies.authorities.forgotPassword)
              .catch((e) => {
                return;
              });
          }
        }
      }

      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
      ) {
        if (event?.payload) {
          if (
            event.payload.idTokenClaims["tfp"] ===
            b2cPolicies.names.forgotPassword
          ) {
            setSowNotificationPopup(true);
            setNotificationMessage(
              "Password has been reset successfully. Please sign-in with your new password.",
            );
          } else if (
            event.payload.idTokenClaims["tfp"] === b2cPolicies.names.editProfile
          ) {
            window.alert(
              "Profile has been edited successfully. \nPlease sign-in again.",
            );
            return instance.logout();
          }
        }
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, []); // eslint-disable-line

  return (
    <NotificationPopup
      message={notificationMessage}
      visible={showNotificationPopup}
      closeModal={closeNotificationPopup}
      type={"success"}
    />
  );
};

const App = (props) => {
  const { msalInstance, authenticated, checked } = props;
  return (
    <CookiesProvider>
      <BrowserRouter
        getUserConfirmation={(message, callback) =>
          LeavingPageWarningModal(message, callback)
        }
      >
        <MsalProvider instance={msalInstance}>
          {checked && (
            <Layout>
              {config.promptLiveUpdate ? <AppUpdate /> : null}
              <AnnouncementWrapper />
              {/* <Announcement /> */}
              <ValidateSessionNew />
              <Routes
                authenticated={authenticated}
                userHelper={props.userHelper}
                user={props.user}
              />
              <Pages />
            </Layout>
          )}
        </MsalProvider>
      </BrowserRouter>
    </CookiesProvider>
  );
};

const { bool } = PropTypes;

App.propTypes = {
  authenticated: bool.isRequired,
  checked: bool.isRequired,
};

const mapState = ({ session }) => ({
  checked: session.checked,
  authenticated: session.authenticated,
  user: session.user,
  session,
});

export default connect(mapState)(withUser(App));
