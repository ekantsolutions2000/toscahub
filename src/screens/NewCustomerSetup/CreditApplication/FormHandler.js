import Form from "./../../../utils/Form";

const CreditApplicationFormHandler = (vm) => {
  let onChange = (form, name, value) => {
    if (value) {
      let options = form.afcOwnership.value;
      options.push(name);
      form.afcOwnership.value = options;
    } else {
      let op = form.afcOwnership.value.filter((i) => i !== name);
      form.afcOwnership.value = op;
    }
  };

  return new Form(
    {
      afcDateOfApp: {
        value: "",
        rules: "required",
        errorMessages: { required: "Date of Application is required" },
      },

      afcFormatedDateOfApp: {
        value: "",
        rules: "",
        errorMessages: { required: "Date of Application is required" },
      },

      afcCompanyName: {
        value: "",
        rules: "required",
        errorMessages: {
          required:
            "Company name or Individual Requesting Credit field is required",
        },
      },

      afcCorporateId: {
        value: "",
        rules: "required",
        errorMessages: { required: "Corporate id is required" },
      },

      afcAddressLine1: {
        value: "",
        rules: "required",
        errorMessages: { required: "Address Line 1 is required" },
      },

      afcAddressLine2: {
        value: "",
        rules: "",
        errorMessages: { required: "Address Line 2 is required" },
      },
      afcCountry: {
        value: "",
        rules: "required",
        errorMessages: { required: "Please select a Country" },
      },

      afcCity: {
        value: "",
        rules: "required",
        errorMessages: { required: "City is required" },
      },

      afcState: {
        value: "",
        rules: "required",
        errorMessages: { required: "Please select a State" },
      },

      afcZipCode: {
        value: "",
        rules: "required|minLen:2|maxLen:10",
        errorMessages: { required: "Zip Code is required" },
      },

      afcEmail: {
        value: "",
        rules: "required",
        rulesOnChange: "required",
        rulesOnBlur: "required|email",
        errorMessages: {
          required: "Email is required",
          email: "Email is not valid. Please check",
        },
      },

      afcWebSite: {
        value: "",
        rules: "required|url",
        errorMessages: {
          required: "Please enter web site URL",
          url: "Please enter valid URL",
        },
      },

      afcCorporation: {
        value: false,
        onChange: (form, value) => onChange(form, "corporation", value),
      },

      afcIncorporated: {
        value: false,
        onChange: (form, value) => onChange(form, "incorporated", value),
      },

      afcPartnership: {
        value: false,
        onChange: (form, value) => onChange(form, "partnership", value),
      },

      afcIndividual: {
        value: false,
        onChange: (form, value) => onChange(form, "individual", value),
      },

      afcOwnership: {
        value: [],
        rules: "required",
        errorMessages: {
          required: "Please select a ownership .",
        },
      },

      afcPartnerName: {
        value: "",
        rules: "",
        errorMessages: { required: "Please select days" },
      },
      afcPartnerAddressLine1: {
        value: "",
        rules: "",
        errorMessages: { required: "Address Line 1 is required" },
      },

      afcPartnerAddressLine2: {
        value: "",
        rules: "",
        errorMessages: { required: "City 2 is required" },
      },

      afcPartnerCountry: {
        value: "",
        rules: "",
        errorMessages: { required: "Please select a Country" },
      },
      afcPartnerState: {
        value: "",
        rules: "",
        errorMessages: { required: "Please select a State" },
      },
      afcPartnerZipCode: {
        value: "",
        rules: "maxLen:10",
        errorMessages: {
          required: "Zip ode is required",
          maxLen: "Zip Code code allows only 10 character",
          minLen: "Zip Code code should be 2 character more",
        },
      },

      afcPartnerMobileNumber: {
        value: "",
        rules: "number|maxLen:15",
        errorMessages: {
          required: "Mobile number is required",
          number: "Mobile number is not valid. Please check",
          maxLen: "Mobile number allows only 15 character",
          minLen: "Mobile number should be 2 character more",
        },
      },

      afcPartnerFaxNumber: {
        value: "",
        rules: "number|maxLen:15",
        errorMessages: {
          number: "Fax number is not valid. Please check",
          maxLen: "Fax number allows only 15 character",
        },
      },

      afcPartnerEmail: {
        value: "",
        rules: "",
        rulesOnChange: "",
        rulesOnBlur: "",
        errorMessages: {
          required: "Email is required",
          email: "Email is not valid. Please check",
        },
      },

      afcPartnerartners: {
        value: [],
        rules: "required",
        errorMessages: {
          required: "Name(s) or Principal(s) details are required",
        },
      },

      afcBankName: {
        value: "",
        rules: "required",
        errorMessages: { required: "Business name is required" },
      },

      afcBankAddressLine1: {
        value: "",
        rules: "required",
        errorMessages: { required: "Address Line 1 is required" },
      },

      afcBankAddressLine2: {
        value: "",
        rules: "",
        errorMessages: { required: "Address Line 2 is required" },
      },

      afcBankCountry: {
        value: "",
        rules: "required",
        errorMessages: { required: "Country is required" },
      },

      afcBankCity: {
        value: "",
        rules: "required",
        errorMessages: { required: "City is required" },
      },

      afcBankZipCode: {
        value: "",
        rules: "required|minLen:2|maxLen:10",
        errorMessages: {
          required: "Zip Code is required",
          maxLen: "Zip Code code allows only 10 character",
          minLen: "Zip Code code should be 2 character more",
        },
      },

      afcBankOffcerNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Office number is required",
          number: "Office number is not valid. Please check",
          maxLen: "Office number allows only 15 character",
          minLen: "Office number should be 2 character more",
        },
      },

      afcBankMobileNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Mobile number is required",
          number: "Mobile number is not valid. Please check",
          maxLen: "Mobile number allows only 15 character",
          minLen: "Mobile number should be 2 character more",
        },
      },

      afcBankFaxNumber: {
        value: "",
        rules: "number|maxLen:15",
        errorMessages: {
          number: "Fax number is not valid. Please check",
          maxLen: "Fax number allows only 15 character",
        },
      },

      afcBankEmail: {
        value: "",
        rules: "required",
        rulesOnChange: "required",
        rulesOnBlur: "required|email",
        errorMessages: {
          required: "Email is required",
          email: "Email is not valid. Please check",
        },
      },

      afcTradeBusinessName: {
        value: "",
        rules: "",
        errorMessages: { required: "Business name is required" },
      },

      afcTradeAddressLine1: {
        value: "",
        rules: "",
        errorMessages: { required: "Address Line 1 is required" },
      },

      afcTradeAddressLine2: {
        value: "",
        rules: "",
        errorMessages: { required: "Address Line 2 is required" },
      },
      afcTradeCountry: {
        value: "",
        rules: "",
        errorMessages: { required: "Please select a Country" },
      },

      afcTradeCity: {
        value: "",
        rules: "",
        errorMessages: { required: "City is required" },
      },

      afcTradeState: {
        value: "",
        rules: "",
        errorMessages: { required: "Please select a State" },
      },

      afcTradeZipCode: {
        value: "",
        rules: "maxLen:10",
        errorMessages: {
          required: "Zip Code is required",
          maxLen: "Zip Code code allows only 10 character",
          minLen: "Zip Code code should be 2 character more",
        },
      },

      afcTradeFirstName: {
        value: "",
        rules: "",
        errorMessages: { required: "First name is required" },
      },

      afcTradeLastName: {
        value: "",
        rules: "",
        errorMessages: { required: "Last name is required" },
      },

      afcTradeMobileNumber: {
        value: "",
        rules: "number|maxLen:15",
        errorMessages: {
          required: "Mobile number is required",
          number: "Mobile number is not valid. Please check",
          maxLen: "Mobile area code allows only 15 character",
        },
      },

      afcTradeFaxNumber: {
        value: "",
        rules: "number|maxLen:15",
        errorMessages: {
          number: "Fax number is not valid. Please check",
          maxLen: "Fax area code allows only 15 character",
        },
      },

      afcTradeEmail: {
        value: "",
        rules: "",
        rulesOnChange: "",
        rulesOnBlur: "email",
        errorMessages: {
          required: "Email is required",
          email: "Email is not valid. Please check",
        },
      },

      afcTradeReferences: {
        value: [],
        rules: "required",
        errorMessages: {
          required: "Trade references are required",
        },
      },

      afcSignature: {
        value: "",
        rules: "required",
        errorMessages: {
          required: "Signature is required",
        },
      },

      afcTitle: {
        value: "",
        rules: "required",
        errorMessages: {
          required: "Applicant title is required",
        },
      },

      afcDateOfApplied: {
        value: "",
        rules: "required",
        errorMessages: { required: "Date of Appling is required" },
      },
      afcFormatedDateOfApplied: {
        value: "",
        rules: "",
        errorMessages: { required: "Date of Appling is required" },
      },

      afcAplicantName: {
        value: "",
        rules: "required",
        errorMessages: {
          required: "Applicant name is required",
        },
      },

      afcSocialSecurityNumber: {
        value: "",
        rules: "",
        errorMessages: {
          required: "Social Security Number is required",
        },
      },
    },
    vm.onFormChange,
  );
};

export default CreditApplicationFormHandler;
