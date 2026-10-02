const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Book = require('../models/Book');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const sendCart = async (cartId, res, statusCode = 200) => {
  const cart = await Cart.findById(cartId).populate('items.book');
  cart.items = cart.items.filter((item) => item.book);
  await cart.save();
  res.status(statusCode).json(cart);
};

const findBookOrFail = async (bookId, res) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    res.status(400);
    throw new Error('Invalid book ID');
  }
  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  return book;
};

const getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await sendCart(cart._id, res);
};

const addToCart = async (req, res) => {
  const { bookId } = req.body;
  const quantity = Number(req.body.quantity) || 1;
  const book = await findBookOrFail(bookId, res);

  if (book.stock < 1) {
    res.status(400);
    throw new Error(`"${book.title}" is out of stock`);
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((item) => item.book.toString() === bookId);
  const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

  if (newQuantity > book.stock) {
    res.status(400);
    throw new Error(`Only ${book.stock} copies of "${book.title}" available`);
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({ book: bookId, quantity });
  }
  await cart.save();
  await sendCart(cart._id, res, 201);
};

const updateCartItem = async (req, res) => {
  const { bookId } = req.params;
  const quantity = Number(req.body.quantity);
  const book = await findBookOrFail(bookId, res);

  if (!Number.isInteger(quantity) || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }
  if (quantity > book.stock) {
    res.status(400);
    throw new Error(`Only ${book.stock} copies of "${book.title}" available`);
  }

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((cartItem) => cartItem.book.toString() === bookId);
  if (!item) {
    res.status(404);
    throw new Error('Book is not in your cart');
  }

  item.quantity = quantity;
  await cart.save();
  await sendCart(cart._id, res);
};

const removeFromCart = async (req, res) => {
  const { bookId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    res.status(400);
    throw new Error('Invalid book ID');
  }

  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
  await cart.save();
  await sendCart(cart._id, res);
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
