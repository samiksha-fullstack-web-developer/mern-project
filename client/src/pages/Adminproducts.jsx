import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import '../index.scss';

export default function Adminproducts() {
  // Initial form state
  const [formData, setformData] = useState({
    name: '',
    description: '',
    price: '',
    saleprice: '',
    image: null,
    imagePreview: '',
    additionalInfo: '',
    category: '',
    tag: '',
    brand: ''
  });

  // Product list and pagination state
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products from server
  const fetchProducts = async (page = 1, limit = 6) => {
    try {
      const res = await fetch(`http://localhost:5000/products/all?page=${page}&limit=${limit}`, {
        credentials: "include",
        headers: { Accept: "application/json" }
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        const text = await res.text();
        throw new Error("Invalid response:\n" + text);
      }

      const result = await res.json();
      if (result.success) {
        setProducts(result.products);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
      } else {
        alert("Failed to load products: " + result.message);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("❌ Could not load product list.");
    }
  };

  // Fetch products when component mounts or current page changes
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const refreshAfterSubmit = () => {
    fetchProducts(currentPage);
  };

  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:5000/products/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      const result = await res.json();

      if (result.success) {
        alert("🗑️ Product deleted");
        refreshAfterSubmit();
      } else {
        alert("❌ Delete failed: " + result.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Server error during deletion");
    }
  };

  // Handle edit - pre-fill form and open sidebar
  const handleEdit = (product) => {
    setformData({
      name: product.name,
      description: product.description,
      price: product.price,
      saleprice: product.saleprice,
      image: null,
      imagePreview: product.image || '',
      additionalInfo: product.additionalInfo,
      category: product.category,
      tag: product.tag,
      brand: product.brand,
    });
    setEditMode(true);
    setEditingId(product._id);
    document.querySelector('[data-bs-target="#offcanvasScrolling"]').click();
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      setformData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    } else {
      setformData({ ...formData, [name]: value });
    }
  };

  const handleImageRemove = () => {
    setformData({ ...formData, image: null, imagePreview: '' });
  };

  // Handle form submit (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("saleprice", formData.saleprice);
    if (formData.image) data.append("image", formData.image);
    data.append("additionalInfo", formData.additionalInfo);
    data.append("category", formData.category);
    data.append("tag", formData.tag);
    data.append("brand", formData.brand);

    try {
      const url = editMode
        ? `http://localhost:5000/products/update/${editingId}`
        : `http://localhost:5000/products/add`;
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
        credentials: "include"
      });

      const contentType = res.headers.get("content-type");

      if (res.ok && contentType?.includes("application/json")) {
        const result = await res.json();
        if (result.success) {
          alert(editMode ? "✏️ Product updated successfully" : "✅ Product added successfully");
          refreshAfterSubmit();
          handleCancel(); // Reset form after success
        } else {
          alert("❌ " + result.message);
        }
      } else {
        const errorText = await res.text();
        console.error("❌ Raw error response:", errorText);
        alert("❌ Server error: " + errorText);
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert(err.message || "Upload failed");
    }
  };

  // Cancel form and reset state
  const handleCancel = () => {
    setformData({
      name: '',
      description: '',
      price: '',
      saleprice: '',
      image: null,
      imagePreview: '',
      additionalInfo: '',
      category: '',
      tag: '',
      brand: '',
    });
    setEditMode(false);
    setEditingId(null);
    document.getElementById('closeCanvasBtn')?.click();
  };

  return (
    <>
      {/* Product Listing Header */}
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mt-2">
          <h4>Product List</h4>
          <button className="btn btn-primary fw-medium" aria-controls="offcanvasScrolling" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling">
            <Plus strokeWidth={2} size={20} /> Add Product
          </button>
        </div>

        {/* Product Grid */}
        <div className="row mt-4 row-gap-4">
          {products.length === 0 ? (
            <p>No Product found</p>
          ) : (
            products.map((product) => (
              <div className="col-md-4" key={product._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name || "Product"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.jpg";
                    }}
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
                  <div className="card-body">
                    <p className="card-text text-muted">{product.category}</p>
                    <h5 className="card-title text-primary">
                      {product.name.split(' ').slice(0, 3).join(' ')}
                      {product.name.split(' ').length > 4 ? '...' : ''}
                    </h5>
                    {product.saleprice ? (
                      <div className="card-text">
                        <span className="text-muted text-decoration-line-through me-2">₹{product.price}</span>
                        <strong className="text-warning">₹{product.saleprice}</strong>
                      </div>
                    ) : (
                      <p className="card-text"><strong>₹{product.price}</strong></p>
                    )}
                    <div className="d-flex justify-content-between mt-3">
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(product)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Offcanvas for Product Form */}
      <div className="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">{editMode ? "Edit Product" : "Add Product"}</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" id="closeCanvasBtn" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" className="form-control mb-3" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
            <textarea name="description" className="form-control mb-3" placeholder="Product Description" value={formData.description} onChange={handleChange} required />
            <input type="number" name="price" className="form-control mb-3" placeholder="Price" value={formData.price} onChange={handleChange} required />
            <input type="number" name="saleprice" className="form-control mb-3" placeholder="Sale Price" value={formData.saleprice} onChange={handleChange} />
            
            {/* Image Input and Preview */}
            <div className="mb-3">
              <input type="file" name="image" accept="image/*" onChange={handleChange} />
              {formData.imagePreview && (
                <div className="mt-2 mb-3 position-relative d-inline-block">
                  <img src={formData.imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  <button type="button" className="btn btn-sm btn-outline-danger position-absolute top-0 end-0" onClick={handleImageRemove}><X size={12} /></button>
                </div>
              )}
            </div>

            <textarea name="additionalInfo" className="form-control mb-3" placeholder="Additional Info" value={formData.additionalInfo} onChange={handleChange}></textarea>
            <input type="text" name="category" className="form-control mb-3" placeholder="Category" value={formData.category} onChange={handleChange} />
            <input type="text" name="tag" className="form-control mb-3" placeholder="Tag" value={formData.tag} onChange={handleChange} />
            <input type="text" name="brand" className="form-control mb-3" placeholder="Brand" value={formData.brand} onChange={handleChange} />
            
            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editMode ? "Update Product" : "Submit Product"}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
