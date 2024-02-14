import Form from "./../../../utils/Form";

const FormHandler = (vm) => {
  let palletOptions = [
    { label: "Whitewood", checked: false },
    { label: "iGPS", checked: false },
    { label: "Peco", checked: false },
    { label: "Chep", checked: false },
    { label: "Other", checked: false },
  ];

  let onChange = (form, name, value) => {
    if (value) {
      let options = form.selectedPalletPrograms.value;
      options.push(name);
      form.selectedPalletPrograms.value = options;
    } else {
      let op = form.selectedPalletPrograms.value.filter((i) => i !== name);
      form.selectedPalletPrograms.value = op;
    }
  };

  return new Form(
    {
      palletOptions: {
        value: palletOptions,
      },
      Whitewood: {
        value: false,
        onChange: (form, value) => onChange(form, "Whitewood", value),
      },
      iGPS: {
        value: false,
        onChange: (form, value) => onChange(form, "iGPS", value),
      },
      Peco: {
        value: false,
        onChange: (form, value) => onChange(form, "Peco", value),
      },
      Chep: {
        value: false,
        onChange: (form, value) => {
          if (value) {
            form.ChepValue.rules = "required";
            form.ChepValue.errorMessages = {
              required: "Please Enter Code",
            };
          } else {
            form.ChepValue.rules = "";
          }
          onChange(form, "Chep", value);
        },
      },
      Other: {
        value: "",
        onChange: (form, value) => {
          if (value) {
            form.otherValue.rules = "required";
            form.otherValue.errorMessages = {
              required: "Please type pallet program name",
            };
          } else {
            form.otherValue.rules = "";
          }
          onChange(form, "Other", value);
        },
      },
      otherValue: {
        value: "",
      },
      ChepValue: {
        value: "",
      },
      selectedPalletPrograms: {
        value: [],
        rules: "required",
      },
    },
    vm.onFormChange,
  );
};

export default FormHandler;
