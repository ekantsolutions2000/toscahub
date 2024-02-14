import Form from "./../../../utils/Form";
import Transformer from "../../../utils/Transform";
import { config } from "./../../../utils/conf";

const make = (vm) => {
  return new Form(
    {
      orderType: {
        readableName: "Order Type",
        value: { value: "1", displayValue: "Collections" },
        rules: "required",
        options: [{ value: "1", displayValue: "Collections" }],
      },
      loadingType: {
        readableName: "Loading Type",
        value: "",
        rules: "required",
        depends: [/*'carrier',*/ "trailerNo"],
        options: [
          { value: "1", displayValue: "Live Load" },
          { value: "2", displayValue: "Pre-loaded Trailer" },
        ],
        onChange: (form, option) => {
          if (option.value === "1") {
            form.trailerNo.rules = "";
            form.carrier.rules = "";
          } else {
            form.trailerNo.rules = form._originalData.trailerNo.rules;
            form.carrier.rules = form._originalData.carrier.rules;
          }

          if (config.hideCopCarrier) {
            form.carrier.rules = "";
          }
        },
      },
      carrier: {
        readableName: "Carrier",
        value: "",
        rules: "required",
        options: transformCarrierList(vm.carrierList),
      },
      trailerNo: {
        readableName: "Trailer No",
        value: "",
        rules: "required|maxLen:16",
      },
      rpcItems: { readableName: "RPC", value: [], rules: "required" },
      pickupDate: {
        readableName: "Pick up date",
        value: "",
        rules: "required",
        onChange: (form, val) => {
          // form.pickupTimeStart.value = null;
        },
      },
      // pickupTimeStart: {
      //   readableName: "Pick up time start",
      //   value: null,
      //   rules: "required",
      //   onChange: (form, val) => {
      //     form.pickupTimeEnd.value = null;
      //   },
      //   errorMessages: { required: "Start time is required" },
      // },
      // pickupTimeEnd: {
      //   readableName: "Pick up time end",
      //   value: null,
      //   rules: "required",
      //   errorMessages: { required: "End time is required" },
      // },
      shipperRefno: { readableName: "Shipper Reference Number", value: "COP" },
      additionalInfo: {
        readableName: "Additional Information",
        value: "",
        rules: "maxLen:80",
      },
    },
    vm.onFormChange,
  );
};

function transformCarrierList(carrierList) {
  if (carrierList) {
    return Transformer.transform(carrierList)
      .rename("carrierId", "value")
      .rename("carrierName", "displayValue")
      .get();
  }

  return [];
}

export default make;
