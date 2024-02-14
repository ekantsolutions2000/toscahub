export default function reducer(
  state = {
    submitting: false,
    submitted: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "SUBMIT_RETURN_REQUEST_PENDING": {
      return {
        ...state,
        submitting: true,
      };
    }
    case "SUBMIT_RETURN_REQUEST_REJECTED": {
      return {
        ...state,
        submitting: false,
        error: action.payload,
      };
    }
    case "SUBMIT_RETURN_REQUEST_FULFILLED": {
      return {
        ...state,
        submitting: false,
        submitted: true,
      };
    }
    case "RESET_STATE": {
      return {
        ...state,
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
