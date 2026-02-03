import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Referral = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'f2a23d52-502f-45ee-a3a6-5b1269fad816',
          subject: 'New Referral Partner Sign-up - AgentChains',
          from_name: 'AgentChains Referral Program',
          ...formData,
          type: 'Referral Partner Application'
        })
      });

      if (response.ok) {
        toast.success('Welcome to the referral program! Check your email for next steps.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }

    setIsSubmitting(false);
  };

  const faqs = [
    {
      q: "Do I need to be a customer to earn referral money?",
      a: "No! Anyone can earn $100 per referral. You don't need to use our services to participate."
    },
    {
      q: "When do I get paid?",
      a: "You get paid once your referral completes their payment. We'll send you the $100 within 24-48 hours."
    },
    {
      q: "Is there a limit to how many people I can refer?",
      a: "No limit! Refer as many people as you want. Each successful referral = $100 in your pocket."
    },
    {
      q: "What are the two payout options?",
      a: "Option 1: Your referral pays full price ($399) and we pay you $100 directly. Option 2: Your referral pays $299 (discounted) and pays you $100 directly."
    },
    {
      q: "How do I track my referrals?",
      a: "After signing up, you'll receive a unique referral code. We'll notify you via email whenever someone uses your code."
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
            <span className="text-green-400 text-sm font-medium">💰 Earn $100</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-5 py-2 rounded-lg font-semibold text-sm transition">Get Project Help</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-emerald-900/20 to-green-900/20"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            💰 Referral Program
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Earn <span className="text-green-400">$100</span> For Every Referral
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Even if you're not our customer — refer a friend, and when they pay, <span className="text-green-400 font-bold">you get $100 cash</span>.
          </p>
          <p className="text-lg text-gray-400 mb-8">
            No limits. No strings attached. Real money in your pocket.
          </p>
          <a href="#signup" className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-green-500/25">
            Start Earning Now →
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-2">Sign Up & Get Your Code</h3>
              <p className="text-gray-400">Fill out the form below and receive your unique referral code instantly via email.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-2">Share With Friends</h3>
              <p className="text-gray-400">Share your code with classmates, friends, or anyone who needs project help.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">$</div>
              <h3 className="text-xl font-bold mb-2">Get Paid $100</h3>
              <p className="text-gray-400">When your referral pays for their project, you receive $100. Simple as that!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Payout Options */}
      <section className="py-16 px-4 bg-gray-800/30 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Choose Your Payout Option</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Your referral saves money, and you get paid. Everyone wins!</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Option A */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-green-500/50 transition">
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">Option A</div>
              <h3 className="text-2xl font-bold mb-4">We Pay You Directly</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Your referral pays <span className="font-bold">$399</span> (full price)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>We send you <span className="font-bold text-green-400">$100</span> within 48 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Payment via PayPal, Venmo, Zelle, or bank transfer</span>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400">Your earnings</p>
                <p className="text-3xl font-bold text-green-400">$100</p>
              </div>
            </div>

            {/* Option B */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-800/50 rounded-2xl p-8 border border-orange-500/50 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">POPULAR</div>
              <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">Option B</div>
              <h3 className="text-2xl font-bold mb-4">Collect From Your Referral</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-orange-400">✓</span>
                  <span>Your referral pays only <span className="font-bold text-orange-400">$299</span> (saves $100!)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-orange-400">✓</span>
                  <span>You collect <span className="font-bold text-green-400">$100</span> directly from them</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-orange-400">✓</span>
                  <span>They save money, you earn money — win-win!</span>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400">Your earnings</p>
                <p className="text-3xl font-bold text-green-400">$100</p>
                <p className="text-xs text-orange-400 mt-1">+ Your friend saves $100</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Our Referral Program?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
              <div className="text-4xl mb-3">💵</div>
              <h3 className="font-bold mb-2">Real Cash</h3>
              <p className="text-sm text-gray-400">Not credits or discounts — actual money in your account</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
              <div className="text-4xl mb-3">🚫</div>
              <h3 className="font-bold mb-2">No Purchase Required</h3>
              <p className="text-sm text-gray-400">You don't need to buy anything to start earning</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
              <div className="text-4xl mb-3">♾️</div>
              <h3 className="font-bold mb-2">Unlimited Referrals</h3>
              <p className="text-sm text-gray-400">No cap on earnings — refer 10 friends, earn $1,000</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold mb-2">Fast Payment</h3>
              <p className="text-sm text-gray-400">Get paid within 24-48 hours of referral's payment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-900/30 via-emerald-900/30 to-green-900/30 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Calculate Your Earnings</h2>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1, 3, 5, 10].map(num => (
              <div key={num} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">{num} Referral{num > 1 ? 's' : ''}</p>
                <p className="text-3xl font-bold text-green-400">${num * 100}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400">
            Imagine referring just <span className="text-white font-bold">5 classmates</span> — that's <span className="text-green-400 font-bold">$500</span> extra in your pocket!
          </p>
        </div>
      </section>

      {/* Sign Up Form */}
      <section id="signup" className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Join the Referral Program</h2>
          <p className="text-gray-400 text-center mb-8">Sign up now and get your unique referral code instantly</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label className="block text-sm text-gray-400 mb-2">How will you share referrals? (optional)</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition h-24"
                placeholder="e.g., I'll share with my study group, post on social media..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 py-4 rounded-xl font-bold text-lg transition"
            >
              {isSubmitting ? 'Submitting...' : 'Get My Referral Code →'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-4">
            You'll receive your unique referral code via email within minutes
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-800/30 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join hundreds of students already earning with our referral program
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#signup" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl font-bold text-lg transition">
              Sign Up Now
            </a>
            <Link to="/" className="border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl font-bold text-lg transition">
              Learn About Our Services
            </Link>
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
