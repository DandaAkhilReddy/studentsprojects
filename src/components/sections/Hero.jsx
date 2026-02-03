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

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="relative">
            <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-green-500/40 animate-bounce z-10">50% OFF</span>
            <button onClick={onGetStarted} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-500/30 transition-all transform hover:scale-105">
              Complete Package — <span className="line-through opacity-60 text-base">$799</span> $399
            </button>
          </div>
          <div className="relative">
            <span className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10">HOT</span>
            <button onClick={onGetStarted} className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-500/30 transition-all transform hover:scale-105">
              Order Assignment — From <span className="text-yellow-300 text-xl">$25</span>
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <span className="bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-sm font-bold border border-green-500/30">You save $400! Was $799</span>
          <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-500/30">Assignments from just $25</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
