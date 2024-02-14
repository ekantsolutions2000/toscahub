import Form from "./../../../../utils/Form";
import _ from "lodash";

const make = (vm, data = {}) => {
  let fields = {
    containerType: containerTypeField(),
    qty: { value: "", rules: "required" },
    shipFrom: shipFromField(),
    shipTo: shipToField(),
    containerSize: {
      value: "",
      rules: "required",
      errorMessages: { required: "Container size is a required field" },
      options: (options, brand, color) => {
        const checkBrand = !!brand;
        const checkColor = !!color;

        return options.filter((i) => {
          const itemColor = _.get(i.obj, "itemColor", "NA");
          const itemBrand = _.get(i.obj, "itemBrand", "NA");
          return (
            (checkBrand ? itemBrand === brand : true) &&
            (checkColor ? itemColor === color : true)
          );
        });
      },
    },
    date: { value: "", rules: "required" },
    poNo: { value: "", rules: "required" },
    bolNo: { value: "", rules: "" },
    brand: {
      value: "",
      options: (inventory) => {
        let brands = [...new Set(inventory.map((i) => i.itemBrand || "NA"))];
        let options = brands
          .map((i) => ({ label: i, value: i }))
          .sort((a, b) => (a.label < b.label ? -1 : 1));
        options.unshift({ label: "All", value: "" });
        return options;
      },
      onChange: function (form, val) {
        form.containerSize.value = "";
        form.containerType.value = "";
        form.color.value = "";
        form.qty.value = "";
        form.clearError(["containerSize", "containerType", "qty"]);
      },
    },
    color: {
      value: "",
      options: (inventory, brand) => {
        const checkBrand = !!brand;
        let colors = [
          ...new Set(
            inventory
              .filter((k) =>
                checkBrand ? (k.itemBrand || "NA") === brand : true,
              )
              .map((i) => i.itemColor || "NA"),
          ),
        ];

        let options = colors
          .map((i) => ({ label: i, value: i }))
          .sort((a, b) => (a.label < b.label ? -1 : 1));
        options.unshift({ label: "All", value: "" });

        return options;
      },
      onChange: function (form, val) {
        form.containerSize.value = "";
        form.containerType.value = "";
        form.qty.value = "";
        form.clearError(["containerSize", "containerType", "qty"]);
      },
    },
  };
  return new Form({ ...fields, ...data }, vm.onFormChange);
};

const containerTypeField = () => {
  return {
    value: "",
    rules: "required",
    onChange: function (form, val) {
      form.containerSize.value = "";
    },
    options(orderInventory, brand, color) {
      let contClassList = [];
      const checkBrand = !!brand;
      const checkColor = !!color;
      orderInventory
        .filter((i) => {
          const itemColor = _.get(i, "itemColor", "NA");
          const itemBrand = _.get(i, "itemBrand", "NA");
          return (
            (checkBrand ? itemBrand === brand : true) &&
            (checkColor ? itemColor === color : true)
          );
        })
        .filter(
          (val, i, arr) =>
            arr.findIndex((t) => t.itemClassKey === val.itemClassKey) === i,
        )
        .forEach((orderClass) => {
          contClassList.push({
            value: orderClass.itemClassId,
            label:
              orderClass.itemClassId === "Handheld"
                ? "Case Ready Meat"
                : orderClass.itemClassId === "640"
                ? "Cheese"
                : orderClass.itemClassId,
          });
        });
      this.optionsList = contClassList;
      return contClassList;
    },
  };
};

const shipFromField = () => {
  return {
    value: "",
    rules: "required",
    errorMessages: { required: "Ship From is a required field" },
    options(addresses) {
      const items = addresses || [];

      return items
        .sort((a, b) => (a.addressName < b.addressName ? -1 : 1))
        .map((address) => ({
          label: address.addressName,
          value: address.addressId,
          obj: address,
        }));
    },
    getAddress() {
      //TODO: check this kiruba return this.value.obj.displayAddress;
      return `${_.get(this.value, "obj.addressLine1", "")} ${_.get(
        this.value,
        "obj.addressLine2",
        "",
      )}`;
    },
    onChange(form, value) {
      form.shipTo.value = "";
    },
  };
};

const shipToField = () => {
  return {
    value: "",
    rules: "required",
    errorMessages: { required: "Ship To is a required field" },
    shipTos: [],
    newShipTos: [],
    options(shipFromKey) {
      let shipToArr = (this.shipTos || [])
        .filter(
          (shipTo) =>
            shipTo.sourceAddressId === shipFromKey || shipTo.pendingRequestId,
        )
        .map((address) => ({
          label: address.addressName,
          value: address.id,
          obj: address,
        }));
      return shipToArr.sort((a, b) => (a.label < b.label ? -1 : 1));
    },
    getAddress() {
      return _.get(this.value, "obj.displayAddress", "");
    },
  };
};

export default make;
