const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

// Importing route modules
const { authrouter, productrouter } = require('./routes/rout'); // Admin/Auth routes
const shopproductroute = require('./routes/productroute');      // Frontend shop filter & product
const cartRoutes = require('./routes/cartRoute');               // Cart operations
const orderRoutes = require('./routes/orderRoute');             // Order handling (user)
const userRoutes = require('./routes/userRoute');               // User-related operations
const adminOrderRoutes = require('./routes/orderRoute');        // Admin order operations (same controller as user orders)

const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS middleware to allow frontend communication
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(cookieParser());

// Session middleware configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key from environment
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL, // MongoDB session store
      ttl: 24 * 60 * 60 // Session duration: 1 day
    }),
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // Cookie duration: 1 day
    }
  })
);

// Attach session user to request object if available
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
});

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving static files from /uploads
app.use('/uploads', express.static('uploads'));

// Auth routes
app.use("/auth", authrouter);

// Admin product routes
app.use("/products", productrouter);

// Frontend product filter/search routes
app.use('/products', shopproductroute);

// User routes
app.use('/api/user', userRoutes);       // GET user data

app.use('/api/cart', cartRoutes);       // Cart operations

app.use('/api/orders', orderRoutes);    // User order operations

// Admin order routes
app.use('/api/admin/orders', adminOrderRoutes);

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(err));

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));
