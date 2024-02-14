import React from "react";
import "./style.css";

const Warning = (props) => {
  return (
    <div
      className="warning-overlay"
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
      }}>
      <div id="ty-modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}>
          <span
            className="glyphicon glyphicon-remove pull-right"
            onClick={() => props.closeModal()}
          />
        </div>
        <div className="warning-header">
          <h1 className="warning-title">{props.title || "Caution!"}</h1>
        </div>
        <div>
          <p className="tw-text-gray-700">{props.message}</p>
          <div className="tw-text-gray-700 tw-mt-6">
            <props.ButtonDescription />
          </div>
          <div className="tw-flex tw-justify-end tw-mt-6">
            <props.Buttons />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Warning;
