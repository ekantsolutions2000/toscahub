import BaseConfig from "./BaseConfig";

// - Old config used on return request page -
// const recipients = 'customerreporting@toscaltd.com';
// const copyRecipients = `${config.defaultCCmailAddresses}, customerexperience@toscaltd.com, dl_eggsupplychain@toscaltd.com, dl_producesupplychain@toscaltd.com`;

export default class ReturnRequest extends BaseConfig {
  //concadinate the old address; Remove once confirmed.
  transformToAddress(addresses = []) {
    return [...addresses, "customerreporting@toscaltd.com"];
  }

  getCopyReciepients() {
    return `${this.config.defaultCCmailAddresses}, customerexperience@toscaltd.com`;
  }
}
