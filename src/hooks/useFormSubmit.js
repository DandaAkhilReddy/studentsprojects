import { useState } from 'react';
import toast from 'react-hot-toast';

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const WEB3FORMS_KEY = '872126ea-0595-4349-9c5b-4e190cc0d839';

export const useFormSubmit = (onSuccess) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (formData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New ${formData.serviceType === 'project' ? 'Project' : 'Assignment'} Request - ${formData.name}`,
          from_name: 'AgentChains.ai Website',

          // Form fields
          'Full Name': formData.name,
          'Email': formData.email,
          'Phone': formData.phone,
          'WhatsApp': formData.whatsapp || 'Not provided',
          'University': formData.university || 'Not provided',
          'Course Name': formData.courseName,
          'Service Type': formData.serviceType === 'project' ? 'Project' : 'Assignment',
          'Package': formData.projectPackage || 'N/A',
          'Deadline': formData.deadline || 'Not specified',
          'Details': formData.message || 'No additional details',

          // Metadata
          'Submitted At': new Date().toLocaleString(),
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Thank you! We will contact you within 24 hours.', {
          duration: 5000,
          icon: '🎉'
        });
        onSuccess?.();
        return true;
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Something went wrong. Please try again or email us directly at info@agentchains.ai', {
        duration: 5000
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitForm, isSubmitting };
};
