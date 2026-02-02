const ReferralProgram = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-purple-900/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">🎁 Refer Friends & Earn Rewards</h2>
        <p className="text-xl opacity-90 mb-10">Share with your classmates and save big!</p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-black">1</div>
            <div className="text-3xl font-bold text-yellow-300 mb-2">$50</div>
            <div className="font-bold">1st Referral</div>
            <p className="text-sm opacity-75 mt-1">Get $50 credit instantly</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-black">2</div>
            <div className="text-3xl font-bold text-yellow-300 mb-2">$100</div>
            <div className="font-bold">2nd Referral</div>
            <p className="text-sm opacity-75 mt-1">Total: $150 credit!</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur rounded-2xl p-6 border border-yellow-500/50">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-black">3+</div>
            <div className="text-3xl font-bold text-yellow-300 mb-2">FREE</div>
            <div className="font-bold">3+ Referrals</div>
            <p className="text-sm opacity-75 mt-1">Your project is completely FREE!</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 inline-block">
          <p className="text-lg">Refer just <span className="font-bold text-yellow-300">3 friends</span> = Get your <span className="font-bold text-yellow-300">$399 project for FREE!</span> 🎉</p>
        </div>
      </div>
    </section>
  );
};

export default ReferralProgram;
