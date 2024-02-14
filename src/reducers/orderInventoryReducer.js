import { config } from "../utils/conf";

export default function reducer(
  state = {
    orderInventory: [],
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_ORDER_INVENTORY_PENDING": {
      return {
        ...state,
        fetching: true,
      };
    }
    case "FETCH_ORDER_INVENTORY_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_ORDER_INVENTORY_FULFILLED": {
      let orderInventory = {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
      };

      orderInventory.orderInventory = enrich(action.payload.data);
      if (config.excludeCleanPal) {
        orderInventory.orderInventory = orderInventory.orderInventory.filter(
          (i) => i.itemClassId.toLocaleLowerCase() !== "nopalletitem",
        );
      }

      return orderInventory;
    }

    case "RESET_STATE": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: null,
      };
    }

    default: {
      return { ...state };
    }
  }
}

function enrich(orderInventory) {
  orderInventory.forEach((item) => {
    item.value = item.itemId;
    item.displayValue = item.crItemCode + " - " + item.itemClassId;
    // delete item.itemKey
  });

  return orderInventory;
}
