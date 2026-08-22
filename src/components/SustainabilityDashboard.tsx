import React from 'react';
import {
  Leaf,
  Recycle,
  Coins,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap,
  Globe,
  Trees,
  BatteryCharging,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { SustainabilityStats } from '../types';

interface SustainabilityDashboardProps {
  stats: SustainabilityStats;
  onDiagnoseNewItem: () => void;
}

export const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({
  stats,
  onDiagnoseNewItem,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5" />
            <span>Community Circular Impact</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Repairing Products Protects Our Planet
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            Manufacturing new electronics and heavy appliances requires extensive mineral mining and energy-heavy
            refining. Every product you keep in service directly averts virgin resource consumption.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onDiagnoseNewItem}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Diagnose Another Item</span>
            </button>
          </div>
        </div>

        {/* Decorative background icons */}
        <Trees className="absolute right-4 bottom-4 w-64 h-64 text-white/5 pointer-events-none -rotate-12" />
      </div>

      {/* 4 Core Hero Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Repaired Items */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Items Repaired
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Recycle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 font-mono">
              {stats.totalItemsRepaired.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>
        </div>

        {/* E-Waste Prevented */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              E-Waste Prevented
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-700 font-mono">
              {(stats.totalEwastePreventedKg / 1000).toFixed(1)} Metric Tons
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {stats.totalEwastePreventedKg.toLocaleString()} kg landfill avoided
            </div>
          </div>
        </div>

        {/* CO2 Emissions Avoided */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              CO2e Avoided
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-teal-700 font-mono">
              {stats.totalCo2AvoidedKg.toLocaleString()} kg
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Equivalent to planting ~5,200 tree saplings
            </div>
          </div>
        </div>

        {/* Money Saved */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Money Saved by Users
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 font-mono">
              ₹{(stats.totalMoneySavedInr / 100000).toFixed(1)} Lakhs
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">
              ₹{stats.totalMoneySavedInr.toLocaleString()} total consumer savings
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Badges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category Impact Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Repair Volume & Waste Diversion by Category
              </h2>
              <p className="text-xs text-slate-500">
                Distribution of repairs and carbon savings across major device classes
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {stats.categoryBreakdown.map((cat, idx) => {
              const percentage = Math.round((cat.repairedCount / stats.totalItemsRepaired) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{cat.categoryName}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-500">
                        {cat.repairedCount} units ({percentage}%)
                      </span>
                      <span className="font-mono font-bold text-emerald-700">
                        {cat.wasteSavedKg} kg diverted
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-700"
                      style={{ width: `${Math.min(100, percentage * 3.5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Community Badges & Circular Economy Principles */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Community Sustainability Badges</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  title: 'E-Waste Warrior',
                  desc: 'Prevented over 50kg of electronic disposal.',
                  color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
                },
                {
                  title: 'Circular Pioneer',
                  desc: 'Repaired 5+ domestic appliances.',
                  color: 'bg-blue-50 text-blue-800 border-blue-200',
                  icon: <Recycle className="w-4 h-4 text-blue-600" />,
                },
                {
                  title: 'Master Restorer',
                  desc: 'Used OEM parts to double product lifespan.',
                  color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
                  icon: <Zap className="w-4 h-4 text-indigo-600" />,
                },
                {
                  title: 'Zero-Waste Hero',
                  desc: 'Advocated right-to-repair in local community.',
                  color: 'bg-amber-50 text-amber-800 border-amber-200',
                  icon: <Globe className="w-4 h-4 text-amber-600" />,
                },
              ].map((b, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border ${b.color} space-y-1.5 flex flex-col justify-between`}
                >
                  <div className="flex items-center gap-1.5">
                    {b.icon}
                    <h3 className="font-bold text-xs">{b.title}</h3>
                  </div>
                  <p className="text-[11px] leading-snug opacity-80">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right to Repair Manifesto Callout */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Circular Economy Philosophy
            </div>
            <h3 className="font-bold text-base">The Right to Repair</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every consumer deserves access to diagnostic schematics, affordable replacement parts, and open repair
              options without anti-consumer software locks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
