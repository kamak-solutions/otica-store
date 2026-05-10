import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AdminAuthProvider } from "./store/auth/use-admin-auth";
import { CartProvider } from "./store/cart/use-cart";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminAuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AdminAuthProvider>
  </StrictMode>,
);