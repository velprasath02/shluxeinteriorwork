import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Plus, Hammer, AlertCircle } from 'lucide-react';

export default function CategoryPage({ onOpenAddProduct }) {
  const { products, activeCategory, searchQuery, user } = useContext(AppContext);

  // Filter products by active category
  const categoryProducts = products.filter((product) => {
    // If activeCategory is not Home, match categories
    const matchesCategory = activeCategory === 'Home' || product.category === activeCategory;
    
    // Match search query if any
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    return matchesCategory && matchesSearch;
  });

  const isAdmin = user && user.role === 'admin';

  return (
    <div className="category-page-view">
      <div className="container">
        {/* Category Header */}
        <div className="category-header">
          <div className="category-icon-pill">
            <Hammer size={16} />
            <span>Premium Carpentry</span>
          </div>
          <h2 className="section-title">{activeCategory}</h2>
          <p className="category-subtitle">
            {searchQuery 
              ? `Showing results for "${searchQuery}" in ${activeCategory}`
              : `Explore our premium catalogue of handcrafted ${activeCategory.toLowerCase()} units.`
            }
          </p>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {/* Add Product Card for Admin (Visual helper block) */}
          {isAdmin && (
            <div className="admin-add-card-placeholder" onClick={onOpenAddProduct}>
              <div className="dashed-border-inner">
                <div className="add-card-icon-circle">
                  <Plus size={24} />
                </div>
                <h4>Add New Item</h4>
                <p>Upload a product picture and specify pricing details</p>
              </div>
            </div>
          )}

          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

          {/* Empty State */}
          {categoryProducts.length === 0 && !isAdmin && (
            <div className="no-products-alert">
              <AlertCircle size={40} />
              <h3>No products found</h3>
              <p>We couldn't find any items matching your criteria in this section. Try searching for other items.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Plus Button for Admin */}
      {isAdmin && (
        <button
          className="floating-plus"
          onClick={onOpenAddProduct}
          title="Add New Product Card"
          aria-label="Add product"
        >
          <Plus size={28} />
        </button>
      )}

      <style>{`
        .category-page-view {
          padding: 50px 0 80px 0;
          animation: fadeIn var(--transition-normal);
        }

        .category-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 40px;
        }

        .category-icon-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .category-subtitle {
          color: var(--text-muted);
          margin-top: -24px;
          font-size: 0.95rem;
        }

        /* Admin Add Card in Grid */
        .admin-add-card-placeholder {
          background-color: #fdfbf7;
          border-radius: var(--radius-lg);
          padding: 16px;
          cursor: pointer;
          min-height: 330px;
          display: flex;
          transition: all var(--transition-normal);
        }

        .dashed-border-inner {
          border: 2px dashed #d9c4aa;
          border-radius: var(--radius-md);
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
          transition: all var(--transition-normal);
        }
        .admin-add-card-placeholder:hover .dashed-border-inner {
          border-color: var(--primary);
          background-color: #faf5ee;
        }
        .admin-add-card-placeholder:hover {
          transform: translateY(-6px);
        }

        .add-card-icon-circle {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 4px 10px rgba(180, 83, 9, 0.1);
        }

        .dashed-border-inner h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .dashed-border-inner p {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* No products alerts */
        .no-products-alert {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background-color: var(--bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          text-align: center;
          color: var(--text-muted);
          box-shadow: var(--shadow-sm);
        }
        .no-products-alert svg {
          color: var(--secondary);
          margin-bottom: 16px;
        }
        .no-products-alert h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 6px;
        }
        .no-products-alert p {
          font-size: 0.9rem;
          max-width: 420px;
        }
      `}</style>
    </div>
  );
}
