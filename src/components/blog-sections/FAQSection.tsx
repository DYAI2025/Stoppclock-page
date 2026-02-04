import React from 'react';
import type { FAQSectionProps } from '../../types/blog-types';

export const FAQSection: React.FC<FAQSectionProps> = ({ heading, items }) => {
  return (
    <div className="faq-section">
      {heading && <h2>{heading}</h2>}
      {items.map((item, index) => (
        <div key={index} className="faq-item">
          <h3>F: {item.question}</h3>
          <p>
            <strong>A:</strong>{' '}
            <span dangerouslySetInnerHTML={{ __html: item.answer }} />
          </p>
        </div>
      ))}
    </div>
  );
};

export function generateFAQSchema(items: FAQSectionProps['items']) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]*>/g, ''),
      },
    })),
  };
}
