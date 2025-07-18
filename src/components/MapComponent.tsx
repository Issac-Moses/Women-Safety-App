import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';


const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  latitude: number;
  longitude: number;
  darkMode?: boolean;
  className?: string;
}

const MapComponent = ({ latitude, longitude, darkMode = false, className = '' }: MapProps) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (map && isClient) {
      map.setView([latitude, longitude], map.getZoom());
    }
  }, [latitude, longitude, map, isClient]);

  if (!isClient || !latitude || !longitude) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        <TileLayer
          url={darkMode ? 
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
          attribution={
            darkMode 
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
        />
        <Marker position={[latitude, longitude]}>
          <Popup>Your Current Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;