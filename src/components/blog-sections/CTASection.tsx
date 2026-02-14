import React from 'react';
import type { CTASectionProps } from '../../types/blog-types';

export const CTASection: React.FC<CTASectionProps> = ({
  heading,
  description,
  buttons,
  backgroundColor,
}) => {
  const style: React.CSSProperties = backgroundColor
    ? { backgroundColor, padding: '16px', borderRadius: '8px', margin: '20px 0' }
    : {};

  const isInline = !heading;

  return (
    <div className={isInline ? 'blog-cta-inline' : 'blog-cta'} style={style}>
      {heading && <h3>{heading}</h3>}
      {description && <p dangerouslySetInnerHTML={{ __html: description }} />}
      <p>
        {buttons.map((button, index) => (
          <a
            key={index}
            href={button.href}
            className={`btn btn-${button.variant || 'primary'}${heading ? ' btn-large' : ''}`}
            style={index > 0 ? { marginLeft: '10px' } : undefined}
          >
            {button.emoji && `${button.emoji} `}{button.label}
          </a>
        ))}
      </p>
    </div>
  );
};
