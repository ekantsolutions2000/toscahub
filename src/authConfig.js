const b2cPolicies = {
  // names: {
  //   signUpSignIn: "B2C_1_tosca-hub-ui-dev-userflow-signupsignin",
  //   forgotPassword: "B2C_1_tosca-hub-ui-dev-userflow-passwordreset",
  //   editProfile: "B2C_1_tosca-hub-ui-dev-userflow-editprofile",
  // },
  names: {
    signUpSignIn: "B2C_1_tosca-hub-ui-userflow-signin",
    editProfile: "B2C_1_tosca-hub-ui-userflow-editprofile",
    forgotPassword: "B2C_1_tosca-hub-ui-userflow-passwordreset",
  },
  authorities: {
    signUpSignIn: {
      authority:
        "https://ToscaLogin.b2clogin.com/ToscaLogin.onmicrosoft.com/B2C_1_tosca-hub-ui-userflow-signin",
    },
    forgotPassword: {
      authority:
        "https://ToscaLogin.b2clogin.com/ToscaLogin.onmicrosoft.com/B2C_1_tosca-hub-ui-userflow-passwordreset",
    },
    editProfile: {
      authority:
        "https://ToscaLogin.b2clogin.com/ToscaLogin.onmicrosoft.com/B2C_1_tosca-hub-ui-userflow-editprofile",
    },
  },
  authorityDomain: "ToscaLogin.b2clogin.com",
};

const configMapB2C = {
  dev: {
    auth: {
      clientId: "1d2e2181-e3f3-42ed-8b05-789b95927c1a",
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: "https://customerportaldev.toscaltd.com/login",
      knownAuthorities: [b2cPolicies.authorityDomain],
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  },
  local: {
    auth: {
      clientId: "a8a81d96-e6a5-41dc-8658-5d9aa03f51a1",
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: "http://localhost:3000/login",
      knownAuthorities: [b2cPolicies.authorityDomain],
      validateAuthority: false,
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
      iframeHashTimeout: 6000,
    },
  },
  uat: {
    auth: {
      clientId: "9926c5a8-3e69-4541-842b-5af5da8072a7",
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: "https://customerportaluat.toscaltd.com/login",
      knownAuthorities: [b2cPolicies.authorityDomain],
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  },
  ort: {
    auth: {
      clientId: "ff78b29c-2142-490e-8ae2-a4e3b3c27431",
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: "https://customerportalort.toscaltd.com/login",
      knownAuthorities: [b2cPolicies.authorityDomain],
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  },
  prod: {
    auth: {
      clientId: "3265a826-d78e-4849-9239-7541c9e74760",
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: "https://customerportal.toscaltd.com/login",
      knownAuthorities: [b2cPolicies.authorityDomain],
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  },
};

const configName = process.env.REACT_APP_CONFIG_NAME
  ? process.env.REACT_APP_CONFIG_NAME
  : "local";

const msalConfig = configMapB2C[configName];

export { b2cPolicies };

export { msalConfig };

export const loginRequest = {
  scopes: ["openid", "profile"],
};
