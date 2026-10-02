// Import necessary hooks and components
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Heart } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user, authLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login', { replace: true, state: { from: '/shop/wishlist' } });
    }
  }, [authLoading, user, navigate]);

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success("Added to cart");
  };

  const handleRemove = (id) => {
    removeFromWishlist(id);
    toast.success("Removed from wishlist");
  };

  return (
    <div className="container my-4 px-2">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Wishlist Header */}
      <div className="text-center mb-4">
        <Heart size={32} strokeWidth={1.5} />
        <h2 className="fw-bold">My Wishlist</h2>
      </div>

      {/* If wishlist is empty */}
      {wishlist.length === 0 ? (
        <div className="text-center">
          <p>Your wishlist is empty. <Link to="/shop/listing">Go Shopping</Link></p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="d-none d-sm-table-header-group">
              <tr>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => (
                <tr key={item._id} className="border-top">
                  <td colSpan="4">
                    <div className="d-flex flex-column flex-sm-row align-items-center gap-3 py-3 text-center text-sm-start">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '150px',
                          height: '150px',
                          objectFit: 'contain',
                          borderRadius: '5px',
                          background: '#f9f9f9',
                          padding: '5px'
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.name.split(' ').slice(0, 15).join(' ')}{item.name.split(' ').length > 4 ? '...' : ''}</h6>
                        <p className="mb-1 small text-muted">Price: ₹{item.saleprice || item.price}</p>
                        <p className="mb-2 small text-primary fw-semibold">In Stock</p>

                        <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center justify-content-sm-start">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
                          </button>
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => handleRemove(item._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
