import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./store/cart/use-cart";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
);