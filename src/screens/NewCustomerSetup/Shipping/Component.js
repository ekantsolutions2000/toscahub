import React, { Component } from "react";
import Footer from "./../Components/Footer";
import ShippingForm from "./ShippingForm";
import AddressTile from "./AddressTile";
import DeepClone from "lodash/cloneDeep";
import moment from "moment";
import _ from "lodash";
export default class ShippingComponent extends Component {
  state = {
    shippingAddresses: [],
    showForm: false,
    addNew: true,
    newForm: JSON.parse(JSON.stringify(this.props.form)),
    currentId: 1,
    shippingHours: [],
    pickedShippingDays: [],
    receivingHours: [],
    pickedReceivingDays: [],
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state !== prevState) {
      this.props.setShippingDetails(this.state);
    }
  }

  componentDidMount() {
    this.setState({ ...this.props.shippingDetailsState });
  }

  navigateTo = (step) => {
    if (step < 1 || this.props.form.isFormValid) this.props.navigateTo(step);
  };

  onSaveButtonClick = (addNew, id, form) => {
    if (addNew) {
      this.setState({
        shippingAddresses: [
          ...this.state.shippingAddresses,
          {
            id: this.state.shippingAddresses.length + 1,
            form: DeepClone(form),
            shippingHours: this.state.shippingHours,
            receivingHours: this.state.receivingHours,
          },
        ],
      });
    } else {
      const elementsIndex = this.state.shippingAddresses.findIndex(
        (address) => address.id === id,
      );
      let addressArray = [...this.state.shippingAddresses];
      addressArray[elementsIndex] = {
        id: id,
        form: DeepClone(form),
        shippingHours: this.state.shippingHours,
        receivingHours: this.state.receivingHours,
      };
      this.setState({ shippingAddresses: addressArray });
    }

    this.setState({
      showForm: false,
    });
  };

  onNewAddressClick = () => {
    this.clearForm();
    this.setState({
      showForm: true,
      addNew: true,
      currentId: this.state.shippingAddresses.length + 1,
      shippingHours: [],
      pickedShippingDays: [],
      receivingHours: [],
      pickedReceivingDays: [],
    });
  };

  onRemoveAddressClick = (id) => {
    if (!this.state.addNew) {
      this.setState({
        shippingAddresses: this.state.shippingAddresses.filter(function (
          value,
          index,
          arr,
        ) {
          return value.id !== id;
        }),
        shippingHours: [],
        pickedShippingDays: [],
        receivingHours: [],
        pickedReceivingDays: [],
      });
    }

    this.clearForm();

    this.setState({
      showForm: false,
    });
  };

  onEditAddressClick = (id, form, shippingHours, receivingHours) => {
    for (var field in this.props.form) {
      if (
        this.props.form.hasOwnProperty(field) &&
        this.props.form[field].hasOwnProperty("value")
      ) {
        this.props.form[field].value = form[field].value;
      }
    }

    const elementsIndex = this.state.shippingAddresses.findIndex(
      (address) => address.id === id,
    );
    let addressArray = [...this.state.shippingAddresses];
    addressArray[elementsIndex] = {
      id: id,
      form: DeepClone(form),
      shippingHours: shippingHours,
      receivingHours: receivingHours,
    };

    this.setState({
      shippingAddresses: addressArray,
      showForm: true,
      addNew: false,
      currentId: id,
      shippingHours: shippingHours,
      receivingHours: receivingHours,
      pickedShippingDays:
        this.shippingFormMethods.getAllPickedDays(shippingHours),
      pickedReceivingDays:
        this.shippingFormMethods.getAllPickedDays(receivingHours),
    });

    this.props.form._validateForm();
  };

  clearForm = () => {
    for (var field in this.props.form) {
      if (
        this.props.form.hasOwnProperty(field) &&
        this.props.form[field].hasOwnProperty("value")
      ) {
        this.props.form[field].value = this.state.newForm[field].value;
      }
    }

    if (this.props.form["siSelectedExportOption"])
      this.props.form["siSelectedExportOption"].value = [];

    if (this.props.form["siSelectedPickUpOrDelivery"])
      this.props.form["siSelectedPickUpOrDelivery"].value = [];
  };

  shippingFormMethods = {
    shippingDayDropdownFilter: (options) => {
      return options.filter((day) => {
        return !this.state.pickedShippingDays.some(
          (pickedDay) => day.value === pickedDay,
        );
      });
    },
    onAddShippingHoursCick: (form) => {
      this.setState(
        {
          shippingHours: [
            ...this.state.shippingHours,
            {
              id: this.state.shippingHours.length + 1,
              days: form.siShippingDays.value,
              from: form.siShippingTimeFrom.value,
              fromTime: moment(form.siShippingTimeFrom.value).format("hh:mm A"),
              to: form.siShippingTimeTo.value,
              toTime: moment(form.siShippingTimeTo.value).format("hh:mm A"),
            },
          ],
          pickedShippingDays: this.shippingFormMethods.getPickedShippingDays(
            form.siShippingDays.value,
          ),
        },
        () => {
          form.siShippingHours.value = this.state.shippingHours;
        },
      );

      this.shippingFormMethods.clearShippingHoursForm(form);
    },
    getPickedShippingDays: (siShippingDays) => {
      return this.state.pickedShippingDays.concat(
        siShippingDays.map((day) => {
          return day["value"].toString();
        }),
      );
    },
    getAllPickedDays: (Hours) => {
      let pickedDays = [];
      Hours.map((hour, i) => {
        return hour.days.map((day) => {
          pickedDays = [...pickedDays, day["value"].toString()];
          return day["value"];
        });
      });

      return pickedDays;
    },

    onRemoveShippingHoursClick: (hour) => {
      let pickedShippingDays = this.state.pickedShippingDays;
      hour.days.map((d, i) => {
        pickedShippingDays = pickedShippingDays.filter(function (
          value,
          index,
          arr,
        ) {
          return value !== d.value;
        });
        return true;
      });

      this.setState({
        pickedShippingDays: pickedShippingDays,
        shippingHours: this.state.shippingHours.filter(function (
          value,
          index,
          arr,
        ) {
          return value.id !== hour.id;
        }),
      });
    },
    clearShippingHoursForm: (form) => {
      form.siShippingDays.value = "";
      form.siShippingTimeFrom.value = null;
      form.siShippingTimeTo.value = null;
    },
    receivingDayDropdownFilter: (options) => {
      return options.filter((day) => {
        return !this.state.pickedReceivingDays.some(
          (pickedDay) => day.value === pickedDay,
        );
      });
    },
    onAddReceivingHoursCick: (form) => {
      this.setState(
        {
          receivingHours: [
            ...this.state.receivingHours,
            {
              id: this.state.receivingHours.length + 1,
              days: form.siReceivingDays.value,
              from: form.siReceivingTimeFrom.value,
              fromTime: moment(form.siReceivingTimeFrom.value).format(
                "hh:mm A",
              ),
              to: form.siReceivingTimeTo.value,
              toTime: moment(form.siReceivingTimeTo.value).format("hh:mm A"),
            },
          ],
          pickedReceivingDays: this.shippingFormMethods.getPickedReceivingDays(
            form.siReceivingDays.value,
          ),
        },
        () => {
          form.siReceivingHours.value = this.state.receivingHours;
        },
      );
      this.shippingFormMethods.clearReceivingHoursForm(form);
    },
    getPickedReceivingDays: (siReceivingDays) => {
      return this.state.pickedReceivingDays.concat(
        siReceivingDays.map((day) => {
          return day["value"].toString();
        }),
      );
    },
    onRemoveReceivingHoursClick: (hour) => {
      let pickedReceivingDays = this.state.pickedReceivingDays;
      hour.days.map((d, i) => {
        pickedReceivingDays = pickedReceivingDays.filter(function (
          value,
          index,
          arr,
        ) {
          return value !== d.value;
        });
        return true;
      });

      this.setState({
        pickedReceivingDays: pickedReceivingDays,
        receivingHours: this.state.receivingHours.filter(function (
          value,
          index,
          arr,
        ) {
          return value.id !== hour.id;
        }),
      });
    },
    clearReceivingHoursForm: (form) => {
      form.siReceivingDays.value = "";
      form.siReceivingTimeFrom.value = null;
      form.siReceivingTimeTo.value = null;
    },
  };

  isFormEmpty = () => {
    let { form } = this.props;
    return _.isEmpty(form.siSelectedPickUpOrDelivery.value) &&
      form.siLocationName.value === "" &&
      form.siStreetAddressLine1.value === "" &&
      form.siStreetAddressLine2.value === "" &&
      form.siCity.value === "" &&
      form.siCountry.value === "" &&
      form.siState.value === "" &&
      form.siZipCode.value === "" &&
      form.siFirstName.value === "" &&
      form.siLastName.value === "" &&
      form.siOfficePhoneNumber.value === "" &&
      form.siMobileNumber.value === "" &&
      form.siFaxNumber.value === "" &&
      form.siEmail.value === "" &&
      form.siFlatbed.value === "" &&
      form.siBaggedPallets.value === "" &&
      form.siHeatTreatedPallets.value === "" &&
      form.siDeliveryInstructions.value === "" &&
      _.isEmpty(form.siShippingDays.value) &&
      form.siShippingTimeFrom.value === null &&
      form.siShippingTimeTo.value === null &&
      _.isEmpty(form.siShippingHours.value) &&
      _.isEmpty(form.siReceivingDays.value) &&
      _.isEmpty(form.siReceivingHours.value)
      ? true
      : false;
  };

  clearFormData = () => {
    // if (this.state.shippingHours.length > 0) {
    //   this.state.shippingHours.map((item) => {
    // this.shippingFormMethods.onRemoveShippingHoursClick(item);
    //   });
    // }
    this.setState({ shippingHours: [], pickedShippingDays: [] });

    // if (this.state.receivingHours.length > 0) {
    //   this.state.receivingHours.map((item) => {
    //     this.shippingFormMethods.onRemoveReceivingHoursClick(item);
    //   });
    // }
    this.setState({ receivingHours: [], pickedReceivingDays: [] });

    this.props.form.clearData();
    this.props.form.siSelectedExportOption.value = [];
    this.props.form.siSelectedPickUpOrDelivery.value = [];
    this.props.form.siShippingDays.value = [];
    this.props.form.siShippingHours.value = [];
    this.props.form.siReceivingDays.value = [];
    this.props.form.siReceivingHours.value = [];
  };

  render() {
    let { form, activeItemIndex } = this.props;

    return (
      <div>
        <div className="tw-w-3/4 tw-inline-block tw-align-top">
          {this.state.showForm ? (
            <ShippingForm
              form={form}
              countries={this.props.countries}
              onChangeCountry={this.props.onChangeCountry}
              shippingHours={this.state.shippingHours}
              receivingHours={this.state.receivingHours}
              onRemoveButtonClick={this.onRemoveAddressClick}
              onSaveButtonClick={this.onSaveButtonClick}
              getAddressValidation={this.props.getAddressValidation}
              shippingFormMethods={this.shippingFormMethods}
              addNew={this.state.addNew}
              id={this.state.currentId}
            />
          ) : (
            <>
              <button
                type="button"
                onClick={this.onNewAddressClick}
                className="tw-relative tw-bg-tosca-orange hover:tw-bg-tosca-orange-500 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border-none tw-flex tw-justify-end tw-rounded disabled:tw-bg-gray-500 tw-mb-8"
              >
                + Add Shipping Address
              </button>
            </>
          )}
        </div>

        {this.state.shippingAddresses.length ? (
          <div className="tw-w-3/4 tw-inline-block">
            {this.state.shippingAddresses.map((address, index) => (
              <AddressTile
                key={address.id}
                data={address}
                onRemoveButtonClick={this.onRemoveAddressClick}
                onEditAddressClick={this.onEditAddressClick}
              />
            ))}
          </div>
        ) : null}

        {this.props.isExport !== 0 ? (
          <Footer
            form={form}
            showBackButton={true}
            onContinueButtonClick={() => this.navigateTo(activeItemIndex + 1)}
            onBackButtonClick={() => this.props.navigateTo(activeItemIndex - 1)}
            onSaveLaterButtonClick={this.props.onSaveLater}
            showCustomButton={false}
            continueButtonDisabled={!this.state.shippingAddresses.length}
            showClearButton={true}
            clearBtnActive={this.state.showForm ? this.isFormEmpty() : true}
            clearButtonClick={this.clearFormData}
          />
        ) : (
          <Footer
            form={form}
            showBackButton={true}
            onContinueButtonClick={() =>
              this.props.navigateTo(activeItemIndex + 1)
            }
            onSaveLaterButtonClick={this.props.onSaveLater}
            showCustomButton={false}
            onBackButtonClick={() => this.props.navigateTo(activeItemIndex - 1)}
            continueButtonDisabled={!this.state.shippingAddresses.length}
            showClearButton={true}
            clearBtnActive={this.state.showForm ? this.isFormEmpty() : true}
            clearButtonClick={this.clearFormData}
          />
        )}
      </div>
    );
  }
}
