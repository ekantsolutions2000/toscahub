export default function reducer(
  state = {
    response: null,
    sending: false,
    sent: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "SEND_EMAIL_PENDING": {
      return {
        ...state,
        sending: true,
        sent: false,
      };
    }
    case "SEND_EMAIL_REJECTED": {
      return {
        ...state,
        sending: false,
        sent: false,
        error: action.payload,
      };
    }
    case "SEND_EMAIL_FULFILLED": {
      return {
        ...state,
        sending: false,
        sent: true,
        response: action.payload,
        error: null,
      };
    }
    case "RESET_EMAIL": {
      return {
        response: null,
        sending: false,
        sent: false,
        error: null,
      };
    }
    default: {
      return { ...state };
    }
  }
}
