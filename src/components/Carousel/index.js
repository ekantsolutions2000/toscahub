import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotate: true,
    };
  }

  render() {
    const { images } = this.props;

    return Object.keys(images).map((key, index) => (
      <div
        className={index === 0 ? "item active" : "item"}
        key={index}
        style={{ height: "inherit" }}>
        <img
          className="background-img"
          src={images[key]}
          alt="cheese"
          style={{ height: "inherit" }}
        />
      </div>
    ));
  }
}

const { object } = PropTypes;

Carousel.propTypes = {
  images: object.isRequired,
};
