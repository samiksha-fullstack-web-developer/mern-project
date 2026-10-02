import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AccountPage() {
  // Destructuring user-related functions and data from context
  const { user, updateAddress, deleteAddress, logout, fetchUser } = useUser();

  // Local state to hold orders and address editing info
  const [orders, setOrders] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: '', city: '', state: '', zip: '', country: ''
  });

  const navigate = useNavigate();

  // Fetch user orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders', {
          credentials: 'include',
        });

        const data = await res.json();
        console.log("🧾 Order fetch response:", data);

        // If response is valid and orders exist, update state
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          console.warn("⚠️ No orders found or unexpected format");
        }
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // Log user info on change
  useEffect(() => {
    console.log("Logged in user?", user);
    console.log("User addresses:", user?.addresses);
  }, [user]);


  // When Edit button is clicked, set selected address to be edited
  const handleEditClick = (addr) => {
    setEditingAddress(addr._id);
    setAddressForm(addr);
  };

  // Submit updated address to server
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const res = await updateAddress(editingAddress, addressForm);
    if (res.success) {
      toast.success('Address updated');
      await fetchUser(); // 🔄 Fetch updated user with new addresses

      setEditingAddress(null);
    } else {
      toast.error('Update failed');
    }
  };
  // Update addressForm state when input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Delete an address using context
  const handleDelete = async (id) => {
    const res = await deleteAddress(id);
    if (res.success) toast.success('Address deleted');
    else toast.error('Delete failed');
  };

  // Cancel an order with a prompt for reason
  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Why are you cancelling this order?");
    if (!reason || reason.trim() === "") {
      toast('Cancellation aborted. Please provide a reason.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Order cancelled');
        // Update order status locally
        setOrders(prev =>
          prev.map(o =>
            o._id === orderId ? { ...o, status: 'Cancelled' } : o
          )
        );
      } else {
        toast.error(data.message || 'Could not cancel order');
      }
    } catch (err) {
      console.error("❌ Cancel error:", err);
      toast.error('Server error during cancellation');
    }
  };

  // Permanently delete an order after confirmation
  const handleDeleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order._id !== orderId);
    setOrders(updatedOrders);
  };

  // Logout the user and navigate to login page
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Show loading while user data is not ready
  if (!user) return <div className="container my-5">Loading account...</div>;

  return (
    <div className="container account-page">
      <h2 className="mb-4">My Account</h2>

      <div className="row">
        {/* Orders Section */}
        <div className="col-12 col-md-8 mb-4">
          <h4>My Orders</h4>
          {!Array.isArray(orders) || orders.length === 0 ? (
            <p>No orders yet. <Link to="/shop/listing">Start Shopping</Link></p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered account-orders-table">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o._id}>
                      <td>{i + 1}</td>
                      <td>{new Date(o.date).toLocaleDateString()}</td>
                      <td>{o.status}</td>
                      <td>₹{o.total}</td>
                      <td>{o.paymentMethod}</td>
                      <td>
                        <div className="d-flex flex-column flex-sm-row gap-2">
                          <Link
                            to={`/order/${o._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            View
                          </Link>

                          {o.status === 'Pending' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleCancelOrder(o._id)}
                            >
                              Cancel
                            </button>
                          )}

                          <button
                            className="btn btn-sm btn-warning text-white"
                            onClick={() => handleDeleteOrder(o._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Info + Address Book */}
        <div className="col-12 col-md-4">
          {/* User Info Card */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <strong>My Info</strong>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline-primary"
              >
                Logout
              </button>
            </div>
            <div className="card-body">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone || '-'}</p>
            </div>
          </div>

          {/* Address Book Section */}
          <div className="card">
            <div className="card-header"><strong>Address Book</strong></div>
            <div className="card-body">
              {user.addresses?.length > 0 ? (
                user.addresses.map(addr => (
                  <div key={addr._id} className="border rounded p-2 mb-3">
                    <p className="mb-1">{addr.street}, {addr.city}</p>
                    <p className="mb-1">{addr.state}, {addr.zip}, {addr.country}</p>
                    <div className="d-flex flex-column flex-sm-row gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditClick(addr)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-warning text-white"
                        onClick={() => handleDelete(addr._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No addresses saved</p>
              )}

              {editingAddress && (
                <form onSubmit={handleAddressSubmit} className="mt-3">
                  <h6>Edit Address</h6>
                  {['street', 'city', 'state', 'zip', 'country'].map(field => (
                    <input
                      key={field}
                      name={field}
                      className="form-control mb-2"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={addressForm[field]}
                      onChange={handleAddressChange}
                    />
                  ))}
                  <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-sm btn-success" type="submit">Save</button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingAddress(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
