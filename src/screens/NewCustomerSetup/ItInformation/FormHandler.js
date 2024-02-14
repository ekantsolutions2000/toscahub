import Form from "./../../../utils/Form";

const ItInformationFormHandler = (vm) => {
  let onChange = (form, name, value) => {
    if (value) {
      let options = form.itInforRpcReportingCapability.value;
      options.push(name);
      form.itInforRpcReportingCapability.value = options;
    } else {
      let op = form.itInforRpcReportingCapability.value.filter(
        (i) => i !== name,
      );
      form.itInforRpcReportingCapability.value = op;
    }
  };

  return new Form(
    {
      itInforFirstName: {
        value: "",
        rules: "required",
        errorMessages: { required: "IT contact first name is required" },
      },
      itInforLastName: {
        value: "",
        rules: "required",
        errorMessages: { required: "IT contact last name is required" },
      },
      itInforEmail: {
        value: "",
        rules: "required|email",
        errorMessages: {
          required: "Email is required",
          email: "Email is not valid. Please check",
        },
      },
      itInforPhoneNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Phone number is required",
          number: "Phone number is not valid. Please check",
          maxLen: "Phone number allows only 15 character",
          minLen: "Phone number should be 2 character more",
        },
      },

      itInforReportingSFTP: {
        value: false,
        onChange: (form, value) => onChange(form, "SFTP", value),
      },
      itInforReportingExcel: {
        value: false,
        onChange: (form, value) => onChange(form, "Excel", value),
      },
      itInforReportingFamous: {
        value: false,
        onChange: (form, value) => onChange(form, "Famous", value),
      },
      itInforReportingOnline: {
        value: false,
        onChange: (form, value) => onChange(form, "OnlineRpt", value),
      },

      itInforRpcReportingCapability: {
        value: [],
        rules: "required",
        errorMessages: {
          required: "Please select a RPC Reporting Capbility.",
        },
      },

      itInforReportingFirstName: {
        value: "",
        rules: "required",
        errorMessages: {
          required: "IT reporting contact first name is required",
        },
      },
      itInforReportingLastName: {
        value: "",
        rules: "required",
        errorMessages: { required: "IT reporti contact last name is required" },
      },
      itInforReportingEmail: {
        value: "",
        rules: "required|email",
        errorMessages: {
          required: "Email is required",
          email: "Email is not valid. Please check",
        },
      },

      itInforFinalLocation: {
        value: "",
        rules: "",
        errorMessages: {
          required: "Location is required",
        },
      },

      itInforDistributionCity: {
        value: "",
        rules: "",
        errorMessages: {
          required: "Distribution city is required",
        },
      },

      itInforDistributionState: {
        value: "",
        rules: "",
        errorMessages: {
          required: "Distribution state is required",
        },
      },

      itInforDestinations: {
        value: [],
        rules: "required",
        errorMessages: {
          required: "Final destinations are required",
        },
      },
    },
    vm.onFormChange,
  );
};

export default ItInformationFormHandler;
