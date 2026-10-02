import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../services/format.js';

const BookCard = ({ book }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: '/books' } });
      return;
    }
    addToCart(book._id);
  };

  return (
    <div className="card book-card">
      <Link to={`/books/${book._id}`}>
        <img src={book.image} alt={book.title} />
      </Link>
      <div className="book-card-body">
        <span className="tag">{book.category}</span>
        <h3><Link to={`/books/${book._id}`}>{book.title}</Link></h3>
        <p className="muted">by {book.author}</p>
        <div className="row-between">
          <strong>{formatPrice(book.price)}</strong>
          <span className="rating">★ {book.rating.toFixed(1)}</span>
        </div>
        <button className="btn btn-full" onClick={handleAddToCart} disabled={book.stock < 1}>
          {book.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
