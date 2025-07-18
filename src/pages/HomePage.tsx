import React, { useState } from 'react';
import { Phone, MapPin, Users, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from '../hooks/useLocation';
import EmergencyButton from '../components/EmergencyButton';
import FakeCall from '../components/FakeCall';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { location, getCurrentLocation } = useLocation();
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [safeMode, setSafeMode] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  const shareLocation = async () => {
    try {
      await getCurrentLocation();
      if (location) {
        const locationUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
        const message = `Emergency: I need help! My location: ${locationUrl}`;
        
        if (navigator.share) {
          await navigator.share({
            title: 'Emergency Location',
            text: message,
            url: locationUrl
          });
        } else {
          await navigator.clipboard.writeText(message);
          addNotification('Location copied to clipboard and shared!');
        }
        

        user?.emergencyContacts?.forEach(contact => {
          console.log(`Sending location to ${contact.name}: ${message}`);
        });
        
        addNotification(`Location shared with ${user?.emergencyContacts?.length || 0} emergency contacts`);
      } else {
        addNotification('Unable to get current location. Please try again.');
      }
    } catch (error) {
      addNotification('Failed to share location. Please try again.');
    }
  };

  const alertContacts = () => {
    if (!user?.emergencyContacts || user.emergencyContacts.length === 0) {
      addNotification('No emergency contacts found. Please add contacts first.');
      return;
    }

    const alertMessage = `EMERGENCY ALERT: ${user.name} needs immediate assistance!`;
    
    
    user.emergencyContacts.forEach(contact => {
      console.log(`Sending alert to ${contact.name} (${contact.phone}): ${alertMessage}`);
    });
    
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Emergency Alert Sent', {
        body: `Alert sent to ${user.emergencyContacts.length} emergency contacts`,
        icon: '/emergency-icon.png'
      });
    }
    
    addNotification(`Emergency alert sent to ${user.emergencyContacts.length} contacts!`);
  };

  const toggleSafeMode = () => {
    setSafeMode(!safeMode);
    if (!safeMode) {
      
      getCurrentLocation();
      addNotification('Safe Mode activated - All safety features enabled');
      
      
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } else {
      addNotification('Safe Mode deactivated');
    }
  };
  const quickActions = [
    {
      icon: Phone,
      title: 'Fake Call',
      description: 'Simulate incoming call',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      onClick: () => setFakeCallActive(true)
    },
    {
      icon: MapPin,
      title: 'Share Location',
      description: 'Send location to contacts',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      onClick: shareLocation
    },
    {
      icon: Users,
      title: 'Alert Contacts',
      description: 'Notify emergency contacts',
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      onClick: alertContacts
    },
    {
      icon: Shield,
      title: 'Safe Mode',
      description: 'Activate safety features',
      color: safeMode ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-purple-500 to-pink-500',
      onClick: toggleSafeMode
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
            } border-l-4 border-green-500 animate-fadeIn`}
          >
            <p className="text-sm">{notification}</p>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mb-6 shadow-lg`}>
        <div className="flex items-center space-x-4 mb-4">
          <img 
            src="/logo.png"  
            alt="Women Safety App Logo"
            className="w-12 h-12 rounded-full object-cover shadow-lg"
          />
          <div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Stay safe and connected
            </p>
          </div>
        </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              All safety features active
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Emergency SOS
          </h3>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-gradient-to-br from-red-50 to-pink-50'} rounded-2xl p-6 shadow-lg border ${isDark ? 'border-gray-700' : 'border-red-100'}`}>
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-2 animate-pulse" />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Press SOS to alert emergency contacts
              </span>
            </div>
            <div className="flex justify-center">
              <EmergencyButton />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-xl p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 group`}
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 shadow-md group-hover:shadow-lg transition-all duration-300`}>
                  <action.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {action.title}
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Safety Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Location Services
              </span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-green-500 font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Emergency Contacts
              </span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-blue-500 font-medium">
                  {user?.emergencyContacts?.length || 0} Added
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Safe Mode
              </span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${safeMode ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className={`text-sm font-medium ${safeMode ? 'text-green-500' : 'text-gray-400'}`}>
                  {safeMode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
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

export default HomePage;