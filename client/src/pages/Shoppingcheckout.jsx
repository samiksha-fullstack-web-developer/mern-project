import { useCart } from "../context/CartContext"; // Custom hook to access cart context
import { useState } from "react"; // Hook for state management
import { useNavigate } from "react-router-dom"; // Navigation hook
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Toaster, toast } from 'react-hot-toast'; // Toast notifications

export default function Shoppingcheckout() {
  const { cart, placeOrder } = useCart(); // Access cart items and order placement function
  const navigate = useNavigate(); // For programmatic navigation
  const { user, authLoading } = useUser();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login', { replace: true, state: { from: '/shop/checkout' } });
    }
  }, [authLoading, user, navigate]);

  // State to manage shipping form input
  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', company: '', country: '',
    address: '', city: '', state: '', zip: '', phone: '', email: ''
  });

  // State to manage selected payment method
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  // Calculate total cart price
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Handle form submission for order placement
  const handleOrder = async (e) => {
    e.preventDefault();

    const shippingDetails = {
      ...shipping,
      paymentMethod,
    };

    // Display toast notification during order process
    toast.promise(
      placeOrder(shippingDetails),
      {
        loading: 'Placing your order...',
        success: 'Order placed successfully!',
        error: (err) => `❌ ${err.message || "Failed to place order"}`,
      },
      { duration: 2000 }
    ).then(() => {
      // Redirect to shop homepage after success
      setTimeout(() => navigate("/shop/home"), 1600);
    });
  };

  return (
    <div className="container my-5">
      {/* Toast notification container */}
      <Toaster position="top-right" />

      <form onSubmit={handleOrder}>
        <div className="row">
          {/* Billing Details Form */}
          <div className="col-md-7">
            <h4>Billing Details</h4>
            <div className="row">
              {/* First Name */}
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First name *"
                  required
                  value={shipping.firstName}
                  onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                />
              </div>
              {/* Last Name */}
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last name *"
                  required
                  value={shipping.lastName}
                  onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                />
              </div>
            </div>

            {/* Company Name (optional) */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Company name"
              value={shipping.company}
              onChange={(e) => setShipping({ ...shipping, company: e.target.value })}
            />

            {/* Country Selection */}
            <select
              className="form-select mb-3"
              required
              value={shipping.country}
              onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
            >
              <option value="">Select country</option>
              <option value="India">India</option>
              <option value="USA">United States</option>
              <option value="Canada">Canada</option>
            </select>

            {/* Address Details */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Street Address *"
              required
              value={shipping.address}
              onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="City *"
              required
              value={shipping.city}
              onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="State *"
              required
              value={shipping.state}
              onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="ZIP / Postcode *"
              required
              value={shipping.zip}
              onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
            />

            {/* Contact Info */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Phone *"
              required
              value={shipping.phone}
              onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
            />
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email *"
              required
              value={shipping.email}
              onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
            />
          </div>

          {/* Order Summary + Payment Method */}
          <div className="col-md-5">
            <div className="bg-light p-4 rounded shadow-sm">
              <h4>Your Order</h4>

              {/* Product list summary */}
              <ul className="list-group mb-3">
                {cart.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div>{item.product.name} × {item.quantity}</div>
                    <strong>₹{item.product.price * item.quantity}</strong>
                  </li>
                ))}
                {/* Total amount */}
                <li className="list-group-item d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </li>
              </ul>

              {/* Payment method selection */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Payment Method</label>

                {/* Credit Card */}
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "credit-card"}
                    onChange={() => setPaymentMethod("credit-card")}
                  />
                  <label className="form-check-label">
                    <i className="bi bi-credit-card-2-front me-1 " style={{color:"#4a4a4a"}}></i> Credit Card
                  </label>
                </div>

                {/* PayPal */}
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                  />
                  <label className="form-check-label">
                    <i className="bi bi-paypal me-1" style={{color:"#003087"}}></i> PayPal
                  </label>
                </div>

                {/* Paytm */}
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "paytm"}
                    onChange={() => setPaymentMethod("paytm")}
                  />
                  <label className="form-check-label">
                    <i className="bi bi-phone me-1" style={{color:"#002970"}}></i> Paytm
                  </label>
                </div>

                {/* Google Pay */}
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "gpay"}
                    onChange={() => setPaymentMethod("gpay")}
                  />
                  <label className="form-check-label">
                    <i className="bi bi-google me-1" style={{color:"#34A853"}}></i> Google Pay
                  </label>
                </div>
              </div>


              {/* Terms agreement */}
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" required />
                <label className="form-check-label">
                  I agree to the terms and conditions.
                </label>
              </div>

              {/* Submit button */}
              <button type="submit" className="btn btn-primary w-100">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
