export default function reducer(
  state = {
    addresses: [],
    newShipTos: [],
    fetching: false,
    fetched: false,
    submitting: false,
    submitted: false,
    fetchingNew: false,
    fetchedNew: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_ADDYS_PENDING": {
      return {
        ...state,
        fetching: true,
      };
    }
    case "FETCH_ADDYS_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_ADDYS_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        addresses: action.payload.data.map((address, index) => ({
          ...address,
          id: address.addressId || address.pendingRequestId,
        })),
        newShipTos: [],
      };
    }
    case "SUBMIT_SHIPTO_PENDING": {
      return {
        ...state,
        submitting: true,
        submitted: false,
      };
    }
    case "SUBMIT_SHIPTO_REJECTED": {
      return {
        ...state,
        submitting: false,
        submitted: false,
        error: action.payload,
      };
    }
    case "SUBMIT_SHIPTO_FULFILLED": {
      return {
        ...state,
        submitting: false,
        submitted: true,
      };
    }
    case "DELETE_NEWSHIPTO_CACHE_PENDING": {
      return {
        ...state,
      };
    }
    case "DELETE_NEWSHIPTO_CACHE_REJECTED": {
      return {
        ...state,
        error: action.payload,
      };
    }
    case "DELETE_NEWSHIPTO_CACHE_FULFILLED": {
      return {
        ...state,
        newShipTos: [],
      };
    }
    default: {
      return { ...state };
    }
  }
}
