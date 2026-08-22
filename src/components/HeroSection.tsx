import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  UploadCloud,
  Camera,
  CheckCircle2,
  Tv,
  WashingMachine,
  Bike,
  Armchair,
  Laptop,
  Smartphone,
  Utensils,
  Wrench,
  ShieldAlert,
  Leaf,
  Coins,
  Recycle,
  PlayCircle,
} from 'lucide-react';
import { CATEGORIES, DEMO_PRESETS } from '../data/mockData';
import { DiagnosisResultData, ItemCategory } from '../types';

interface HeroSectionProps {
  onStartDiagnosis: () => void;
  onSelectPreset: (preset: DiagnosisResultData) => void;
  onExplorePros: () => void;
  onSelectCategory: (cat: ItemCategory) => void;
  onDirectUpload: (file: File) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Tv: <Tv className="w-5 h-5" />,
  WashingMachine: <WashingMachine className="w-5 h-5" />,
  Bike: <Bike className="w-5 h-5" />,
  Armchair: <Armchair className="w-5 h-5" />,
  Laptop: <Laptop className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartDiagnosis,
  onSelectPreset,
  onExplorePros,
  onSelectCategory,
  onDirectUpload,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDirectUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onDirectUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Hero Column: Bold Typography & Impact Statement */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-4 border border-emerald-200">
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  <span>Right to Repair • Circular Economy</span>
                </div>

                {/* Main Bold Display Heading */}
                <h1 className="text-5xl sm:text-7xl lg:text-[84px] leading-[0.9] font-black uppercase tracking-tighter text-slate-900 mb-6">
                  DON'T<br />
                  REPLACE IT.<br />
                  <span className="text-emerald-600">REPAIR IT.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-slate-600 max-w-xl font-medium leading-relaxed mb-8">
                  Upload a photo, diagnose the issue with AI computer vision, and find practical options to give your products a second life.
                </p>

                {/* 4 Quick Category Action Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mb-8">
                  <div
                    onClick={() => onSelectCategory('electronics')}
                    className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-sm cursor-pointer flex flex-col gap-2 transition-all group"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-sm group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      📱
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-emerald-700">
                      Electronics
                    </span>
                  </div>

                  <div
                    onClick={() => onSelectCategory('home_appliances')}
                    className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-sm cursor-pointer flex flex-col gap-2 transition-all group"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-sm group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      🧺
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-emerald-700">
                      Appliances
                    </span>
                  </div>

                  <div
                    onClick={() => onSelectCategory('bicycles')}
                    className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-sm cursor-pointer flex flex-col gap-2 transition-all group"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-sm group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      🚲
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-emerald-700">
                      Bicycles
                    </span>
                  </div>

                  <div
                    onClick={() => onSelectCategory('furniture')}
                    className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-sm cursor-pointer flex flex-col gap-2 transition-all group"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-sm group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      🛋️
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-emerald-700">
                      Furniture
                    </span>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    id="hero-primary-diagnose-btn"
                    onClick={onStartDiagnosis}
                    className="px-8 py-4 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 text-base cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span>Diagnose My Item</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    id="hero-secondary-pros-btn"
                    onClick={onExplorePros}
                    className="px-6 py-4 rounded-2xl font-bold text-slate-800 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 transition-all shadow-xs flex items-center gap-2 text-base cursor-pointer"
                  >
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <span>Find Pros</span>
                  </button>
                </div>
              </div>

              {/* Sustainability Impact Card (Emerald Theme) */}
              <div className="bg-emerald-50 p-6 sm:p-7 rounded-[28px] border border-emerald-200/80 max-w-xl">
                <div className="flex items-center gap-5">
                  <div className="text-4xl font-black text-emerald-700 font-mono">85%</div>
                  <div className="text-xs font-black uppercase tracking-widest text-emerald-900 leading-snug">
                    Sustainability Impact<br />
                    Score for Repairs
                  </div>
                </div>
                <div className="mt-3 text-xs font-medium text-emerald-950/80 leading-relaxed">
                  Extending product life by just 1.5 years reduces associated greenhouse gas emissions and e-waste disposal by over 60%.
                </div>
              </div>
            </div>

            {/* Right Hero Column: AI Diagnosis Hub Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    AI Diagnosis Hub
                  </h2>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-full">
                    Active AI v2.4
                  </span>
                </div>

                {/* Drop Photo or Video Zone */}
                <div
                  id="hero-dropzone-container"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative group rounded-2xl border-2 border-dashed p-6 transition-all text-center cursor-pointer ${
                    dragOver
                      ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01]'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-400'
                  }`}
                >
                  <input
                    type="file"
                    id="hero-file-input"
                    accept="image/*,video/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <label htmlFor="hero-file-input" className="cursor-pointer block space-y-3">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 font-bold text-xl mx-auto group-hover:text-emerald-600 transition-colors">
                      +
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Drop Photo or Video</div>
                      <p className="text-xs text-slate-400 mt-0.5">Instant AI Root Cause & Fix Analysis</p>
                    </div>
                  </label>
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Or Try 1-Click Interactive Reports:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_PRESETS.slice(0, 4).map((preset) => (
                      <button
                        key={preset.id}
                        id={`preset-btn-${preset.id}`}
                        onClick={() => onSelectPreset(preset)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{preset.itemName.split('(')[0].trim()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Open Full Studio Button */}
                <button
                  onClick={onStartDiagnosis}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-base hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Open Full Diagnosis Studio</span>
                </button>

                {/* Active Tracking Mini Bar */}
                <div className="bg-slate-900 rounded-2xl p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      ✓
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Active Ecosystem
                      </div>
                      <div className="text-xs font-bold text-white">14.8k+ Items Reused</div>
                    </div>
                  </div>
                  <button
                    onClick={onExplorePros}
                    className="text-[11px] px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-emerald-400 border border-slate-700"
                  >
                    View Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Product Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-xs uppercase tracking-wider mb-1">
              <Wrench className="w-3.5 h-3.5" /> Comprehensive Coverage
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Supported Product Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              AI diagnostic models and local certified master technicians for every product in your home.
            </p>
          </div>
          <button
            onClick={onStartDiagnosis}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Start Free Diagnosis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4">
                  {CATEGORY_ICONS[cat.icon] || <Wrench className="w-5 h-5" />}
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{cat.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Avg. {cat.averageRepairSavings}% Saved
                </span>
                <span className="text-slate-500 font-medium">+{cat.typicalLifeExtensionYears}y Lifespan</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Journey Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                End-to-End Circular Flow
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                The RepairConnect Journey
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                From failure symptom to renewed reliability in 6 guided steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                {
                  step: '01',
                  title: 'Upload & Describe',
                  desc: 'Photo or video with symptoms in your words.',
                },
                {
                  step: '02',
                  title: 'AI Diagnosis',
                  desc: 'Root cause breakdown & confidence scoring.',
                },
                {
                  step: '03',
                  title: 'Worthiness ROI',
                  desc: 'Repair vs replacement cost & savings math.',
                },
                {
                  step: '04',
                  title: 'Local Experts',
                  desc: 'Nearby verified pros with upfront quotes.',
                },
                {
                  step: '05',
                  title: 'Spare Parts',
                  desc: 'Compatible OEM/aftermarket hardware.',
                },
                {
                  step: '06',
                  title: 'Track & Reuse',
                  desc: 'Live repair timeline + warranty guarantee.',
                },
              ].map((item, idx) => (
                <div
                  key={item.step}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-black text-blue-400 font-mono">{item.step}</span>
                    <h3 className="font-bold text-sm text-white mt-1">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-blue-400 font-semibold">
                    <span>Next step →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
