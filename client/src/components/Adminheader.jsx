// Adminheader.jsx - Header component for the Admin Dashboard
// Includes mobile sidebar toggler and logout functionality

import { LogOut } from 'lucide-react';               // Icon for logout button
import '../index.scss';                              // Custom styles
import { useNavigate } from 'react-router-dom';      // Navigation hook
import { useUser } from '../context/UserContext';

export default function Adminheader() {
  const navigate = useNavigate();
  const { logout } = useUser();

  // Handles user logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="navbar navbar-info bg-light">
      {/* Sidebar toggler for mobile view */}
      <div className="ms-4 mt-4 mb-3">
        <button
          className="navbar-toggler d-lg-none d-sm-block"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#adminSidebar"
          aria-controls="adminSidebar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>

      {/* Logout button */}
      <div className="me-4 mt-4 mb-3">
        <button
          className="d-inline-flex bg-mainColor text-white border-0 rounded p-2 gap-2 shadow-sm align-items-center fw-medium"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </button>
      </div>
    </nav>
  );
}
