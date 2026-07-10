import React, { useContext, useState } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import SubNavbar from './components/SubNavbar';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import LoginModal from './components/LoginModal';
import CartDrawer from './components/CartDrawer';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductModal from './components/AddProductModal';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

function AppContent() {
  const { activeCategory, searchQuery, setActiveCategory, selectedProduct } = useContext(AppContext);
  
  // Local modal states for admin product creation
  const [isAdminAddOpen, setIsAdminAddOpen] = useState(false);

  // Router switch based on active category tab & search query
  const renderPageView = () => {
    // If a product is selected, render its dedicated details page
    if (selectedProduct) {
      return (
        <ProductDetailPage />
      );
    }

    // If a search query is entered, we render in category-view mode (filtering all/active category)
    if (searchQuery) {
      return (
        <CategoryPage
          onOpenAddProduct={() => setIsAdminAddOpen(true)}
        />
      );
    }

    if (activeCategory === 'Home') {
      return (
        <Home
          onOpenAddProduct={() => setIsAdminAddOpen(true)}
        />
      );
    }

    return (
      <CategoryPage
        onOpenAddProduct={() => setIsAdminAddOpen(true)}
      />
    );
  };

  return (
    <div className="app-container">
      {/* Top Navbar Header */}
      <Navbar />

      {/* Categories sub navbar */}
      <SubNavbar />

      {/* Main Pages content wrapper */}
      <main className="main-content">
        {renderPageView()}
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: Brand Info */}
            <div className="footer-column">
              <div className="footer-logo">
                SELVA <span>HARISH</span>
              </div>
              <p style={{ color: '#a89a8e', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px' }}>
                For over 15 years, SELVA HARISH has been delivering exceptional wood designs, bespoke wardrobes, 
                modular setups, and traditional carvings for beautiful homes.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: '600' }}>
                <ShieldCheck size={16} /> Certified Teak Joinery
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-column">
              <h4>Interior Works</h4>
              <ul className="footer-links">
                <li>
                  <a href="#kitchen" onClick={(e) => { e.preventDefault(); setActiveCategory('Modular Kitchen'); }}>
                    <ChevronRight size={12} style={{ marginRight: '4px' }} /> Modular Kitchen
                  </a>
                </li>
                <li>
                  <a href="#cupboards" onClick={(e) => { e.preventDefault(); setActiveCategory('bedroom cupboard'); }}>
                    <ChevronRight size={12} style={{ marginRight: '4px' }} /> Bedroom Cupboards
                  </a>
                </li>
                <li>
                  <a href="#showcase" onClick={(e) => { e.preventDefault(); setActiveCategory('showcase'); }}>
                    <ChevronRight size={12} style={{ marginRight: '4px' }} /> Showcase Cabinets
                  </a>
                </li>
                <li>
                  <a href="#tv-units" onClick={(e) => { e.preventDefault(); setActiveCategory('TV units & Cupboards'); }}>
                    <ChevronRight size={12} style={{ marginRight: '4px' }} /> TV Units & Framing
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Exterior Works */}
            <div className="footer-column">
              <h4>Doors & Carving</h4>
              <ul className="footer-links">
                <li>
                  <a href="#doors" onClick={(e) => { e.preventDefault(); setActiveCategory('Wooden Door'); }}>
                    <ChevronRight size={12} style={{ marginRight: '4px' }} /> Main Entrance Doors
                  </a>
                </li>
                <li>
                  <a href="#pooja-cupboards" onClick={(e) => { e.preventDefault(); setActiveCategory('pooja cupboard'); }}>
                    <ChevronRight size={12} style={{ marginRight: '4px' }} /> Pooja Cupboards
                  </a>
                </li>
                <li>
                  <a href="#carving" onClick={(e) => { e.preventDefault(); setActiveCategory('Model Wood Carving'); }}>
                    <ChevronRight size={12} style={{ marginRight: '4px' }} /> Traditional Art Carving
                  </a>
                </li>
                <li>
                  <a href="#furniture" onClick={(e) => { e.preventDefault(); setActiveCategory('furniture'); }}>
                    <ChevronRight size={12} style={{ marginRight: '4px' }} /> Custom Sofa & Chairs
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact info */}
            <div className="footer-column">
              <h4>Contact Workshop</h4>
              <ul className="footer-links" style={{ color: '#a89a8e' }}>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <MapPin size={16} className="footer-contact-icon" style={{ marginTop: '3px', flexShrink: 0, color: 'var(--accent)' }} />
                  <span>3c/195A vallinayaga pura 5th street,Thoothuudi</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  <Phone size={16} className="footer-contact-icon" style={{ flexShrink: 0, color: 'var(--accent)' }} />
                  <span>+91 63791 83549</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  <Mail size={16} className="footer-contact-icon" style={{ flexShrink: 0, color: 'var(--accent)' }} />
                  <span>selvaharish049@gmail.com.com</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Clock size={16} className="footer-contact-icon" style={{ flexShrink: 0, color: 'var(--accent)' }} />
                  <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} SELVA HARISH. All Rights Reserved. Crafted with Premium Wood Polish.</p>
          </div>
        </div>
      </footer>

      {/* Global Modals & Overlay Drawers */}
      <LoginModal />
      <CartDrawer />

      {/* Admin Add-Product Modal */}
      <AddProductModal
        isOpen={isAdminAddOpen}
        onClose={() => setIsAdminAddOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
