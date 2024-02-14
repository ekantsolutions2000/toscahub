import React, { useState, useEffect } from "react";
import { polygons } from "../../../images";

export default function Right(props) {
  const [image, setImage] = useState(polygons.polygonDefaultRight);

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
      39: () => {
        e.preventDefault();
        setImage(polygons.polygonDefaultRight);
        props.updateOrder(props.orders, props.index, "next");
      },
    };

    if (keys[e.keyCode]) {
      keys[e.keyCode]();
    }
  };

  const handleKeyDown = (e) => {
    const keys = {
      39: () => {
        e.preventDefault();
        setImage(polygons.polygonHoverRight);
      },
    };

    if (keys[e.keyCode]) {
      keys[e.keyCode]();
    }
  };

  const onMouseOver = () => {
    setImage(polygons.polygonHoverRight);
  };

  const onMouseOut = () => {
    setImage(polygons.polygonDefaultRight);
  };

  return (
    <div>
      <img
        src={image}
        alt="Right"
        className="right"
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={() => {
          props.updateOrder(props.orders, props.index, "next");
        }}
      />
    </div>
  );
}
