import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Prenajom from "./pages/Prenajom";
import Predaj from "./pages/Predaj";
import ProductDetail from "./pages/ProductDetail";
import EquipmentDetail from "./pages/EquipmentDetail";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import Kontakt from "./pages/Kontakt";
import Admin from "./pages/Admin";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/prenajom" element={<Prenajom />} />
        <Route path="/equipment/:id" element={<EquipmentDetail />} />
        <Route path="/predaj" element={<Predaj />} />
        <Route path="/predaj/:id" element={<ProductDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Toaster position="top-right" theme="dark" />
    </>
  );
}

export default App;