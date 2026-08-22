import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DiagnosisWorkspace } from './components/DiagnosisWorkspace';
import { DiagnosisResult } from './components/DiagnosisResult';
import { RepairWorthiness } from './components/RepairWorthiness';
import { ActionOptions } from './components/ActionOptions';
import { ProfessionalsDirectory } from './components/ProfessionalsDirectory';
import { CompareProfessionalsModal } from './components/CompareProfessionalsModal';
import { SparePartsDirectory } from './components/SparePartsDirectory';
import { DiyRepairLibrary } from './components/DiyRepairLibrary';
import { BookRepairModal } from './components/BookRepairModal';
import { RepairTracker } from './components/RepairTracker';
import { SustainabilityDashboard } from './components/SustainabilityDashboard';
import { UserDashboard } from './components/UserDashboard';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { RepairConnectAIAssistant } from './components/RepairConnectAIAssistant';
import { SafetyModal } from './components/SafetyModal';
import { AuthProfileModal } from './components/AuthProfileModal';
import { Footer } from './components/Footer';

import {
  DEMO_PRESETS,
  INITIAL_REPAIR_REQUESTS,
  INITIAL_SUSTAINABILITY_STATS,
  REPAIR_PROFESSIONALS,
} from './data/mockData';
import {
  ActiveTab,
  DiagnosisResultData,
  ItemCategory,
  RepairProfessional,
  RepairRequest,
  RepairStatus,
  UserRole,
} from './types';
import {
  onAuthStateChangedListener,
  AppUser,
  saveDiagnosisToFirestore,
  saveRepairBookingToFirestore,
} from './services/firebase';
import { Bot, MessageSquareQuote, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [userRole, setUserRole] = useState<UserRole>('customer');

  // Firebase User Auth State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Diagnosis State
  const [currentDiagnosis, setCurrentDiagnosis] = useState<DiagnosisResultData>(DEMO_PRESETS[0]);
  const [recentDiagnoses, setRecentDiagnoses] = useState<DiagnosisResultData[]>(DEMO_PRESETS);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ItemCategory | null>(null);

  // Repairs State
  const [repairs, setRepairs] = useState<RepairRequest[]>(INITIAL_REPAIR_REQUESTS);
  const [sustainabilityStats, setSustainabilityStats] = useState(INITIAL_SUSTAINABILITY_STATS);

  // Modals & Assistant State
  const [bookingPro, setBookingPro] = useState<RepairProfessional | null>(null);
  const [comparePros, setComparePros] = useState<RepairProfessional[] | null>(null);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Setup Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleStartDiagnosis = () => {
    setActiveTab('diagnose');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPreset = (preset: DiagnosisResultData) => {
    setCurrentDiagnosis(preset);
    setActiveTab('diagnosis_result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectUpload = (file: File) => {
    setDroppedFile(file);
    setActiveTab('diagnose');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHero = (category: ItemCategory) => {
    setSelectedCategoryFilter(category);
    setActiveTab('find_repairs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDiagnosisComplete = async (result: DiagnosisResultData) => {
    setCurrentDiagnosis(result);
    setRecentDiagnoses((prev) => [result, ...prev.filter((d) => d.id !== result.id)]);
    setActiveTab('diagnosis_result');
    triggerToast('Diagnosis successfully analyzed & saved!');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Cloud persistence
    try {
      await saveDiagnosisToFirestore(result, currentUser?.uid);
    } catch (e) {
      console.warn('Diagnosis cloud sync deferred:', e);
    }
  };

  const handleBookingConfirmed = async (newBooking: RepairRequest) => {
    setRepairs((prev) => [newBooking, ...prev]);
    setBookingPro(null);
    setActiveTab('my_repairs');
    triggerToast(`Repair ticket ${newBooking.trackingNumber} confirmed!`);

    // Cloud persistence
    try {
      await saveRepairBookingToFirestore(newBooking, currentUser?.uid);
    } catch (e) {
      console.warn('Booking cloud sync deferred:', e);
    }
  };

  const handleUpdateRepairStatus = (repairId: string, nextStatus: RepairStatus) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          const updatedTimeline = r.timeline.map((step) => {
            if (step.status === nextStatus) {
              return {
                ...step,
                completed: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
            }
            return step;
          });
          return {
            ...r,
            status: nextStatus,
            timeline: updatedTimeline,
          };
        }
        return r;
      })
    );

    // If marked reused, update sustainability impact
    if (nextStatus === 'reused') {
      setSustainabilityStats((prev) => ({
        ...prev,
        totalItemsRepaired: prev.totalItemsRepaired + 1,
        totalEwastePreventedKg: prev.totalEwastePreventedKg + 12,
        totalCo2AvoidedKg: prev.totalCo2AvoidedKg + 35,
        totalMoneySavedInr: prev.totalMoneySavedInr + 14000,
      }));
      triggerToast('Item marked reused! Sustainability footprint updated 🎉');
    } else {
      triggerToast(`Milestone updated to ${nextStatus.replace('_', ' ')}`);
    }
  };

  const activeRepairsCount = repairs.filter(
    (r) => r.status !== 'reused' && r.status !== 'closed'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenAdvisor={() => setShowAssistantModal(true)}
        onOpenSafety={() => setShowSafetyModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        currentUser={currentUser}
        activeRepairsCount={activeRepairsCount}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HeroSection
            onStartDiagnosis={handleStartDiagnosis}
            onSelectPreset={handleSelectPreset}
            onExplorePros={() => {
              setActiveTab('find_repairs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCategory={handleSelectCategoryFromHero}
            onDirectUpload={handleDirectUpload}
          />
        )}

        {activeTab === 'diagnose' && (
          <DiagnosisWorkspace
            initialFile={droppedFile}
            onDiagnosisComplete={handleDiagnosisComplete}
            prefillCategory={selectedCategoryFilter || undefined}
          />
        )}

        {activeTab === 'diagnosis_result' && currentDiagnosis && (
          <div className="space-y-4">
            <DiagnosisResult
              diagnosis={currentDiagnosis}
              onExplorePros={() => {
                setActiveTab('find_repairs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreParts={() => {
                setActiveTab('spare_parts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onJumpToWorthiness={() => {
                setActiveTab('worthiness');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNewDiagnosis={() => {
                setActiveTab('diagnose');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAdvisor={() => setShowAssistantModal(true)}
            />

            {/* In-place Action Options & Worthiness Preview */}
            <ActionOptions
              diagnosis={currentDiagnosis}
              onSelectTroubleshooting={() => {
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              onSelectProfessionals={() => {
                setActiveTab('find_repairs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectSpareParts={() => {
                setActiveTab('spare_parts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <RepairWorthiness
              diagnosis={currentDiagnosis}
              onSelectAction={(action) => {
                if (action === 'recycle') {
                  setActiveTab('sustainability');
                } else {
                  setActiveTab('find_repairs');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExplorePros={() => {
                setActiveTab('find_repairs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreParts={() => {
                setActiveTab('spare_parts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'worthiness' && currentDiagnosis && (
          <RepairWorthiness
            diagnosis={currentDiagnosis}
            onSelectAction={(action) => {
              if (action === 'recycle') {
                setActiveTab('sustainability');
              } else {
                setActiveTab('find_repairs');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExplorePros={() => {
              setActiveTab('find_repairs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreParts={() => {
              setActiveTab('spare_parts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'find_repairs' && (
          <ProfessionalsDirectory
            initialCategory={selectedCategoryFilter}
            onBookRepair={(pro) => setBookingPro(pro)}
            onOpenCompare={(pros) => setComparePros(pros)}
          />
        )}

        {activeTab === 'spare_parts' && (
          <SparePartsDirectory
            initialCategory={selectedCategoryFilter}
            onPartOrdered={(part) => triggerToast(`Order placed for ${part.name}!`)}
          />
        )}

        {activeTab === 'diy_library' && (
          <DiyRepairLibrary
            initialCategory={selectedCategoryFilter}
            onNavigateToParts={(category) => {
              if (category) setSelectedCategoryFilter(category);
              setActiveTab('spare_parts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToPros={(category) => {
              if (category) setSelectedCategoryFilter(category);
              setActiveTab('find_repairs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartDiagnosis={() => {
              setActiveTab('diagnose');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'my_repairs' && (
          <RepairTracker
            repairs={repairs}
            onUpdateRepairStatus={handleUpdateRepairStatus}
            onNewDiagnosis={() => {
              setActiveTab('diagnose');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'sustainability' && (
          <SustainabilityDashboard
            stats={sustainabilityStats}
            onDiagnoseNewItem={() => {
              setActiveTab('diagnose');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'user_dashboard' && (
          <UserDashboard
            recentDiagnoses={recentDiagnoses}
            repairs={repairs}
            stats={sustainabilityStats}
            onSelectDiagnosis={(diag) => {
              setCurrentDiagnosis(diag);
              setActiveTab('diagnosis_result');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onTrackRepair={(repairId) => {
              setActiveTab('my_repairs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartNewDiagnosis={() => {
              setActiveTab('diagnose');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'pro_dashboard' && (
          <ProfessionalDashboard
            pro={REPAIR_PROFESSIONALS[0]}
            repairs={repairs}
            onUpdateRepairStatus={handleUpdateRepairStatus}
          />
        )}

        {activeTab === 'admin_dashboard' && (
          <AdminDashboard repairs={repairs} stats={sustainabilityStats} />
        )}
      </main>

      {/* Floating RepairConnect AI Assistant Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowAssistantModal((prev) => !prev)}
          title="Open RepairConnect AI Assistant"
          className="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-tr from-slate-950 via-blue-950 to-indigo-950 text-white rounded-full shadow-2xl border border-indigo-400/40 hover:scale-105 hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black tracking-tight leading-tight flex items-center gap-1.5">
              <span>AI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-300 font-medium">Ask repair & safety questions</div>
          </div>
        </button>
      </div>

      {/* Context-Aware RepairConnect AI Assistant Chat Modal */}
      <RepairConnectAIAssistant
        isOpen={showAssistantModal}
        onClose={() => setShowAssistantModal(false)}
        diagnosisContext={currentDiagnosis}
        onNavigate={(tab) => {
          setActiveTab(tab as ActiveTab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBookingModal={() => {
          setBookingPro(REPAIR_PROFESSIONALS[0]);
        }}
      />

      {/* Auth & Firestore Profile Modal */}
      <AuthProfileModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onUserChanged={(user) => {
          setCurrentUser(user);
          triggerToast(user ? `Welcome back, ${user.displayName || 'User'}!` : 'Signed out');
        }}
        onLoadSavedDiagnosis={(diag) => {
          setCurrentDiagnosis(diag);
          setActiveTab('diagnosis_result');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Booking Modal */}
      {bookingPro && (
        <BookRepairModal
          pro={bookingPro}
          diagnosis={currentDiagnosis}
          onClose={() => setBookingPro(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* Compare Modal */}
      {comparePros && (
        <CompareProfessionalsModal
          pros={comparePros}
          onClose={() => setComparePros(null)}
          onBookPro={(pro) => {
            setComparePros(null);
            setBookingPro(pro);
          }}
        />
      )}

      {/* Safety Modal */}
      {showSafetyModal && <SafetyModal onClose={() => setShowSafetyModal(false)} />}

      {/* Global Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSafety={() => setShowSafetyModal(true)}
      />
    </div>
  );
}
