import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AIAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen || conversation) return;

    let unsubscribe;

    const initConversation = async () => {
      setInitializing(true);
      try {
        console.log('Creating conversation with agent: intake_support');
        const conv = await base44.agents.createConversation({
          agent_name: 'intake_support',
          metadata: {
            name: 'Website Chat',
            source: 'website'
          }
        });
        console.log('Conversation created:', conv.id);
        setConversation(conv);
        setMessages(conv.messages || []);

        // Subscribe to updates
        console.log('Subscribing to conversation updates');
        unsubscribe = base44.agents.subscribeToConversation(conv.id, (data) => {
          console.log('Received update, messages:', data.messages.length);
          setMessages(data.messages);
          setLoading(false);
        });
        
        setInitializing(false);
      } catch (error) {
        console.error('Failed to initialize conversation:', error);
        alert('Failed to initialize chat. Please refresh and try again.');
        setLoading(false);
        setInitializing(false);
      }
    };

    initConversation();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen, conversation]);

  const sendMessage = async () => {
    if (!input.trim() || !conversation) {
      console.log('Cannot send: input or conversation missing', { input, conversation });
      return;
    }

    const userMessage = input;
    setInput('');
    
    // Optimistically add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: userMessage
      });
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(m => m.content !== userMessage));
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50 group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-navy dark:bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Need help? Chat with us!
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="bg-navy dark:bg-slate-950 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-navy" />
              </div>
              <div>
                <h3 className="font-bold">Mercy House Support</h3>
                <p className="text-xs text-slate-300">Ask us anything</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
            {initializing && (
              <div className="flex justify-center items-center h-full">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-navy dark:text-gold mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Connecting...</p>
                </div>
              </div>
            )}
            
            {!initializing && messages.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <div className="text-center text-slate-500 dark:text-slate-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm">Send a message to get started!</p>
                </div>
              </div>
            )}
            
            {!initializing && messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-navy dark:bg-gold text-white dark:text-navy'
                      : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    <ReactMarkdown className="text-sm prose prose-sm max-w-none text-slate-900 dark:text-slate-100 prose-p:text-slate-900 dark:prose-p:text-slate-100 prose-li:text-slate-900 dark:prose-li:text-slate-100 prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-slate-800 dark:prose-code:text-slate-200">
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-600">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-navy dark:bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-navy dark:bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-navy dark:bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}