import React, { Component } from "react";
import Footer from "./../Components/Footer";
import CreditApplicatiopnForm from "./CreditApplicationForm";
import _ from "lodash";

export default class CreditApplicationComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      partners: [],
      tradeReferences: [],
      addressValidationShow: false,
      addressValidationResult: [],
      rCount: 0,
    };
  }

  creditApplicationFormMethods = {
    addNewPartner: (form) => {
      this.setState(
        {
          partners: [
            ...this.state.partners,
            {
              id: this.state.partners.length + 1,
              name: form.afcPartnerName.value,
              email: form.afcPartnerEmail.value,
              address:
                form.afcPartnerAddressLine1.value +
                " " +
                form.afcPartnerAddressLine2.value,
              country: form.afcPartnerCountry.value.name,
              state: form.afcPartnerState.value.name,
              zipCode: form.afcPartnerZipCode.value,
              phone: `${form.afcPartnerMobileNumber.value}`,
              fax: `${form.afcPartnerFaxNumber.value}`,
            },
          ],
        },
        () => {
          form.afcPartnerartners.value = this.state.partners;
          this.creditApplicationFormMethods.aprtnerFormClear(form);
        },
      );
    },

    removePartner: (id, form) => {
      this.setState(
        {
          partners: this.state.partners.filter((i) => i.id !== id),
        },
        () => {
          form.afcPartnerartners.value = this.state.partners;
        },
      );
    },

    isValidNewPartner: (form) => {
      let isValid = false;

      form.afcPartnerName.value !== "" &&
      form.afcPartnerEmail.value !== "" &&
      form.afcPartnerAddressLine1.value &&
      form.afcPartnerAddressLine2.value &&
      form.afcPartnerZipCode.value !== "" &&
      form.afcPartnerMobileNumber.value !== ""
        ? (isValid = true)
        : (isValid = false);

      return isValid;
    },

    aprtnerFormClear: (form) => {
      form.afcPartnerName.value = "";
      form.afcPartnerEmail.value = "";
      form.afcPartnerAddressLine1.value = "";
      form.afcPartnerAddressLine2.value = "";
      form.afcPartnerCountry.value = "";
      form.afcPartnerState.value = "";
      form.afcPartnerZipCode.value = "";
      form.afcPartnerMobileNumber.value = "";
      form.afcPartnerFaxNumber.value = "";
    },

    addNewTradeReferences: (form) => {
      this.setState(
        {
          tradeReferences: [
            ...this.state.tradeReferences,
            {
              id: this.state.tradeReferences.length + 1,
              businessName: form.afcTradeBusinessName.value,
              email: form.afcTradeEmail.value,
              address:
                form.afcTradeAddressLine1.value +
                " " +
                form.afcTradeAddressLine2.value,
              country: form.afcTradeCountry.value.name,
              state: form.afcTradeState.value.name,
              city: form.afcTradeCity.value,
              tradeState: form.afcTradeState.value.name,
              zipCode: form.afcTradeZipCode.value,
              contactName:
                form.afcTradeFirstName.value +
                " " +
                form.afcTradeLastName.value,
              phone: `${form.afcTradeMobileNumber.value}`,
              fax: `${form.afcTradeFaxNumber.value}`,
            },
          ],
        },
        () => {
          form.afcTradeReferences.value = this.state.tradeReferences;
          this.creditApplicationFormMethods.TradeReferencFormClear(form);
        },
      );
    },

    removeTradeReferences: (id, form) => {
      this.setState(
        {
          tradeReferences: this.state.tradeReferences.filter(
            (i) => i.id !== id,
          ),
        },
        () => {
          form.afcTradeReferences.value = this.state.tradeReferences;
        },
      );
    },

    isValidNewTradeReferenc: (form) => {
      let isValid = false;

      form.afcTradeBusinessName.value !== "" &&
      form.afcTradeAddressLine1.value !== "" &&
      // form.afcTradeAddressLine2.value &&
      form.afcTradeCity.value !== "" &&
      form.afcTradeState.value !== "" &&
      form.afcTradeZipCode.value !== "" &&
      form.afcTradeFirstName.value !== "" &&
      form.afcTradeLastName.value !== "" &&
      form.afcTradeMobileNumber.value !== "" &&
      form.afcTradeEmail.value !== ""
        ? (isValid = true)
        : (isValid = false);

      return isValid;
    },

    TradeReferencFormClear: (form) => {
      form.afcTradeBusinessName.value = "";
      form.afcTradeAddressLine1.value = "";
      form.afcTradeAddressLine2.value = "";
      form.afcTradeCity.value = "";
      form.afcTradeCountry.value = "";
      form.afcTradeState.value = "";
      form.afcTradeZipCode.value = "";
      form.afcTradeFirstName.value = "";
      form.afcTradeLastName.value = "";
      form.afcTradeMobileNumber.value = "";
      form.afcTradeFaxNumber.value = "";
      form.afcTradeEmail.value = "";
    },
  };

  save = async () => {
    const form = this.props.form;
    let addresses = [
      {
        country: form.afcCountry.value.code,
        addressKey: "AFC",
        address1ine1: form.afcAddressLine1.value,
        address1ine2: form.afcAddressLine2.value,
        city: form.afcCity.value,
        state: form.afcState.value,
        zip5: form.afcZipCode.value,
        zip4: "",
      },
      {
        country: form.afcBankCountry.value.code,
        addressKey: "AFCB",
        address1ine1: form.afcBankAddressLine1.value,
        address1ine2: form.afcBankAddressLine2.value,
        city: form.afcBankCity.value,
        state: "",
        zip5: form.afcBankZipCode.value,
        zip4: "",
      },
    ];

    let promises = [];
    addresses.forEach((addressItem) => {
      if (addressItem.country === "US") {
        promises.push(this.props.getAddressValidation(addressItem));
      }
    });
    let result = await Promise.all(promises);
    if (result.find((item) => item.validate === false)) {
      this.setState({
        addressValidationShow: true,
        addressValidationResult: result.filter(
          (item) => item.validate === false,
        ),
      });
    } else {
      this.setState({
        addressValidationShow: false,
        addressValidationResult: [],
      });
      this.props.onSubmitForm();
    }
  };

  isFormEmpty = () => {
    let { form } = this.props;
    return form.afcDateOfApp.value === "" &&
      form.afcFormatedDateOfApp.value === "" &&
      form.afcCompanyName.value === "" &&
      form.afcCorporateId.value === "" &&
      form.afcAddressLine1.value === "" &&
      form.afcAddressLine2.value === "" &&
      form.afcCity.value === "" &&
      form.afcState.value === "" &&
      form.afcZipCode.value === "" &&
      form.afcEmail.value === "" &&
      form.afcWebSite.value === "" &&
      _.isEmpty(form.afcOwnership.value) &&
      form.afcPartnerAddressLine1.value === "" &&
      form.afcPartnerAddressLine2.value === "" &&
      form.afcPartnerZipCode.value === "" &&
      form.afcPartnerMobileNumber.value === "" &&
      form.afcPartnerFaxNumber.value === "" &&
      form.afcPartnerEmail.value === "" &&
      _.isEmpty(form.afcPartnerartners.value) &&
      form.afcBankName.value === "" &&
      form.afcBankAddressLine1.value === "" &&
      form.afcBankAddressLine2.value === "" &&
      form.afcBankCountry.value === "" &&
      form.afcBankCity.value === "" &&
      form.afcBankZipCode.value === "" &&
      form.afcBankOffcerNumber.value === "" &&
      form.afcBankMobileNumber.value === "" &&
      form.afcBankFaxNumber.value === "" &&
      form.afcBankEmail.value === "" &&
      form.afcTradeBusinessName.value === "" &&
      form.afcTradeAddressLine1.value === "" &&
      form.afcTradeAddressLine2.value === "" &&
      form.afcTradeCity.value === "" &&
      form.afcTradeState.value === "" &&
      form.afcTradeZipCode.value === "" &&
      form.afcTradeFirstName.value === "" &&
      form.afcTradeLastName.value === "" &&
      form.afcTradeMobileNumber.value === "" &&
      form.afcTradeFaxNumber.value === "" &&
      form.afcTradeEmail.value === "" &&
      _.isEmpty(form.afcTradeReferences.value) &&
      form.afcSignature.value === "" &&
      form.afcTitle.value === "" &&
      form.afcDateOfApplied.value === "" &&
      form.afcFormatedDateOfApplied.value === "" &&
      form.afcAplicantName.value === "" &&
      form.afcSocialSecurityNumber.value === ""
      ? true
      : false;
  };

  formClearForm = () => {
    this.props.form.clearData();
    this.props.form.afcOwnership.value = [];
  };
  render() {
    let { form, activeItemIndex } = this.props;
    if (this.state.rCount < 1) {
      this.setState({ rCount: this.state.rCount + 1 });
      this.props.form.clearError(["afcBankCity", "afcBankCountry"]);
    }

    return (
      <div>
        <CreditApplicatiopnForm
          form={form}
          countries={this.props.countries}
          onChangeCountry={this.props.onChangeCountry}
          onRemoveButtonClick={this.onRemoveCustomDetailsClick}
          onSaveButtonClick={this.onSaveButtonClick}
          getAddressValidation={this.props.getAddressValidation}
          creditApplicationFormMethods={this.creditApplicationFormMethods}
          partners={this.state.partners}
          tradeReferences={this.state.tradeReferences}
          addNew={this.state.addNew}
          id={this.state.currentId}
          shipingCountry={this.props.shippingDetailsForm.siCountry.value}
          addressValidationShow={this.state.addressValidationShow}
          addressValidationResult={this.state.addressValidationResult}
        />

        <Footer
          form={form}
          showBackButton={true}
          isSubmit={true}
          onContinueButtonClick={this.save}
          onBackButtonClick={() => this.props.navigateTo(activeItemIndex - 1)}
          onSaveLaterButtonClick={this.props.onSaveLater}
          showClearButton={true}
          clearBtnActive={this.isFormEmpty()}
          clearButtonClick={this.formClearForm}
        />
      </div>
    );
  }
}
