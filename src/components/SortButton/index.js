import React, { Component } from "react";
import PropTypes, { string } from "prop-types";
import cloneDeep from "lodash/cloneDeep";
class SortButton extends Component {
  constructor() {
    super();
    this.state = {
      sortDesc: true,
      upIcon: (
        <svg
          fill="currentColor"
          className="tw-text-gray-500 tw-w-6"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path opacity=".54" d="M7 14l5-5 5 5H7z" />
        </svg>
      ),
      downIcon: (
        <svg
          fill="currentColor"
          className="tw-text-gray-500 tw-w-6"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path opacity=".54" d="M7 10l5 5 5-5H7z" />
        </svg>
      ),
      activeIcon: null,
    };
  }

  handleSortClick = (e) => {
    e.preventDefault();
    const { sortDesc } = this.state,
      { orderSort } = this.props;
    this.setState({
      sortDesc: !sortDesc,
      activeIcon: sortDesc ? this.state.upIcon : this.state.downIcon,
    });
    orderSort(!sortDesc, this.props.sortField);
  };

  render() {
    let data = { ...cloneDeep(this.state), clickHandler: this.handleSortClick };
    return this.props.render({ data });
  }
}

const { func } = PropTypes;

SortButton.propTypes = {
  orderSort: func,
  sortField: string,
};

export default SortButton;
