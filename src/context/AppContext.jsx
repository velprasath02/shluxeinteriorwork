import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const CATEGORIES = [
  'Home',
  'Modular Kitchen',
  'bedroom cupboard',
  'TV units & Cupboards',
  'showcase',
  'Wooden Door',
  'pooja cupboard',
  'furniture',
  'Model Wood Carving'
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('sh_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sh_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeCategory, setActiveCategory] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch initial data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [prodRes, revRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/reviews`)
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
        if (revRes.ok) {
          const revData = await revRes.json();
          setReviews(revData);
        }
      } catch (err) {
        console.error('Error fetching database:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync cart and user to LocalStorage
  useEffect(() => {
    localStorage.setItem('sh_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sh_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sh_user');
    }
  }, [user]);

  // Product actions - posts multipart FormData to backend
  const addProduct = async (formData) => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        body: formData // raw FormData (browser sets Content-Type automatically with boundary)
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts((prev) => [newProduct, ...prev]);
        return { success: true, product: newProduct };
      } else {
        const errData = await response.json();
        return { success: false, error: errData.error || 'Failed to add product card' };
      }
    } catch (err) {
      console.error('Error calling addProduct API:', err);
      return { success: false, error: 'Network error occurred while uploading' };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        return { success: true };
      } else {
        const errData = await response.json();
        return { success: false, error: errData.error || 'Failed to delete product card' };
      }
    } catch (err) {
      console.error('Error calling deleteProduct API:', err);
      return { success: false, error: 'Network error occurred while deleting' };
    }
  };

  // Cart actions
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Authentication - connects to Express backend endpoints
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoginModalOpen(false);
        return { success: true, role: data.user.role };
      } else {
        const err = await response.json();
        return { success: false, message: err.error || 'Invalid credentials' };
      }
    } catch (err) {
      console.error('Login API error:', err);
      return { success: false, message: 'Server communication error' };
    }
  };

  const register = async (username, password, email) => {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoginModalOpen(false);
        return { success: true };
      } else {
        const err = await response.json();
        return { success: false, error: err.error || 'Registration failed' };
      }
    } catch (err) {
      console.error('Registration API error:', err);
      return { success: false, error: 'Server communication error' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Review actions - posts JSON to backend
  const addReview = async (reviewData) => {
    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews((prev) => [newReview, ...prev]);
        return { success: true, review: newReview };
      }
    } catch (err) {
      console.error('Error posting review feedback:', err);
    }
    return { success: false };
  };

  const bookConsultation = async (bookingDetails) => {
    try {
      const response = await fetch(`${API_BASE}/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails)
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        return { success: true, ...data };
      } else {
        const err = await response.json();
        return { success: false, error: err.error || 'Failed to submit consultation booking' };
      }
    } catch (err) {
      console.error('Booking consultation error:', err);
      return { success: false, error: 'Network error. Make sure backend server is active.' };
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        categories: CATEGORIES,
        products,
        reviews,
        isLoading,
        cart,
        cartItemCount,
        cartTotal,
        user,
        activeCategory,
        searchQuery,
        isLoginModalOpen,
        isCartOpen,
        selectedProduct,
        setSelectedProduct,
        setActiveCategory,
        setSearchQuery,
        setIsLoginModalOpen,
        setIsCartOpen,
        addProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        login,
        register,
        logout,
        addReview,
        bookConsultation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
