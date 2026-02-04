import React from 'react';
import ReactMarkdown from 'react-markdown';
import './FactPlaque.css';

interface FactPlaqueProps {
  title: string;
  content: string;
  source?: string;
}

export const FactPlaque: React.FC<FactPlaqueProps> = ({ title, content, source }) => {
  return (
    <div className="fact-plaque">
      <div className="plaque-border">
        <h3 className="plaque-title">{title}</h3>
        <div className="plaque-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
