import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { formatDate, formatPrice } from '../services/format.js';
import { Loader, ErrorMessage, EmptyState } from '../components/Status.jsx';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map((order) => (order._id === orderId ? data : order)));
      showToast('Order status updated');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <div className="container page">
      <h1>Manage Orders</h1>
      {loading && <Loader text="Loading orders..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && orders.length === 0 && <EmptyState title="No orders yet" />}

      {orders.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6).toUpperCase()}</td>
                  <td>
                    {order.user ? order.user.name : 'Deleted user'}
                    <br />
                    <span className="muted">{order.user && order.user.email}</span>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.items.map((item) => `${item.title} x ${item.quantity}`).join(', ')}</td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <select value={order.status} onChange={(event) => handleStatusChange(order._id, event.target.value)}>
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
