import Validator from "./FieldValidation";
import CloneDeep from "lodash/cloneDeep";
import IsEqual from "lodash/isEqual";
class Form {
  constructor(fields, onChange = () => {}) {
    this.stateChanged = onChange;

    this.isFormValid = false;
    this.formErrorMsg = "";
    this._originalData = {};
    this.fields = CloneDeep(fields);
    this.isUpdated = false;
    for (let field in fields) {
      let fName = field + "_raw";
      let vm = this;

      this[fName] = { ...fields[field] };
      this[fName].fieldName = field;
      this[fName].isValid = true;
      this[fName].errorMsg = "";
      this[fName].depends = [];
      this[fName].readableName = "";
      this[fName].onChange = () => {
        return true;
      };
      this[fName].validateMe = () => {
        return { success: true, msg: "" };
      };

      this[fName] = { ...this[fName], ...fields[field] };
      this[fName].executeValidation = function () {
        vm.validate(this.fieldName);
        vm._validateForm();
        vm.updateState();
      };

      this._originalData[field] = CloneDeep(this[fName]);

      this[field] = new Proxy(this[fName], {
        get(target, key) {
          return target[key];
        },
        set(target, key, value) {
          const hasValueChanged = !IsEqual(target[key], value);

          if (key === "value" && hasValueChanged) {
            vm.isUpdated = true;
            let cont = target.onChange(vm, value);
            if (typeof cont === "undefined") cont = true;

            if (!cont) {
              return true;
            }

            target[key] = value;

            target.executeValidation();
          } else {
            target[key] = value;
          }

          return true;
        },
      });
    }
    let initialFormLoad = true;
    this._validateForm(initialFormLoad);
  }

  clearError = (fields = []) => {
    fields.forEach((field) => {
      if (this[field]) {
        this[field].isValid = true;
        this[field].errorMsg = "";
      }
    });
  };

  getData = () => {
    let data = {};
    for (let field in this.fields) {
      data[field] = this[field].value;
    }
    return data;
  };

  setData = (data) => {
    for (let field in this.fields) {
      this[field].value = data[field];
    }
    return data;
  };

  onChange = (name, value) => {
    this[name].value = value;
  };

  onBlur = (name, value = this[name].value) => {
    this[name].executeValidation();
  };

  updateState() {
    this.stateChanged(this);
  }

  validate = (fieldName) => {
    let validation = this.validateField(fieldName);
    this[fieldName].isValid = validation.success;
    this[fieldName].errorMsg = validation.msg;
  };

  validateField = (fieldName) => {
    let { rules, value } = this[fieldName];
    let result = { success: true, msg: "" };

    if (rules && rules.length) {
      let validation = Validator.validate(
        value,
        rules,
        this[fieldName].readableName || fieldName,
        this[fieldName].errorMessages,
      );
      result.success = validation.success;
      result.msg = validation.msg;
    }
    if (result.success) {
      result = this[fieldName].validateMe(value);
    }
    return result;
  };

  checkDependentFieldValidation = (field) => {
    this[field].depends.forEach((f) => {
      this.validate(f);
    });
  };

  isFormUpdated() {
    return this.isUpdated;
  }

  _validateForm = (formLoad = false) => {
    this.isFormValid = true;
    this.formErrorMsg = "";

    for (let field in this._originalData) {
      let validation = this.validateField(field);
      if (!validation.success) {
        this.isFormValid = false;
        this.formErrorMsg = validation.msg;
        break;
      }

      if (!formLoad) {
        this.checkDependentFieldValidation(field);
      }
    }
    let result = { success: this.isFormValid, msg: this.formErrorMsg };
    return result;
  };

  clearData = () => {
    for (let field in this._originalData) {
      this[field].value = this._originalData[field].value;
      this.clearError([field]);
    }
  };
}

export default Form;
