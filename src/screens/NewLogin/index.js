import React, { useState, useEffect } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../images";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { withCookies } from "react-cookie";
import { authenticationActions } from "../../actions";
import Loader from "react-loader-spinner";
import { NewFooter, NotificationPopup } from "../../components";
// import { detect } from "detect-browser";
import { useQueryClient } from "react-query";
import { config } from "../../../src/utils/conf";
import { b2cPolicies } from "./../../authConfig";
function Login(props) {
  const queryClient = useQueryClient();
  queryClient.removeQueries();

  const { welcome, logoWhite, newLoginBackground } = login;
  // const browser = detect();

  // const supportedBrowsers = ["chrome", "firefox", "safari", "edge-chromium"];
  const unsupported = false; //!supportedBrowsers.includes(browser.name);

  const [accessToken, setAccessToken] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotificationPopup, setSowNotificationPopup] = useState(false);

  const { instance, accounts, inProgress } = useMsal();
  const [requestingToken, setRequestingToken] = useState(false);
  const handleLogin = (loginType) => {
    localStorage.clear();

    if (loginType === "popup") {
      instance.loginPopup(loginRequest).catch((e) => {
        console.log(e);
      });
    } else if (loginType === "redirect") {
      instance.loginRedirect(loginRequest).catch((e) => {
        console.log(e);
      });
    }
  };

  function ProfileContent() {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };
    setRequestingToken(true);

    instance
      .acquireTokenSilent(request)
      .then((response) => {
        setTimeout(() => {
          setRequestingToken(false);
        }, 300);
        setAccessToken(response.idToken);
      })
      .catch((e) => {
        // instance.acquireTokenPopup(request).then((response) => {
        //   setAccessToken(response.accessToken);
        // });
        setRequestingToken(false);
        throw e;
      });

    if (accessToken) {
      props.dispatch(authenticationActions.authorization(accessToken));
    }
    return true;
  }

  const logout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/login",
    });

    // return <Redirect to="/login" />;
  };

  const closeNotificationPopup = () => {
    setSowNotificationPopup(false);
  };

  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      if (accounts[0]?.idTokenClaims.tfp === b2cPolicies.names.signUpSignIn) {
        ProfileContent();
      }
    }
  }, [isAuthenticated, accessToken]); // eslint-disable-line

  useEffect(() => {
    if (props.user.error) {
      setSowNotificationPopup(true);

      if (props.user.error.response) {
        setNotificationMessage(
          "Sorry, You do not have permission to enter to the TOSCA HUB portal Please contact the TOSCA customer support team for further inquiries.",
        );
      } else {
        setNotificationMessage("Connection timed out. Please try again later.");
      }
    }
  }, [props.user.error]);

  let signInMessage = "Sign in with your Microsoft Account";

  if (props.user.error && accessToken) {
    signInMessage = "Please, sign out and Sign in with a different account";
  }
  if (
    isAuthenticated &&
    accounts[0]?.idTokenClaims.tfp === b2cPolicies.names.forgotPassword
  ) {
    signInMessage = "Please sign-in with your new password.";
  }

  return (
    <>
      <NotificationPopup
        message={notificationMessage}
        visible={showNotificationPopup}
        closeModal={closeNotificationPopup}
        type={"danger"}
      />

      <div
        className="page-wrapper background"
        style={{ backgroundImage: `url(${newLoginBackground})` }}
      >
        <div className="login-page-body">
          <div className="left">
            <div className="new-login-container">
              <div
                className="login-form"
                style={{
                  position: "relative",
                  display: unsupported ? "flex" : "none",
                }}
              >
                <p
                  className="browser-support"
                  style={{
                    marginTop: 15,
                  }}
                >
                  It looks like you are using an unsupported browser. For the
                  best experience, please use Chrome, Firefox or Safari.
                  <a
                    className="browser-support-link"
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://www.forbes.com/sites/gordonkelly/2019/02/09/microsoft-internet-explorer-upgrade-warning-edge-google-chrome-firefox/"
                  >
                    Read more about that here.
                  </a>
                </p>
              </div>

              <div
                className="login-form"
                style={{
                  position: "relative",
                  display: unsupported ? "none" : "flex",
                }}
              >
                <div
                  style={{
                    display: props.loginPending ? "block" : "none",
                  }}
                  className="loader-container"
                >
                  <Loader
                    type="ThreeDots"
                    height="100px"
                    width="100px"
                    color="rgba(246,130,32,0.8)"
                  />
                </div>

                <div id="welcome">
                  <img src={welcome} alt="Welcome" width="100%" />
                </div>
                <h2
                  style={{
                    fontSize: "35px",
                    fontWeight: "400",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  {props.user.error && accessToken ? "Sorry!" : "Sign In"}
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "300",
                    marginTop: "10px",
                    marginBottom: "10px",
                    textAlign: "center",
                  }}
                >
                  {signInMessage}
                </p>
                {inProgress === "none" &&
                !requestingToken &&
                !props.isAuthorizing ? (
                  <div className="sign-in-button">
                    {(props.user.error && accessToken) ||
                    (isAuthenticated &&
                      accounts[0]?.idTokenClaims.tfp ===
                        b2cPolicies.names.forgotPassword) ? (
                      <button
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                        className="new-btn-logout"
                        onClick={() => logout()}
                      >
                        Sign out
                      </button>
                    ) : (
                      <button
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                        className="new-btn-login"
                        onClick={() => handleLogin("redirect")}
                      >
                        Sign in
                      </button>
                    )}
                  </div>
                ) : (
                  <Loader
                    type="ThreeDots"
                    height="100px"
                    width="100px"
                    color="rgba(246,130,32,0.8)"
                  />
                )}
              </div>
              <div id="contact-details">
                <p>New to Tosca HUB? Please contact</p>
                <p>
                  <a href="mailto:CustomerExperience@toscaltd.com">
                    CustomerExperience@toscaltd.com
                  </a>
                </p>
                <p>or having trouble logging in? Please contact</p>
                <p>
                  <a href="mailto:DL_ToscaHUBTechnologyTeam@toscaltd.com">
                    DL_ToscaHUBTechnologyTeam@toscaltd.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="right">
            <div id="logo">
              <img src={logoWhite} alt="logo" width="30%" />
            </div>
            <div id="info-container">
              <h2>
                We have made
                <br />
                TOSCA more secure
                <br />
                for you to Login.
              </h2>

              <div id="documentations">
                <div className="documentation-links">
                  <div>
                    <h3>
                      Have a TOSCA
                      <br />
                      Microsoft Account
                    </h3>
                    <p>eg - John@toscaltd.com</p>
                  </div>

                  <div>
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={
                        config.docUrl +
                        "/hub/docs/Tosca%20Account%20Holder's%20Login%20User%20Guide.pdf"
                      }
                    >
                      How to Login?
                    </a>
                  </div>
                </div>

                <div className="documentation-links">
                  <h3>
                    Don’t have a TOSCA
                    <br />
                    Microsoft Account
                  </h3>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={
                      config.docUrl +
                      "/hub/docs/External%20Account%20Holder's%20Login%20User%20Guide.pdf"
                    }
                  >
                    How to Login?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="new-login-footer-x">
          <NewFooter />
        </div>
      </div>
    </>
  );
}

const { object } = PropTypes;

Login.propTypes = {
  user: object,
  error: object,
};

const mapState = ({ session, login }) => ({
  loginPending: login.fetching,
  isAuthorizing: login.authorizing,
  user: session.user,
});

export default connect(mapState)(withCookies(Login));
