import React from 'react';
import {
  Wrench,
  Leaf,
  ShieldCheck,
  Globe,
  Heart,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenSafety: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSafety }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Bold Ticker Strip */}
      <div className="bg-emerald-950 text-emerald-300 border-b border-emerald-900/60 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.15em]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white">Live Circular Ecosystem:</span>
            <span className="text-emerald-400">14,842 Items Reused</span>
            <span>•</span>
            <span className="text-emerald-400">42.6 Tons E-Waste Prevented</span>
            <span>•</span>
            <span className="text-emerald-400">₹3.82 Cr Saved</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-emerald-400">
            <Leaf className="w-3 h-3" />
            <span>Right to Repair Verified</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">RepairConnect</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Empowering consumers to diagnose, repair, and extend the life of products through AI computer vision,
              trusted local technicians, and circular economy tools.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 text-[10px] font-black uppercase tracking-wider">
              <Leaf className="w-3 h-3 text-emerald-400" />
              <span>Right to Repair Partner</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Platform Navigation</h3>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home & Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('diagnose')} className="hover:text-white transition-colors">
                  AI Diagnostic Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('find_repairs')} className="hover:text-white transition-colors">
                  Nearby Repair Professionals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('spare_parts')} className="hover:text-white transition-colors">
                  Spare Parts Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('diy_library')} className="hover:text-white transition-colors">
                  DIY Repair Library & Video Tutorials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sustainability')} className="hover:text-white transition-colors">
                  Sustainability Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Supported Products</h3>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>Home Appliances (Washers, Refrigerators)</li>
              <li>Smartphones & Mobile Devices</li>
              <li>Computers & Laptops</li>
              <li>Bicycles & Electric Bikes</li>
              <li>Solid Wood & Upholstered Furniture</li>
              <li>Kitchen Appliances (Microwaves, Blenders)</li>
            </ul>
          </div>

          {/* Col 4: Safety & Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Safety & Standards</h3>
            <p className="text-xs text-slate-400 font-medium">
              All AI advice is pre-screened for hazardous electrical and gas line conditions.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenSafety}
                className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors border border-slate-700 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Safety Guidelines</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} RepairConnect. All rights reserved. • Built for Sustainable Circular Living.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenSafety} className="hover:text-slate-300">
              Responsible AI Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('sustainability')} className="hover:text-slate-300">
              Carbon Math Methodology
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
