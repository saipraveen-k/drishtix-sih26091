"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  lat?: number;
  lng?: number;
  locationName?: string;
}

export function MapComponent({ lat = 14.6819, lng = 77.4521, locationName = "Kudair, Anantapur" }: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-80 bg-slate-900 animate-pulse rounded-xl flex items-center justify-center text-slate-500 text-xs font-semibold">
        Loading Hyper-Local Map...
      </div>
    );
  }

  // Dynamic import Leaflet for client side rendering
  const { MapContainer, TileLayer, Marker, Popup, Circle } = require("react-leaflet");
  const L = require("leaflet");

  // Fix default marker icon issues in Next.js
  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-800 shadow-xl relative">
      <MapContainer
        center={[lat, lng]}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>
            <div className="text-slate-900 font-sans p-1">
              <strong className="text-sm block">{locationName}</strong>
              <span className="text-xs text-slate-600 block">User Target Entrepreneurship Location</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Verified Hyper-Local Hub</span>
            </div>
          </Popup>
        </Marker>

        {/* Local Market Catchment Radius */}
        <Circle
          center={[lat, lng]}
          radius={5000}
          pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.15 }}
        />

        {/* Nearby Micro-Business Clusters */}
        <Marker position={[lat + 0.02, lng + 0.01]} icon={customIcon}>
          <Popup>
            <div className="text-slate-900 text-xs">
              <strong>Grain & Millet Market</strong>
              <p>Demand Index: 85/100 | Distance: 3.2 km</p>
            </div>
          </Popup>
        </Marker>

        <Marker position={[lat - 0.015, lng - 0.02]} icon={customIcon}>
          <Popup>
            <div className="text-slate-900 text-xs">
              <strong>Cold Storage & Dairy Hub</strong>
              <p>Infra Score: 78/100 | Distance: 4.5 km</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-lg z-10 text-[11px] text-slate-300 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>User Location ({locationName})</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-500"></span>
          <span>5 km Primary Market Catchment</span>
        </div>
      </div>
    </div>
  );
}
