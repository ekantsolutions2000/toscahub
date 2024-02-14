import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { icons } from "../../../images";

export default class NewsItem extends Component {
  render() {
    const { forward } = icons;
    const { link, headline } = this.props;
    return (
      <div className="news-item">
        <img src={forward} alt="forward" />
        <a href={link} target="_blank" rel="noopener noreferrer">
          {headline}
        </a>
      </div>
    );
  }
}

const { string } = PropTypes;

NewsItem.propTypes = {
  link: string.isRequired,
  headline: string.isRequired,
};
