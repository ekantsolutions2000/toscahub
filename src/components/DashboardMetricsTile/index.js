import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";

export default class DashboardMetricsTile extends Component {
  render() {
    const { label, value } = this.props;
    return (
      <div className="dashboard-matrics-tile tw-text-center tw-bg-tosca-orange">
        <p className="tw-display-block tw-w-full">
          {label} <span className="value tw-text-white text-4xl">{value}</span>
        </p>
      </div>
    );
  }
}

const { string, object } = PropTypes;

DashboardMetricsTile.contextTypes = {
  router: object,
};

DashboardMetricsTile.propTypes = {
  label: string.isRequired,
  value: string.isRequired,
};
