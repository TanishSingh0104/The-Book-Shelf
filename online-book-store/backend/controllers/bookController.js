const mongoose = require('mongoose');
const Book = require('../models/Book');

const checkValidId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid book ID');
  }
};

const getBooks = async (req, res) => {
  const { search, category, sort, limit } = req.query;
  const filter = {};

  if (search) {
    const pattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: pattern }, { author: pattern }];
  }
  if (category && category !== 'All') {
    filter.category = category;
  }

  let query = Book.find(filter).sort(sort === 'rating' ? { rating: -1 } : { createdAt: -1 });
  if (limit) {
    query = query.limit(Number(limit));
  }

  res.json(await query);
};

const getCategories = async (req, res) => {
  res.json(await Book.distinct('category'));
};

const getBookById = async (req, res) => {
  checkValidId(req.params.id, res);
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  res.json(book);
};

const createBook = async (req, res) => {
  const { title, author, description, price, category } = req.body;
  if (!title || !author || !description || price === undefined || !category) {
    res.status(400);
    throw new Error('Title, author, description, price and category are required');
  }
  const book = await Book.create(req.body);
  res.status(201).json(book);
};

const updateBook = async (req, res) => {
  checkValidId(req.params.id, res);
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  res.json(book);
};

const deleteBook = async (req, res) => {
  checkValidId(req.params.id, res);
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  res.json({ message: 'Book deleted' });
};

module.exports = { getBooks, getCategories, getBookById, createBook, updateBook, deleteBook };
