import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { logChatMessage } from '../services/chatAnalytics';

const CHAT_API_URL = '/.netlify/functions/chat';
const CLIENT_RATE_LIMIT = 10;
const CLIENT_RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Client-side rate tracking (backup for server-side)
const getClientMessageCount = () => {
  try {
    const data = JSON.parse(sessionStorage.getItem('chatRateLimit') || '{}');
    const now = Date.now();
    // Filter timestamps within the window
    const timestamps = (data.timestamps || []).filter(
      (t) => now - t < CLIENT_RATE_WINDOW_MS
    );
    return { count: timestamps.length, timestamps };
  } catch {
    return { count: 0, timestamps: [] };
  }
};

const recordClientMessage = () => {
  const { timestamps } = getClientMessageCount();
  timestamps.push(Date.now());
  sessionStorage.setItem('chatRateLimit', JSON.stringify({ timestamps }));
};

export const useChatbot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remaining, setRemaining] = useState(CLIENT_RATE_LIMIT);

  const sendMessage = useCallback(async (message) => {
    if (!message || !message.trim()) {
      return { success: false, error: 'Message cannot be empty' };
    }

    // Client-side rate check
    const { count } = getClientMessageCount();
    if (count >= CLIENT_RATE_LIMIT) {
      const errorMsg = `Message limit reached (${CLIENT_RATE_LIMIT}/hour). Please wait a bit.`;
      toast.error(errorMsg);
      return { success: false, error: errorMsg, rateLimited: true };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = await response.json();

      // Handle rate limit from server
      if (response.status === 429 || data.rateLimited) {
        const errorMsg = data.error || 'Rate limit reached. Please wait.';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg, rateLimited: true };
      }

      if (!response.ok || !data.success) {
        const errorMsg = data.error || 'Failed to send message';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Track client-side rate
      recordClientMessage();
      if (data.remaining !== undefined) {
        setRemaining(data.remaining);
      }

      // Log to Firebase analytics (non-blocking)
      logChatMessage(message.trim(), data.response, data.usage);

      return {
        success: true,
        text: data.response,
        usage: data.usage,
        remaining: data.remaining,
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
    remaining,
  };
};

export default useChatbot;
