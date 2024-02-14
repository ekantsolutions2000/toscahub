import Form from "./../../../utils/Form";

const CustomsDetailsFormHandler = (vm) => {
  let stateOptions = [
    { label: "NY", value: "1" },
    { label: "DC", value: "2" },
    { label: "MM", value: "3" },
  ];

  let week = [
    { label: "Mon", value: "Monday" },
    { label: "Tue", value: "Tuesday" },
    { label: "Wed", value: "Wednesday" },
    { label: "Thu", value: "Thursday" },
    { label: "Fri", value: "Friday" },
    { label: "Sat", value: "Saturday" },
    { label: "Sun", value: "Sunday" },
  ];

  let days = [
    { label: "1 Day", value: "1 Day" },
    { label: "2 Days", value: "2 Days" },
    { label: "3 Days", value: "3 Days" },
    { label: "4 Days", value: "4 Days" },
    { label: "5 Days", value: "5 Days" },
    { label: "6 Days", value: "6 Days" },
    { label: "7 Days", value: "7 Days" },
  ];

  return new Form(
    {
      cbicusExportEndUserCountry: {
        value: "",
        rules: "",
        errorMessages: { required: "" },
      },

      cbiBrokerCompanyName: {
        value: "",
        rules: "required",
        errorMessages: { required: "Broker company name is required" },
      },

      cbiBrokerAddressLine1: {
        value: "",
        rules: "required",
        errorMessages: { required: "Broker address line 1 is required" },
      },

      cbiBrokerAddressLine2: {
        value: "",
        rules: "",
        errorMessages: { required: "Broker address line 2 is required" },
      },

      cbiCity: {
        value: "",
        rules: "required",
        errorMessages: { required: "City is required" },
      },

      cbiZipCode: {
        value: "",
        rules: "required|minLen:2|maxLen:10",
        errorMessages: {
          required: "Zip Code is required",
          maxLen: "Zip Code code allows only 10 character",
          minLen: "Zip Code code should be 2 character more",
        },
      },

      cbiCountry: {
        value: "",
        rules: "required",
        errorMessages: { required: "Country is required" },
      },

      cbiState: {
        value: "",
        options: stateOptions,
        rules: "required",
        errorMessages: { required: "Please select a State" },
      },

      cbiBrokerFirstName: {
        value: "",
        rules: "required",
        errorMessages: { required: "Broker first name is required" },
      },

      cbiBrokerLastName: {
        value: "",
        rules: "required",
        errorMessages: { required: "Broker last name is required" },
      },

      cbiPhoneNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Phone number is required",
          number: "Phone number is not valid. Please check",
          maxLen: "Phone number allows only 15 character",
          minLen: "Phone number should be 2 character more",
        },
      },

      cbiMobileNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Mobile number is required",
          number: "Mobile number is not valid. Please check",
          maxLen: "Mobile number allows only 15 character",
          minLen: "Phone number should be 2 character more",
        },
      },

      cbiEmail: {
        value: "",
        rules: "required|email",
        errorMessages: {
          required: "Email is required",
          email: "Email is not valid. Please check",
        },
      },

      cbiOperationDays: {
        value: [],
        options: week,
        rules: "",
        errorMessages: { required: "Please select days" },
      },
      cbiOperationFromTime: {
        value: null,
        rules: "",
        errorMessages: { required: "Please select days" },
      },
      cbiOperationToTime: {
        value: null,
        rules: "",
        errorMessages: { required: "Please select days" },
      },

      cbiOperationHours: {
        value: [],
        rules: "required",
        errorMessages: {
          required: "Shipping hours are required",
        },
      },

      cbiLeadTimeDays: {
        value: [],
        options: days,
        rules: "",
        errorMessages: { required: "Please select days" },
      },

      cbiLeadTimeFromTime: {
        value: null,
        rules: "",
        errorMessages: { required: "Please select days" },
      },

      cbiLeadTimeToTime: {
        value: null,
        rules: "",
        errorMessages: { required: "Please select days" },
      },

      cbiLeadTimeHours: {
        value: [],
        rules: "required",
        errorMessages: {
          required: "Shipping hours are required",
        },
      },

      eeuFirstName: {
        value: "",
        rules: "required",
        errorMessages: { required: "First Name is required" },
      },
      eeuLastName: {
        value: "",
        rules: "required",
        errorMessages: { required: "Last Name is required" },
      },
      eeuStreetAddressLine1: {
        value: "",
        rules: "required",
        errorMessages: { required: "Street Address Line 1 is required" },
      },
      eeuStreetAddressLine2: {
        value: "",
        rules: "",
        errorMessages: { required: "Street Address Line 2 is required" },
      },
      eeuCity: {
        value: "",
        rules: "required",
        errorMessages: { required: "City is required" },
      },
      eeuCountry: {
        value: "Mexico",
        rules: "required",
        errorMessages: { required: "Country is required" },
      },
      eeuState: {
        value: "",
        options: stateOptions,
        rules: "required",
        errorMessages: { required: "Please select a State" },
      },
      eeuZipCode: {
        value: "",
        rules: "required|minLen:2|maxLen:10",
        errorMessages: {
          required: "Zip Code is required",
          maxLen: "Zip Code code allows only 10 character",
          minLen: "Zip Code code should be 2 character more",
        },
      },

      eeuCountryCode: {
        value: "",
        rules: "required|number|minLen:2|maxLen:4",
        errorMessages: {
          required: "Country Code is required",
          number: "Country code number is not valid. Please check",
          maxLen: "Country code allows only 4 character",
          minLen: "Country code should be 2 character more",
        },
      },

      eeuContactFirstName: {
        value: "",
        rules: "required",
        errorMessages: { required: "First Name is required" },
      },
      eeuContactLastName: {
        value: "",
        rules: "",
        errorMessages: { required: "Last Name is required" },
      },

      eeuPhoneNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Phone number is required",
          number: "Phone number is not valid. Please check",
          maxLen: "Phone number allows only 15 character",
          minLen: "Phone number should be 2 character more",
        },
      },
      eeuEmail: {
        value: "",
        rules: "required|email",
        errorMessages: {
          required: "Email is required",
          email: "Email is not valid. Please check",
        },
      },
    },
    vm.onFormChange,
  );
};

export default CustomsDetailsFormHandler;
