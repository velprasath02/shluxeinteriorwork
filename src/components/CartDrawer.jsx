import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, FileText } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    cartTotal,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    user,
    setIsLoginModalOpen,
    bookConsultation
  } = useContext(AppContext);

  // Local state for phone, name and address collection
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Auto-populate customer name and phone on login or cart drawer opening
  useEffect(() => {
    if (user) {
      setCheckoutName(user.username || '');
      if (user.phone) {
        const numericPhone = user.phone.replace(/\D/g, '');
        if (numericPhone.length > 10 && numericPhone.startsWith('91')) {
          setCheckoutPhone(numericPhone.slice(2));
        } else {
          setCheckoutPhone(numericPhone);
        }
      } else {
        setCheckoutPhone('');
      }
    } else {
      setCheckoutName('');
      setCheckoutPhone('');
    }
    setCheckoutAddress('');
    setBookingError('');
    setIsSubmitting(false);
  }, [isCartOpen, user]);

  if (!isCartOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === 'cart-drawer-backdrop' && !isSubmitting) {
      setIsCartOpen(false);
    }
  };

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCheckout = async () => {
    setBookingError('');

    if (!checkoutName.trim()) {
      setBookingError('Please enter your name.');
      return;
    }
    const cleanedPhone = checkoutPhone.replace(/\D/g, '');
    if (!cleanedPhone) {
      setBookingError('Please enter your contact phone number.');
      return;
    }
    if (cleanedPhone.length !== 10) {
      setBookingError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!checkoutAddress.trim()) {
      setBookingError('Please enter the site installation address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await bookConsultation({
        username: checkoutName.trim(),
        phone: '91' + cleanedPhone, // Automatically prepend India country code 91
        address: checkoutAddress.trim(),
        cart,
        total: cartTotal
      });

      if (result.success) {
        alert('Thank you! Your carpentry consultation has been booked successfully. Opening WhatsApp to forward your order details.');
        setIsCartOpen(false);
        if (result.whatsappUrl) {
          window.open(result.whatsappUrl, '_blank');
        }
      } else {
        setBookingError(result.error || 'Failed to submit consultation request');
      }
    } catch (err) {
      setBookingError('Network communication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-drawer-backdrop" onClick={handleBackdropClick}>
      <div className="cart-drawer-content">
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} className="cart-bag-icon" />
            <h3>Your Cart</h3>
            <span className="cart-qty-pill">{cartItemCount} items</span>
          </div>
          <button
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-circle">
                <ShoppingBag size={40} />
              </div>
              <h4>Your cart is empty</h4>
              <p>Explore our furniture categories and modular setups to customize your space.</p>
              <button
                className="btn btn-primary"
                onClick={() => setIsCartOpen(false)}
              >
                Start Browsing
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">{formatRupees(item.price)}</p>
                    
                    {/* Quantity controls */}
                    <div className="cart-item-qty-actions">
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                          disabled={isSubmitting}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          disabled={isSubmitting}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        className="item-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                        disabled={isSubmitting}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span>Subtotal</span>
              <span className="cart-total-price">{formatRupees(cartTotal)}</span>
            </div>
            
            {/* Input Details form for background WhatsApp integration */}
            {user && (
              <div className="cart-checkout-form">
                <h4>Consultation Booking Details</h4>
                {bookingError && <div className="checkout-error-alert">{bookingError}</div>}
                
                <div className="form-group checkout-form-group">
                  <label htmlFor="chk-name">Your Full Name</label>
                  <input
                    id="chk-name"
                    type="text"
                    className="form-control chk-control"
                    placeholder="Enter your name"
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group checkout-form-group">
                  <label htmlFor="chk-phone">Contact Phone Number</label>
                  <div className="phone-input-group">
                    <span className="phone-prefix">+91</span>
                    <input
                      id="chk-phone"
                      type="tel"
                      className="form-control chk-control phone-input"
                      placeholder="Enter 10-digit number"
                      maxLength="10"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value.replace(/\D/g, ''))}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="form-group checkout-form-group">
                  <label htmlFor="chk-address">Site Installation Address</label>
                  <textarea
                    id="chk-address"
                    className="form-control chk-control chk-textarea"
                    rows="2"
                    placeholder="Address where measurements/installations are needed"
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            <p className="cart-tax-notice">Standard delivery and customizable installation fees calculated later.</p>
            
            <div className="cart-footer-actions">
              <button 
                className="btn btn-secondary clear-cart-btn" 
                onClick={clearCart}
                disabled={isSubmitting}
              >
                Clear All
              </button>
              {user ? (
                <button 
                  className="btn btn-primary checkout-btn" 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                >
                  <FileText size={16} />
                  <span>{isSubmitting ? 'Booking Request...' : 'Book Consultation'}</span>
                </button>
              ) : (
                <button 
                  className="btn btn-primary checkout-btn" 
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                >
                  Log In to Book
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cart-drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn var(--transition-fast) forwards;
        }

        .cart-drawer-content {
          background-color: var(--bg-card);
          width: 100%;
          max-width: 440px;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(30, 41, 59, 0.15);
          animation: slideInRight var(--transition-normal) forwards;
          border-left: 1px solid var(--border);
        }

        .cart-drawer-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cart-header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cart-bag-icon {
          color: var(--primary);
        }

        .cart-header-title h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .cart-qty-pill {
          background-color: var(--primary-light);
          color: var(--primary-hover);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .cart-close-btn {
          color: var(--text-muted);
          padding: 6px;
          border-radius: var(--radius-full);
        }
        .cart-close-btn:hover {
          color: var(--text-main);
          background-color: var(--bg-input);
          transform: rotate(90deg);
        }

        .cart-drawer-body {
          flex-grow: 1;
          overflow-y: auto;
          padding: 24px;
        }

        /* Empty State */
        .cart-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 80%;
          padding: 0 10px;
        }

        .empty-cart-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--bg-input);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          margin-bottom: 20px;
          border: 1px dashed var(--border);
        }

        .cart-empty-state h4 {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .cart-empty-state p {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        /* Items list */
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cart-item-card {
          display: flex;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }

        .cart-item-img {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-md);
          object-fit: cover;
          border: 1px solid var(--border);
        }

        .cart-item-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
        }

        .cart-item-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.3;
        }

        .cart-item-category {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .cart-item-price {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--primary);
          margin-top: 4px;
        }

        .cart-item-qty-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }

        .qty-controls {
          display: flex;
          align-items: center;
          background-color: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          padding: 2px;
        }

        .qty-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }
        .qty-btn:hover:not(:disabled) {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .qty-value {
          font-size: 0.85rem;
          font-weight: 600;
          min-width: 24px;
          text-align: center;
        }

        .item-remove-btn {
          color: #94a3b8;
        }
        .item-remove-btn:hover:not(:disabled) {
          color: #ef4444;
        }

        /* Footer */
        .cart-drawer-footer {
          padding: 24px;
          border-top: 1px solid var(--border);
          background-color: var(--bg-input);
        }

        .cart-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .cart-total-price {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--primary-hover);
        }

        /* Background Checkout Form inside Drawer */
        .cart-checkout-form {
          border-top: 1px solid var(--border);
          padding-top: 16px;
          margin-top: 16px;
          margin-bottom: 12px;
          text-align: left;
        }

        .cart-checkout-form h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .checkout-form-group {
          margin-bottom: 12px !important;
        }

        .checkout-form-group label {
          font-size: 0.78rem !important;
          font-weight: 600 !important;
          margin-bottom: 4px !important;
        }

        .phone-input-group {
          display: flex;
          align-items: stretch;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background-color: var(--bg-card);
          overflow: hidden;
        }
        
        .phone-prefix {
          display: flex;
          align-items: center;
          background-color: var(--bg-input);
          color: var(--text-muted);
          padding: 0 12px;
          font-size: 0.85rem;
          font-weight: 700;
          border-right: 1px solid var(--border);
        }

        .phone-input {
          border: none !important;
          flex-grow: 1;
          border-radius: 0 !important;
          padding: 8px 12px !important;
          font-size: 0.85rem !important;
          background-color: transparent !important;
        }
        
        .phone-input-group:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-light);
        }

        .chk-control {
          padding: 8px 12px !important;
          font-size: 0.85rem !important;
          border-radius: var(--radius-sm) !important;
        }

        .chk-textarea {
          resize: none;
        }

        .checkout-error-alert {
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
          color: #b91c1c;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .cart-tax-notice {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 20px;
          text-align: left;
        }

        .cart-footer-actions {
          display: flex;
          gap: 12px;
        }

        .clear-cart-btn {
          flex: 1;
          font-size: 0.9rem;
        }

        .checkout-btn {
          flex: 2;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .checkout-btn:disabled {
          background-color: var(--text-muted);
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .cart-drawer-content {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
