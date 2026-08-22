import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { RepairProfessional } from '../types';
import { Layers, Sparkles, Navigation, ExternalLink, Star, Phone } from 'lucide-react';

// Marker styles for individual repair pros
const createProIcon = (category: string) => {
  let color = '#2563eb'; // blue
  if (category === 'home_appliances' || category === 'kitchen_appliances') color = '#0284c7';
  if (category === 'electronics') color = '#7c3aed';
  if (category === 'bicycles') color = '#059669';
  if (category === 'furniture') color = '#d97706';
  if (category === 'mobile_phones' || category === 'computers_laptops') color = '#4f46e5';
  if (category === 'electrician') color = '#eab308';
  if (category === 'plumber') color = '#06b6d4';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.35); font-weight: bold; font-size: 14px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

const userIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `<div style="background-color: #10b981; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3.5px solid white; box-shadow: 0 4px 14px rgba(16,185,129,0.6); position: relative;">
    <span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: #10b981; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
  </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -22],
});

// Custom Cluster Icon Generator
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let size = 42;
  let bgGradient = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
  let borderColor = '#93c5fd';

  if (count >= 10) {
    size = 52;
    bgGradient = 'linear-gradient(135deg, #7c3aed, #4338ca)';
    borderColor = '#c4b5fd';
  } else if (count >= 5) {
    size = 46;
    bgGradient = 'linear-gradient(135deg, #0284c7, #0369a1)';
    borderColor = '#7dd3fc';
  }

  return L.divIcon({
    html: `<div style="
      background: ${bgGradient};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      border: 3px solid ${borderColor};
      box-shadow: 0 6px 18px rgba(37, 99, 235, 0.45);
      cursor: pointer;
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    " onmouseover="this.style.transform='scale(1.18)'" onmouseout="this.style.transform='scale(1)'">
      <span style="font-size: 14px; font-weight: 900; line-height: 1;">${count}</span>
      <span style="font-size: 8px; font-weight: 700; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1; margin-top: 1px;">Pros</span>
    </div>`,
    className: 'custom-cluster-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

interface LeafletMapProps {
  professionals: RepairProfessional[];
  selectedProId?: string | null;
  onSelectPro: (pro: RepairProfessional) => void;
  onOpenProfile?: (pro: RepairProfessional) => void;
  center?: [number, number];
  userLocationName?: string;
  enableClustering?: boolean;
  clusterRadius?: number;
  radiusKm?: number;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  professionals,
  selectedProId,
  onSelectPro,
  onOpenProfile,
  center = [19.076, 72.8777],
  userLocationName = 'Your Location',
  enableClustering = true,
  clusterRadius = 60,
  radiusKm,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const mapCenter: L.LatLngTuple = [center[0], center[1]];
      const map = L.map(mapContainerRef.current, {
        center: mapCenter,
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> • Google Maps Route Integrated',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Update user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    const userLoc: L.LatLngTuple = [center[0], center[1]];
    userMarkerRef.current = L.marker(userLoc, { icon: userIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; font-weight: bold; text-align: center; padding: 4px;">
          📍 ${userLocationName}<br/>
          <span style="font-weight: normal; font-size: 10px; color: #64748b;">(Reference Location for Proximity)</span>
        </div>`
      );

    // Update dynamic Radius Circle
    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
      radiusCircleRef.current = null;
    }

    if (radiusKm && radiusKm > 0) {
      const radiusMeters = radiusKm * 1000;
      const circle = L.circle(userLoc, {
        radius: radiusMeters,
        color: '#2563eb',
        weight: 1.5,
        dashArray: '6, 6',
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
      }).addTo(map);

      circle.bindTooltip(`Search Radius: ${radiusKm} km`, {
        permanent: false,
        direction: 'top',
        className: 'radius-tooltip',
      });

      radiusCircleRef.current = circle;

      // Fit map viewport to show the entire selected radius
      map.fitBounds(circle.getBounds(), {
        padding: [30, 30],
        maxZoom: 15,
        animate: true,
      });
    } else {
      // Pan map to new center if no radius
      map.setView(userLoc, map.getZoom() || 13, { animate: true });
    }

    // Clean up existing cluster group or individual markers
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
      clusterGroupRef.current = null;
    }

    const currentMarkers = markersRef.current;
    Object.keys(currentMarkers).forEach((key) => {
      const m = currentMarkers[key];
      if (m) m.remove();
    });
    markersRef.current = {};

    let clusterGroup: any = null;
    if (enableClustering && (L as any).markerClusterGroup) {
      clusterGroup = (L as any).markerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true,
        removeOutsideVisibleBounds: true,
        maxClusterRadius: clusterRadius,
        iconCreateFunction: createClusterCustomIcon,
        spiderLegPolylineOptions: { weight: 1.5, color: '#3b82f6', opacity: 0.7 },
      });
    }

    // Add pro markers
    professionals.forEach((pro) => {
      const proLoc: L.LatLngTuple = [pro.lat, pro.lng];
      const icon = createProIcon(pro.categories[0] || 'other');
      const marker = L.marker(proLoc, { icon });

      const googleMapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${pro.lat},${pro.lng}`;

      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 6px; min-width: 220px;">
          <div style="font-weight: 800; font-size: 14px; color: #0f172a; line-height: 1.2;">${pro.businessName}</div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
            <span style="font-size: 12px; color: #2563eb; font-weight: 700;">★ ${pro.rating} (${pro.reviewCount} reviews)</span>
            <span style="font-size: 11px; background-color: #dbeafe; color: #1e40af; padding: 1px 6px; border-radius: 9999px; font-weight: 700;">${pro.availability}</span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">
            📍 <strong>${pro.distanceKm} km away</strong> • ${pro.address}
          </div>
          <div style="font-size: 12px; font-weight: 800; color: #059669; margin-top: 4px;">
            Est: ₹${pro.estimatedPriceRange.min} – ₹${pro.estimatedPriceRange.max}
          </div>
          <div style="display: flex; gap: 6px; margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <a href="${googleMapsDirUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 4px; background-color: #2563eb; color: white; text-decoration: none; padding: 5px 8px; border-radius: 8px; font-size: 11px; font-weight: 700;">
              Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        onSelectPro(pro);
      });

      markersRef.current[pro.id] = marker;

      if (clusterGroup) {
        clusterGroup.addLayer(marker);
      } else {
        marker.addTo(map);
      }
    });

    if (clusterGroup) {
      map.addLayer(clusterGroup);
      clusterGroupRef.current = clusterGroup;
    }

    // Invalidate map size to ensure full container rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [professionals, center[0], center[1], userLocationName, enableClustering, clusterRadius, radiusKm]);

  // Pan to selected pro and zoom if clustered
  useEffect(() => {
    if (selectedProId && markersRef.current[selectedProId] && mapInstanceRef.current) {
      const marker = markersRef.current[selectedProId];
      if (clusterGroupRef.current) {
        clusterGroupRef.current.zoomToShowLayer(marker, () => {
          marker.openPopup();
        });
      } else {
        mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true });
        marker.openPopup();
      }
    }
  }, [selectedProId]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-10" />

      {/* Map Header Status Badge */}
      <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 shadow-md flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Google Maps Grounded</span>
        {radiusKm && (
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black">
            Radius: {radiusKm} km
          </span>
        )}
        {enableClustering && (
          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-2.5 h-2.5" />
            Clustered
          </span>
        )}
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600 shadow-sm hidden sm:flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>You</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span>Nearby Pros ({professionals.length})</span>
        </div>
        {radiusKm && (
          <div className="flex items-center gap-1 text-blue-600">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-blue-600 bg-blue-100" />
            <span>{radiusKm}km Zone</span>
          </div>
        )}
        {enableClustering && (
          <div className="flex items-center gap-1 text-indigo-700">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[8px] flex items-center justify-center font-black">N</span>
            <span>Cluster</span>
          </div>
        )}
        <div className="text-slate-400">| Click pin/cluster to explore</div>
      </div>
    </div>
  );
};

