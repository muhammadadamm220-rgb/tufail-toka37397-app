"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const dealerLocations = [
  { id: 1, name: "Faisalabad Main Office", pos: [31.4504, 73.1350] as [number, number], phone: "(041) 8714167" },
  { id: 2, name: "Multan Center", pos: [30.1575, 71.5249] as [number, number], phone: "061-1234567" },
  { id: 3, name: "Lahore Hub", pos: [31.5204, 74.3587] as [number, number], phone: "042-7654321" },
  { id: 4, name: "Sargodha Store", pos: [32.0740, 72.6861] as [number, number], phone: "048-1122334" }
];

export default function DealerMap({ dealers = [] }: { dealers?: any[] }) {
  const mainOffice: [number, number] = [31.4504, 73.1350];

  return (
    <div className="w-full h-full">
      <MapContainer 
        center={[30.3753, 69.3451]} // Center of Pakistan
        zoom={6} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Main Office Marker */}
        <Marker position={mainOffice} icon={customIcon}>
          <Popup>
            <div className="p-2 text-center">
              <h3 className="font-bold text-primary">SETH M. TUFAIL</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Main Foundry & Office</p>
              <p className="text-sm mt-1">Samundri Road, Faisalabad</p>
              <a href="tel:0418714167" className="block mt-2 bg-black text-white py-1 rounded text-xs">Call Office</a>
            </div>
          </Popup>
        </Marker>

        {/* Dynamic Dealer Markers */}
        {dealers.map((dealer) => {
          if (!dealer.lat || !dealer.lng) return null;
          return (
            <Marker key={dealer.id} position={[dealer.lat, dealer.lng]} icon={customIcon}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-primary">{dealer.businessName || dealer.name}</h3>
                  <p className="text-xs font-bold text-secondary uppercase">{dealer.city || "Authorized Dealer"}</p>
                  <p className="text-sm mt-1">{dealer.phone}</p>
                  <a 
                    href={`tel:${dealer.phone}`} 
                    className="block mt-2 bg-primary text-white text-center py-1 rounded text-xs font-bold"
                  >
                    Call Dealer
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
