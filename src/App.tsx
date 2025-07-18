import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import ContactsPage from './pages/ContactsPage';
import SafetyPage from './pages/SafetyPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Layout/Header';
import BottomNavigation from './components/Layout/BottomNavigation';


const APP_CONFIG = {
  name: 'Andhra Mahila Samraksha', 
  pages: {
    home: 'Andhra Mahila Samraksha',
    location: 'Location Tracking',
    contacts: 'Emergency Contacts',
    safety: 'Safety Features',
    profile: 'Profile'
  }
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'location':
        return <LocationPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'safety':
        return <SafetyPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  const getPageTitle = () => {
    return APP_CONFIG.pages[activeTab as keyof typeof APP_CONFIG.pages] || APP_CONFIG.name;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={getPageTitle()} />
      <main className="flex-1 pt-16 pb-20">
        {renderPage()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;