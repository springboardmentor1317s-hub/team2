import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext"; // <-- IMPORT THIS
import React from "react";
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
        <Toaster position="top-right" richColors />
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
