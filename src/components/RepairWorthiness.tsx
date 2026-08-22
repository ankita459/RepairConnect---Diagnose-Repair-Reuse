import React from 'react';
import {
  Scale,
  DollarSign,
  TrendingDown,
  Clock,
  Leaf,
  Layers,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Trash2,
  Package,
  Wrench,
} from 'lucide-react';
import { DiagnosisResultData } from '../types';

interface RepairWorthinessProps {
  diagnosis: DiagnosisResultData;
  onSelectAction: (action: string) => void;
  onExplorePros: () => void;
  onExploreParts: () => void;
}

export const RepairWorthiness: React.FC<RepairWorthinessProps> = ({
  diagnosis,
  onSelectAction,
  onExplorePros,
  onExploreParts,
}) => {
  const { repairWorthiness: rw, itemName, itemAgeYears } = diagnosis;

  const isRecommendedRepair = rw.verdict === 'REPAIR' || rw.verdict === 'SIMPLE_FIX';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" />
          <span>Decision & Lifecycle ROI Matrix</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Should You Repair It?</h2>
        <p className="text-sm text-slate-500">
          Comparing mechanical condition, component longevity, monetary savings, and environmental footprint.
        </p>
      </div>

      {/* Main Verdict Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-sm transition-all ${
          isRecommendedRepair
            ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white border-emerald-500/30'
            : 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white border-amber-500/30'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase">
              {isRecommendedRepair ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>High Value Opportunity</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Evaluation Required</span>
                </>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{rw.verdictTitle}</h3>
            <p className="text-sm text-slate-200 leading-relaxed">{rw.summary}</p>
          </div>

          {/* Big Savings Callout */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center shrink-0 min-w-[200px]">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              Potential Savings
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
              ₹{rw.potentialSavingsMin.toLocaleString()}–₹{rw.potentialSavingsMax.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">vs. Buying Brand New</div>
          </div>
        </div>

        {/* Financial Assessment Highlight Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-200">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
            <span>{rw.financialAssessmentText}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            *Estimates are calculated using regional part indices & labor rates.
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Estimated Repair Cost */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Estimated Repair
              </span>
              <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
                <Wrench className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ₹{rw.estimatedRepairCostMin.toLocaleString()}–₹{rw.estimatedRepairCostMax.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">Includes labor and required replacement parts.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Fraction of new product cost</span>
          </div>
        </div>

        {/* Estimated Replacement Cost */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Replacement Cost
              </span>
              <span className="p-1 rounded-lg bg-slate-100 text-slate-600">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ₹{rw.estimatedReplacementCostMin.toLocaleString()}–₹{rw.estimatedReplacementCostMax.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">Equivalent modern model with identical capacity.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Assumes standard retail market MSRP
          </div>
        </div>

        {/* Usable Life Extension */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Extended Lifespan
              </span>
              <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              +{rw.expectedLifeExtensionYears} Years
            </div>
            <p className="text-xs text-slate-500">With preventative servicing and new parts.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Parts availability:</span>
            <span className="font-semibold text-slate-800">{rw.sparePartsAvailability}</span>
          </div>
        </div>
      </div>

      {/* Environmental Savings Callout Grid */}
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                Environmental Savings by Repairing
              </h3>
              <p className="text-xs text-emerald-800">
                Avoid the embedded carbon emissions and landfill burden of manufacturing a replacement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-center shrink-0">
            <div>
              <div className="text-xl font-extrabold text-emerald-900 font-mono">
                {rw.carbonAvoidedKg} kg
              </div>
              <div className="text-[10px] uppercase font-bold text-emerald-700">CO2e Prevented</div>
            </div>
            <div className="border-l border-emerald-300 pl-6">
              <div className="text-xl font-extrabold text-emerald-900 font-mono">
                {rw.wasteDivertedKg} kg
              </div>
              <div className="text-[10px] uppercase font-bold text-emerald-700">E-Waste Diverted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Pathway Alternatives Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Your Action Pathways</h3>
          <span className="text-xs text-slate-500 font-medium">Select your preferred next step</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Pathway 1: Repair */}
          <div
            onClick={onExplorePros}
            className="p-4 rounded-2xl border-2 border-blue-500 bg-blue-50/50 hover:bg-blue-50 transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase">
                  Recommended
                </span>
                <Wrench className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-2">1. Repair Item</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Connect with local certified technicians for quick turnaround.
              </p>
            </div>
            <button className="text-xs font-bold text-blue-700 flex items-center gap-1">
              <span>Find Techs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pathway 2: Get Another Estimate */}
          <div
            onClick={onExplorePros}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                  Alternative
                </span>
                <Scale className="w-4 h-4 text-slate-500" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-2">2. Get 2nd Estimate</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Compare multiple technician quotes to ensure best pricing.
              </p>
            </div>
            <button className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <span>Compare Quotes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pathway 3: Find Spare Parts */}
          <div
            onClick={onExploreParts}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                  DIY Option
                </span>
                <Package className="w-4 h-4 text-slate-500" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-2">3. Order Spare Parts</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Source OEM replacement bearings, belts, and hardware.
              </p>
            </div>
            <button className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <span>Browse Parts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pathway 4: Recycle Responsibly */}
          <div
            onClick={() => onSelectAction('recycle')}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  Eco Fallback
                </span>
                <Trash2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-2">4. Recycle Responsibly</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                If repair is not viable, locate authorized e-waste dropoffs.
              </p>
            </div>
            <button className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span>E-Waste Centers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
