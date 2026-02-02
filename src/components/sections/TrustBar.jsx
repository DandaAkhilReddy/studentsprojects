const TrustBar = () => {
  return (
    <section className="py-6 px-4 border-y border-gray-800 bg-gray-800/30">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-gray-400 text-sm mb-4">Trusted by students from top universities worldwide</p>
        <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-sm">
          <span>🎓 University of Kansas</span>
          <span>🎓 CSU Fresno</span>
          <span>🎓 Arizona State</span>
          <span>🎓 University of Birmingham, UK</span>
          <span>🎓 University of Manchester, UK</span>
          <span>🎓 + 100 more</span>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
