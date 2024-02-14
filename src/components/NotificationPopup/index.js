import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import "./style.css";
const el = document.createElement("div");

const NotificationPopup = (props) => {
  let backgroundColor = "#F1DFA0";
  let icon = "bi bi-check-circle-fill";

  if (props.type === "success") {
    backgroundColor = "#B7E8A0";
    icon = "bi bi-check-circle-fill";
  } else if (props.type === "warning") {
    backgroundColor = "#F1DFA0";
    icon = "bi bi-exclamation-circle-fill";
  } else if (props.type === "danger") {
    backgroundColor = "#F6C9C3";
    icon = "bi bi-x-circle-fill";
  }

  useEffect(() => {
    const modalRoot = document.getElementById("toaster-message-root");

    modalRoot?.appendChild(el);
    return () => {
      if (el) {
        try {
          modalRoot?.removeChild(el);
        } catch {
          console.log("Error......");
        }
      }
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      style={{
        zIndex: 500,
        maxHeight: "max-content",
        display: props.visible ? "" : "none",
      }}>
      <div
        style={{
          padding: "5px",
          backgroundColor: backgroundColor,
          color: "black",
        }}>
        <div className="notification-modal-top">
          <div
            className="left center"
            style={{
              backgroundColor: backgroundColor,
              width: "5%",
              height: "inherit",
            }}>
            <span className={icon} style={{ fontSize: "20px" }} />
          </div>

          <div
            className="middle"
            style={{
              backgroundColor: backgroundColor,
              width: "95%",
              height: "inherit",
              display: "flex",
              alignItems: "center",
            }}>
            <span
              style={{
                fontSize: "16px",
                fontWeight: "300",
                fontFamily: "'Roboto', sans-serif",
              }}>
              {props.message}
            </span>
          </div>

          <div
            className="right center"
            style={{
              backgroundColor: backgroundColor,
              width: "10%",
              height: "inherit",
            }}>
            <span
              id="close-button-modal"
              className="glyphicon glyphicon-remove"
              onClick={() => props.closeModal()}
            />
          </div>
        </div>
      </div>
    </div>,
    el,
  );
};

export default NotificationPopup;
