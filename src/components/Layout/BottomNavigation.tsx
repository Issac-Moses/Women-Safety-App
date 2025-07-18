import React from 'react';
import { Home, User, MapPin, Phone, Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const { isDark } = useTheme();

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'location', icon: MapPin, label: 'Location' },
    { id: 'contacts', icon: Phone, label: 'Contacts' },
    { id: 'safety', icon: Shield, label: 'Safety' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t transition-colors duration-200`}>
      <div className="flex justify-around items-center py-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
              activeTab === id
                ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400'
                : isDark
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;