const steps = [
  { step: 1, title: 'Fill the Form', desc: 'Tell us about your project or assignment requirements', icon: '📝' },
  { step: 2, title: 'Get Quote & Confirm', desc: "We'll review and send you a detailed quote within hours", icon: '💬' },
  { step: 3, title: 'We Build Everything', desc: 'Code + docs + PPT — all in YOUR preferred format', icon: '⚡' },
  { step: 4, title: 'Review & Revise', desc: "Unlimited revisions until you're 100% satisfied", icon: '✨' },
  { step: 5, title: 'Submit & Succeed', desc: 'We help with deployment and presentation prep', icon: '🎉' }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="space-y-8">
          {steps.map((item) => (
            <div key={item.step} className="flex gap-5 items-start">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-orange-500/25">{item.icon}</div>
              <div>
                <div className="text-xs text-orange-400 font-semibold mb-1">STEP {item.step}</div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
