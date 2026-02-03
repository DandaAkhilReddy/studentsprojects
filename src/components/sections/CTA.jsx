const CTA = ({ onGetStarted }) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="max-w-3xl mx-auto text-center relative">
        <div className="inline-block bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold mb-4 animate-pulse">🔥 50% OFF All Packages — Limited Time!</div>
        <h2 className="text-4xl font-bold mb-4">Ready to Ace Your Project?</h2>
        <p className="text-xl opacity-90 mb-8">Join <span className="font-bold">10,000+ students globally</span> who submitted with confidence</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="relative">
            <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-green-500/40 z-10">50% OFF</span>
            <button onClick={onGetStarted} className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-2xl transition transform hover:scale-105">
              Complete Package — <span className="line-through opacity-50 text-base">$799</span> $399
            </button>
          </div>
          <div className="relative">
            <span className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10">HOT</span>
            <button onClick={onGetStarted} className="bg-green-600 hover:bg-green-700 border-2 border-white px-10 py-4 rounded-xl font-bold text-lg transition transform hover:scale-105">
              Order Assignment — From <span className="text-yellow-300 text-xl">$25</span>
            </button>
          </div>
        </div>
        <div className="mt-5 inline-block bg-black/20 backdrop-blur px-5 py-2 rounded-full">
          <span className="font-bold text-yellow-200">You save $400!</span> <span className="opacity-80">Was $799, now only $399</span>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm opacity-90">
          <span>✓ Unlimited Revisions</span>
          <span>✓ 24/7 Support</span>
          <span>✓ Your Format</span>
          <span>✓ 100% Guaranteed</span>
        </div>
      </div>
    </section>
  );
};

export default CTA;
