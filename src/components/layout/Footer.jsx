const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⛓️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">AgentChains.ai</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
            <a href="mailto:info@agentchains.ai" className="text-gray-400 hover:text-white flex items-center gap-2 transition">📧 info@agentchains.ai</a>
            <span className="text-gray-700 hidden md:block">|</span>
            <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Refund Policy</a>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">© 2026 AgentChains.ai — Your Project, Our Expertise | Trusted by 10,000+ Students Globally</div>
      </div>
    </footer>
  );
};

export default Footer;
