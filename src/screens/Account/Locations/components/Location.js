import React, { useState } from "react";
import PropTypes from "prop-types";
import "../style.css";
import { pagination_icons } from "../../../../images";

export default function Location({ location }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`location-section${expanded ? " active" : ""}`}
      style={{ backgroundColor: expanded ? "rgba(126,212,247, .1)" : "white" }}
      onClick={() => setExpanded((val) => !val)}>
      <div className="location-section-header header-style">
        <div className="location-container">
          <div className="headerStyle" style={{ flexWrap: "wrap" }}>
            <div className="header-item">
              <div className="header-label">{location.addressName}</div>
            </div>
          </div>

          <div
            className="location-section-detail"
            style={{ display: expanded ? "flex" : "none" }}>
            <div className="header-style" style={{ flexWrap: "wrap" }}>
              <div className="header-item header-item-alt">
                <div className="address-container">
                  <div className="address">
                    <div>{location.addressLine1}</div>
                    {location.addressLine2 ? (
                      <div>{location.addressLine2}</div>
                    ) : null}
                    <div>
                      {location.city}, {location.state} {location.postalCode}
                    </div>
                    <div>{location.country}</div>
                  </div>
                </div>
                <div className="transport-container">
                  <div className="transport-instructions-heading">
                    TRANSPORTATION INSTRUCTIONS
                  </div>
                  <div className="transport-instructions">
                    {location.transportationInstructions}
                  </div>
                  <div className="loading-instructions-heading">
                    LOADING INSTRUCTIONS
                  </div>
                  <div className="loading-instructions">
                    {location.loadingInstructions}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="header-icon">
          {expanded ? (
            <img src={pagination_icons.UpArrow} alt="shrink order detail" />
          ) : (
            <img src={pagination_icons.DownArrow} alt="expand order detail" />
          )}
        </div>
      </div>
    </div>
  );
}

Location.propTypes = {
  location: PropTypes.object.isRequired,
};
