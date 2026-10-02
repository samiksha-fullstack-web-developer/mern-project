// AdminRoute.jsx - Route guard to protect admin-only routes
// Redirects unauthorized or unauthenticated users

import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user is logged in, redirect to login
  if (!user) return <Navigate to="/auth/login" />;

  // If user is not an admin, redirect to 404 or unauthorized page
  if (user.role !== "admin") return <Navigate to="*" />;

  // Authorized admin access granted
  return children;
}
