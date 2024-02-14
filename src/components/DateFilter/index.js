import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
// TODO: This component is only used in Orderlist that is not used anywhere; Remove this one
export default class DateFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
    };
  }

  clearFilter = () => {
    const { datepicker } = this.refs,
      { onChange } = this.props;

    this.setState({
      selected: null,
    });

    datepicker.setOpen(false);
    onChange("all");
  };

  handleChange = (date) => {
    const { onChange } = this.props;
    this.setState({
      selected: date,
    });

    onChange(date);
  };

  render() {
    const { selected } = this.state;
    return (
      <DatePicker
        className="datepicker-filter"
        selected={selected}
        ref="datepicker"
        todayButton={"Today"}
        onChange={this.handleChange}
        children={
          <input
            type="button"
            className="btn btn-primary filter-clear"
            value="Clear filter"
            onClick={this.clearFilter}
          />
        }
      />
    );
  }
}

const { func } = PropTypes;

DateFilter.propTypes = {
  onChange: func.isRequired,
};
