import BaseConfig from "./BaseConfig";

export default class ExpeditedOrder extends BaseConfig {
  getCopyReciepients() {
    return "ToscaCorpAccountsReceivableAll@toscaltd.com";
  }
}
