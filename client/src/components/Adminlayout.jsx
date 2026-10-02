// Adminlayout.jsx - Layout component for the Admin Dashboard
// Combines the sidebar, header, and main content area using React Router's Outlet

import { Outlet } from 'react-router-dom';    // For rendering nested routes
import Adminsidebar from './Adminsidebar';    // Sidebar component
import Adminheader from './Adminheader';      // Header component

export default function Adminlayout() {
  return (
    <div className="d-flex flex-nowrap min-vh-100 w-100">
      {/* Admin Sidebar (fixed for large screens) */}
      <Adminsidebar />

      {/* Main content area: includes header and dynamic content */}
      <div className="d-flex flex-column flex-grow-1">
        {/* Top Header */}
        <Adminheader />

        {/* Dynamic page content rendered here */}
        <main className="flex-grow-1 bg-light p-0 border border-top">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
