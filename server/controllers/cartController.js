const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get the cart items for a specific user
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart) {
      return res.json({ success: true, cart: [] });
    }

    res.json({ success: true, cart: cart.items });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add a product to the user's cart
const addToCart = async (req, res) => {
  const { product, quantity } = req.body;

  try {
    // Check if product exists
    const productData = await Product.findById(product._id);
    if (!productData) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.userId });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === product._id
    );

    // If it exists, update quantity, else push new item
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: product._id, quantity });
    }

    await cart.save();

    // Populate product details before sending response
    const populatedCart = await cart.populate('items.product');
    res.json({ success: true, cart: populatedCart.items });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update quantity of a product in the cart
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    // Find the item to update
    const item = cart.items.find((item) => item.product.toString() === productId);

    if (item) {
      item.quantity = quantity;
      await cart.save();

      // Populate updated cart
      const populatedCart = await cart.populate('items.product');
      res.json({ success: true, cart: populatedCart.items });
    } else {
      res.status(404).json({ success: false, message: "Item not found in cart" });
    }
  } catch (err) {
    console.error("Error updating cart item:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove a product from the cart
const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    // Filter out the item to be removed
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    // Populate updated cart
    const populatedCart = await cart.populate('items.product');
    res.json({ success: true, cart: populatedCart.items });
  } catch (err) {
    console.error("Error removing cart item:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Clear all items from the cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) return res.json({ success: true, cart: [] });

    cart.items = [];
    await cart.save();

    res.json({ success: true, cart: [] });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Export all cart controller functions
module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
