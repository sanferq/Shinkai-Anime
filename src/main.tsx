
import { createRoot } from "react-dom/client";
import App from "./App";
import { HashRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import './index.css';




createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);