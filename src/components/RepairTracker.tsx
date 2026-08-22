import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Wrench,
  Sparkles,
  Phone,
  MessageSquare,
  ShieldCheck,
  Award,
  ChevronRight,
  FileCheck,
  Share2,
  RefreshCw,
  Plus,
  Leaf,
  Recycle,
  Zap,
  TrendingUp,
  Check,
  Copy,
  PartyPopper,
  X,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { RepairRequest, RepairStatus, ItemCategory } from '../types';

interface RepairTrackerProps {
  repairs: RepairRequest[];
  onUpdateRepairStatus: (repairId: string, nextStatus: RepairStatus) => void;
  onNewDiagnosis: () => void;
}

const STATUS_ORDER: RepairStatus[] = [
  'request_sent',
  'accepted',
  'in_progress',
  'repaired',
  'reused',
];

// Eco impact factors by category
const CATEGORY_ECO_IMPACT: Record<
  string,
  {
    ewasteKg: number;
    co2Kg: number;
    ecoXp: number;
    treeEquivalent: string;
    lifecycleExtension: string;
  }
> = {
  home_appliances: {
    ewasteKg: 45.0,
    co2Kg: 78.5,
    ecoXp: 280,
    treeEquivalent: '4.2 trees planted for a year',
    lifecycleExtension: '+5.0 years',
  },
  electronics: {
    ewasteKg: 14.5,
    co2Kg: 62.0,
    ecoXp: 220,
    treeEquivalent: '3.1 trees planted for a year',
    lifecycleExtension: '+3.5 years',
  },
  computers_laptops: {
    ewasteKg: 3.8,
    co2Kg: 125.0,
    ecoXp: 300,
    treeEquivalent: '6.5 trees planted for a year',
    lifecycleExtension: '+3.0 years',
  },
  mobile_phones: {
    ewasteKg: 0.35,
    co2Kg: 52.0,
    ecoXp: 180,
    treeEquivalent: '2.8 trees planted for a year',
    lifecycleExtension: '+2.5 years',
  },
  bicycles: {
    ewasteKg: 12.0,
    co2Kg: 35.0,
    ecoXp: 200,
    treeEquivalent: '2.0 trees planted for a year',
    lifecycleExtension: '+6.0 years',
  },
  furniture: {
    ewasteKg: 22.0,
    co2Kg: 48.0,
    ecoXp: 210,
    treeEquivalent: '2.6 trees planted for a year',
    lifecycleExtension: '+8.0 years',
  },
  kitchen_appliances: {
    ewasteKg: 8.5,
    co2Kg: 42.0,
    ecoXp: 190,
    treeEquivalent: '2.2 trees planted for a year',
    lifecycleExtension: '+4.0 years',
  },
};

export const triggerEcoConfetti = () => {
  // Multi-stage celebratory confetti explosion
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Emerald, Teal, Gold, Blue, Violet celebratory palette
  const ecoColors = ['#10B981', '#059669', '#34D399', '#F59E0B', '#6366F1', '#3B82F6', '#14B8A6'];

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ecoColors,
  });
  fire(0.2, {
    spread: 60,
    colors: ecoColors,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ecoColors,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ecoColors,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ecoColors,
  });

  // Additional celebratory side cannons after 250ms
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ecoColors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ecoColors,
      zIndex: 9999,
    });
  }, 250);
};

export const RepairTracker: React.FC<RepairTrackerProps> = ({
  repairs,
  onUpdateRepairStatus,
  onNewDiagnosis,
}) => {
  const [selectedRepairId, setSelectedRepairId] = useState<string>(
    repairs[0]?.id || ''
  );
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [celebrationModalData, setCelebrationModalData] = useState<{
    repair: RepairRequest;
    status: 'repaired' | 'reused';
  } | null>(null);
  const [copiedHandoff, setCopiedHandoff] = useState(false);

  const activeRepair =
    repairs.find((r) => r.id === selectedRepairId) || repairs[0];

  const getNextStatus = (current: RepairStatus): RepairStatus | null => {
    const currentIndex = STATUS_ORDER.indexOf(current);
    if (currentIndex >= 0 && currentIndex < STATUS_ORDER.length - 1) {
      return STATUS_ORDER[currentIndex + 1];
    }
    return null;
  };

  const handleStatusChangeWithGamification = (repairId: string, nextStatus: RepairStatus) => {
    onUpdateRepairStatus(repairId, nextStatus);

    const targetRepair = repairs.find((r) => r.id === repairId) || activeRepair;

    // Trigger celebration when marked as 'repaired' (completed) or 'reused'
    if (nextStatus === 'repaired' || nextStatus === 'reused') {
      triggerEcoConfetti();
      if (targetRepair) {
        setCelebrationModalData({
          repair: { ...targetRepair, status: nextStatus },
          status: nextStatus,
        });
      }
    }
  };

  const getStatusBadge = (status: RepairStatus) => {
    switch (status) {
      case 'request_sent':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            Request Dispatched
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
            Tech Assigned
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
            Repair In Progress
          </span>
        );
      case 'repaired':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Repaired & QA Tested
          </span>
        );
      case 'reused':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300 flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Reused & In Service 🌱
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            Pending
          </span>
        );
    }
  };

  if (!activeRepair) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Active Repair Tickets</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          You don’t have any active repair requests currently. Run an AI diagnosis or book a local technician to get started.
        </p>
        <button
          onClick={onNewDiagnosis}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 cursor-pointer"
        >
          Diagnose an Item
        </button>
      </div>
    );
  }

  const nextStatus = getNextStatus(activeRepair.status);
  const ecoData =
    CATEGORY_ECO_IMPACT[activeRepair.category] || CATEGORY_ECO_IMPACT.electronics;
  const estimatedSavings =
    activeRepair.estimatedCost > 0
      ? Math.round(activeRepair.estimatedCost * 2.8)
      : 8500;

  const copyCelebrationMilestone = (status: 'repaired' | 'reused') => {
    const text = `🎉 Repair Milestone Achieved on RepairConnect!
Item: ${activeRepair.itemName}
Status: ${status === 'reused' ? 'Reused & Active in Service 🌱' : 'Repaired & Quality Tested ⚙️'}
Eco Impact: Diverted ~${ecoData.ewasteKg}kg of e-waste and abated ~${ecoData.co2Kg}kg CO₂ emissions!
Estimated Lifetime Extended: ${ecoData.lifecycleExtension}
#RightToRepair #CircularEconomy #SustainableLiving`;

    navigator.clipboard?.writeText(text);
    setCopiedHandoff(true);
    setTimeout(() => setCopiedHandoff(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Lifecycle & Sustainability Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Repair Status & Milestone Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status updates from dispatch to diagnostic overhaul, testing, and zero-waste reuse.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={triggerEcoConfetti}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Trigger eco victory confetti celebration"
          >
            <PartyPopper className="w-4 h-4 text-emerald-600" />
            <span>Celebrate Impact 🎉</span>
          </button>

          <button
            onClick={onNewDiagnosis}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Repair Ticket</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Tickets ({repairs.length})
            </h2>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Sustainability Tracked
            </span>
          </div>

          <div className="space-y-2.5">
            {repairs.map((r) => (
              <div
                key={r.id}
                id={`ticket-item-${r.id}`}
                onClick={() => setSelectedRepairId(r.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  r.id === activeRepair.id
                    ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-700">
                    {r.trackingNumber}
                  </span>
                  {getStatusBadge(r.status)}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                  <p className="text-xs text-slate-500">Tech: {r.professionalName}</p>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>Est: ₹{r.estimatedCost.toLocaleString()}</span>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Gamified Eco Stats Mini-Widget */}
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-4.5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                Your Sustainability XP
              </span>
              <span className="text-[10px] font-black bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                Level 3 Eco-Saver
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Level Progress</span>
                <span className="font-mono font-bold text-emerald-300">720 / 1000 XP</span>
              </div>
              <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Marking repairs as <strong>Completed</strong> or <strong>Reused</strong> triggers
              confetti celebrations, awards +200 XP, and logs real landfill diversion!
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Timeline Stepper & Action Hub */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Ticket Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Top Bar with Tracking ID and Status Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="text-xs text-slate-400">Tracking Code</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {activeRepair.trackingNumber}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(activeRepair.status)}

                {/* Direct Milestone Transition Buttons */}
                {activeRepair.status !== 'repaired' && activeRepair.status !== 'reused' && (
                  <button
                    onClick={() => handleStatusChangeWithGamification(activeRepair.id, 'repaired')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Mark as repaired, tested, and award sustainability XP"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark as Repaired</span>
                  </button>
                )}

                {activeRepair.status !== 'reused' && (
                  <button
                    onClick={() => handleStatusChangeWithGamification(activeRepair.id, 'reused')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Mark as reused in active rotation and unlock victory confetti"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Mark as Reused 🌱</span>
                  </button>
                )}

                {nextStatus && (
                  <button
                    onClick={() => handleStatusChangeWithGamification(activeRepair.id, nextStatus)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Simulate transitioning to the next milestone in demo"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Advance Next</span>
                  </button>
                )}
              </div>
            </div>

            {/* Item & Technician Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Item Under Service
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {activeRepair.itemName}
                </h3>
                <p className="text-xs text-slate-600 mt-1">{activeRepair.diagnosisSummary}</p>
              </div>

              <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                <img
                  src={activeRepair.professionalAvatar}
                  alt={activeRepair.professionalName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Assigned Master Tech
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {activeRepair.professionalName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-medium pt-0.5">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Call Tech
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Chat
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stepper Timeline Visualizer with Motion Animations */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Milestone Progress
                </h3>
                <span className="text-xs text-slate-500">Click a milestone to simulate update</span>
              </div>

              <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {activeRepair.timeline.map((step, idx) => {
                  const isCurrent = step.status === activeRepair.status;
                  const isCelebrated =
                    (step.status === 'repaired' || step.status === 'reused') && step.completed;

                  return (
                    <div
                      key={idx}
                      className="relative group cursor-pointer"
                      onClick={() =>
                        handleStatusChangeWithGamification(
                          activeRepair.id,
                          step.status as RepairStatus
                        )
                      }
                      title={`Click to set status to "${step.title}"`}
                    >
                      {/* Step Indicator Dot with Motion animation */}
                      <motion.div
                        className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          step.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                            : isCurrent
                            ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-white border-slate-300 text-slate-300 group-hover:border-slate-400'
                        }`}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        animate={
                          isCelebrated
                            ? { scale: [1, 1.25, 1], transition: { duration: 0.4 } }
                            : {}
                        }
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-current" />
                        )}
                      </motion.div>

                      {/* Content */}
                      <div className="space-y-1 pl-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                step.completed || isCurrent
                                  ? 'text-slate-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.title}
                            </h4>
                            {(step.status === 'repaired' || step.status === 'reused') && (
                              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Eco Milestone
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{step.timestamp}</span>
                        </div>
                        <p
                          className={`text-xs leading-relaxed ${
                            step.completed || isCurrent ? 'text-slate-600' : 'text-slate-400'
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sustainability Impact Breakdown Card */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 p-5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Recycle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                      Circularity & Eco ROI for this Item
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium">
                      By restoring rather than replacing this {activeRepair.itemName.toLowerCase()}:
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={triggerEcoConfetti}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <PartyPopper className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Blast Confetti</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-emerald-200 text-center">
                  <div className="text-base font-black text-emerald-700 font-mono">
                    ~{ecoData.ewasteKg} kg
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase">
                    E-Waste Saved
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-teal-200 text-center">
                  <div className="text-base font-black text-teal-700 font-mono">
                    ~{ecoData.co2Kg} kg
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase">
                    CO₂ Abated
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-blue-200 text-center">
                  <div className="text-base font-black text-blue-700 font-mono">
                    ₹{estimatedSavings.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase">
                    Money Saved
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-purple-200 text-center">
                  <div className="text-base font-black text-purple-700 font-mono">
                    {ecoData.lifecycleExtension}
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase">
                    Life Extended
                  </div>
                </div>
              </div>
            </div>

            {/* Warranty Certificate Banner */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    RepairConnect {activeRepair.warrantyDays || 90}-Day Guarantee
                  </h4>
                  <p className="text-xs text-slate-600">
                    If this component experiences recurrence within warranty, parts and labor are fully covered.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWarrantyModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>View Certificate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Success & Celebration Modal with framer-motion */}
      <AnimatePresence>
        {celebrationModalData && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-emerald-500/40 relative space-y-0"
            >
              {/* Top Vibrant Header */}
              <div className="p-6 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white text-center relative overflow-hidden">
                <button
                  type="button"
                  onClick={() => setCelebrationModalData(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Animated Badge Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ delay: 0.1, duration: 0.6, type: 'spring' }}
                  className="w-16 h-16 rounded-3xl bg-white text-emerald-700 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/30 mb-3 border-2 border-emerald-200"
                >
                  {celebrationModalData.status === 'reused' ? (
                    <Recycle className="w-8 h-8 text-teal-600" />
                  ) : (
                    <Award className="w-8 h-8 text-emerald-600" />
                  )}
                </motion.div>

                <span className="px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-extrabold uppercase tracking-wider border border-white/20">
                  🎉 Sustainability Victory Unlocked!
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                  {celebrationModalData.status === 'reused'
                    ? 'Item Successfully Reused & Kept in Service!'
                    : 'Repair Completed & Certified!'}
                </h3>

                <p className="text-xs text-emerald-100 max-w-xs mx-auto mt-1">
                  You just saved <strong>{celebrationModalData.repair.itemName}</strong> from
                  landfills and extended its active lifecycle!
                </p>
              </div>

              {/* Eco Metrics Grid */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <div className="text-lg font-black text-emerald-800 font-mono">
                      ~{ecoData.ewasteKg} kg
                    </div>
                    <div className="text-[10px] font-bold text-emerald-900 uppercase">
                      E-Waste Saved
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200">
                    <div className="text-lg font-black text-teal-800 font-mono">
                      ~{ecoData.co2Kg} kg
                    </div>
                    <div className="text-[10px] font-bold text-teal-900 uppercase">
                      CO₂ Abated
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="text-lg font-black text-amber-800 font-mono">
                      +{ecoData.ecoXp} XP
                    </div>
                    <div className="text-[10px] font-bold text-amber-900 uppercase">
                      Eco Points
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      Environmental Equivalent:
                    </span>
                    <span className="font-bold text-emerald-700">{ecoData.treeEquivalent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Estimated Lifecycle Extension:</span>
                    <strong className="text-slate-900">{ecoData.lifecycleExtension}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Capital Saved:</span>
                    <strong className="text-emerald-700">
                      ₹{estimatedSavings.toLocaleString()} avoided cost
                    </strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => copyCelebrationMilestone(celebrationModalData.status)}
                    className="w-full sm:flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedHandoff ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Milestone Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Share Green Milestone</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={triggerEcoConfetti}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PartyPopper className="w-4 h-4" />
                    <span>Confetti 🎉</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCelebrationModalData(null)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Warranty Certificate Modal */}
      {showWarrantyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-5 border-4 border-emerald-500/30">
            <div className="text-center space-y-2 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Certificate of Service Warranty
              </h3>
              <p className="text-xs text-slate-500">Official RepairConnect Quality Guarantee</p>
            </div>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Item:</span>
                <strong className="text-slate-900">{activeRepair.itemName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ticket ID:</span>
                <strong className="text-slate-900 font-mono">
                  {activeRepair.trackingNumber}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Technician:</span>
                <strong className="text-slate-900">{activeRepair.professionalName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Warranty Coverage:</span>
                <strong className="text-emerald-700 font-bold">
                  {activeRepair.warrantyDays || 90} Days (Parts & Labor)
                </strong>
              </div>
            </div>

            <button
              onClick={() => setShowWarrantyModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

