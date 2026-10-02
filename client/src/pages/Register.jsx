import { useState } from 'react'
import '../index.scss'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  // Hook to programmatically navigate to other routes
  const navigate = useNavigate();

  // Toast state management
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Form input state
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
  })

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to register endpoint
      const res = await axios.post("http://localhost:5000/auth/register", formData);

      // On success, show success toast and navigate to login
      setToastType("primary");
      setToastMessage("Registration Successful! 🎉");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      // Handle registration error
      const errorMsg = err.response?.data?.message || "Registration failed";
      setToastType("danger");
      setToastMessage(`⚠️ ${errorMsg}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className='container'>
      {/* Title and subtitle */}
      <h2 className='text-center text-mainColor fw-bold'>Create New Account </h2>
      <p className='text-muted text-center'>Join ShopSphere for a smarter shopping experience.</p>

      <div className="wrapp">
        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="submit"
            className='bg-mainColor'
            value="Sign Up"
          />
        </form>

        {/* Link to login if already registered */}
        <p className='text-center'>
          Already have an Account?{" "}
          <Link to="/auth/login" className='text-mainColor text-decoration-none'>
            Log in
          </Link>
        </p>
      </div>

      {/* Toast Notification UI */}
      {showToast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <div className={`toast show align-items-center text-bg-${toastType} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
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
  )
}
