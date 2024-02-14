import React, { Component } from "react";
import Moment from "moment";
export default class HoursRowComponent extends Component {
  render() {
    let { hour } = this.props;
    return (
      <div className={hour.id > 1 ? "tw-border-t" : null}>
        <div className="tw-inline-block tw-w-5/12 tw-p-2">
          {hour.days.map((day, index) => (
            <span
              className="tw-inline-block tw-p-2 tw-bg-gray-200 tw-m-1 tw-rounded-sm"
              key={index}>
              {day.value}
            </span>
          ))}
        </div>
        <div className="tw-inline-block tw-p-2 tw-pl-6 tw-w-3/12">
          {Moment(hour.from).format("hh:mm A")}
        </div>
        <div className="tw-inline-block tw-p-2 tw-pl-4 tw-w-3/12">
          {Moment(hour.to).format("hh:mm A")}
        </div>
        <div className="tw-inline-block tw-w-1/12 ">
          <button
            type="button"
            onClick={() => this.props.onRemoveHoursClick(hour)}
            className="tw-mr-4 tw-bg-white hover:tw-bg-gray-100 tw-text-gray-900 tw-font-bold tw-py-2 tw-px-4 tw-border tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500">
            X
          </button>
        </div>
      </div>
    );
  }
}
