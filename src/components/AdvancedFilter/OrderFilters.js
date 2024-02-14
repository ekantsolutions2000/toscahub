import React, { Component } from "react";
import moment from "moment";
import Select from "react-select";
import _ from "lodash";
import { DropdownIndicator } from "./index";
import FilterByText from "./../../utils/Filter/FilterByText";
import DatePicker from "react-datepicker";

export class OrderFilters extends Component {
  state = {
    initLoad: true,
    filteredOrders: [],
    dateFilterOptions: [
      {
        label: "Estimated Delivery Date Time",
        value: "estimatedDeliveryDateTime",
      },
      { label: "Order Date", value: "orderDate" },
      { label: "Requested Delivery Date", value: "requestedDeliveryDate" },
      { label: "Scheduled Ship Date", value: "scheduledShipDate" },
    ],
    customerPickUpOptions: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    selectedDateFilter: null,
    selectedCustomerPickUpFilter: null,
    filters: {
      statusDesc: null,
      shipToLocation: null,
      containerType: null,
      quantity: null,
      addedBy: null,
      estimatedDeliveryDateTime: null,
      orderDate: null,
      requestedDeliveryDate: null,
      scheduledShipDate: null,
    },
  };

  componentDidMount = () => {
    this.setState({ initLoad: false });
  };

  static getFilteredResult(props, state) {
    const { filters } = state;

    let query = FilterByText.filter(props.orders);

    if (filters.statusDesc) {
      query.where((order) => order.statusDesc === filters.statusDesc);
    }

    if (filters.customerPickUp != null) {
      query.where((order) => order.customerPickUp === filters.customerPickUp);
    }

    if (state.selectedDateFilter) {
      query.whereBetweenDate(
        state.selectedDateFilter.value,
        state.selectedDateFilter,
      );
    }

    if (filters.shipToLocation) {
      query.where((order) => order.shipToLocation === filters.shipToLocation);
    }

    if (filters.containerType) {
      query.whereIn(
        "containerType",
        filters.containerType.map((containerType) => {
          return containerType.value;
        }),
      );
    }

    if (filters.quantity) {
      query.whereBetween("quantity", filters.quantity);
    }

    if (filters.addedBy) {
      query.where((order) => order.addedBy === filters.addedBy);
    }

    return query.get();
  }

  static getDerivedStateFromProps(props, state) {
    let filteredOrders = OrderFilters.getFilteredResult(props, state);

    if (!state.initLoad) {
      return { filteredOrders };
    }

    let dateFilter = {};
    for (let i = 0; i < state.dateFilterOptions.length; i++) {
      let option = state.dateFilterOptions[i];

      if (
        props.filterOptions &&
        props.filterOptions.hasOwnProperty(option.value) &&
        props.filterOptions[option.value]
      ) {
        dateFilter["selectedDateFilter"] = { ...option };
        dateFilter["selectedDateFilter"]["min"] = _.get(
          props.filterOptions[option.value],
          "min",
          "",
        );
        dateFilter["selectedDateFilter"]["max"] = _.get(
          props.filterOptions[option.value],
          "max",
          "",
        );
        break;
      }
    }

    let selectedCustomerPickUpFilter = null;
    if (props.filterOptions) {
      if (props.filterOptions.customerPickUp === "true") {
        selectedCustomerPickUpFilter = { label: "Yes", value: true };
      }
      if (props.filterOptions.customerPickUp === "false") {
        selectedCustomerPickUpFilter = { label: "No", value: false };
      }
    }

    return {
      filters: { ...state.filters, ...props.filterOptions },
      ...dateFilter,
      filteredOrders,
      selectedCustomerPickUpFilter,
    };
  }

  onOrderStatusChange = (option) => {
    this.setState({
      filters: { ...this.state.filters, statusDesc: option.value },
    });
  };

  onShipToLocationChange = (option) => {
    this.setState({
      filters: { ...this.state.filters, shipToLocation: option.value },
    });
  };

  onContainerTypeChange = (option) => {
    this.setState({
      filters: { ...this.state.filters, containerType: option },
    });
  };

  onCustomerPickUpChange = (option) => {
    this.setState({
      filters: { ...this.state.filters, customerPickUp: option.value },
    });
    this.setState({ selectedCustomerPickUpFilter: option });
  };

  onAddedByChange = (option) => {
    this.setState({
      filters: { ...this.state.filters, addedBy: option.value },
    });
  };

  onMinQtyChange = (e) => {
    let qty = { ...this.state.filters.quantity, min: e.target.value };
    this.setState({ filters: { ...this.state.filters, quantity: qty } });
  };

  onMaxQtyChange = (e) => {
    let qty = { ...this.state.filters.quantity, max: e.target.value };
    this.setState({ filters: { ...this.state.filters, quantity: qty } });
  };

  onMinDateChange = (e) => {
    if (!this.state.selectedDateFilter) {
      window.alert("Please select a date range in order to select a date.");
      return;
    }

    let selectedDateFilter = { ...this.state.selectedDateFilter };
    selectedDateFilter.min = e;
    this.setState({ selectedDateFilter: selectedDateFilter });
  };

  onMaxDateChange = (e) => {
    if (!this.state.selectedDateFilter) {
      window.alert("Please select a date range in order to select a date.");
      return;
    }

    let selectedDateFilter = { ...this.state.selectedDateFilter };
    selectedDateFilter.max = e;
    this.setState({ selectedDateFilter: selectedDateFilter });
  };

  onDateFilterOptionChange = (option) => {
    let selectedDateFilter = { ...this.state.selectedDateFilter, ...option };
    if (_.isEmpty(option)) {
      selectedDateFilter = null;
    }

    this.setState({ selectedDateFilter: selectedDateFilter });
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
      statusDesc: target.orderStatus.value || null,
      shipToLocation: target.orderShipTo.value || null,
      containerType: this.state.filters.containerType || null,
      customerPickUp: target.selfPickup.value || null,
      quantity:
        target.orderMin.value || target.orderMax.value
          ? {
              min: target.orderMin.value ? target.orderMin.value : null,
              max: target.orderMax.value ? target.orderMax.value : null,
            }
          : null,
      [this.state.selectedDateFilter?.value
        ? this.state.selectedDateFilter.value.replace(/\s+/g, "")
        : "blank"]:
        this.state.selectedDateFilter?.min || this.state.selectedDateFilter?.max
          ? {
              min: this.state.selectedDateFilter?.min
                ? moment.utc(this.state.selectedDateFilter.min)
                : null,
              max: this.state.selectedDateFilter?.max
                ? moment.utc(this.state.selectedDateFilter.max)
                : null,
            }
          : null,
      addedBy: target.orderAddedBy.value || null,
    };

    Object.keys(filterObject).forEach(
      (key) => filterObject[key] == null && delete filterObject[key],
    );

    if (filterObject && !_.isEmpty(filterObject))
      setFilterOptions(filterObject, this.state.filteredOrders);
    else setFilterOptions(null, this.state.filteredOrders);
  };

  render() {
    const { orders, setFilterOptions } = this.props;
    const status_list = orders
        .map((order) => order.statusDesc)
        .reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, [])
        .sort(),
      ship_to_list = orders
        .map((order) => order.shipToLocation)
        .reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, [])
        .sort(),
      container_size_list = orders
        .map((order) => order.containerType)
        .reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, [])
        .sort(),
      //   date_type_list = ['Estimated Delivery Date Time', 'Order Date', 'Requested Delivery Date', 'Scheduled Ship Date'].sort(),
      added_by_list = orders
        .map((order) => order.addedBy)
        .reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, [])
        .sort();

    const filters = this.state.filters;
    const statusOption = filters.statusDesc
      ? { label: filters.statusDesc, value: filters.statusDesc }
      : null;
    const containerTypeOption = filters.containerType
      ? filters.containerType
      : null;
    const shipToLocationOption = filters.shipToLocation
      ? { label: filters.shipToLocation, value: filters.shipToLocation }
      : null;
    const addedByOption = filters.addedBy
      ? { label: filters.addedBy, value: filters.addedBy }
      : null;
    const minQty = _.get(filters.quantity, "min", "") || "";
    const maxQty = _.get(filters.quantity, "max", "") || "";

    const selectedDateFilter = this.state.selectedDateFilter;
    const customerPickUpOption = this.state.selectedCustomerPickUpFilter;
    const dateMin = moment(_.get(selectedDateFilter, "min", "")).format(
      "YYYY-MM-DD",
    );
    const dateMax = moment(_.get(selectedDateFilter, "max", "")).format(
      "YYYY-MM-DD",
    );

    return (
      <form onSubmit={this.setFilter} className="content-form">
        <div className="filter-row content">
          <div className="left-col">
            <div className="form-group">
              <label htmlFor="orderStatus">Status</label>
              <Select
                id="orderStatus"
                name="orderStatus"
                className="react-select"
                options={status_list.map((status) => ({
                  label: status,
                  value: status,
                }))}
                components={{ DropdownIndicator }}
                value={statusOption}
                onChange={(option) => this.onOrderStatusChange(option)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="orderShipTo">Ship To Location</label>
              <Select
                id="orderShipTo"
                name="orderShipTo"
                className="react-select"
                options={ship_to_list.map((shipTo) => ({
                  label: shipTo,
                  value: shipTo,
                }))}
                value={shipToLocationOption}
                onChange={(option) => this.onShipToLocationChange(option)}
                components={{ DropdownIndicator }}
              />
            </div>
          </div>
          <div className="center-col">
            <div className="form-group">
              <label htmlFor="orderSize">Container Size</label>
              <Select
                id="orderSize"
                name="orderSize"
                className="react-select"
                isMulti
                options={container_size_list.map((size) => ({
                  label: size,
                  value: size,
                }))}
                components={{ DropdownIndicator }}
                value={containerTypeOption}
                onChange={(option) => this.onContainerTypeChange(option)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="selfPickup">Self Pickup</label>
              <Select
                id="selfPickup"
                name="selfPickup"
                className="react-select"
                options={this.state.customerPickUpOptions}
                components={{ DropdownIndicator }}
                value={customerPickUpOption}
                onChange={(option) => this.onCustomerPickUpChange(option)}
              />
            </div>
          </div>
          <div className="right-col">
            <div className="form-group right-col-1" style={{ marginBottom: 0 }}>
              <label htmlFor="orderDate">Date Range</label>
              <Select
                id="orderDate"
                name="orderDate"
                className="react-select"
                // options={date_type_list.map(dateType => ({ label: dateType, value: dateType }))}
                options={this.state.dateFilterOptions}
                components={{ DropdownIndicator }}
                value={selectedDateFilter}
                onChange={(option) => this.onDateFilterOptionChange(option)}
                backspaceRemovesValue={true}
              />
              <div id="orderDateRange" className="order-date-range">
                <div
                  className="form-group"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <DatePicker
                    disabled={!this.state.selectedDateFilter}
                    className="rdate-picker tw-w-full"
                    selected={
                      dateMin === "Invalid date" ? null : new Date(dateMin)
                    }
                    onChange={this.onMinDateChange}
                    placeholderText="YYYY-MM-DD"
                  />
                </div>
                <p className="connect-text">To</p>
                <div
                  className="form-group"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <DatePicker
                    disabled={!this.state.selectedDateFilter}
                    className="rdate-picker tw-w-full"
                    selected={
                      dateMax === "Invalid date" ? null : new Date(dateMax)
                    }
                    onChange={this.onMaxDateChange}
                    placeholderText="YYYY-MM-DD"
                  />
                </div>
              </div>
            </div>
            <div className="form-group right-col-2">
              <label htmlFor="orderAddedBy">Added By</label>
              <Select
                id="orderAddedBy"
                name="orderAddedBy"
                className="react-select"
                options={added_by_list.map((addedBy) => ({
                  label: addedBy,
                  value: addedBy,
                }))}
                components={{ DropdownIndicator }}
                value={addedByOption}
                onChange={(option) => this.onAddedByChange(option)}
              />
            </div>
            <div className="form-group right-col-3">
              <div className="right-col-3-child">
                <label htmlFor="orderQuantity">Quantity Range</label>
                <div id="orderQuantity">
                  <div
                    className="form-group input-half"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <input
                      id="orderMin"
                      name="orderMin"
                      type="number"
                      placeholder="min"
                      className="input-width"
                      value={minQty}
                      onChange={(e) => this.onMinQtyChange(e)}
                      onKeyPress={(e) => this.onKeyPressNumberHandler(e)}
                    />
                  </div>
                  <p className="connect-text">To</p>
                  <div
                    className="form-group input-half"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <input
                      id="orderMax"
                      name="orderMax"
                      type="number"
                      placeholder="max"
                      className="input-width"
                      value={maxQty}
                      onChange={(e) => this.onMaxQtyChange(e)}
                      onKeyPress={(e) => this.onKeyPressNumberHandler(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr style={{ borderTop: "1px solid black" }} />
        <div className="tw-text-right">{`Found ${this.state.filteredOrders.length} / ${this.props.orders.length}`}</div>
        <div className="fitler-row">
          <button type="submit" className="filter-btn">
            Apply Filters
          </button>
          <button
            type="button"
            className="filter-btn"
            style={{
              border: "1px black solid",
              backgroundColor: "white",
            }}
            onClick={() => {
              setFilterOptions(null, this.props.orders);
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
