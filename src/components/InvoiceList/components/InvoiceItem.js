import React, { Component } from "react";
import PropTypes from "prop-types";
import { pagination_icons } from "../../../images";
import moment from "moment";
import { config } from "../../../utils/conf";
import _ from "lodash";

import useSession from "../../../hooks/Auth/useSession";

import useGetPodDocumentRef from "../../../hooks/Invoice/useGetPodDocumentRef";
import useGetFileBlob from "../../../hooks/useGetFileBlob";

const DownloadLink = function (props) {
  const { invoice } = props;
  const session = useSession();

  let podUrl = invoice.proofOfDeliveryRef;

  if (
    !invoice.proofOfDeliveryRef &&
    props.index === 0 &&
    session.customerId === `C1100058`
  ) {
    podUrl = `${config.transportationApiUrl}/v1/shipment/TEST-S110030618/documents`;
  }

  const {
    data: pod,
    isSuccess,
    isError,
  } = useGetPodDocumentRef({
    url: podUrl,
  });

  const { getFileBlob, getFileBlobStatus } = useGetFileBlob();

  const downloadFile = (blob) => {
    const fileUrl = window.URL.createObjectURL(new Blob([blob]));

    var dl = document.createElement("a");
    dl.setAttribute("href", fileUrl);
    dl.setAttribute(
      "download",
      `${_.snakeCase(invoice.invoice)}_proof_of_delivery.pdf`,
    );
    dl.click();
  };

  const handleDownload = (e) => {
    e.preventDefault();
    const url = `${config.baseApiUrl}${pod.proofOfDeliveryRef}`;
    getFileBlob({ url: url }).then((r) => {
      downloadFile(r.data);
    });
    e.stopPropagation();
  };

  return (
    <>
      {podUrl && isSuccess && (
        <a
          style={{ width: 320 }}
          className={`pod-btn btn btn-primary pull-right ${
            isError && "tw-opacity-60"
          }`}
          rel="noreferrer"
          target="_blank"
          href={`fileUrl`}
          onClick={handleDownload}
        >
          {getFileBlobStatus.isLoading
            ? "Loading Document... "
            : getFileBlobStatus.isError
            ? "Proof Of Delivery is not available"
            : "Download Proof Of Delivery"}
        </a>
      )}
    </>
  );
};

export default class InvoiceItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded,
    };
  }

  // need to remove .........................................
  handlePODClick = (e) => {
    const { invoice, requestProofOfDelivery } = this.props;
    e.preventDefault();
    e.stopPropagation();
    requestProofOfDelivery(invoice.invoice);
  };

  handelPODDownloadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.showMessagePopup();
  };

  formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
        10,
      ).toString();
      let j = i.length > 3 ? i.length % 3 : 0;

      return (
        "$" +
        negativeSign +
        (j ? i.substr(0, j) + thousands : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : "")
      );
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { invoice } = this.props;
    const date_format = "ll";
    return (
      <div
        className={`invoice-item${this.state.expanded ? " active" : ""}`}
        style={{
          backgroundColor: this.state.expanded
            ? "rgba(126,212,247, .1)"
            : "white",
        }}
        onClick={() => this.setState({ expanded: !this.state.expanded })}
      >
        <div className="invoice-header header-style" style={{ width: "100%" }}>
          <div className="grid-layout">
            <div className="header-style">
              <div className="header-item-inv">
                <div
                  className={
                    "header-label" +
                    (this.state.expanded ? "" : " lg:tw-hidden")
                  }
                >
                  Invoice No.
                </div>
                <div className="row-value">{invoice.invoice}</div>
              </div>
              <div className="header-item-inv">
                <div
                  className={
                    "header-label" +
                    (this.state.expanded ? "" : " lg:tw-hidden")
                  }
                >
                  Order No.
                </div>
                <div className="row-value">{invoice.salesOrder}</div>
              </div>
              <div className="header-item-inv">
                <div
                  className={
                    "header-label" +
                    (this.state.expanded ? "" : " lg:tw-hidden")
                  }
                >
                  Invoice Amt
                </div>
                <div className="row-value">
                  {this.formatMoney(invoice.invoiceAmount)}
                </div>
              </div>
              <div className="header-item-inv">
                <div
                  className={
                    "header-label" +
                    (this.state.expanded ? "" : " lg:tw-hidden")
                  }
                >
                  Due Date
                </div>
                <div className="row-value">
                  {moment(invoice.dueDate).isValid()
                    ? moment(invoice.dueDate).utcOffset(60).format(date_format)
                    : ""}
                </div>
              </div>
              <div className="header-item-inv">
                <div
                  className={
                    "header-label" +
                    (this.state.expanded ? "" : " lg:tw-hidden")
                  }
                >
                  PO No.
                </div>
                <div className="row-value">
                  {invoice.customerPurchaseOrderNumber}
                </div>
              </div>
              {/* <div className="header-item"> */}
              {/* <div
                  className={
                    "header-label" +
                    (this.state.expanded ? "" : " lg:tw-hidden")
                  }>
                  BOL No.
                </div> */}
              {/* <div className="row-value">{invoice.billOfLading}</div> */}
              {/* </div> */}
              <div className="header-item-inv">
                {this.state.expanded ? (
                  <img src={pagination_icons.UpArrow} alt="expand" />
                ) : (
                  <img src={pagination_icons.DownArrow} alt="collapse" />
                )}
              </div>
            </div>
            <div
              className="invoice-detail"
              style={{ display: this.state.expanded ? "flex" : "none" }}
            >
              <div
                className="header-style"
                style={{
                  marginTop: "10px",
                  paddingTop: "10px",
                }}
              >
                <div className="header-item-inv">
                  <div className="header-label">Invoice Date</div>
                  <div className="row-value">
                    {moment(invoice.invoiceDate).isValid()
                      ? moment(invoice.invoiceDate)
                          .utcOffset(60)
                          .format(date_format)
                      : ""}
                  </div>
                </div>
                <div className="header-item-inv">
                  <div className="header-label">Aging</div>
                  <div className="row-value">{invoice.aging}</div>
                </div>
                <div className="header-item-inv">
                  <div className="header-label">Open Amt</div>
                  <div className="row-value">
                    {this.formatMoney(invoice.openAmount)}
                  </div>
                </div>
                <div className="header-item-inv">
                  <div className="header-label">Current Amt</div>
                  <div className="row-value">
                    {this.formatMoney(invoice.currentAmount)}
                  </div>
                </div>
                <div className="header-item-inv">
                  <div className="header-label">Past Due Amt</div>
                  <div className="row-value">
                    {this.formatMoney(invoice.pastDue)}
                  </div>
                </div>
              </div>

              <div style={{ width: "100%" }}>
                {!config.podDownloadEnable && (
                  <input
                    type="button"
                    style={{ width: 320 }}
                    className="pod-btn btn btn-primary pull-right"
                    value="Request Proof of Delivery"
                    onClick={this.handlePODClick}
                  />
                )}
                {config.podDownloadEnable && (
                  <DownloadLink
                    handelPODDownloadClick={this.handelPODDownloadClick}
                    index={this.props.index}
                    invoice={invoice}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="order-history-details"></div> */}
      </div>
    );
  }
}

const { object, bool, func } = PropTypes;

InvoiceItem.propTypes = {
  invoice: object.isRequired,
  expanded: bool,
  requestProofOfDelivery: func.isRequired,
};
