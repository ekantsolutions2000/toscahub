export default function reducer(
  state = {
    sourceAddressList: [],
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_SOURCE_ADDRESS_LIST_PENDING": {
      return {
        ...state,
        fetching: true,
      };
    }
    case "FETCH_SOURCE_ADDRESS_LIST_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_SOURCE_ADDRESS_LIST_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        sourceAddressList: action.payload.data,
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
