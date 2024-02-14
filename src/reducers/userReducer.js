import { getUser } from "../utils/JwtService";
import _ from "lodash";

export default function reducer(
  state = {
    userName: "",
    accessToken: null,
    isLoggedIn: false,
    fetching: false,
    fetched: false,
    error: null,
    users: [],
    submittingNewUser: false,
    submittedNewUser: false,
    errorSubmittedNewUser: null,
    changeOrgFetching: false,
    changeOrgFetched: false,
    changeOrgError: null,
    authorized: false,
    authorizing: false,
  },
  action,
) {
  switch (action.type) {
    case "AUTHORIZATION_PENDING":
      return {
        ...state,
        authorizing: true,
      };
    case "AUTHORIZATION_REJECTED":
      return {
        ...state,
        authorizing: false,
        authorized: false,
      };
    case "AUTHORIZATION_FULFILLED":
      return {
        ...state,
        authorizing: false,
        authorized: true,
      };
    case "CHANGE_ORGANIZATION_PENDING": {
      return {
        ...state,
        changeOrgFetching: true,
        changeOrgFetched: false,
        changeOrgError: null,
      };
    }
    case "CHANGE_ORGANIZATION_REJECTED": {
      return {
        ...state,
        changeOrgFetching: false,
        changeOrgFetched: false,
        changeOrgError: action.payload,
      };
    }
    case "CHANGE_ORGANIZATION_FULFILLED": {
      return {
        ...state,
        changeOrgFetching: false,
        changeOrgFetched: true,
        changeOrgError: null,
      };
    }

    case "RESET_CHANGE_ORG_STATE": {
      return {
        ...state,
        changeOrgFetching: false,
        changeOrgFetched: false,
        changeOrgError: null,
      };
    }

    case "LOGIN_PENDING": {
      return {
        ...state,
        fetching: true,
        isLoggedIn: false,
      };
    }
    case "LOGIN_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        isLoggedIn: false,
        error: action.payload.response
          ? action.payload.response.data
          : "Connection timed out. Please try again Later.",
      };
    }
    case "LOGIN_FULFILLED": {
      let accessToken = action.payload ? action.payload.data.accessToken : "";
      return {
        ...state,
        userName: accessToken ? getUser(accessToken).UserName : "",
        fetching: false,
        fetched: true,
        accessToken: accessToken,
        isLoggedIn: true,
        showLogin: false,
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        accessToken: null,
        isLoggedIn: false,
        showLogin: true,
      };
    }
    case "ACK_ERROR": {
      return {
        ...state,
        error: null,
      };
    }
    case "USER_FETCH_ALL_PENDING": {
      return {
        ...state,
        fetchingUsers: true,
        fetchedUsers: false,
        errorFetchingUsers: null,
      };
    }
    case "USER_FETCH_ALL_REJECTED": {
      return {
        ...state,
        fetchingUsers: false,
        fetchedUsers: false,
        errorFetchingUsers: action.payload,
      };
    }
    case "USER_FETCH_ALL_FULFILLED": {
      return {
        ...state,
        fetchingUsers: false,
        fetchedUsers: true,
        errorFetchingUsers: null,
        users: transformUsers(action.payload.data),
      };
    }

    case "ROLES_FETCH_ALL_PENDING": {
      return {
        ...state,
        fetchingRoles: true,
        fetchedRoles: false,
        errorFetchingRoles: null,
      };
    }
    case "ROLES_FETCH_ALL_REJECTED": {
      return {
        ...state,
        fetchingRoles: false,
        fetchedRoles: false,
        errorFetchingRoles: action.payload,
      };
    }
    case "ROLES_FETCH_ALL_FULFILLED": {
      return {
        ...state,
        fetchingRoles: false,
        fetchedRoles: true,
        errorFetchingRoles: null,
        roles: action.payload.data,
      };
    }

    case "LOCATION_FETCH_ALL_PENDING": {
      return {
        ...state,
        fetchingLocations: true,
        fetchedLocations: false,
        errorFetchingLocations: null,
      };
    }
    case "LOCATION_FETCH_ALL_REJECTED": {
      return {
        ...state,
        fetchingLocations: false,
        fetchedLocations: false,
        errorFetchingLocations: action.payload,
      };
    }
    case "LOCATION_FETCH_ALL_FULFILLED": {
      return {
        ...state,
        fetchingLocations: false,
        fetchedLocations: true,
        errorFetchingLocations: null,
        locations: action.payload.data,
      };
    }

    case "COLLECTION_SITES_FETCH_ALL_PENDING": {
      return {
        ...state,
        fetchingCollectionSites: true,
        fetchedCollectionSites: false,
        errorFetchingCollectionSites: null,
      };
    }
    case "COLLECTION_SITES_FETCH_ALL_REJECTED": {
      return {
        ...state,
        fetchingCollectionSites: false,
        fetchedCollectionSites: false,
        errorFetchingCollectionSites: action.payload,
      };
    }
    case "COLLECTION_SITES_FETCH_ALL_FULFILLED": {
      return {
        ...state,
        fetchingCollectionSites: false,
        fetchedCollectionSites: true,
        errorFetchingCollectionSites: null,
        collectionSites: transformCollectionSites(action.payload.data),
      };
    }

    case "SUBMIT_NEW_USER": {
      return {
        ...state,
        newUser: action.payload,
      };
    }
    case "SUBMIT_NEW_USER_PENDING": {
      return {
        ...state,
        submittingNewUser: true,
      };
    }
    case "SUBMIT_NEW_USER_REJECTED": {
      return {
        ...state,
        submittingNewUser: false,
        submittedNewUser: false,
        errorSubmittedNewUser: action.payload.response.data,
      };
    }
    case "SUBMIT_NEW_USER_FULFILLED": {
      return {
        ...state,
        submittingNewUser: false,
        submittedNewUser: true,
        newUser: action.payload.data,
        errorSubmittedNewUser: null,
      };
    }

    case "SUBMIT_DELETE_USER": {
      return {
        ...state,
        deleteUser: action.payload,
      };
    }
    case "SUBMIT_DELETE_USER_PENDING": {
      return {
        ...state,
        submittingDeleteUser: true,
      };
    }
    case "SUBMIT_DELETE_USER_REJECTED": {
      return {
        ...state,
        submittingDeleteUser: false,
        submittedDeleteUser: false,
        errorSubmittedDeleteUser: action.payload.response.data,
      };
    }
    case "SUBMIT_DELETE_USER_FULFILLED": {
      return {
        ...state,
        submittingDeleteUser: false,
        submittedDeleteUser: true,
        errorSubmittedDeleteUser: null,
      };
    }

    case "RESET_STATE": {
      return {
        ...state,
        submittingNewUser: false,
        submittedNewUser: false,
        errorSubmittedNewUser: null,
      };
    }

    default: {
      return { ...state };
    }
  }
}

const transformUsers = (users) => {
  const result = users.result.map((user) => {
    return { ...user, fullName: `${user.firstName + " " + user.lastName}` };
  });

  const sortedUsers = _.orderBy(result, ["fullName", "id"], ["asc", "asc"]);
  return sortedUsers;
};

const transformCollectionSites = (collectionSites) => {
  const organizations = collectionSites.map((organization) => {
    return {
      organizationId: organization.customerId,
      organizationName: organization.customerName,
    };
  });

  return organizations;
};
