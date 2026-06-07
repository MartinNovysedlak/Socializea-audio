import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Ponuka from "./pages/Ponuka";
import Predaj from "./pages/Predaj";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import Admin from "./pages/Admin";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ponuka" element={<Ponuka />} />
        <Route path="/predaj" element={<Predaj />} />
        <Route path="/predaj/:id" element={<ProductDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Toaster position="top-right" theme="dark" />
    </Router>
  );
}

export default App;