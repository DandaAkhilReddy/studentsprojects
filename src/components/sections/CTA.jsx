const CTA = ({ onGetStarted }) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="max-w-3xl mx-auto text-center relative">
        <h2 className="text-4xl font-bold mb-4">Ready to Ace Your Project?</h2>
        <p className="text-xl opacity-90 mb-8">Join <span className="font-bold">10,000+ students globally</span> who submitted with confidence</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onGetStarted} className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-2xl transition transform hover:scale-105">Get Started Now — $399</button>
          <button onClick={onGetStarted} className="bg-black/20 border-2 border-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-black/30 transition">Order Assignment — From $25</button>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm opacity-90">
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
