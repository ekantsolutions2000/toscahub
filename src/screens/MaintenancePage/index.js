import React from "react";
import "./style.css";
import { NewFooter } from "../../components";
import { underMaintenance, logoHorizontal } from "../../images";

function MaintenancePage(props) {
  console.log(underMaintenance);

  return (
    <div id="mp-body">
      <div id="mp-left-top">
        <img src={logoHorizontal} alt="Logo" width="40%" />
      </div>
      <div className="mp-top-left-gradient" />
      <div className="mp-bottom-middle-gradient" />
      <div className="mp-bottom-right-gradient" />
      <div id="maintenance-page">
        <div id="mp-left">
          <div id="mp-left-middle">
            <h2>
              We are upgrading the TOSCA website for you. We will be back
              <br />
              on 24th January.
            </h2>
          </div>
          <div id="mp-left-bottom">
            <h3>
              Please contact our customer support representatives
              <br />
              for further assistance (
              <a href="mailto:customerexperience@toscaltd.com">
                customerexperience@toscaltd.com
              </a>
              )
            </h3>
          </div>
        </div>
        <div id="mp-right">
          <img src={underMaintenance} alt="Under Maintenance" width="80%" />
        </div>
        <div className="new-login-footer">
          <NewFooter />
        </div>
      </div>
    </div>
  );
}

export default MaintenancePage;
