import { deliverables } from '../../data/deliverables';

const Deliverables = () => {
  return (
    <section id="services" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">Complete Deliverables</h2>
        <p className="text-gray-400 text-center mb-12">Everything your professor requires — <span className="text-orange-400 font-semibold">in YOUR preferred format</span></p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {deliverables.map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-800/50 p-5 rounded-xl border border-gray-700 text-center hover:border-orange-500/50 transition">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-bold mt-3 mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-3xl font-bold text-orange-400">3000+</div>
            <div className="text-gray-400 text-sm">Lines of Code</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-3xl font-bold text-orange-400">15+</div>
            <div className="text-gray-400 text-sm">Classes/Modules</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-3xl font-bold text-orange-400">40+</div>
            <div className="text-gray-400 text-sm">Requirements</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-3xl font-bold text-orange-400">24/7</div>
            <div className="text-gray-400 text-sm">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Deliverables;
