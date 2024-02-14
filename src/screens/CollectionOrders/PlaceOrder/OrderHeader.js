import PropTypes from "prop-types";

const OrderHeader = ({ title }) => {
  return (
    <th
      className="tw-px-3 tw-py-3 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-medium tw-text-gray-900 tw-uppercase tw-tracking-wider tw-cursor-pointer hover:tw-bg-gray-300 tw-underline col-sort-header"
      style={{
        position: "relative",
      }}>
      <div className=" tw-inline-block">{title}</div>
    </th>
  );
};

OrderHeader.prototype = {
  title: PropTypes.string,
};

export default OrderHeader;
