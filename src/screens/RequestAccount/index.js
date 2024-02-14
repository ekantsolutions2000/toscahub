import React, { Component } from "react";
import "./style.css";
import { FormInputs } from "../../components";
import { userInfo, orgInfo } from "./createAcctObj";
import { Link } from "react-router-dom";
import { logo } from "../../images";

export default class RequestAccount extends Component {
  submitAcctReq = (e) => {
    e.preventDefault();
    const { password, confirmPass } = e.target;

    if (password.value !== confirmPass.value) {
      password.value = "";
      confirmPass.value = password.value;
      password.labels[0].className += "pass-err";
      password.focus();
    }
  };

  cancelAcctreq = (e) => {
    window.location.href = "/login";
  };

  render() {
    return (
      <div className="request-account-page">
        <header className="header">
          <img src={logo} alt="Tosca" />
        </header>
        <h1>Request New Account</h1>
        <p>
          <Link to="/login">Already have an account? Log in now.</Link> Not a
          registred user yet? Please enter your information below to request a
          new account.
        </p>
        <form onSubmit={this.submitAcctReq} onReset={this.cancelAcctreq}>
          <div className="row">
            <div className="col-md-6">
              <h2>User Information</h2>
              <FormInputs inputs={userInfo} />
            </div>
            <div className="col-md-6">
              <h2>Company Information</h2>
              <FormInputs inputs={orgInfo} />
            </div>
          </div>
          <div className="row">
            <button className="col-md-6 btn btn-primary" type="submit">
              Submit
            </button>
            <button className="col-md-6 btn btn-primary" type="reset">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}
