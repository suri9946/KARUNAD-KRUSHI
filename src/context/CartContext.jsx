import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from sessionStorage on mount
  useEffect(() => {
    const savedCart = sessionStorage.getItem('kk_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from session storage', e);
      }
    }
  }, []);

  // Save cart to sessionStorage on change
  const saveCart = (items) => {
    setCartItems(items);
    sessionStorage.setItem('kk_cart', JSON.stringify(items));
  };

  const addToCart = (product, variant, quantity = 1) => {
    const existingIndex = cartItems.findIndex(item => item.variantSku === variant.sku);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      saveCart(updated);
    } else {
      const newItem = {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        mainImageUrl: product.main_image_url,
        variantSku: variant.sku,
        size: variant.size,
        price: variant.price,
        quantity: quantity,
        maxStock: variant.stock
      };
      saveCart([...cartItems, newItem]);
    }
    setIsCartOpen(true); // Auto-open cart when adding an item
  };

  const removeFromCart = (variantSku) => {
    const filtered = cartItems.filter(item => item.variantSku !== variantSku);
    saveCart(filtered);
  };

  const updateQuantity = (variantSku, newQty) => {
    const updated = cartItems.map(item => {
      if (item.variantSku === variantSku) {
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
