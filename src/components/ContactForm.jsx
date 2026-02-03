import { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit';

const ContactForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    university: '',
    courseName: '',
    serviceType: '',
    projectPackage: '',
    deadline: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const { submitForm, isSubmitting } = useFormSubmit(() => {
    setShowSuccess(true);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm(formData);
  };

  // Success screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl text-center animate-fadeIn">
          {/* Animated checkmark */}
          <div className="relative mx-auto mb-6 w-24 h-24">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40">
              <span className="text-5xl">✓</span>
            </div>
          </div>

          {/* Bold success heading */}
          <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Request Submitted!
          </h2>

          <p className="text-xl font-bold text-white mb-1">
            We'll connect with you shortly!
          </p>

          <p className="text-gray-400 text-sm mb-6">
            Our team is reviewing your request right now.
          </p>

          {/* Highlights */}
          <div className="bg-gray-700/40 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400 font-bold">✓</span>
              <span>Dedicated project manager assigned</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400 font-bold">✓</span>
              <span>Free consultation call included</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400 font-bold">✓</span>
              <span>Expect a response very soon</span>
            </div>
          </div>

          {/* Contact info */}
          <p className="text-gray-500 text-xs mb-5">
            Need urgent help? Email us at <a href="mailto:info@agentchains.ai" className="text-orange-400 hover:text-orange-300 font-medium">info@agentchains.ai</a>
          </p>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-3 rounded-xl font-bold text-lg shadow-lg shadow-green-500/25 transition-all hover:scale-105"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold">Get Started</h3>
            <p className="text-gray-400 text-sm">Fill in your details and we'll connect with you shortly</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">What do you need? *</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setFormData({...formData, serviceType: 'project'})}
                className={`p-4 rounded-xl border-2 text-center transition-all ${formData.serviceType === 'project' ? 'border-orange-500 bg-orange-500/20' : 'border-gray-600 hover:border-gray-500'}`}>
                <span className="text-2xl block mb-1">🚀</span>
                <span className="font-bold">Project</span>
                <span className="text-xs text-gray-400 block">From $299</span>
              </button>
              <button type="button" onClick={() => setFormData({...formData, serviceType: 'assignment'})}
                className={`p-4 rounded-xl border-2 text-center transition-all ${formData.serviceType === 'assignment' ? 'border-green-500 bg-green-500/20' : 'border-gray-600 hover:border-gray-500'}`}>
                <span className="text-2xl block mb-1">📚</span>
                <span className="font-bold">Assignment</span>
                <span className="text-xs text-gray-400 block">From $25</span>
              </button>
            </div>
          </div>

          {/* Project Package Selection */}
          {formData.serviceType === 'project' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Package *</label>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setFormData({...formData, projectPackage: 'code'})}
                  className={`p-3 rounded-lg border text-center text-sm transition-all ${formData.projectPackage === 'code' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'}`}>
                  <span className="font-bold block">Code Only</span>
                  <span className="text-gray-400 text-xs">$299</span>
                </button>
                <button type="button" onClick={() => setFormData({...formData, projectPackage: 'docs'})}
                  className={`p-3 rounded-lg border text-center text-sm transition-all ${formData.projectPackage === 'docs' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'}`}>
                  <span className="font-bold block">Docs Only</span>
                  <span className="text-gray-400 text-xs">$349</span>
                </button>
                <button type="button" onClick={() => setFormData({...formData, projectPackage: 'complete'})}
                  className={`p-3 rounded-lg border text-center text-sm transition-all ${formData.projectPackage === 'complete' ? 'border-orange-500 bg-orange-500/20' : 'border-gray-600 hover:border-gray-500'}`}>
                  <span className="font-bold block">Complete</span>
                  <span className="text-orange-400 text-xs">$399 ⭐</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
              <input type="text" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address *</label>
              <input type="email" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@university.edu" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number *</label>
              <input type="tel" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+1 234 567 8900" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">WhatsApp Number</label>
              <input type="tel" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} placeholder="+1 234 567 8900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">University Name</label>
              <input type="text" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500" value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} placeholder="University of Kansas" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Course Name *</label>
              <input type="text" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500" value={formData.courseName} onChange={(e) => setFormData({...formData, courseName: e.target.value})} placeholder="Software Engineering" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Deadline</label>
            <input type="date" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Project / Assignment Details</label>
            <textarea className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 h-24 resize-none" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Tell us about your requirements, preferred tech stack, special formatting needs, etc." />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request →'}
          </button>
          <p className="text-center text-gray-500 text-xs">🔒 Your information is secure. We'll get back to you shortly.</p>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
