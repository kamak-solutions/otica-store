import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedAdminRoute } from "./components/auth/ProtectedAdminRoute";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Home } from "./pages/Home";
import { ProductDetail } from "./pages/ProductDetail";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminOrderDetail } from "./pages/admin/AdminOrderDetail";
import { AdminOrders } from "./pages/admin/AdminOrders";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/produtos/:slug" element={<ProductDetail />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/pedidos" element={<AdminOrders />} />
            <Route path="/admin/pedidos/:id" element={<AdminOrderDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}