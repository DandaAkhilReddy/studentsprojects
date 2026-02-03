import { useState, useRef, useEffect, useCallback } from 'react';
import { useChatbot } from '../hooks/useChatbot';

// Notification sound using Web Audio API (no external files)
const playNotificationSound = (() => {
  let audioCtx = null;

  return () => {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Silently fail if audio not supported
    }
  };
})();

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hi! I'm the AgentChains assistant. How can I help you with your project today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { sendMessage, isLoading, remaining } = useChatbot();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick reply suggestions
  const quickReplies = [
    { text: 'What packages do you offer?', icon: '📦' },
    { text: 'How does the process work?', icon: '🔄' },
    { text: 'Tell me about referral program', icon: '💰' },
    { text: 'What free tools do you have?', icon: '🛠️' },
    { text: 'How much for an assignment?', icon: '📝' },
    { text: 'What is the deadline?', icon: '⏰' },
  ];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Play sound when a new bot message arrives
  const prevMessageCount = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'bot' && hasInteracted && !isMuted) {
        playNotificationSound();
      }
    }
    prevMessageCount.current = messages.length;
  }, [messages, hasInteracted, isMuted]);

  const handleSend = useCallback(
    async (messageText = input) => {
      const text = typeof messageText === 'string' ? messageText.trim() : input.trim();
      if (!text || isLoading) return;

      // Mark as interacted for sound
      if (!hasInteracted) setHasInteracted(true);

      // Add user message
      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      setInput('');

      // Send to API and get response
      const response = await sendMessage(text);

      if (response.success) {
        setMessages((prev) => [...prev, { role: 'bot', content: response.text }]);
      } else if (response.rateLimited) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            content: "You've reached the message limit for this hour. Please try again later!",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', content: 'Sorry, I had trouble responding. Please try again.' },
        ]);
      }
    },
    [input, isLoading, sendMessage, hasInteracted]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (text) => {
    if (!hasInteracted) setHasInteracted(true);
    handleSend(text);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setHasInteracted(true);
          }}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center hover:scale-110 transition-all duration-300 group"
          aria-label="Open chat"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-[360px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-6rem)] bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">AgentChains Assistant</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Mute Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-400 hover:text-white text-lg transition p-1"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none transition p-1"
                aria-label="Close chat"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'bot' && (
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <span className="text-xs">🤖</span>
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md'
                      : 'bg-gray-700/80 text-gray-100 rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start items-start">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <span className="text-xs">🤖</span>
                </div>
                <div className="bg-gray-700/80 px-4 py-2.5 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDuration: '0.6s' }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDuration: '0.6s', animationDelay: '0.15s' }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDuration: '0.6s', animationDelay: '0.3s' }}
                      ></span>
                    </div>
                    <span className="text-xs text-gray-400">Typing...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {!isLoading && messages[messages.length - 1]?.role === 'bot' && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickReply(reply.text)}
                    className="text-xs bg-gray-700/60 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-full transition border border-gray-600/50 hover:border-orange-500/50 flex items-center gap-1"
                  >
                    <span>{reply.icon}</span>
                    {reply.text}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-700 bg-gray-800/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 disabled:opacity-50 placeholder-gray-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-4 py-2.5 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '...' : '→'}
              </button>
            </div>
            <div className="flex justify-between items-center mt-1.5">
              <p className="text-gray-600 text-xs">Powered by Claude AI</p>
              {remaining < 5 && (
                <p className="text-yellow-500 text-xs">{remaining} messages left</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
