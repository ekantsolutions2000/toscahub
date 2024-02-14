import React, { useRef } from "react";
import "./style.css";

const MessagePopup = (props) => {
  const modal = useRef();

  const closePopup = () => {
    props.closeModal();
  };

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
      }}>
      <div id="message-popup" ref={modal}>
        {/* model Header */}
        <div id="message-popup-top" className={`${props.messageType}`}>
          <div id="message-popup-header">
            <h2>{props.messageTitel}</h2>
            <div
              id="cu-close-button"
              style={{ position: "absolute !important" }}>
              <span
                className="glyphicon glyphicon-remove"
                onClick={closePopup}
              />
            </div>
          </div>
        </div>

        <div className="message-popup-bottom">
          {/* model body */}

          <div>{props.children}</div>

          {/* model footer */}
          <div className="cu-footer"> </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePopup;
