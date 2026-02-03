import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FloatingReferralCTA = () => {
  const [dismissed, setDismissed] = useState({ left: false, right: false });

  useEffect(() => {
    const stored = sessionStorage.getItem('referralCtaDismissed');
    if (stored) {
      setDismissed(JSON.parse(stored));
    }
  }, []);

  const dismissSide = (side) => {
    const newState = { ...dismissed, [side]: true };
    setDismissed(newState);
    sessionStorage.setItem('referralCtaDismissed', JSON.stringify(newState));
  };

  return (
    <>
      {/* Left Side CTA */}
      {!dismissed.left && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30 hidden lg:block">
          <div className="relative">
            {/* Dismiss button */}
            <button
              onClick={() => dismissSide('left')}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 border border-gray-600 rounded-full text-gray-400 hover:text-white text-xs flex items-center justify-center transition"
            >
              &times;
            </button>

            <Link
              to="/referral#register"
              className="flex items-center bg-gradient-to-b from-green-500 to-emerald-600 px-2 py-6 rounded-r-xl shadow-lg shadow-green-500/30 hover:px-3 transition-all duration-300 group"
              style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
            >
              <span className="font-bold text-white text-sm tracking-wide group-hover:text-yellow-200 transition">
                💰 Refer & Earn $50
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Right Side CTA */}
      {!dismissed.right && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30 hidden lg:block">
          <div className="relative">
            {/* Dismiss button */}
            <button
              onClick={() => dismissSide('right')}
              className="absolute -top-2 -left-2 w-5 h-5 bg-gray-800 border border-gray-600 rounded-full text-gray-400 hover:text-white text-xs flex items-center justify-center transition"
            >
              &times;
            </button>

            <Link
              to="/referral#register"
              className="flex items-center bg-gradient-to-b from-green-500 to-emerald-600 px-2 py-6 rounded-l-xl shadow-lg shadow-green-500/30 hover:px-3 transition-all duration-300 group"
              style={{ writingMode: 'vertical-lr' }}
            >
              <span className="font-bold text-white text-sm tracking-wide group-hover:text-yellow-200 transition">
                Get $50 →
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingReferralCTA;
