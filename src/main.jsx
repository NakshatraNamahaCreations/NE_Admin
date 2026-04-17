import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { GlobalProvider } from "./hooks/GlobalProvider";
import { AdminDataProvider } from "./utilities/adminData";
import { ConfirmProvider } from "./component/common/ConfirmProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <Provider store={store}>
  <GlobalProvider>
    <AdminDataProvider>
      <ConfirmProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ConfirmProvider>
    </AdminDataProvider>
  </GlobalProvider>,
  // </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example, reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
