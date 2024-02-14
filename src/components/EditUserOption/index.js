import React, { useState } from "react";
import { icons } from "../../images";

const EditUserOption = (props) => {
  const [editIcon, setEditIcon] = useState(icons.editIcon);

  const onMouseEnter = () => {
    setEditIcon(icons.editIconHover);
  };

  const onMouseLeave = () => {
    setEditIcon(icons.editIcon);
  };

  return (
    <div>
      {props.authorized ? (
        <img
          className="edit-user"
          src={editIcon}
          alt="Edit"
          onMouseEnter={() => onMouseEnter()}
          onMouseLeave={() => onMouseLeave()}
          onClick={() => props.showModal(props.user)}
        />
      ) : (
        <img className="edit-user" src={icons.editIconDisabled} alt="Edit" />
      )}
    </div>
  );
};

export default EditUserOption;
