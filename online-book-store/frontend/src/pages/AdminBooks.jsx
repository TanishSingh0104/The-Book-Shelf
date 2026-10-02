import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice } from '../services/format.js';
import { Loader, ErrorMessage, EmptyState } from '../components/Status.jsx';

const emptyForm = {
  title: '',
  author: '',
  category: '',
  price: '',
  stock: '',
  rating: '',
  image: '',
  description: '',
};

const AdminBooks = () => {
  const { showToast } = useToast();
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBooks = async () => {
    try {
      const { data } = await api.get('/books');
      setBooks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.author || !form.category || !form.description || form.price === '') {
      showToast('Title, author, category, description and price are required', 'error');
      return;
    }

    const bookData = {
      title: form.title,
      author: form.author,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 0,
    };
    if (form.image) bookData.image = form.image;

    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, bookData);
        showToast('Book updated');
      } else {
        await api.post('/books', bookData);
        showToast('Book added');
      }
      resetForm();
      loadBooks();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price,
      stock: book.stock,
      rating: book.rating,
      image: book.image,
      description: book.description,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    try {
      await api.delete(`/books/${book._id}`);
      showToast('Book deleted');
      loadBooks();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <div className="container page">
      <h1>Manage Books</h1>

      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Book' : 'Add New Book'}</h3>
        <div className="form-grid">
          <div><label>Title</label><input name="title" value={form.title} onChange={handleChange} /></div>
          <div><label>Author</label><input name="author" value={form.author} onChange={handleChange} /></div>
          <div><label>Category</label><input name="category" value={form.category} onChange={handleChange} /></div>
          <div><label>Price (₹)</label><input type="number" min="0" name="price" value={form.price} onChange={handleChange} /></div>
          <div><label>Stock</label><input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} /></div>
          <div><label>Rating (0-5)</label><input type="number" min="0" max="5" step="0.1" name="rating" value={form.rating} onChange={handleChange} /></div>
        </div>
        <label>Image URL</label>
        <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
        <label>Description</label>
        <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
        <div className="button-row">
          <button className="btn">{editingId ? 'Save Changes' : 'Add Book'}</button>
          {editingId && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && books.length === 0 && <EmptyState title="No books yet" text="Add your first book above." />}

      {books.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{formatPrice(book.price)}</td>
                  <td>{book.stock}</td>
                  <td>{book.rating}</td>
                  <td>
                    <div className="button-row">
                      <button className="btn btn-small" onClick={() => handleEdit(book)}>Edit</button>
                      <button className="btn btn-danger btn-small" onClick={() => handleDelete(book)}>Delete</button>
                    </div>
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

export default AdminBooks;
