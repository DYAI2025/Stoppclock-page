import React from 'react';
import type { TextSectionProps } from '../../types/blog-types';

export const TextSection: React.FC<TextSectionProps> = ({ html }) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
