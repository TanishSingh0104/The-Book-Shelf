import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { formatDate, formatPrice } from '../services/format.js';
import { Loader, ErrorMessage, EmptyState } from '../components/Status.jsx';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  return (
    <div className="container page">
      <h1>My Orders</h1>
      {loading && <Loader text="Loading orders..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && orders.length === 0 && (
        <EmptyState title="No orders yet" text="Your placed orders will appear here.">
          <Link to="/books" className="btn">Browse Books</Link>
        </EmptyState>
      )}

      {orders.map((order) => (
        <div key={order._id} className="card order-card">
          <div className="row-between">
            <div>
              <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
              <p className="muted">{formatDate(order.createdAt)} | {order.paymentMethod}</p>
            </div>
            <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
          </div>
          {order.items.map((item) => (
            <div key={item._id} className="row-between summary-line">
              <span>{item.title} x {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <p className="muted">
            Ship to: {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}
          </p>
          <div className="row-between total-line">
            <strong>Total</strong>
            <strong>{formatPrice(order.totalAmount)}</strong>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
