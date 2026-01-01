import React, { useState, useEffect, useMemo } from 'react';
import { HomeButton } from '../components/HomeButton';
import type { TimerFact, FactCategory } from '../types/facts-types';
import '../styles/facts.css';

interface FactsData {
  version: number;
  generatedAt: string;
  totalFacts: number;
  categories: Record<FactCategory, string[]>;
  languages: { de: TimerFact[]; en: TimerFact[] };
  facts: TimerFact[];
}

const CATEGORY_LABELS: Record<FactCategory, { de: string; en: string; icon: string }> = {
  history: { de: 'Geschichte', en: 'History', icon: '📜' },
  technology: { de: 'Technologie', en: 'Technology', icon: '⚙️' },
  culture: { de: 'Kultur', en: 'Culture', icon: '🎭' },
  science: { de: 'Wissenschaft', en: 'Science', icon: '🔬' },
  productivity: { de: 'Produktivität', en: 'Productivity', icon: '📈' },
  psychology: { de: 'Psychologie', en: 'Psychology', icon: '🧠' }
};

export default function FactsPage() {
  const [factsData, setFactsData] = useState<FactsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<FactCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFact, setExpandedFact] = useState<string | null>(null);

  useEffect(() => {
    // Load facts from JSON
    fetch('/data/facts.json')
      .then(res => res.json())
      .then(data => {
        setFactsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load facts:', err);
        setLoading(false);
      });
  }, []);

  const filteredFacts = useMemo(() => {
    if (!factsData) return [];

    let filtered = factsData.facts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.title.toLowerCase().includes(query) ||
        f.content.toLowerCase().includes(query) ||
        f.tags.some(tag => tag.includes(query))
      );
    }

    return filtered;
  }, [factsData, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="facts-page">
        <HomeButton />
        <div className="facts-loading">Lade Zeitgeschichten...</div>
      </div>
    );
  }

  if (!factsData) {
    return (
      <div className="facts-page">
        <HomeButton />
        <div className="facts-error">Fehler beim Laden der Facts</div>
      </div>
    );
  }

  const categoryCounts = Object.entries(factsData.categories).reduce((acc, [cat, ids]) => {
    acc[cat as FactCategory] = ids.length;
    return acc;
  }, {} as Record<FactCategory, number>);

  return (
    <div className="facts-page">
      {/* Header */}
      <header className="facts-header">
        <HomeButton />
        <h1 className="facts-title">Zeit-Wissen & Geschichten</h1>
        <p className="facts-subtitle">
          Entdecke faszinierende Fakten über Zeitmessung, Uhren und Zeitmanagement
        </p>
        <div className="facts-stats">
          <span className="facts-stat">📚 {factsData.totalFacts} Artikel</span>
          <span className="facts-stat">🏷️ {Object.keys(factsData.categories).length} Kategorien</span>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="facts-controls">
        <div className="facts-search">
          <input
            type="text"
            placeholder="Suche nach Thema, Stichwort..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="facts-search-input"
          />
          {searchQuery && (
            <button
              className="facts-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >✕</button>
          )}
        </div>

        <div className="facts-category-filter">
          <button
            className={`facts-category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Alle ({factsData.totalFacts})
          </button>
          {(Object.keys(CATEGORY_LABELS) as FactCategory[]).map(cat => {
            const count = categoryCounts[cat] || 0;
            if (count === 0) return null;
            const label = CATEGORY_LABELS[cat];
            return (
              <button
                key={cat}
                className={`facts-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {label.icon} {label.de} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="facts-results">
        {filteredFacts.length === 0 ? (
          <div className="facts-no-results">
            <p>Keine Artikel gefunden für "{searchQuery}"</p>
            <button className="btn" onClick={() => setSearchQuery('')}>
              Zurücksetzen
            </button>
          </div>
        ) : (
          <>
            <div className="facts-results-header">
              {filteredFacts.length} Artikel gefunden
            </div>
            <div className="facts-grid">
              {filteredFacts.map(fact => {
                const categoryLabel = CATEGORY_LABELS[fact.category];
                const isExpanded = expandedFact === fact.id;
                const preview = fact.content.substring(0, 200) + '...';

                return (
                  <article key={fact.id} className="fact-card">
                    <div className="fact-card-header">
                      <span className="fact-category">
                        {categoryLabel.icon} {categoryLabel.de}
                      </span>
                      <span className="fact-wordcount">{fact.wordCount} Wörter</span>
                    </div>

                    <h3 className="fact-title">{fact.title}</h3>

                    <div className="fact-content">
                      {isExpanded ? (
                        <p>{fact.content}</p>
                      ) : (
                        <p>{preview}</p>
                      )}
                    </div>

                    {fact.tags.length > 0 && (
                      <div className="fact-tags">
                        {fact.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="fact-tag">#{tag}</span>
                        ))}
                      </div>
                    )}

                    <button
                      className="fact-toggle-btn"
                      onClick={() => setExpandedFact(isExpanded ? null : fact.id)}
                    >
                      {isExpanded ? 'Weniger anzeigen' : 'Weiterlesen'}
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer SEO Content */}
      <footer className="facts-footer">
        <h2>Über diese Sammlung</h2>
        <p>
          Diese Sammlung enthält {factsData.totalFacts} sorgfältig kuratierte Artikel über die
          Geschichte der Zeitmessung, moderne Zeitmanagement-Techniken und die Wissenschaft hinter
          Uhren und Timern. Von antiken Sonnenuhren bis zu modernen Atomuhren – entdecke, wie die
          Menschheit Zeit gemessen und strukturiert hat.
        </p>
        <p>
          Perfekt für Studenten, Lehrer, Zeitmanagement-Enthusiasten und alle, die mehr über die
          faszinierende Welt der Zeitmessung lernen möchten.
        </p>
      </footer>
    </div>
  );
}
