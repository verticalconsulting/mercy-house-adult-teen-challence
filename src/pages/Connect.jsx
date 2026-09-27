import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, Bot, MessageSquare, Code2, Settings, RefreshCw, ArrowLeft } from 'lucide-react';
import { createPageUrl } from '../utils';

// Mercy House — Connect Your AI Assistant
// Teaches end users how to point an AI client (Claude, ChatGPT, Cursor, or a
// custom MCP client) at this app's public MCP server.
export default function Connect() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('claude');

  const serverUrl = new URL('/api/mcp', window.location.origin).toString();

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(serverUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = serverUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clients = [
    {
      id: 'claude',
      label: 'Claude',
      icon: Bot,
      steps: [
        { text: 'Open Claude and click your profile menu (top-left or top-right).' },
        { text: 'Go to Settings → Connectors.' },
        { text: 'Click "Add custom connector".' },
        { text: 'Name it (e.g., "Mercy House") and paste the server URL above.' },
        { text: 'Click Add. Claude can now query Mercy House data in your conversations.' },
      ],
    },
    {
      id: 'chatgpt',
      label: 'ChatGPT',
      icon: MessageSquare,
      steps: [
        { text: 'Open ChatGPT and go to Apps.' },
        { text: 'Enable Developer mode (repeat the risk warning ChatGPT shows).' },
        { text: 'Click "Create app" and name it (e.g., "Mercy House").' },
        { text: 'Paste the server URL above and click Create.' },
        { text: 'Enable the app from the chat composer before prompting it.' },
      ],
    },
    {
      id: 'cursor',
      label: 'Cursor',
      icon: Code2,
      steps: [
        { text: 'Open Cursor and go to Settings → Tools & Integrations.' },
        { text: 'Click "New MCP Server" — this opens your mcp.json file.' },
        { text: 'Add an entry whose "url" is the server URL above.' },
        { text: 'Save the file and toggle the server on.' },
      ],
    },
    {
      id: 'custom',
      label: 'Custom',
      icon: Settings,
      steps: [
        { text: 'Copy the server URL above.' },
        { text: 'Add it as a streamable HTTP MCP server in your client.' },
        { text: 'Name + URL is all most clients need.' },
        { text: 'Reload the client to load the tools.' },
      ],
    },
  ];

  const activeClient = clients.find((c) => c.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-gold transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Bot className="w-10 h-10 text-gold" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold">Connect Your AI Assistant</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            Mercy House's public data is available to AI assistants through our MCP server. Connect your favorite AI tool to ask questions about our programs, events, success stories, and more.
          </p>
        </div>
      </section>

      {/* Server URL */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-3">Your MCP Server URL</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm md:text-base">
            Copy this URL and paste it into your AI assistant's connector settings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 font-mono text-sm text-slate-700 dark:text-slate-300 break-all select-all">
              {serverUrl}
            </div>
            <button
              onClick={copyUrl}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 font-bold text-navy-950 shadow-cta transition-colors hover:bg-gold-accessible hover:text-white shrink-0"
              aria-label="Copy server URL to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy URL
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Client tabs */}
      <section className="pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-6">Choose Your AI Assistant</h2>

          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-6" role="tablist">
            {clients.map((client) => {
              const Icon = client.icon;
              const isActive = activeTab === client.id;
              return (
                <button
                  key={client.id}
                  onClick={() => setActiveTab(client.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-3 font-semibold text-sm transition-colors ${
                    isActive
                      ? 'bg-navy text-white'
                      : 'bg-white dark:bg-slate-800 text-navy dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-navy/5 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {client.label}
                </button>
              );
            })}
          </div>

          {/* Active client steps */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8" role="tabpanel">
            <div className="flex items-center gap-3 mb-6">
              {React.createElement(activeClient.icon, { className: 'w-6 h-6 text-gold-accessible', 'aria-hidden': true })}
              <h3 className="text-lg font-bold text-navy dark:text-gold">Set up {activeClient.label}</h3>
            </div>
            <ol className="space-y-4">
              {activeClient.steps.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-navy-100 dark:bg-slate-700 text-navy dark:text-gold font-bold text-sm flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 pt-1 text-sm md:text-base leading-relaxed">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Refresh note */}
          <div className="mt-6 flex items-start gap-3 bg-navy-50 dark:bg-slate-800/50 rounded-lg p-4 border border-navy-100 dark:border-slate-700">
            <RefreshCw className="w-5 h-5 text-gold-accessible flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="text-navy dark:text-gold">After we ship changes:</strong> AI assistants cache the tool list. If we add new data or tools, refresh or reconnect the connector in your assistant's settings to pick them up.
            </p>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-navy-deep text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-300 text-sm">
            Mercy House Adult Teen Challenge &middot; 501(c)(3) Nonprofit &middot; EIN 45-4670832
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Public MCP access is read-only. Your personal information and application data are never exposed.
          </p>
        </div>
      </section>
    </div>
  );
}