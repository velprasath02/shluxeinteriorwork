import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Eye, ShoppingCart, Trash2 } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, deleteProduct, user, setSelectedProduct } = useContext(AppContext);

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <div className="product-card">
      {/* Floating delete button for Admin */}
      {isAdmin && (
        <button
          className="product-card-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
              deleteProduct(product.id);
            }
          }}
          title="Delete Design Card"
          aria-label="Delete product"
        >
          <Trash2 size={15} />
        </button>
      )}

      <div 
        className="product-card-image-wrapper" 
        onClick={() => setSelectedProduct(product)}
        style={{ cursor: 'pointer' }}
      >
        <img src={product.image} alt={product.name} className="product-card-img" />
        <span className="product-card-category-badge">{product.category}</span>

        {/* Quick action overlay */}
        <div className="product-card-overlay">
          <button
            className="btn-icon btn-overlay-action"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            title="View Details"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <h4 
          className="product-card-title" 
          onClick={() => setSelectedProduct(product)}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h4>
        <p className="product-card-price">{formatRupees(product.price)}</p>

        <div className="product-card-actions">
          <button
            className="btn btn-secondary card-preview-btn"
            onClick={() => setSelectedProduct(product)}
          >
            <Eye size={15} />
            <span>Details</span>
          </button>
          
          {!isAdmin && (
            <button
              className="btn btn-primary card-add-btn"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart size={15} />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .product-card {
          background-color: var(--bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
          border-color: var(--border);
        }

        .product-card-image-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
          background-color: #f1f5f9;
        }

        .product-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .product-card:hover .product-card-img {
          transform: scale(1.08);
        }

        .product-card-category-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background-color: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(4px);
          color: white;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          text-transform: capitalize;
        }

        .product-card-delete-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background-color: #ef4444;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 15;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          transition: all var(--transition-fast);
        }
        .product-card-delete-btn:hover {
          background-color: #dc2626;
          transform: scale(1.1);
        }

        .product-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(30, 20, 10, 0.15);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity var(--transition-fast);
        }
        .product-card-image-wrapper:hover .product-card-overlay {
          opacity: 1;
        }

        .btn-overlay-action {
          background-color: var(--bg-card);
          color: var(--primary);
          box-shadow: var(--shadow-md);
          width: 44px;
          height: 44px;
        }
        .btn-overlay-action:hover {
          background-color: var(--primary);
          color: white;
          transform: scale(1.1);
        }

        .product-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          text-align: left;
        }

        .product-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          cursor: pointer;
          line-height: 1.4;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.8em; /* Force stable height alignment */
          transition: color var(--transition-fast);
        }
        .product-card-title:hover {
          color: var(--primary);
        }

        .product-card-price {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 18px;
        }

        .product-card-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }

        .card-preview-btn {
          flex: 1;
          padding: 8px;
          font-size: 0.82rem;
        }

        .card-add-btn {
          flex: 1.4;
          padding: 8px;
          font-size: 0.82rem;
        }

        @media (max-width: 480px) {
          .product-card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
