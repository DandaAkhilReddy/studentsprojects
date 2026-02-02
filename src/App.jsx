import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Sections
import Hero from './components/sections/Hero';
import TrustBar from './components/sections/TrustBar';
import ProblemSection from './components/sections/ProblemSection';
import TrendingProjects from './components/sections/TrendingProjects';
import AssignmentBanner from './components/sections/AssignmentBanner';
import Pricing from './components/sections/Pricing';
import ReferralProgram from './components/sections/ReferralProgram';
import Deliverables from './components/sections/Deliverables';
import Reviews from './components/sections/Reviews';
import HowItWorks from './components/sections/HowItWorks';
import CTA from './components/sections/CTA';

// Components
import ContactForm from './components/ContactForm';

function App() {
  const [showForm, setShowForm] = useState(false);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white font-sans">
      <Toaster position="top-center" />

      {showForm && <ContactForm onClose={closeForm} />}

      <Navbar onGetStarted={openForm} />
      <Hero onGetStarted={openForm} />
      <TrustBar />
      <ProblemSection />
      <TrendingProjects onSelect={openForm} />
      <AssignmentBanner onOrder={openForm} />
      <Pricing onGetStarted={openForm} />
      <ReferralProgram />
      <Deliverables />
      <Reviews />
      <HowItWorks />
      <CTA onGetStarted={openForm} />
      <Footer />
    </div>
  );
}

export default App;
