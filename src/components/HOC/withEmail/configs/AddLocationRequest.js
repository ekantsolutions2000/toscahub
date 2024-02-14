import BaseConfig from "./BaseConfig";
import _ from "lodash";

export default class AddLocationRequest extends BaseConfig {
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

  lablel() {
    return (
      this.toAddressMap[this.commodityType] ||
      this.config.defaultCSREmailAddress
    );
  }
}
