import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import BookCard from '../components/BookCard.jsx';
import { Loader, ErrorMessage, EmptyState } from '../components/Status.jsx';

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';

  const [searchText, setSearchText] = useState(search);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/books/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/books', { params: { search, category } });
        setBooks(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [search, category]);

  const updateFilters = (newSearch, newCategory) => {
    const params = {};
    if (newSearch) params.search = newSearch;
    if (newCategory !== 'All') params.category = newCategory;
    setSearchParams(params);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateFilters(searchText.trim(), category);
  };

  const handleClear = () => {
    setSearchText('');
    setSearchParams({});
  };

  return (
    <div className="container page">
      <h1>All Books</h1>

      <form className="filters" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <select value={category} onChange={(event) => updateFilters(search, event.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <button type="submit" className="btn">Search</button>
        <button type="button" className="btn btn-outline" onClick={handleClear}>Clear</button>
      </form>

      {loading && <Loader text="Loading books..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && books.length === 0 && (
        <EmptyState title="No books found" text="Try a different search or category." />
      )}

      <div className="grid">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Books;
