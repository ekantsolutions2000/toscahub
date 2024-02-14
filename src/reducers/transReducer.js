export default function reducer(
  state = {
    pendingTrans: [],
    fetching: false,
    fetched: false,
    posting: false,
    posted: false,
    committing: false,
    committed: false,
    updating: false,
    updated: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_TRANS_PENDING": {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case "FETCH_TRANS_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_TRANS_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        pendingTrans: action.payload.data,
      };
    }
    case "SUBMIT_TRANS_PENDING": {
      return {
        ...state,
        posting: true,
        posted: false,
      };
    }
    case "SUBMIT_TRANS_REJECTED": {
      return {
        ...state,
        posting: false,
        posted: false,
        error: action.payload,
      };
    }
    case "SUBMIT_TRANS_FULFILLED": {
      return {
        ...state,
        posting: false,
        posted: true,
      };
    }
    case "COMMIT_TRANS_PENDING": {
      return {
        ...state,
        committing: true,
        committed: false,
      };
    }
    case "COMMIT_TRANS_REJECTED": {
      return {
        ...state,
        committing: false,
        committed: false,
        error: action.payload,
      };
    }
    case "COMMIT_TRANS_FULFILLED": {
      return {
        ...state,
        committing: false,
        committed: true,
        pendingTrans: [],
      };
    }
    case "DELETE_TRANS_CACHE_PENDING": {
      return {
        ...state,
      };
    }
    case "DELETE_TRANS_CACHE_REJECTED": {
      return {
        ...state,
        error: action.payload,
      };
    }
    case "DELETE_TRANS_CACHE_FULFILLED": {
      return {
        ...state,
      };
    }
    case "DELETE_PENDING_TRANS_PENDING": {
      return {
        ...state,
        deleting: true,
        deleted: false,
      };
    }
    case "DELETE_PENDING_TRANS_REJECTED": {
      return {
        ...state,
        error: action.payload,
        deleting: false,
        deleted: false,
      };
    }
    case "DELETE_PENDING_TRANS_FULFILLED": {
      return {
        ...state,
        pendingTrans: state.pendingTrans.filter(
          (e) => e._id !== action.payload,
        ),
        deleting: false,
        deleted: true,
      };
    }
    case "UPDATE_PENDING_TRANS_PENDING": {
      return {
        ...state,
        updating: true,
        updated: false,
      };
    }
    case "UPDATE_PENDING_TRANS_REJECTED": {
      return {
        ...state,
        updating: false,
        updated: false,
      };
    }
    case "UPDATE_PENDING_TRANS_FULFILLED": {
      return {
        ...state,
        updating: false,
        updated: true,
      };
    }
    default: {
      return { ...state };
    }
  }
}
