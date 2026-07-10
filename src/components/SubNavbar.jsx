import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function SubNavbar() {
  const { categories, activeCategory, setActiveCategory, setSearchQuery, setSelectedProduct } = useContext(AppContext);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    // Reset search when shifting categories to avoid confusing empty states
    setSearchQuery('');
    setSelectedProduct(null);
  };

  return (
    <div className="sub-navbar-section">
      <div className="container sub-navbar-container">
        <div className="categories-list">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-item-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .sub-navbar-section {
          background-color: #faf5ee; /* Very light warm wood/cream tone */
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
        }
        
        .sub-navbar-section::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        .sub-navbar-container {
          display: flex;
          justify-content: center;
          padding: 0;
        }

        .categories-list {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 24px;
          width: max-content;
        }

        .category-item-btn {
          padding: 8px 16px;
          font-weight: 500;
          font-size: 0.92rem;
          color: var(--text-muted);
          border-radius: var(--radius-full);
          white-space: nowrap;
          background: transparent;
          border: 1px solid transparent;
          transition: all var(--transition-fast);
        }

        .category-item-btn:hover {
          color: var(--primary);
          background-color: rgba(180, 83, 9, 0.05);
        }

        .category-item-btn.active {
          color: var(--text-white);
          background-color: var(--primary);
          box-shadow: 0 2px 8px rgba(180, 83, 9, 0.2);
        }

        @media (max-width: 1024px) {
          .sub-navbar-container {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
