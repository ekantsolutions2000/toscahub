import _ from "lodash";

const STATUS = {
  LOADING: "loading",
  ERROR: "error",
  SUCCESS: "success",
};

export default function reducer(
  state = {
    orders: [],
    newOrder: {},
    fetching: false,
    fetched: false,
    error: null,
    submitting: false,
    submitted: false,
    validationStatus: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_ORDERS_PENDING": {
      return {
        ...state,
        fetching: true,
      };
    }
    case "FETCH_ORDERS_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_ORDERS_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        orders: transformOrders(action.payload.data),
        error: null,
      };
    }
    case "SUBMIT_ORDER": {
      return {
        ...state,
        newOrder: action.payload,
      };
    }
    case "SUBMIT_ORDER_PENDING": {
      return {
        ...state,
        submitting: true,
      };
    }
    case "SUBMIT_ORDER_REJECTED": {
      return {
        ...state,
        submitting: false,
        submitted: false,
        error: action.payload,
      };
    }
    case "SUBMIT_ORDER_FULFILLED": {
      return {
        ...state,
        submitting: false,
        submitted: true,
        newOrder: action.payload.data,
        error: null,
      };
    }
    case "CANCEL_ORDER": {
      return {
        ...state,
        orders: [],
      };
    }
    case "VALIDATE_ORDER_PENDING": {
      return {
        ...state,
        validationStatus: STATUS.LOADING,
      };
    }
    case "VALIDATE_ORDER_REJECTED": {
      return {
        ...state,
        validationStatus: STATUS.ERROR,
        error: action.payload,
      };
    }
    case "VALIDATE_ORDER_FULFILLED": {
      return {
        ...state,
        validationStatus: STATUS.SUCCESS,
        error: null,
      };
    }
    case "RESET_STATE": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        submitting: false,
        submitted: false,
        error: null,
        validationStatus: null,
      };
    }
    default: {
      return { ...state };
    }
  }
}

const EXCLUDED_CONTAINERS = [
  "WW-PALLET",
  "BC-PALLET",
  "PECO-PALLET",
  "IGPS-PALLET",
  "PALLET",
];

function transformOrders(orders) {
  let result = orders
    .map((order) => {
      order.statusDesc =
        order.statusDesc === "Accounting Hold" ? "Pending" : order.statusDesc;
      order.orderNumberRaw = order.orderNumber;
      if (order.billOfLading) {
        order.billOfLadingRaw = order.billOfLading;
      }
      return order;
    })
    .filter(
      (order) =>
        order.containerType &&
        !EXCLUDED_CONTAINERS.includes(
          (order.containerType || "").toUpperCase(),
        ) &&
        order.containerType.charAt(0) !== "S",
    );

  return _.orderBy(result, "orderDate", "desc");
}
