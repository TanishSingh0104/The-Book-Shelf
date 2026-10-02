const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const User = require('./models/User');
const Book = require('./models/Book');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const cover = (title, color) =>
  `https://placehold.co/300x420/${color}/ffffff?text=${encodeURIComponent(title)}`;

const books = [
  { title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', price: 499, stock: 25, rating: 4.8, color: '2a6f97', description: 'A practical guide to building good habits and breaking bad ones through small daily changes.' },
  { title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', price: 299, stock: 30, rating: 4.5, color: 'b5651d', description: 'A shepherd boy travels in search of treasure and learns to follow his dreams along the way.' },
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', price: 649, stock: 15, rating: 4.6, color: '3d405b', description: 'A handbook of good practices for writing readable and maintainable code.' },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Technology', price: 699, stock: 12, rating: 4.7, color: '264653', description: 'Tips and ideas for becoming a better and more effective software developer.' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', price: 549, stock: 20, rating: 4.6, color: '6a4c93', description: 'A brief history of humankind, from early humans to the modern world.' },
  { title: 'Wings of Fire', author: 'A. P. J. Abdul Kalam', category: 'Biography', price: 250, stock: 40, rating: 4.7, color: 'c44536', description: 'The life story of Dr. Kalam, from a small town in Tamil Nadu to leading India\'s space and missile programmes.' },
  { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', category: 'Finance', price: 350, stock: 35, rating: 4.3, color: '2d6a4f', description: 'A look at how two father figures shaped the author\'s thinking about money and investing.' },
  { title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Finance', price: 399, stock: 28, rating: 4.7, color: '1d3557', description: 'Short stories about how people think about money and why behaviour matters more than knowledge.' },
  { title: '1984', author: 'George Orwell', category: 'Fiction', price: 275, stock: 22, rating: 4.6, color: '7f1d1d', description: 'A dystopian novel about surveillance, control and the loss of individual freedom.' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classics', price: 199, stock: 18, rating: 4.5, color: '9d4e6c', description: 'A classic story of love, family and social expectations in 19th century England.' },
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Technology', price: 1299, stock: 8, rating: 4.5, color: '344e41', description: 'A detailed textbook covering the core algorithms and data structures used in computer science.' },
  { title: 'The Discovery of India', author: 'Jawaharlal Nehru', category: 'History', price: 380, stock: 14, rating: 4.4, color: 'bc6c25', description: 'Nehru\'s reflections on the history, culture and philosophy of India, written during imprisonment.' },
].map(({ color, ...book }) => ({ ...book, image: cover(book.title, color) }));

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Order.deleteMany();
    await Cart.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    await User.create({ name: 'Admin', email: 'admin@bookstore.com', password: 'admin123', role: 'admin' });
    await User.create({ name: 'Demo User', email: 'user@bookstore.com', password: 'user123', role: 'user' });
    await Book.insertMany(books);

    console.log('Sample data added');
    console.log('Admin login: admin@bookstore.com / admin123');
    console.log('User login: user@bookstore.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
