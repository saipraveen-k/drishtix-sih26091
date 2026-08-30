"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  type?: string;
}

export interface MapComponentProps {
  lat?: number;
  lng?: number;
  locationName?: string;
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
}

export default function MapComponent({
  lat = 14.6819,
  lng = 77.4521,
  locationName = "Kudair, Anantapur",
  center,
  zoom = 12,
  markers = []
}: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[350px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 text-xs font-semibold">
        Loading Hyper-Local Map...
      </div>
    );
  }

  const centerLat = center ? center[0] : lat;
  const centerLng = center ? center[1] : lng;

  const { MapContainer, TileLayer, Marker, Popup, Circle } = require("react-leaflet");
  const L = require("leaflet");

  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className="w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full z-0 min-h-[350px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Primary Target Location Marker */}
        <Marker position={[centerLat, centerLng]} icon={customIcon}>
          <Popup>
            <div className="text-slate-900 font-sans p-1">
              <strong className="text-sm block">{locationName}</strong>
              <span className="text-xs text-slate-600 block">User Target Entrepreneurship Location</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Verified Hyper-Local Hub</span>
            </div>
          </Popup>
        </Marker>

        {/* Catchment Radius */}
        <Circle
          center={[centerLat, centerLng]}
          radius={5000}
          pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.15 }}
        />

        {/* Additional Markers */}
        {markers.map((m, idx) => (
          <Marker key={idx} position={[m.lat, m.lng]} icon={customIcon}>
            <Popup>
              <div className="text-slate-900 text-xs">
                <strong>{m.title}</strong>
                {m.type && <p className="text-[10px] text-slate-500 uppercase">{m.type}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-2 rounded-xl z-10 text-[11px] text-slate-700 shadow-sm space-y-1">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span className="font-semibold">Target Location ({locationName})</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600/30 border border-blue-600"></span>
          <span>5 km Primary Market Catchment</span>
        </div>
      </div>
    </div>
  );
}
