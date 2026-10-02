import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, authLoading } = useUser();
  const navigate = useNavigate();

  // Calculate total cart value
  const total = cart.reduce((sum, item) => 
    sum + ((item.product?.price || 0) * item.quantity), 0
  );

  // Handle checkout logic
  const handleCheckout = () => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth/login', { state: { from: '/shop/checkout' } });
      return;
    }
    toast.success('Proceeding to checkout');
    navigate('/shop/checkout');
  };

  return (
    <div className="container cart-page text-center">
      <Toaster position="top-right" />
      
      {/* Page Heading */}
      <ShoppingCart size={32} strokeWidth={1.5} />
      <h2 className="fw-bold mb-3">Cart</h2>

      {/* If Cart is Empty */}
      {cart.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link className="btn btn-primary" to="/shop/listing">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row">

          {/* Cart Items Section */}
          <div className="col-lg-8">
            <div className="table-responsive">
            <table className="table align-middle table-bordered shadow-sm cart-table">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Subtotal</th>
                  <th className="text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.product._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          width={60}
                          height={60}
                          style={{ objectFit: "contain", borderRadius: "5px" }}
                        />
                        <Link
                          to={`/shop/${item.product._id}`}
                          className="text-decoration-none fw-semibold text-dark text-wrap"
                        >
                          {item.product.name.split(' ').slice(0, 4).join(' ')}
                          {item.product.name.split(' ').length > 4 ? '...' : ''}
                        </Link>
                      </div>
                    </td>
                    <td className="text-center">
                      ₹{item.product.price.toFixed(2)}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        {/* Decrease quantity button */}
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        {/* Increase quantity button */}
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-center fw-semibold">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-warning"
                        title="Remove item"
                        onClick={() => removeFromCart(item.product._id)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Action buttons: Clear Cart & Continue Shopping */}
            <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mt-4">
              <button
                className="btn btn-outline-warning"
                onClick={clearCart}
              >
                🗑️ Clear Cart
              </button>
              <Link to="/shop/listing" className="btn btn-outline-primary">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary Section */}
          <div className="col-lg-4">
            <div className="card shadow-sm p-4 mt-4 mt-lg-0 cart-summary">
              <h5 className="fw-bold mb-3">Cart totals</h5>

              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-semibold">Total</span>
                <span className="fw-bold">₹{total.toFixed(2)}</span>
              </div>

              {/* Coupon Input (UI only, no logic yet) */}
              <div className="mb-3">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  placeholder="Have a coupon?"
                />
              </div>

              {/* Checkout Button */}
              <button onClick={handleCheckout} className="btn btn-primary w-100">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
