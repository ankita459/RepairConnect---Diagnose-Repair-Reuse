import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  Wrench,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Phone,
  Mail,
  Award,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  Scale,
  Navigation,
  ExternalLink,
  LocateFixed,
  Building2,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { REPAIR_PROFESSIONALS, CATEGORIES } from '../data/mockData';
import { ItemCategory, RepairProfessional } from '../types';
import { LeafletMap } from './LeafletMap';

interface ProfessionalsDirectoryProps {
  initialCategory?: ItemCategory | null;
  onBookRepair: (pro: RepairProfessional) => void;
  onOpenCompare: (selectedPros: RepairProfessional[]) => void;
}

// Preset cities
const PRESET_LOCATIONS: { name: string; lat: number; lng: number; region: string }[] = [
  { name: 'Mumbai (Andheri)', lat: 19.1136, lng: 72.8697, region: 'Maharashtra' },
  { name: 'Mumbai (Dadar/Central)', lat: 19.0178, lng: 72.8478, region: 'Maharashtra' },
  { name: 'Bengaluru (Koramangala)', lat: 12.9352, lng: 77.6245, region: 'Karnataka' },
  { name: 'New Delhi (Connaught Place)', lat: 28.6315, lng: 77.2167, region: 'Delhi NCR' },
  { name: 'Pune (Kothrud)', lat: 18.5074, lng: 73.8077, region: 'Maharashtra' },
  { name: 'Hyderabad (Hitec City)', lat: 17.4435, lng: 78.3772, region: 'Telangana' },
];

// Haversine formula to compute km distance
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const ProfessionalsDirectory: React.FC<ProfessionalsDirectoryProps> = ({
  initialCategory,
  onBookRepair,
  onOpenCompare,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [minRating, setMinRating] = useState<number>(4.5);
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [enableClustering, setEnableClustering] = useState<boolean>(true);
  const [clusterRadius, setClusterRadius] = useState<number>(60);
  const [selectedPro, setSelectedPro] = useState<RepairProfessional | null>(null);
  const [profileModalPro, setProfileModalPro] = useState<RepairProfessional | null>(null);

  // User Location State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string }>({
    lat: 19.076,
    lng: 72.8777,
    name: 'Mumbai Central / Bandra',
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('');

  // Maps Grounded Real Place Search Drawer
  const [isMapsSearchOpen, setIsMapsSearchOpen] = useState(false);
  const [mapsGroundingResults, setMapsGroundingResults] = useState<string | null>(null);
  const [isMapsGroundingLoading, setIsMapsGroundingLoading] = useState(false);

  // Comparison selection basket
  const [compareList, setCompareList] = useState<RepairProfessional[]>([
    REPAIR_PROFESSIONALS[0],
    REPAIR_PROFESSIONALS[1],
    REPAIR_PROFESSIONALS[4],
  ]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Acquiring precise GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({
          lat,
          lng,
          name: `Current Location (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`,
        });
        setIsLocating(false);
        setLocationStatus('Location updated successfully!');
        setTimeout(() => setLocationStatus(''), 3000);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        setLocationStatus('Location permission denied or unavailable. Using default city.');
        setTimeout(() => setLocationStatus(''), 4000);
      },
      { timeout: 8000 }
    );
  };

  const handleSelectPresetLocation = (preset: (typeof PRESET_LOCATIONS)[0]) => {
    setUserLocation({
      lat: preset.lat,
      lng: preset.lng,
      name: `${preset.name}, ${preset.region}`,
    });
  };

  const handleGoogleMapsGroundingSearch = async () => {
    setIsMapsGroundingLoading(true);
    try {
      const res = await fetch('/api/maps-search-pros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery || `${selectedCategory} repair services`,
          location: userLocation.name,
          category: selectedCategory !== 'all' ? selectedCategory : 'appliance, electronic, bicycle & general repair',
        }),
      });
      const data = await res.json();
      setMapsGroundingResults(data.overview || 'No live ground places data returned. Displaying local verified catalog.');
    } catch (e) {
      setMapsGroundingResults('Google Maps search is ready. Connect your Google Maps API key for extended live places lookup.');
    } finally {
      setIsMapsGroundingLoading(false);
    }
  };

  const toggleCompare = (pro: RepairProfessional) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === pro.id);
      if (exists) {
        return prev.filter((p) => p.id !== pro.id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 technicians simultaneously.');
          return prev;
        }
        return [...prev, pro];
      }
    });
  };

  // Recalculate distance and adjust mock coords if user location changes
  const computedPros = useMemo(() => {
    return REPAIR_PROFESSIONALS.map((pro, idx) => {
      // Calculate realistic distance offset
      const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, pro.lat, pro.lng);
      return {
        ...pro,
        distanceKm: dist < 0.2 ? Math.round((dist + 0.8 + idx * 0.4) * 10) / 10 : dist,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userLocation.lat, userLocation.lng]);

  const filteredPros = computedPros.filter((pro) => {
    if (selectedCategory !== 'all') {
      const match =
        pro.categories.includes(selectedCategory as ItemCategory) ||
        (selectedCategory === 'home_appliances' && pro.categories.includes('kitchen_appliances')) ||
        (selectedCategory === 'kitchen_appliances' && pro.categories.includes('home_appliances'));
      if (!match) return false;
    }
    if (pro.distanceKm > maxDistance) {
      return false;
    }
    if (pro.rating < minRating) {
      return false;
    }
    if (availableTodayOnly && pro.availability !== 'Today') {
      return false;
    }
    if (
      searchQuery.trim() &&
      !pro.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !pro.businessName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !pro.servicesOffered.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !pro.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Google Maps Grounded Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Find Nearby Repair Professionals
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Discover local technicians, view approximate distances on Google Maps, get instant directions, and compare quotes.
          </p>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {compareList.length > 0 && (
            <button
              onClick={() => onOpenCompare(compareList)}
              className="px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              <span>Compare ({compareList.length})</span>
            </button>
          )}

          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'split' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map & List
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List Only
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'map' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map Full
            </button>
          </div>
        </div>
      </div>

      {/* Location Selector Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-4 rounded-3xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-700">Reference Location:</div>
              <div className="text-xs font-black text-slate-900">{userLocation.name}</div>
            </div>
          </div>

          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use My Current Location'}</span>
          </button>
        </div>

        {/* Preset City Quick Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 shrink-0">Preset Cities:</span>
          {PRESET_LOCATIONS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPresetLocation(preset)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors border ${
                userLocation.name.includes(preset.name)
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {preset.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {locationStatus && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Category Pills & Search Filter */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Categories ({REPAIR_PROFESSIONALS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search technician, shop, or specialty..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Max Distance Slider */}
          <div className="flex flex-col justify-center px-1 space-y-1.5 sm:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span>Search Radius:</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black border border-blue-200">
                {maxDistance} km
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
              title={`Drag to adjust Google Maps search radius (1 - 50 km). Currently: ${maxDistance} km`}
            />

            {/* Quick Radius Presets */}
            <div className="flex items-center justify-between gap-1 pt-0.5">
              {[3, 5, 10, 15, 25, 50].map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setMaxDistance(dist)}
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    maxDistance === dist
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dist}k
                </button>
              ))}
            </div>
          </div>

          {/* Min Rating */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Rating:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white cursor-pointer"
            >
              <option value={4.0}>★ 4.0 & above</option>
              <option value={4.5}>★ 4.5 & above (Top Rated)</option>
              <option value={4.8}>★ 4.8 & above (Elite Master)</option>
            </select>
          </div>

          {/* Available Today Checkbox & Cluster Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availableTodayOnly}
                onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
              <span>Available Today</span>
            </label>

            <button
              type="button"
              onClick={() => setEnableClustering((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer shadow-xs ${
                enableClustering
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Google Maps marker clustering to group nearby repair providers when zoomed out"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>{enableClustering ? 'Clustering: ON' : 'Clustering: OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map & List Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === 'split'
            ? 'grid-cols-1 lg:grid-cols-12'
            : viewMode === 'map'
            ? 'grid-cols-1'
            : 'grid-cols-1'
        }`}
      >
        {/* Map View */}
        {viewMode !== 'list' && (
          <div className={viewMode === 'split' ? 'lg:col-span-6 xl:col-span-7 h-[540px]' : 'h-[620px]'}>
            <LeafletMap
              professionals={filteredPros}
              selectedProId={selectedPro?.id}
              onSelectPro={(pro) => setSelectedPro(pro)}
              onOpenProfile={(pro) => setProfileModalPro(pro)}
              center={[userLocation.lat, userLocation.lng]}
              userLocationName={userLocation.name}
              enableClustering={enableClustering}
              clusterRadius={clusterRadius}
              radiusKm={maxDistance}
            />
          </div>
        )}

        {/* List View */}
        {viewMode !== 'map' && (
          <div
            className={`space-y-4 ${
              viewMode === 'split' ? 'lg:col-span-6 xl:col-span-5 h-[540px] overflow-y-auto pr-1' : ''
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>
                {filteredPros.length} Professional{filteredPros.length === 1 ? '' : 's'} within {maxDistance} km
              </span>
              <span className="text-emerald-700 font-semibold">Live Proximity Active</span>
            </div>

            {filteredPros.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-extrabold text-slate-900">No technicians found in this radius</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try expanding your search distance slider or selecting 'All Categories'.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMaxDistance(25);
                    setMinRating(4.0);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  Reset Search Filters
                </button>
              </div>
            ) : (
              filteredPros.map((pro) => {
                const isCompared = compareList.some((p) => p.id === pro.id);
                const isSelected = selectedPro?.id === pro.id;
                const googleMapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${pro.lat},${pro.lng}`;

                return (
                  <div
                    key={pro.id}
                    onClick={() => setSelectedPro(pro)}
                    className={`bg-white rounded-3xl border p-5 transition-all cursor-pointer space-y-4 ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={pro.avatarUrl}
                        alt={pro.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                            {pro.businessName}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                              pro.availability === 'Today'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {pro.availability}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-medium truncate">{pro.name} • {pro.yearsExperience} yrs experience</p>

                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
                          <span className="flex items-center gap-1 font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{pro.rating}</span>
                            <span className="text-slate-400 font-normal">({pro.reviewCount})</span>
                          </span>

                          <span className="flex items-center gap-1 font-bold text-blue-600">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{pro.distanceKm} km away</span>
                          </span>

                          <span className="font-extrabold text-emerald-600">
                            Est: ₹{pro.estimatedPriceRange.min} – ₹{pro.estimatedPriceRange.max}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {pro.servicesOffered.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    {/* Action Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompare(pro);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                            isCompared
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Scale className="w-3 h-3" />
                          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                        </button>

                        <a
                          href={googleMapsDirUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3 text-blue-600" />
                          <span>Directions</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileModalPro(pro);
                          }}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          Details
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookRepair(pro);
                          }}
                          className="px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                        >
                          Book Repair
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Professional Full Profile Modal */}
      {profileModalPro && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={profileModalPro.avatarUrl}
                  alt={profileModalPro.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm"
                />
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                    {profileModalPro.businessName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Owner: {profileModalPro.name} • {profileModalPro.yearsExperience} years experience
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{profileModalPro.rating}</span>
                      <span className="text-slate-400">({profileModalPro.reviewCount} reviews)</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-blue-600">
                      {profileModalPro.distanceKm} km from {userLocation.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setProfileModalPro(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {profileModalPro.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>{badge}</span>
                </span>
              ))}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{profileModalPro.warrantyDays}-Day Repair Guarantee</span>
              </span>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technician Bio & Standards</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {profileModalPro.bio}
              </p>
            </div>

            {/* Services Offered */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Services & Repairs Offered</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profileModalPro.servicesOffered.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2"
                  >
                    <Wrench className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Map Directions */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>Workshop Address:</strong> {profileModalPro.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Phone:</strong> {profileModalPro.phone}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${profileModalPro.lat},${profileModalPro.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>Open in Google Maps</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleCompare(profileModalPro);
                    setProfileModalPro(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Add to Compare
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const pro = profileModalPro;
                    setProfileModalPro(null);
                    onBookRepair(pro);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
