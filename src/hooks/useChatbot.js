import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

// Use relative URL for Netlify functions (works in both dev and production)
const CHAT_API_URL = '/.netlify/functions/chat';

export const useChatbot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    if (!message || !message.trim()) {
      return { success: false, error: 'Message cannot be empty' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.error || 'Failed to send message';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      return {
        success: true,
        text: data.response,
        usage: data.usage,
      };
    } catch (err) {
      const errorMsg = 'Network error. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Chatbot error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
  };
};

export default useChatbot;
