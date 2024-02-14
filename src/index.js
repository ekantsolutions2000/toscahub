import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { unregister } from "./registerServiceWorker";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import { config } from "./utils/conf";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
import _ from "lodash";
import MaintenancePage from "./screens/MaintenancePage";

const queryClient = new QueryClient();

const showReactQueryDevTools = _.get(config, "showReactQueryDevTools", false);
const maintenanceMode = _.get(config, "maintenanceMode", false);

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  maintenanceMode ? (
    <Provider store={store}>
      <MaintenancePage />
    </Provider>
  ) : (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App msalInstance={msalInstance} />
        {showReactQueryDevTools && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>
  ),
);
unregister();
