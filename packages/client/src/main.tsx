import "@radix-ui/themes/styles.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Theme } from "@radix-ui/themes";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Theme appearance="dark" accentColor="lime">
        <App />
      </Theme>
    </BrowserRouter>
  </StrictMode>,
);
