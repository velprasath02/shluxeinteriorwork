import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import ReviewsSection from '../components/ReviewsSection';
import { Sparkles, Plus } from 'lucide-react';

export default function Home({ onOpenAddProduct }) {
  const { products, setActiveCategory, user } = useContext(AppContext);
  const isAdmin = user && user.role === 'admin';

  const featuredProducts = useMemo(() => {
    // Only show custom manually added designs on the Home page
    return products.filter((product) => product.id.startsWith('custom_'));
  }, [products]);

  return (
    <div className="home-page-view">
      {/* Hero Carousel */}
      <HeroCarousel onSelectCategory={setActiveCategory} />

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <div className="container">
          <div className="home-section-header">
            <div className="accent-sparkle-pill">
              <Sparkles size={14} />
              <span>Trending Designs</span>
            </div>
            <h2 className="section-title">Our Premium Craftsmanship</h2>
            <p className="section-intro-text">
              Hand-finished designs constructed with seasoned teak, rosewood, and moisture-resistant panels. 
              Explore custom measurements tailored by master carpenters.
            </p>
          </div>

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

            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

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
        .home-page-view {
          animation: fadeIn var(--transition-normal);
        }

        .featured-products-section {
          padding: 60px 0;
          background-color: var(--bg-card);
        }

        .home-section-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
          text-align: center;
        }

        .accent-sparkle-pill {
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
          letter-spacing: 1px;
          margin-bottom: 12px;
          width: fit-content;
        }

        .section-intro-text {
          max-width: 650px;
          color: var(--text-muted);
          font-size: 0.98rem;
          line-height: 1.6;
          margin-top: -24px;
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
      `}</style>
    </div>
  );
}
