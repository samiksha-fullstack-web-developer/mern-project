const express = require('express')
const { register, login, logout, forgotpassword, verifyOtp, resetPassword } = require('../controllers/authcontrollers')
const { requireLogin, requireAdmin } = require('../middleware/authmiddleware')

const authrouter = express.Router();
const productrouter = express.Router();

authrouter.post("/register", register);
authrouter.post("/login", login);
authrouter.post("/forgot-password/send-otp", forgotpassword);
authrouter.post("/forgot-password/verify", verifyOtp);
authrouter.post("/forgot-password/reset", resetPassword);
authrouter.post('/logout', logout)

//product
const upload = require("../middleware/multer");
const { addProduct, getAllProducts, updateProduct, deleteProduct } = require("../controllers/productController");
productrouter.post("/add", requireLogin, requireAdmin, upload.single("image"), addProduct);
productrouter.get("/all", requireLogin, requireAdmin, getAllProducts);
productrouter.put("/update/:id", requireLogin, requireAdmin, upload.single("image"), updateProduct);
productrouter.delete("/delete/:id", requireLogin, requireAdmin, deleteProduct);

module.exports = { authrouter, productrouter };