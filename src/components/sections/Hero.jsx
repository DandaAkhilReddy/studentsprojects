const Hero = ({ onGetStarted }) => {
  return (
    <section className="py-20 px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Trusted by <span className="font-bold text-white">10,000+ Students</span> Globally
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Stop Stressing.<br/>
          <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">Start Submitting.</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-3 font-semibold">We Build Your Entire Course Project</p>
        <p className="text-gray-400 mb-8 text-lg">Code • Documentation • PPT Presentation • <span className="text-orange-400 font-semibold">Your Preferred Format</span></p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <span className="bg-gray-800/80 backdrop-blur px-4 py-2 rounded-full text-sm border border-gray-700">✓ 3000+ Lines of Code</span>
          <span className="bg-gray-800/80 backdrop-blur px-4 py-2 rounded-full text-sm border border-gray-700">✓ 8 Documents</span>
          <span className="bg-gray-800/80 backdrop-blur px-4 py-2 rounded-full text-sm border border-gray-700">✓ PPT Included</span>
          <span className="bg-gray-800/80 backdrop-blur px-4 py-2 rounded-full text-sm border border-gray-700">✓ 24/7 Support</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onGetStarted} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-500/30 transition-all transform hover:scale-105">Get Complete Package — $399</button>
          <button onClick={onGetStarted} className="bg-gray-800 hover:bg-gray-700 border border-gray-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all">Order Assignment — From $25</button>
        </div>
        <p className="text-gray-500 mt-4 text-sm">💰 Save $399 — 50% OFF Complete Package (was $798)</p>
      </div>
    </section>
  );
};

export default Hero;
