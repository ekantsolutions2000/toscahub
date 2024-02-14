import returnRequest from "./configs/ReturnRequest";
import requestUser from "./configs/RequestUser";
import contactMail from "./configs/ContactEmail";
import proofOfDelivery from "./configs/ProofOfDelivery";
import addLocationRequest from "./configs/AddLocationRequest";
import quoteRequest from "./configs/QuoteRequest";
import expeditedOrder from "./configs/ExpeditedOrder";
import useCsrs from "../../../hooks/CustomerProfile/useGetCustomerSolutionsRepresentatives";
import useGetInventories from "../../../hooks/Inventory/useGetInventories";
import useGetSalespersons from "../../../hooks/CustomerProfile/useGetSalespersons";

export const emailConfigs = {
  RETURN_REQUEST: "ReturnRequest",
  REQUEST_USER: "RequestUser",
  CONTACT_MAIL: "ContactMail",
  PROOF_OF_DELIVERY: "ProofOfDelivery",
  ADD_LOCATION_REQUEST: "AddLocationRequest",
  QUOTE_REQUEST: "quoteRequest",
  EXPEDITED_ORDER: "ExpeditedOrder",
};

const emailConfigMap = {
  [emailConfigs.RETURN_REQUEST]: returnRequest,
  [emailConfigs.REQUEST_USER]: requestUser,
  [emailConfigs.CONTACT_MAIL]: contactMail,
  [emailConfigs.PROOF_OF_DELIVERY]: proofOfDelivery,
  [emailConfigs.ADD_LOCATION_REQUEST]: addLocationRequest,
  [emailConfigs.QUOTE_REQUEST]: quoteRequest,
  [emailConfigs.EXPEDITED_ORDER]: expeditedOrder,
};

export const EmailConfigHelper = (props) => {
  let { configName } = props;

  let csrsQuery = useCsrs();
  let inventoriesQuery = useGetInventories({ outbound: true });
  let salespersonsQuery = useGetSalespersons();

  const customerSolutionsRepresentatives =
    csrsQuery.status === "success" ? csrsQuery.data.data : [];
  const {
    data: inventories,
    commodityTypes,
    commodityType,
  } = inventoriesQuery?.data;
  const salespersons =
    salespersonsQuery.status === "success" ? salespersonsQuery.data.data : [];

  const commodityTypesList = props.commodityTypes
    ? props.commodityTypes
    : commodityTypes;

  const emailConfig = new emailConfigMap[configName]({
    inventories,
    customerSolutionsRepresentatives,
    commodityType,
    commodityTypes: commodityTypesList || [], //Commodity type from props
    salespersons,
  });

  return props.children(emailConfig);
};
