import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export default function Adminorders() {
  const [orders, setOrders] = useState([]);
  const location = useLocation();

  // Get the status filter from the query string
  const query = new URLSearchParams(location.search);
  const statusFilter = query.get('status');

  // Fetch orders from the backend API
  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/orders/admin/all', {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success) {
        // Filter by status if query param exists
        const filtered = statusFilter
          ? data.orders.filter((o) => o.status === statusFilter)
          : data.orders;

        setOrders(filtered);
      } else {
        toast.error(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      toast.error("❌ Could not load orders.");
      console.error("Failed to fetch orders:", err);
    }
  };

  // Call fetchOrders when component mounts or statusFilter changes
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // Update order status or cancel order
  const updateStatus = async (id, newStatus) => {
    // Handle cancellation with reason
    if (newStatus === 'Cancelled') {
      const reason = prompt('Enter cancellation reason:');
      if (!reason) return;

      try {
        const res = await fetch(`http://localhost:5000/api/admin/orders/admin/${id}/cancel`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ reason }),
        });

        const data = await res.json();
        if (data.success) {
          toast.success("Order cancelled.");
          fetchOrders();
        } else {
          toast.error(data.message || "Failed to cancel.");
        }
      } catch (err) {
        toast.error("❌ Cancel order error");
        console.error(err);
      }
    } else {
      // Handle normal status update
      try {
        const res = await fetch(`http://localhost:5000/api/admin/orders/admin/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus }),
        });

        const data = await res.json();
        if (data.success) {
          toast.success("Status updated.");
          fetchOrders();
        } else {
          toast.error(data.message || "Status update failed");
        }
      } catch (err) {
        toast.error("❌ Status update error");
        console.error(err);
      }
    }
  };

  // Delete an order
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Order deleted successfully");
        fetchOrders();
      } else {
        toast.error(data.message || "Failed to delete order");
      }
    } catch (err) {
      toast.error("❌ Delete request failed");
      console.error(err);
    }
  };

  return (
    <div className="container my-5">
      <Toaster position="top-right" />
      <h2>{statusFilter ? `${statusFilter} Orders` : "All Orders"}</h2>

        <div className="table-responsive overflow-auto admin-orders-table-wrap">
      <table className="table table-bordered table-hover text-nowrap admin-orders-table">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Change Status</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o, i) => (
            <tr key={o._id}>
              <td data-label="#">{i + 1}</td>
              <td data-label="User">{o.user?.username || "N/A"}</td>
              <td data-label="Date">{o.date ? new Date(o.date).toLocaleDateString() : 'N/A'}</td>
              <td data-label="Status">{o.status}</td>
              <td data-label="Total">₹{o.total}</td>
              <td data-label="Payment">{o.paymentMethod}</td>

              <td data-label="Change Status">
                <select
                  className="form-select form-select-sm"
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  disabled={o.status === 'Cancelled' || o.status === 'Delivered'}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td data-label="Reason">{o.status === 'Cancelled' ? o.cancellationReason || 'N/A' : '-'}</td>
              <td data-label="Action">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteOrder(o._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
