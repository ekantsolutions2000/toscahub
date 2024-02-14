import React, { useState } from "react";
import { collectionOrders } from "../../images";

export default function InfoIcon() {
  const [infoImage, setInfoImage] = useState(collectionOrders.infoOrange);

  const onMouseOver = () => {
    setInfoImage(collectionOrders.infoBlue);
  };

  const onMouseOut = () => {
    setInfoImage(collectionOrders.infoOrange);
  };
  return (
    <div>
      <img
        src={infoImage}
        alt="info"
        className="tw-h-9 tw-float-right"
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      />
    </div>
  );
}
