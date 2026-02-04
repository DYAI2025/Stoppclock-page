import React from 'react';
import ReactMarkdown from 'react-markdown';
import './RitualCard.css';

interface RitualCardProps {
  title: string;
  description: string;
}

export const RitualCard: React.FC<RitualCardProps> = ({ title, description }) => {
  return (
    <div className="ritual-card">
      <h3 className="ritual-title">{title}</h3>
      <div className="ritual-description">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
    </div>
  );
};
