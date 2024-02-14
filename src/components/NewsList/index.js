import React from "react";
import "./style.css";
import PropTypes from "prop-types";
import NewsItem from "./NewsItem";

const NewsList = (props) => {
  const { newsItems } = props;
  let result = newsItems.filter((item) => item.isActive === true);
  return (
    <div id="news-list">
      {result.map((item, i) => (
        <NewsItem key={i} headline={item.headline} link={item.link} />
      ))}
    </div>
  );
};

const { array } = PropTypes;

NewsList.propTypes = {
  newsItems: array.isRequired,
};

export default NewsList;
