import React from 'react';
import type { StatsSectionProps } from '../../types/blog-types';

export const StatsSection: React.FC<StatsSectionProps> = ({ heading, stats }) => {
  return (
    <div className="stats-section">
      {heading && <h2>{heading}</h2>}
      <div className="stats-grid" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', margin: '24px 0' }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              minWidth: '150px',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7B2CBF' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '600', marginTop: '8px' }}>
              {stat.label}
            </div>
            {stat.description && (
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                {stat.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
