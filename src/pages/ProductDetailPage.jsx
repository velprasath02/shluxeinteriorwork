import React, { useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, ShoppingCart, ShieldCheck, Wrench, Layers, Award } from 'lucide-react';

export default function ProductDetailPage() {
  const { selectedProduct, setSelectedProduct, products, addToCart, user } = useContext(AppContext);

  // Scroll to top when selected product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isAdmin = user && user.role === 'admin';

  // Get related products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    const filtered = products.filter(
      (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id
    );
    // If we don't have enough products in the same category, suggest other products as fallback
    if (filtered.length === 0) {
      return products.filter((p) => p.id !== selectedProduct.id).slice(0, 4);
    }
    return filtered.slice(0, 4);
  }, [products, selectedProduct]);

  return (
    <div className="product-detail-view container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-nav">
        <button className="back-btn" onClick={() => setSelectedProduct(null)}>
          <ChevronLeft size={16} />
          <span>Back to Designs</span>
        </button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{selectedProduct.name}</span>
      </div>

      {/* Product Detail Grid */}
      <div className="detail-grid">
        {/* Left Column: Image with premium design */}
        <div className="detail-image-panel">
          <div className="image-wrapper">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="product-detail-img" />
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="detail-info-panel">
          <span className="detail-category-badge">{selectedProduct.category}</span>
          <h1 className="detail-title">{selectedProduct.name}</h1>
          
          <div className="detail-price-box">
            <span className="price-label">Estimated Price</span>
            <span className="price-value">{formatRupees(selectedProduct.price)}</span>
          </div>

          <div className="detail-divider" />

          {/* Description */}
          <div className="detail-description-section">
            <h3>Description</h3>
            <p className="detail-desc-text">{selectedProduct.description}</p>
          </div>

          {/* Materials Used in a better way */}
          {selectedProduct.materials && selectedProduct.materials.length > 0 && (
            <div className="detail-materials-section">
              <h3>
                <Layers size={16} style={{ marginRight: '6px', color: 'var(--primary)', display: 'inline-block', verticalAlign: 'middle' }} />
                Premium Materials Used
              </h3>
              <div className="materials-grid">
                {selectedProduct.materials.map((material, index) => (
                  <span key={index} className="material-pill">
                    <span className="material-dot" />
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {selectedProduct.features && selectedProduct.features.length > 0 && (
            <div className="detail-highlights-section">
              <h3>Highlights & Customizations</h3>
              <ul className="highlights-list">
                {selectedProduct.features.map((feature, idx) => (
                  <li key={idx}>
                    <ShieldCheck size={16} className="highlight-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="detail-guarantees-grid">
            <div className="detail-guarantee-card">
              <Wrench size={18} />
              <div>
                <h4>Custom Fitting</h4>
                <p>Free onsite measurements & install</p>
              </div>
            </div>
            <div className="detail-guarantee-card">
              <Award size={18} />
              <div>
                <h4>Teak Joinery</h4>
                <p>Termite proof hardwood materials</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!isAdmin && (
            <div className="detail-actions-section">
              <button 
                className="btn btn-primary detail-add-to-cart-btn"
                onClick={() => addToCart(selectedProduct)}
              >
                <ShoppingCart size={18} />
                <span>Add to Consultation Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <section className="related-products-section">
        <h2 className="related-title">You May Also Like</h2>
        <p className="related-subtitle">Explore suggested premium designs similar to {selectedProduct.name}</p>
        
        {relatedProducts.length > 0 ? (
          <div className="product-grid">
            {relatedProducts.map((prod) => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                onPreview={setSelectedProduct} 
              />
            ))}
          </div>
        ) : (
          <div className="related-empty-state">
            <p>No other items available in this category yet.</p>
          </div>
        )}
      </section>

      <style>{`
        .product-detail-view {
          padding: 40px 24px 80px 24px;
          animation: fadeIn var(--transition-normal) forwards;
          text-align: left;
        }

        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.88rem;
          margin-bottom: 32px;
          color: var(--text-muted);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
          transition: color var(--transition-fast);
          padding: 0;
        }
        .back-btn:hover {
          color: var(--primary-hover);
        }

        .breadcrumb-sep {
          color: var(--border);
        }

        .breadcrumb-current {
          color: var(--text-main);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 300px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 48px;
          margin-bottom: 60px;
        }

        /* Image Column styling */
        .detail-image-panel {
          width: 100%;
        }

        .detail-image-panel .image-wrapper {
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
          box-shadow: 0 10px 30px rgba(30, 20, 10, 0.08);
          background-color: var(--bg-card);
          aspect-ratio: 4/3;
        }

        .product-detail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .product-detail-img:hover {
          transform: scale(1.03);
        }

        /* Info Column styling */
        .detail-info-panel {
          display: flex;
          flex-direction: column;
        }

        .detail-category-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          width: fit-content;
          margin-bottom: 16px;
        }

        .detail-title {
          font-family: var(--font-serif);
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
          margin-bottom: 16px;
        }

        .detail-price-box {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }

        .price-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .price-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary);
        }

        .detail-divider {
          height: 1px;
          background-color: var(--border-light);
          margin-bottom: 24px;
        }

        .detail-description-section h3,
        .detail-materials-section h3,
        .detail-highlights-section h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
        }

        .detail-desc-text {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        /* Materials styling */
        .detail-materials-section {
          margin-bottom: 24px;
          background-color: #faf8f5;
          padding: 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
        }

        .materials-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .material-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .material-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--primary);
        }

        /* Highlights styling */
        .detail-highlights-section {
          margin-bottom: 24px;
        }

        .highlights-list {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .highlights-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--text-main);
        }

        .highlight-icon {
          color: #16a34a;
          flex-shrink: 0;
        }

        /* Guarantees styling */
        .detail-guarantees-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }

        .detail-guarantee-card {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background-color: var(--bg-input);
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
        }
        .detail-guarantee-card svg {
          color: var(--primary);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .detail-guarantee-card h4 {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 2px;
        }
        .detail-guarantee-card p {
          font-size: 0.76rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        .detail-add-to-cart-btn {
          width: 100%;
          padding: 14px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        /* Related products styling */
        .related-products-section {
          border-top: 1px solid var(--border);
          padding-top: 48px;
          margin-top: 24px;
        }

        .related-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .related-subtitle {
          font-size: 0.92rem;
          color: var(--text-muted);
          margin-bottom: 32px;
        }

        .related-empty-state {
          padding: 40px;
          background-color: var(--bg-input);
          border: 1px dashed var(--border);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        @media (max-width: 900px) {
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .detail-image-panel .image-wrapper {
            aspect-ratio: 16/10;
          }
          .detail-title {
            font-size: 2rem;
          }
          .highlights-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
