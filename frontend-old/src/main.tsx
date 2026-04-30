import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./store/auth/auth-context";
import { CartProvider } from "./store/cart/cart-context";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);