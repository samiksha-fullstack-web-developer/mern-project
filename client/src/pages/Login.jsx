import { useState } from 'react';
import '../index.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';

export default function Login() {
  // State to manage form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUser } = useUser();

  // Toast state for showing success/error messages
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: 'POST',
        credentials: 'include', // Include cookies with request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        const userRole = data.user?.role;

        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        await fetchUser();

        // Show success toast
        setToastType("primary");
        setToastMessage("Login Successfully 🎉");
        setShowToast(true);

        // Navigate after short delay
        setTimeout(() => {
          setShowToast(false);
          if (location.state?.from) {
            navigate(location.state.from);
          } else if (userRole === "admin") {
            navigate('/admin/dashboard');
          } else {
            navigate('/shop/home');
          }
        }, 2000);
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      // Show error toast
      const errorMsg = err.message || "❌ Invalid email or password.";
      setToastType("danger");
      setToastMessage(errorMsg);
      setShowToast(true);

      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className='container'>
      {/* Page Header */}
      <h2 className='text-center text-mainColor fw-bold'>Sign In to Continue</h2>
      <p className="text-muted text-center">Log in to manage orders and unlock offers.</p>

      {/* Login Form */}
      <div className="wrapp">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />

          <p className='text-end'>
            <Link to="/auth/forgot-password" className='text-mainColor text-decoration-none'>
              Forgot Password?
            </Link>
          </p>

          <input type="submit" className="bg-mainColor" value="Sign In" />
        </form>

        <p className='text-center'>
          Don't have an account?{" "}
          <Link to="/auth/register" className='text-mainColor text-decoration-none'>
            Register
          </Link>
        </p>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <div
            className={`toast show align-items-center text-bg-${toastType} border-0`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body text-white">
                {toastMessage}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
