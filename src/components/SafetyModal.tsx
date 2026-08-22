import React from 'react';
import {
  ShieldCheck,
  X,
  AlertTriangle,
  Zap,
  Flame,
  Wrench,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface SafetyModalProps {
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Safety & Responsible AI Standards
              </h2>
              <p className="text-xs text-slate-500">
                Our strict protocols to keep consumers, devices, and technicians safe
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <h3 className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>AI-Assisted Assessment Notice</span>
            </h3>
            <p className="text-amber-900">
              RepairConnect provides AI-assisted assessments based on reported symptoms, failure heuristics, and
              computer vision analysis. It is designed to assist you in understanding potential failure points and is not
              a certified engineering blueprint.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Strict Non-DIY Hazard Rules</h3>
            <p>
              RepairConnect algorithms will <strong>never</strong> instruct users to perform high-risk procedures
              including:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <li className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <Zap className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Discharging high-voltage microwave or TV capacitors</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <Flame className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Opening gas stove valves, regulators, or fuel lines</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <Lock className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Puncturing or heating swollen lithium-ion pouch cells</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <Wrench className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Structural frame welding without certified safety gear</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Technician Network Verification</h3>
            <p>
              Every repair professional on RepairConnect undergoes identity verification, workshop address
              validation, and peer review checks. Bookings are protected by the RepairConnect Warranty Guarantee.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
};
