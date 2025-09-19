import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Strict India geographic bounds (SW, NE)
const INDIA_BOUNDS = L.latLngBounds(
  L.latLng(6.4627, 68.1097),
  L.latLng(35.5133, 97.3956)
);

// Reasonable zoom limits focused on India
const MIN_ZOOM = 4;
const MAX_ZOOM = 12;

function ClickPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

export default function IndiaMap({ value, onChange, height = 280 }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitBounds(INDIA_BOUNDS, { padding: [16, 16] });
    }
  }, []);

  return (
    <div className="mapWrap" style={{ height }}>
      <MapContainer
        whenCreated={(m) => (mapRef.current = m)}
        bounds={INDIA_BOUNDS}
        maxBounds={INDIA_BOUNDS}          // hard clamp to India
        maxBoundsViscosity={1.0}          // no slipping outside
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        zoomSnap={0.25}
        scrollWheelZoom
        className="leafletMap"
      >
        <TileLayer
          // Standard OSM tiles but clamped to India via maxBounds + noWrap
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}                    // prevents world wrap
          bounds={INDIA_BOUNDS}            // hint to renderer
        />
        {value && <Marker position={value} icon={markerIcon} />}
        <ClickPicker onPick={onChange} />
      </MapContainer>

      <div className="mapFooter">
        <button
          type="button"
          className="btn secondary"
          onClick={() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition((pos) => {
              const latlng = [pos.coords.latitude, pos.coords.longitude];
              if (INDIA_BOUNDS.contains(latlng)) onChange(latlng);
              else alert("Location is outside India. Please pick on the map.");
            });
          }}
        >
          Use my location
        </button>
        {value && (
          <span className="coords">
            {value[0].toFixed(5)}, {value[1].toFixed(5)}
          </span>
        )}
      </div>
    </div>
  );
}