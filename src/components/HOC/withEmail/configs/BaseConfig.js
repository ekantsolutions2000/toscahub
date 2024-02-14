import * as CommodityTypes from "../../../../utils/CommodityTypes";
import { config } from "../../../../utils/conf";

const checkEmailOverride = (emails) => {
  return config.emailDistributionOverride
    ? [config.emailDistributionOverride]
    : emails;
};

export default class BaseConfig {
  constructor(props) {
    this.inventories = props.inventories;
    this.customerSolutionsRepresentatives =
      props.customerSolutionsRepresentatives;
    this.commodityTypes = props.commodityTypes;
    this.commodityType = props.commodityType;
    this.salespersons = props.salespersons;
  }

  config = config;

  fallBackToAddress = ["CustomerExperience@toscaltd.com"];

  toAddressMap = {
    [CommodityTypes.EGG]: ["DL_EggSupplyChain@toscaltd.com"],
    [CommodityTypes.PRODUCE]: ["DL_ProduceSupplyChain@toscaltd.com"],
    [CommodityTypes.SIX_FOUR_ZERO]: ["DL_ProteinSupplyChain@toscaltd.com"],
    [CommodityTypes.SPINACH]: ["DL_ProteinSupplyChain@toscaltd.com"],
    [CommodityTypes.HAND_HELD]: ["DL_ProteinSupplyChain@toscaltd.com"],
    [CommodityTypes.POULTRY]: ["PoultrySupplyChain@toscaltd.com"],
    [CommodityTypes.SEAFOOD]: ["SeafoodSupplyChain@toscaltd.com"],
  };

  transformToAddress(addresses = []) {
    return addresses;
  }

  getReciepients() {
    let add = [];

    this.commodityTypes.forEach((t) => {
      add = [...add, ...(this.toAddressMap[t] || [])];
    });

    add = Array.from(new Set(add));

    let toAddress = this.transformToAddress(add);
    toAddress =
      toAddress && toAddress.length ? toAddress : this.fallBackToAddress;

    toAddress = checkEmailOverride(toAddress);
    return toAddress.join(";");
  }

  getCopyReciepients() {
    let result = config.defaultCCmailAddresses;
    return result;
  }
}
