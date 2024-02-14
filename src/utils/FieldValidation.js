import Validator from "validator";
import StartCase from "lodash/startCase";
class FieldValidation {
  availableMethods = [
    "required",
    "email",
    "number",
    "minVal",
    "maxVal",
    "minLen",
    "maxLen",
  ];
  methodPrefix = "validate_";

  //Rules -> required|email|number|url|minVal:5|maxVal:60|minLen:5|maxLen:55
  validate(data, rules, fieldName = "", errorMessages = {}) {
    let rulesArray = rules.split("|");
    let result = { success: true, msg: "", stopPropogation: false };
    // eslint-disable-next-line array-callback-return
    rulesArray.some((r) => {
      let currentRuleAndParam = r.split(":");
      let currentRule = currentRuleAndParam[0];
      let ruleValue = "";

      if (currentRuleAndParam.length > 1) ruleValue = currentRuleAndParam[1];

      let validateMethod = this.methodPrefix + currentRule;

      if (typeof this[validateMethod] === "function") {
        result = this[validateMethod](
          data,
          ruleValue,
          fieldName,
          errorMessages,
        );

        if (!result.success) return result;
      }
    });

    return result;
  }

  validate_number(data, ruleValue, fieldName, errorMessages) {
    let result = data === "" || Validator.isInt(data);
    let msg = "";
    if (!result)
      msg = errorMessages.number || `${StartCase(fieldName)} must be a number.`;

    return {
      success: result,
      msg: msg,
      stopPropogation: true,
    };
  }

  validate_required(data, ruleValue, fieldName, errorMessages) {
    let result = data && !(data.toString().trim().length === 0);
    let msg = "";
    if (!result) {
      msg = errorMessages.required || `${StartCase(fieldName)} is required`;
      if (Array.isArray(data)) {
        msg =
          errorMessages.required ||
          `${StartCase(fieldName)} - Add at least one item`;
      }
    }

    return {
      success: result,
      msg: msg,
      stopPropogation: true,
    };
  }

  validate_alphaNum(data, ruleValue, fieldName, errorMessages) {
    let result = Validator.isAlphanumeric(data);
    let msg = "";

    if (!result)
      msg =
        errorMessages.alphaNum ||
        `${StartCase(fieldName)} accepts only alpha-numeric characters`;

    return {
      success: result,
      msg: msg,
    };
  }

  validate_maxLen(data, ruleValue, fieldName, errorMessages) {
    data = data.toString();
    let result = Validator.isLength(data, {
      min: 0,
      max: parseFloat(ruleValue),
    });
    let msg = "";

    if (!result)
      msg =
        errorMessages.maxLen ||
        `${StartCase(fieldName)} allows only ${ruleValue} charectors`;
    return {
      success: result,
      msg: msg,
      stopPropogation: true,
    };
  }

  validate_minLen(data, ruleValue, fieldName, errorMessages) {
    data = data.toString();
    let result = Validator.isLength(data, {
      min: parseFloat(ruleValue),
    });
    let msg = "";

    if (!result)
      msg =
        errorMessages.minLen ||
        `${StartCase(fieldName)} should be ${ruleValue} charectors more`;
    return {
      success: result,
      msg: msg,
      stopPropogation: true,
    };
  }

  validate_minVal(data, ruleValue, fieldName, errorMessages) {
    let d = parseFloat(data);
    let result = d >= parseFloat(ruleValue);
    let msg = "";

    if (!result)
      msg =
        errorMessages.minVal ||
        `${StartCase(fieldName)} should have minimum ${ruleValue} character`;

    return {
      success: result,
      msg: msg,
      stopPropogation: false,
    };
  }

  validate_email(data, ruleValue, fieldName, errorMessages) {
    let result = Validator.isEmail(data);
    let msg = "";
    if (!result)
      msg =
        errorMessages.email ||
        `${StartCase(fieldName)} must be a valid email address.`;

    return {
      success: result,
      msg: msg,
      stopPropogation: true,
    };
  }

  validate_url(data, ruleValue, fieldName, errorMessages) {
    // eslint-disable-next-line
    const validateREgx =
      /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

    let result = data.match(validateREgx) ? true : false;
    let msg = "";

    if (!result)
      msg =
        errorMessages.url || `${StartCase(fieldName)} should have valid Url`;

    return {
      success: result,
      msg: msg,
      stopPropogation: false,
    };
  }
}

export default new FieldValidation();
