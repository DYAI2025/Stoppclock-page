import React from 'react';
import type { ComparisonTableProps } from '../../types/blog-types';

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  heading,
  headers,
  rows,
}) => {
  return (
    <div className="comparison-table-section">
      {heading && <h2>{heading}</h2>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ccc' }}>
            {headers.map((header, index) => (
              <th
                key={index}
                style={{
                  padding: '12px',
                  textAlign: index === 0 ? 'left' : 'center',
                  borderRight: index < headers.length - 1 ? '1px solid #ddd' : undefined,
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: '1px solid #ddd' }}>
              <td
                style={{
                  padding: '12px',
                  borderRight: '1px solid #ddd',
                  fontWeight: 'bold',
                }}
              >
                {row.aspect}
              </td>
              {row.values.map((value, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    borderRight: colIndex < row.values.length - 1 ? '1px solid #ddd' : undefined,
                  }}
                  dangerouslySetInnerHTML={{ __html: value }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
