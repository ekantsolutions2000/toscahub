import localForage from "localforage";
import reducer from "./reducer";
import { USER_SESSION, USER_DATA } from "./constants";
import {
  getSessionSuccess,
  getSessionError,
  getUserSessionSuccess,
  getUserSessionError,
} from "./actions";

let instance;

export class sessionService {
  constructor(store, options) {
    instance = this;
    instance.store = store;
    instance.storage = localForage.createInstance({
      name: "tosca-session",
      driver: localForage.LOCALSTORAGE,
    });
    return instance;
  }

  static initSessionService(store, options) {
    instance = new sessionService(store, options);
    return sessionService.refreshFromLocalStorage();
  }

  static refreshFromLocalStorage() {
    return sessionService
      .loadSession()
      .then((session) => {
        return sessionService.attemptLoadUser();
      })
      .catch((err) => {
        instance.store.dispatch(getSessionError());
      });
  }

  static attemptLoadUser() {
    instance.store.dispatch(getSessionSuccess());
    return sessionService
      .loadUser()
      .then((user) => {
        instance.store.dispatch(getUserSessionSuccess(user));
      })
      .catch(() => {
        instance.store.dispatch(getUserSessionError());
      });
  }

  static deleteSession() {
    return instance.storage.removeItem(USER_SESSION).then(() => {
      instance.store.dispatch(getSessionError());
      delete instance[USER_SESSION];
    });
  }

  static deleteUser() {
    return instance.storage.removeItem(USER_DATA).then(() => {
      instance.store.dispatch(getUserSessionError());
      delete instance[USER_DATA];
    });
  }

  static loadSession() {
    return new Promise((resolve, reject) => {
      instance.storage
        .getItem(USER_SESSION)
        .then((currentSession) => {
          if (currentSession) {
            resolve(currentSession);
          } else {
            reject("Session not found");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static loadUser() {
    return new Promise((resolve, reject) => {
      instance.storage
        .getItem(USER_DATA)
        .then((user) => {
          if (user) {
            resolve(user);
          } else {
            reject("User not found");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static saveSession(session) {
    return new Promise((resolve) => {
      instance.storage
        .setItem(USER_SESSION, session)
        .then(() => {
          instance.store.dispatch(getSessionSuccess());
          resolve();
        })
        .catch((err) => {
          instance.store.dispatch(getSessionSuccess());
          resolve();
        });
    });
  }

  static saveUser(user) {
    return new Promise((resolve) => {
      instance.storage
        .setItem(USER_DATA, user)
        .then((user) => {
          instance.store.dispatch(getUserSessionSuccess(user));
          resolve();
        })
        .catch((err) => {
          instance.store.dispatch(getUserSessionSuccess(user));
          resolve();
        });
    });
  }
}

export const sessionReducer = reducer;
