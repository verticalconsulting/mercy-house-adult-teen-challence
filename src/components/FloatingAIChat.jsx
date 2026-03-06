import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingAIChat() {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !conversation) {
      initConversation();
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const initConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: 'mercy_house_assistant',
      metadata: { name: 'Mercy House Chat' }
    });
    setConversation(conv);
    setMessages([{
      role: 'assistant',
      content: "Hi! I'm here to answer any questions you have about Mercy House Adult & Teen Challenge. Whether you're seeking help, looking to volunteer, or just want to learn more — ask away! 💙"
    }]);

    base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages.filter(m => m.role !== 'system'));
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending || !conversation) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    try {
      await base44.agents.addMessage(conversation, { role: 'user', content: text });
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 bg-navy hover:bg-navy/90 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label={open ? 'Close chat' : 'Ask a question about Mercy House'}
        aria-expanded={open}
        aria-controls="ai-chat-panel"
      >
        {open
          ? <X className="w-6 h-6" aria-hidden="true" />
          : <MessageCircle className="w-6 h-6" aria-hidden="true" />}
        {!open && (
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ask about Mercy House
          </span>
        )}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="ai-chat-panel"
            role="dialog"
            aria-label="Mercy House AI Assistant"
            aria-modal="false"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 right-4 lg:bottom-24 lg:right-6 z-40 w-[calc(100vw-2rem)] max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
            style={{ maxHeight: '70vh' }}
          >
            {/* Header */}
            <div className="bg-navy text-white px-4 py-3 flex items-center gap-3">
              <div className="bg-gold rounded-full p-1.5">
                <Bot className="w-4 h-4 text-navy" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-sm">Mercy House Assistant</p>
                <p className="text-xs text-slate-300">Ask me anything</p>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-navy text-white rounded-br-sm'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-sm px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-navy dark:text-gold" aria-label="Assistant is typing" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <label htmlFor="chat-input" className="sr-only">Your message</label>
              <input
                id="chat-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about programs, admissions…"
                className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-gold"
                disabled={sending}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="bg-navy hover:bg-navy/90 text-white rounded-lg px-3 py-2 disabled:opacity-50 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}