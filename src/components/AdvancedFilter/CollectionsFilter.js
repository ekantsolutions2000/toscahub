import React, { Component } from "react";
import Select from "react-select";
import _ from "lodash";
import {
  contentForm,
  content,
  formGroup,
  btn,
  DropdownIndicator,
} from "./index";
import FilterByText from "./../../utils/Filter/FilterByText";

export class CollectionsFilter extends Component {
  state = {
    initLoad: true,
    filteredOrders: [],
    filters: {
      customerDesc: null,
      containerType: null,
      quantity: null,
      addedBy: null,
    },
  };

  componentDidMount = () => {
    this.setState({ initLoad: false });
  };

  static getFilteredResult(props, state) {
    const { filters } = state;

    let query = FilterByText.filter(props.orders);

    if (filters.customerDesc) {
      query.where(
        (order) => order.organization_id === filters.customerDesc.value,
      );
    }

    if (filters.containerType) {
      query.where((order) => order.itemId === filters.containerType);
    }

    if (filters.quantity) {
      query.whereBetween("qty", filters.quantity);
    }

    if (filters.addedBy) {
      query.where((order) => order.user === filters.addedBy);
    }

    return query.get();
  }

  static getDerivedStateFromProps(props, state) {
    let filteredOrders = CollectionsFilter.getFilteredResult(props, state);

    if (!state.initLoad) {
      return { filteredOrders };
    }

    return {
      filters: {
        ...state.filters,
        ...props.filterOptions,
      },
      filteredOrders,
    };
  }

  onOrderCustomerChange = (option) => {
    this.setState({
      filters: {
        ...this.state.filters,
        customerDesc: option,
      },
    });
  };

  onContainerTypeChange = (option) => {
    this.setState({
      filters: { ...this.state.filters, containerType: option.value },
    });
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

  onKeyPressNumberHandler = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    let reg = /^\d+$/;
    if (!reg.test(keyValue)) {
      event.preventDefault();
    }
  };

  setFilter = (e) => {
    const { setFilterOptions } = this.props;
    e.preventDefault();
    const { target } = e;

    let filterObject = {
      customerDesc: this.state.filters.customerDesc
        ? {
            label: this.state.filters.customerDesc.label,
            value: this.state.filters.customerDesc.value,
          }
        : null,
      containerType: target.orderSize.value || null,
      quantity:
        target.orderMin.value || target.orderMax.value
          ? {
              min: target.orderMin.value ? target.orderMin.value : null,
              max: target.orderMax.value ? target.orderMax.value : null,
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

    const container_size_list = orders
        .map((order) => order.itemId)
        .reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, [])
        .sort(),
      added_by_list = orders
        .map((order) => order.user)
        .reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, [])
        .sort();

    const filters = this.state.filters;
    const containerTypeOption = filters.containerType
      ? { label: filters.containerType, value: filters.containerType }
      : null;
    const addedByOption = filters.addedBy
      ? { label: filters.addedBy, value: filters.addedBy }
      : null;
    const minQty = _.get(filters.quantity, "min", "") || "";
    const maxQty = _.get(filters.quantity, "max", "") || "";

    return (
      <form onSubmit={this.setFilter} style={contentForm}>
        <div
          className="filter-row"
          style={{
            content,
            display: "flex",
            flexFlow: "wrap",
            justifyContent: "space-between",
          }}
        >
          {/* <div className="filter-col" style={filterCol}>
            <div className="form-group" style={formGroup}>
              <label htmlFor="orderCustomer">Customer</label>
              <Select
                id="orderCustomer"
                name="orderCustomer"
                className="react-select"
                options={customer_list.map((customer) => ({
                  label: customer.organizationName,
                  value: customer.organizationId,
                }))}
                components={{ DropdownIndicator }}
                value={customerOption}
                onChange={(option) => this.onOrderCustomerChange(option)}
              />
            </div>
          </div> */}

          <div className="filter-col collection-left-col">
            <div className="form-group" style={formGroup}>
              <label htmlFor="orderSize">Container Size</label>
              <Select
                id="orderSize"
                name="orderSize"
                className="react-select"
                options={container_size_list.map((size) => ({
                  label: size,
                  value: size,
                }))}
                components={{ DropdownIndicator }}
                value={containerTypeOption}
                onChange={(option) => this.onContainerTypeChange(option)}
              />
            </div>
          </div>

          <div className="filter-col collection-center-col">
            <div
              className="form-group"
              style={{ formGroup, marginBottom: "5px" }}
            >
              <label htmlFor="orderQuantity">quantity Range</label>
              <div
                id="orderQuantity"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div
                  className="form-group"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <input
                    id="orderMin"
                    name="orderMin"
                    type="number"
                    style={{ width: "100%" }}
                    placeholder="min"
                    value={minQty}
                    onChange={(e) => this.onMinQtyChange(e)}
                    onKeyPress={(e) => this.onKeyPressNumberHandler(e)}
                  />
                </div>
                <p className="connect-text">To</p>
                <div
                  className="form-group"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <input
                    id="orderMax"
                    name="orderMax"
                    type="number"
                    style={{ width: "100%" }}
                    placeholder="max"
                    value={maxQty}
                    onChange={(e) => this.onMaxQtyChange(e)}
                    onKeyPress={(e) => this.onKeyPressNumberHandler(e)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="filter-col collection-right-col">
            <div className="form-group" style={formGroup}>
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
          </div>
        </div>
        <hr style={{ borderTop: "1px solid black" }} />
        <div className="tw-text-right">{`Found ${this.state.filteredOrders.length} / ${this.props.orders.length}`}</div>
        <div className="fitler-row">
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

export default CollectionsFilter;
