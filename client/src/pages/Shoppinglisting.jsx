import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import Productfilter from './Productfilter';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import LoadingSpinner from '../components/Spinner';

export default function ProductListingPage() {
  // Sidebar toggle for mobile
  const [showSidebar, setShowSidebar] = useState(false);

  // URL search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Products data
  const [products, setProducts] = useState([]);

  // Location to detect route changes
  const location = useLocation();

  //spinner
  const [loading, setLoading] = useState(true);

  // Cart and wishlist context
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = Number(searchParams.get('page')) || 1;

  // Product filter state
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    price: null,
    sort: '',
  });

  // Returns quantity of product in cart
  const getQuantity = (productId) => {
    const item = cart.find(p => p.product._id === productId);
    return item ? item.quantity : 0;
  };

  // Initialize filters from URL query params
  useEffect(() => {
    const initialFilters = {
      category: searchParams.getAll('category') || [],
      brand: searchParams.getAll('brand') || [],
      price: Number(searchParams.get('price')) || null,
      sort: searchParams.get('sort') || '',
    };
    setLoading(true);
    setFilters(initialFilters);
  }, [searchParams]);

  // Update URL query params when filters or page changes
  const updateURL = (newFilters, newPage = 1) => {
    const params = new URLSearchParams();
    newFilters.category.forEach((cat) => cat && params.append('category', cat));
    newFilters.brand.forEach((brand) => brand && params.append('brand', brand));
    if (newFilters.price) params.set('price', newFilters.price);
    if (newFilters.sort && newFilters.sort !== 'Sort by') {
      params.set('sort', newFilters.sort);
    }
    params.set('page', newPage);
    setSearchParams(params);
  };

  // Handle changes in filters (checkboxes, price, etc.)
  const handleFilterChange = (type, value, checked) => {
    setFilters((prev) => {
      let updated = { ...prev };
      if (type === 'price') {
        updated.price = value;
      } else {
        updated[type] = checked
          ? [...prev[type], value]
          : prev[type].filter((item) => item !== value);
      }
      updateURL(updated);

      return updated;
    });
  };

  // Handle sorting dropdown changes
  const handleSortChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => {
      const updated = { ...prev, sort: value };
      updateURL(updated);
      return updated;
    });
  };

  // Fetch products when URL params change
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  // Fetch products from backend API
  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams(searchParams);
      query.set('limit', 9); // Limit products per page
      const res = await fetch(`http://localhost:5000/products?${query.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    finally {
      setLoading(false);
    }
  };
  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-5">

      {/* Toast notifications */}
      <Toaster position="top-right" autoClose={3000} />

      <div className="row">
        {/* Sidebar (Desktop) */}
        <div className="col-md-3 border-end d-none d-md-block ">
          <Productfilter onChange={handleFilterChange} selectedFilters={filters} />
        </div>

        {/* Product grid */}
        <div className="col-md-9 mt-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold">All Products</h5>

            {/* Sidebar toggle for mobile */}
            <button className="btn btn-outline-dark d-md-none" onClick={() => setShowSidebar(true)}>
              ☰ Filter
            </button>

            {/* Sort dropdown (desktop) */}
            <div className="d-none d-md-block">
              <select className="form-select form-select-sm w-auto" onChange={handleSortChange} value={filters.sort}>
                <option>Sort by</option>
                <option value="low_high">Price: Low to High</option>
                <option value="high_low">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
          <hr />

          <div className="row">
            {/* No products fallback */}
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              // Render each product
              products.map((product) => {
                const isWishlisted = wishlist.some(item => item._id === product._id);
                const quantity = getQuantity(product._id);

                return (
                  <div className="col-12 col-md-6 mb-4 d-flex" key={product._id}>
                    <div className="card rounded shadow-medium h-100 d-flex flex-column">

                      {/* Wishlist toggle button */}
                      <button
                        className="btn p-0 border-0 bg-transparent position-absolute top-0 end-0 m-2"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                          toast[isWishlisted ? 'error' : 'success'](
                            `Prdouct ${isWishlisted ? 'removed from' : 'added to'} wishlist`,
                            { toastId: `wishlist-${product._id}` }
                          );
                        }}
                      >
                        <Heart
                          color={isWishlisted ? '#ffc107' : '#ffc107'}
                          fill={isWishlisted ? '#ffc107' : 'none'}
                        />
                      </button>

                      {/* Sale badge */}
                      {product.saleprice && product.saleprice < product.price && (
                        <span className="badge rounded-pill bg-warning position-absolute top-0 start-0 m-2">
                          SALE
                        </span>
                      )}

                      {/* Product image */}
                      <Link to={`/shop/${product._id}`}>
                        <div>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="img-fluid"
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'contain',
                              backgroundColor: '#f8f9fa',
                              padding: '10px',
                              borderTopLeftRadius: '0.5rem',
                              borderTopRightRadius: '0.5rem',
                            }}
                          />
                        </div>
                      </Link>

                      {/* Product content */}
                      <div className="card-body">
                        <p>{product.category}</p>
                        <strong className="text-truncate d-block" title={product.name}>
                          {product.name.split(' ').slice(0, 4).join(' ')}{product.name.split(' ').length > 4 ? '...' : ''}
                        </strong>
                        <p
                          title={product.description}
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: '1.5em',
                            minHeight: '4.5em'
                          }}
                        >
                          {product.description}
                        </p>

                        {/* Price and discount */}
                        {product.saleprice ? (
                          <div className='mt-3'>
                            <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '15px' }}>
                              ₹{product.price}
                            </span>
                            <span style={{ color: '#ffc107', fontWeight: 'bold' }}>
                              ₹{product.saleprice}
                            </span>
                          </div>
                        ) : (
                          <div><span style={{ fontWeight: 'bold' }}>₹{product.price}</span></div>
                        )}

                        {/* Cart controls */}
                        <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
                          {quantity > 0 ? (
                            <div
                              className="d-flex align-items-center justify-content-between px-2 py-1"
                              style={{
                                border: '2px solid #FFD700',
                                borderRadius: '30px',
                                width: '100%',
                                maxWidth: '120px'
                              }}
                            >
                              {/* Decrease quantity */}
                              <button
                                className="btn btn-sm p-0"
                                style={{ border: 'none', background: 'none' }}
                                onClick={() => {
                                  if (quantity === 1) {
                                    removeFromCart(product._id);
                                  } else {
                                    updateQuantity(product._id, quantity - 1);
                                  }
                                }}
                              >
                                –
                              </button>
                              <span className="px-2 fw-bold">{quantity}</span>

                              {/* Increase quantity */}
                              <button
                                className="btn btn-sm p-0"
                                style={{ border: 'none', background: 'none' }}
                                onClick={() => updateQuantity(product._id, quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn bg-mainColor text-white w-100"
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart(product, 1);
                                toast.success(`Product added to cart successfully!`, {
                                  toastId: `cart-${product._id}`
                                });
                              }}
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div className="offcanvas-backdrop show" onClick={() => setShowSidebar(false)} />
      )}

      {/* Mobile filter sidebar */}
      <div
        className={`offcanvas offcanvas-start ${showSidebar ? 'show' : ''}`}
        style={{ visibility: showSidebar ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header">
          <h5>Filters</h5>
          <button type="button" className="btn-close" onClick={() => setShowSidebar(false)} />
        </div>
        <div className="offcanvas-body">
          <Productfilter onChange={handleFilterChange} selectedFilters={filters} />
        </div>
      </div>

      {/* Pagination UI */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            {/* Previous Page */}
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => updateURL(filters, currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => updateURL(filters, index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            {/* Next Page */}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => updateURL(filters, currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
