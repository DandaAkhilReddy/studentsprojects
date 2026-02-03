import { useState, useEffect } from 'react';

// Layout
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Sections
import Hero from '../components/sections/Hero';
import TrustBar from '../components/sections/TrustBar';
import ResumeBuilderHighlight from '../components/sections/ResumeBuilderHighlight';
import ProblemSection from '../components/sections/ProblemSection';
import TrendingProjects from '../components/sections/TrendingProjects';
import AssignmentBanner from '../components/sections/AssignmentBanner';
import Pricing from '../components/sections/Pricing';
import ReferralProgram from '../components/sections/ReferralProgram';
import Deliverables from '../components/sections/Deliverables';
import Reviews from '../components/sections/Reviews';
import HowItWorks from '../components/sections/HowItWorks';
import CTA from '../components/sections/CTA';

// Components
import ContactForm from '../components/ContactForm';
import WelcomePopup from '../components/WelcomePopup';
import FloatingReferralCTA from '../components/FloatingReferralCTA';

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Show welcome popup after 1.5s delay (once per session)
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('welcomePopupDismissed');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => setShowWelcomePopup(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissWelcomePopup = () => {
    setShowWelcomePopup(false);
    sessionStorage.setItem('welcomePopupDismissed', 'true');
  };

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white font-sans">
      {/* Modals */}
      {showForm && <ContactForm onClose={closeForm} />}
      {showWelcomePopup && <WelcomePopup onClose={dismissWelcomePopup} />}

      {/* Floating CTAs */}
      <FloatingReferralCTA />

      <Navbar onGetStarted={openForm} />
      <Hero onGetStarted={openForm} />
      <TrustBar />
      <ResumeBuilderHighlight />
      <ReferralProgram />
      <ProblemSection />
      <TrendingProjects onSelect={openForm} />
      <AssignmentBanner onOrder={openForm} />
      <Pricing onGetStarted={openForm} />
      <Deliverables />
      <Reviews />
      <HowItWorks />
      <CTA onGetStarted={openForm} />
      <Footer />
    </div>
  );
};

export default Home;
