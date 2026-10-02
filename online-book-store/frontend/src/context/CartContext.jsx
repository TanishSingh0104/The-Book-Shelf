import { createContext, useContext, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    api
      .get('/cart')
      .then(({ data }) => setItems(data.items))
      .catch((error) => showToast(getErrorMessage(error), 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  const sendCartRequest = async (request, successMessage) => {
    try {
      const { data } = await request();
      setItems(data.items);
      if (successMessage) showToast(successMessage, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const addToCart = (bookId) => sendCartRequest(() => api.post('/cart', { bookId, quantity: 1 }), 'Added to cart');
  const updateQuantity = (bookId, quantity) => sendCartRequest(() => api.put(`/cart/${bookId}`, { quantity }));
  const removeItem = (bookId) => sendCartRequest(() => api.delete(`/cart/${bookId}`), 'Removed from cart');
  const clearCartState = () => setItems([]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, cartCount, cartTotal, addToCart, updateQuantity, removeItem, clearCartState }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
