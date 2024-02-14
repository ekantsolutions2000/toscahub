export default function reducer(
  state = {
    transactionSummary: {},
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_TRANSACTION_SUMMARY_PENDING": {
      return {
        ...state,
        fetching: true,
      };
    }
    case "FETCH_TRANSACTION_SUMMARY_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_TRANSACTION_SUMMARY_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        transactionSummary: action.payload.data,
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
