import * as URL from "./Url";
import {
  CopDashboard,
  CollectionOrders,
  Locations,
  Resources,
} from "../../../screens";

const pages = {
  [URL.ROOT]: CopDashboard,
  [URL.COLLECTION_ORDERS]: CollectionOrders.ViewOrders,
  [URL.COLLECTION_ORDERS_NEW]: CollectionOrders.PlaceOrder,
  [URL.RESOURCES_CUSTOMER_SERVICE]: Resources.InboundCustomerService,
  [URL.ACCOUNT_LOCATIONS]: Locations.InboundLocation,
};

export default pages;
