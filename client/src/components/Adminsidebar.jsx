// Adminsidebar.jsx - Sidebar navigation for the Admin Dashboard
// Contains links to dashboard sections and logout button
// Supports both mobile (offcanvas) and desktop views

import {
  ChartNoAxesCombined,
  BarChart4,
  Boxes,
  ShoppingCart,
  LogOut,
} from "lucide-react"; // Lucide icons
import { useNavigate } from "react-router-dom";      // Navigation hook
import "../index.scss";                              // Custom styles

export default function Adminsidebar() {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Sidebar (Offcanvas for small screens) */}
      <div
        className="offcanvas offcanvas-start d-lg-none"
        data-bs-scroll="true"
        tabIndex="-1"
        id="adminSidebar"
        aria-labelledby="adminsidebarLabel"
      >
        {/* Offcanvas Header */}
        <div className="offcanvas-header border border-bottom">
          <div
            onClick={() => navigate("/admin/dashboard")}
            id="adminSidebarLabel"
            className="offcanvas-title mt-4 text-center d-flex gap-3"
            style={{ cursor: "pointer" }}
          >
            <ChartNoAxesCombined size={25} />
            <h5 className="fw-bold mb-3">Admin Panel</h5>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        {/* Offcanvas Body Navigation */}
        <div className="offcanvas-body">
          <nav className="d-flex flex-column gap-3 mt-4 ms-2">
            {/* Dashboard Link */}
            <div
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/dashboard")}
            >
              <BarChart4 size={20} />
              <span>Dashboard</span>
            </div>

            {/* Products Link */}
            <div
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/products")}
            >
              <Boxes size={20} />
              <span>Products</span>
            </div>

            {/* Orders Link */}
            <div
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/orders")}
            >
              <ShoppingCart size={20} />
              <span>Orders</span>
            </div>

            {/* Logout Button */}
            <div
              className="mt-auto d-flex align-items-center gap-2 text-danger"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/auth/login")}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar (Visible on large screens and above) */}
      <aside
        className="d-none d-lg-flex w-64 flex-column border-end p-4"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        {/* Admin Brand/Title */}
        <div
          className="d-flex gap-2 align-items-center mt-4 mb-4"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/admin/dashboard")}
        >
          <ChartNoAxesCombined size={25} />
          <h5 className="fw-bold">Admin Panel</h5>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="d-flex flex-column gap-3 ms-2 mt-4">
          <div
            className="d-flex align-items-center gap-2"
            onClick={() => navigate("/admin/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <BarChart4 size={20} />
            <span>Dashboard</span>
          </div>

          <div
            className="d-flex align-items-center gap-2"
            onClick={() => navigate("/admin/products")}
            style={{ cursor: "pointer" }}
          >
            <Boxes size={20} />
            <span>Products</span>
          </div>

          <div
            className="d-flex align-items-center gap-2"
            onClick={() => navigate("/admin/orders")}
            style={{ cursor: "pointer" }}
          >
            <ShoppingCart size={20} />
            <span>Orders</span>
          </div>

          <div
            className="mt-auto d-flex align-items-center gap-2 text-danger"
            onClick={() => navigate("/auth/login")}
            style={{ cursor: "pointer" }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </nav>
      </aside>
    </>
  );
}
