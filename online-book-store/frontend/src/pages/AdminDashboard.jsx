import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { formatPrice } from '../services/format.js';
import { Loader, ErrorMessage } from '../components/Status.jsx';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksResponse, ordersResponse] = await Promise.all([api.get('/books'), api.get('/orders')]);
        setBooks(booksResponse.data);
        setOrders(ordersResponse.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const pendingOrders = orders.filter((order) => order.status === 'Pending').length;
  const revenue = orders
    .filter((order) => order.status !== 'Cancelled')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="container page">
      <h1>Admin Dashboard</h1>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <div className="stats">
          <div className="card stat"><span>Total Books</span><strong>{books.length}</strong></div>
          <div className="card stat"><span>Total Orders</span><strong>{orders.length}</strong></div>
          <div className="card stat"><span>Pending Orders</span><strong>{pendingOrders}</strong></div>
          <div className="card stat"><span>Revenue</span><strong>{formatPrice(revenue)}</strong></div>
        </div>
      )}
      <div className="button-row">
        <Link to="/admin/books" className="btn">Manage Books</Link>
        <Link to="/admin/orders" className="btn">Manage Orders</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
