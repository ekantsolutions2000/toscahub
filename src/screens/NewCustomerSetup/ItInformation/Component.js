import React, { Component } from "react";
import Footer from "./../Components/Footer";
import ItInforForm from "./ItInforForm";
import _ from "lodash";

export default class ItInformationComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentId: 1,
      destinations: [],
    };
  }

  navigateTo = (step) => {
    if (step < 1 || this.props.form.isFormValid) this.props.navigateTo(step);
  };

  itInformationFormMethods = {
    AddNewDestination: (form) => {
      this.setState(
        {
          destinations: [
            ...this.state.destinations,
            {
              id: this.state.destinations.length + 1,
              finalLocation: form.itInforFinalLocation.value,
              destinationCity: form.itInforDistributionCity.value,
              destinationState: form.itInforDistributionState.value,
            },
          ],
        },
        () => {
          form.itInforDestinations.value = this.state.destinations;
          this.itInformationFormMethods.destinationFormClear(form);
        },
      );
    },
    removeDestination: (id, form) => {
      this.setState(
        {
          destinations: this.state.destinations.filter((i) => i.id !== id),
        },
        () => {
          form.itInforDestinations.value = this.state.destinations;
        },
      );
    },

    destinationFormClear: (form) => {
      form.itInforFinalLocation.value = "";
      form.itInforDistributionCity.value = "";
      form.itInforDistributionState.value = "";
    },

    isValidNewDestination: (form) => {
      let isValid = false;

      form.itInforFinalLocation.value &&
      form.itInforDistributionCity.value &&
      form.itInforDistributionState.value
        ? (isValid = true)
        : (isValid = false);

      return isValid;
    },
  };

  isFormEmpty = () => {
    let { form } = this.props;
    return form.itInforFirstName.value === "" &&
      form.itInforLastName.value === "" &&
      form.itInforEmail.value === "" &&
      form.itInforPhoneNumber.value === "" &&
      _.isEmpty(form.itInforRpcReportingCapability.value) &&
      form.itInforReportingFirstName.value === "" &&
      form.itInforReportingLastName.value === "" &&
      form.itInforReportingEmail.value === "" &&
      form.itInforFinalLocation.value === "" &&
      form.itInforDistributionCity.value === "" &&
      form.itInforDistributionState.value === "" &&
      _.isEmpty(form.itInforDestinations.value)
      ? true
      : false;
  };

  formClearForm = () => {
    this.props.form.clearData();
    this.props.form.itInforRpcReportingCapability.value = [];
  };

  render() {
    let { form, activeItemIndex } = this.props;
    return (
      <div>
        <ItInforForm
          form={form}
          id={this.state.currentId}
          itInforFormMethods={this.itInformationFormMethods}
        />

        <Footer
          form={form}
          showBackButton={true}
          onSaveLaterButtonClick={this.props.onSaveLater}
          onBackButtonClick={() => this.props.navigateTo(activeItemIndex - 1)}
          onContinueButtonClick={() => this.navigateTo(activeItemIndex + 1)}
          showClearButton={true}
          clearBtnActive={this.isFormEmpty()}
          clearButtonClick={this.formClearForm}
        />
      </div>
    );
  }
}
