import React from 'react';
import {
  Sparkles,
  Wrench,
  CheckCircle2,
  Package,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { DiagnosisResultData } from '../types';

interface ActionOptionsProps {
  diagnosis: DiagnosisResultData;
  onSelectTroubleshooting: () => void;
  onSelectProfessionals: () => void;
  onSelectSpareParts: () => void;
}

export const ActionOptions: React.FC<ActionOptionsProps> = ({
  diagnosis,
  onSelectTroubleshooting,
  onSelectProfessionals,
  onSelectSpareParts,
}) => {
  const { recommendedNextAction } = diagnosis;

  const isProRecommended =
    recommendedNextAction.action === 'Professional inspection' ||
    recommendedNextAction.action === 'Repair';

  const isTroubleshootRecommended =
    recommendedNextAction.action === 'Basic troubleshooting';

  const isPartsRecommended =
    recommendedNextAction.action === 'Find spare part';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Highlighted AI Recommendation Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-yellow-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Recommendation Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {recommendedNextAction.headline}
            </h2>
            <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
              {recommendedNextAction.reasonWhy}
            </p>
          </div>

          <div className="shrink-0">
            {isProRecommended && (
              <button
                onClick={onSelectProfessionals}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-blue-700 bg-white hover:bg-blue-50 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>View Recommended Pros</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {isTroubleshootRecommended && (
              <button
                onClick={onSelectTroubleshooting}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-emerald-800 bg-white hover:bg-emerald-50 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Follow Step-by-Step Fix</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {isPartsRecommended && (
              <button
                onClick={onSelectSpareParts}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-indigo-800 bg-white hover:bg-indigo-50 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Package className="w-4 h-4 text-indigo-600" />
                <span>Order Matching Parts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3 Interactive Pathway Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Option 1: Basic Troubleshooting */}
        <div
          id="action-card-troubleshooting"
          onClick={onSelectTroubleshooting}
          className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between relative group ${
            isTroubleshootRecommended
              ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
          }`}
        >
          {isTroubleshootRecommended && (
            <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
              Recommended
            </span>
          )}

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Option 1
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Try Basic Troubleshooting
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                For simple, safe issues that can be tested or fixed without hazardous disassembly or specialized tools.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Zero service call cost</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>10-20 min quick check</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
            <span>View Safety Checklist</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Option 2: Find a Repair Professional */}
        <div
          id="action-card-professionals"
          onClick={onSelectProfessionals}
          className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between relative group ${
            isProRecommended
              ? 'bg-blue-50/70 border-blue-400 shadow-md ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
          }`}
        >
          {isProRecommended && (
            <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
              Recommended
            </span>
          )}

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Option 2
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Find a Repair Professional
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Connect with verified local technicians equipped with bearing pullers, multimeters, and OEM parts.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>6 nearby certified techs</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>90-180 day warranty guarantee</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
            <span>Browse Local Technicians</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Option 3: Find Spare Parts */}
        <div
          id="action-card-spareparts"
          onClick={onSelectSpareParts}
          className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between relative group ${
            isPartsRecommended
              ? 'bg-indigo-50/70 border-indigo-400 shadow-md ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
          }`}
        >
          {isPartsRecommended && (
            <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
              Recommended
            </span>
          )}

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Option 3
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Find Compatible Spare Parts
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Order genuine OEM or verified aftermarket replacement bearings, seals, displays, or chains.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>High compatibility rating (90%+)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Fast 24-48h dispatch</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700 group-hover:text-indigo-800">
            <span>Explore Parts Market</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
