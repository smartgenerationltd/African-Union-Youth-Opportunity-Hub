import React from 'react';
import { GlobeIcon, BellIcon, LogoutIcon, UserCircleIcon } from './Icons';
import { useTranslation } from '../contexts/Translation';

interface HeaderProps {
  onLogout: () => void;
  isAdmin?: boolean;
  currentView?: 'hub' | 'dashboard' | 'profile';
  onNavigate?: (view: 'hub' | 'dashboard' | 'profile') => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, isAdmin, currentView, onNavigate }) => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-au-green p-2 rounded-full">
            <GlobeIcon className="w-6 h-6 text-au-gold" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-au-green tracking-tight">{t('headerTitle')}</h1>
            <p className="text-xs text-gray-500 italic hidden sm:block">{t('headerSlogan')}</p>
          </div>
           {isAdmin && (
            <div className="flex items-center bg-gray-100 rounded-full p-1 ml-4">
              <span className="bg-au-gold text-au-dark text-xs font-bold px-3 py-1 rounded-full">
                {t('adminMode')}
              </span>
              {currentView === 'hub' ? (
                <button
                  onClick={() => onNavigate?.('dashboard')}
                  className="ml-1 text-xs font-semibold px-3 py-1 text-au-green hover:bg-gray-200 rounded-full transition-colors"
                >
                  {t('dashboard')}
                </button>
              ) : (
                <button
                  onClick={() => onNavigate?.('hub')}
                  className="ml-1 text-xs font-semibold px-3 py-1 text-au-green hover:bg-gray-200 rounded-full transition-colors"
                >
                  {t('viewHub')}
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative text-gray-600 hover:text-au-green transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-au-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-au-red"></span>
            </span>
          </button>
          {!isAdmin && (
            <button 
                onClick={() => onNavigate?.('profile')}
                className="text-gray-600 hover:text-au-green transition-colors"
                aria-label="My Profile"
            >
                <UserCircleIcon className="w-6 h-6" />
            </button>
          )}
           <div className="relative">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-gray-100 border border-gray-300 rounded-full py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-au-gold"
            >
              <option value="English">English</option>
              <option value="Français">Français</option>
              <option value="Português">Português</option>
              <option value="العربية">العربية</option>
              <option value="Kiswahili">Kiswahili</option>
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-au-red transition-colors font-semibold text-sm bg-gray-100 hover:bg-red-50 px-3 py-2 rounded-lg"
            aria-label="Sign Out"
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="hidden sm:inline">{t('signOut')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
