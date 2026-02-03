import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onGetStarted }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 py-4 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⛓️</span>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">AgentChains.ai</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-gray-400 hover:text-white text-sm transition">Services</a>
          <a href="#pricing" className="text-gray-400 hover:text-white text-sm transition">Pricing</a>
          <a href="#projects" className="text-gray-400 hover:text-white text-sm transition">Trending Projects</a>
          <a href="#reviews" className="text-gray-400 hover:text-white text-sm transition">Reviews</a>
          <Link to="/tools" className="text-orange-400 hover:text-orange-300 text-sm font-medium transition flex items-center gap-1">
            Free Tools
          </Link>
          <Link to="/referral" className="text-green-400 hover:text-green-300 text-sm font-medium transition flex items-center gap-1">
            💰 Earn $50+
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <a href="mailto:info@agentchains.ai" className="text-gray-400 hover:text-white text-sm hidden lg:flex items-center gap-1">info@agentchains.ai</a>
          <button onClick={onGetStarted} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-5 py-2 rounded-lg font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all">Get Started</button>
          {/* Hamburger button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-1">
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-2 border-t border-gray-800 pt-4 flex flex-col gap-3">
          <a href="#services" onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white text-sm transition px-2 py-1">Services</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white text-sm transition px-2 py-1">Pricing</a>
          <a href="#projects" onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white text-sm transition px-2 py-1">Trending Projects</a>
          <a href="#reviews" onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white text-sm transition px-2 py-1">Reviews</a>
          <Link to="/tools" onClick={() => setMenuOpen(false)} className="text-orange-400 hover:text-orange-300 text-sm font-medium transition px-2 py-1">Free Tools</Link>
          <Link to="/referral" onClick={() => setMenuOpen(false)} className="text-green-400 hover:text-green-300 text-sm font-medium transition px-2 py-1">💰 Earn $50+</Link>
          <a href="mailto:info@agentchains.ai" className="text-gray-400 hover:text-white text-sm transition px-2 py-1 lg:hidden">info@agentchains.ai</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
