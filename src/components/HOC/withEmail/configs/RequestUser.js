import BaseConfig from "./BaseConfig";
import _ from "lodash";
export default class RequestUser extends BaseConfig {
  transformToAddress(address = []) {
    return [
      ...address,
      _.get(
        this,
        "customerSolutionsRepresentatives[0].email",
        this.config.defaultCSREmailAddress,
      ),
    ];
  }

  getCopyReciepients() {
    return this.config.defaultCCmailAddresses;
  }
}
