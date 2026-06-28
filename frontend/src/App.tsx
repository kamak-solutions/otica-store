import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { Blog } from "./pages/public/Blog";
import { Frames } from "./pages/public/Frames";
import { Home } from "./pages/public/Home";
import { Lenses } from "./pages/public/Lenses";
import { QuoteRequest } from "./pages/public/QuoteRequest";
import { Services } from "./pages/public/Services";
import { ProductDetail } from "./pages/public/ProductDetail";
import { Cart } from "./pages/public/Cart";
import { Checkout } from "./pages/public/Checkout";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminQuoteRequests } from "./pages/admin/AdminQuoteRequests";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminAuditLogs } from "./pages/admin/AdminAuditLogs";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminProductCreate } from "./pages/admin/AdminProductCreate";
import { AdminProductEdit } from "./pages/admin/AdminProductEdit";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCustomers } from "./pages/admin/AdminCustomers";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { PrivacyPolicy } from "./pages/public/PrivacyPolicy";
import { BlogPostDetail } from "./pages/public/BlogPostDetail";
import { AdminOrderDetail } from "./pages/admin/AdminOrderDetail";
import { AdminStorefront } from "./pages/admin/AdminStorefront";
import { AdminStorefrontSlides } from "./pages/admin/storefront/AdminStorefrontSlides";
import { AdminStorefrontBanners } from "./pages/admin/storefront/AdminStorefrontBanners";
import { AdminStorefrontColors } from "./pages/admin/storefront/AdminStorefrontColors";
import { ProductsPage } from "./pages/public/ProductsPage";
import { AdminCategories } from "./pages/admin/AdminCategories";
import { AdminCampaigns } from "./pages/admin/AdminCampaigns";
import { AdminCampaignCreate } from "./pages/admin/AdminCampaignCreate";
import { AdminBlog } from "./pages/admin/AdminBlog";
import { AdminBlogCreate } from "./pages/admin/AdminBlogCreate";
import { AdminBlogCategories } from "./pages/admin/AdminBlogCategories";
import { AdminCustomerDetail } from "./pages/admin/AdminCustomerDetail";
import { AdminCrmDashboard } from "./pages/admin/AdminCrmDashboard";
import { AdminBlogEdit } from "./pages/admin/AdminBlogEdit";
import { AdminWidgets } from "./pages/admin/AdminWidgets";
import { AdminWidgetCreate } from "./pages/admin/AdminWidgetCreate";
import { AdminCustomerCreate } from "./pages/admin/AdminCustomerCreate";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/armacoes" element={<Frames />} />
          <Route path="/lentes" element={<Lenses />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/orcamento" element={<QuoteRequest />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/produtos/:slug" element={<ProductDetail />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin/orcamentos" element={<AdminQuoteRequests />} />
          <Route path="/admin/auditoria" element={<AdminAuditLogs />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
          <Route path="/admin/produtos" element={<AdminProducts />} />
          <Route path="/admin/categorias" element={<AdminCategories />} />
          <Route path="/admin/produtos/novo" element={<AdminProductCreate />} />
          <Route path="/admin/categorias" element={<AdminCategories />} />
          <Route
            path="/admin/produtos/:id/editar"
            element={<AdminProductEdit />}
          />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vitrine" element={<AdminStorefront />} />
          <Route
            path="/admin/vitrine/cores"
            element={<AdminStorefrontColors />}
          />
          <Route
            path="/admin/vitrine/slides"
            element={<AdminStorefrontSlides />}
          />
          <Route
            path="/admin/vitrine/banners"
            element={<AdminStorefrontBanners />}
          />{" "}
          <Route path="/admin/clientes" element={<AdminCustomers />} />
          <Route path="/admin/clientes/:id" element={<AdminCustomerDetail />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          <Route path="/admin/pedidos/:id" element={<AdminOrderDetail />} />
          <Route path="/admin/campanhas" element={<AdminCampaigns />} />
          <Route
            path="/admin/campanhas/nova"
            element={<AdminCampaignCreate />}
          />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route
            path="/admin/blog/categorias"
            element={<AdminBlogCategories />}
          />
          <Route path="/admin/blog/novo" element={<AdminBlogCreate />} />
          <Route path="/admin/blog/:id/editar" element={<AdminBlogEdit />} />
          <Route path="/admin/crm" element={<AdminCrmDashboard />} />
          <Route path="/admin/widgets" element={<AdminWidgets />} />
          <Route path="/admin/widgets/novo" element={<AdminWidgetCreate />} />
          <Route
            path="/admin/clientes/novo"
            element={<AdminCustomerCreate />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
