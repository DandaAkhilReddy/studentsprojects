import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  registerReferrer,
  useReferralCode,
  validateReferralCode,
  getReferrerStats
} from '../services/referralService';

const Referral = () => {
  const location = useLocation();

  // Scroll to register section if hash is present
  useEffect(() => {
    if (location.hash === '#register') {
      setTimeout(() => {
        document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  // Registration form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [referrerData, setReferrerData] = useState(null);

  // Friend's referral code form state
  const [friendForm, setFriendForm] = useState({
    code: '',
    name: '',
    email: '',
    phone: ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const [codeValidation, setCodeValidation] = useState(null);

  // Tab state
  const [activeTab, setActiveTab] = useState('become'); // 'become' or 'use'

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await registerReferrer(formData.name, formData.email, formData.phone);

      if (result.success) {
        setGeneratedCode(result.data.code);
        setReferrerData(result.data);

        if (result.isExisting) {
          toast.success('Welcome back! Here\'s your existing referral code.');
        } else {
          toast.success('You\'re now a referral partner! Share your code to earn $50+ per referral.');
        }
      } else {
        toast.error(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Network error. Please check your connection and try again.');
    }

    setIsSubmitting(false);
  };

  // Handle code validation
  const handleValidateCode = async () => {
    if (!friendForm.code.trim()) {
      toast.error('Please enter a referral code');
      return;
    }

    setIsValidating(true);
    const result = await validateReferralCode(friendForm.code);
    setCodeValidation(result);

    if (result.valid) {
      toast.success(`Valid code from ${result.referrer.name}! You'll get $50 off your order!`);
    } else {
      toast.error(result.error || 'Invalid referral code');
    }

    setIsValidating(false);
  };

  // Handle friend form submission
  const handleUseFriendCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await useReferralCode(
        friendForm.code,
        friendForm.name,
        friendForm.email,
        friendForm.phone
      );

      if (result.success) {
        toast.success(`Awesome! You get $50 off! ${result.data.referrerName} earns a reward too!`);
        setFriendForm({ code: '', name: '', email: '', phone: '' });
        setCodeValidation(null);
      } else {
        toast.error(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error using referral code:', error);
      toast.error('Network error. Please check your connection and try again.');
    }

    setIsSubmitting(false);
  };

  // Copy code to clipboard
  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast.success('Code copied to clipboard!');
    }
  };

  const faqs = [
    {
      q: "How does the referral program work?",
      a: "Register to get your unique code. Share it with friends. For project referrals, you earn $50 (first) or $100 (subsequent) — friend gets $50 off. For assignment referrals, you earn $5 (first) or $10 (subsequent) — friend gets $5 off!"
    },
    {
      q: "Do I need to be a customer to earn referral money?",
      a: "No! Anyone can register and start earning. Projects: $50–$100 per referral. Assignments: $5–$10 per referral."
    },
    {
      q: "When do we get paid?",
      a: "You receive your reward once we verify the referral. Payment is processed within 24-48 hours."
    },
    {
      q: "Is there a limit to how many people I can refer?",
      a: "No limit! Earn on both projects and assignments. The more you refer, the more you earn ($100/$10 for each additional referral)."
    },
    {
      q: "What about weekly projects?",
      a: "Weekly project subscribers get exclusive deals! Contact us for current offers."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">⛓️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">AgentChains.ai</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white text-sm transition">Home</Link>
            <Link to="/tools" className="text-orange-400 hover:text-orange-300 text-sm font-medium transition">Free Tools</Link>
            <span className="text-green-400 text-sm font-medium">💰 Earn $50+</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-5 py-2 rounded-lg font-semibold text-sm transition">Get Project Help</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-emerald-900/20 to-green-900/20"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            💰 Referral Program — Everyone Wins!
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Earn on Every Referral
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            <span className="text-green-400 font-bold">Projects: $50–$100</span> | <span className="text-blue-400 font-bold">Assignments: $5–$10</span> per referral
          </p>
          <p className="text-lg text-gray-400 mb-6">
            No limit on referrals — <span className="text-yellow-400 font-bold">refer more, earn more!</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('become')}
              className={`px-6 py-3 rounded-xl font-bold transition ${activeTab === 'become' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Become a Referrer
            </button>
            <button
              onClick={() => setActiveTab('use')}
              className={`px-6 py-3 rounded-xl font-bold transition ${activeTab === 'use' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              I Have a Code
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
              <h3 className="font-bold mb-1">Register</h3>
              <p className="text-sm text-gray-400">Sign up to get your unique referral code</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
              <h3 className="font-bold mb-1">Share</h3>
              <p className="text-sm text-gray-400">Share your code with friends who need project help</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
              <h3 className="font-bold mb-1">Friend Signs Up</h3>
              <p className="text-sm text-gray-400">They enter your code when signing up</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">$</div>
              <h3 className="font-bold mb-1">Both Win!</h3>
              <p className="text-sm text-gray-400">You earn cash, friend gets a discount</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Tab Based */}
      <section id="register" className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-xl mx-auto">
          {/* Become a Referrer Tab */}
          {activeTab === 'become' && (
            <div>
              {!generatedCode ? (
                <>
                  <h2 className="text-2xl font-bold text-center mb-2">Become a Referral Partner</h2>
                  <p className="text-gray-400 text-center mb-8">Register to get your unique code and start earning</p>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition"
                        placeholder="john@university.edu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Phone Number (for payment)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 py-4 rounded-xl font-bold text-lg transition"
                    >
                      {isSubmitting ? 'Generating Your Code...' : 'Get My Referral Code'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <div className="bg-green-500/20 text-green-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
                  <h2 className="text-2xl font-bold mb-2">You're In!</h2>
                  <p className="text-gray-400 mb-6">Share this code with your friends</p>

                  <div className="bg-gray-800 rounded-2xl p-6 mb-6">
                    <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-4xl font-bold text-green-400 tracking-wider">{generatedCode}</span>
                      <button
                        onClick={copyCode}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4 mb-6 text-left">
                    <h3 className="font-bold mb-2">When your friend uses your code:</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="font-bold text-green-400">Projects:</span> You earn $50 (1st) or $100 (2nd+), friend gets $50 off
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span className="font-bold text-blue-400">Assignments:</span> You earn $5 (1st) or $10 (2nd+), friend gets $5 off
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">★</span>
                        <span className="font-bold text-yellow-400">No limits</span> — refer unlimited friends
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        const text = `Use my referral code ${generatedCode} at AgentChains.ai — get $50 off projects or $5 off assignments! Sign up here: ${window.location.href}`;
                        navigator.clipboard.writeText(text);
                        toast.success('Share message copied!');
                      }}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-medium transition"
                    >
                      Copy Share Message
                    </button>
                    <button
                      onClick={() => {
                        setGeneratedCode(null);
                        setReferrerData(null);
                        setFormData({ name: '', email: '', phone: '' });
                      }}
                      className="px-4 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl transition"
                    >
                      New
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Use a Code Tab */}
          {activeTab === 'use' && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-2">Have a Referral Code?</h2>
              <p className="text-gray-400 text-center mb-8">Enter it below to claim your discount</p>

              <form onSubmit={handleUseFriendCode} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Referral Code *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={friendForm.code}
                      onChange={(e) => {
                        setFriendForm({ ...friendForm, code: e.target.value.toUpperCase() });
                        setCodeValidation(null);
                      }}
                      className="flex-1 bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition uppercase tracking-wider"
                      placeholder="REF-XXXXXX"
                    />
                    <button
                      type="button"
                      onClick={handleValidateCode}
                      disabled={isValidating || !friendForm.code.trim()}
                      className="bg-gray-600 hover:bg-gray-500 disabled:opacity-50 px-4 rounded-xl transition"
                    >
                      {isValidating ? '...' : 'Check'}
                    </button>
                  </div>
                  {codeValidation && (
                    <p className={`text-sm mt-2 ${codeValidation.valid ? 'text-green-400' : 'text-red-400'}`}>
                      {codeValidation.valid ? `✓ Valid code from ${codeValidation.referrer.name}` : `✗ ${codeValidation.error}`}
                    </p>
                  )}
                </div>

                {codeValidation?.valid && (
                  <>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <p className="text-green-400 text-sm">
                        Code verified! Complete the form below to claim your rewards.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={friendForm.name}
                        onChange={(e) => setFriendForm({ ...friendForm, name: e.target.value })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition"
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Your Email *</label>
                      <input
                        type="email"
                        required
                        value={friendForm.email}
                        onChange={(e) => setFriendForm({ ...friendForm, email: e.target.value })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition"
                        placeholder="jane@university.edu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Phone (optional)</label>
                      <input
                        type="tel"
                        value={friendForm.phone}
                        onChange={(e) => setFriendForm({ ...friendForm, phone: e.target.value })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 py-4 rounded-xl font-bold text-lg transition"
                    >
                      {isSubmitting ? 'Processing...' : 'Claim My Discount'}
                    </button>
                  </>
                )}
              </form>

              <div className="mt-8 p-4 bg-gray-800/50 rounded-xl">
                <h3 className="font-bold mb-2">What you get:</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">💵</span>
                    <span className="font-bold text-green-400">$50 off</span> projects or <span className="font-bold text-blue-400">$5 off</span> assignments
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-bold text-yellow-400">Your referrer</span> earns a cash reward
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">🎁</span>
                    Priority support and faster delivery
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-12 px-4 bg-gradient-to-r from-green-900/20 via-emerald-900/20 to-green-900/20 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Calculate Your Earnings</h2>
          <p className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">Project Referrals</p>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[{n: 1, earn: 50}, {n: 3, earn: 250}, {n: 5, earn: 450}, {n: 10, earn: 950}].map(({n, earn}) => (
              <div key={n} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">{n} Referral{n > 1 ? 's' : ''}</p>
                <p className="text-2xl font-bold text-green-400">${earn}</p>
              </div>
            ))}
          </div>
          <p className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 mt-6">Assignment Referrals</p>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[{n: 1, earn: 5}, {n: 3, earn: 25}, {n: 5, earn: 45}, {n: 10, earn: 95}].map(({n, earn}) => (
              <div key={n} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">{n} Referral{n > 1 ? 's' : ''}</p>
                <p className="text-2xl font-bold text-blue-400">${earn}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400">
            Refer <span className="text-white font-bold">10 friends</span> for projects = <span className="text-green-400 font-bold">$950</span> | for assignments = <span className="text-blue-400 font-bold">$95</span>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 bg-gray-800/30 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800 text-center text-gray-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xl">⛓️</span>
            <span className="font-bold text-white">AgentChains.ai</span>
          </div>
          <p className="text-sm">© 2024 AgentChains.ai — Professional Academic Project Assistance</p>
          <p className="text-xs mt-2">Questions? Email us at info@agentchains.ai</p>
        </div>
      </footer>
    </div>
  );
};

export default Referral;
