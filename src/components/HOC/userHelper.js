import _ from "lodash";
import { config } from "./../../utils/conf";
import Transformer from "./../../utils/Transform";

export default class userHelper {
  constructor(user) {
    Object.assign(this, user);
    this.transformFromLocations(user);
    this.transformRPCs(user);
  }

  transformRPCs(user) {
    this["_OrderInventory"] = [];
    let list = _.get(user, "OrderInventory", []);

    this._OrderInventory = Transformer.transform(list)
      .process((itm) => {
        itm["value"] = itm.ItemKey;
        itm["displayValue"] = `${itm.CR_Item_Code} - ${itm.ItemClassID}`;
        return itm;
      })
      .get();
  }

  transformFromLocations(user) {
    this["_ShipFromLocationss"] = [];
    const locations = _.get(user, "ShipFromLocation", []);
    const transformer = Transformer.transform(locations);

    transformer.process((itm) => {
      itm["value"] = itm.from_address_key;
      itm["label"] = itm.AddressName;
      itm["contactPerson"] = "NA";
      itm["contactEmail"] = "NA";
      itm["contactPhone"] = "NA";
      itm[
        "shipFromAddress"
      ] = `${itm.StreetName1}, ${itm.CityCode}, ${itm.State}, ${itm.ZipCode}, ${itm.CountryCode}`;
      return itm;
    });

    const items = transformer.get();
    this["_ShipFromLocationss"] = [...items];
  }

  getCommodityType() {
    let item =
      this._OrderInventory.filter(
        (i) => i.ItemClassID.toLocaleLowerCase() !== "nopalletitem",
      )[0] || {};
    return _.get(item, "ItemClassID", undefined);
  }

  getAllCommodityTypes() {
    let ids = this._OrderInventory.map((i) => i.ItemClassID);
    return Array.from(new Set([...ids]));
  }

  getCSREmail() {
    let addresses = _.get(this, "Addresses", []);
    let result = config.defaultCSREmailAddress;

    addresses.some((address) => {
      if (address.CSREmail) {
        result = address.CSREmail;
        return true;
      }
      return false;
    });
    return result;
  }

  getSperEmail() {
    let addresses = _.get(this, "Addresses", []);
    let result = "customerreporting@toscaltd.com";

    addresses.some((address) => {
      if (address.SperEmail) {
        result = address.SperEmail;
        return true;
      }
      return false;
    });
    return result;
  }

  getShipFromLocations() {
    return this._ShipFromLocationss;
  }

  getCustomerKey() {
    return _.get(this, "CustomerInfo.CustKey", 0);
  }

  isLoggedIn() {
    return _.get(this, "accessToken", undefined) ? true : false;
  }
}
