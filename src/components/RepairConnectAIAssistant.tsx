import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Maximize2,
  Minimize2,
  ChevronRight,
  Wrench,
  HelpCircle,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  ShieldAlert,
  Clock,
  CheckSquare,
  Square,
  CheckCircle2,
  Search,
  BookOpen,
  ArrowRight,
  Sparkle,
  SlidersHorizontal,
  Tv,
  WashingMachine,
  Bike,
  Armchair,
  Laptop,
  Smartphone,
  Utensils,
  Zap,
  Droplet,
  Info,
} from 'lucide-react';
import { askAdvisorApi } from '../services/api';
import { DiagnosisResultData, ItemCategory, ProactiveMaintenanceTip } from '../types';
import { CATEGORIES } from '../data/mockData';
import {
  PROACTIVE_MAINTENANCE_TIPS,
  getMaintenanceTipsByCategory,
  searchMaintenanceTips,
} from '../data/maintenanceTips';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isActionable?: boolean;
}

interface RepairConnectAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosisContext?: DiagnosisResultData | null;
  onNavigate?: (tab: string) => void;
  onOpenBookingModal?: () => void;
  initialTab?: 'chat' | 'maintenance';
}

export const RepairConnectAIAssistant: React.FC<RepairConnectAIAssistantProps> = ({
  isOpen,
  onClose,
  diagnosisContext,
  onNavigate,
  onOpenBookingModal,
  initialTab = 'chat',
}) => {
  // Navigation inside AI Assistant
  const [activeAssistantTab, setActiveAssistantTab] = useState<'chat' | 'maintenance'>(initialTab);

  // Messages State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: diagnosisContext
        ? `👋 Hello! I am your **RepairConnect AI Assistant**.\n\nI see you're looking at **${diagnosisContext.itemName}** (${diagnosisContext.category.replace('_', ' ')}).\n\nDiagnosed problem: **${diagnosisContext.possibleProblem}** (Confidence: ${diagnosisContext.confidence}%).\n\n💡 *Tip: Check out our new **Proactive Maintenance Tips** section in the top tab to discover category-specific preventive care and avoid future breakdowns!*`
        : `👋 Hello! I am the **RepairConnect AI Assistant**.\n\nI can help you diagnose faulty items, understand repair-worthiness, safe DIY checks, explain technician quotes, find spare parts, or review **Proactive Maintenance Tips** to prevent future breakdowns.\n\nWhat item or issue would you like to discuss today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Proactive Maintenance Tips State
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>(
    diagnosisContext?.category || 'all'
  );
  const [maintenanceSearch, setMaintenanceSearch] = useState('');
  const [completedChecklistItems, setCompletedChecklistItems] = useState<Record<string, boolean>>({});
  const [activeTipDetails, setActiveTipDetails] = useState<string | null>(null);

  // Sync category when diagnosisContext changes
  useEffect(() => {
    if (diagnosisContext) {
      setSelectedCategory(diagnosisContext.category);
      setMessages((prev) => [
        ...prev,
        {
          id: `context-update-${Date.now()}`,
          sender: 'ai',
          text: `ℹ️ **Context Loaded**: Now analyzing **${diagnosisContext.itemName}**\n\n• **Issue:** ${diagnosisContext.possibleProblem}\n• **Verdict:** ${diagnosisContext.repairWorthiness?.verdictTitle || 'REPAIR'}\n• **Action:** ${diagnosisContext.recommendedNextAction?.headline || 'Inspection'}\n\n🛡️ *Check out **Proactive Maintenance Tips** in the top bar to review preventive care routines for ${diagnosisContext.category.replace('_', ' ')}.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [diagnosisContext?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeAssistantTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen, activeAssistantTab]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input.trim();
    if (!textToSend || isLoading) return;

    // Switch to chat tab if user triggered question from maintenance view
    if (activeAssistantTab !== 'chat') {
      setActiveAssistantTab('chat');
    }

    const userMsgId = `user-${Date.now()}`;
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: textToSend, timestamp: userTimestamp },
    ]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        text: m.text,
      }));

      const replyText = await askAdvisorApi(textToSend, diagnosisContext, history);

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: '⚠️ I encountered a temporary connection glitch. **Safety Reminder**: Please disconnect power/gas before touching any appliance internals. For safety-critical issues, consider finding a nearby verified technician.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle checklist checkmark
  const toggleChecklistItem = (tipId: string, itemIdx: number) => {
    const key = `${tipId}-${itemIdx}`;
    setCompletedChecklistItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filtered maintenance tips
  const filteredTips = useMemo(() => {
    let result = searchMaintenanceTips(maintenanceSearch, selectedCategory);
    return result;
  }, [selectedCategory, maintenanceSearch]);

  // Category Icon Resolver
  const getCategoryIcon = (cat: ItemCategory | string) => {
    switch (cat) {
      case 'home_appliances':
        return <WashingMachine className="w-3.5 h-3.5" />;
      case 'kitchen_appliances':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'electronics':
        return <Tv className="w-3.5 h-3.5" />;
      case 'computers_laptops':
        return <Laptop className="w-3.5 h-3.5" />;
      case 'mobile_phones':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'bicycles':
        return <Bike className="w-3.5 h-3.5" />;
      case 'furniture':
        return <Armchair className="w-3.5 h-3.5" />;
      case 'electrician':
        return <Zap className="w-3.5 h-3.5" />;
      case 'plumber':
        return <Droplet className="w-3.5 h-3.5" />;
      default:
        return <Wrench className="w-3.5 h-3.5" />;
    }
  };

  // Badge helpers
  const getFrequencyBadge = (freq: string) => {
    switch (freq) {
      case 'Weekly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Monthly':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Quarterly':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Bi-annually':
      case 'Annual':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High Impact':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (!isOpen) return null;

  const currentCategoryName =
    selectedCategory === 'all'
      ? 'All Categories'
      : CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory.replace('_', ' ');

  const suggestedQuestions = diagnosisContext
    ? [
        `🛡️ Proactive Maintenance Tips for ${diagnosisContext.category.replace('_', ' ')}`,
        'Explain my diagnosis',
        'Should I repair or replace it?',
        'What can I safely check?',
        'Help me book a technician',
      ]
    : [
        '🛡️ Proactive Maintenance Tips',
        'What can I safely check?',
        'How does AI diagnosis work?',
        'Find nearby repair pros',
        'Check repair worthiness',
      ];

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isExpanded
          ? 'inset-4 sm:inset-10 md:inset-16 flex items-center justify-center'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[460px] h-[620px] max-h-[88vh]'
      }`}
    >
      <div className="bg-white rounded-3xl w-full h-full shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  RepairConnect AI Assistant
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Context-Aware Repair, Safety & Prevention Advisor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Minimize' : 'Maximize'}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title="Close Assistant"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Switcher: AI Chat vs Proactive Maintenance Tips */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl w-full">
            <button
              type="button"
              onClick={() => setActiveAssistantTab('chat')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeAssistantTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Chat Assistant</span>
            </button>

            <button
              type="button"
              id="ai-proactive-maintenance-tab-btn"
              onClick={() => setActiveAssistantTab('maintenance')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeAssistantTab === 'maintenance'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Proactive Maintenance Tips</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </button>
          </div>
        </div>

        {/* Active Context Bar if Diagnosis Exists */}
        {diagnosisContext && (
          <div className="px-4 py-2 bg-blue-50/90 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" />
              <span className="font-bold truncate">Item: {diagnosisContext.itemName}</span>
              <span className="text-blue-600/70 hidden sm:inline">• {diagnosisContext.possibleProblem}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-200/60 px-2 py-0.5 rounded-full shrink-0">
              Active Context
            </span>
          </div>
        )}

        {/* TAB 1: AI CHAT ASSISTANT */}
        {activeAssistantTab === 'chat' ? (
          <>
            {/* Safety Disclaimer Banner */}
            <div className="px-4 py-2 bg-amber-50/90 border-b border-amber-200/80 text-[11px] text-amber-950 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">
                  <strong>AI Guidance:</strong> Educational assistance only. Always isolate power/gas.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveAssistantTab('maintenance')}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline whitespace-nowrap cursor-pointer shrink-0"
              >
                View Maintenance Tips →
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-[88%] ${
                    m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-900 text-emerald-400 shadow-xs'
                    }`}
                  >
                    {m.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        m.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-xs font-medium'
                          : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-tl-xs font-normal'
                      }`}
                    >
                      {m.text}
                    </div>
                    <div
                      className={`text-[10px] text-slate-400 font-medium ${
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
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs text-slate-600 flex items-center gap-2 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>Consulting Gemini AI diagnostic guidelines & preventive schematics...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Chips */}
            <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (q.includes('Proactive Maintenance Tips')) {
                      setActiveAssistantTab('maintenance');
                    } else {
                      handleSendMessage(q);
                    }
                  }}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 whitespace-nowrap transition-colors border border-slate-200 hover:border-blue-300 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Fast Action Shortcuts */}
            <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-500 shrink-0">
              <div className="flex items-center gap-2">
                {onNavigate && (
                  <button
                    onClick={() => {
                      onNavigate('find_repairs');
                      onClose();
                    }}
                    className="text-blue-600 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Find Nearby Technicians</span>
                  </button>
                )}
              </div>
              {onOpenBookingModal && (
                <button
                  onClick={() => {
                    onOpenBookingModal();
                    onClose();
                  }}
                  className="text-emerald-700 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Book Repair</span>
                </button>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about diagnosis, maintenance schedules, safe checks..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 ${
                  input.trim() && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-sm shadow-blue-600/30'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </form>
          </>
        ) : (
          /* TAB 2: PROACTIVE MAINTENANCE TIPS VIEW */
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
            {/* Header Description & Search Bar */}
            <div className="p-4 bg-white border-b border-slate-200 shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Proactive Maintenance & Preventive Care</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Category-specific routines to prevent unexpected breakdowns and extend product lifespan.
                  </p>
                </div>

                <div className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] font-black text-emerald-800 shrink-0">
                  +3 to 8 Yrs Lifespan
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={maintenanceSearch}
                  onChange={(e) => setMaintenanceSearch(e.target.value)}
                  placeholder="Search maintenance routines (e.g. coil, filter, descaling, chain, thermal)..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-medium"
                />
                {maintenanceSearch && (
                  <button
                    type="button"
                    onClick={() => setMaintenanceSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Selector Horizontal Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Categories
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {getCategoryIcon(cat.id)}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Maintenance Tips Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredTips.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">No maintenance tips found matching your search</p>
                  <button
                    type="button"
                    onClick={() => {
                      setMaintenanceSearch('');
                      setSelectedCategory('all');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredTips.map((tip) => {
                  const isExpanded = activeTipDetails === tip.id;

                  return (
                    <div
                      key={tip.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all space-y-3"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getFrequencyBadge(tip.frequency)}`}>
                            {tip.frequency} Routine
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getImpactBadge(tip.impact)}`}>
                            {tip.impact}
                          </span>
                        </div>

                        <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {tip.lifeExtensionEstimate}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                        {tip.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {tip.description}
                      </p>

                      {/* Action Checklist */}
                      <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Preventive Action Checklist:
                        </span>
                        <div className="space-y-2 pt-1">
                          {tip.actionChecklist.map((action, idx) => {
                            const isDone = !!completedChecklistItems[`${tip.id}-${idx}`];
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => toggleChecklistItem(tip.id, idx)}
                                className={`w-full text-left p-2 rounded-lg text-xs flex items-start gap-2 transition-all cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-100/70 text-emerald-950 font-medium'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                                }`}
                              >
                                {isDone ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                )}
                                <span className={`leading-snug ${isDone ? 'line-through text-slate-500' : ''}`}>
                                  {action}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Failures Prevented & Tools Pill Tags */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Common Breakdowns Prevented:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {tip.commonFailuresPrevented.map((failure, fIdx) => (
                            <span
                              key={fIdx}
                              className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[10px] font-semibold text-rose-800"
                            >
                              🛡️ {failure}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tools Required */}
                      {tip.toolsNeeded && tip.toolsNeeded.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                          <Wrench className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-bold">Tools:</span>
                          <span>{tip.toolsNeeded.join(', ')}</span>
                        </div>
                      )}

                      {/* Safety Warning */}
                      {tip.proWarning && (
                        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-900 flex items-start gap-1.5 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{tip.proWarning}</span>
                        </div>
                      )}

                      {/* Action: Ask AI to expand on this maintenance task */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const prompt = `Can you guide me step-by-step through the proactive maintenance routine: "${tip.title}" for my ${tip.category.replace('_', ' ')}? What precautions should I take?`;
                            handleSendMessage(prompt);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>Ask AI for Step-by-Step Instructions</span>
                        </button>

                        <span className="text-[10px] text-slate-400 font-mono capitalize">
                          {tip.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Bar in Maintenance View */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
              <button
                type="button"
                onClick={() => setActiveAssistantTab('chat')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Return to AI Chat</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const prompt = `What is the complete proactive maintenance checklist and preventive care schedule for ${currentCategoryName}?`;
                  handleSendMessage(prompt);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Ask AI full {currentCategoryName} schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
