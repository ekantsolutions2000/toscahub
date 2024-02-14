export default function reducer(
  state = {
    newCustomer: [],
    fetching: false,
    fetched: false,
    error: null,
    countries: [],
    countriesFetching: false,
    countriesFetched: false,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_NEW_CUSTOMER_DATA_PENDING": {
      return {
        ...state,
        fetching: true,
      };
    }
    case "FETCH_NEW_CUSTOMER_DATA_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_NEW_CUSTOMER_DATA_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        newCustomer: transformData(action.payload.data),
        error: null,
      };
    }
    case "SAVE_LATER_NEW_CUSTOMER_DATA_PENDING": {
      return {
        ...state,
        saving: true,
      };
    }
    case "SAVE_LATER_NEW_CUSTOMER_DATA_REJECTED": {
      return {
        ...state,
        saving: false,
        saved: false,
        error: action.payload,
      };
    }
    case "SAVE_LATER_NEW_CUSTOMER_DATA_FULFILLED": {
      return {
        ...state,
        saving: false,
        saved: true,
        error: null,
      };
    }
    case "UPDATE_SAVE_LATER_NEW_CUSTOMER_DATA_PENDING": {
      return {
        ...state,
        saving: true,
      };
    }
    case "UPDATE_SAVE_LATER_NEW_CUSTOMER_DATA_REJECTED": {
      return {
        ...state,
        saving: false,
        saved: false,
        error: action.payload,
      };
    }
    case "UPDATE_SAVE_LATER_NEW_CUSTOMER_DATA_FULFILLED": {
      return {
        ...state,
        saving: false,
        saved: true,
        error: null,
      };
    }
    case "SUBMIT_NEW_CUSTOMER_DATA_PENDING": {
      return {
        ...state,
        submitting: true,
      };
    }
    case "SUBMIT_NEW_CUSTOMER_DATA_REJECTED": {
      return {
        ...state,
        submitting: false,
        submitted: false,
        error: action.payload,
      };
    }
    case "SUBMIT_NEW_CUSTOMER_DATA_FULFILLED": {
      return {
        ...state,
        submitting: false,
        submitted: true,
        error: null,
      };
    }

    case "GET_CUSTOMER_PROFILE_COUNTRIES_PENDING": {
      return {
        ...state,
        countriesFetching: true,
      };
    }
    case "GET_CUSTOMER_PROFILE_COUNTRIES_REJECTED": {
      return {
        ...state,
        countriesFetching: false,
        countriesFetched: false,
        error: action.payload,
      };
    }
    case "GET_CUSTOMER_PROFILE_COUNTRIES_FULFILLED": {
      return {
        ...state,
        countriesFetching: false,
        countriesFetched: true,
        countries: action.payload.data,
        error: null,
      };
    }

    default: {
      return { ...state };
    }
  }
}

function transformData(data) {
  if (data) {
    return JSON.parse(data.dataValue);
  }
  return [];
}
