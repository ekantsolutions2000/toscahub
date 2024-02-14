import _ from "lodash";
import BaseConfig from "./BaseConfig";

export default class QuoteRequest extends BaseConfig {
  transformToAddress(address = []) {
    return [...address, _.get(this.salespersons, "[0].email", "")];
  }

  getCopyReciepients() {
    return this.config.defaultCCmailAddresses;
  }
}
