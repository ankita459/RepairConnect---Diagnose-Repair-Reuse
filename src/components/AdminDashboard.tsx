import React from 'react';
import {
  ShieldAlert,
  BarChart3,
  Users,
  Wrench,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Cpu,
} from 'lucide-react';
import { REPAIR_PROFESSIONALS } from '../data/mockData';
import { RepairRequest, SustainabilityStats } from '../types';

interface AdminDashboardProps {
  repairs: RepairRequest[];
  stats: SustainabilityStats;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ repairs, stats }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Server className="w-3.5 h-3.5" />
            <span>Platform Governance & AI Health</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            RepairConnect Admin Console
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time telemetry on AI inference, technician compliance, and verified carbon savings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Gemini 2.5 Engine Healthy
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">AI Diagnoses Run</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-2">14,842</div>
          <span className="text-[11px] text-emerald-700 font-semibold">98.6% structured JSON parse rate</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Verified Technicians</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-2">
            {REPAIR_PROFESSIONALS.length} Masters
          </div>
          <span className="text-[11px] text-slate-500">100% background certified</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Repair Orders</span>
            <Wrench className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-2">{repairs.length} Orders</div>
          <span className="text-[11px] text-slate-500">92% same-week delivery</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Safety Flags</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-2">0 Breaches</div>
          <span className="text-[11px] text-slate-500">Hazard prompts intercepted</span>
        </div>
      </div>

      {/* Safety Logs & AI Diagnostics Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Real-Time AI Diagnostic Inferences</span>
          </h2>

          <div className="space-y-2 text-xs font-mono">
            {[
              { time: '14:22:04', item: 'LG Front Load Washer', conf: '88%', status: 'Parsed OK' },
              { time: '14:20:19', item: 'iPhone 13 Pro (OLED)', conf: '94%', status: 'Parsed OK' },
              { time: '14:18:55', item: 'Trek Hybrid 700c (Derailleur)', conf: '82%', status: 'Parsed OK' },
              { time: '14:15:10', item: 'Sony Bravia 55" (Power Supply)', conf: '79%', status: 'Parsed OK' },
              { time: '14:11:42', item: 'Oak Dining Chair (Loose Mortise)', conf: '91%', status: 'Parsed OK' },
            ].map((log, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{log.time}</span>
                  <span className="font-semibold text-slate-900">{log.item}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">{log.conf}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>AI Safety & Responsible Guardrail Rules</span>
          </h2>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <strong className="block text-emerald-950">High-Voltage Enclosure Guard:</strong>
              When prompts mention microwaves, CRT monitors, or power distribution boxes, the AI strictly instructs
              capacitor discharge safety and routes to professional technicians.
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
              <strong className="block text-blue-950">Non-Destructive Step Enforcement:</strong>
              DIY troubleshooting guides are restricted to non-destructive checks (cleaning filters, checking power
              outlets, visual inspections) to prevent user injury or product damage.
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900">
              <strong className="block text-purple-950">ROI Transparency Engine:</strong>
              Repair-worthiness algorithms enforce honest replacement warnings when parts exceed 65% of new replacement
              value.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
