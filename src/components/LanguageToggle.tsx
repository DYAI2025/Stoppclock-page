import React from 'react';
import { useLang } from '../hooks/useLang';

export default function LanguageToggle() {
  const [lang, setLang] = useLang();
  const other = lang === 'en' ? 'de' : 'en';
  return (
    <button
      className="lang-toggle"
      onClick={() => setLang(other as any)}
      aria-label="Toggle language"
      title={lang === 'en' ? 'Switch to German' : 'Switch to English'}
    >
      {lang.toUpperCase()}
    </button>
  );
}

