import React, { useState } from 'react';
import {
  X,
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Database,
  Cloud,
  Layers,
  Calendar,
  Wrench,
  Leaf,
  ExternalLink,
} from 'lucide-react';
import {
  signInWithGoogle,
  signOutUser,
  AppUser,
  fetchUserDiagnoses,
  fetchUserRepairBookings,
} from '../services/firebase';
import { DiagnosisResultData, RepairRequest } from '../types';

interface AuthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  onUserChanged: (user: AppUser | null) => void;
  onLoadSavedDiagnosis?: (diag: DiagnosisResultData) => void;
}

export const AuthProfileModal: React.FC<AuthProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  onLoadSavedDiagnosis,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedDiagnoses, setSavedDiagnoses] = useState<DiagnosisResultData[]>([]);
  const [savedBookings, setSavedBookings] = useState<RepairRequest[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'diagnoses' | 'bookings'>('profile');
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load user data when tab switched
  React.useEffect(() => {
    if (currentUser?.uid && isOpen) {
      setIsLoadingData(true);
      Promise.all([
        fetchUserDiagnoses(currentUser.uid),
        fetchUserRepairBookings(currentUser.uid),
      ])
        .then(([diags, bookings]) => {
          setSavedDiagnoses(diags);
          setSavedBookings(bookings);
        })
        .finally(() => setIsLoadingData(false));
    }
  }, [currentUser?.uid, isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      onUserChanged(user);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      onUserChanged(null);
      setSavedDiagnoses([]);
      setSavedBookings([]);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white">
                RepairConnect Cloud Account
              </h3>
              <p className="text-[11px] text-slate-300">Firebase Firestore & Auth Sync</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud Status Banner */}
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Firestore Persistence Active</span>
          </div>
          <span className="text-[10px] uppercase font-black tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Encrypted
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-2xl">
              {error}
            </div>
          )}

          {currentUser ? (
            <div className="space-y-5">
              {/* User Card */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
                <img
                  src={
                    currentUser.photoURL ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`
                  }
                  alt={currentUser.displayName || 'User'}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900 truncate">
                      {currentUser.displayName || 'RepairConnect User'}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{currentUser.email}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">UID: {currentUser.uid.slice(0, 14)}...</p>
                </div>
              </div>

              {/* Subtabs for cloud data */}
              <div className="flex border-b border-slate-200 text-xs font-bold text-slate-600">
                <button
                  onClick={() => setActiveSubTab('profile')}
                  className={`pb-2.5 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                    activeSubTab === 'profile'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveSubTab('diagnoses')}
                  className={`pb-2.5 px-3 border-b-2 font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeSubTab === 'diagnoses'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <span>Saved Diagnoses</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-[10px]">
                    {savedDiagnoses.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveSubTab('bookings')}
                  className={`pb-2.5 px-3 border-b-2 font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeSubTab === 'bookings'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <span>Bookings</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-[10px]">
                    {savedBookings.length}
                  </span>
                </button>
              </div>

              {/* Overview Subtab */}
              {activeSubTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Diagnoses Run
                      </div>
                      <div className="text-xl font-black text-slate-900 mt-1">
                        {savedDiagnoses.length}
                      </div>
                    </div>
                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Repair Bookings
                      </div>
                      <div className="text-xl font-black text-slate-900 mt-1">
                        {savedBookings.length}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span>Cloud Impact Footprint</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                      All your item diagnoses and bookings are automatically backed up to Google Cloud Firestore and synced in real-time.
                    </p>
                  </div>
                </div>
              )}

              {/* Saved Diagnoses Subtab */}
              {activeSubTab === 'diagnoses' && (
                <div className="space-y-3">
                  {savedDiagnoses.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      No saved diagnoses yet. Run a diagnosis to auto-save to cloud!
                    </div>
                  ) : (
                    savedDiagnoses.map((diag) => (
                      <div
                        key={diag.id}
                        className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-extrabold text-xs text-slate-900">{diag.itemName}</h5>
                          <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                            {diag.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">{diag.possibleProblem}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          <span className="font-bold text-emerald-600">
                            Verdict: {diag.repairWorthiness?.verdictTitle || 'REPAIR'}
                          </span>
                          {onLoadSavedDiagnosis && (
                            <button
                              onClick={() => {
                                onLoadSavedDiagnosis(diag);
                                onClose();
                              }}
                              className="text-blue-600 hover:underline font-bold"
                            >
                              Load Result →
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Bookings Subtab */}
              {activeSubTab === 'bookings' && (
                <div className="space-y-3">
                  {savedBookings.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      No active bookings saved yet.
                    </div>
                  ) : (
                    savedBookings.map((b) => (
                      <div
                        key={b.id}
                        className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-extrabold text-xs text-slate-900">{b.itemName}</h5>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">Technician: {b.professionalName}</p>
                        <p className="text-[11px] text-slate-400">Date: {b.preferredDate} • {b.preferredTimeSlot}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <User className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-slate-900">
                  Sync Your Diagnosis & Repair History
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  Sign in with your Google account to save multi-item diagnostics, track repairs across devices, and calculate your lifetime e-waste diverted.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm border border-slate-300 shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer hover:shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isLoading ? 'Signing in...' : 'Continue with Google Account'}</span>
              </button>

              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure Firebase Auth
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-blue-600" /> Firestore Cloud Sync
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
