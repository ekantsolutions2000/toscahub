import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";

export default class DashboardNavTile extends Component {
  handleClick = () => {
    const { linkTo } = this.props;
    this.context.router.history.push(linkTo);
  };

  render() {
    const { icon, label } = this.props;
    return (
      <div
        className="dashboard-nav-tile"
        title={label}
        onClick={this.handleClick}>
        <img src={icon} alt={label} />
        <p>{label}</p>
      </div>
    );
  }
}

const { any, string, object } = PropTypes;

DashboardNavTile.contextTypes = {
  router: object,
};

DashboardNavTile.propTypes = {
  linkTo: string.isRequired,
  icon: any.isRequired,
  label: string.isRequired,
};
