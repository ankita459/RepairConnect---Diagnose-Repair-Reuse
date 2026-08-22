import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareQuote,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CornerDownLeft,
} from 'lucide-react';
import { askAdvisorApi } from '../services/api';

interface AIChatAdvisorModalProps {
  onClose: () => void;
  initialContext?: string;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIChatAdvisorModal: React.FC<AIChatAdvisorModalProps> = ({
  onClose,
  initialContext,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text:
        "Hello! I'm your RepairConnect AI Advisor. You can ask me any questions about symptom testing, safe DIY steps, tool recommendations, or whether a problem is safe to inspect at home.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, timestamp: userTimestamp },
    ]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askAdvisorApi(
        userText,
        null,
        messages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', text: m.text }))
      );
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text:
            'I encountered a brief connection issue. Always remember: before servicing any electrical device, ensure it is fully unplugged and capacitors are discharged.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[600px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base">AI Repair Advisor</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-300">Live Gemini Safety & Troubleshooting Assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Banner */}
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Safety Note:</strong> AI guidance is for low-risk testing only. Never open high-voltage or gas lines.
          </span>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-950 text-white shadow-xs'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-yellow-300" />}
              </div>

              <div className="space-y-1">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div
                  className={`text-[10px] text-slate-400 ${
                    m.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-indigo-950 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Analyzing repair guidelines & safety schematics...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Suggestions */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {[
            'Is it safe to test my washing machine pump?',
            'What tools do I need for bicycle chain repair?',
            'How to discharge smartphone battery safely?',
          ].map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickQuestion(q)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about diagnosing, repairing, or safety..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 ${
              input.trim() && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-xs'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
