import React, { Component } from "react";
import Footer from "./../Components/Footer";
import CustomsForm from "./CustomsForm";
import CustomsTile from "./CustomsTile";
import DeepClone from "lodash/cloneDeep";
import moment from "moment";

export default class CustomDetailsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customsDetails: [],
      showForm: false,
      addNew: true,
      newForm: JSON.parse(JSON.stringify(this.props.form)),
      currentId: 1,
      customAddressValidation: false,
      customAddressValidationMessage: "",
      brokerOperationHours: [],
      pickedOperationDays: [],

      brokerLeadTimeHours: [],
      pickedLeadTimeDays: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state !== prevState) {
      this.props.setCustomsDetails(this.state);
    }

    // validation addjust with export country == Mexico
    if (this.state !== prevState) {
      if (this.props.form.cbiCountry.value.code !== "MX") {
        this.props.form.eeuFirstName.rules = "";
        this.props.form.eeuLastName.rules = "";
        this.props.form.eeuStreetAddressLine1.rules = "";
        this.props.form.eeuStreetAddressLine2.rules = "";
        this.props.form.eeuCity.rules = "";
        this.props.form.eeuCountry.rules = "";
        this.props.form.eeuState.rules = "";
        this.props.form.eeuZipCode.rules = "";
        this.props.form.eeuCountryCode.rules = "";
        this.props.form.eeuContactFirstName.rules = "";
        this.props.form.eeuContactLastName.rules = "";
        this.props.form.eeuPhoneNumber.rules = "";
        this.props.form.eeuEmail.rules = "";
      } else {
        this.props.form.eeuFirstName.rules = "required";
        this.props.form.eeuLastName.rules = "required";
        this.props.form.eeuStreetAddressLine1.rules = "required";
        this.props.form.eeuStreetAddressLine2.rules = "";
        this.props.form.eeuCity.rules = "required";
        this.props.form.eeuCountry.value = "Mexico";
        this.props.form.eeuCountry.rules = "required";
        this.props.form.eeuState.rules = "required";
        this.props.form.eeuZipCode.rules = "required|minLen:2|maxLen:10";
        this.props.form.eeuCountryCode.rules =
          "required|number|minLen:2|maxLen:4";
        this.props.form.eeuContactFirstName.rules = "required";
        this.props.form.eeuContactLastName.rules = "required";
        this.props.form.eeuPhoneNumber.rules =
          "required|number|minLen:2|maxLen:15";
        this.props.form.eeuEmail.rules = "required|email";
      }
    }
  }

  componentDidMount() {
    this.setState({ ...this.props.customsDetailsState });
  }
  navigateTo = (step) => {
    let addressMissingCountries = [];

    this.props.shippingDetailsState.shippingAddresses.forEach(
      (shippingAddress) => {
        if (shippingAddress.form.siCountry.value.requiresBroker === true) {
          if (
            this.state.customsDetails.filter(
              (i) =>
                i.form.cbiCountry.value.code ===
                shippingAddress.form.siCountry.value.code,
            ).length === 0
          ) {
            addressMissingCountries.push(
              shippingAddress.form.siCountry.value.name,
            );
          }
        }
      },
    );

    if (addressMissingCountries.length > 0) {
      this.setState({
        customAddressValidation: true,
        customAddressValidationMessage: `Please add customs detail for ${addressMissingCountries.toString()}.`,
      });
    } else {
      this.setState({
        customAddressValidation: false,
        customAddressValidationMessage: "",
      });
      if (step < 1 || this.props.form.isFormValid) this.props.navigateTo(step);
    }
  };

  clearForm = () => {
    for (var field in this.props.form) {
      if (
        this.props.form.hasOwnProperty(field) &&
        this.props.form[field].hasOwnProperty("value")
      ) {
        this.props.form[field].value = "";

        this.setState({
          pickedOperationDays: [],
          brokerOperationHours: [],
          pickedLeadTimeDays: [],
          brokerLeadTimeHours: [],
        });
      }
    }
  };

  onNewCustomsDetails = () => {
    this.clearForm();
    this.setState({
      showForm: true,
      addNew: true,
      currentId: this.state.customsDetails.length + 1,
      customAddressValidation: false,
      customAddressValidationMessage: "",
    });
  };

  onRemoveCustomDetailsClick = (id) => {
    if (!this.state.addNew) {
      this.setState({
        customsDetails: this.state.customsDetails.filter(function (
          value,
          index,
          arr,
        ) {
          return value.id !== id;
        }),
      });
    }

    this.clearForm();

    this.setState({
      showForm: false,
    });
  };

  onSaveButtonClick = (addNew, id, form) => {
    if (addNew) {
      this.setState({
        customsDetails: [
          ...this.state.customsDetails,
          {
            id: this.state.customsDetails.length + 1,
            form: DeepClone(form),
            brokerOperationHours: this.state.brokerOperationHours,
            brokerLeadTimeHours: this.state.brokerLeadTimeHours,
          },
        ],
      });
    } else {
      const elementsIndex = this.state.customsDetails.findIndex(
        (data) => data.id === id,
      );
      let customsArray = [...this.state.customsDetails];
      customsArray[elementsIndex] = {
        id: id,
        form: DeepClone(form),
        brokerOperationHours: this.state.brokerOperationHours,
        brokerLeadTimeHours: this.state.brokerLeadTimeHours,
      };
      this.setState({ customsDetails: customsArray });
    }

    this.setState({
      showForm: false,
      customAddressValidation: false,
      customAddressValidationMessage: "",
    });
  };

  onEditCustomsDetailsClick = (
    id,
    form,
    brokerOperationHours,
    brokerLeadTimeHours,
  ) => {
    for (var field in this.props.form) {
      if (
        this.props.form.hasOwnProperty(field) &&
        this.props.form[field].hasOwnProperty("value")
      ) {
        this.props.form[field].value = form[field].value;
      }
    }

    const elementsIndex = this.state.customsDetails.findIndex(
      (data) => data.id === id,
    );
    let customsArray = [...this.state.customsDetails];
    customsArray[elementsIndex] = {
      id: id,
      form: DeepClone(form),
      brokerOperationHours: brokerOperationHours,
      brokerLeadTimeHours: brokerLeadTimeHours,
    };

    this.setState({
      customsDetails: customsArray,
      showForm: true,
      addNew: false,
      currentId: id,
      brokerOperationHours: brokerOperationHours,
      brokerLeadTimeHours: brokerLeadTimeHours,
    });
    this.props.form._validateForm();
  };

  isFormEmpty = () => {
    let { form } = this.props;
    return form.cbicusExportEndUserCountry.value === "" &&
      form.cbiBrokerCompanyName.value === "" &&
      form.cbiBrokerAddressLine1.value === "" &&
      form.cbiBrokerFirstName.value === "" &&
      form.cbiBrokerLastName.value === "" &&
      form.cbiPhoneNumber.value === "" &&
      form.cbiMobileNumber.value === "" &&
      form.cbiEmail.value === "" &&
      form.eeuFirstName.value === "" &&
      form.eeuLastName.value === "" &&
      form.eeuStreetAddressLine1.value === "" &&
      form.eeuStreetAddressLine2.value === "" &&
      form.eeuCity.value === "" &&
      // form.eeuCountry.value === "" && // this field can not clear bcz its default selected.
      form.eeuState.value === "" &&
      form.eeuZipCode.value === "" &&
      form.eeuCountryCode.value === "" &&
      form.eeuContactFirstName.value === "" &&
      form.eeuContactLastName.value === "" &&
      form.eeuPhoneNumber.value === "" &&
      form.eeuEmail.value === ""
      ? true
      : false;
  };

  brokerOperationMethods = {
    operationDayDropdownFilter: (options) => {
      return options.filter((day) => {
        return !this.state.pickedOperationDays.some(
          (pickedDay) => day.value === pickedDay,
        );
      });
    },

    clearBrokerOperationHoursForm: (form) => {
      form.cbiOperationDays.value = "";
      form.cbiOperationFromTime.value = null;
      form.cbiOperationToTime.value = null;
    },

    onClickAddOperationHours: (form) => {
      this.setState(
        {
          brokerOperationHours: [
            ...this.state.brokerOperationHours,
            {
              id: this.state.brokerOperationHours.length + 1,
              days: form.cbiOperationDays.value,
              from: form.cbiOperationFromTime.value,
              fromTime: moment(form.cbiOperationFromTime.value).format(
                "hh:mm A",
              ),
              to: form.cbiOperationToTime.value,
              toTime: moment(form.cbiOperationToTime.value).format("hh:mm A"),
            },
          ],
          pickedOperationDays:
            this.brokerOperationMethods.getPickedOperationDays(
              form.cbiOperationDays.value,
            ),
        },
        () => {
          form.cbiOperationHours.value = this.state.brokerOperationHours;
        },
      );
      this.brokerOperationMethods.clearBrokerOperationHoursForm(form);
    },

    getPickedOperationDays: (cbiOperationDays) => {
      return this.state.pickedOperationDays.concat(
        cbiOperationDays.map((day) => {
          return day["value"].toString();
        }),
      );
    },

    onRemoveBrokerOperationHoursClick: (hour) => {
      let pickedOperationDays = this.state.pickedOperationDays;
      hour.days.map((d, i) => {
        pickedOperationDays = pickedOperationDays.filter(function (
          value,
          index,
          arr,
        ) {
          return value !== d.value;
        });
        return true;
      });

      this.setState({
        pickedOperationDays: pickedOperationDays,
        brokerOperationHours: this.state.brokerOperationHours.filter(function (
          value,
          index,
          arr,
        ) {
          return value.id !== hour.id;
        }),
      });
    },

    LeadTimeDayDropdownFilter: (options) => {
      return options.filter((day) => {
        return !this.state.pickedLeadTimeDays.some(
          (pickedDay) => day.value === pickedDay,
        );
      });
    },

    onClickAddLeadTimeHours: (form) => {
      this.setState(
        {
          brokerLeadTimeHours: [
            ...this.state.brokerLeadTimeHours,
            {
              id: this.state.brokerLeadTimeHours.length + 1,
              days: form.cbiLeadTimeDays.value,
              from: form.cbiLeadTimeFromTime.value,
              fromTime: moment(form.cbiLeadTimeFromTime.value).format(
                "hh:mm A",
              ),
              to: form.cbiLeadTimeToTime.value,
              toTime: moment(form.cbiLeadTimeToTime.value).format("hh:mm A"),
            },
          ],
          pickedLeadTimeDays: this.brokerOperationMethods.getPickedLeadTimeDays(
            form.cbiLeadTimeDays.value,
          ),
        },
        () => {
          form.cbiLeadTimeHours.value = this.state.brokerLeadTimeHours;
        },
      );
      this.brokerOperationMethods.clearBrokerLeadTimeHoursForm(form);
    },

    getPickedLeadTimeDays: (cbiLeadTimeDays) => {
      return this.state.pickedLeadTimeDays.concat(
        cbiLeadTimeDays.map((day) => {
          return day["value"].toString();
        }),
      );
    },

    clearBrokerLeadTimeHoursForm: (form) => {
      form.cbiLeadTimeDays.value = "";
      form.cbiLeadTimeFromTime.value = null;
      form.cbiLeadTimeToTime.value = null;
    },

    onRemoveBrokerLeadTimeHoursClick: (hour) => {
      let pickedLeadTiomeDays = this.state.pickedLeadTimeDays;
      hour.days.map((d, i) => {
        pickedLeadTiomeDays = pickedLeadTiomeDays.filter(function (
          value,
          index,
          arr,
        ) {
          return value !== d.value;
        });
        return true;
      });

      this.setState({
        pickedLeadTimeDays: pickedLeadTiomeDays,
        brokerLeadTimeHours: this.state.brokerLeadTimeHours.filter(function (
          value,
          index,
          arr,
        ) {
          return value.id !== hour.id;
        }),
      });
    },
  };

  render() {
    let { form, activeItemIndex } = this.props;

    return (
      <div>
        {this.state.showForm ? (
          <CustomsForm
            form={form}
            countries={this.props.countries}
            onChangeCountry={this.props.onChangeCountry}
            onRemoveButtonClick={this.onRemoveCustomDetailsClick}
            onSaveButtonClick={this.onSaveButtonClick}
            getAddressValidation={this.props.getAddressValidation}
            addNew={this.state.addNew}
            id={this.state.currentId}
            shipingCountry={this.props.shippingDetailsForm.siCountry.value}
            brokerOperationMethods={this.brokerOperationMethods}
            brokerOperationHours={this.state.brokerOperationHours}
            brokerLeadTimeHours={this.state.brokerLeadTimeHours}
          />
        ) : (
          <>
            <button
              type="button"
              onClick={this.onNewCustomsDetails}
              className="tw-relative tw-bg-tosca-orange hover:tw-bg-tosca-orange-500 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500 tw-mb-8"
            >
              + Add Customs Details
            </button>
          </>
        )}

        {this.state.customsDetails.length ? (
          <div className="tw-w-full tw-inline-block">
            {this.state.customsDetails.map((data, index) => (
              <CustomsTile
                key={data.id}
                data={data}
                onRemoveButtonClick={this.onRemoveCustomDetailsClick}
                onEditCustomsDetailsClick={this.onEditCustomsDetailsClick}
              />
            ))}
          </div>
        ) : null}

        {this.state.customAddressValidation && (
          <div className="tw-mb-4">
            <div className="validation-error-message ">
              {this.state.customAddressValidationMessage}
            </div>
          </div>
        )}
        <Footer
          form={form}
          showBackButton={true}
          onSaveLaterButtonClick={this.props.onSaveLater}
          onBackButtonClick={() => this.props.navigateTo(activeItemIndex - 1)}
          onContinueButtonClick={() => this.navigateTo(activeItemIndex + 1)}
          showClearButton={true}
          clearBtnActive={this.state.showForm ? this.isFormEmpty() : true}
          clearButtonClick={this.props.form.clearData}
        />
      </div>
    );
  }
}
