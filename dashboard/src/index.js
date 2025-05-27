import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./app/store";
import { Provider } from "react-redux";
import SuspenseContent from "./containers/SuspenseContent";
import { ContenxtProvider } from "./features/Context/Context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <Suspense fallback={<SuspenseContent />}>
    <Provider store={store}>
      <ContenxtProvider>
        <App />
      </ContenxtProvider>
    </Provider>
  </Suspense>
);

reportWebVitals();
