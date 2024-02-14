import React, { useState } from "react";

const AlphabeticalFilter = (props) => {
  const { lettersList, letterChange } = props;
  const [activeKey, setActiveKey] = useState("all");

  const handleClickFilterByletter = (letter) => {
    if (activeKey === letter) {
      setActiveKey("all");
      letterChange("all");
    } else {
      setActiveKey(letter);
      letterChange(letter);
    }
  };

  return (
    <div className="filtter-wrapper">
      <div
        className={`letter-key ${activeKey === "all" ? "active-key" : ""}`}
        onClick={() => handleClickFilterByletter("all")}>
        <p>All</p>
      </div>

      {lettersList.map((letter, index) => (
        <div
          className={`letter-key ${activeKey === letter ? "active-key" : ""}`}
          key={index}
          onClick={() => handleClickFilterByletter(letter)}>
          <p>{letter}</p>
        </div>
      ))}
    </div>
  );
};

export default AlphabeticalFilter;
