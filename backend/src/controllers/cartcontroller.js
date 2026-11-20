const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Product = require("../models/product");

/**
 * Helper: Calculate pricing and totals for a cart with populated products.
 */
const formatCartResponse = (cart) => {
  let subtotal = 0;
  let totalItemsCount = 0;

  const formattedItems = cart.items.map((item) => {
    let unitPrice = 0;
    const prod = item.product;

    if (prod && Array.isArray(prod.sizes)) {
      const matchedSize = prod.sizes.find(
        (s) => s.name.toLowerCase() === item.size.toLowerCase()
      );
      unitPrice = matchedSize ? matchedSize.price : (prod.sizes[0]?.price || 0);
    }

    const itemTotal = unitPrice * item.quantity;
    subtotal += itemTotal;
    totalItemsCount += item.quantity;

    return {
      _id: item._id,
      product: prod,
      size: item.size,
      quantity: item.quantity,
      customization: item.customization,
      unitPrice,
      totalPrice: itemTotal,
    };
  });

  return {
    _id: cart._id,
    user: cart.user,
    items: formattedItems,
    itemCount: totalItemsCount,
    subtotal,
    updatedAt: cart.updatedAt,
  };
};

/**
 * -----------------------------------------------------------------------------
 * 1. GET CART (Customer)
 * Retrieves or initializes the user's active shopping cart.
 * -----------------------------------------------------------------------------
 */
const getCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name image slug sizes chaiType isAvailable",
    });

    // If no cart exists, create a fresh empty cart for this user
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    return res.status(200).json({
      success: true,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    console.error("Get cart error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve shopping cart.",
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 2. ADD TO CART (Customer)
 * Adds an item or increments quantity if an identical customization already exists.
 * -----------------------------------------------------------------------------
 */
const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { productId, size, quantity = 1, customization } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required.",
      });
    }

    const allowedSizes = ["small", "medium", "large"];
    const normalizedSize = (size || "medium").toLowerCase();
    if (!allowedSizes.includes(normalizedSize)) {
      return res.status(400).json({
        success: false,
        message: "Size must be 'small', 'medium', or 'large'.",
      });
    }

    // Verify product exists and is available
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) {
      return res.status(404).json({
        success: false,
        message: "Chai product is unavailable or not found.",
      });
    }

    // Default customization values if missing
    const resolvedCustomization = {
      sugar: customization?.sugar || "regular",
      milk: customization?.milk || "dairy",
      spiceLevel: customization?.spiceLevel || "medium",
    };

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Check if an item with exact same product, size, and customization already exists
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size.toLowerCase() === normalizedSize &&
        item.customization.sugar === resolvedCustomization.sugar &&
        item.customization.milk === resolvedCustomization.milk &&
        item.customization.spiceLevel === resolvedCustomization.spiceLevel
    );

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    if (existingItemIndex > -1) {
      // Increment quantity
      cart.items[existingItemIndex].quantity += qtyToAdd;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        size: normalizedSize,
        quantity: qtyToAdd,
        customization: resolvedCustomization,
      });
    }

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name image slug sizes chaiType isAvailable",
    });

    return res.status(200).json({
      success: true,
      message: `${product.name} added to cart.`,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add item to cart.",
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 3. UPDATE CART ITEM QUANTITY / CUSTOMIZATION
 * -----------------------------------------------------------------------------
 */
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { itemId } = req.params;
    const { quantity, size, customization } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Shopping cart not found.",
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart.",
      });
    }

    // If quantity is updated to 0 or less, remove item
    if (quantity !== undefined) {
      const parsedQty = parseInt(quantity, 10);
      if (parsedQty <= 0) {
        cart.items.pull(itemId);
      } else {
        item.quantity = parsedQty;
      }
    }

    if (size && ["small", "medium", "large"].includes(size.toLowerCase())) {
      item.size = size.toLowerCase();
    }

    if (customization) {
      if (customization.sugar) item.customization.sugar = customization.sugar;
      if (customization.milk) item.customization.milk = customization.milk;
      if (customization.spiceLevel) item.customization.spiceLevel = customization.spiceLevel;
    }

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name image slug sizes chaiType isAvailable",
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated.",
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    console.error("Update cart item error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart item.",
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 4. REMOVE ITEM FROM CART
 * -----------------------------------------------------------------------------
 */
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { itemId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    cart.items.pull(itemId);
    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name image slug sizes chaiType isAvailable",
    });

    return res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    console.error("Remove from cart error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to remove item from cart.",
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 5. CLEAR ENTIRE CART
 * -----------------------------------------------------------------------------
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Shopping cart cleared.",
      cart: {
        items: [],
        itemCount: 0,
        subtotal: 0,
      },
    });
  } catch (error) {
    console.error("Clear cart error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart.",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
