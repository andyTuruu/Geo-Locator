import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet's default icon paths for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation) {
      return setError("Your browser does not support geolocation");
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}

export default function App() {
  const {
    isLoading,
    position: { lat, lng },
    error,
    getPosition,
  } = useGeolocation();

  function handleCopy() {
    if (lat && lng) {
      navigator.clipboard.writeText(`${lat}, ${lng}`);
      alert("Coordinates copied to clipboard!");
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Geo Locator</h1>
      </header>
      <main className="app-main">
        <div className="card">
          <button onClick={getPosition} disabled={isLoading}>
            {isLoading ? "Locating..." : "Find My Location"}
          </button>
          {error && <p className="error">{error}</p>}
          {!isLoading && !error && lat && lng && (
            <div className="location-info">
              <p>
                Coordinates:{" "}
                <span>
                  {lat.toFixed(5)}, {lng.toFixed(5)}
                </span>
              </p>
              <div className="action-buttons">
                <button onClick={handleCopy}>Copy</button>
                <a
                  href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in OSM
                </a>
              </div>
            </div>
          )}
        </div>
        {lat && lng && (
          <div className="map-container">
            <MapContainer
              center={[lat, lng]}
              zoom={14}
              scrollWheelZoom={false}
              style={{ height: "350px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>You are here!</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </main>
      <footer className="app-footer">
        <p>© 2025 Geo Locator.</p>
      </footer>
    </div>
  );
}
