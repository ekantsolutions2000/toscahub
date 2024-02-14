import * as URL from "./Url";
import {
  Home,
  Ordering,
  Invoicing,
  Locations,
  Resources,
  NewCustomerSetup,
} from "../../../screens";

const pages = {
  [URL.ROOT]: Home,
  [URL.ORDERING]: Ordering.Ordering,
  [URL.ORDERING_NEW_SINGLE_ORDER]: Ordering.PlaceOrder,
  [URL.ORDERING_NEW_BULK_ORDER]: Ordering.PlaceBulkOrder,
  [URL.ORDERING_VIEW]: Ordering.ViewOrders,
  [URL.INVOICING]: Invoicing,
  [URL.ORDERING_REQUEST_QUOTE]: Ordering.RequestQuote,
  [URL.RESOURCES_CUSTOMER_SERVICE]: Resources.OutboundCustomerService,
  [URL.ACCOUNT_LOCATIONS]: Locations.OutboundLocation,
  [URL.NEW_CUSTOMER_SETUP]: NewCustomerSetup,
};

export default pages;
