
import React from 'react';
import { SparklesIcon } from './Icons';
import { useTranslation } from '../contexts/Translation';

interface ProfileAssistantProps {
  profile: string;
  setProfile: (value: string) => void;
  onFindMatches: () => void;
  isLoading: boolean;
  error: string | null;
}

export const ProfileAssistant: React.FC<ProfileAssistantProps> = ({ profile, setProfile, onFindMatches, isLoading, error }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
      <div className="flex items-center mb-4">
        <SparklesIcon className="w-6 h-6 text-au-gold mr-2" />
        <h2 className="text-2xl font-bold text-au-green">{t('aiProfileAssistant')}</h2>
      </div>
      <p className="text-gray-600 mb-4 text-sm">{t('aiProfileAssistantPrompt')}</p>
      <textarea
        value={profile}
        onChange={(e) => setProfile(e.target.value)}
        placeholder="E.g., 'I am a recent computer science graduate from Nigeria, passionate about renewable energy and mobile app development...'"
        className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-au-gold text-sm"
        disabled={isLoading}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        onClick={onFindMatches}
        disabled={isLoading}
        className="w-full mt-4 bg-au-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center disabled:bg-gray-400"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('matching')}
          </>
        ) : (
          t('findMyMatches')
        )}
      </button>
    </div>
  );
};
