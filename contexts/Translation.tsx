import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const languageMap: { [key: string]: string } = {
    English: 'en',
    Français: 'fr',
    Português: 'pt',
    'العربية': 'ar',
    Kiswahili: 'sw'
};

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('au-hub-language') || 'English';
  });
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [fallbackTranslations, setFallbackTranslations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
     const fetchFallback = async () => {
        try {
            const response = await fetch('/locales/en.json');
            const data = await response.json();
            setFallbackTranslations(data);
        } catch (error) {
            console.error('Failed to fetch fallback English translations:', error);
        }
    };
    fetchFallback();
  }, []);

  useEffect(() => {
    localStorage.setItem('au-hub-language', language);
    const langCode = languageMap[language] || 'en';
    
    const fetchTranslations = async () => {
      if (langCode === 'en') {
          setTranslations(fallbackTranslations);
          return;
      }
      try {
        const response = await fetch(`/locales/${langCode}.json`);
        if (!response.ok) {
            console.warn(`Could not load translations for ${langCode}. Falling back to English.`);
            setTranslations({}); // Empty means it will use fallback
            return;
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to fetch translations:', error);
        setTranslations({});
      }
    };

    if (Object.keys(fallbackTranslations).length > 0) {
        fetchTranslations();
    }
  }, [language, fallbackTranslations]);

  const t = (key: string, replacements?: { [key: string]: string }) => {
    let translation = translations[key] || fallbackTranslations[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
        });
    }
    return translation;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
