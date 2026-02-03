import { Link } from 'react-router-dom';

const WelcomePopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none transition"
        >
          &times;
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-bold mb-4">
            <span>🆓</span> FREE TOOL — $49 VALUE
          </div>

          {/* Icon */}
          <div className="text-6xl mb-4">📄</div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2">
            Build Your{' '}
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              MAANG-Approved
            </span>{' '}
            Resume
          </h2>

          {/* Badges row */}
          <div className="flex justify-center gap-2 mb-4">
            <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded">
              ATS OPTIMIZED
            </span>
            <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">
              JD MATCHING
            </span>
          </div>

          {/* Feature list */}
          <ul className="text-left space-y-2 mb-6 max-w-xs mx-auto">
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400">✓</span>
              Job Description keyword matching
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400">✓</span>
              One-page professional format
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400">✓</span>
              Used at Microsoft, Meta, Waymo
            </li>
          </ul>

          {/* CTA Button */}
          <Link
            to="/tools"
            onClick={onClose}
            className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 py-3 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
          >
            Build My Resume Now →
          </Link>

          {/* Maybe later link */}
          <button
            onClick={onClose}
            className="mt-4 text-gray-500 hover:text-gray-400 text-sm transition"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
