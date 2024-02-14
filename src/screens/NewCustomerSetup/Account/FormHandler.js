import Form from "./../../../utils/Form";

const AccountFormHandler = (vm) => {
  let stateOptions = [
    { label: "NY", value: "1" },
    { label: "DC", value: "2" },
    { label: "MM", value: "3" },
  ];
  let salesTaxExemptOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  return new Form(
    {
      // companyName: {
      //     value: '',
      //     rules: 'required|alphaNum', //Optional:validation rules to check
      // errorMessages:{required: 'Company Name is mandatory'}, //Optional:This is custom error message
      // validateMe: (val) => { //Optional:This is a custom validation method for this field should return {success: {boolean}, msg: {string:errormessage}}
      //     retur n {success:true, msg:''}
      // },
      // onChange: (form, value) => { //Optional: if need any logic to run on this field change, returning false will not update
      //     // if(value === "1") {
      //     //     form.trailerNo.rules = "";
      //     //     form.carrier.rules = "";
      //     // }else {
      //     //     form.trailerNo.rules = form._originalData.trailerNo.rules;
      //     //     form.carrier.rules = form._originalData.carrier.rules;
      //     // }
      //     return true;
      // }
      // },
      aiCompanyName: {
        value: "",
        rules: "required",
        errorMessages: { required: "Company Name is required" },
      },
      aiStreetAddressLine1: {
        value: "",
        rules: "required",
        errorMessages: { required: "Street Address Line 1 is required" },
      },
      aiStreetAddressLine2: {
        value: "",
        rules: "",
        errorMessages: { required: "Street Address Line 2 is required" },
      },
      aiCountry: {
        value: "",
        rules: "required",
        errorMessages: { required: "Please select a Country" },
      },
      aiCity: {
        value: "",
        rules: "required",
        errorMessages: { required: "City is required" },
      },
      aiState: {
        value: "",
        options: stateOptions,
        rules: "required",
        errorMessages: { required: "Please select a State" },
      },
      aiZipCode: {
        value: "",
        rules: "required",
        errorMessages: { required: "Zip Code is required" },
      },
      aiFirstName: {
        value: "",
        rules: "required",
        errorMessages: { required: "First Name is required" },
      },
      aiLastName: {
        value: "",
        rules: "required",
        errorMessages: { required: "Last Name is required" },
      },
      aiOfficePhoneNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Office phone number is required",
          number: "Office phone number is not valid. Please check",
          maxLen: "Office phone number allows only 15 character",
          minLen: "Office phone number should be 2 character more",
        },
      },
      aiMobileNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Mobile number is required",
          number: "Mobile number is not valid. Please check",
          maxLen: "Mobile number allows only 15 character",
          minLen: "Mobile number should be 2 character more",
        },
      },
      aiFaxNumber: {
        value: "",
        rules: "number|maxLen:15",
        errorMessages: {
          number: "Fax number is not valid. Please check",
          maxLen: "Fax number allows only 15 character",
        },
      },
      aiEmail: {
        value: "",
        rules: "required",
        rulesOnBlur: "required|email",
        errorMessages: {
          required: "Email is required",
          email: "Email is not valid. Please check",
        },
      },

      aiEmailForInvoice: {
        value: "",
        rules: "required",
        rulesOnBlur: "required|email",
        errorMessages: {
          required: "Invoice Receiving Email is required",
          email: "Email is not valid. Please check",
        },
      },
      biCompanyName: {
        value: "",
        rules: "required",
        errorMessages: { required: "Company Name is required" },
      },
      biStreetAddressLine1: {
        value: "",
        rules: "required",
        errorMessages: { required: "Street Address Line 1 is required" },
      },
      biStreetAddressLine2: {
        value: "",
        rules: "",
        errorMessages: { required: "Street Address Line 2 is required" },
      },
      biCountry: {
        value: "",
        rules: "required",
        errorMessages: { required: "Please select a Country" },
      },
      biCity: {
        value: "",
        rules: "required",
        errorMessages: { required: "City is required" },
      },
      biState: {
        value: "",
        options: stateOptions,
        rules: "required",
        errorMessages: { required: "Please select a State" },
      },
      biZipCode: {
        value: "",
        rules: "required",
        errorMessages: { required: "Zip Code is required" },
      },
      biFirstName: {
        value: "",
        rules: "required",
        errorMessages: { required: "First Name is required" },
      },
      biLastName: {
        value: "",
        rules: "required",
        errorMessages: { required: "Last Name is required" },
      },
      biOfficcePhoneNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Office phone number is required",
          number: "Office phone number is not valid. Please check",
          maxLen: "Office phone number allows only 15 character",
          minLen: "Office phone number should be 2 character more",
        },
      },
      biMobileNumber: {
        value: "",
        rules: "required|number|minLen:2|maxLen:15",
        errorMessages: {
          required: "Mobile number is required",
          number: "Mobile number is not valid. Please check",
          maxLen: "Mobile allows only 15 character",
          minLen: "Mobile should be 2 character more",
        },
      },
      biFaxNumber: {
        value: "",
        rules: "number|maxLen:15",
        errorMessages: {
          number: "Fax number is not valid. Please check",
          maxLen: "Fax number allows only 15 character",
        },
      },
      biEmail: {
        value: "",
        rules: "required",
        rulesOnBlur: "required|email",
        errorMessages: {
          required: "Email is required",
          email: "Email is not valid. Please check",
        },
      },
      biEmailForInvoice: {
        value: "",
        rules: "required",
        rulesOnBlur: "required|email",
        errorMessages: {
          required: "Invoice Receiving Email is required",
          email: "Email is not valid. Please check",
        },
      },

      salesTaxExempt: {
        value: "",
        options: salesTaxExemptOptions,
        rules: "required",
        errorMessages: { required: "Please select Sales Tax Exempt" },
      },

      TaxExemptCetificate: {
        value: "",
        rules: "",
        errorMessages: { required: "Please upload the tex exempt cetificate" },
      },

      attachments: {
        value: [],
        rules: "",
        errorMessages: {
          required: "",
        },
      },

      sameAsAccountInfo: {
        value: false,
        onChange: (form, value) => {
          if (value) {
            form.biCompanyName.value = form.aiCompanyName.value;
            form.biStreetAddressLine1.value = form.aiStreetAddressLine1.value;
            form.biStreetAddressLine2.value = form.aiStreetAddressLine2.value;
            form.biCountry.value = form.aiCountry.value;
            form.biCity.value = form.aiCity.value;
            form.biState.value = form.aiState.value;
            form.biZipCode.value = form.aiZipCode.value;
            form.biFirstName.value = form.aiFirstName.value;
            form.biLastName.value = form.aiLastName.value;
            form.biOfficcePhoneNumber.value = form.aiOfficePhoneNumber.value;
            form.biMobileNumber.value = form.aiMobileNumber.value;
            form.biFaxNumber.value = form.aiFaxNumber.value;
            form.biEmail.value = form.aiEmail.value;
            form.biEmailForInvoice.value = form.aiEmailForInvoice.value;
          } else {
            form.biCompanyName.value = "";
            form.biStreetAddressLine1.value = "";
            form.biStreetAddressLine2.value = "";
            form.biCountry.value = "";
            form.biCity.value = "";
            form.biState.value = "";
            form.biZipCode.value = "";
            form.biFirstName.value = "";
            form.biLastName.value = "";
            form.biOfficcePhoneNumber.value = "";
            form.biMobileNumber.value = "";
            form.biFaxNumber.value = "";
            form.biEmail.value = "";
            form.biEmailForInvoice.value = "";

            const fields = [
              "biCompanyName",
              "biStreetAddressLine1",
              "biStreetAddressLine2",
              "biCity",
              "biState",
              "biZipCode",
              "biFirstName",
              "biLastName",
              "biOfficcePhoneNumber",
              "biMobileNumber",
              "biFaxNumber",
              "biEmail",
              "biEmailForInvoice",
            ];

            form.clearError(fields);
          }
          // else {
          //     form.biCompanyName.value = '';
          //     form.biStreetAddressLine1.value = '';
          //     form.biStreetAddressLine2.value = '';
          //     form.biCity.value = '';
          //     form.biState.value = '';
          //     form.biZipCode.value = '';
          //     form.biFirstName.value = '';
          //     form.biLastName.value = '';
          //     form.biOfficePhoneAreaCode.value = '';
          //     form.biOfficcePhoneNumber.value = '';
          //     form.biMobileAreaCode.value = '';
          //     form.biMobileNumber.value = '';
          //     form.biFaxAreaCode.value = '';
          //     form.biFaxNumber.value = '';
          //     form.biEmail.value = '';
          // }
        },
      },
    },
    vm.onFormChange,
  );
};

export default AccountFormHandler;
