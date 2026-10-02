// Import necessary modules and hooks
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
    // Get product ID from route params
    const { id } = useParams();

    // Local state for product details and review form
    const [product, setProduct] = useState(null);
    const [reviewData, setReviewData] = useState({ name: '', email: '', comment: '', rating: 0 });
    const [quantity, setQuantity] = useState(1);

    // Cart context actions
    const { addToCart, clearCart } = useCart();

    // Fetch product details from server
    const fetchProduct = async () => {
        try {
            const res = await fetch(`http://localhost:5000/products/${id}`);
            const data = await res.json();
            if (data.success) setProduct(data.product);
        } catch (err) {
            console.error('Error fetching product:', err);
            toast.error('Failed to fetch product');
        }
    };

    // Fetch product data on component mount or when ID changes
    useEffect(() => {
        fetchProduct();
    }, [id]);

    // Handle deletion of a review
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            const res = await fetch(`http://localhost:5000/products/${id}/reviews/${reviewId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Review deleted!');
                fetchProduct(); // Refresh product to reflect deletion
            } else {
                toast.error(`Delete failed: ${data.message}`);
            }
        } catch (err) {
            console.error('Error deleting review:', err);
            toast.error('Error deleting review');
        }
    };

    // Submit new or updated review
    const submitReview = async (e) => {
        e.preventDefault();

        // Determine whether to POST or PUT based on presence of _id
        const endpoint = reviewData._id
            ? `http://localhost:5000/products/${id}/reviews/${reviewData._id}`
            : `http://localhost:5000/products/${id}/reviews`;
        const method = reviewData._id ? 'PUT' : 'POST';

        try {
            const res = await fetch(endpoint, {
                method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(reviewData._id ? 'Review updated!' : 'Review added!');
                setReviewData({ name: '', email: '', comment: '', rating: 0 }); // Reset form
                fetchProduct(); // Refresh product reviews
            } else {
                toast.error('Review failed: ' + data.message);
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            toast.error('Error submitting review');
        }
    };

    // Show loading message if product is not yet loaded
    if (!product) {
        return <div className="container my-5"><p>Loading product...</p></div>;
    }

    // Handle adding product to cart
    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success('Item added to cart!', {
            duration: 4000,
            style: {
                background: '#0c59ff',
                color: 'white',
            },
        });
    };

    return (
        <>
            <div className="container my-5" style={{ borderRadius: '10px', padding: '30px' }}>
                <Toaster position="top-right" />

                {/* Breadcrumb navigation */}
                <div className="mb-3">
                    <h6 className="text-muted">
                        <span className="text-dark">Shop</span> &gt; <span className="text-primary">{product.category}</span>
                    </h6>
                </div>

                {/* Product info section */}
                <div className="row mb-5">
                    {/* Product image */}
                    <div className="col-md-6">
                        <div className="text-center bg-white p-3 rounded shadow-sm">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="img-fluid"
                                style={{ maxHeight: '450px', objectFit: 'contain' }}
                            />
                        </div>
                    </div>

                    {/* Product details and cart actions */}
                    <div className="col-md-6">
                        <h2 className="mb-3" style={{ color: '#0c59ff' }}>{product.name}</h2>

                        {/* Pricing with sale check */}
                        {product.saleprice ? (
                            <h4>
                                <span className="text-muted text-decoration-line-through me-2">₹{product.price}</span>
                                <span className="fw-bold text-warning">₹{product.saleprice}</span>
                            </h4>
                        ) : (
                            <h4 className="fw-bold">₹{product.price}</h4>
                        )}

                        {/* Product description */}
                        <p className="mt-4">{product.description}</p>

                        {/* Additional info */}
                        <div className="mt-3">
                            <p><strong>Category:</strong> {product.category}</p>
                            <p><strong>Brand:</strong> {product.brand}</p>
                        </div>

                        {/* Quantity input and cart buttons */}
                        <div className="d-flex align-items-center mt-4">
                            <input
                                type="number"
                                className="form-control w-25 me-3"
                                min={0}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                            <button
                                className="btn px-4"
                                style={{ backgroundColor: '#0c59ff', color: 'white' }}
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                            <button
                                className="btn btn-warning text-white ms-3"
                                onClick={() => {
                                    clearCart();
                                    toast.success("Cart cleared!");
                                }}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs for description and reviews */}
                <div className="card border-0 shadow-sm">
                    <ul className="nav nav-tabs px-3 pt-3" id="productTab" role="tablist">
                        <li className="nav-item">
                            <button className="nav-link active" id="desc-tab" data-bs-toggle="tab" data-bs-target="#desc" role="tab" style={{ color: '#0c59ff' }}>
                                Description
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" role="tab" style={{ color: '#0c59ff' }}>
                                Reviews
                            </button>
                        </li>
                    </ul>

                    {/* Tab content section */}
                    <div className="tab-content p-4" id="productTabContent">
                        {/* Description tab */}
                        <div className="tab-pane fade show active" id="desc" role="tabpanel">
                            <ul className="list-group list-group-flush">
                                {product.additionalInfo.split('\n').map((line, idx) => (
                                    <li key={idx} className="list-group-item">
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Reviews tab */}
                        <div className="tab-pane fade" id="reviews" role="tabpanel">
                            {/* Existing reviews */}
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((rev, idx) => (
                                    <div key={idx} className="bg-white p-3 mb-3 rounded shadow-sm">
                                        <strong>{rev.name}</strong> - <small className="text-muted">{new Date(rev.createdAt).toLocaleDateString()}</small>
                                        <div style={{ color: '#ffc107' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                                        <p className="mb-1">{rev.comment}</p>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setReviewData({ name: rev.name, email: rev.email, comment: rev.comment, rating: rev.rating, _id: rev._id })}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteReview(rev._id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet.</p>
                            )}

                            {/* Review form */}
                            <h5 className="mt-4" style={{ color: '#0c59ff' }}>Add a Review</h5>
                            <form onSubmit={submitReview} className="row g-3 mt-2 bg-white p-3 rounded shadow-sm">
                                {/* Star rating input */}
                                <div className="col-12">
                                    <label className="form-label fw-semibold">Your Rating *</label>
                                    <div>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                style={{ fontSize: '1.5rem', cursor: 'pointer', color: reviewData.rating >= star ? '#ffc107' : '#ccc' }}
                                                onClick={() => setReviewData({ ...reviewData, rating: star })}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Name and email inputs */}
                                <div className="col-md-6">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={reviewData.name}
                                        onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        required
                                        value={reviewData.email}
                                        onChange={(e) => setReviewData({ ...reviewData, email: e.target.value })}
                                    />
                                </div>

                                {/* Comment input */}
                                <div className="col-12">
                                    <label className="form-label">Your Review *</label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        required
                                        value={reviewData.comment}
                                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                    ></textarea>
                                </div>

                                {/* Submit button */}
                                <div className="col-12">
                                    <button className="btn px-4" style={{ backgroundColor: '#0c59ff', color: 'white' }}>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
