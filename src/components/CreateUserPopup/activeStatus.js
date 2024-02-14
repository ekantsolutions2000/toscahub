import React, { useState, useEffect } from "react";
import { icons } from "../../images";

export default function ActiveStatus(props) {
  const [image, setImage] = useState(icons.activeStatusInactive);

  useEffect(() => {
    if (props.activeStatus === false) {
      setImage(icons.activeStatusInactive);
    } else {
      setImage(icons.activeStatusActive);
    }
  }, [props.activeStatus]);

  const updateStatus = () => {
    if (props.activeStatus === false) {
      props.setActiveStatus(true);
    } else {
      props.setActiveStatus(false);
    }
  };

  return (
    <div className={props.wrapperClassName}>
      <img
        style={{ height: "75%" }}
        src={image}
        alt="active"
        onClick={() => updateStatus()}
      />
    </div>
  );
}
