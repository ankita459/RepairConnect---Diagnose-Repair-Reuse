import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Star,
  Award,
  DollarSign,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { RepairProfessional, RepairRequest, RepairStatus } from '../types';

interface ProfessionalDashboardProps {
  pro: RepairProfessional;
  repairs: RepairRequest[];
  onUpdateRepairStatus: (repairId: string, status: RepairStatus) => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({
  pro,
  repairs,
  onUpdateRepairStatus,
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');

  const proRepairs = repairs.filter(
    (r) => r.professionalId === pro.id || r.professionalName.includes('Sharma') || r.professionalName.includes('Express')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <img
            src={pro.avatarUrl}
            alt={pro.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>Certified Technician Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pro.businessName}
            </h1>
            <p className="text-xs text-slate-500">
              Lead Technician: {pro.name} • {pro.yearsExperience} Years Exp • Rating: ★ {pro.rating} ({pro.reviewCount} reviews)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            ● Available for Dispatches Today
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Incoming Jobs</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{proRepairs.length}</div>
          <span className="text-[11px] text-blue-600 font-semibold">Active queue</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Month Earnings</span>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-1">₹48,500</div>
          <span className="text-[11px] text-emerald-700 font-semibold">18 completed repairs</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Quality Rating</span>
          <div className="text-2xl font-black text-amber-500 font-mono mt-1">4.9 ★</div>
          <span className="text-[11px] text-slate-500">99.4% satisfaction</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Avg Turnaround</span>
          <div className="text-2xl font-black text-indigo-700 font-mono mt-1">4.2 Hours</div>
          <span className="text-[11px] text-slate-500">Same-day service</span>
        </div>
      </div>

      {/* Incoming Requests & Work Orders Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Repair Job Queue & Status Management</h2>
            <p className="text-xs text-slate-500">
              Update repair stages in real-time to notify customers automatically
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {proRepairs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                    {job.trackingNumber}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{job.itemName}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Current Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase">
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 font-semibold block">Reported Problem:</span>
                  <p className="mt-0.5">{job.problemDescription}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Customer Details:</span>
                  <p className="mt-0.5 font-semibold text-slate-900">{job.customerName}</p>
                  <p className="text-slate-500">{job.customerPhone}</p>
                  <p className="text-slate-500">{job.customerAddress}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Estimate & Warranty:</span>
                  <p className="mt-0.5 font-bold text-emerald-700 font-mono">
                    ₹{job.estimatedCost.toLocaleString()}
                  </p>
                  <p className="text-slate-500">{job.warrantyDays}-Day Service Warranty</p>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500">Quick Update Status:</span>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => onUpdateRepairStatus(job.id, 'accepted')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      job.status === 'accepted'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    Accept Ticket
                  </button>

                  <button
                    onClick={() => onUpdateRepairStatus(job.id, 'in_progress')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      job.status === 'in_progress'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    In Progress
                  </button>

                  <button
                    onClick={() => onUpdateRepairStatus(job.id, 'repaired')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      job.status === 'repaired'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50'
                    }`}
                  >
                    Mark Repaired & Tested
                  </button>

                  <button
                    onClick={() => onUpdateRepairStatus(job.id, 'reused')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      job.status === 'reused'
                        ? 'bg-teal-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-teal-50'
                    }`}
                  >
                    Delivered & Reused
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
