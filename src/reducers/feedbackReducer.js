export default function reducer(
  state = {
    submitting: false,
    submitted: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "SUBMIT_FEEDBACK_PENDING": {
      return {
        ...state,
        submitting: true,
        error: null,
        submitted: false,
      };
    }
    case "SUBMIT_FEEDBACK_REJECTED": {
      return {
        ...state,
        submitting: false,
        submitted: false,
        error: action.payload.response.data,
      };
    }
    case "SUBMIT_FEEDBACK_FULFILLED": {
      return {
        ...state,
        submitting: false,
        submitted: true,
        error: null,
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
