import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../services/format.js';
import { Loader, EmptyState } from '../components/Status.jsx';

const Cart = () => {
  const { items, loading, cartTotal, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="container page"><Loader text="Loading cart..." /></div>;

  if (items.length === 0) {
    return (
      <div className="container page">
        <EmptyState title="Your cart is empty" text="Add some books to get started.">
          <Link to="/books" className="btn">Browse Books</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <div key={item.book._id} className="card cart-item">
              <img src={item.book.image} alt={item.book.title} />
              <div className="cart-item-info">
                <h3><Link to={`/books/${item.book._id}`}>{item.book.title}</Link></h3>
                <p className="muted">{item.book.author}</p>
                <p>{formatPrice(item.book.price)}</p>
              </div>
              <div className="cart-item-actions">
                <div className="quantity">
                  <button onClick={() => updateQuantity(item.book._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.book._id, item.quantity + 1)}>+</button>
                </div>
                <strong>{formatPrice(item.book.price * item.quantity)}</strong>
                <button className="btn btn-danger btn-small" onClick={() => removeItem(item.book._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="card summary">
          <h3>Order Summary</h3>
          <div className="row-between">
            <span>Total</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>
          <button className="btn btn-full" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
