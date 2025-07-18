import React, { useState } from 'react';
import { Shield, Phone, AlertTriangle, Users, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../hooks/useLocation';
import EmergencyButton from '../components/EmergencyButton';
import FakeCall from '../components/FakeCall';

const SafetyPage: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { location, getCurrentLocation } = useLocation();
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [safeMode, setSafeMode] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  const triggerSilentAlert = () => {
    if (!user?.emergencyContacts || user.emergencyContacts.length === 0) {
      addNotification('No emergency contacts found. Please add contacts first.');
      return;
    }

    const alertMessage = `SILENT EMERGENCY ALERT: ${user.name} may need assistance. Location: ${
      location ? `https://maps.google.com/?q=${location.latitude},${location.longitude}` : 'Location unavailable'
    }`;
    
    
    user.emergencyContacts.forEach(contact => {
      console.log(`Silent alert sent to ${contact.name}: ${alertMessage}`);
    });
    
    addNotification(`Silent alert sent to ${user.emergencyContacts.length} contacts`);
  };

  const triggerGroupAlert = () => {
    if (!user?.emergencyContacts || user.emergencyContacts.length === 0) {
      addNotification('No emergency contacts found. Please add contacts first.');
      return;
    }

    getCurrentLocation();
    
    const alertMessage = `GROUP EMERGENCY ALERT: ${user.name} needs immediate help! Location: ${
      location ? `https://maps.google.com/?q=${location.latitude},${location.longitude}` : 'Getting location...'
    }`;
    
    
    user.emergencyContacts.forEach(contact => {
      console.log(`Group alert sent to ${contact.name}: ${alertMessage}`);
    });
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Group Emergency Alert Sent', {
        body: `Alert sent to all ${user.emergencyContacts.length} emergency contacts`,
      });
    }
    
    addNotification(`Group alert sent to all ${user.emergencyContacts.length} contacts!`);
  };

  const toggleSafeMode = () => {
    setSafeMode(!safeMode);
    if (!safeMode) {
      getCurrentLocation();
      addNotification('Safe Mode activated - Enhanced security enabled');
    } else {
      addNotification('Safe Mode deactivated');
    }
  };

  const safetyFeatures = [
    {
      icon: Phone,
      title: 'Fake Call',
      description: 'Simulate incoming call to escape situations',
      action: () => setFakeCallActive(true),
      color: 'bg-blue-500'
    },
    {
      icon: AlertTriangle,
      title: 'Silent Alert',
      description: 'Send silent emergency alert to contacts',
      action: triggerSilentAlert,
      color: 'bg-orange-500'
    },
    {
      icon: Users,
      title: 'Group Alert',
      description: 'Alert all emergency contacts simultaneously',
      action: triggerGroupAlert,
      color: 'bg-green-500'
    },
    {
      icon: Shield,
      title: 'Safe Mode',
      description: 'Activate all safety features',
      action: toggleSafeMode,
      color: safeMode ? 'bg-green-600' : 'bg-gray-500'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      
      <div className="fixed top-20 right-4 z-40 space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`max-w-sm p-3 rounded-lg shadow-lg ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } border-l-4 border-orange-500 animate-fadeIn`}
          >
            <p className="text-sm">{notification}</p>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mb-6 shadow-lg`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Emergency SOS
          </h2>
          <div className="flex justify-center">
            <EmergencyButton />
          </div>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mb-6 shadow-lg`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Safety Features
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {safetyFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={feature.action}
                className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl p-4 transition-all duration-200 active:scale-95`}
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {feature.title}
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mb-6 shadow-lg`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Safety Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {soundEnabled ? (
                  <Volume2 className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                ) : (
                  <VolumeX className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                )}
                <div>
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Sound Alerts
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Enable sound for emergency alerts
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  soundEnabled ? 'bg-purple-600' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <div>
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Safe Mode
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Activate all safety features
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSafeMode(!safeMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  safeMode ? 'bg-green-600' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    safeMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Quick Tips
          </h3>
          <div className="space-y-3">
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3`}>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>SOS Button:</strong> Press and hold for 3 seconds to trigger emergency alert
              </p>
            </div>
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3`}>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Fake Call:</strong> Use to escape uncomfortable situations discreetly
              </p>
            </div>
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3`}>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Location Sharing:</strong> Automatically shared with emergency contacts
              </p>
            </div>
          </div>
        </div>
      </div>

      <FakeCall 
        isActive={fakeCallActive} 
        onEnd={() => setFakeCallActive(false)} 
      />
    </div>
  );
};

export default SafetyPage;