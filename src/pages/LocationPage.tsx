import React, { useState, useEffect } from 'react';
import { MapPin, Share, Navigation, Clock, AlertCircle, RefreshCw, Copy, History } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import MapComponent from '../components/MapComponent';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

const LocationPage: React.FC = () => {
  const { location, error, loading, getCurrentLocation, startWatching, stopWatching } = useLocation();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [isWatching, setIsWatching] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);
  const [batteryWarning, setBatteryWarning] = useState('');

  useEffect(() => {
    if (location) {
      setLastUpdate(new Date());
      setLocationHistory(prev => [
        { ...location, timestamp: Date.now() },
        ...prev.slice(0, 4) 
      ]);
    }
  }, [location]);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        if (battery.level < 0.2) {
          setBatteryWarning('Low battery may affect GPS accuracy');
        }
      });
    }
  }, []);

  const handleStartWatching = () => {
    startWatching();
    setIsWatching(true);
  };

  const handleStopWatching = () => {
    stopWatching();
    setIsWatching(false);
  };

  const shareLocation = () => {
    if (location) {
      const locationUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
      const message = `My current location: ${locationUrl}\nShared at: ${new Date().toLocaleString()}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Current Location',
          text: message,
          url: locationUrl
        }).catch(() => {
          navigator.clipboard.writeText(message);
          alert('Location copied to clipboard!');
        });
      } else {
        navigator.clipboard.writeText(message);
        alert('Location copied to clipboard!');
      }
    }
  };

  const shareRoute = async () => {
    if (!location) return;
    
    try {
      const destination = prompt("Enter destination address:");
      if (!destination) return;
      
      const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Safety Route',
          text: `I'm going from my current location to ${destination}`,
          url: routeUrl
        });
      } else {
        await navigator.clipboard.writeText(routeUrl);
        alert('Route copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing route:', err);
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 10) return 'text-green-500';
    if (accuracy <= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      <div className="p-4">
        
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mb-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Location Services
            </h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isWatching ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {isWatching ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {batteryWarning && (
            <div className="flex items-center p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg mb-4">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{batteryWarning}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{error.message}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className={`flex items-center justify-center p-4 rounded-lg transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
              } text-white`}
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5" />
              )}
              <span className="ml-2">Get Location</span>
            </button>

            <button
              onClick={isWatching ? handleStopWatching : handleStartWatching}
              className={`flex items-center justify-center p-4 rounded-lg transition-all duration-200 ${
                isWatching
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white active:scale-95`}
            >
              <MapPin className="w-5 h-5" />
              <span className="ml-2">
                {isWatching ? 'Stop Tracking' : 'Start Tracking'}
              </span>
            </button>
          </div>

          {location && (
            <div className="space-y-4">
              
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4`}>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Live Location Map
                </h3>
                <div className="h-48 rounded-lg overflow-hidden mb-3">
                  <MapComponent 
                    latitude={location.latitude} 
                    longitude={location.longitude}
                    darkMode={isDark}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isWatching ? 'Live updating' : 'Last known location'}
                  </span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(`${location.latitude},${location.longitude}`)}
                    className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </button>
                </div>
              </div>

              
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4`}>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  GPS Accuracy
                </h3>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Precision
                    </span>
                    <span className={`text-sm font-medium ${getAccuracyColor(location.accuracy)}`}>
                      ±{location.accuracy.toFixed(0)} meters
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        location.accuracy < 20 ? 'bg-green-500' :
                        location.accuracy < 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, 500/location.accuracy)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {lastUpdate?.toLocaleTimeString()}
                    </span>
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {lastUpdate?.toLocaleDateString()}
                  </span>
                </div>
              </div>

              
              <button
                onClick={shareLocation}
                className="w-full flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Share className="w-5 h-5 mr-2" />
                Share Location
              </button>
              <button
                onClick={shareRoute}
                className="w-full flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Share My Route
              </button>
            </div>
          )}
        </div>

        
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <History className="inline mr-2" /> Location History
            </h3>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Last 5 locations
            </span>
          </div>
          <div className="space-y-3">
            {locationHistory.length > 0 ? (
              locationHistory.map((loc, index) => (
                <div key={index} className="flex items-start">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    index === 0 ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(loc.timestamp).toLocaleString()}
                      {index === 0 && <span className="ml-2 text-green-500">• Current</span>}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No location history available</p>
                <p className="text-sm">Get your location to start tracking</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;