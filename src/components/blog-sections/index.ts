import React from 'react';
import { QuickAnswerSection } from './QuickAnswerSection';
import { TextSection } from './TextSection';
import { CTASection } from './CTASection';
import { FAQSection, generateFAQSchema } from './FAQSection';
import { ComparisonTable } from './ComparisonTable';
import { StatsSection } from './StatsSection';
import type {
  BlogSection,
  BlogSectionType,
  QuickAnswerSectionProps,
  TextSectionProps,
  CTASectionProps,
  FAQSectionProps,
  ComparisonTableProps,
  StatsSectionProps,
} from '../../types/blog-types';

export { QuickAnswerSection } from './QuickAnswerSection';
export { TextSection } from './TextSection';
export { CTASection } from './CTASection';
export { FAQSection, generateFAQSchema } from './FAQSection';
export { ComparisonTable } from './ComparisonTable';
export { StatsSection } from './StatsSection';

type SectionComponentMap = {
  'quick-answer': React.FC<QuickAnswerSectionProps>;
  'text': React.FC<TextSectionProps>;
  'cta': React.FC<CTASectionProps>;
  'faq': React.FC<FAQSectionProps>;
  'comparison-table': React.FC<ComparisonTableProps>;
  'stats': React.FC<StatsSectionProps>;
};

const sectionComponents: SectionComponentMap = {
  'quick-answer': QuickAnswerSection,
  'text': TextSection,
  'cta': CTASection,
  'faq': FAQSection,
  'comparison-table': ComparisonTable,
  'stats': StatsSection,
};

export function renderSection(section: BlogSection, index: number): React.ReactNode {
  const Component = sectionComponents[section.type];
  if (!Component) {
    console.warn(`Unknown section type: ${section.type}`);
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.createElement(Component as React.FC<any>, { key: index, ...section.props });
}

export function getSectionComponent(type: BlogSectionType) {
  return sectionComponents[type];
}
