import React from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Scale,
} from 'lucide-react';
import { RepairProfessional } from '../types';

interface CompareProfessionalsModalProps {
  pros: RepairProfessional[];
  onClose: () => void;
  onBookPro: (pro: RepairProfessional) => void;
}

export const CompareProfessionalsModal: React.FC<CompareProfessionalsModalProps> = ({
  pros,
  onClose,
  onBookPro,
}) => {
  if (!pros || pros.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Compare Repair Professionals
              </h2>
              <p className="text-xs text-slate-500">
                Evaluating {pros.length} certified technicians side-by-side
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Matrix Grid */}
        <div className="p-6 overflow-x-auto overflow-y-auto space-y-6">
          <div className="grid grid-flow-col auto-cols-[minmax(220px,1fr)] gap-4 min-w-[650px]">
            {pros.map((pro) => (
              <div
                key={pro.id}
                className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200 space-y-4 flex flex-col justify-between"
              >
                {/* Pro Identity */}
                <div className="text-center space-y-2">
                  <img
                    src={pro.avatarUrl}
                    alt={pro.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs mx-auto"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{pro.businessName}</h3>
                    <p className="text-xs text-slate-500">{pro.name}</p>
                  </div>
                  {pro.isVerified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified Pro
                    </span>
                  )}
                </div>

                {/* Metrics Table */}
                <div className="space-y-2 text-xs border-t border-slate-200 pt-3">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Rating</span>
                    <span className="font-bold text-slate-900 flex items-center">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                      {pro.rating} ({pro.reviewCount})
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Distance</span>
                    <span className="font-bold text-blue-600">{pro.distanceKm} km</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Estimate</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      ₹{pro.estimatedPriceRange.min}–₹{pro.estimatedPriceRange.max}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Availability</span>
                    <span className="font-bold text-slate-900">{pro.availability}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Experience</span>
                    <span className="font-semibold text-slate-900">{pro.yearsExperience} Years</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Repairs Done</span>
                    <span className="font-semibold text-slate-900">{pro.completedRepairsCount}+</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Warranty</span>
                    <span className="font-bold text-emerald-700">{pro.warrantyDays} Days</span>
                  </div>
                </div>

                {/* Booking Button */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBookPro(pro);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Choose This Tech</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
