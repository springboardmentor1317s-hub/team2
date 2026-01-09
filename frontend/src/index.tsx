import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext"; // <-- IMPORT THIS
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // <React.StrictMode>
    <ThemeProvider>
      <App />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  // </React.StrictMode>
);
