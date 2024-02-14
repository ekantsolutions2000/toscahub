import Form from "./../../../utils/Form";

const ShippingFormHandler = (vm) => {
  let stateOptions = [
    { label: "NY", value: "NY" },
    { label: "DC", value: "DC" },
    { label: "MM", value: "MM" },
  ];
  let yesNoOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  let week = [
    { label: "Mon", value: "Mon" },
    { label: "Tue", value: "Tue" },
    { label: "Wed", value: "Wed" },
    { label: "Thu", value: "Thu" },
    { label: "Fri", value: "Fri" },
    { label: "Sat", value: "Sat" },
    { label: "Sun", value: "Sun" },
  ];

  let onChangeDeliverytOption = (form, name, value) => {
    if (value) {
      let options = form.siSelectedPickUpOrDelivery.value;
      options.push(name);
      form.siSelectedPickUpOrDelivery.value = options;
    } else {
      let op = form.siSelectedPickUpOrDelivery.value.filter((i) => i !== name);
      form.siSelectedPickUpOrDelivery.value = op;
    }
  };

  return new Form(
    {
      siPickUp: {
        value: "",
        onChange: (form, value) =>
          onChangeDeliverytOption(form, "PickUp", value),
      },
      siDelivery: {
        value: "",
        onChange: (form, value) =>
          onChangeDeliverytOption(form, "Delivery", value),
      },

      siSelectedPickUpOrDelivery: {
        value: [],
        rules: "required",
        errorMessages: {
          required: "Please select between Customer Pick Up or Delivery",
        },
      },
      siLocationName: {
        value: "",
        rules: "required",
        errorMessages: { required: "Location Name is required" },
      },

      siStreetAddressLine1: {
        value: "",
        rules: "required",
        errorMessages: { required: "Street Address Line 1 is required" },
      },
      siStreetAddressLine2: {
        value: "",
        rules: "",
        errorMessages: { required: "Street Address Line 2 is required" },
      },
      siCity: {
        value: "",
        rules: "required",
        errorMessages: { required: "City is required" },
      },
      siCountry: {
        value: "",
        rules: "required",
        errorMessages: { required: "Country is required" },
      },
      siState: {
        value: "",
        options: stateOptions,
        rules: "required",
        errorMessages: { required: "Please select a State" },
      },
      siZipCode: {
        value: "",
        rules: "required|minLen:2|maxLen:10",
        errorMessages: {
          required: "Zip Code is required",
          maxLen: "Zip Code allows only 10 character",
          minLen: "Zip Code should be 2 character more",
        },
      },
      siFirstName: {
        value: "",
        rules: "required",
        errorMessages: { required: "First Name is required" },
      },
      siLastName: {
        value: "",
        rules: "required",
        errorMessages: { required: "Last Name is required" },
      },
      siOfficePhoneNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Office phone number is required",
          number: "Officr phone number is not valid. Please check",
          maxLen: "Office phone area code allows only 15 character",
          minLen: "Office phone area code should be 2 character more",
        },
      },

      siMobileNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Mobile number is required",
          number: "Mobile number is not valid. Please check",
          maxLen: "Mobile area code allows only 15 character",
          minLen: "Mobile area code should be 2 character more",
        },
      },

      siFaxNumber: {
        value: "",
        rules: "|number||maxLen:15",
        errorMessages: {
          number: "Fax number is not valid. Please check",
          maxLen: "Fax area code allows only 15 character",
        },
      },

      siEmail: {
        value: "",
        rules: "required",
        rulesOnChange: "required",
        rulesOnBlur: "required|email",
        errorMessages: {
          required: "Email is required",
          email: "Email is not valid. Please check",
        },
      },
      siFlatbed: {
        value: "",
        rules: "required",
        options: yesNoOptions,
        errorMessages: { required: "Please select flatbed option." },
      },

      siBaggedPallets: {
        value: "",
        rules: "required",
        options: yesNoOptions,
        errorMessages: { required: "Please select pallets bagged option." },
      },

      siHeatTreatedPallets: {
        value: "",
        rules: "required",
        options: yesNoOptions,
        errorMessages: {
          required: "Please select heat treated pallets option.",
        },
      },

      siDeliveryInstructions: {
        value: "",
        rules: "",
        errorMessages: { required: "Please select days" },
      },

      siShippingDays: {
        value: [],
        options: week,
        rules: "",
        errorMessages: { required: "Please select days" },
      },
      siShippingTimeFrom: {
        value: null,
        rules: "",
        errorMessages: { required: "Please select days" },
      },
      siShippingTimeTo: {
        value: null,
        rules: "",
        errorMessages: { required: "Please select days" },
      },

      siShippingHours: {
        value: [],
        rules: "required",
        errorMessages: {
          required: "Shipping hours are required",
        },
      },

      siReceivingDays: {
        value: [],
        options: week,
        rules: "",
        errorMessages: { required: "Please select days" },
      },
      siReceivingTimeFrom: {
        value: null,
        rules: "",
        errorMessages: { required: "Please select days" },
      },
      siReceivingTimeTo: {
        value: null,
        rules: "",
        errorMessages: { required: "Please select days" },
      },
      siReceivingHours: {
        value: [],
        rules: "required",
        errorMessages: {
          required: "Receiving hours are required",
        },
      },
    },
    vm.onFormChange,
  );
};

export default ShippingFormHandler;
