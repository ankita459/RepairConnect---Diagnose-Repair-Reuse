import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Wrench,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  Square,
  Layers,
  Award,
  Video,
  FileText,
  Share2,
  Tv,
  WashingMachine,
  Bike,
  Armchair,
  Laptop,
  Smartphone,
  Utensils,
  Zap,
  Droplet,
  X,
  Star,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { DiyRepairGuide, ItemCategory } from '../types';
import { CATEGORIES } from '../data/mockData';
import {
  fetchDiyRepairGuides,
  fetchRelatedDiyGuides,
  submitDiyGuideFeedback,
} from '../services/diyRepairApi';

interface DiyRepairLibraryProps {
  initialCategory?: ItemCategory;
  onNavigateToParts?: (category?: ItemCategory) => void;
  onNavigateToPros?: (category?: ItemCategory) => void;
  onStartDiagnosis?: () => void;
}

export const DiyRepairLibrary: React.FC<DiyRepairLibraryProps> = ({
  initialCategory,
  onNavigateToParts,
  onNavigateToPros,
  onStartDiagnosis,
}) => {
  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>(
    initialCategory || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'savings' | 'time' | 'rating'>('popular');

  // API State
  const [guides, setGuides] = useState<DiyRepairGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiLatencyMs, setApiLatencyMs] = useState<number>(320);

  // Selected Detail Guide View
  const [selectedGuide, setSelectedGuide] = useState<DiyRepairGuide | null>(null);
  const [relatedGuides, setRelatedGuides] = useState<DiyRepairGuide[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [checkedSafety, setCheckedSafety] = useState<Record<number, boolean>>({});
  const [activeVideoChapter, setActiveVideoChapter] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Feedback State
  const [userRating, setUserRating] = useState<number>(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch guides from simulated API
  const loadGuides = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    const startTime = performance.now();
    try {
      const data = await fetchDiyRepairGuides(
        selectedCategory,
        searchQuery,
        difficultyFilter
      );
      const elapsed = Math.round(performance.now() - startTime);
      setApiLatencyMs(elapsed);
      setGuides(data);
    } catch (err) {
      console.error('Failed to fetch DIY guides:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadGuides();
  }, [selectedCategory, difficultyFilter, searchQuery]);

  // Load related guides when a guide is selected
  useEffect(() => {
    if (selectedGuide) {
      setCompletedSteps({});
      setCheckedSafety({});
      setActiveVideoChapter(null);
      setIsVideoPlaying(false);
      setFeedbackSubmitted(false);

      fetchRelatedDiyGuides(selectedGuide.category, selectedGuide.id).then((related) => {
        setRelatedGuides(related);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedGuide]);

  // Show temporary toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sort guides
  const sortedGuides = useMemo(() => {
    return [...guides].sort((a, b) => {
      if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
      if (sortBy === 'savings') return b.estimatedSavingsInr - a.estimatedSavingsInr;
      if (sortBy === 'time') return a.estimatedTimeMinutes - b.estimatedTimeMinutes;
      if (sortBy === 'rating') return b.communityRating - a.communityRating;
      return 0;
    });
  }, [guides, sortBy]);

  // Category Icon Resolver
  const getCategoryIcon = (cat: ItemCategory | string) => {
    switch (cat) {
      case 'home_appliances':
        return <WashingMachine className="w-4 h-4" />;
      case 'kitchen_appliances':
        return <Utensils className="w-4 h-4" />;
      case 'electronics':
        return <Tv className="w-4 h-4" />;
      case 'computers_laptops':
        return <Laptop className="w-4 h-4" />;
      case 'mobile_phones':
        return <Smartphone className="w-4 h-4" />;
      case 'bicycles':
        return <Bike className="w-4 h-4" />;
      case 'furniture':
        return <Armchair className="w-4 h-4" />;
      case 'electrician':
        return <Zap className="w-4 h-4" />;
      case 'plumber':
        return <Droplet className="w-4 h-4" />;
      default:
        return <Wrench className="w-4 h-4" />;
    }
  };

  // Difficulty badge colors
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Advanced':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Step Completion Progress
  const completedStepsCount = selectedGuide
    ? Object.values(completedSteps).filter(Boolean).length
    : 0;
  const progressPercent = selectedGuide
    ? Math.round((completedStepsCount / selectedGuide.steps.length) * 100)
    : 0;

  // Handle Feedback Submission
  const handleFeedbackSubmit = async (helpful: boolean) => {
    if (!selectedGuide) return;
    setIsSubmittingFeedback(true);
    try {
      await submitDiyGuideFeedback(selectedGuide.id, helpful, userRating);
      setFeedbackSubmitted(true);
      showToast('🎉 Repair feedback recorded! Thanks for supporting circular reuse.');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero / Header Section */}
      <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-sm relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Simulated Self-Repair Knowledge Base</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                DIY Repair Library & Video Tutorials
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Step-by-step masterclasses, safety pre-flight checklists, and HD video guides to empower self-repair, extend product lifespans, and eliminate e-waste.
              </p>
            </div>

            {/* Simulated API Status Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 min-w-[260px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Simulated API Active
                </span>
                <button
                  type="button"
                  onClick={() => loadGuides(true)}
                  disabled={isRefreshing}
                  className="text-xs text-blue-300 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                  title="Simulate API re-fetch"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Fetching...' : 'Re-fetch'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/30 rounded-xl p-2.5">
                  <span className="text-[10px] text-slate-400 block font-medium">Response Latency</span>
                  <span className="font-mono font-bold text-emerald-400">{apiLatencyMs} ms</span>
                </div>
                <div className="bg-black/30 rounded-xl p-2.5">
                  <span className="text-[10px] text-slate-400 block font-medium">Curated Guides</span>
                  <span className="font-bold text-white">{guides.length} Available</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1 border-t border-white/10">
                <span>Avg. Success Rate:</span>
                <span className="font-extrabold text-emerald-300">95.2%</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-200 text-slate-900 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="diy-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repair guides (e.g. washing machine drain pump, laptop fan, thermal paste, faucet leak)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm font-medium transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    difficultyFilter === diff
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {diff === 'all' ? 'All Levels' : diff}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                id="diy-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer"
              >
                <option value="popular">Most Popular & Viewed</option>
                <option value="savings">Highest Money Savings (₹)</option>
                <option value="time">Quickest Fix (Minutes)</option>
                <option value="rating">Top Community Rated</option>
              </select>
            </div>
          </div>

          {/* Category Horizontal Scroll Pills */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* If a guide is selected for detailed full view */}
        {selectedGuide ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Back Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <button
                type="button"
                id="back-to-guides-btn"
                onClick={() => setSelectedGuide(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back to All DIY Guides</span>
              </button>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getDifficultyBadge(selectedGuide.difficulty)}`}>
                  {selectedGuide.difficulty}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedGuide.estimatedTimeMinutes} min fix</span>
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Save ₹{selectedGuide.estimatedSavingsInr.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Guide Header Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-blue-600 capitalize">
                  {selectedGuide.category.replace('_', ' ')}
                </span>
                <span>•</span>
                <span>{selectedGuide.videoTutorial.viewsCount}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {selectedGuide.communityRating} ({selectedGuide.reviewsCount} reviews)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedGuide.title}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {selectedGuide.summary}
              </p>

              {/* Quick Spec Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Difficulty
                  </span>
                  <span className="text-sm font-black text-slate-800 mt-0.5 block">
                    {selectedGuide.difficulty}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Estimated Duration
                  </span>
                  <span className="text-sm font-black text-slate-800 mt-0.5 block">
                    {selectedGuide.estimatedTimeMinutes} Minutes
                  </span>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                    Estimated Savings
                  </span>
                  <span className="text-sm font-black text-emerald-900 mt-0.5 block">
                    ₹{selectedGuide.estimatedSavingsInr.toLocaleString()}
                  </span>
                </div>

                <div className="bg-blue-50 rounded-2xl p-3.5 border border-blue-200">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                    Success Rate
                  </span>
                  <span className="text-sm font-black text-blue-900 mt-0.5 block">
                    {selectedGuide.successRate}% Success
                  </span>
                </div>
              </div>
            </div>

            {/* Video Tutorial Section */}
            <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl text-white">
              <div className="p-4 sm:p-6 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      {selectedGuide.videoTutorial.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Channel: {selectedGuide.videoTutorial.channelName} • Duration: {selectedGuide.videoTutorial.duration}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-[11px] font-bold">
                  HD Video
                </span>
              </div>

              {/* Video Player Display */}
              <div className="relative aspect-video max-h-[480px] w-full bg-black flex items-center justify-center group overflow-hidden">
                <img
                  src={selectedGuide.videoTutorial.thumbnailUrl}
                  alt={selectedGuide.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Play Button Overlay */}
                <button
                  type="button"
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
                  title="Play video tutorial"
                >
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white z-10">
                  <div className="bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center gap-2 font-mono">
                    <Clock className="w-3.5 h-3.5 text-red-400" />
                    <span>{selectedGuide.videoTutorial.duration} full masterclass</span>
                  </div>

                  <span className="bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md font-bold">
                    {selectedGuide.videoTutorial.viewsCount}
                  </span>
                </div>
              </div>

              {/* Video Chapters Breakdown */}
              {selectedGuide.videoTutorial.chapters && (
                <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Video Chapters & Timestamps:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    {selectedGuide.videoTutorial.chapters.map((chapter, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActiveVideoChapter(idx);
                          showToast(`Jumped to chapter: ${chapter.title} (${chapter.time})`);
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          activeVideoChapter === idx
                            ? 'bg-blue-600/30 border-blue-400 text-white font-bold'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="font-mono text-[11px] text-blue-400 block font-bold">
                          {chapter.time}
                        </span>
                        <span className="truncate block mt-0.5">{chapter.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pre-Flight Safety Checklist */}
            <div className="bg-amber-50/80 rounded-3xl p-6 border-2 border-amber-300 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-amber-950 font-extrabold text-base">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Pre-Flight Safety Checklist (Read & Tick Before Starting)</span>
              </div>
              <p className="text-xs text-amber-900">
                Self-repair requires responsible safety precautions. Complete these essential isolation steps before opening any chassis or mechanism:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {selectedGuide.safetyChecklist.map((item, idx) => {
                  const isChecked = !!checkedSafety[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setCheckedSafety((prev) => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      className={`p-3.5 rounded-2xl border text-left text-xs flex items-start gap-2.5 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-white border-amber-200 text-amber-950 hover:border-amber-400'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <span className="leading-snug">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Required Tools & Parts Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tools Required */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Required Tools</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedGuide.toolsRequired.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Materials / Spare Parts */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Materials & Replacement Parts</span>
                  </div>
                  {onNavigateToParts && (
                    <button
                      type="button"
                      onClick={() => onNavigateToParts(selectedGuide.category)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Find Parts</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedGuide.materialsOrParts.map((mat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Step-by-Step Guide Stepper */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Step-by-Step Repair Instructions</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Follow each instruction carefully and check off steps as you proceed
                  </p>
                </div>

                {/* Progress Bar Badge */}
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Progress
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      {completedStepsCount} of {selectedGuide.steps.length} Steps ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-20 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-6">
                {selectedGuide.steps.map((step) => {
                  const isDone = !!completedSteps[step.stepNumber];

                  return (
                    <div
                      key={step.stepNumber}
                      className={`rounded-2xl border-2 transition-all p-5 sm:p-6 space-y-3 ${
                        isDone
                          ? 'border-emerald-400 bg-emerald-50/40 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                      }`}
                    >
                      {/* Step Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-900 text-white'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900">
                              Step {step.stepNumber}: {step.title}
                            </h3>
                            {step.durationMinutes && (
                              <span className="text-xs font-semibold text-slate-400">
                                Approx. {step.durationMinutes} min
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Step Checkbox Button */}
                        <button
                          type="button"
                          onClick={() =>
                            setCompletedSteps((prev) => ({
                              ...prev,
                              [step.stepNumber]: !prev[step.stepNumber],
                            }))
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isDone ? 'Completed' : 'Mark Step Done'}</span>
                        </button>
                      </div>

                      {/* Step Instruction */}
                      <p className="text-slate-700 text-sm leading-relaxed pl-11">
                        {step.instruction}
                      </p>

                      {/* Step Warning Callout */}
                      {step.warning && (
                        <div className="ml-11 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Caution: </span>
                            <span>{step.warning}</span>
                          </div>
                        </div>
                      )}

                      {/* Step Pro Tip Callout */}
                      {step.proTip && (
                        <div className="ml-11 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
                          <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Pro Tip: </span>
                            <span>{step.proTip}</span>
                          </div>
                        </div>
                      )}

                      {/* Tools Used for this Step */}
                      {step.toolsUsed && step.toolsUsed.length > 0 && (
                        <div className="ml-11 flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">
                            Tools in this step:
                          </span>
                          {step.toolsUsed.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-medium text-slate-600"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Troubleshooting Tips Box */}
            {selectedGuide.troubleshootingTips && selectedGuide.troubleshootingTips.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span>Expert Troubleshooting & Nuance Notes</span>
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                  {selectedGuide.troubleshootingTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Community Success Rating & Feedback Card */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>Did this tutorial help you successfully repair your item?</span>
                  </h3>
                  <p className="text-xs text-blue-200 mt-1">
                    Help other repair enthusiasts by confirming this guide's accuracy.
                  </p>
                </div>

                {feedbackSubmitted ? (
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Feedback Recorded!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleFeedbackSubmit(true)}
                      disabled={isSubmittingFeedback}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Yes, I Fixed It!</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFeedbackSubmit(false)}
                      disabled={isSubmittingFeedback}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <span>Needed Professional Help</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Alternative Escalation: Need a Professional? */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                  <Wrench className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Feel unsure or prefer a certified technician?
                  </h4>
                  <p className="text-xs text-slate-500">
                    Connect with vetted local repair shops offering genuine parts and 90-day warranties.
                  </p>
                </div>
              </div>

              {onNavigateToPros && (
                <button
                  type="button"
                  onClick={() => onNavigateToPros(selectedGuide.category)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all shadow-xs cursor-pointer"
                >
                  <span>Find Verified Pros Near You</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Related DIY Guides Carousel */}
            {relatedGuides.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-base font-extrabold text-slate-900">
                  Related Guides in {selectedGuide.category.replace('_', ' ')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedGuides.map((rel) => (
                    <button
                      key={rel.id}
                      type="button"
                      onClick={() => setSelectedGuide(rel)}
                      className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-500 hover:shadow-md text-left transition-all cursor-pointer group space-y-2"
                    >
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyBadge(rel.difficulty)}`}>
                        {rel.difficulty}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2">
                        {rel.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {rel.summary}
                      </p>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-1">
                        <span>{rel.estimatedTimeMinutes} mins</span>
                        <span className="text-emerald-700 font-bold">Save ₹{rel.estimatedSavingsInr}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Guides Grid View */
          <div className="space-y-6">
            {/* Header info bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
              <span>
                Showing {sortedGuides.length} Guide{sortedGuides.length === 1 ? '' : 's'}
                {selectedCategory !== 'all' ? ` in ${selectedCategory.replace('_', ' ')}` : ''}
              </span>
              <span className="text-emerald-700">100% Free Open-Source Guides</span>
            </div>

            {/* Skeletons when loading */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 animate-pulse"
                  >
                    <div className="aspect-video bg-slate-200 rounded-2xl" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-5/6" />
                    <div className="h-8 bg-slate-200 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : sortedGuides.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  No repair guides found
                </h3>
                <p className="text-xs text-slate-500">
                  We couldn't find any DIY tutorials matching "{searchQuery}". Try selecting "All Categories" or searching with broader terms.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setDifficultyFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    Clear Filters
                  </button>
                  {onStartDiagnosis && (
                    <button
                      type="button"
                      onClick={onStartDiagnosis}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                    >
                      Run AI Diagnosis
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Main Guides Card Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Thumbnail with Video Overlay */}
                    <div className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setSelectedGuide(guide)}>
                      <img
                        src={guide.videoTutorial.thumbnailUrl}
                        alt={guide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Video Duration Badge */}
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-white flex items-center gap-1.5">
                        <Play className="w-3 h-3 fill-red-500 text-red-500" />
                        <span>{guide.videoTutorial.duration}</span>
                      </div>

                      {/* Difficulty Badge Top Right */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${getDifficultyBadge(guide.difficulty)}`}>
                          {guide.difficulty}
                        </span>
                      </div>

                      {/* Play Button Indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-blue-600 capitalize flex items-center gap-1">
                            {getCategoryIcon(guide.category)}
                            <span>{guide.category.replace('_', ' ')}</span>
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{guide.communityRating}</span>
                          </span>
                        </div>

                        <h3
                          onClick={() => setSelectedGuide(guide)}
                          className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
                        >
                          {guide.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {guide.summary}
                        </p>
                      </div>

                      {/* Metrics Pill Grid */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Duration
                          </span>
                          <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{guide.estimatedTimeMinutes} min</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                            Money Saved
                          </span>
                          <span className="font-extrabold text-emerald-800 mt-0.5 block">
                            ₹{guide.estimatedSavingsInr.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Tools Tag Chips */}
                      <div className="flex flex-wrap gap-1">
                        {guide.toolsRequired.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600 truncate max-w-[120px]"
                          >
                            {t}
                          </span>
                        ))}
                        {guide.toolsRequired.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                            +{guide.toolsRequired.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Primary CTA Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedGuide(guide)}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>View Step-by-Step Guide</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
