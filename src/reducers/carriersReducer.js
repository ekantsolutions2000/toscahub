export default function reducer(
  state = {
    carrierList: [],
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_CARRIER_LIST_PENDING": {
      return {
        ...state,
        fetching: true,
      };
    }
    case "FETCH_CARRIER_LIST_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_CARRIER_LIST_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        carrierList: action.payload.data,
        error: null,
      };
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
