import { createStore, applyMiddleware } from "redux";
// import { sessionService } from "redux-react-session";
import { sessionService } from "./auth-service/index";
import { logger } from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import reducers from "./reducers";
import { config } from "./utils/conf";

const loggerMiddleware = config.isProd ? [] : [logger];
const rejected = {};

const restrictFailedAPIcallsMiddleware = (storeAPI) => (next) => (action) => {
  if (action.type.includes("REJECTED")) {
    rejected[action.type] = (rejected[action.type] || 0) + 1;
  }

  if (action.type.includes("_FULFILLED")) {
    delete rejected[action.type.replace("_FULFILLED", "_REJECTED")];
  }

  if (rejected[action.type] === undefined || rejected[action.type] <= 2) {
    if (rejected[action.type] !== undefined && rejected[action.type] > 0) {
      setTimeout(() => {
        return next(action);
      }, 500);
    } else {
      return next(action);
    }
  }
};

const middleware = applyMiddleware(
  promise,
  thunk,
  restrictFailedAPIcallsMiddleware,
  ...loggerMiddleware,
);
const store = createStore(reducers, middleware);

sessionService.initSessionService(store);

export default store;
