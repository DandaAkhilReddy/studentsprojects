const AssignmentBanner = ({ onOrder }) => {
  return (
    <section className="py-10 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="text-center md:text-left">
          <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
            <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">Any Subject</span>
            <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">Professional Quality</span>
            <span className="bg-yellow-400/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full animate-pulse">HOT DEAL</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">📚 Need Help with Assignments?</h3>
          <p className="opacity-90 text-lg">Subject-wise assignments done professionally</p>
        </div>
        <div className="flex items-center gap-5 shrink-0">
          <div className="text-center">
            <div className="text-xs text-white/70 uppercase tracking-wider">Starting from</div>
            <div className="text-5xl font-bold text-yellow-300">$25</div>
            <div className="text-xs text-white/70">per assignment</div>
          </div>
          <button onClick={onOrder} className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-2xl transform hover:scale-105">Order Now</button>
        </div>
      </div>
    </section>
  );
};

export default AssignmentBanner;
