import { db } from '../config/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore/lite';

// Generate a simple session ID for grouping messages
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('chatSessionId');
  if (!sessionId) {
    sessionId = 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    sessionStorage.setItem('chatSessionId', sessionId);
  }
  return sessionId;
};

/**
 * Log a chat exchange to Firestore (non-blocking)
 * @param {string} userMessage - The user's message
 * @param {string} botResponse - The bot's response
 * @param {object} usage - Token usage { input_tokens, output_tokens }
 */
export const logChatMessage = (userMessage, botResponse, usage = {}) => {
  try {
    const chatRef = doc(collection(db, 'chatMessages'));
    // Fire and forget - don't await to keep UI fast
    setDoc(chatRef, {
      sessionId: getSessionId(),
      userMessage,
      botResponse,
      inputTokens: usage.input_tokens || 0,
      outputTokens: usage.output_tokens || 0,
      timestamp: serverTimestamp(),
    }).catch((err) => {
      console.error('Failed to log chat message:', err);
    });
  } catch (err) {
    console.error('Chat analytics error:', err);
  }
};
