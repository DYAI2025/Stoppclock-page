import { useEffect, useState } from 'react';

const LS_KEY = 'sc.lang';
type Lang = 'en' | 'de';

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(() => {
    const raw = localStorage.getItem(LS_KEY);
    return (raw === 'de' || raw === 'en') ? (raw as Lang) : 'en';
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, lang);
    document.documentElement.setAttribute('data-lang', lang);
  }, [lang]);

  return [lang, setLang];
}

