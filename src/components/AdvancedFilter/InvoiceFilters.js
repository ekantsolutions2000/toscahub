import React, { Component } from "react";
import Select from "react-select";
import moment from "moment";
import _ from "lodash";
import { contentForm, formGroup, btn, DropdownIndicator } from "./index";
import FilterByText from "./../../utils/Filter/FilterByText";

export class InvoiceFilters extends Component {
  state = {
    initLoad: true,
    filteredInvoices: [],
    rangeFilters: {
      cost: {
        options: [
          { label: "Age Amount", value: "ageAmount" },
          { label: "Invoice Amount", value: "invoiceAmount" },
          { label: "Open Amount", value: "openAmount" },
          { label: "Current Amount", value: "currentAmount" },
          { label: "Past Due", value: "pastDue" },
        ],
        selected: null,
      },
      date: {
        options: [
          { label: "Invoice Date", value: "invoiceDate" },
          { label: "Due Date", value: "dueDate" },
        ],
        selected: null,
      },
    },
    filters: {
      aging: null,
    },
  };

  componentDidMount = () => {
    this.setState({ initLoad: false });
  };

  static getFilteredResult(props, state) {
    let invoices = props.invoices;
    let result = [];
    let query = FilterByText.filter(invoices);

    //Filter by Date
    const selectedDateOption = state.rangeFilters.date.selected;
    if (selectedDateOption !== null) {
      const minDate = moment.utc(
        _.get(selectedDateOption, "min", -Infinity) || -Infinity,
      );
      const maxDate = moment.utc(
        _.get(selectedDateOption, "max", +Infinity) || +Infinity,
      );

      query.where((invoice) => {
        let dateFieldValue = invoice[selectedDateOption.value];
        if (!dateFieldValue) {
          return false;
        }
        return moment
          .utc(dateFieldValue)
          .isBetween(minDate, maxDate, "day", "[]");
      });
    }

    //Filter by Aging Status
    const agingStatus = state.filters.aging;
    if (agingStatus) {
      query.where((invoice) => {
        if (!invoice.aging) {
          return false;
        }
        return invoice.aging === agingStatus;
      });
    }

    //Filter by Cost
    const selectedCostOption = state.rangeFilters.cost.selected;
    if (selectedCostOption) {
      const minAmount =
        _.get(selectedCostOption, "min", -Infinity) || -Infinity;
      const maxAmount =
        _.get(selectedCostOption, "max", +Infinity) || +Infinity;

      query.where((invoice) => {
        const costFieldValue = invoice[selectedCostOption.value];
        if (costFieldValue === null || costFieldValue === undefined) {
          return false;
        }
        return costFieldValue >= minAmount && costFieldValue <= maxAmount;
      });
    }

    result = query.get();
    return result;
  }

  static getDerivedStateFromProps(props, state) {
    let filteredInvoices = InvoiceFilters.getFilteredResult(props, state);

    if (!state.initLoad) {
      return { filteredInvoices };
    }

    let rangeFilters = { ...state.rangeFilters };

    for (let filter in rangeFilters) {
      let options = rangeFilters[filter].options;

      for (let i = 0; i < options.length; i++) {
        let option = options[i];
        if (
          props.filterOptions &&
          props.filterOptions.hasOwnProperty(option.value) &&
          props.filterOptions[option.value]
        ) {
          rangeFilters[filter]["selected"] = { ...option };
          rangeFilters[filter]["selected"]["min"] = _.get(
            props.filterOptions[option.value],
            "min",
            "",
          );
          rangeFilters[filter]["selected"]["max"] = _.get(
            props.filterOptions[option.value],
            "max",
            "",
          );
          break;
        }
      }
    }

    return {
      filters: { ...state.filters, ...props.filterOptions },
      rangeFilters: { ...rangeFilters },
      filteredInvoices,
    };
  }

  onAgingChange = (option) => {
    this.setState({
      filters: { ...this.state.filters, aging: option.value },
    });
  };

  onDateOptionChange = (option) => {
    let selectedDateFilter = {
      ...this.state.rangeFilters.date.selected,
      ...option,
    };
    if (_.isEmpty(option)) {
      selectedDateFilter = null;
    }

    let rangeFilters = { ...this.state.rangeFilters };
    rangeFilters.date.selected = selectedDateFilter;

    this.setState({ rangeFilters });
  };

  onDateChange = (e, range) => {
    let rangeFilters = { ...this.state.rangeFilters };
    let selectedDateFilter = { ...rangeFilters.date.selected };
    selectedDateFilter[range] = e.target.value;
    rangeFilters.date.selected = selectedDateFilter;
    this.setState({ rangeFilters });
  };

  onCostOptionChange = (option) => {
    let selectedCostOption = {
      ...this.state.rangeFilters.cost.selected,
      ...option,
    };
    if (_.isEmpty(option)) {
      selectedCostOption = null;
    }

    let rangeFilters = { ...this.state.rangeFilters };
    rangeFilters.cost.selected = selectedCostOption;

    this.setState({ rangeFilters });
  };

  onCostChange = (e, range) => {
    let rangeFilters = { ...this.state.rangeFilters };
    let selectedCostOption = { ...rangeFilters.cost.selected };
    selectedCostOption[range] = e.target.value;
    rangeFilters.cost.selected = selectedCostOption;
    this.setState({ rangeFilters });
  };

  onKeyPressNumberHandler = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    let reg = /^\d+$/;
    if (!reg.test(keyValue)) {
      event.preventDefault();
    }
  };

  onKeyPressDateHandler = (e) => {
    e.preventDefault();
  };

  setFilter = (e) => {
    const { setFilterOptions } = this.props;
    e.preventDefault();
    const { target } = e;
    let filterObject = {
      aging: target.agingStatus.value || null,
      [target.invoiceDate.value ? target.invoiceDate.value : "blank"]:
        target.dateMin.value || target.dateMax.value
          ? {
              min: target.dateMin.value
                ? moment.utc(target.dateMin.value)
                : null,
              max: target.dateMax.value
                ? moment.utc(target.dateMax.value)
                : null,
            }
          : null,
      [target.invoiceCost.value ? target.invoiceCost.value : "blank"]:
        target.invoiceMin.value || target.invoiceMax.value
          ? {
              min: target.invoiceMin.value ? target.invoiceMin.value : null,
              max: target.invoiceMax.value ? target.invoiceMax.value : null,
            }
          : null,
    };

    Object.keys(filterObject).forEach(
      (key) => filterObject[key] == null && delete filterObject[key],
    );

    if (filterObject && !_.isEmpty(filterObject))
      setFilterOptions(filterObject, this.state.filteredInvoices);
    else setFilterOptions(null, this.state.filteredInvoices);
  };

  render() {
    const { invoices, setFilterOptions } = this.props;
    const aging_list = invoices
      .map((invoice) => invoice.aging)
      .reduce((a, b) => {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, [])
      .sort();

    const { filters, rangeFilters } = this.state;
    const agingOption = filters.aging
      ? { label: filters.aging, value: filters.aging }
      : null;
    const dateRangeOption = rangeFilters.date.selected;
    const dateMin = moment(_.get(dateRangeOption, "min", "")).format(
      "YYYY-MM-DD",
    );
    const dateMax = moment(_.get(dateRangeOption, "max", "")).format(
      "YYYY-MM-DD",
    );
    const costRangeOption = rangeFilters.cost.selected;
    const costMin = _.get(costRangeOption, "min", "");
    const costMax = _.get(costRangeOption, "max", "");

    return (
      <form onSubmit={this.setFilter} style={contentForm}>
        <div className="inv-filter-row">
          <div className="filter-col xs:tw-flex-col xs:tw-justify-start xs:tw-w-full">
            <div className="form-group" style={formGroup}>
              <label htmlFor="invoiceDate">Date Range</label>
              <Select
                id="invoiceDate"
                name="invoiceDate"
                className="react-select"
                options={rangeFilters.date.options}
                value={rangeFilters.date.selected}
                onChange={(option) => this.onDateOptionChange(option)}
                components={{ DropdownIndicator }}
              />
              <div
                id="invoiceDateRange"
                className={rangeFilters.date.selected ? null : "disabled"}
              >
                <div
                  className="form-group"
                  id="inv-dateMin"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <input
                    className="tw-text-black"
                    id="dateMin"
                    name="dateMin"
                    type="date"
                    value={dateMin}
                    onChange={(e) => this.onDateChange(e, "min")}
                    onKeyPress={(e) => this.onKeyPressDateHandler(e)}
                  />
                </div>
                <p className="connect-text tw-text-black">To</p>
                <div
                  className="form-group"
                  id="inv-dateMax"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <input
                    className="tw-text-black"
                    id="dateMax"
                    name="dateMax"
                    type="date"
                    value={dateMax}
                    onChange={(e) => this.onDateChange(e, "max")}
                    onKeyPress={(e) => this.onKeyPressDateHandler(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="filter-col tab:tw-w-1/2">
            <div className="form-group" style={formGroup}>
              <label htmlFor="orderQuantity">Cost Range</label>
              <Select
                id="invoiceCost"
                name="invoiceCost"
                className="react-select"
                options={rangeFilters.cost.options}
                value={rangeFilters.cost.selected}
                onChange={(option) => this.onCostOptionChange(option)}
                components={{ DropdownIndicator }}
              />
              <div
                id="invoiceRange"
                className={rangeFilters.cost.selected ? null : "disabled"}
              >
                <div
                  className="form-group"
                  id="inv-dateMin2"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <input
                    className="tw-text-black"
                    id="invoiceMin"
                    name="invoiceMin"
                    type="number"
                    value={costMin || ""}
                    onChange={(e) => this.onCostChange(e, "min")}
                    placeholder="min"
                    onKeyPress={(e) => this.onKeyPressNumberHandler(e)}
                  />
                </div>
                <p className="connect-text tw-text-black">To</p>
                <div
                  className="form-group"
                  id="inv-dateMax2"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <input
                    className="tw-text-black"
                    id="invoiceMax"
                    name="invoiceMax"
                    type="number"
                    value={costMax || ""}
                    onChange={(e) => this.onCostChange(e, "max")}
                    placeholder="max"
                    onKeyPress={(e) => this.onKeyPressNumberHandler(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="filter-col tab:tw-w-1/2">
            <div className="form-group" style={formGroup}>
              <label htmlFor="orderStatus">Aging Status</label>
              <Select
                id="agingStatus"
                name="agingStatus"
                className="react-select"
                options={aging_list.map((age) => ({
                  label: age,
                  value: age,
                }))}
                components={{ DropdownIndicator }}
                value={agingOption}
                onChange={(option) => this.onAgingChange(option)}
              />
            </div>
          </div>
        </div>
        <hr style={{ borderTop: "1px solid black" }} />
        <div className="tw-text-right">{`Found ${this.state.filteredInvoices.length} / ${this.props.invoices.length}`}</div>
        <div
          className="fitler-row"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <button type="submit" style={btn}>
            Apply Filters
          </button>
          <button
            type="button"
            style={{
              ...btn,
              border: "1px black solid",
              backgroundColor: "white",
            }}
            onClick={() => {
              setFilterOptions(null, this.props.invoices);
            }}
          >
            {this.props.filterOptions && !_.isEmpty(this.props.filterOptions)
              ? "Clear Filters"
              : "Cancel"}
          </button>
        </div>
      </form>
    );
  }
}
