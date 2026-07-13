import React, { useState, useEffect, useRef, FC } from 'react';
import { 
    MessageSquare, X, Send, Sparkles, Leaf, Trash2, ArrowRight, CornerDownLeft, Info, Key, CheckCircle
} from 'lucide-react';
import { getBobAssistantResponse, ChatMessage } from '../services/geminiService';

// Inline Markdown Renderer for Bob's response formatting
const parseInlineMarkdown = (text: string) => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  const inlineRegex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
  const matches = [...text.matchAll(inlineRegex)];

  if (matches.length === 0) {
    return text;
  }

  matches.forEach((match, index) => {
    const matchIndex = match.index ?? 0;
    
    if (matchIndex > currentIndex) {
      parts.push(text.substring(currentIndex, matchIndex));
    }

    const matchText = match[0];
    if (matchText.startsWith('**') && matchText.endsWith('**')) {
      parts.push(
        <strong key={`bold-${index}`} className="font-extrabold text-organic-green-dark">
          {matchText.slice(2, -2)}
        </strong>
      );
    } else if (matchText.startsWith('[') && matchText.includes('](')) {
      const closeBracket = matchText.indexOf(']');
      const label = matchText.substring(1, closeBracket);
      const url = matchText.substring(closeBracket + 2, matchText.length - 1);
      parts.push(
        <a
          key={`link-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-organic-green-dark font-black underline hover:text-organic-green transition-colors inline-flex items-center gap-0.5"
        >
          {label}
        </a>
      );
    }

    currentIndex = matchIndex + matchText.length;
  });

  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts;
};

const renderMarkdown = (text: string) => {
  if (!text) return null;

  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('###')) {
      return (
        <h4 key={idx} className="text-[11px] font-black text-organic-green-dark uppercase tracking-wider mt-4 mb-1">
          {parseInlineMarkdown(trimmed.replace(/^###\s*/, ''))}
        </h4>
      );
    }
    if (trimmed.startsWith('##')) {
      return (
        <h3 key={idx} className="text-xs font-black text-organic-green-dark uppercase tracking-widest mt-5 mb-1.5">
          {parseInlineMarkdown(trimmed.replace(/^##\s*/, ''))}
        </h3>
      );
    }
    if (trimmed.startsWith('#')) {
      return (
        <h2 key={idx} className="text-sm font-black text-organic-green-dark uppercase tracking-widest mt-6 mb-2">
          {parseInlineMarkdown(trimmed.replace(/^#\s*/, ''))}
        </h2>
      );
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <div key={idx} className="flex items-start gap-2 my-1 pl-1">
          <span className="text-organic-green mt-1 text-xs">•</span>
          <span className="text-xs font-medium text-gray-700 leading-relaxed">
            {parseInlineMarkdown(trimmed.substring(2))}
          </span>
        </div>
      );
    }

    if (trimmed.startsWith('>')) {
      return (
        <div key={idx} className="border-l-4 border-organic-green bg-cream/70 p-3 my-2 rounded-r-xl italic text-xs font-semibold text-gray-600">
          {parseInlineMarkdown(trimmed.replace(/^>\s*/, ''))}
        </div>
      );
    }

    if (trimmed === '') {
      return <div key={idx} className="h-1.5"></div>;
    }

    return (
      <p key={idx} className="text-xs font-medium text-gray-700 leading-relaxed my-1">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });
};

interface BobAssistantProps {
  apiKey: string;
  onOpenApiSettings: () => void;
}

export const BobAssistant: FC<BobAssistantProps> = ({ apiKey, onOpenApiSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('bob_assistant_chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_PROMPTS = [
    { label: "⚖️ Organic Rights", text: "Explain the Universal Declaration of Organic Rights and why it is considered supreme law." },
    { label: "📈 SEO & Certification", text: "How can I leverage organic certification data to improve my website's search engine ranking?" },
    { label: "🧲 Attraction Marketing", text: "How can I use attraction marketing to build trust and grow my organic brand?" },
    { label: "🧪 Hempoxies Science", text: "Tell me about the chemistry and sustainable applications of Hempoxies in materials science." }
  ];

  useEffect(() => {
    localStorage.setItem('bob_assistant_chat', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    if (!apiKey) {
      setError("Please configure your Gemini API key in the search bar settings first to speak with Organic Bob!");
      return;
    }

    setError(null);
    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getBobAssistantResponse(newMessages, apiKey);
      setMessages(prev => [...prev, { role: 'assistant', text: response.text }]);
    } catch (err: any) {
      console.error("Bob Assistant error:", err);
      setError(err instanceof Error ? err.message : "Organic Bob is temporarily offline. Please verify your API Key and try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your conversation with Organic Bob?")) {
      setMessages([]);
      setError(null);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[90] font-sans">
      {/* Closed Button (FAB) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-organic-green-dark to-organic-green text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          title="Chat with Organic Bob - SEO Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cream opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-300"></span>
          </span>
          <div className="relative">
            <Leaf className="w-7 h-7 text-white animate-pulse" />
            <Sparkles className="w-4 h-4 absolute -top-1.5 -right-1.5 text-cream" />
          </div>
          
          {/* Tooltip on hover */}
          <div className="absolute right-20 bg-organic-green-dark text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none border border-white/10">
            Organic Bob
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="bg-white rounded-[2.5rem] shadow-3xl w-full max-w-[380px] sm:max-w-[400px] h-[550px] md:h-[600px] flex flex-col border border-organic-green/10 overflow-hidden animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-organic-green-dark to-organic-green text-white p-5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 relative">
                <Leaf className="w-5 h-5 text-cream" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-organic-green-dark"></div>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest leading-none">Organic Bob</h3>
                <p className="text-[9px] text-cream/70 font-black uppercase tracking-widest mt-1">Organic SEO Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div 
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-5 space-y-4 bg-cream/30 custom-scrollbar flex flex-col"
          >
            {/* Welcome message when no chat exists */}
            {messages.length === 0 && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="bg-white p-5 rounded-[2rem] border border-organic-green/5 shadow-sm space-y-3">
                  <p className="text-xs font-black text-organic-green uppercase tracking-wider">Hello! I am Organic Bob 🌿</p>
                  <p className="text-xs font-medium text-gray-600 leading-relaxed">
                    I am your <strong>Organic Expert</strong>. I specialize in organic business growth, law, attraction marketing, and materials science (specifically <strong>Hempoxies</strong>). I also help with <strong>SEO</strong> and support for the <strong>Search For Organics</strong> platform.
                  </p>
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expertise includes:</p>
                    <ul className="space-y-1.5 text-xs text-gray-600 font-bold">
                      <li className="flex items-center gap-2">
                        <span className="text-organic-green">•</span> Universal Declaration of Organic Rights
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-organic-green">•</span> Organic Certification & SEO Intersection
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-organic-green">•</span> Organic Growth & Attraction Marketing
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-organic-green">•</span> Chemistry & Hempoxies Science
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] px-2">Frequently Asked</p>
                  <div className="grid grid-cols-1 gap-2">
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt.text)}
                        className="text-left bg-white border border-gray-100 hover:border-organic-green hover:bg-green-50/20 p-3.5 rounded-2xl text-[11px] font-black text-gray-600 hover:text-organic-green-dark transition-all duration-200 shadow-sm flex items-center justify-between group active:scale-98"
                      >
                        <span>{prompt.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-organic-green group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Message Feed */}
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[85%] ${
                  message.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                } animate-in fade-in duration-300`}
              >
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 px-2">
                  {message.role === 'user' ? 'You' : 'Organic Bob'}
                </span>
                <div
                  className={`p-4 rounded-[1.8rem] text-xs shadow-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-organic-green-dark text-white rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none border border-organic-green/5'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="font-semibold">{message.text}</p>
                  ) : (
                    <div className="space-y-1">
                      {renderMarkdown(message.text)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* typing indicator */}
            {isTyping && (
              <div className="self-start flex flex-col items-start max-w-[85%] animate-pulse">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 px-2">Organic Bob is typing</span>
                <div className="bg-white border border-organic-green/5 p-4 rounded-[1.8rem] rounded-tl-none flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-organic-green rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-organic-green rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-organic-green rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs font-black text-red-800 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 uppercase tracking-wider">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Notice</span>
                </div>
                <p className="font-bold leading-normal text-red-700">{error}</p>
                {!apiKey && (
                  <button
                    onClick={onOpenApiSettings}
                    className="w-full mt-1 flex items-center justify-center gap-2 bg-red-800 hover:bg-red-900 text-white py-2.5 rounded-xl transition-colors uppercase tracking-widest text-[9px]"
                  >
                    <Key className="w-3.5 h-3.5" />
                    Setup Gemini API Key
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion tags if chat is active but we want shortcuts */}
          {messages.length > 0 && !isTyping && (
            <div className="px-5 py-2 border-t border-gray-50 bg-gray-50/50 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
              <button
                onClick={() => handleSend("What is Rank Organically?")}
                className="inline-flex items-center gap-1 bg-white border border-gray-100 text-[10px] font-black text-gray-500 hover:text-organic-green hover:border-organic-green px-3 py-1.5 rounded-full transition-all shrink-0 shadow-sm"
              >
                <span>🚀 SEO Partner</span>
              </button>
              <button
                onClick={() => handleSend("How does certification validation work?")}
                className="inline-flex items-center gap-1 bg-white border border-gray-100 text-[10px] font-black text-gray-500 hover:text-organic-green hover:border-organic-green px-3 py-1.5 rounded-full transition-all shrink-0 shadow-sm"
              >
                <span>🍃 Certifications</span>
              </button>
              <button
                onClick={() => handleSend("Can you audit my local organic search query?")}
                className="inline-flex items-center gap-1 bg-white border border-gray-100 text-[10px] font-black text-gray-500 hover:text-organic-green hover:border-organic-green px-3 py-1.5 rounded-full transition-all shrink-0 shadow-sm"
              >
                <span>📍 Local Searches</span>
              </button>
            </div>
          )}

          {/* Footer Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-4 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Organic Bob about support or SEO..."
              disabled={isTyping}
              className="flex-grow px-4 py-3 rounded-2xl border border-gray-200 focus:border-organic-green focus:outline-none text-xs font-black bg-white disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 bg-organic-green-dark hover:bg-organic-green text-white rounded-2xl transition-all shadow-md active:scale-95 disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
