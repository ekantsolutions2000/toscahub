export default function reducer(
  state = {
    orders: [],
    newOrder: {},
    fetching: false,
    fetched: false,
    error: null,
    submitting: false,
    submitted: false,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_COLLECTION_ORDERS_PENDING": {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case "FETCH_COLLECTION_ORDERS_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_COLLECTION_ORDERS_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        orders: action.payload.data,
        error: null,
      };
    }
    case 'FETCH_COLLECTIONS_PENDING': {
      return {
        ...state,
        fetching: true,
        fetched: false,
      }
    }
    case 'FETCH_COLLECTIONS_REJECTED': {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }
    case 'FETCH_COLLECTIONS_FULFILLED': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        collectionOrders: action.payload.data,
        error: null,
      }
    }
    case 'SUBMIT_COLLECTION_ORDER': {
      return {
        ...state,
        newOrder: action.payload,
      };
    }
    case "SUBMIT_COLLECTION_ORDER_PENDING": {
      return {
        ...state,
        submitting: true,
        submitted: false,
        error: null,
      };
    }
    case "SUBMIT_COLLECTION_ORDER_REJECTED": {
      return {
        ...state,
        submitting: false,
        submitted: false,
        error: action.payload,
      };
    }
    case "SUBMIT_COLLECTION_ORDER_FULFILLED": {
      return {
        ...state,
        submitting: false,
        submitted: true,
        newOrder: action.payload.data,
        error: null,
      };
    }
    case "CANCEL_COLLECTION_ORDER": {
      return {
        ...state,
        orders: [],
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
      };
    }
    default: {
      return { ...state };
    }
  }
}
