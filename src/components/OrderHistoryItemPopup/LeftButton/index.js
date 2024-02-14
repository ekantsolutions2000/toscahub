import React, { useState, useEffect } from "react";
import { polygons } from "../../../images";

export default function Left(props) {
  const [image, setImage] = useState(polygons.polygonDefaultLeft);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [props]); // eslint-disable-line

  const handleKeyUp = (e) => {
    const keys = {
      37: () => {
        e.preventDefault();
        setImage(polygons.polygonDefaultLeft);
        props.updateOrder(props.orders, props.index, "prev");
      },
    };

    if (keys[e.keyCode]) {
      keys[e.keyCode]();
    }
  };

  const handleKeyDown = (e) => {
    const keys = {
      37: () => {
        e.preventDefault();
        setImage(polygons.polygonHoverLeft);
      },
    };

    if (keys[e.keyCode]) {
      keys[e.keyCode]();
    }
  };

  const onMouseOver = () => {
    setImage(polygons.polygonHoverLeft);
  };

  const onMouseOut = () => {
    setImage(polygons.polygonDefaultLeft);
  };

  return (
    <div>
      <img
        src={image}
        alt="Left"
        className="left"
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={() => {
          props.updateOrder(props.orders, props.index, "prev");
        }}
      />
    </div>
  );
}
