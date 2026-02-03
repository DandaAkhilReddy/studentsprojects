import { Link } from 'react-router-dom';

const ReferralProgram = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-green-900/30 via-emerald-900/30 to-green-900/30">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
          💰 Referral Program — Everyone Wins!
        </div>
        <h2 className="text-3xl font-bold mb-4">You Get $50 + Friend Gets $50</h2>
        <p className="text-xl opacity-90 mb-6">Share your unique code. When they sign up, BOTH of you get paid!</p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-3">💵</div>
            <div className="text-3xl font-bold text-green-400 mb-2">$50</div>
            <div className="font-bold">You Get</div>
            <p className="text-sm opacity-75 mt-1">Real cash, not credits</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🎁</div>
            <div className="text-3xl font-bold text-green-400 mb-2">$50</div>
            <div className="font-bold">Friend Gets</div>
            <p className="text-sm opacity-75 mt-1">Plus 20% off weekly projects</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur rounded-2xl p-6 border border-green-500/50">
            <div className="text-4xl mb-3">♾️</div>
            <div className="text-3xl font-bold text-green-400 mb-2">No Limit</div>
            <div className="font-bold">Unlimited Referrals</div>
            <p className="text-sm opacity-75 mt-1">10 friends = $500 for you!</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 inline-block mb-6">
          <p className="text-lg">
            <span className="font-bold text-green-400">Don't even need to be a customer!</span> Register, get your code, and start earning.
          </p>
        </div>

        <div>
          <Link
            to="/referral"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-green-500/25"
          >
            Get Your Referral Code →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReferralProgram;
