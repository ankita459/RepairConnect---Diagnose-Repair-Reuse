import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckSquare,
  Square,
  AlertTriangle,
  Zap,
  Droplets,
  Flame,
  HardDrive,
  Scissors,
  Eye,
  Clock,
  Wrench,
  HelpCircle,
  Sparkles,
  Copy,
  Check,
  Printer,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { ItemCategory } from '../types';
import {
  PreProfessionalChecklist,
  PreProChecklistStep,
  getPreProChecklistsByCategory,
} from '../data/preProfessionalChecklists';

interface PreProfessionalChecklistCardProps {
  category: ItemCategory;
  itemName: string;
  modelNumber?: string;
  possibleProblem?: string;
  onExplorePros?: () => void;
}

export const PreProfessionalChecklistCard: React.FC<PreProfessionalChecklistCardProps> = ({
  category,
  itemName,
  modelNumber,
  possibleProblem,
  onExplorePros,
}) => {
  const checklists = getPreProChecklistsByCategory(category, itemName);
  const [selectedChecklistId, setSelectedChecklistId] = useState<string>(checklists[0]?.id || '');
  const activeChecklist = checklists.find((c) => c.id === selectedChecklistId) || checklists[0];

  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [expandedStepIds, setExpandedStepIds] = useState<string[]>(
    activeChecklist ? activeChecklist.steps.map((s) => s.id) : []
  );
  const [copiedHandoff, setCopiedHandoff] = useState(false);

  if (!activeChecklist) return null;

  const totalSteps = activeChecklist.steps.length;
  const completedCount = completedStepIds.filter((id) =>
    activeChecklist.steps.some((s) => s.id === id)
  ).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const toggleStep = (stepId: string) => {
    setCompletedStepIds((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const toggleExpand = (stepId: string) => {
    setExpandedStepIds((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const markAllComplete = () => {
    const allIds = activeChecklist.steps.map((s) => s.id);
    setCompletedStepIds(allIds);
  };

  const resetChecklist = () => {
    setCompletedStepIds([]);
  };

  const copyHandoffSummary = () => {
    const statusText = activeChecklist.steps
      .map(
        (s) =>
          `[${completedStepIds.includes(s.id) ? 'X' : ' '}] Step ${s.stepNumber}: ${s.title}\n   ⚠️ Safety Note: ${s.safetyWarning.warningText}`
      )
      .join('\n\n');

    const summary = `=========================================
REPAIRCONNECT PRE-PROFESSIONAL HANDOFF BRIEF
=========================================
Item: ${itemName}
${modelNumber ? `Model / Part #: ${modelNumber}\n` : ''}Category: ${category.replace('_', ' ')}
Diagnosed Issue: ${possibleProblem || 'Hardware Inspection'}
Preparation Status: ${completedCount} of ${totalSteps} safety steps verified (${progressPercent}% Ready)

SAFETY & SITE PREPARATION CHECKLIST:
${statusText}

TECHNICIAN HANDOFF NOTES:
${activeChecklist.technicianHandoffTips.map((tip, idx) => `• ${tip}`).join('\n')}
=========================================
Generated via RepairConnect AI Diagnostic Studio`;

    navigator.clipboard?.writeText(summary);
    setCopiedHandoff(true);
    setTimeout(() => setCopiedHandoff(false), 2500);
  };

  const getHazardIcon = (hazardType: string) => {
    switch (hazardType) {
      case 'Electrical Shock':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Water Damage / Flooding':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'Lithium Fire / Battery Hazard':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'Data Loss':
        return <HardDrive className="w-4 h-4 text-purple-500" />;
      case 'Mechanical / Pinch Hazard':
      case 'Physical Strain / Tip-Over':
        return <Wrench className="w-4 h-4 text-orange-500" />;
      case 'Glass / Sharp Edge':
      case 'Chemical / Burn Hazard':
        return <Scissors className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getSafetyCardStyle = (level: 'critical' | 'high' | 'caution') => {
    switch (level) {
      case 'critical':
        return {
          wrapper: 'bg-red-50/90 border-red-200 text-red-950',
          badge: 'bg-red-600 text-white font-extrabold',
          title: 'CRITICAL SAFETY PROTOCOL',
          iconColor: 'text-red-600',
        };
      case 'high':
        return {
          wrapper: 'bg-amber-50/90 border-amber-200 text-amber-950',
          badge: 'bg-amber-600 text-white font-bold',
          title: 'HIGH HAZARD WARNING',
          iconColor: 'text-amber-600',
        };
      case 'caution':
      default:
        return {
          wrapper: 'bg-yellow-50/80 border-yellow-200 text-yellow-950',
          badge: 'bg-yellow-600 text-white font-semibold',
          title: 'SAFETY CAUTION',
          iconColor: 'text-yellow-700',
        };
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-white to-slate-50/70 border-2 border-indigo-100 shadow-sm overflow-hidden space-y-0">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-300" />
                Pre-Professional Repair Checklist
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                ⚡ Safety-First Preparation
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {activeChecklist.taskTitle}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeChecklist.objective}
            </p>
          </div>

          {/* Progress Circular/Pill Gauge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[150px]">
            <div className="text-2xl sm:text-3xl font-black text-indigo-300 font-mono">
              {progressPercent}%
            </div>
            <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
              {completedCount} of {totalSteps} Prepared
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Multi-checklist switcher if more than one */}
        {checklists.length > 1 && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Available Checklists:</span>
            {checklists.map((chk) => (
              <button
                key={chk.id}
                onClick={() => setSelectedChecklistId(chk.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  chk.id === activeChecklist.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {chk.taskTitle}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Meta Bar: Prep Tools, Est Time & Actions */}
      <div className="p-4 sm:px-6 bg-indigo-50/50 border-b border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-indigo-950 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Est. Prep Time: {activeChecklist.estimatedPrepTime}
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-slate-700">Recommended Tools / Materials:</span>
          {activeChecklist.requiredPrepTools.map((tool, idx) => (
            <span
              key={idx}
              className="bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-medium text-[11px]"
            >
              {tool}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {completedCount === totalSteps ? (
            <button
              onClick={resetChecklist}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-700 underline cursor-pointer"
            >
              Reset Checklist
            </button>
          ) : (
            <button
              onClick={markAllComplete}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
            >
              Mark All Prepared
            </button>
          )}
        </div>
      </div>

      {/* Steps List */}
      <div className="p-6 space-y-4">
        <div className="space-y-3.5">
          {activeChecklist.steps.map((step) => {
            const isCompleted = completedStepIds.includes(step.id);
            const isExpanded = expandedStepIds.includes(step.id);
            const safetyStyle = getSafetyCardStyle(step.safetyWarning.level);

            return (
              <div
                key={step.id}
                className={`rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-indigo-200 shadow-xs'
                }`}
              >
                {/* Step Header Row */}
                <div className="p-4 sm:p-4.5 flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                    aria-label={`Mark step ${step.stepNumber} complete`}
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-md ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-900'
                          }`}
                        >
                          Step {step.stepNumber}
                        </span>

                        <span
                          onClick={() => toggleStep(step.id)}
                          className={`text-sm font-bold cursor-pointer ${
                            isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ~{step.estimatedMinutes}m
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleExpand(step.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {step.instruction}
                    </p>

                    {/* Integrated Safety Warning Box - Highlighted for EVERY Step */}
                    <div
                      className={`mt-2.5 rounded-xl border p-3.5 space-y-1.5 ${safetyStyle.wrapper}`}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${safetyStyle.badge}`}
                          >
                            {safetyStyle.title}
                          </span>
                          <span className="text-xs font-extrabold flex items-center gap-1 text-slate-900">
                            {getHazardIcon(step.safetyWarning.hazardType)}
                            <span>{step.safetyWarning.hazardType}</span>
                          </span>
                        </div>

                        {step.toolsNeeded && step.toolsNeeded.length > 0 && (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                            <Wrench className="w-3 h-3 text-slate-500" />
                            <span>Tool: {step.toolsNeeded.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs leading-relaxed font-medium">
                        {step.safetyWarning.warningText}
                      </p>
                    </div>

                    {/* Expanded Details: Pro Tip & Verification Prompt */}
                    {isExpanded && (
                      <div className="pt-2 space-y-2">
                        {step.proTip && (
                          <div className="text-xs text-indigo-900 bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                            <span>
                              <strong>Technician Tip:</strong> {step.proTip}
                            </span>
                          </div>
                        )}

                        {step.verificationQuestion && (
                          <div
                            onClick={() => toggleStep(step.id)}
                            className={`text-xs p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                              isCompleted
                                ? 'bg-emerald-100/50 border-emerald-200 text-emerald-900'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 font-medium">
                              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                              <span>{step.verificationQuestion}</span>
                            </span>

                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {isCompleted ? 'Verified ✓' : 'Click to Verify'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technician Handoff Advice & Share/Copy Card */}
        <div className="mt-6 rounded-2xl bg-slate-900 text-white p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>Technician Handoff Briefing & Best Practices</span>
              </h3>
              <p className="text-xs text-slate-400">
                Share this information when the professional technician arrives to accelerate diagnosis and ensure full safety.
              </p>
            </div>

            <button
              type="button"
              onClick={copyHandoffSummary}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-sm shadow-indigo-600/30"
            >
              {copiedHandoff ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Brief Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Handoff Brief</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeChecklist.technicianHandoffTips.map((tip, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300 space-y-1"
              >
                <div className="text-[10px] font-black text-indigo-300 uppercase">
                  Tip 0{idx + 1}
                </div>
                <p className="leading-snug">{tip}</p>
              </div>
            ))}
          </div>

          {onExplorePros && (
            <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs text-slate-300 font-medium">
                Ready to book a verified professional near you?
              </span>
              <button
                type="button"
                onClick={onExplorePros}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Wrench className="w-3.5 h-3.5 text-slate-950" />
                <span>Find Nearby Verified Technicians</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
