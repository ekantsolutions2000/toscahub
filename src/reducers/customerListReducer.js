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
    case "FETCH_CUSTOMERS_PENDING": {
      return {
        ...state,
        fetching: true,
      };
    }
    case "FETCH_CUSTOMERS_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_CUSTOMERS_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        customers: enrich(action.payload.data),
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

function enrich(data) {
  return data.map((customer) => ({
    ...customer,
    organizationId: customer.id,
    organizationName: customer.name,
  }));
}
