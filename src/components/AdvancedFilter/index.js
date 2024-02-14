import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { components } from "react-select";
import { pagination_icons } from "../../images";
import { OrderFilters } from "./OrderFilters";
import { InvoiceFilters } from "./InvoiceFilters";
import { OrderLogsFilters } from "./OrderLogsFilters";
import { CollectionsFilter } from "./CollectionsFilter";
import { icons } from "../../images";

export default class AdvancedFilter extends Component {
  render() {
    const filterTypes = {
      order: (
        <OrderFilters
          orders={this.props.filterList}
          setFilterOptions={this.props.setFilter}
          filterOptions={this.props.filterOptions}
        />
      ),
      invoice: (
        <InvoiceFilters
          invoices={this.props.filterList}
          setFilterOptions={this.props.setFilter}
          filterOptions={this.props.filterOptions}
        />
      ),
      orderLog: (
        <OrderLogsFilters
          orders={this.props.filterList}
          setFilterOptions={this.props.setFilter}
          filterOptions={this.props.filterOptions}
          organizations={this.props.organizations}
        />
      ),
      collections: (
        <CollectionsFilter
          orders={this.props.filterList}
          setFilterOptions={this.props.setFilter}
          filterOptions={this.props.filterOptions}
          organizations={this.props.organizations}
        />
      ),
    };

    return (
      <div className="adv-filter">
        <div className="adv-filter-header">
          {/* {this.props.children} */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
            onClick={this.props.onBackButtonClick}
          >
            <img
              src={icons.forward}
              alt="back"
              style={{
                transform: "rotate(180deg)",
                width: 25,
                marginBottom: 3,
                marginRight: 5,
              }}
            />
            <input
              type="button"
              className="btn btn-link"
              value={this.props.backButtonLabel}
              onClick={this.props.onBackButtonClick}
              style={{
                fontSize: 20,
                color: "#414042",
                padding: 0,
                margin: 0,
                textDecoration: "underline",
              }}
            />
          </div>

          <h3 className="filters-heading">Filters</h3>
        </div>

        {filterTypes[this.props.type]}
      </div>
    );
  }
}

// Styles
export const contentForm = {
    backgroundColor: "white",
    padding: "32px 16px",
  },
  content = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  filterCol = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "31%",
  },
  formGroup = {
    width: "100%",
  },
  btn = {
    margin: 5,
    width: 127,
    height: 40,
    borderRadius: 4,
    backgroundImage: "none",
    backgroundColor: "#7ed4f7",
    border: "none",
    fontSize: 16,
    fontWeight: 500,
  },
  DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <img
            src={pagination_icons.DownArrow}
            alt="left arrow"
            width={20}
            height={20}
          />
        </components.DropdownIndicator>
      )
    );
  };

const { array, func } = PropTypes;

AdvancedFilter.propTypes = {
  filterList: array.isRequired,
  setFilter: func.isRequired,
  type: PropTypes.oneOf(["order", "invoice", "orderLog", "collections"])
    .isRequired,
};

AdvancedFilter.defaultProps = {
  backButtonLabel: "Back",
};
