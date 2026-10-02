const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Book = require('../models/Book');
const Order = require('../models/Order');

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_METHODS = ['Cash on Delivery', 'Demo Payment'];

const placeOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const addressFields = ['fullName', 'phone', 'address', 'city', 'postalCode'];
  if (!shippingAddress || addressFields.some((field) => !shippingAddress[field])) {
    res.status(400);
    throw new Error('Please fill in the complete shipping address');
  }
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    res.status(400);
    throw new Error('Please select a valid payment method');
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
  const cartItems = cart ? cart.items.filter((item) => item.book) : [];
  if (cartItems.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  for (const item of cartItems) {
    if (item.book.stock < item.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for "${item.book.title}". Available: ${item.book.stock}`);
    }
  }

  const orderItems = cartItems.map((item) => ({
    book: item.book._id,
    title: item.book.title,
    image: item.book.image,
    price: item.book.price,
    quantity: item.quantity,
  }));
  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
  });

  for (const item of cartItems) {
    await Book.findByIdAndUpdate(item.book._id, { $inc: { stock: -item.quantity } });
  }

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid order ID');
  }
  if (!ORDER_STATUSES.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }

  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();
  res.json(order);
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
