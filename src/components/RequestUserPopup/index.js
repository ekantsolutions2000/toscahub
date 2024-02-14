import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import {
  EmailConfigHelper,
  emailConfigs,
} from "../../components/HOC/withEmail/withEmail";
import { emailActions } from "../../actions";
import useSession from "../../hooks/Auth/useSession";
import useGetCustomer from "../../hooks/CustomerProfile/useGetCustomer";

const RequestUserPopup = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.session);
  const modal = useRef();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setemail] = useState("");
  const [defaultOrganization, setDefaultOrganization] = useState("");

  const { customerId } = useSession();
  const { data: customer, isLoading } = useGetCustomer(customerId);

  useEffect(() => {
    setDefaultOrganization(customer?.customerName);
  }, [isLoading]); // eslint-disable-line

  const closePopup = () => {
    clear();
    props.closeModal();
  };

  const clear = () => {
    setFirstName("");
    setLastName("");
    setemail("");
    setDefaultOrganization("");
  };

  const onRequesstNewUserSubmit = (e, emailConfig) => {
    e.preventDefault();
    const { sendEmail } = emailActions;

    const _email = {
      Recipients: emailConfig.getReciepients(),
      CopyRecipients: emailConfig.getCopyReciepients(),
      Subject: `Requesting a New User${
        user.CustomerInfo && user.CustomerInfo.CustName
          ? " - " + user.CustomerInfo.CustName
          : ""
      }`,
      Body: `<br/>
        First Name: ${firstName}<br/> 
        Last Name: ${lastName}<br/>
        Email: ${email}<br/>
        Organization: ${defaultOrganization}<br/>
        Requested by: ${user.UserName}`,
    };

    dispatch(
      sendEmail(
        user.accessToken,
        {
          ...user.CustomerInfo,
          CustName: customer?.customerName,
          ContactEmail: user.Email,
        },
        _email,
      ),
    );
  };

  useEffect(() => {
    return () => {
      clear();
    };
  }, []); // eslint-disable-line

  return (
    <div
      className="info-overlay"
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        display: props.visible ? "" : "none",
      }}
    >
      <div id="request-user" ref={modal}>
        {/* model Header */}
        <div id="request-user-top">
          <div id="request-user-header">
            <h2>{`Request a New User`}</h2>
            <div
              id="cu-close-button"
              style={{ position: "absolute !important" }}
            >
              <span
                className="glyphicon glyphicon-remove"
                onClick={closePopup}
              />
            </div>
          </div>
        </div>

        <div className="request-user-bottom">
          <EmailConfigHelper configName={emailConfigs.REQUEST_USER}>
            {(emailConfig) => (
              <form onSubmit={(e) => onRequesstNewUserSubmit(e, emailConfig)}>
                {/* model body */}
                <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-x-12">
                  <div className="tw-col-auto  field-sep">
                    <label htmlFor="firstName" className="field-title">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="form-control field-text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                      required
                    />
                  </div>

                  <div class="tw-col-auto field-sep">
                    <label htmlFor="lastName" className="field-title">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="form-control field-text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                      required
                    />
                  </div>

                  <div class="tw-col-auto field-sep">
                    <label htmlFor="email" className="field-title">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control field-text"
                      value={email}
                      onChange={(e) => {
                        setemail(e.target.value);
                      }}
                      required
                    />
                  </div>

                  <div class="tw-col-auto field-sep tw-hidden sm:tw-block"></div>

                  <div class="tw-col-auto field-sep">
                    <label htmlFor="lastName" className="field-title">
                      Default Organization
                    </label>
                    <input
                      type="text"
                      id="defaultLocation"
                      className="form-control field-text"
                      value={defaultOrganization}
                      onChange={(e) => {
                        setDefaultOrganization(e.target.value);
                      }}
                      required
                    />
                  </div>

                  <div class="tw-col-auto field-sep tw-hidden sm:tw-block"></div>
                </div>

                {/* model footer */}
                <div className="cu-footer">
                  <button
                    type="button"
                    class="btn btn-secondary modal-footer-cancel-btn"
                    data-dismiss="modal"
                    onClick={closePopup}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary modal-footer-submin-btn"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </EmailConfigHelper>
        </div>
      </div>
    </div>
  );
};

export default RequestUserPopup;
