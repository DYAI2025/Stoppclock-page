import React from 'react';
import './Breadcrumb.css';

interface BreadcrumbProps {
  timerName: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ timerName }) => {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <a href="#/" className="breadcrumb-link">Home</a>
        </li>
        <li className="breadcrumb-separator" aria-hidden="true">/</li>
        <li className="breadcrumb-item">
          <a href="#/wissen" className="breadcrumb-link">Wissen</a>
        </li>
        <li className="breadcrumb-separator" aria-hidden="true">/</li>
        <li className="breadcrumb-item breadcrumb-current" aria-current="page">
          <span>{timerName}</span>
        </li>
      </ol>
    </nav>
  );
};