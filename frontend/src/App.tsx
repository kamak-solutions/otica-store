import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { Blog } from "./pages/public/Blog";
import { Frames } from "./pages/public/Frames";
import { Home } from "./pages/public/Home";
import { Lenses } from "./pages/public/Lenses";
import { QuoteRequest } from "./pages/public/QuoteRequest";
import { Services } from "./pages/public/Services";
import { ProductDetail } from "./pages/public/ProductDetail";

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
          <Route path="/produtos/:slug" element={<ProductDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
