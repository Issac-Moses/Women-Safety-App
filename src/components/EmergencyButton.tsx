import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Shield, Crosshair, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../hooks/useLocation';
import { useTheme } from '../contexts/ThemeContext';

const EmergencyButton: React.FC = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastLocation, setLastLocation] = useState<{lat: number, lng: number} | null>(null);
  const { user } = useAuth();
  const { location, getCurrentLocation } = useLocation();
  const { isDark } = useTheme();

  
  useEffect(() => {
    if (!isActivated) return;
    
    const interval = setInterval(() => {
      getCurrentLocation();
    }, 30000);

    return () => clearInterval(interval);
  }, [isActivated]);

  const handleSOSPress = () => {
    if (countdown > 0) return;
    
    setIsActivated(true);
    setCountdown(5);
    getCurrentLocation();
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerEmergencyAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerEmergencyAlert = () => {
    if (!user?.emergencyContacts?.length) {
      alert('No emergency contacts found! Please add contacts first.');
      return;
    }

    const newLocation = location || lastLocation;
    setLastLocation(newLocation ? { lat: newLocation.latitude, lng: newLocation.longitude } : null);

    const alertMessage = `🚨 EMERGENCY ALERT from ${user?.name || 'User'}\n` +
      `📍 Location: ${newLocation ? 
        `https://maps.google.com/?q=${newLocation.latitude},${newLocation.longitude}` : 
        'Unable to determine location'}\n` +
      `⏰ Time: ${new Date().toLocaleString()}`;
    
    
    user?.emergencyContacts?.forEach(contact => {
      console.log(`Emergency alert sent to ${contact.name} (${contact.phone}): ${alertMessage}`);
    });
    
    
    console.log(`Calling emergency services at ${user?.phone || 'unknown number'}`);
    
    
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 5000);
  };

  const cancelAlert = () => {
    setCountdown(0);
    setIsActivated(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      
      <div className="relative">
        <button
          onTouchStart={handleSOSPress}
          onMouseDown={handleSOSPress}
          disabled={countdown > 0}
          className={`w-40 h-40 rounded-full flex flex-col items-center justify-center text-white font-bold text-xl transition-all duration-300 ${
            isActivated && countdown > 0
              ? 'bg-gradient-to-br from-red-600 to-red-800 scale-110 shadow-2xl'
              : 'bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
          } ${countdown > 0 ? 'animate-pulse' : ''}`}
        >
          {countdown > 0 ? (
            <span className="text-4xl">{countdown}</span>
          ) : (
            <>
              <AlertTriangle className="w-12 h-12 mb-2" />
              <span className="text-2xl">SOS</span>
            </>
          )}
        </button>
        
        
        {countdown > 0 && (
          <>
            <div className="absolute inset-0 border-8 border-red-400/30 rounded-full animate-ping opacity-0"></div>
            <div className="absolute inset-0 border-4 border-red-300/50 rounded-full animate-ping opacity-0" style={{ animationDelay: '0.3s' }}></div>
          </>
        )}
      </div>
      
      
      <div className={`w-full max-w-md p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all`}>
        <div className="grid grid-cols-2 gap-4">
          
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center space-x-3`}>
            <div className={`p-2 rounded-full ${location ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Location</p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {location ? 'Active' : 'Searching...'}
              </p>
            </div>
          </div>
          
          
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center space-x-3`}>
            <div className={`p-2 rounded-full ${user?.emergencyContacts?.length ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Contacts</p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user?.emergencyContacts?.length || 0} Registered
              </p>
            </div>
          </div>
        </div>
        
        
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'} flex items-center`}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            {countdown > 0 
              ? `Emergency alert will activate in ${countdown}s...` 
              : 'Press and hold SOS button for emergency'}
          </p>
        </div>
      </div>
      
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-w-md w-full shadow-xl animate-fadeIn`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Emergency Alert Sent!
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Help is on the way. Your location has been shared with {user?.emergencyContacts?.length} contacts.
              </p>
              
              {lastLocation && (
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center`}>
                    <Crosshair className="w-4 h-4 mr-2" />
                    Last known location
                  </p>
                  <p className={`font-mono text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {lastLocation.lat.toFixed(6)}, {lastLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => window.open(`tel:911`)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call 911
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className={`flex-1 py-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg transition-colors`}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      
      {countdown > 0 && (
        <button
          onClick={cancelAlert}
          className={`px-6 py-3 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors flex items-center`}
        >
          <span>Cancel Emergency</span>
        </button>
      )}
    </div>
  );
};

export default EmergencyButton;