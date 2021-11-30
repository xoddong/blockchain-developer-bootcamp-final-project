import React from "react";
import ReactDOM from "react-dom";
import { ChainId, DAppProvider, Config } from "@usedapp/core";

import "./index.css";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";

const config: Config = {
  readOnlyChainId: ChainId.Kovan,
  readOnlyUrls: {
    [ChainId.Kovan]:
      "https://kovan.infura.io/v3/a2c38e3677c74c0f83645b813af802cc",
  },
};

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
