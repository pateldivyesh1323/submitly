import "@radix-ui/themes/styles.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Theme } from "@radix-ui/themes";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/apiClient.ts";
import { AuthProvider } from "./context/AuthContext.tsx";
import { FormProvider } from "./context/FormContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Theme appearance="dark" accentColor="orange">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <FormProvider>
              <Toaster />
              <App />
            </FormProvider>
          </AuthProvider>
        </QueryClientProvider>
      </Theme>
    </BrowserRouter>
  </StrictMode>,
);
