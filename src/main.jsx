import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")).render(
  <SnackbarProvider
    maxSnack={2}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    autoHideDuration={1000} // optional: hides after 2.5s
  >
    <App />
  </SnackbarProvider>
);
