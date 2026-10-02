// Shoppingheader.jsx - Navigation bar for the shopping site

import { Search, ShoppingCart, Heart, CircleUser } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useUser } from '../context/UserContext';
import logo from '../assets/elogo.png';
import '../index.scss';

export default function Shoppingheader() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/products/filters/options");
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('http://localhost:5000/products');
      const data = await res.json();
      if (data.success) setProducts(data.products);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q)
    ));
  }, [query, products]);

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    const names = name.trim().split(' ').filter(Boolean);
    return names.length === 1 ? names[0][0].toUpperCase() : (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/shop/home');
  };

  const handleAuthLink = (event, destination) => {
    if (!user) {
      event.preventDefault();
      navigate('/auth/login', { state: { from: destination } });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary text-white pt-3 pb-3">
      <div className="container">

        {/* Logo & Toggle */}
        <div className="d-flex w-100 align-items-center justify-content-between">
          <Link to="/shop/home" className="navbar-brand mb-0">
            <img src={logo} alt="ShopSphere Logo" style={{ maxWidth: '260px' }} />
          </Link>
          <div className="d-none d-md-flex d-xl-none align-items-center gap-3 ms-auto me-3">
            <Link to="/shop/cart" onClick={(event) => handleAuthLink(event, '/shop/cart')} className="nav-icon-link position-relative text-white">
              <ShoppingCart size={22} color="white" strokeWidth={2.2} />
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning" style={{ fontSize: '0.6rem' }}>
                  {totalItems}
                </span>
              )}
            </Link>
            <Link to="/shop/wishlist" onClick={(event) => handleAuthLink(event, '/shop/wishlist')} className="nav-icon-link position-relative text-white">
              <Heart size={22} color="white" strokeWidth={2.2} />
              {wishlist.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning" style={{ fontSize: '0.6rem' }}>
                  {wishlist.length}
                </span>
              )}
            </Link>
          </div>
          <button
            className="navbar-toggler bg-white text-white"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
            aria-controls="mobileMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Desktop Navbar Content */}
        <div className="collapse navbar-collapse mt-3 mt-lg-0 d-none d-lg-block" id="navbarContent">
          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-lg-between ms-4 ms-lg-0">

            {/* Navigation Links */}
            <ul className="navbar-nav flex-column flex-lg-row gap-2 gap-lg-3 mb-3 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/shop/home">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/shop/listing">Shop</Link></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" role="button">
                  Categories
                </a>
                <ul className="dropdown-menu">
                  {categories.map((cat, i) => (
                    <li key={i}>
                      <Link className="dropdown-item fw-normal" to={`/shop/listing?category=${encodeURIComponent(cat)}`}>
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item"><Link className="nav-link" to="/shop/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link text-nowrap " to="/shop/contact">Contact Us</Link></li>
            </ul>

            {/* Icons */}
            <div className="d-flex align-items-center gap-3 position-relative ms-2">
              <div style={{ cursor: 'pointer' }} onClick={() => setShowSearch(!showSearch)}>
                <Search />
              </div>

              {showSearch && (
                <div style={{ position: 'absolute', top: '40px', right: 0, width: '250px', zIndex: 1050 }}>
                  <input
                    type="text"
                    className="form-control form-control-sm shadow"
                    placeholder="Search for products..."
                    value={query}
                    autoFocus
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && query.trim()) {
                        window.location.href = `/shop/search?q=${encodeURIComponent(query.trim())}`;
                        setShowSearch(false);
                        setQuery('');
                      }
                    }}
                  />
                  {query && (
                    <div className="bg-white border shadow-sm rounded mt-1 p-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      {filtered.length === 0 ? (
                        <div className="text-muted small">No results found</div>
                      ) : (
                        filtered.slice(0, 5).map(p => (
                          <Link
                            key={p._id}
                            to={`/shop/product/${p._id}`}
                            className="d-block text-dark text-decoration-none mb-1"
                            onClick={() => {
                              setShowSearch(false);
                              setQuery('');
                            }}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <img src={p.image} alt={p.name} width="40" height="40" style={{ objectFit: 'cover' }} />
                              <span>{p.name}</span>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              <Link to="/shop/cart" onClick={(event) => handleAuthLink(event, '/shop/cart')} className="nav-icon-link position-relative text-white">
                <ShoppingCart size={22} color="white" strokeWidth={2.2} />
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning" style={{ fontSize: '0.6rem' }}>
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link to="/shop/wishlist" onClick={(event) => handleAuthLink(event, '/shop/wishlist')} className="nav-icon-link position-relative text-white">
                <Heart size={22} color="white" strokeWidth={2.2} />
                {wishlist.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning" style={{ fontSize: '0.6rem' }}>
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <div className="nav-item dropdown">
                {user ? (
                  <>
                    <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" data-bs-toggle="dropdown">
                      <div className="user-initial rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '14px' }}>
                        {getInitials(user?.username)}
                      </div>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end mt-2">
                      {user.role === 'admin' && (
                        <li><Link className="dropdown-item" to="/admin/dashboard">Admin Dashboard</Link></li>
                      )}
                      <li><Link className="dropdown-item" to="/shop/account">Account</Link></li>
                      <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </>
                ) : (
                  <Link to="/auth/login" className="nav-link">
                    <CircleUser size={28} />
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Offcanvas for Mobile Menu */}
        <div className="offcanvas offcanvas-start bg-primary text-white d-lg-none" tabIndex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="mobileMenuLabel">
              <img src={logo} alt=""  style={{width:"250px", marginTop:"15px"}}/>
            </h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav">
              <li className="nav-item"><Link className="nav-link text-white" to="/shop/home">Home</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/shop/listing">Shop</Link></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white" href="#" data-bs-toggle="dropdown">Categories</a>
                <ul className="dropdown-menu">
                  {categories.map((cat, i) => (
                    <li key={i}>
                      <Link className="dropdown-item" to={`/shop/listing?category=${encodeURIComponent(cat)}`}>{cat}</Link>
                    </li>
                  ))}
                </ul>
              </li>
             <li className="nav-item"><Link className="nav-link text-white" to="/shop/about">About</Link></li>
             <li className="nav-item"><Link className="nav-link text-white" to="/shop/contact">Contact Us</Link></li>

            </ul>

            {/* Icons */}
            <div className="d-flex align-items-center gap-3 position-relative ms-2 mt-3">
              <div style={{ cursor: 'pointer' }} onClick={() => setShowSearch(!showSearch)}>
                <Search />
              </div>

              {showSearch && (
                <div style={{ position: 'absolute', top: '40px', right: 110, width: '250px', zIndex: 1050 }}>
                  <input
                    type="text"
                    className="form-control form-control-sm shadow"
                    placeholder="Search for products..."
                    value={query}
                    autoFocus
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && query.trim()) {
                        window.location.href = `/shop/search?q=${encodeURIComponent(query.trim())}`;
                        setShowSearch(false);
                        setQuery('');
                      }
                    }}
                  />
                  {query && (
                    <div className="bg-white border shadow-sm rounded mt-1 p-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      {filtered.length === 0 ? (
                        <div className="text-muted small">No results found</div>
                      ) : (
                        filtered.slice(0, 5).map(p => (
                          <Link
                            key={p._id}
                            to={`/shop/product/${p._id}`}
                            className="d-block text-dark text-decoration-none mb-1"
                            onClick={() => {
                              setShowSearch(false);
                              setQuery('');
                            }}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <img src={p.image} alt={p.name} width="40" height="40" style={{ objectFit: 'cover' }} />
                              <span>{p.name}</span>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              <Link to="/shop/cart" onClick={(event) => handleAuthLink(event, '/shop/cart')} className="nav-icon-link position-relative text-white">
                <ShoppingCart size={22} color="white" strokeWidth={2.2} />
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning" style={{ fontSize: '0.6rem' }}>
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link to="/shop/wishlist" onClick={(event) => handleAuthLink(event, '/shop/wishlist')} className="nav-icon-link position-relative text-white">
                <Heart size={22} color="white" strokeWidth={2.2} />
                {wishlist.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning" style={{ fontSize: '0.6rem' }}>
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <div className="nav-item dropdown">
                {user ? (
                  <>
                    <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" data-bs-toggle="dropdown">
                      <div className="user-initial rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '14px' }}>
                        {getInitials(user?.username)}
                      </div>
                    </a>
                    <ul className="dropdown-menu dropdown-menu mt-2">
                      {user.role === 'admin' && (
                        <li><Link className="dropdown-item" to="/admin/dashboard">Admin Dashboard</Link></li>
                      )}
                      <li><Link className="dropdown-item" to="/shop/account">Account</Link></li>
                      <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </>
                ) : (
                  <Link to="/auth/login" className="nav-link">
                    <CircleUser size={28} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
