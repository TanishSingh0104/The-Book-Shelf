import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import BookCard from '../components/BookCard.jsx';
import { Loader, ErrorMessage } from '../components/Status.jsx';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksResponse, categoriesResponse] = await Promise.all([
          api.get('/books?sort=rating&limit=4'),
          api.get('/books/categories'),
        ]);
        setFeaturedBooks(booksResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Find your next favourite book</h1>
          <p>Browse fiction, technology, finance and more. Order online and pay on delivery.</p>
          <Link to="/books" className="btn btn-light">Browse Books</Link>
        </div>
      </section>

      <section className="container page">
        <h2>Featured Books</h2>
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        <div className="grid">
          {featuredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>

      <section className="container page">
        <h2>Categories</h2>
        <div className="category-list">
          {categories.map((category) => (
            <Link key={category} to={`/books?category=${encodeURIComponent(category)}`} className="category-item">
              {category}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
