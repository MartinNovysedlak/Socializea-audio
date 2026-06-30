import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Index from './pages/Index';
import Prenajom from './pages/Prenajom';
import { Sparkles, HelpCircle, Laptop } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between">
        {/* Universal Header / Navbar */}
        <header className="sticky top-0 z-50 bg-[#030712]/85 backdrop-blur-md border-b border-white/5 py-4 px-6">
          <div className="container mx-auto flex items-center justify-between max-w-7xl">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="bg-gradient-to-r from-[#1A4BFF] to-[#BD20D3] p-2 rounded-xl text-white font-black group-hover:scale-105 transition-transform">
                🔊
              </span>
              <span className="text-xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Aparatúra<span className="text-[#BD20D3]">.sk</span>
              </span>
            </Link>

            <nav className="flex items-center gap-6 text-sm font-semibold text-gray-300">
              <Link to="/" className="hover:text-white transition-colors">Domov</Link>
              <Link to="/prenajom" className="hover:text-white transition-colors bg-gradient-to-r from-[#1A4BFF]/10 to-[#BD20D3]/10 px-3 py-1.5 rounded-full border border-[#BD20D3]/20 hover:border-[#BD20D3]/40">
                Ponuka Balíkov
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/prenajom" element={<Prenajom />} />
          </Routes>
        </main>

        {/* Universal Footer */}
        <footer className="border-t border-white/5 bg-black/40 py-8 px-6 text-center text-sm text-gray-500">
          <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Aparatúra.sk. Všetky práva vyhradené.</p>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-gray-300">Domov</Link>
              <Link to="/prenajom" className="hover:text-gray-300">Prenájom techniky</Link>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;