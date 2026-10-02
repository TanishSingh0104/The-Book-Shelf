import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice } from '../services/format.js';
import { EmptyState } from '../components/Status.jsx';

const Checkout = () => {
  const { user } = useAuth();
  const { items, cartTotal, clearCartState } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user.name,
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setAddress({ ...address, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (Object.values(address).some((value) => !value.trim())) {
      setError('Please fill in all shipping address fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/orders', { shippingAddress: address, paymentMethod });
      clearCartState();
      showToast('Order placed successfully');
      navigate('/orders');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container page">
        <EmptyState title="Your cart is empty" text="Add books to your cart before checking out.">
          <Link to="/books" className="btn">Browse Books</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>Checkout</h1>
      <div className="cart-layout">
        <form className="card" onSubmit={handleSubmit}>
          <h3>Shipping Address</h3>
          {error && <p className="status status-error">{error}</p>}
          <label>Full Name</label>
          <input name="fullName" value={address.fullName} onChange={handleChange} />
          <label>Phone</label>
          <input name="phone" value={address.phone} onChange={handleChange} />
          <label>Address</label>
          <input name="address" value={address.address} onChange={handleChange} />
          <label>City</label>
          <input name="city" value={address.city} onChange={handleChange} />
          <label>Postal Code</label>
          <input name="postalCode" value={address.postalCode} onChange={handleChange} />

          <h3>Payment Method</h3>
          <label className="radio">
            <input
              type="radio"
              checked={paymentMethod === 'Cash on Delivery'}
              onChange={() => setPaymentMethod('Cash on Delivery')}
            />
            Cash on Delivery
          </label>
          <label className="radio">
            <input
              type="radio"
              checked={paymentMethod === 'Demo Payment'}
              onChange={() => setPaymentMethod('Demo Payment')}
            />
            Demo Payment (no real money)
          </label>

          <button className="btn btn-full" disabled={submitting}>
            {submitting ? 'Placing order...' : 'Place Order'}
          </button>
        </form>

        <div className="card summary">
          <h3>Your Items</h3>
          {items.map((item) => (
            <div key={item.book._id} className="row-between summary-line">
              <span>{item.book.title} x {item.quantity}</span>
              <span>{formatPrice(item.book.price * item.quantity)}</span>
            </div>
          ))}
          <div className="row-between total-line">
            <strong>Total</strong>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
