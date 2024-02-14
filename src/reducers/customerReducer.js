export default function reducer(
  state = {
    customerInfo: {},
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_CUSTOMER_PENDING": {
      return {
        ...state,
        fetching: true,
      };
    }
    case "FETCH_CUSTOMER_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_CUSTOMER_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        customerInfo: action.payload.data,
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
      };
    }
    default: {
      return { ...state };
    }
  }
}
