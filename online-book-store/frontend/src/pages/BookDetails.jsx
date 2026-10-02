import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../services/format.js';
import { Loader, ErrorMessage } from '../components/Status.jsx';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBook = async () => {
      try {
        const { data } = await api.get(`/books/${id}`);
        setBook(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: `/books/${id}` } });
      return;
    }
    addToCart(book._id);
  };

  if (loading) return <div className="container page"><Loader /></div>;
  if (error) {
    return (
      <div className="container page">
        <ErrorMessage message={error} />
        <Link to="/books" className="btn">Back to books</Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <Link to="/books" className="back-link">&larr; Back to books</Link>
      <div className="details">
        <img src={book.image} alt={book.title} />
        <div>
          <span className="tag">{book.category}</span>
          <h1>{book.title}</h1>
          <p className="muted">by {book.author}</p>
          <p className="rating">★ {book.rating.toFixed(1)} / 5</p>
          <p className="price">{formatPrice(book.price)}</p>
          <p>{book.description}</p>
          <p className={book.stock > 0 ? 'in-stock' : 'out-of-stock'}>
            {book.stock > 0 ? `In stock (${book.stock} available)` : 'Out of stock'}
          </p>
          <button className="btn" onClick={handleAddToCart} disabled={book.stock < 1}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
