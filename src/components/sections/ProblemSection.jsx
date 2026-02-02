const ProblemSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">😫 Sound Familiar?</h2>
        <p className="text-gray-400 text-center mb-10">We've helped 10,000+ students overcome these exact challenges</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 p-5 rounded-xl border border-gray-700 hover:border-gray-600 transition">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="font-bold mb-1">Formatting Nightmare</h3>
            <p className="text-gray-400 text-sm">Headers, TOC, margins - nothing matches the template</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 p-5 rounded-xl border border-gray-700 hover:border-gray-600 transition">
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="font-bold mb-1">No Time Left</h3>
            <p className="text-gray-400 text-sm">40 requirements, UML, test cases due soon</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 p-5 rounded-xl border border-gray-700 hover:border-gray-600 transition">
            <div className="text-3xl mb-3">🤯</div>
            <h3 className="font-bold mb-1">Team Issues</h3>
            <p className="text-gray-400 text-sm">Doing everything alone while others slack</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-5 rounded-xl border border-purple-500/50 hover:border-purple-400 transition">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-bold mb-1 text-purple-400">No Project Idea</h3>
            <p className="text-gray-400 text-sm">Confused about what project to choose?</p>
          </div>
          <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 p-5 rounded-xl border border-red-500/50 hover:border-red-400 transition">
            <div className="text-3xl mb-3">📵</div>
            <h3 className="font-bold mb-1 text-red-400">Vendor Ghosting</h3>
            <p className="text-gray-400 text-sm">Other vendors disappear after payment</p>
          </div>
        </div>

        {/* Our Solution */}
        <div className="mt-10 bg-gradient-to-r from-green-900/30 to-emerald-900/20 border border-green-500/50 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl">✅</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-green-400 mb-2">We Solve ALL These Problems</h3>
              <p className="text-gray-300 text-lg"><span className="font-bold">No communication issues. No stress.</span> Your every call will be answered.</p>
              <p className="text-gray-400 mt-2">From <span className="text-white font-semibold">project ideation</span> → <span className="text-white font-semibold">development</span> → <span className="text-white font-semibold">documentation</span> → <span className="text-white font-semibold">deployment</span> → <span className="text-white font-semibold">presentation</span></p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
