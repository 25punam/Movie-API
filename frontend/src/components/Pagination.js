import React from 'react';
import './Pagination.css';

function Pagination({ page, totalPages, onChange }) {
  // Intelligently generate page buttons for large datasets
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      // Show all pages if less than or equal to 7
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const leftSiblings = Math.max(1, page - 2);
    const rightSiblings = Math.min(totalPages, page + 2);

    // Always show first page
    pages.push(1);

    // Add left ellipsis if needed
    if (leftSiblings > 2) {
      pages.push('...');
    }

    // Add left sibling pages
    for (let i = leftSiblings; i < page; i++) {
      pages.push(i);
    }

    // Add current page
    pages.push(page);

    // Add right sibling pages
    for (let i = page + 1; i <= rightSiblings; i++) {
      pages.push(i);
    }

    // Add right ellipsis if needed
    if (rightSiblings < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    // Deduplicate while preserving order to avoid duplicate React keys
    const deduped = [];
    const seen = new Set();
    for (const item of pages) {
      if (!seen.has(item)) {
        seen.add(item);
        deduped.push(item);
      }
    }

    return deduped;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <button 
        className="page prev" 
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        ← Prev
      </button>

      {pageNumbers.map((p, i) => {
        if (p === '...') {
          return <span key={`ellipsis-${i}`} className="ellipsis">...</span>;
        }
        return (
          <button 
            key={p} 
            className={p === page ? 'page active' : 'page'} 
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        );
      })}

      <button 
        className="page next" 
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
