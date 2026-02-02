const Navbar = ({ onGetStarted }) => {
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
        </div>
        <div className="flex items-center gap-4">
          <a href="mailto:info@agentchains.ai" className="text-gray-400 hover:text-white text-sm hidden lg:flex items-center gap-1">📧 info@agentchains.ai</a>
          <button onClick={onGetStarted} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-5 py-2 rounded-lg font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all">Get Started</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
