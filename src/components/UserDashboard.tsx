import React from 'react';
import {
  User,
  Clock,
  Wrench,
  Leaf,
  Coins,
  ChevronRight,
  Sparkles,
  Calendar,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { DiagnosisResultData, RepairRequest, SustainabilityStats } from '../types';

interface UserDashboardProps {
  recentDiagnoses: DiagnosisResultData[];
  repairs: RepairRequest[];
  stats: SustainabilityStats;
  onSelectDiagnosis: (diag: DiagnosisResultData) => void;
  onTrackRepair: (repairId: string) => void;
  onStartNewDiagnosis: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  recentDiagnoses,
  repairs,
  stats,
  onSelectDiagnosis,
  onTrackRepair,
  onStartNewDiagnosis,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            AM
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-0.5">
              <User className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Arjun Mehta's Repair Hub
            </h1>
            <p className="text-xs text-slate-500">
              Personal sustainability impact: 3 items repaired • 18kg e-waste avoided
            </p>
          </div>
        </div>

        <button
          onClick={onStartNewDiagnosis}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-xs cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>New AI Diagnosis</span>
        </button>
      </div>

      {/* User Quick Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono">{repairs.length}</div>
            <div className="text-xs text-slate-500">Active / Past Repairs</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700 font-mono">18.2 kg</div>
            <div className="text-xs text-slate-500">Personal E-Waste Prevented</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono">₹24,500</div>
            <div className="text-xs text-slate-500">Total Money Saved vs Buying New</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Repairs & Diagnostic History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Repairs Section */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Active Repair Tickets</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold">{repairs.length} Orders</span>
          </div>

          {repairs.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No active repair orders.</p>
          ) : (
            <div className="space-y-3">
              {repairs.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onTrackRepair(r.id)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-700">{r.trackingNumber}</span>
                      <span className="px-2 py-0.2 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800 uppercase">
                        {r.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                    <p className="text-xs text-slate-500">Tech: {r.professionalName}</p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved AI Diagnoses Section */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Saved AI Diagnoses & Reports</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold">{recentDiagnoses.length} Reports</span>
          </div>

          <div className="space-y-3">
            {recentDiagnoses.map((diag) => (
              <div
                key={diag.id}
                onClick={() => onSelectDiagnosis(diag)}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{diag.itemName}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                      {diag.confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{diag.possibleProblem}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-blue-600 group-hover:underline">
                    View Report →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
