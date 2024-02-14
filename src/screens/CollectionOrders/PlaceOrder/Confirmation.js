import React, { Component } from "react";
import Steps from "./CollectionOrderNavigation";
import { connect } from "react-redux";
import CollectionOrderList from "./CollectionOrderList";

export class Confirmation extends Component {
  submit = () => {
    this.props.methods.submit();
  };

  goBack = () => {
    console.log("Going Back");
    this.props.navigateTo(1);
  };

  isValidEntry = () => {
    return (
      this.props.formData.shipFrom.value !== "" &&
      this.props.formData.rpcItems.value.length !== 0
    );
  };

  enableSubmit = () => {
    return this.isValidEntry() && !this.props.submittingCO;
  };

  render() {
    let formData = { ...this.props.formData };

    let orderType = formData.orderType.options.find(
      (i) => i.value === formData.orderType.value.value,
    ).displayValue;

    return (
      <div className="tw-bg-white tw-mx-auto tw-p-2 tw-rounded tw-shadow-2xl md:tw-px-12">
        <div
          className={this.props.submittingCO ? "tw-pointer-events-none" : ""}
        >
          <Steps
            gotoStep={(step) => this.props.navigateTo(step)}
            activeStep={2}
          ></Steps>
        </div>
        <div className="tw-mt-16 tw-bg-tosca-gray tw-py-8 tw-px-4 tw-rounded-lg">
          <div className="md:tw-w-full md:tw-flex md:tw-items-center tw-mb-6">
            <p className="tw-m-0 ">
              <span className="tw-text-tosca-orange-700">Order Type:</span>
              &nbsp;&nbsp; {orderType}
            </p>
          </div>
          <CollectionOrderList
            orderList={this.props.orderList}
            methods={this.props.methods}
            isDeleteAvailable={false}
            isStatusVisible={true}
          />
        </div>
        <div className="tw-flex tw-justify-between tw-mt-4">
          <button
            disabled={this.props.submittedCO}
            onClick={this.goBack}
            className="tw-bg-tosca-blue hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded"
          >
            Back
          </button>
          <button
            onClick={this.submit}
            className="tw-bg-tosca-blue hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500"
          >
            {this.props.submittingCO ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    );
  }
}

const mapState = ({ collectionOrders }) => ({
  error: collectionOrders.error,
  submittingCO: collectionOrders.submitting,
  submittedCO: collectionOrders.submitted,
});

export default connect(mapState)(Confirmation);
