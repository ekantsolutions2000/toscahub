import { combineReducers } from "redux";
// import { sessionReducer as session } from "redux-react-session";
import { sessionReducer as session } from "./../auth-service/index";
import statusReducer from "./statusReducer";
import orders from "./orderReducer";
import invoices from "./invoiceReducer";
import transactions from "./transReducer";
import transactionReportList from "./transactionReportReducer";
import shipToAddresses from "./shipToReducer";
import passwordUpdate from "./authenticationReducer";
import login from "./userReducer";
import sendEmail from "./emailReducer";
import statistics from "./statisticsReducer";
import sourceAddresses from "./sourceAddressesReducer";
import contacts from "./contactsReducer";
import carriers from "./carriersReducer";
import organizations from "./organizationsReducer";
import customers from "./customerListReducer";
import logs from "./logsReducer";
import bulkOrderLog from "./bulkOrderLogsReducer";
import returnRequest from "./returnRequestReducer";
import feedback from "./feedbackReducer";
import collectionOrders from "./collectionOrderReducer";
import orderInventory from "./orderInventoryReducer";
import newCustomer from "./newCustomerReducer";
import customer from "./customerReducer";

const appReducer = combineReducers({
  statusReducer,
  session,
  orders,
  invoices,
  transactions,
  transactionReportList,
  shipToAddresses,
  passwordUpdate,
  login,
  sendEmail,
  statistics,
  sourceAddresses,
  contacts,
  carriers,
  organizations,
  customers,
  logs,
  bulkOrderLog,
  returnRequest,
  feedback,
  collectionOrders,
  orderInventory,
  newCustomer,
  customer,
});

const reducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default reducer;
