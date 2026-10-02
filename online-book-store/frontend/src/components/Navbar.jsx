import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={closeMenu}>The Book Shelf</Link>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/books" onClick={closeMenu}>Books</NavLink>
          <NavLink to="/cart" onClick={closeMenu}>Cart ({cartCount})</NavLink>
          {user && <NavLink to="/orders" onClick={closeMenu}>My Orders</NavLink>}
          {user && user.role === 'admin' && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
          {user ? (
            <>
              <NavLink to="/profile" onClick={closeMenu}>{user.name}</NavLink>
              <button className="btn btn-outline btn-small" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
              <Link to="/register" className="btn btn-small" onClick={closeMenu}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
