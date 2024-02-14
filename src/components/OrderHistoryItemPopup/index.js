import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import "./style.css";
import { config } from "../../utils/conf";
import TrackShipment from "../TrackShipment";
import Left from "./LeftButton";
import Right from "./RightButton";
import _ from "lodash";
import ImageContent from "../Inventory/ImageContent";
import * as userTypes from "./../../utils/UserTypes";
import useGetBulkOrderSourceArtifact from "../../hooks/Order/useGetBulkOrderSourceArtifact";
import useCancelSingleOrder from "../../hooks/Order/useCancelSingleOrder";
import useSession from "../../hooks/Auth/useSession";
import useGetCustomer from "../../hooks/CustomerProfile/useGetCustomer";
import { NotificationPopup } from "../../components";
import Tooltip from "../../components/Tooltip";
import ConfirmationModal from "../Modal/ConfirmationModal";
import Button from "../Button/Button";

import useGetFileBlob from "./../../hooks/useGetFileBlob";
const OrderHistoryItemPopup = (props) => {
  const orderInfo = props.orderInfo;
  const date_format = "ll";
  const { customerId, userType } = useSession();
  const [onSubmiting, setOnSubmiting] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [detailsViewToggle, setDetailsViewToggle] = useState(false); // detailsViewToggle == false ? 'details view' : 'edit view'
  const [trailerNo, setTrailerNo] = useState("");
  const [trailerNoErrorMessage, setTrailerNoErrorMessage] = useState("");

  const { getFileBlob } = useGetFileBlob();

  const handleTabeChange = (isEdit) => {
    setDetailsViewToggle(isEdit);
  };

  const downloadFile = (blob) => {
    const fileUrl = window.URL.createObjectURL(new Blob([blob]));

    var dl = document.createElement("a");
    dl.setAttribute("href", fileUrl);
    dl.setAttribute(
      "download",
      `${_.snakeCase(
        typeof orderInfo.orderNumber === "object"
          ? orderInfo.orderNumber.props.orgcontent
          : orderInfo.orderNumber,
      )}_bill_of_lading_ref.pdf`,
    );
    dl.click();
  };

  const [notification, setNotification] = useState({
    notificationShow: false,
    notificationMessage: "",
    notificationType: "", // danger, success
  });

  const { cancelSingleOrder, cancelSingleOrderStatus } = useCancelSingleOrder();

  const { data: bulkOrderFileData, isLoading } = useGetBulkOrderSourceArtifact({
    url: orderInfo.sourceArtifactRef,
  });
  const fileUrl = window.URL.createObjectURL(new Blob([bulkOrderFileData]));

  const { data: customerInfo } = useGetCustomer(customerId);

  useEffect(() => {
    if (cancelSingleOrderStatus.isError) {
      setNotification((preState) => ({
        ...preState,
        notificationShow: true,
        notificationMessage: cancelSingleOrderStatus.error.message,
        notificationType: "danger",
      }));
    }
  }, [cancelSingleOrderStatus.isError]); // eslint-disable-line

  useEffect(() => {
    if (cancelSingleOrderStatus.isSuccess) {
      setNotification((preState) => ({
        ...preState,
        notificationShow: true,
        notificationMessage: "Order has been canceled.",
        notificationType: "success",
      }));
      props.closeModal();
    }
  }, [cancelSingleOrderStatus.isSuccess]); // eslint-disable-line

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []); // eslint-disable-line

  const handleKeyUp = (e) => {
    const keys = {
      27: () => {
        e.preventDefault();
        props.closeModal();
      },
    };

    if (keys[e.keyCode]) {
      keys[e.keyCode]();
    }
  };

  const handleCancelOrder = () => {
    setShowConfirmationPopup(true);
  };

  const closeNotificationPopup = () => {
    setNotification((preState) => ({
      ...preState,
      notificationShow: false,
      notificationMessage: "",
      notificationType: "",
    }));
  };

  const confirmModelClose = () => {
    setShowConfirmationPopup(false);
  };

  const conformationYes = () => {
    cancelSingleOrder({ orderId: orderInfo.orderNumber });
    confirmModelClose();
    setTimeout(closeNotificationPopup, 8000);
  };

  const conformationNo = () => {
    confirmModelClose();
  };

  const useOutsideClick = (modal, arrows) => {
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (
          modal.current &&
          !modal.current.contains(e.target) &&
          arrows.current &&
          !arrows.current.contains(e.target)
        ) {
          props.outSideClick && props.closeModal();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [modal, arrows]);
  };

  const handleBillOfLadingRefDownload = (e) => {
    e.preventDefault();
    const url = `${orderInfo.billOfLadingRef}`;
    getFileBlob({ url: url }).then((r) => {
      downloadFile(r.data);
    });
    e.stopPropagation();
  };

  const modal = useRef();
  const arrows = useRef();

  useOutsideClick(modal, arrows);

  const onTrailerNoChange = (e) => {
    clearErrors("order-trailer-number");
    setTrailerNo(e.target.value);
  };

  const updateOrderWithTrailerNumber = (e) => {
    e.preventDefault();
    setOnSubmiting(true);

    if (isFormValidate()) {
      props.updateTrailerNumber(e, {
        trailerNumber: trailerNo,
        orderNumber: orderNumber,
      });
    }
  };

  const isFormValidate = () => {
    let validate = true;

    if (!trailerNo) {
      setTrailerNoErrorMessage("Please enter the trailer number");
      validate = false;
    }

    return validate;
  };

  const clearErrors = (formField) => {
    setTrailerNoErrorMessage(
      formField === "order-trailer-number" ? "" : trailerNoErrorMessage,
    );

    if (formField === "all") {
      setOnSubmiting(false);
      setTrailerNoErrorMessage("");
    }
  };

  useEffect(() => {
    const trailerNumber =
      props.orderInfo.trailerNumber?.props?.orgcontent ??
      props.orderInfo.trailerNumber;
    setTrailerNo(trailerNumber);
  }, [props.orderInfo]);

  const orderNumber =
    props.orderInfo.orderNumber?.props?.orgcontent ??
    props.orderInfo.orderNumber;

  return (
    <div
      className="info-overlay"
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        display: props.visible ? "" : "none",
      }}
    >
      <NotificationPopup
        message={notification.notificationMessage}
        visible={notification.notificationShow}
        closeModal={closeNotificationPopup}
        type={notification.notificationType}
      />

      <ConfirmationModal
        title="Confirmation Message!"
        brand="danger"
        size="sm"
        show={showConfirmationPopup}
        onClose={confirmModelClose}
      >
        <p>Do you want to cancel the order?</p>
        <div className="tw-flex tw-gap-2 tw-mt-6">
          <Button brand="danger" fullwidth="true" onClick={conformationYes}>
            Yes
          </Button>
          <Button brand="secondary" fullwidth="true" onClick={conformationNo}>
            No
          </Button>
        </div>
      </ConfirmationModal>

      <div ref={arrows}>
        <div id="left-arrow">
          <Left
            orders={props.orders}
            index={props.index}
            updateOrder={props.updateOrder}
          />
        </div>
        <div id="right-arrow">
          <Right
            orders={props.orders}
            index={props.index}
            updateOrder={props.updateOrder}
          />
        </div>
      </div>
      <div className="order-history-modal" ref={modal}>
        <div className="order-history-modal-top">
          <div className="data">
            <div className="top-left">
              <div className="data-column">
                <span className="name">STATUS</span>
                <span className="value">{orderInfo.statusDesc}</span>
              </div>
              <div className="data-column">
                <span className="name">QUANTITY</span>
                <span className="value">{orderInfo.quantity}</span>
              </div>
              <div className="data-column">
                <span className="name">RPC SIZE</span>
                <span className="value">{orderInfo.containerType}</span>
              </div>
            </div>
            <div className="top-middle">
              <div className="data-column">
                <span className="name">ORDER NO</span>
                <span className="value">{orderInfo.orderNumber}</span>
              </div>
              <div className="data-column">
                <span className="name">
                  {props.user.UserType === "OUTBOUND" ? "PO NO" : "SHIPPER REF"}
                </span>
                <span className="value">
                  {orderInfo.purchaseOrderNumber
                    ? orderInfo.purchaseOrderNumber
                    : "N/A"}
                </span>
              </div>
              {orderInfo.orderType === "Inbound" && (
                <div className="data-column">
                  <span className="name">SHIP FROM LOCATION</span>
                  <span className="value">
                    {orderInfo.shipFromLocationName}
                  </span>
                </div>
              )}
              {orderInfo.trailerNumber !== undefined &&
              orderInfo.trailerNumber !== "" &&
              orderInfo.customerPickUp === undefined ? (
                <div className="data-column">
                  <span className="name">TRAILER NO</span>
                  <span className="value">{orderInfo.trailerNumber}</span>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="top-right">
              <div id="close-button" onClick={() => props.closeModal()}>
                <div className="remove pull-right">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </div>
              </div>
              <div id="reorder-col">
                {props.user.UserType === userTypes.OUTBOUND &&
                  orderInfo.expedited && (
                    <div className="expedited-label-wrapper self-pickup-value-1">
                      <div className="expedited-label">Expedited Order</div>
                    </div>
                  )}

                {orderInfo.sourceArtifactRef ? (
                  <div className="self-pickup">
                    <div className="self-pickup-value self-pickup-value-1">
                      BULK ORDER
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {orderInfo.customerPickUp ? (
                  <div className="self-pickup">
                    <div className="self-pickup-value">SELF PICKUP</div>
                  </div>
                ) : (
                  ""
                )}

                {orderInfo.customerPickUp !== undefined ? (
                  <div
                    className="button-bottom-right"
                    style={{
                      display: props.reorder ? "" : "none",
                    }}
                  >
                    <div className="reorder-button hover:tw-bg-tosca-blue-light">
                      <Link
                        className="tw-no-underline hover:tw-text-gray-900"
                        to={{
                          pathname: "/ordering/new",
                          state: {
                            copy: {
                              ...orderInfo,
                              orderNumber: orderInfo.orderNumberRaw,
                              purchaseOrderNumber: _.isObject(
                                orderInfo.purchaseOrderNumber,
                              )
                                ? orderInfo.purchaseOrderNumber.props.orgcontent
                                : orderInfo.purchaseOrderNumber,
                            },
                          },
                        }}
                      >
                        REORDER
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="button-bottom-right">
                    <div className="reorder-button hover:tw-bg-tosca-blue-light">
                      <Link
                        className="tw-no-underline hover:tw-text-gray-900"
                        to={{
                          pathname: "/collection-orders/new",
                          state: {
                            copy: {
                              ...orderInfo,
                              orderNumber: orderInfo.orderNumberRaw,
                              purchaseOrderNumber: _.isObject(
                                orderInfo.purchaseOrderNumber,
                              )
                                ? orderInfo.purchaseOrderNumber.props.orgcontent
                                : orderInfo.purchaseOrderNumber,
                            },
                          },
                        }}
                      >
                        REORDER
                      </Link>
                    </div>
                  </div>
                )}

                {props.user.UserType === userTypes.INBOUND && (
                  <div className="button-bottom-right">
                    <div className="reorder-button hover:tw-bg-tosca-blue-light">
                      <Link
                        className="tw-no-underline hover:tw-text-gray-900"
                        to={{
                          pathname: "/collection-orders/new",
                          state: {
                            copy: {
                              ...orderInfo,
                            },
                          },
                        }}
                      >
                        REORDER
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {props.user.UserType === userTypes.INBOUND && orderInfo.editable && (
          <div className="tab">
            <div
              className={`tab-title tab-view ${
                detailsViewToggle === false ? "tab-active" : ""
              }`}
              onClick={() => handleTabeChange(false)}
            >
              View
            </div>
            <span></span>
            <div
              className={`tab-title tab-edit ${
                detailsViewToggle === false ? "" : "tab-active"
              }`}
              onClick={() => handleTabeChange(true)}
            >
              Edit
            </div>
          </div>
        )}

        {detailsViewToggle === false ? (
          <div id="order-history-modal-bottom">
            <div className="top">
              <div className="left">
                <div className="data-column">
                  <span className="name">ORDER DATE</span>
                  <span className="value">
                    {moment(orderInfo.orderDate).isValid()
                      ? moment(orderInfo.orderDate).format(date_format)
                      : ""}
                  </span>
                </div>
                <div className="data-column">
                  <span className="name">REQUESTED DELIVERY</span>
                  <span className="value">
                    {moment(orderInfo.requestedDeliveryDate).isValid()
                      ? moment(orderInfo.requestedDeliveryDate).format(
                          date_format,
                        )
                      : ""}
                  </span>
                </div>
                <div className="data-column">
                  <span className="name">SCHEDULED SHIP DATE</span>
                  <span className="value">
                    {orderInfo.scheduledShipDate &&
                    moment(orderInfo.scheduledShipDate).isValid()
                      ? moment(orderInfo.scheduledShipDate).format(date_format)
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="right">
                <div className="tw-relative tw-w-full">
                  <ImageContent itemId={orderInfo.containerType} popUp={true} />
                </div>
              </div>
            </div>

            <div className="bottom">
              <div
                className="left"
                style={{
                  width:
                    orderInfo.customerPickUp === undefined ? "100%" : "70%",
                }}
              >
                <div className="data-column">
                  <span className="name">
                    {orderInfo.customerPickUp !== undefined
                      ? "SHIP TO LOCATION"
                      : "SHIP FROM LOCATION"}
                  </span>
                  <span className="value">{orderInfo.shipToLocation}</span>
                </div>
                {orderInfo.additionalInformation ? (
                  <div className="data-column">
                    <span className="name">ADDITIONAL INSTRUCTIONS</span>
                    <span className="value">
                      {orderInfo.additionalInformation}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                <div className="data-column">
                  <span className="name">ADDED BY</span>
                  <span className="value">{orderInfo.addedBy}</span>
                </div>
                {orderInfo.carrierName &&
                orderInfo.customerPickUp === undefined ? (
                  <div className="data-column">
                    <span className="name">CARRIER</span>
                    <span className="value">{orderInfo.carrierName}</span>
                  </div>
                ) : (
                  ""
                )}

                {config.bulkOrderEnable &&
                  props.user.UserType === userTypes.OUTBOUND &&
                  bulkOrderFileData && (
                    <div className="data-column">
                      <span className="name"></span>
                      {!isLoading && (
                        <a
                          href={fileUrl}
                          download={`${_.snakeCase(
                            customerInfo.customerName,
                          )}_bulk_upload.xlsx`}
                          className="link-value"
                        >
                          Download the uploaded file
                        </a>
                      )}
                    </div>
                  )}

                {props.user.UserType === userTypes.INBOUND &&
                  orderInfo.billOfLadingRef && (
                    <div className="data-column">
                      <span className="name"></span>
                      <div
                        onClick={handleBillOfLadingRefDownload}
                        className="link-value"
                      >
                        Download Bill Of Lading
                      </div>
                    </div>
                  )}

                <div>
                  {orderInfo.cancellable && userType === userTypes.OUTBOUND && (
                    <div
                      onClick={handleCancelOrder}
                      className="cancel-btn tw-text-gray-700"
                    >
                      {cancelSingleOrderStatus.isLoading === true
                        ? "Canceling..."
                        : "Cancel Order"}
                    </div>
                  )}
                </div>
              </div>

              {orderInfo.customerPickUp !== undefined ? (
                <div
                  className="right"
                  style={{
                    width: orderInfo.customerPickUp === undefined ? "" : "30%",
                  }}
                >
                  {config.showTransplaceIcon ? (
                    <div id="track-ship">
                      <TrackShipment
                        PONo={orderInfo.purchaseOrderNumber}
                        referenceNo={`${
                          _.get(orderInfo, "orderNumberRaw", "")
                            .toString()
                            .split(".")[0]
                        }`}
                        isActive={!!orderInfo.billOfLadingRaw}
                        width={"64px"}
                        height={"64px"}
                        padding={"0"}
                      />
                      <span className="ship">TRACK SHIPMENT</span>
                    </div>
                  ) : null}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <div id="order-history-modal-bottom">
            {/* this is edit tab */}
            <form onSubmit={updateOrderWithTrailerNumber}>
              <div className="top">
                <div className="form-group input-text update-form">
                  <label htmlFor="trailer-no">TRAILER NO :</label>
                  <Tooltip
                    content={trailerNoErrorMessage}
                    show={onSubmiting === true && trailerNoErrorMessage}
                    config={{
                      zIndex: 100,
                      theme: "error",
                      trigger: "manual",
                      hideOnClick: false,
                      placement: "top-end",
                    }}
                  >
                    <input
                      id="order-trailer-number"
                      className="css-bg1rzq-control"
                      name="first-name"
                      type="text"
                      style={
                        onSubmiting === true && trailerNoErrorMessage
                          ? { border: "1px solid red" }
                          : null
                      }
                      value={trailerNo}
                      onChange={(e) => onTrailerNoChange(e)}
                    />
                  </Tooltip>
                </div>
              </div>

              <div className="bottom" style={{ justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  className="btn button"
                  style={{ backgroundColor: "#FF8B2B", color: "#fff" }}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryItemPopup;
