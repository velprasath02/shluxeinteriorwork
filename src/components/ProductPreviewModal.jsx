import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, ShoppingCart, Check, Shield, Wrench } from 'lucide-react';

export default function ProductPreviewModal({ product, onClose }) {
  const { addToCart, user } = useContext(AppContext);

  const isAdmin = user && user.role === 'admin';

  if (!product) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content preview-modal-content">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="preview-modal-grid">
          {/* Product Image */}
          <div className="preview-image-section">
            <img src={product.image} alt={product.name} className="preview-modal-img" />
          </div>

          {/* Product Details */}
          <div className="preview-details-section">
            <span className="preview-category-pill">{product.category}</span>
            <h3 className="preview-product-title">{product.name}</h3>
            <p className="preview-product-price">{formatRupees(product.price)}</p>

            <div className="divider" />

            <p className="preview-product-desc">{product.description}</p>

            {/* Features list */}
            {product.features && product.features.length > 0 && (
              <div className="preview-features-container">
                <h4>Product Highlights:</h4>
                <ul className="preview-features-list">
                  {product.features.map((feature, i) => (
                    <li key={i}>
                      <Check size={14} className="feature-check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Standard Guarantees */}
            <div className="guarantees-wrapper">
              <div className="guarantee-item">
                <Wrench size={16} />
                <span>Free Custom Installation</span>
              </div>
              <div className="guarantee-item">
                <Shield size={16} />
                <span>Termite Proof Timber</span>
              </div>
            </div>

            {!isAdmin && (
              <div className="preview-modal-actions">
                <button
                  className="btn btn-primary preview-modal-add-btn"
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .preview-modal-content {
          max-width: 820px;
          width: 95%;
          padding: 24px;
          text-align: left;
        }

        .preview-modal-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 32px;
          margin-top: 12px;
        }

        .preview-image-section {
          width: 100%;
          height: 380px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .preview-modal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-details-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .preview-category-pill {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          width: fit-content;
          margin-bottom: 12px;
        }

        .preview-product-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.25;
          margin-bottom: 8px;
        }

        .preview-product-price {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--primary);
        }

        .divider {
          height: 1px;
          background-color: var(--border-light);
          margin: 16px 0;
        }

        .preview-product-desc {
          font-size: 0.92rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .preview-features-container h4 {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .preview-features-list {
          list-style: none;
          margin-bottom: 24px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
        }
        .preview-features-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-main);
        }

        .feature-check-icon {
          color: #16a34a;
          flex-shrink: 0;
        }

        .guarantees-wrapper {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .guarantee-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--text-muted);
          background-color: var(--bg-input);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
        }
        .guarantee-item svg {
          color: var(--secondary);
        }

        .preview-modal-add-btn {
          width: 100%;
          padding: 12px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .preview-modal-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .preview-image-section {
            height: 220px;
          }
          .preview-modal-content {
            padding: 16px;
            overflow-y: auto;
            max-height: 90vh;
          }
        }
      `}</style>
    </div>
  );
}
