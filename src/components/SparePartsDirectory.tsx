import React, { useState } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  AlertCircle,
  Truck,
  BookOpen,
  Video,
  Layers,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { SPARE_PARTS } from '../data/mockData';
import { ItemCategory, SparePart } from '../types';

interface SparePartsDirectoryProps {
  initialCategory?: ItemCategory | null;
  onPartOrdered?: (part: SparePart) => void;
}

export const SparePartsDirectory: React.FC<SparePartsDirectoryProps> = ({
  initialCategory,
  onPartOrdered,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [orderModalPart, setOrderModalPart] = useState<SparePart | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Green Meadows, Andheri East, Mumbai');

  const filteredParts = SPARE_PARTS.filter((part) => {
    if (selectedCategory !== 'all' && part.category !== selectedCategory) {
      return false;
    }
    if (inStockOnly && !part.inStock) {
      return false;
    }
    if (
      searchQuery.trim() &&
      !part.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !part.compatibleModels.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModalPart) return;
    setOrderSuccess(true);
    if (onPartOrdered) {
      onPartOrdered(orderModalPart);
    }
    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalPart(null);
    }, 2200);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">DIY Easy</span>;
      case 'Moderate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Moderate DIY</span>;
      case 'Advanced':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Advanced DIY</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Pro Preferred</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>OEM & Aftermarket Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Spare Parts & Repair Hardware
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Certified compatible parts, repair manuals, and instructional teardowns to keep items running.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search part name, model number..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
            >
              <option value="all">All Categories</option>
              <option value="home_appliances">Home Appliances</option>
              <option value="mobile_phones">Mobile Phones</option>
              <option value="computers_laptops">Computers & Laptops</option>
              <option value="bicycles">Bicycles</option>
              <option value="furniture">Furniture</option>
              <option value="kitchen_appliances">Kitchen Appliances</option>
              <option value="electronics">Electronics</option>
            </select>
          </div>

          <div className="flex items-center justify-between px-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>In-Stock Only (Fast Dispatch)</span>
            </label>
            <span className="text-xs font-bold text-slate-500">{filteredParts.length} Parts</span>
          </div>
        </div>
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.map((part) => (
          <div
            key={part.id}
            id={`part-card-${part.id}`}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Part Image */}
              <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-slate-100">
                <img
                  src={part.imageUrl}
                  alt={part.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      part.isOem
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    {part.isOem ? 'OEM Genuine' : 'Aftermarket'}
                  </span>
                  {getDifficultyBadge(part.difficultyToReplace)}
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                  {part.compatibilityScore}% Verified Match
                </div>
              </div>

              {/* Part Content */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{part.name}</h3>
                  <div className="text-lg font-black text-slate-900 font-mono mt-1">
                    ₹{part.price.toLocaleString()}
                  </div>
                </div>

                {/* Compatibility List */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Compatible Models:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {part.compatibleModels.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 font-mono"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Guides / Tutorials if available */}
                <div className="flex items-center gap-3 pt-2 text-xs text-blue-600 font-medium">
                  {part.guideUrl && (
                    <a
                      href="#manual"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Opening official step-by-step repair guide for ${part.name}`);
                      }}
                      className="flex items-center gap-1 hover:underline"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Repair Manual</span>
                    </a>
                  )}
                  {part.videoTutorialUrl && (
                    <a
                      href="#video"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Opening video installation teardown for ${part.name}`);
                      }}
                      className="flex items-center gap-1 hover:underline"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video Teardown</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-3">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>{part.estimatedDeliveryDays}</span>
              </div>

              <button
                type="button"
                id={`order-part-btn-${part.id}`}
                onClick={() => setOrderModalPart(part)}
                disabled={!part.inStock}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  part.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{part.inStock ? 'Order Part' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Part Modal */}
      {orderModalPart && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-5">
            {orderSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Order Confirmed!</h3>
                <p className="text-xs text-slate-500">
                  {orderModalPart.name} has been dispatched. Expected delivery in{' '}
                  {orderModalPart.estimatedDeliveryDays}.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-lg">Order Spare Part</h3>
                  <button
                    type="button"
                    onClick={() => setOrderModalPart(null)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <img
                    src={orderModalPart.imageUrl}
                    alt={orderModalPart.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{orderModalPart.name}</h4>
                    <div className="text-sm font-extrabold text-blue-600 font-mono">
                      ₹{orderModalPart.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Includes 1-Year Manufacturer Warranty & Free Return if incompatible.</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOrderModalPart(null)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Confirm Order (₹{orderModalPart.price})</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
