import BaseConfig from "./BaseConfig";

export default class ContactEmail extends BaseConfig {
  fallBackToAddress = ["CustomerExperience@toscaltd.com"];

  transformToAddress(address = []) {
    return [...address, this.fallBackToAddress];
  }

  lablel() {
    return this.toAddressMap[this.commodityType] || this.fallBackToAddress;
  }
}
