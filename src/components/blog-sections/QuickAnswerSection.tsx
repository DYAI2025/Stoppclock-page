import React from 'react';
import type { QuickAnswerSectionProps } from '../../types/blog-types';

export const QuickAnswerSection: React.FC<QuickAnswerSectionProps> = ({
  heading = 'Schnelle Antwort',
  summary,
  bulletPoints,
}) => {
  return (
    <div className="quick-answer-section">
      <h3>{heading}</h3>
      <p dangerouslySetInnerHTML={{ __html: summary }} />
      {bulletPoints && bulletPoints.length > 0 && (
        <ul>
          {bulletPoints.map((point, index) => (
            <li key={index}>
              <strong>{point.label}:</strong> {point.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
