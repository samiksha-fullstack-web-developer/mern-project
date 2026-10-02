// Import required styles and dependencies
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Shoppinghome = () => {
  // State to store categories fetched from backend
  const [categories, setCategories] = useState([]);

  // State to control entrance animation
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger entrance animation with slight delay
    setTimeout(() => setShow(true), 100);
  }, []);

  useEffect(() => {
    // Fetch category options from backend
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/products/filters/options");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    
    };
    fetchCategories();
  }, []);

  // Define images for certain known categories
  const categoryImages = {
    "furniture": "/images/categories/furniture.jpg",
    "home_decor": "/images/categories/homedecor.jpg",
    "kids_wear": "/images/categories/kidswear.jpg",
    "laptops_tablets": "/images/categories/laptops_tablets.jpg",
    "kitchen_dining": "/images/categories/kitchen.jpg"
  };

  return (
    <>
      {/* Hero Section */}
      <div className="container-fluid page-banner bg-light">
        <div className="container hero-section">
          <div className="row align-items-center pt-4 pb-4">
            {/* Text content */}
            <div className={`col-md-6 text-start mt-4 mb-4 mb-md-0 ${show ? 'fade-in-left' : ''}`}>
              <h1 className="display-5  fw-bold mt-4">
                Your One-Stop Shop for <span className="highlight display-5 fw-bold" >Everything Awesome</span>
              </h1>
              <p className="mt-3" style={{ fontSize: '17px' }}>
                At Shopsphere, shopping isn’t just about buying — it’s about upgrading your life. Curate your world with products that reflect your taste, values, and everyday needs.
              </p>
              <a href="/shop/listing" className="btn btn-primary btn-lg mt-3 px-4 mb-4 custom-btn">
                Start Shopping <ArrowRight />
              </a>
            </div>

            {/* Hero image hidden on small screens */}
            <div className={`col-md-6 d-none d-md-block text-end ${show ? 'fade-in-right' : ''}`}>
              <img
                src={'/hero section_image.png'}
                alt="Shopping Girl"
                className="img-fluid"
                style={{ maxHeight: '600px', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container py-5 mt-4 mb-4">
        {/* Section Title */}
        <h2 className="text-center fw-bold mb-4">Shop by Category</h2>

        {/* Category Cards Grid */}
        <div className="row g-4">
          {[...categories].sort().slice(0, 4).map((cat, i) => {
            // Normalize category name to use as image key
            const normalizeKey = (key) =>
              key
                .toLowerCase()
                .replace(/’/g, "'")
                .replace(/[^a-z0-9]/gi, '_')
                .replace(/_+/g, '_')
                .replace(/^_+|_+$/g, '');

            const normalized = normalizeKey(cat);

            // Use category image or fallback placeholder
            const imagePath =
              categoryImages[normalized] ||
              `https://via.placeholder.com/300x200?text=${encodeURIComponent(cat)}`;

            return (
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" key={i}>
                <div className="card category-card border-0 shadow-sm h-100">
                  <div className="category-image-container">
                    <img
                      src={imagePath}
                      className="card-img-top rounded-top"
                      alt={cat}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title text-capitalize">{cat}</h5>
                    <Link
                      to={`/shop/listing?category=${encodeURIComponent(cat)}`}
                      className="btn btn-sm btn-outline-primary mt-3"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-4">
          <Link to="/shop/listing" className="btn btn-primary px-4">
            View All Categories <ArrowRight></ArrowRight>
          </Link>
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-4">New Arrivals</h2>
        <div className="row g-4">
          {/* New Arrival Card 1 */}
          <div className="col-md-4">
            <div className="card h-100 text-center">
              <img src="/new arrivals_1.png" className="card-img-top" alt="Category 1" style={{ height: '250px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">Fresh Picks for the Season</h5>
                <p className="card-text">Discover trending essentials curated for your comfort and style.</p>
              </div>
            </div>
          </div>

          {/* New Arrival Card 2 */}
          <div className="col-md-4">
            <div className="card h-100 text-center">
              <img src="/new arrivals_2.png" className="card-img-top" alt="Category 2" style={{ height: '250px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">Latest Must-Have Gear</h5>
                <p className="card-text">Explore new tech and gadgets that elevate your everyday life.</p>
              </div>
            </div>
          </div>

          {/* New Arrival Card 3 */}
          <div className="col-md-4">
            <div className="card h-100 text-center">
              <img src="/new arrivals_3.png" className="card-img-top" alt="Category 3" style={{ height: '250px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">Inspired Living Essentials</h5>
                <p className="card-text">Add charm and character to your home with our newest decor finds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">Why Choose ShopSphere?</h2>
        <div className="row g-4">

          {/* Feature 1: Fast Delivery */}
          <div className="col-md-4">
            <div className="border rounded shadow-sm p-4 text-center h-100">
              <i className="bi bi-truck fs-1 text-primary"></i>
              <h5 className="mt-3 fw-semibold">Fast Delivery</h5>
              <p className="text-muted">Lightning-fast shipping to your doorstep across India.</p>
            </div>
          </div>

          {/* Feature 2: Secure Payments */}
          <div className="col-md-4">
            <div className="border rounded shadow-sm p-4 text-center h-100">
              <i className="bi bi-shield-check fs-1 text-success"></i>
              <h5 className="mt-3 fw-semibold">Secure Payments</h5>
              <p className="text-muted">Your transactions are safe with trusted payment gateways.</p>
            </div>
          </div>

          {/* Feature 3: Easy Returns */}
          <div className="col-md-4">
            <div className="border rounded shadow-sm p-4 text-center h-100">
              <i className="bi bi-arrow-repeat fs-1 text-warning"></i>
              <h5 className="mt-3 fw-semibold">Easy Returns</h5>
              <p className="text-muted">Enjoy a 7-day return policy — no questions asked.</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Shoppinghome;
