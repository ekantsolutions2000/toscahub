import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import Select, { components } from "react-select";
import { ExportData } from "../../components";
import { sortfilter_icons, pagination_icons } from "../../images";
import _ from "lodash";

export default class SorfFilterBar extends Component {
  constructor() {
    super();
    this.state = {
      sortDesc: true,
      sortField: "",
      showExportDataOption: false,
      width: window.innerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  getData = (e) => {
    console.log(e);
  };

  handleSortClick = (e) => {
    e.preventDefault();
    const { sortDesc, sortField } = this.state,
      { orderSort } = this.props;
    this.setState({ sortDesc: !sortDesc });
    orderSort(!sortDesc, sortField);
  };

  handleSortChange = (option) => {
    const { orderSort } = this.props;
    this.setState({ sortField: option.value });
    orderSort(this.state.sortDesc, option.value);
  };

  handlePOSearch = (e) => {
    this.props.onKeywordChange(e.target.value);
  };

  hasFilterApplied = () => {
    if (
      this.props.filter_options !== null &&
      !_.isEmpty(this.props.filter_options)
    ) {
      return true;
    }
    return false;
  };

  render() {
    const { Search } = sortfilter_icons;
    const { list, disabled, filter_options } = this.props;
    const keyword = this.props.searchKeyword;

    return (
      <div id="sort-filter-bar">
        <div
          id="search-sort-filter-one"
          className="search-sort-filter"
          style={{
            flexDirection:
              (this.props.showSort && this.state.width < 1227) ||
              this.state.width < 681
                ? "column"
                : "row",
          }}
        >
          <div
            id="search-sort-one"
            className="search-sort"
            style={{ width: "70%" }}
          >
            {this.props.showSort ? (
              <div className="sort">
                <div style={{ width: "100%" }}>
                  <p className="sort-label">
                    {this.props.ByFieldLabel
                      ? this.props.ByFieldLabel
                      : "Sort by Field"}
                  </p>
                  <Select
                    options={list}
                    className="react-select"
                    components={{ DropdownIndicator }}
                    onChange={this.handleSortChange}
                    isDisabled={disabled}
                  />
                </div>
                <div onClick={this.handleSortClick}>
                  <AscDesc value={this.state.sortDesc} />
                </div>
              </div>
            ) : null}

            <div className="sort">
              <div style={{ width: "100%" }}>
                <p className="sort-label">
                  {this.props.SearchFieldLabel
                    ? this.props.SearchFieldLabel
                    : "Search by PO Number"}
                </p>
                <div className="search-box">
                  <input
                    type="text"
                    value={keyword}
                    onChange={this.handlePOSearch}
                    placeholder={
                      this.props.searchPlaceholderText
                        ? this.props.searchPlaceholderText
                        : "Enter PO #, BOL #, or Order #"
                    }
                  />
                  <img src={Search} alt="search" />
                </div>
              </div>
            </div>
          </div>
          <div
            className="button-parent-container"
            style={{
              marginTop:
                this.props.showSort &&
                this.state.width < 1227 &&
                this.state.width > 680
                  ? "10px"
                  : "0px",
            }}
          >
            {this.props.HideFilterOption ? (
              ""
            ) : (
              <div className="button-container">
                <button
                  id="adv-filter-btn"
                  type="button"
                  className={
                    filter_options
                      ? "btn btn-default filter-applied"
                      : "btn btn-default"
                  }
                  onClick={() => {
                    this.props.showFilter();
                  }}
                >
                  {filter_options ? (
                    <span id="modify-filter-options">
                      Modify Filter Options
                    </span>
                  ) : (
                    <span id="apply-filter-options">
                      Filter Options{" "}
                      <img src={pagination_icons.DownArrow} alt="filter" />
                    </span>
                  )}
                </button>
              </div>
            )}
            <div className="button-container">
              <button
                id="export-btn"
                type="button"
                className="btn btn-default"
                onClick={() => {
                  this.setState({
                    showExportDataOption: !this.state.showExportDataOption,
                  });
                }}
              >
                Export Data
                <img
                  src={
                    this.state.showExportDataOption
                      ? pagination_icons.UpArrow
                      : pagination_icons.DownArrow
                  }
                  alt="filter"
                />
              </button>
            </div>
          </div>
        </div>

        {window.location.pathname === "/collection-orders" && (
          <div className="tw-mt-5 filter-check-box">
            <input
              id="my_order_check"
              checked={this.props.myOrdersOnly}
              onChange={this.props.changeFilters}
              className="tw-pr-2 tw-mt-0 leading-tight tw-h-6 tw-w-6 tw-inline-block tw-align-middle"
              type="checkbox"
            />
            <label
              className="tw-pl-2 tw-pt-1 tw-align-middle leading-tight tw-h-5"
              for="my_order_check"
            >
              Show only my orders
            </label>
          </div>
        )}

        <div className="download">
          {this.state.showExportDataOption ? (
            <ExportData
              fileType={this.props.fileType}
              getData={this.props.getExportData}
              isDataFiltered={this.hasFilterApplied()}
              headers={this.props.headers}
              hideFilteredOption={this.props.hideFilteredOption}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const AscDesc = (props) => {
  const { Ascending, Descending } = sortfilter_icons,
    { value } = props,
    img_style = { width: "30px", margin: "3px" },
    cont_style = {
      border: "solid 1px rgba(126, 212, 247, 1)",
      borderRadius: "4px",
      minHeight: "38px",
      marginLeft: "5px",
    };
  return (
    <div className="sort-img" style={cont_style}>
      {value ? (
        <img style={img_style} src={Descending} alt="descending" />
      ) : (
        <img style={img_style} src={Ascending} alt="ascending" />
      )}
    </div>
  );
};

const DropdownIndicator = (props) => {
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

const { func, array, bool } = PropTypes;

SorfFilterBar.propTypes = {
  // POFilter: func,
  onKeywordChange: func,
  orderSort: func,
  list: array,
  getExportData: func.isRequired,
  disabled: bool.isRequired,
  showFilter: func.isRequired,
};

SorfFilterBar.defaultProps = {
  showSort: true,
  filter_options: null,
  fileType: "",
};
