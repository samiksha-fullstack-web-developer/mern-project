import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';

export default function SearchResults() {
  // State to store search result products
  const [results, setResults] = useState([]);

  // Extracting the search query parameter (?q=...) from the URL
  const query = new URLSearchParams(useLocation().search).get("q");

  useEffect(() => {
    // Function to fetch search results based on query
    const fetchSearchResults = async () => {
      try {
        const res = await fetch(`http://localhost:5000/products/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        if (data.success) setResults(data.products); // Update results if request is successful
      } catch (err) {
        console.error("❌ Error during search:", err.message); // Log error if fetch fails
      }
    };

    // Fetch results only if query exists
    if (query) fetchSearchResults();
  }, [query]);

  return (
    <div className="container py-5">
      {/* Header showing the search term */}
      <h3 className="mb-4 fw-semibold">
        Search results for: <span className="text-primary">"{query}"</span>
      </h3>

      {/* Display message if no results found */}
      {results.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        // Display product cards if results are found
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {results.map(product => (
            <div key={product._id} className="col">
              <div className="card h-100 shadow-sm border-0 hover-shadow">
                {/* Product image */}
                <img
                  src={product.image}
                  className="card-img-top p-3"
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'contain',
                    backgroundColor: '#f8f9fa',
                    padding: '10px',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem',
                  }} />
                <div className="card-body">
                  {/* Product name */}
                  <h5 className="card-title text-truncate">{product.name}</h5>
                  {/* Product price */}
                  <p className="card-text fw-bold text-success">₹{product.price}</p>
                </div>
                <div className="card-footer bg-white border-0">
                  {/* Link to product details page */}
                  <Link to={`/shop/${product._id}`} className="btn btn-outline-primary w-100">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
