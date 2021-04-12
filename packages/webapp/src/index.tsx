import React from "react";
import ReactDOM from "react-dom";
import {Auth0Provider} from "@auth0/auth0-react";

import reportWebVitals from "./reportWebVitals";
import App from "./App";

const AUTH_DOMAIN = process.env.REACT_APP_AUTH_DOMAIN || "";
const AUTH_CLIENT_ID = process.env.REACT_APP_AUTH_CLIENT_ID || "";

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={AUTH_DOMAIN}
      clientId={AUTH_CLIENT_ID}
      redirectUri={window.location.origin}>
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
