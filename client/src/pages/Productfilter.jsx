import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Productfilter({ onChange, selectedFilters }) {
  // State to store fetched filter options
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  // Fetch filter options (categories, brands, max price) on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch("http://localhost:5000/products/filters/options");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories || []);
          setBrands(data.brands || []);
          if (data.maxPrice) {
            setMaxPrice(data.maxPrice); 
            setPriceRange([0, data.maxPrice]); // Update price range slider
          }
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchFilters();
  }, []); // Run only once on component mount

  // Handle checkbox change for category/brand filters
  const handleChange = (e, type) => {
    const { value, checked } = e.target;
    onChange(type, value, checked);
  };

  // Handle price slider change
  const handlePrice = (e) => {
    const value = +e.target.value;
    setPriceRange([0, value]); // Update visible range
    if (value !== 0) {
      onChange('price', value);
    } else {
      onChange('price', null); // Reset filter
    }
  };

  return (
    <div className="p-3">
      <h4 className="text-dark fw-medium">Filters</h4>
      <hr className=""></hr>

      {/* Category Filters */}
      <div className="mb-4 mt-4">
        <h6 className="text-uppercase fw-bold text-primary">Category</h6>
        {categories.map((cat) => (
          <div className="form-check" key={cat}>
            <input
              className="form-check-input"
              type="checkbox"
              value={cat}
              checked={selectedFilters.category.includes(cat)}
              onChange={(e) => handleChange(e, 'category')}
            />
            <label className="form-check-label">{cat}</label>
          </div>
        ))}
      </div>

      {/* Brand Filters */}
      <div>
        <h6 className="text-uppercase fw-bold text-primary">Brand</h6>
        {brands.map((brand) => (
          <div className="form-check" key={brand}>
            <input
              className="form-check-input"
              type="checkbox"
              value={brand}
              checked={selectedFilters.brand.includes(brand)}
              onChange={(e) => handleChange(e, 'brand')}
            />
            <label className="form-check-label">{brand}</label>
          </div>
        ))}
      </div>

      {/* Price Filter (Slider) */}
      <div>
        <h6 className="text-uppercase fw-bold mt-4">
          Price (Up to ₹{priceRange[1]})
        </h6>
        <input
          type="range"
          className="form-range"
          min="0"
          max="5000"
          step="100"
          value={priceRange[1]}
          onChange={handlePrice}
        />
      </div>
    </div>
  );
}
