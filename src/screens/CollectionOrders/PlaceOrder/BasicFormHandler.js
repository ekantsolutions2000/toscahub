import Form from "../../../utils/Form";
import _ from "lodash";

const make = (vm) => {
  return new Form(
    {
      companyName: {
        readableName: "Company Name",
        value: _.get(vm, "customer.customerName", ""),
      },
      shipFromType: { readableName: "Ship From Type", value: "Collections" },
      shipFrom: {
        readableName: "Ship From",
        value: "",
        rules: "required",
        options: vm.shipFromLocations,
        onChange: (form, option) => {
          const { addressLine1, city, state, postalCode, country } = {
            ...option,
          };

          form.shipFromAddress.value = `${addressLine1}, ${city}, ${state}, ${postalCode}, ${country}`;
          form.contactPerson.value = "NA";
          form.contactEmail.value = "NA";
          form.contactPhone.value = "NA";
        },
      },
      shipFromAddress: { readableName: "Ship From Address", value: "" },
      contactPerson: { readableName: "Contact Person", value: "" },
      contactEmail: { readableName: "Contact Person", value: "" },
      contactPhone: { readableName: "Contact Person", value: "" },
    },
    vm.onFormChange,
  );
};

export default make;
