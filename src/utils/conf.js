const commonConfig = {
  serverErrorMessage:
    "Unfortunately we are unable to process this request due to connection problems. Please try again at a later time. For assistance, contact us at customerexperience@toscaltd.com.",
  anytimeCollectAuthorization:
    "Basic OTliN2E1MjUtY2Y0Ni00MzZlLWE0ZWItMzhlNjkyZWU1YTkzOmFjY291bnRzcmVjZWl2YWJsZTpFbTNyYWxkKk1AbGxhcmRIdXJyMWNhbmU1IQo=",
};

const configMap = {
  prod: {
    ...commonConfig,
    apiUrl: "https://apiprod.toscaltd.com",
    enterpriseApiKey: "d4cb370b3e744292af46dec2df206cb0",
    enterpriseApiTrace: true,
    baseApiUrl: "https://apim-toscaapi-prod.azure-api.net",
    authenticationApiUrl:
      "https://apim-toscaapi-prod.azure-api.net/authentication",
    customerProfileApiUrl:
      "https://apim-toscaapi-prod.azure-api.net/customer-profile",
    inventoryApiUrl: "https://apim-toscaapi-prod.azure-api.net/inventory",
    orderApiUrl: "https://apim-toscaapi-prod.azure-api.net/order",
    logsApiUrl: "https://apim-toscaapi-prod.azure-api.net/aggregation",
    docUrl: "https://cms.toscaltd.com",
    transportationApiUrl:
      "https://apim-toscaapi-prod.azure-api.net/transportation",
    communicationApiUrl:
      "https://apim-toscaapi-prod.azure-api.net/communication",
    environmentName: "",
    isProd: true,
    defaultCCmailAddresses: "feedback@toscaltd.com",
    defaultProofofDeliveryEmailAddress: "customerexperience@toscaltd.com",
    transplaceBaseUrl: "https://tms.transplace.com",
    transplaceAuthToken:
      "+xUF6ReE7y70JXt8yR4eZseL0ASNTEsb0UktGZ6n5SyHKBN/6ueQcJNQ5tFiUBBAFhw5Yntpxetp/+2uF8K9XA==",
    showTransplaceIcon: true,
    defaultCSREmailAddress: "customerexperience@toscaltd.com",
    promptLiveUpdate: false,
    hideCopProductDescriptions: false,
    rpcImagePath: "https://cms.toscaltd.com/hub/images/inventory/",
    hideCopCarrier: false,
    maintenanceMode: false,
    bulkOrderEnable: true,
    podDownloadEnable: true,
    showNewInventoryImages: false,
  },
  ort: {
    ...commonConfig,
    apiUrl: "https://apiprod.toscaltd.com",
    enterpriseApiKey: "d4cb370b3e744292af46dec2df206cb0",
    enterpriseApiTrace: true,
    baseApiUrl: "https://apim-toscaapi-prod.azure-api.net",
    authenticationApiUrl:
      "https://apim-toscaapi-prod.azure-api.net/authentication",
    customerProfileApiUrl:
      "https://apim-toscaapi-prod.azure-api.net/customer-profile",
    inventoryApiUrl: "https://apim-toscaapi-prod.azure-api.net/inventory",
    orderApiUrl: "https://apim-toscaapi-prod.azure-api.net/order",
    logsApiUrl: "https://apim-toscaapi-prod.azure-api.net/aggregation",
    docUrl: "https://cms.toscaltd.com",
    transportationApiUrl:
      "https://apim-toscaapi-prod.azure-api.net/transportation",
    communicationApiUrl:
      "https://apim-toscaapi-prod.azure-api.net/communication",
    environmentName: "ORT",
    isProd: false,
    defaultCCmailAddresses: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    defaultProofofDeliveryEmailAddress:
      "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    transplaceBaseUrl: "https://tms.transplace.com",
    transplaceAuthToken:
      "+xUF6ReE7y70JXt8yR4eZseL0ASNTEsb0UktGZ6n5SyHKBN/6ueQcJNQ5tFiUBBAFhw5Yntpxetp/+2uF8K9XA==",
    showTransplaceIcon: true,
    defaultCSREmailAddress: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    promptLiveUpdate: false,
    showReactQueryDevTools: false,
    hideCopCarrier: false,
    excludeCleanPal: true,
    hideCopProductDescriptions: false,
    rpcImagePath: "https://cms.toscaltd.com/hub/images/inventory/",
    maintenanceMode: false,
    emailDistributionOverride: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    bulkOrderEnable: true,
    podDownloadEnable: true,
    showNewInventoryImages: false,
  },
  uat: {
    ...commonConfig,
    apiUrl: "https://apiuat.toscaltd.com",
    enterpriseApiKey: "560d2b5f8ae24a75a9c7b2c7bfdddc03",
    enterpriseApiTrace: true,
    baseApiUrl: "https://apim-toscaapi-uat.azure-api.net",
    authenticationApiUrl:
      "https://apim-toscaapi-uat.azure-api.net/authentication",
    customerProfileApiUrl:
      "https://apim-toscaapi-uat.azure-api.net/customer-profile",
    inventoryApiUrl: "https://apim-toscaapi-uat.azure-api.net/inventory",
    orderApiUrl: "https://apim-toscaapi-uat.azure-api.net/order",
    logsApiUrl: "https://apim-toscaapi-uat.azure-api.net/aggregation",
    docUrl: "https://cmsuat.toscaltd.com",
    transportationApiUrl:
      "https://apim-toscaapi-uat.azure-api.net/transportation",
    communicationApiUrl:
      "https://apim-toscaapi-uat.azure-api.net/communication",
    environmentName: "UAT",
    isProd: false,
    defaultCCmailAddresses: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    defaultProofofDeliveryEmailAddress:
      "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    transplaceBaseUrl: "https://uattms.transplace.com",
    transplaceAuthToken:
      "+xUF6ReE7y70JXt8yR4eZseL0ASNTEsb0UktGZ6n5SyHKBN/6ueQcJNQ5tFiUBBAFhw5Yntpxetp/+2uF8K9XA==",
    showTransplaceIcon: true,
    defaultCSREmailAddress: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    promptLiveUpdate: false,
    showReactQueryDevTools: false,
    hideCopCarrier: false,
    excludeCleanPal: true,
    hideCopProductDescriptions: false,
    rpcImagePath: "https://cmsuat.toscaltd.com/hub/images/inventory/",
    maintenanceMode: false,
    emailDistributionOverride: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    bulkOrderEnable: true,
    podDownloadEnable: true,
    showNewInventoryImages: false,
  },
  dev: {
    ...commonConfig,
    apiUrl: "https://d1rwhg2glk172w.cloudfront.net",
    enterpriseApiKey: "c34313b726f546dfa867e0ebe803c973",
    enterpriseApiTrace: true,
    baseApiUrl: "https://apim-toscaapi-dev.azure-api.net",
    authenticationApiUrl:
      "https://apim-toscaapi-dev.azure-api.net/authentication",
    customerProfileApiUrl:
      "https://apim-toscaapi-dev.azure-api.net/customer-profile",
    inventoryApiUrl: "https://apim-toscaapi-dev.azure-api.net/inventory",
    orderApiUrl: "https://apim-toscaapi-dev.azure-api.net/order",
    docUrl: "https://cmsdev.toscaltd.com",
    logsApiUrl: "https://apim-toscaapi-dev.azure-api.net/aggregation",
    transportationApiUrl:
      "https://apim-toscaapi-dev.azure-api.net/transportation",
    communicationApiUrl:
      "https://apim-toscaapi-dev.azure-api.net/communication",
    environmentName: "Dev",
    isProd: false,
    defaultCCmailAddresses: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    defaultProofofDeliveryEmailAddress:
      "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    transplaceBaseUrl: "https://uattms.transplace.com",
    transplaceAuthToken:
      "+xUF6ReE7y70JXt8yR4eZseL0ASNTEsb0UktGZ6n5SyHKBN/6ueQcJNQ5tFiUBBAFhw5Yntpxetp/+2uF8K9XA==",
    showTransplaceIcon: true,
    defaultCSREmailAddress: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    promptLiveUpdate: false,
    showReactQueryDevTools: false,
    hideCopCarrier: false,
    excludeCleanPal: false,
    hideCopProductDescriptions: false,
    rpcImagePath: "https://cmsdev.toscaltd.com/hub/images/inventory/",
    maintenanceMode: false,
    emailDistributionOverride: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    bulkOrderEnable: true,
    podDownloadEnable: true,
    showNewInventoryImages: true,
  },
  local: {
    ...commonConfig,
    apiUrl: "http://localhost:10010",
    enterpriseApiKey: "top-secret",
    enterpriseApiTrace: true,
    baseApiUrl: "http://localhost:7071",
    authenticationApiUrl: "http://localhost:7071/authentication",
    customerProfileApiUrl: "http://localhost:7072/customer-profile",
    inventoryApiUrl: "http://localhost:7073/inventory",
    orderApiUrl: "http://localhost:7074/order",
    logsApiUrl: "http://localhost:7074/aggregation",
    docUrl: "https://cmsdev.toscaltd.com",
    transportationApiUrl: "http://localhost:7074/transportation",
    communicationApiUrl: "http://localhost:7074/communication",
    environmentName: "Local",
    isProd: false,
    defaultCCmailAddresses: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    defaultProofofDeliveryEmailAddress:
      "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    transplaceBaseUrl: "https://uattms.transplace.com",
    transplaceAuthToken:
      "+xUF6ReE7y70JXt8yR4eZseL0ASNTEsb0UktGZ6n5SyHKBN/6ueQcJNQ5tFiUBBAFhw5Yntpxetp/+2uF8K9XA==",
    showTransplaceIcon: false,
    defaultCSREmailAddress: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    promptLiveUpdate: false,
    showReactQueryDevTools: false,
    hideCopCarrier: false,
    excludeCleanPal: false,
    hideCopProductDescriptions: false,
    rpcImagePath: "https://cmsdev.toscaltd.com/hub/images/inventory/",
    maintenanceMode: false,
    emailDistributionOverride: "DL_ToscaHUBTechnologyTeam@toscaltd.com",
    bulkOrderEnable: false,
    podDownloadEnable: false,
    showNewInventoryImages: true,
  },
};

const configName = process.env.REACT_APP_CONFIG_NAME
  ? process.env.REACT_APP_CONFIG_NAME
  : "dev";
const config = configMap[configName];

export { config };
