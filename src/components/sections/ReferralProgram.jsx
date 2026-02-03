import { Link } from 'react-router-dom';

const ReferralProgram = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-green-900/40 via-emerald-900/40 to-green-900/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Hot badge */}
        <div className="inline-block bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold mb-3 animate-pulse">
          🔥 POPULAR
        </div>

        <div className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
          💰 Referral Program — Everyone Wins!
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Earn on Every Referral</h2>
        <p className="text-xl opacity-90 mb-8">Refer for projects or assignments. Your friend gets a discount!</p>

        {/* Project Referrals */}
        <p className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">Project Referrals</p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 hover:border-green-500/50 transition-all hover:scale-105">
            <div className="text-3xl mb-2">💵</div>
            <div className="text-3xl font-bold text-green-400 mb-1">$50</div>
            <div className="font-bold text-sm">1st Referral</div>
            <p className="text-xs opacity-75 mt-1">Friend gets $50 off</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 hover:border-green-500/50 transition-all hover:scale-105">
            <div className="text-3xl mb-2">🚀</div>
            <div className="text-3xl font-bold text-green-400 mb-1">$100</div>
            <div className="font-bold text-sm">2nd+ Referral</div>
            <p className="text-xs opacity-75 mt-1">$100 for every additional</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur rounded-2xl p-5 border border-green-500/50 hover:scale-105 transition-all">
            <div className="text-3xl mb-2">♾️</div>
            <div className="text-3xl font-bold text-green-400 mb-1">No Limit</div>
            <div className="font-bold text-sm">Unlimited</div>
            <p className="text-xs opacity-75 mt-1">10 friends = $950!</p>
          </div>
        </div>

        {/* Assignment Referrals */}
        <p className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3">Assignment Referrals</p>
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 hover:border-blue-500/50 transition-all hover:scale-105">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-3xl font-bold text-blue-400 mb-1">$5</div>
            <div className="font-bold text-sm">1st Referral</div>
            <p className="text-xs opacity-75 mt-1">Friend gets $5 off</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 hover:border-blue-500/50 transition-all hover:scale-105">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-3xl font-bold text-blue-400 mb-1">$10</div>
            <div className="font-bold text-sm">2nd+ Referral</div>
            <p className="text-xs opacity-75 mt-1">$10 for every additional</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur rounded-2xl p-5 border border-blue-500/50 hover:scale-105 transition-all">
            <div className="text-3xl mb-2">♾️</div>
            <div className="text-3xl font-bold text-blue-400 mb-1">No Limit</div>
            <div className="font-bold text-sm">Unlimited</div>
            <p className="text-xs opacity-75 mt-1">10 friends = $95!</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 inline-block mb-6">
          <p className="text-lg">
            <span className="font-bold text-green-400">Don't even need to be a customer!</span> Register, get your code, and start earning.
          </p>
        </div>

        <div>
          <Link
            to="/referral#register"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-10 py-5 rounded-xl font-bold text-xl transition shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 animate-pulse"
          >
            Get Your Referral Code →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReferralProgram;
