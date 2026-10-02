const Forgetpasswordlayout = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>Hi ${name || "User"},</p>
      <p>We received a request to reset your password. Use the following OTP (One-Time Password) to reset it:</p>
      <h3 style="background-color:#ffc107">${otp}</h3>
      <p>This OTP is valid for 1 hour. If you didn't request this, please ignore this email.</p>
      <br />
      <p>Thanks,<br />ShopSphere Team</p>
    </div>
  `;
};

module.exports = Forgetpasswordlayout;
