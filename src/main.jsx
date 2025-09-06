import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

function GAListener(){
  const { pathname, search } = useLocation();
  React.useEffect(()=>{
    if (window.gtag) {
      window.gtag('event','page_view',{
        page_location: window.location.origin + pathname + search,
        page_path: pathname + search,
        page_title: document.title
      });
    }
  },[pathname, search]);
  return null;
}

function Root(){
  return (
    <BrowserRouter>
      <GAListener />
      <App />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
