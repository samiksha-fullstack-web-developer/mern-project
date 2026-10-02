import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from 'react-toastify';

export default function OrderDetail() {
  // Extract order ID from URL parameters
  const { id } = useParams();
  
  // Local state for storing the order and loading state
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch order data on component mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders`, {
          credentials: "include",
        });

        const data = await res.json();

        // Find the order with the matching ID
        if (data.success) {
          const found = data.orders.find(o => o._id === id);
          setOrder(found);
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false); // Stop loading once fetch is done
      }
    };

    fetchOrder();
  }, [id]);

  // Show loading or error message if needed
  if (loading) return <div className="container my-5">Loading order...</div>;
  if (!order) return <div className="container my-5">Order not found</div>;

  // Function to handle order cancellation
  const cancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${order._id}/cancel`, {
        method: 'PUT',
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        // Update order status locally after successful cancellation
        setOrder(prev => ({ ...prev, status: 'Cancelled' }));
        toast.success('Order cancelled');
      } else {
        toast.error(data.message || 'Could not cancel');
      }
    } catch (err) {
      toast.error('Error cancelling order');
      console.error(err);
    }
  };

  return (
    <div className="container my-5">
      {/* Header with navigation and cancellation info if any */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Order Details</h3>
        <Link to="/shop/account" className="btn btn-primary">← Back to Account</Link>
        {order.status === 'Cancelled' && order.cancellationReason && (
          <p className="text-danger"><strong>Cancellation Reason:</strong> {order.cancellationReason}</p>
        )}
      </div>

      {/* Basic Order Info */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">Order #{order._id}</h5>
          <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="card shadow-sm mb-4">
        <div className="card-header"><strong>Shipping Details</strong></div>
        <div className="card-body">
          <p>{order.shipping.firstName} {order.shipping.lastName}</p>
          <p>{order.shipping.address}, {order.shipping.city}</p>
          <p>{order.shipping.state}, {order.shipping.zip}, {order.shipping.country}</p>
          <p><strong>Email:</strong> {order.shipping.email}</p>
          <p><strong>Phone:</strong> {order.shipping.phone}</p>
        </div>
      </div>

      {/* List of Ordered Items */}
      <div className="card shadow-sm">
        <div className="card-header"><strong>Items Ordered</strong></div>
        <ul className="list-group list-group-flush">
          {order.items.map((item, idx) => (
            <li key={idx} className="list-group-item d-flex justify-content-between">
              <div>
                {item.name} × {item.quantity}
              </div>
              <div>₹{item.price * item.quantity}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
