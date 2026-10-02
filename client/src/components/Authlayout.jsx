// AuthLayout.jsx - Layout for authentication pages (login/register)
// Splits the screen into a visual section and a form section

import { Outlet } from "react-router-dom";             // Renders nested auth routes
import "../index.scss";                                // Custom styles
import "bootstrap-icons/font/bootstrap-icons.css";     // Bootstrap icons

export const AuthLayout = () => {
  return (
    <div className="container-fluid min-vh-100 d-flex p-0">
      
      {/* ========================
          Left Section (LG+ only)
          Brand welcome & features
         ======================== */}
      <div className="d-none d-lg-flex col-lg-6 bg-mainColor text-white align-items-center justify-content-center">
        <div className="text-center px-5">
          <h1 className="fw-bold display-5">Welcome to ShopSphere</h1>
          <p className="fs-5">
            Shop the latest trends, trusted brands, and unbeatable prices.
          </p>

          {/* Feature Highlights */}
          <div className="mt-4">
            <div className="d-flex align-items-center mb-2">
              <span className="me-2"><i className="bi bi-check2"></i></span>
              <span className="text-light">Secure Payments</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <span className="me-2"><i className="bi bi-check2"></i></span>
              <span className="text-light">Free Delivery over ₹499</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="me-2"><i className="bi bi-check2"></i></span>
              <span className="text-light">7-Day Easy Returns</span>
            </div>
          </div>

          <p className="mt-5 fst-italic">“Smart Shopping Starts Here.”</p>
        </div>
      </div>

      {/* ========================
          Right Section
          Authentication forms
         ======================== */}
      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 bg-secColor">
        <div className="w-100" style={{ maxWidth: "420px" }}>
          {/* Nested route (e.g., Login/Register) will render here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
