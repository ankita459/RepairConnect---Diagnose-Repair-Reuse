import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Wrench,
  Sparkles,
  Truck,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DiagnosisResultData, RepairProfessional, RepairRequest } from '../types';

interface BookRepairModalProps {
  pro: RepairProfessional;
  diagnosis?: DiagnosisResultData | null;
  onClose: () => void;
  onBookingConfirmed: (booking: RepairRequest) => void;
}

export const BookRepairModal: React.FC<BookRepairModalProps> = ({
  pro,
  diagnosis,
  onClose,
  onBookingConfirmed,
}) => {
  const [serviceType, setServiceType] = useState<'doorstep' | 'pickup' | 'carry_in'>('doorstep');
  const [scheduledDate, setScheduledDate] = useState('2026-08-25');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [customerName, setCustomerName] = useState('Arjun Mehta');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 44920');
  const [customerAddress, setCustomerAddress] = useState('Flat 402, Green Meadows, Andheri East, Mumbai');
  const [userNotes, setUserNotes] = useState(
    diagnosis
      ? `Issue: ${diagnosis.possibleProblem}. Symptoms: ${diagnosis.visibleSymptoms.join(', ')}`
      : 'Requires diagnostic inspection and repair.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const estimatedCost = Math.round(
    (pro.estimatedPriceRange.min + pro.estimatedPriceRange.max) / 2
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Ignore confetti if not supported
      }

      const newBooking: RepairRequest = {
        id: `rep-${Date.now()}`,
        trackingNumber: `RC-${Math.floor(100000 + Math.random() * 900000)}`,
        itemName: diagnosis ? diagnosis.itemName : 'Appliances / Equipment',
        category: diagnosis ? diagnosis.category : 'home_appliances',
        problemDescription: userNotes,
        diagnosisSummary: diagnosis ? diagnosis.possibleProblem : 'Initial inspection booked',
        professionalId: pro.id,
        professionalName: pro.businessName,
        professionalAvatar: pro.avatarUrl,
        customerName,
        customerPhone,
        customerAddress,
        status: 'request_sent',
        estimatedCost: estimatedCost,
        createdAt: new Date().toISOString(),
        timeline: [
          {
            status: 'request_sent',
            title: 'Repair Request Submitted',
            description: `Request dispatched to ${pro.businessName} for ${scheduledDate} (${timeSlot}).`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            completed: true,
          },
          {
            status: 'accepted',
            title: 'Technician Review & Acceptance',
            description: 'Technician reviews symptoms and confirms dispatch.',
            timestamp: 'Pending',
            completed: false,
          },
          {
            status: 'in_progress',
            title: 'Diagnostic Inspection & Parts Installation',
            description: 'Physical testing and component overhaul.',
            timestamp: 'Pending',
            completed: false,
          },
          {
            status: 'repaired',
            title: 'Quality QA Test & 90-Day Warranty Tag',
            description: 'Full cycle load verification and safety cert.',
            timestamp: 'Pending',
            completed: false,
          },
          {
            status: 'reused',
            title: 'Item Returned & Reused',
            description: 'Product back in service, extending useful lifecycle.',
            timestamp: 'Pending',
            completed: false,
          },
        ],
        warrantyDays: pro.warrantyDays,
      };

      setTimeout(() => {
        onBookingConfirmed(newBooking);
      }, 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <img
              src={pro.avatarUrl}
              alt={pro.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Book Repair Appointment</h2>
              <p className="text-xs text-slate-500">
                with <strong className="text-slate-900">{pro.businessName}</strong> ({pro.name})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Booking Confirmed!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your repair ticket has been created and assigned to <strong>{pro.businessName}</strong>. You can
                track real-time status in the Repair Tracker.
              </p>
              <div className="inline-block px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold font-mono">
                Redirecting to Live Tracker...
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Service Method Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Service Delivery Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType('doorstep')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      serviceType === 'doorstep'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-blue-600 mb-1" />
                    <div className="font-bold text-xs">Doorstep Visit</div>
                    <div className="text-[10px] text-slate-500">Tech visits home</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('pickup')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      serviceType === 'pickup'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-emerald-600 mb-1" />
                    <div className="font-bold text-xs">Free Pickup</div>
                    <div className="text-[10px] text-slate-500">Courier collects</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('carry_in')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      serviceType === 'carry_in'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4 text-slate-600 mb-1" />
                    <div className="font-bold text-xs">Workshop Drop</div>
                    <div className="text-[10px] text-slate-500">Visit store</div>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white"
                  >
                    <option>09:00 AM - 11:00 AM</option>
                    <option>10:00 AM - 12:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {serviceType !== 'carry_in' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Service Address
                  </label>
                  <textarea
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              )}

              {/* Item Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Item Symptoms / Notes for Technician
                </label>
                <textarea
                  rows={2}
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Pricing & Guarantee Callout */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">Base Estimate for {diagnosis ? diagnosis.itemName : 'Inspection'}:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{pro.estimatedPriceRange.min} - ₹{pro.estimatedPriceRange.max}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Backed by {pro.warrantyDays}-Day Repair Guarantee</span>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/25 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Booking Ticket...</span>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Confirm & Book Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
