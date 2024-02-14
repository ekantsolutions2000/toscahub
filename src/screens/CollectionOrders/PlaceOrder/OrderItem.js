import moment from "moment";
import { ToolTip } from "../../../components";
import { icons } from "../../../images";
import { status_icons } from "../../../images";
import { SUBMITTED, REJECTED } from "../../../utils/APIStatus";
import PropTypes from "prop-types";
import "./styles.css";
import { useState, useEffect } from "react";

const OrderItem = ({ order, methods, isDeleteAvailable, isStatusVisible }) => {
  const { info, remove, edit } = icons;
  const { Received, Canceled, Processing } = status_icons;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []); //eslint-disable-line

  const resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  return (
    <tr className="hover:tw-bg-tosca-alice-blue hover:tw-text-gray-900">
      <td className="tw-px-3 tw-py-4 tw-border-b">{order.orderUIDetails.id}</td>
      <td className="tw-px-3 tw-py-4 tw-border-b">
        {order.orderUIDetails.loadingType.value.displayValue}
      </td>
      <td className="tw-px-3 tw-py-4 tw-border-b tw-whitespace-nowrap">
        {order.orderHeader.trailerNumber}
      </td>
      <td className="tw-px-3 tw-py-4 tw-border-b">
        <ToolTip
          disabled={windowWidth <= 768}
          content={
            <div className="rpc-hover">
              <table>
                <thead>
                  <tr>
                    <th className="th-topic">RPC Size</th>
                    <th>Number of Pallets</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.orderDetails?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="th-topic">{item.itemId}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          }
          config={{ arrow: false, theme: "light", placement: "left" }}
        >
          <img src={info} alt={"Rpc"} className="tw-w-8 tw-h-8" />
        </ToolTip>
      </td>
      <td className="tw-px-3 tw-py-4 tw-border-b">
        {moment(order.orderHeader.pickupTimeFrom).format("MM/DD/YYYY")}
      </td>
      <td className="tw-px-3 tw-py-4 tw-border-b">
        {order.orderHeader.purchaseOrderNumber}
      </td>
      <td className="tw-px-3 tw-py-4 tw-border-b">
        <ToolTip
          content={
            <div className="rpc-hover">
              {order.orderHeader.carrier.displayValue}
            </div>
          }
          config={{ arrow: false, theme: "light", placement: "left" }}
        >
          <p className="tw-m-0">{order.orderHeader.carrier.scac}</p>
        </ToolTip>
      </td>
      <td className="tw-px-3 tw-py-4 tw-border-b">
        <ToolTip
          disabled={windowWidth <= 768}
          content={
            <div className="rpc-hover">
              {order.orderHeader.additionalInstructions}
            </div>
          }
          config={{ arrow: false, theme: "light", placement: "left" }}
        >
          <p className="tw-m-0">
            {order.orderHeader.additionalInstructions.length > 20
              ? `${order.orderHeader.additionalInstructions.substring(
                  0,
                  20,
                )}...`
              : order.orderHeader.additionalInstructions}
          </p>
        </ToolTip>
      </td>
      {isStatusVisible && (
        <td className="tw-px-3 tw-py-4 tw-border-b">
          <ToolTip
            disabled={windowWidth <= 768}
            content={
              <div className="rpc-hover">
                {order.submitted === SUBMITTED
                  ? "Received"
                  : order.submitted === REJECTED
                  ? "Canceled"
                  : "Processing"}
              </div>
            }
            config={{ arrow: false, theme: "light", placement: "left" }}
          >
            <img
              src={
                order.submitted === SUBMITTED
                  ? Received
                  : order.submitted === REJECTED
                  ? Canceled
                  : Processing
              }
              alt={"Status"}
              className="tw-w-8 tw-h-8"
            />
          </ToolTip>
        </td>
      )}
      {isDeleteAvailable && (
        <td className="tw-px-3 tw-py-4 tw-border-b">
          {order.submitted !== SUBMITTED && (
            <img
              src={edit}
              onClick={() => methods.editRow(order)}
              alt={"Edit"}
              className="tw-w-8 tw-h-8 tw-cursor-pointer"
            />
          )}
        </td>
      )}
      {isDeleteAvailable && (
        <td className="tw-px-3 tw-py-4 tw-border-b">
          {order.submitted !== SUBMITTED && (
            <img
              src={remove}
              onClick={(e) => methods.remove(e, order.orderUIDetails.id)}
              alt={"Delete"}
              className="tw-w-8 tw-h-8 tw-cursor-pointer"
            />
          )}
        </td>
      )}
    </tr>
  );
};

OrderItem.propTypes = {
  order: PropTypes.object,
  methods: PropTypes.object,
  isDeleteAvailable: PropTypes.bool,
  isStatusVisible: PropTypes.bool,
};

export default OrderItem;
