export default function reducer(
  state = {
    updating: false,
    updated: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "PASSWORD_UPDATE_PENDING": {
      return {
        ...state,
        updating: true,
        updated: false,
        error: null,
      };
    }
    case "PASSWORD_UPDATE_REJECTED": {
      return {
        ...state,
        updating: false,
        updated: false,
        error: action.payload,
      };
    }
    case "PASSWORD_UPDATE_FULFILLED": {
      return {
        ...state,
        updated: true,
        updating: false,
        error: null,
      };
    }
    default: {
      return { ...state };
    }
  }
}
