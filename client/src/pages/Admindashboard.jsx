// AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();

  // State to store all fetched orders
  const [orders, setOrders] = useState([]);

  // State to store summarized stats
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    todayIncome: 0,
  });

  // Fetch all admin orders and compute statistics
  const fetchDashboardData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/orders/admin/all', {
        credentials: 'include',
      });

      const data = await res.json();

      if (!data.success) {
        return toast.error(data.message || "Failed to load");
      }

      setOrders(data.orders);

      // Compute statistics from orders
      const today = new Date().toISOString().split("T")[0];

      const pending = data.orders.filter(o => o.status === "Pending").length;
      const confirmed = data.orders.filter(o => o.status === "Confirmed").length;
      const cancelled = data.orders.filter(o => o.status === "Cancelled").length;

      const todayIncome = data.orders
        .filter(o => o.status === "Delivered" && o.date?.startsWith(today))
        .reduce((sum, o) => sum + o.total, 0);

      setStats({ pending, confirmed, cancelled, todayIncome });

    } catch (err) {
      toast.error("❌ Failed to fetch dashboard data");
      console.error(err);
    }
  };

  // Fetch dashboard data on initial mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper to determine badge styling based on status
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "shipped": return "bg-primary text-white";
      case "pending": return "bg-warning text-white";
      case "delivered": return "bg-success text-white";
      case "cancelled": return "bg-danger text-white";
      default: return "bg-secondary text-white";
    }

  };

  // Navigate to order listing filtered by status
  const handleCardClick = (status) => {
    if (!status) return;
    navigate(`/admin/orders?status=${status}`);
  };
  const getInitials = (name) => {
    if (!name) return "NA";
    const words = name.trim().split(" ");
    return words.slice(0, 2).map(w => w[0].toUpperCase()).join("");
  };

  return (
    <div className="container py-4">
      <Toaster position="top-right" />
      <h2 className="mb-4">Dashboard</h2>

      {/* Dashboard Stat Cards */}
      <div className="row mb-4 gy-3">
        {[
          {
            title: "ORDER PENDING",
            count: stats.pending,
            color: "primary",
            icon: "⏳",
            status: "Pending",
          },
          {
            title: "ORDER CANCEL",
            count: stats.cancelled,
            color: "danger",
            icon: "❌",
            status: "Cancelled",
          },
          {
            title: "ORDER CONFIRMED",
            count: stats.confirmed,
            color: "info",
            icon: "🔄",
            status: "Confirmed",
          },
          {
            title: "TODAY INCOME",
            count: `₹${stats.todayIncome}`,
            color: "success",
            icon: "💰",
          },
        ].map((item, i) => (
          <div
            className="col-6 col-md-3"
            key={i}
            onClick={() => item.status && handleCardClick(item.status)}
          >
            <div
              className={`bg-${item.color} text-white p-3 rounded shadow d-flex justify-content-between align-items-center`}
            >
              <div>
                <small
                  className="text-uppercase"
                  style={{ fontSize: "13px", fontWeight: "500" }}
                >
                  {item.title}
                </small>
                <h4 className="mb-0 mt-2">{item.count}</h4>
              </div>
              <div className="fs-2">{item.icon}</div>
            </div>
          </div>
        ))}
      </div>


      {/* Recent Orders Table */}
      <div className="card mt-5 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center bg-white">
          <h5 className="mb-0 fw-bold">Order List</h5>
        </div>

        <div className="card-body">
          {orders.slice(0, 5).map((order) => (
            <div key={order._id} className="admin-recent-order d-flex align-items-center justify-content-between py-3 border-bottom">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-light text-dark fw-bold d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }}>
                  {getInitials(order.user?.username)}
                </div>
                <div>
                  <div className="fw-semibold">{order.user?.username || "Unknown"}</div>
                  <div className="text-muted small">{new Date(order.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="fw-semibold me-3 text-primary">{order.paymentMethod}</div>
                <div className="fw-semibold me-3 ">  <span className={`badge ${getStatusClass(order.status)}`}>
                  {order.status}
                </span></div>
                <div className="fw-semibold me-3 text-dark">  ₹{order.total}</div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center text-muted py-4">No recent orders</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
