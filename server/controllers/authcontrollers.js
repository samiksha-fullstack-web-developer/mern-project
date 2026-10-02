const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const Forgetpasswordlayout = require('../utils/forgetPasswordLayout');
const sendEmail = require('../utils/sendEmail');

// REGISTER CONTROLLER
const register = async (req, res) => {
  try {
    const { username, password, phone } = req.body;
    const email = req.body.email?.trim().toLowerCase();
// console.log(username, password, phone, role);
// return false;
    // Validate required fields
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check if email or username already exists
    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username })
    ]);

    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username already taken." });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "✅ Registration successful" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "❌ Server error during registration" });
  }
}
// LOGIN CONTROLLER
const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // Validate credentials
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ success: false, message: "❌ Email not found. Please register." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "❌ Incorrect password." });
    }

    // Save user info to session
    req.session.user = {
      _id: existingUser._id.toString(),
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role,
      phone: existingUser.phone
    };

    req.session.save((sessionError) => {
      if (sessionError) {
        console.error("Session Save Error:", sessionError);
        return res.status(500).json({ success: false, message: "❌ Failed to create login session" });
      }

      res.status(200).json({
        success: true,
        message: "🎉 Login successful!",
        user: req.session.user
      });
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "❌ Server error during login" });
  }
};

// FORGOT PASSWORD CONTROLLER
const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email input
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        message: "Valid email is required",
        error: true,
        success: false
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        error: true,
        success: false
      });
    }

    // Generate OTP and set expiry
    const otp = generateOtp();
    const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save OTP and expiry to user
    await User.findByIdAndUpdate(user._id, {
      forget_password_otp: otp,
      forget_password_expiry: expireTime.toISOString()
    });

    // Send OTP email
    await sendEmail({
      sendTo: email,
      subject: "Forget password from ShopSphere",
      html: Forgetpasswordlayout({
        name: user.username || "User",
        otp: otp
      })
    });

    return res.json({
      message: "Check your email",
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(400).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false
    });
  }
};

// OTP GENERATOR FUNCTION
const generateOtp = () => {
  return Math.floor(Math.random() * 900000) + 100000  // Generates 6-digit OTP
}

// VERIFY OTP CONTROLLER
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate inputs
    if (!email || !otp) {
      return res.status(400).json({
        message: "email and otp is not corect",
        success: "false"
      });
    }

    // 🔎 Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        error: true,
        success: false
      });
    }

    const currentTime = new Date();

    // Check OTP expiry
    if (user.forget_password_expiry < currentTime) {
      return res.status(400).json({
        message: "OTP Expired",
        error: true,
        success: "false"
      });
    }

    // Invalid OTP
    if (otp !== user.forget_password_otp) {
      return res.status(400).json({
        message: "Invaild otp",
        error: true,
        success: "false"
      });
    }

    // OTP is valid
    if (otp === user.forget_password_otp) {
      return res.status(200).json({
        message: "Verify otp successfully",
        error: false,
        success: "true"
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false
    });
  }
};

// RESET PASSWORD CONTROLLER
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Validate required fields
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Provide required fields",
      });
    }

    // 🔎 Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        error: true,
        success: false
      });
    }

    // Passwords don't match
    if (newPassword != confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password not match",
        error: true,
        success: false
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    const update = await User.findByIdAndUpdate(user._id, {
      password: hashPassword
    });

    return res.status(200).json({
      message: "Password Update succesfully",
      error: false,
      success: true
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false
    });
  }
};

// LOGOUT CONTROLLER
const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(400).json({ success: false, message: "Logout failed." });
    }

    // Clear session cookie
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax'
    });

    return res.status(200).json({ success: true, message: "✅ Logout successful." });
  });
};

// EXPORT ALL CONTROLLERS
module.exports = {
  register,
  login,
  logout,
  forgotpassword,
  verifyOtp,
  resetPassword
};
