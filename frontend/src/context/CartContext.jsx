import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ecommerce_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    if (product.stockCount <= 0) {
      showToast('This product is currently out of stock', 'error');
      return;
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product._id === product._id);
      if (existing) {
        if (existing.qty >= product.stockCount) {
          showToast(`Maximum available stock (${product.stockCount}) reached`, 'error');
          return prevItems;
        }
        showToast(`Updated ${product.name} quantity in cart`, 'success');
        return prevItems.map((item) =>
          item.product._id === product._id
            ? { ...item, qty: Math.min(item.qty + qty, product.stockCount) }
            : item
        );
      }
      showToast(`Added ${product.name} to cart`, 'success');
      return [...prevItems, { product, qty: Math.min(qty, product.stockCount) }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product._id === productId) {
          const maxStock = item.product.stockCount || 99;
          if (qty > maxStock) {
            showToast(`Only ${maxStock} units available in stock`, 'error');
            return item;
          }
          return { ...item, qty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
