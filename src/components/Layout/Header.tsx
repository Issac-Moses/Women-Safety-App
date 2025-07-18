
import React from 'react';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <header className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b transition-colors duration-200`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          
          <img 
            src={logo} 
            alt="Women Safety App Logo"
            className="w-10 h-10 rounded-full object-cover shadow-lg"
          />
          <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
              isDark
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={logout}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
              isDark
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;