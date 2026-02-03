import { Link } from 'react-router-dom';

const ResumeBuilderHighlight = () => {
  const features = [
    {
      icon: '✅',
      title: 'ATS Optimized',
      desc: 'Pass automated screening systems'
    },
    {
      icon: '🎯',
      title: 'JD Keyword Matching',
      desc: 'Match your skills to job requirements'
    },
    {
      icon: '📃',
      title: 'One-Page Format',
      desc: 'Clean, professional MAANG style'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-orange-900/20 via-yellow-900/20 to-orange-900/20 relative overflow-hidden border-y border-orange-500/20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
          <span>🆓</span> FREE TOOL — $49 VALUE
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Build Your{' '}
          <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            MAANG-Approved
          </span>{' '}
          Resume
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 mb-8 text-lg">
          The same format used by engineers at top tech companies
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-4 hover:border-orange-500/50 transition-all"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-bold text-white mb-1">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          to="/tools"
          className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-500/30 transition-all transform hover:scale-105"
        >
          📄 Build My Resume — Free
        </Link>

        {/* Trust text */}
        <p className="text-gray-500 mt-4 text-sm">
          Used by engineers at Microsoft, Meta, Waymo, and more
        </p>
      </div>
    </section>
  );
};

export default ResumeBuilderHighlight;
