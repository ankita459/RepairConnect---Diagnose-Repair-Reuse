import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wrench,
  ShieldCheck,
  PhoneCall,
  CheckSquare,
  Square,
  ArrowRight,
  TrendingUp,
  FileText,
  Share2,
  Download,
  Leaf,
  Scale,
  MessageSquareQuote,
  Bot,
  Clock,
} from 'lucide-react';
import { DiagnosisResultData } from '../types';
import { getMaintenanceTipsByCategory } from '../data/maintenanceTips';
import { PreProfessionalChecklistCard } from './PreProfessionalChecklistCard';

interface DiagnosisResultProps {
  diagnosis: DiagnosisResultData;
  onExplorePros: () => void;
  onExploreParts: () => void;
  onJumpToWorthiness: () => void;
  onNewDiagnosis: () => void;
  onOpenAdvisor?: () => void;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  diagnosis,
  onExplorePros,
  onExploreParts,
  onJumpToWorthiness,
  onNewDiagnosis,
  onOpenAdvisor,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">Minor Fault</span>;
      case 'high':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-800">Substantial Fault</span>;
      case 'critical':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800">Critical Fault</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">Moderate Fault</span>;
    }
  };

  const getProbabilityBadge = (prob: string) => {
    if (prob.toLowerCase().includes('high')) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
          High Probability
        </span>
      );
    }
    if (prob.toLowerCase().includes('medium')) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Medium Probability
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        Low Probability
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-blue-600">Diagnosis Studio</span>
          <span>/</span>
          <span className="text-slate-900">{diagnosis.itemName}</span>
          {diagnosis.modelNumber && (
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-600 border border-slate-200">
              {diagnosis.modelNumber}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Report'}</span>
          </button>
          <button
            onClick={onNewDiagnosis}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            Diagnose Another Item
          </button>
        </div>
      </div>

      {/* Main Diagnosis Report Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header with Confidence Gauge */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> AI Diagnostic Assessment
                </span>
                {getSeverityBadge(diagnosis.severity)}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {diagnosis.possibleProblem}
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">{diagnosis.summary}</p>
            </div>

            {/* Confidence Score Pill */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-center shrink-0 flex flex-col items-center justify-center min-w-[140px]">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                {diagnosis.confidence}%
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5 uppercase tracking-wider">
                Confidence
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${diagnosis.confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* AI Legal Disclaimer Notice */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Note:</strong> This is an AI-assisted initial assessment based on reported symptoms and computer
              vision. Always verify critical components before conducting repairs.
            </span>
          </div>
        </div>

        {/* Media & Symptoms Row */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Uploaded Media preview if present */}
            {diagnosis.imageUrl && (
              <div className="md:col-span-1 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center max-h-56">
                <img
                  src={diagnosis.imageUrl}
                  alt={diagnosis.itemName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Visible & Reported Symptoms */}
            <div className={diagnosis.imageUrl ? 'md:col-span-2 space-y-3' : 'md:col-span-3 space-y-3'}>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Observed / Reported Symptoms</span>
              </h2>

              <ul className="space-y-2">
                {diagnosis.visibleSymptoms.map((sym, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <span className="leading-snug">{sym}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Possible Causes */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span>Identified Probable Causes</span>
              </h2>
              <span className="text-xs text-slate-400 font-medium">Ranked by likelihood</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {diagnosis.possibleCauses.map((cause, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">
                        {idx + 1}. {cause.cause}
                      </span>
                      {getProbabilityBadge(cause.probability)}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{cause.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Safe Basic Troubleshooting */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>What You Can Safely Check (Low-Risk Troubleshooting)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Follow safe, non-destructive checks only. Check off items as you perform them.
                </p>
              </div>

              <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                {completedSteps.length} of {diagnosis.safeTroubleshooting.length} Checked
              </div>
            </div>

            {diagnosis.safetyAlert && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Safety Rule:</strong> {diagnosis.safetyAlert}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {diagnosis.safeTroubleshooting.map((step) => {
                const isChecked = completedSteps.includes(step.step);
                return (
                  <div
                    key={step.step}
                    onClick={() => toggleStep(step.step)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-bold ${
                            isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          Step {step.step}: {step.title}
                        </span>
                        {step.toolNeeded && (
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                            Tool: {step.toolNeeded}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{step.instruction}</p>

                      {step.caution && (
                        <p className="text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200 mt-1.5 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>
                            <strong>Caution:</strong> {step.caution}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Interactive Pre-Professional Safety Checklist */}
          <div className="pt-2">
            <PreProfessionalChecklistCard
              category={diagnosis.category}
              itemName={diagnosis.itemName}
              modelNumber={diagnosis.modelNumber}
              possibleProblem={diagnosis.possibleProblem}
              onExplorePros={onExplorePros}
            />
          </div>

          {/* Section: Proactive Maintenance Tips */}
          {(() => {
            const categoryTips = getMaintenanceTipsByCategory(diagnosis.category);
            const topTip = categoryTips[0];
            return (
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-emerald-200 p-5 space-y-3.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Proactive Maintenance Tips for {diagnosis.category.replace('_', ' ')}</span>
                  </div>

                  <span className="text-[11px] font-black text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-300">
                    Extends Life {topTip?.lifeExtensionEstimate || '+3-5 Years'}
                  </span>
                </div>

                <p className="text-xs text-emerald-900 leading-relaxed">
                  Prevent future issues with {diagnosis.itemName} by adopting regular preventive maintenance care routines:
                </p>

                {topTip && (
                  <div className="bg-white/90 rounded-xl p-3.5 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{topTip.title}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {topTip.frequency} Routine
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{topTip.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {topTip.commonFailuresPrevented.slice(0, 2).map((fail, fIdx) => (
                        <span key={fIdx} className="text-[10px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          🛡️ Prevents {fail}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {onOpenAdvisor && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-medium text-emerald-800">
                      Explore full schedules & preventive checklists:
                    </span>
                    <button
                      type="button"
                      onClick={onOpenAdvisor}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Open AI Maintenance Tips</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Section: Red Flag Stop Criteria */}
          <div className="rounded-2xl bg-red-50/80 border border-red-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>When to Stop & Call a Professional Technician</span>
            </div>

            <p className="text-xs text-red-800 leading-relaxed">
              If you encounter any of the following conditions, do not attempt further DIY disassembly:
            </p>

            <ul className="space-y-1.5">
              {diagnosis.whenToStopAndCallPro.map((stopItem, idx) => (
                <li key={idx} className="text-xs text-red-900 flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{stopItem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section Navigation Quick CTAs */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Next recommended step:</span>{' '}
            <strong className="text-slate-900">{diagnosis.recommendedNextAction.headline}</strong>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {onOpenAdvisor && (
              <button
                onClick={onOpenAdvisor}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ask AI Repair Assistant</span>
              </button>
            )}

            <button
              onClick={onJumpToWorthiness}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              <span>Should You Repair It?</span>
            </button>

            <button
              onClick={onExplorePros}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/25"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Find Nearby Pros</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
