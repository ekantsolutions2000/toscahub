import React, { useState } from "react";
import { icons } from "../../images";
import ConfirmationModal from "../Modal/ConfirmationModal";
import Button from "../Button/Button";

const DeleteUserOption = (props) => {
  const [showWarning, setShowWarning] = useState(false);
  return (
    <>
      <button
        className="tw-bg-transparent tw-group"
        disabled={!props.authorized}
      >
        {props.authorized ? (
          <img
            className="tw-h-6 tw-opacity-70 group-hover:tw-opacity-100"
            src={icons.remove}
            alt="Delete"
            onClick={() => setShowWarning(true)}
          />
        ) : (
          <img
            className="tw-h-6"
            style={{ filter: "grayscale(1)" }}
            src={icons.remove}
            alt="Delete"
          />
        )}
      </button>

      <ConfirmationModal
        title="Delete User"
        brand="danger"
        size="md"
        show={showWarning}
        onClose={() => setShowWarning(false)}
      >
        <p>
          Do you want to delete the user <strong>{props.user.fullName}</strong>?
        </p>
        <div className="tw-flex tw-gap-2 tw-mt-6">
          <Button
            type="button"
            brand="danger"
            fullwidth="true"
            onClick={props.deleteUser}
          >
            Yes
          </Button>
          <Button
            brand="secondary"
            fullwidth="true"
            onClick={() => setShowWarning(false)}
          >
            No
          </Button>
        </div>
      </ConfirmationModal>
    </>
  );
};

export default DeleteUserOption;
