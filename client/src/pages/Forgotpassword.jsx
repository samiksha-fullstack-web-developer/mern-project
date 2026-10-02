import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function Forgotpassword() {
  // State management for form inputs and UI steps
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // Tracks current step in flow
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  // Step 1: Send OTP to user email
  const sendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/forgot-password/send-otp', { email });
      setMsg(res.data.message);
      setStep(2); // Move to OTP input step
    } catch (err) {
      setMsg(err.response?.data?.message || "Error sending OTP");
    }
  };

  // Step 2: Verify the OTP entered by the user
  const verifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/forgot-password/verify', { email, otp });
      setMsg(res.data.message);
      setStep(3); // Move to password reset step
    } catch (err) {
      setMsg(err.response?.data?.message || "OTP verification failed");
    }
  };

  // Step 3: Reset user password using verified OTP
  const resetPass = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/forgot-password/reset', {
        email,
        otp,
        newPassword,
        confirmPassword
      });

      // Show success toast and redirect after short delay
      toast.success('Password updated successfully', {
        position: 'top-right',
        autoClose: 2000
      });

      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);

      // Reset all states after successful password change
      setStep(1);
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password", {
        position: 'top-center',
        autoClose: 3000
      });
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="text-primary mb-3">Forgot Password</h2>

      {/* Display response message */}
      {msg && <p className="text-danger">{msg}</p>}

      {/* Step 1: Enter email to receive OTP */}
      {step === 1 && (
        <>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button onClick={sendOtp} className="btn btn-primary">Send OTP</button>
        </>
      )}

      {/* Step 2: Enter OTP received on email */}
      {step === 2 && (
        <>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp} className="btn btn-warning">Verify OTP</button>
        </>
      )}

      {/* Step 3: Enter and confirm new password */}
      {step === 3 && (
        <>
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button onClick={resetPass} className="btn btn-primary">Reset Password</button>
        </>
      )}

      {/* Toast container for success/error notifications */}
      <ToastContainer />
    </div>
  );
}
