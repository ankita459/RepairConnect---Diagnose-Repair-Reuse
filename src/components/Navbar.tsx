import React from 'react';
import {
  Wrench,
  Leaf,
  Cpu,
  MapPin,
  Clock,
  Sparkles,
  Package,
  BarChart3,
  User,
  ShieldCheck,
  MessageSquareQuote,
  SlidersHorizontal,
  Cloud,
  BookOpen,
} from 'lucide-react';
import { ActiveTab, UserRole } from '../types';
import { AppUser } from '../services/firebase';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenAdvisor: () => void;
  onOpenSafety: () => void;
  onOpenAuth?: () => void;
  currentUser?: AppUser | null;
  activeRepairsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onOpenAdvisor,
  onOpenSafety,
  onOpenAuth,
  currentUser,
  activeRepairsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            id="nav-logo-btn"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group transition-transform hover:scale-[1.01]"
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
              <Wrench className="w-4 h-4 transition-transform group-hover:rotate-12" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900">RepairConnect</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Leaf className="w-2.5 h-2.5 mr-1 text-emerald-600" /> Reuse
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              id="nav-home-btn"
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            <button
              id="nav-diagnose-btn"
              onClick={() => setActiveTab('diagnose')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'diagnose'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Diagnose</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            </button>

            <button
              id="nav-find-repairs-btn"
              onClick={() => setActiveTab('find_repairs')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'find_repairs'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Find Pros</span>
            </button>

            <button
              id="nav-spare-parts-btn"
              onClick={() => setActiveTab('spare_parts')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'spare_parts'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-slate-400" />
              <span>Spare Parts</span>
            </button>

            <button
              id="nav-diy-library-btn"
              onClick={() => setActiveTab('diy_library')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'diy_library'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>DIY Guides</span>
            </button>

            <button
              id="nav-my-repairs-btn"
              onClick={() => setActiveTab('my_repairs')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'my_repairs'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Tracking</span>
              {activeRepairsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px] font-black">
                  {activeRepairsCount}
                </span>
              )}
            </button>

            <button
              id="nav-sustainability-btn"
              onClick={() => setActiveTab('sustainability')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'sustainability'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Impact</span>
            </button>
          </nav>

          {/* Right Action Tools & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Advisor Button */}
            <button
              id="nav-ai-advisor-btn"
              onClick={onOpenAdvisor}
              title="Open Live AI Repair Advisor"
              className="px-3 py-2 rounded-full text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Advisor</span>
            </button>

            {/* Safety & Responsible AI button */}
            <button
              id="nav-safety-btn"
              onClick={onOpenSafety}
              title="View Safety & Responsible AI Guidelines"
              className="px-3 py-2 rounded-full text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">Safety</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
              <button
                id="role-customer-btn"
                onClick={() => {
                  setUserRole('customer');
                  setActiveTab('user_dashboard');
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  userRole === 'customer' && activeTab === 'user_dashboard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="View Customer Portal"
              >
                Customer
              </button>

              <button
                id="role-pro-btn"
                onClick={() => {
                  setUserRole('professional');
                  setActiveTab('pro_dashboard');
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  userRole === 'professional' && activeTab === 'pro_dashboard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="View Technician Portal"
              >
                Pro
              </button>

              <button
                id="role-admin-btn"
                onClick={() => {
                  setUserRole('admin');
                  setActiveTab('admin_dashboard');
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  userRole === 'admin' && activeTab === 'admin_dashboard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="View Platform Admin"
              >
                Admin
              </button>
            </div>

            {/* Firebase User Auth Pill / Button */}
            {onOpenAuth && (
              <button
                id="nav-auth-profile-btn"
                onClick={onOpenAuth}
                title={currentUser ? `Logged in as ${currentUser.displayName || currentUser.email}` : 'Sign In with Google'}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-xs"
              >
                {currentUser ? (
                  <>
                    <img
                      src={
                        currentUser.photoURL ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`
                      }
                      alt="Avatar"
                      className="w-5 h-5 rounded-full object-cover border border-emerald-500"
                    />
                    <span className="max-w-[70px] truncate hidden sm:inline text-slate-900 font-extrabold">
                      {currentUser.displayName?.split(' ')[0] || 'User'}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Sign In</span>
                  </>
                )}
              </button>
            )}

            {/* Primary Action Button */}
            <button
              id="nav-quick-diagnose-cta"
              onClick={() => setActiveTab('diagnose')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Diagnose</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'home' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('diagnose')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'diagnose' ? 'bg-blue-600 text-white font-semibold' : 'bg-blue-50 text-blue-700'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>AI Diagnose</span>
          </button>
          <button
            onClick={() => setActiveTab('find_repairs')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'find_repairs' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Find Repairs
          </button>
          <button
            onClick={() => setActiveTab('spare_parts')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'spare_parts' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Spare Parts
          </button>
          <button
            onClick={() => setActiveTab('diy_library')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'diy_library' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>DIY Guides</span>
          </button>
          <button
            onClick={() => setActiveTab('my_repairs')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'my_repairs' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Tracking ({activeRepairsCount})
          </button>
          <button
            onClick={() => setActiveTab('sustainability')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'sustainability' ? 'bg-emerald-600 text-white font-semibold' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            Sustainability
          </button>
        </div>
      </div>
    </header>
  );
};
