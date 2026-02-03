import { packages } from '../../data/packages';

const Pricing = ({ onGetStarted }) => {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">Simple, Transparent Pricing</h2>
        <p className="text-gray-400 text-center mb-12">No hidden fees. No surprises. Just results.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`relative bg-gradient-to-b from-gray-800 to-gray-800/50 rounded-2xl p-6 border-2 transition-all hover:transform hover:scale-105 ${pkg.popular ? 'border-orange-500 shadow-xl shadow-orange-500/20' : 'border-gray-700 hover:border-gray-600'}`}>
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">⭐ MOST POPULAR</span>
                </div>
              )}

              <div className="text-center mb-6">
                <span className="text-4xl">{pkg.icon}</span>
                <h3 className="text-xl font-bold mt-3">{pkg.name}</h3>
                <div className="mt-3">
                  <span className="text-gray-500 line-through text-sm">${pkg.originalPrice}</span>
                  <div className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">${pkg.price}</div>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button onClick={onGetStarted} className={`w-full py-3 rounded-xl font-bold transition ${pkg.popular ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25' : 'bg-gray-700 hover:bg-gray-600'}`}>Get Started</button>
            </div>
          ))}
        </div>

        {/* Assignment Card */}
        <div className="mt-10 bg-gradient-to-r from-green-900/30 to-emerald-900/20 rounded-2xl p-8 border border-green-500/30 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div><span className="text-4xl">📚</span></div>
            <div>
              <h3 className="text-xl font-bold mb-1">Individual Assignments</h3>
              <p className="text-gray-400">Any subject, any topic — professionally done</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">$25–$50</div>
              <div className="text-gray-400 text-sm">subject-wise pricing</div>
            </div>
            <button onClick={onGetStarted} className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-bold transition">Order Now</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
