import React from "react";
import "./style.css";
import ReactDOM from "react-dom/client";
import ConfirmationModal from "../../Modal/ConfirmationModal";
import Button from "../../Button/Button";

const LeavingPageWarningModal = (message, callback) => {
  window.onbeforeunload = () => true;
  const container = document.createElement("div");
  container.setAttribute("custom-confirmation-navigation", "");
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);

  const closeModal = (callbackState) => {
    root.unmount(container);
    callback(callbackState);
    window.onbeforeunload = null;
  };

  root.render(
    <ConfirmationModal
      title="Caution!"
      brand="danger"
      show={true}
      onClose={() => closeModal(false)}>
      <p>{message}</p>

      <p>
        Click <b className="tw-text-gray-700">Cancel</b> to continue working.
      </p>
      <p>
        or Click <b className="tw-text-gray-700">Leave.</b> Your data will be
        deleted.
      </p>

      <div className="tw-flex tw-gap-2 tw-mt-6">
        <Button
          brand="danger"
          type="button"
          fullwidth="true"
          onClick={() => closeModal(true)}>
          Leave
        </Button>
        <Button
          brand="secondary"
          type="button"
          fullwidth="true"
          onClick={() => closeModal(false)}>
          Cancel
        </Button>
      </div>
    </ConfirmationModal>,
  );
};
export default LeavingPageWarningModal;
