import React, { useState, useMemo } from "react";
import "./style.css";
import "react-datepicker/dist/react-datepicker.css";
import StepsCard from "./componennts/SetpsCard/SetpsCard";
import { doc_icon } from "../../../images";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import "@uppy/dashboard/dist/style.css";

import { PageDisable } from "../../../components";
import useCreateBulkOrder from "../../../hooks/Order/useCreateBulkOrder";
import { config } from "../../../../src/utils/conf";

import ConfirmationModal from "../../../components/Modal/ConfirmationModal";
import Button from "../../../components/Button/Button";

const PlaceBulkOrder = (props) => {
  const { createBulkOrder, createBulkOrderStatus } = useCreateBulkOrder();

  const steps = [
    {
      id: 1,
      name: "PrepareData",
      title: "Download & Prepare Data",
    },
    {
      id: 2,
      name: "UploadData",
      title: "Upload Data & Confirmation",
    },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(false);

  const uppy = useMemo(() => {
    return new Uppy({
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: [".xlsx"],
      },
    });
  }, []);

  uppy.on("file-added", () => {
    setSelectedFile(true);
  });

  uppy.on("file-removed", () => {
    setSelectedFile(false);
  });

  const handleChangeStep = (stepId) => {
    setCurrentStep(stepId);
  };

  const handelBackStep = () => {
    setCurrentStep((prevState) => prevState - 1);
  };

  const handelNextStep = () => {
    setCurrentStep((prevState) => prevState + 1);
  };

  const handelBulkOrderSubmit = (validations = true) => {
    const files = uppy.getFiles();
    if (!files.length) return;
    createBulkOrder({ file: files[0].data, validations });
  };

  const showErrorMessage =
    createBulkOrderStatus.isError &&
    createBulkOrderStatus?.error?.response?.status !== 409;

  const artifacts =
    createBulkOrderStatus?.error?.response?.status === 409
      ? createBulkOrderStatus?.error?.response?.data?.bulkSubmissionArtifacts
      : [];
  const duplicatedPoNumbersInResponse = [];
  const blankPoNumbersInResponse = [];
  artifacts.forEach((x) => {
    return x.bulkSubmissionOrders.forEach((o) => {
      if (o.bulkSubmissionAttempts.length === 0) return null;
      const attempt = o.bulkSubmissionAttempts[0];

      if (attempt.responseCode === 409) {
        const po = o.orderDetails[0].purchaseOrderNumber;
        if (po === "NONE") {
          blankPoNumbersInResponse.push(po);
        } else {
          duplicatedPoNumbersInResponse.push(po);
        }
      }
    });
  });

  return (
    <div id="place-order-page-new">
      <PageDisable
        disabled={createBulkOrderStatus.isLoading}
        message="Submitting bulk order, please wait"
      />

      <ConfirmationModal
        show={showErrorMessage}
        brand="danger"
        title="Bulk Order Upload Failed"
        onClose={createBulkOrderStatus.reset}
      >
        <p className="tw-text-justify">
          {" "}
          Please check the Item ID, Ship to Address or Requested Delivery Date
          format and retry.
        </p>
        <p className="tw-text-justify tw-break-all">
          {" "}
          Reach out to Customer Experience at &nbsp;
          <a
            href={`mailto:CustomerExperience@toscaltd.com@toscaltd.comsubject=Bulk Order Failure`}
          >
            CustomerExperience@toscaltd.com,
          </a>{" "}
          &nbsp; if the problem persists.
        </p>

        <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
          <Button
            brand="secondary"
            fullwidth="true"
            type="button"
            onClick={createBulkOrderStatus.reset}
          >
            OK
          </Button>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        show={createBulkOrderStatus.isSuccess}
        title="Request Submitted"
        onClose={() => createBulkOrderStatus.reset()}
      >
        <p>Your order has been submitted.</p>
        <p>
          * Please allow 1-2 minutes for new orders to be displayed in Order
          History.
        </p>

        <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
          <Button
            brand="secondary"
            type="button"
            fullwidth="true"
            onClick={() => props.history.push("/ordering")}
          >
            View Orders
          </Button>
          <Button
            brand="primary"
            type="button"
            fullwidth="true"
            onClick={() => createBulkOrderStatus.reset()}
          >
            Place Another Order
          </Button>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        show={
          duplicatedPoNumbersInResponse.length ||
          blankPoNumbersInResponse.length
        }
        brand="primary"
        title="Duplicate Purchase Order Numbers Found"
        onClose={createBulkOrderStatus.reset}
        size={"lg"}
      >
        {duplicatedPoNumbersInResponse.length > 0 && (
          <p className="tw-text-justify">
            The following Purchase Order Numbers are already in use.
            <br />
            <span className="">
              {duplicatedPoNumbersInResponse?.join(", ")}
            </span>
          </p>
        )}

        {blankPoNumbersInResponse.length > 0 && (
          <p className="tw-text-justify">
            {blankPoNumbersInResponse.length}{" "}
            {`${
              blankPoNumbersInResponse.length === 1
                ? "Order does not have PO Number entered."
                : "Orders do not have PO Numbers entered."
            }`}
          </p>
        )}

        <p className="tw-text-justify">Do you want to continue?</p>

        <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-2 tw-mt-6">
          <Button
            brand="secondary"
            type="button"
            fullwidth="true"
            onClick={() => handelBulkOrderSubmit(false)}
          >
            YES
          </Button>
          <Button
            brand="primary"
            type="button"
            fullwidth="true"
            onClick={createBulkOrderStatus.reset}
          >
            NO
          </Button>
        </div>
      </ConfirmationModal>

      <div className="tw-flex tw-pb-4">
        <div className="tw-flex-1">
          <div className="tw-flex tw-items-center tw-justify-between">
            <div className="header-info">
              <h3 className="">New Bulk Order Form</h3>
            </div>
          </div>
        </div>
      </div>

      <div>
        <StepsCard
          steps={steps}
          currentStep={currentStep}
          stepChange={handleChangeStep}
        >
          {/* Step - 01 */}
          {currentStep === 1 && (
            <>
              <div className="step-card-body">
                <p className="step-title">Prepare Data</p>

                <p className="step-title-2">
                  Step 1 - Please download the given excel file
                </p>
                <div className="step-container">
                  <a
                    href={`${
                      config.docUrl
                    }/hub/templates/bulk-upload.xlsx?id=${Date.now()}`}
                    className="download-btn"
                  >
                    <div className="iocn-wrapper">
                      <img
                        className="iocn"
                        src={doc_icon.xls}
                        alt="excel file"
                      />
                      <span className="iocn-caption">Template</span>
                    </div>

                    <p className="btn-discription">Download The Template</p>
                  </a>
                </div>

                <p className="step-title-2">
                  Step 2 - Fill in Delivery Appt. Date, Ship to Address,
                  Customer Pickup, Item ID, Quantity and PO Number as follows
                </p>
                <div className="step-container">
                  <img
                    className="sample-pic"
                    src={doc_icon.bulkSample}
                    alt="bulk data"
                  />
                </div>

                <div className="step-footer">
                  <div></div>
                  <button className="next" onClick={handelNextStep}>
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step - 02 */}
          {currentStep === 2 && (
            <>
              <div className="step-card-body">
                <p className="step-title">Upload Data</p>

                <p className="step-title-2">
                  Step 3 - Please upload the excel file that you have prepared
                </p>

                <div className="step-container-2 tw-relative">
                  <Dashboard
                    width="100%"
                    height="100%"
                    uppy={uppy}
                    locale={{
                      strings: {
                        dropHereOr: "Drag and Drop your Excel File",
                        dropPasteFiles: "%{browseFiles}",
                      },
                    }}
                    hideUploadButton={true}
                  />
                </div>
                <div className="step-footer">
                  <button className="back" onClick={handelBackStep}>
                    Back
                  </button>

                  <button
                    disabled={!selectedFile}
                    className={`next ${
                      selectedFile ? "btn-enable" : "btn-disable"
                    }`}
                    onClick={handelBulkOrderSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </>
          )}
        </StepsCard>
      </div>
    </div>
  );
};

export default PlaceBulkOrder;
