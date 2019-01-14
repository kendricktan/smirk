import React from "react";
import ReactDOM from "react-dom";

import { appSettings } from "./models/AppSettings";
import { appState } from "./models/AppState";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "antd/dist/antd.css";
import "./index.css";

ReactDOM.render(
  <App appSettings={appSettings} appState={appState} />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
