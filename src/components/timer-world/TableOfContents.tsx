import React from 'react';
import './TableOfContents.css';

interface TableOfContentsProps {
  hasRituals: boolean;
  hasEffects: boolean;
  hasFacts: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  hasRituals, 
  hasEffects, 
  hasFacts 
}) => {
  const sections = [
    { id: 'rituals', label: 'Rituals', visible: hasRituals },
    { id: 'effects', label: 'Effects', visible: hasEffects },
    { id: 'facts', label: 'Facts', visible: hasFacts },
  ].filter(s => s.visible);

  if (sections.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="table-of-contents" aria-label="Table of Contents">
      <h3 className="toc-title">Quick Navigation</h3>
      <ul className="toc-list">
        {sections.map(({ id, label }) => (
          <li key={id} className="toc-item">
            <a 
              href={`#${id}`} 
              className="toc-link"
              onClick={(e) => handleClick(e, id)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};