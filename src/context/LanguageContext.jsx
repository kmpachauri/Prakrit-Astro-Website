import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('prakrit_astro_lang') || 'hindi';
  });

  const setLanguage = (lang) => {
    if (['hinglish', 'hindi', 'english'].includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('prakrit_astro_lang', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
