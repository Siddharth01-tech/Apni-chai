const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");

/**
 * Helper: Generate URL-safe slug from product name.
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * -----------------------------------------------------------------------------
 * 1. CREATE PRODUCT (addproduct)
 * Admin only. Adds a new chai product to the Chaiva catalog.
 * -----------------------------------------------------------------------------
 */
const addproduct = async (req, res) => {
  try {
    // Admin authorization check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized. Admin privileges required.",
      });
    }

    const {
      name,
      slug,
      description,
      category,
      chaiType,
      chaitype,
      sizes,
      stock,
      image,
      ImageofProduct,
      isAvailable,
    } = req.body;

    // Resolve case differences & aliases
    const resolvedChaiType = (chaiType || chaitype || "").toLowerCase().trim();
    const resolvedImage = image || ImageofProduct || "";

    // 1. Required field validations
    if (!name || !description || !category || !resolvedChaiType) {
      return res.status(400).json({
        success: false,
        message: "Name, description, category, and chaiType are required.",
      });
    }

    // 2. Validate category ID
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format.",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // 3. Validate chaiType enum matching Product model
    const allowedChaiTypes = [
      "masala",
      "ginger",
      "elaichi",
      "kesar",
      "kulhad",
      "cutting",
      "other",
    ];
    if (!allowedChaiTypes.includes(resolvedChaiType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid chaiType. Must be one of: ${allowedChaiTypes.join(", ")}`,
      });
    }

    // 4. Validate sizes
    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one size option (small, medium, or large) with price is required.",
      });
    }

    for (const s of sizes) {
      if (!s.name || !["small", "medium", "large"].includes(s.name.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Each size name must be 'small', 'medium', or 'large'.",
        });
      }
      if (typeof s.price !== "number" || s.price < 0) {
        return res.status(400).json({
          success: false,
          message: "Each size must have a valid positive price.",
        });
      }
    }

    // 5. Generate / Validate unique slug
    let finalSlug = slug ? slug.trim().toLowerCase() : generateSlug(name);
    const existingSlug = await Product.findOne({ slug: finalSlug });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // 6. Create product document
    const newProduct = await Product.create({
      name: name.trim(),
      slug: finalSlug,
      description: description.trim(),
      category,
      chaiType: resolvedChaiType,
      sizes: sizes.map((s) => ({
        name: s.name.toLowerCase(),
        price: Number(s.price),
        isAvailable: s.isAvailable !== undefined ? Boolean(s.isAvailable) : true,
      })),
      stock: stock !== undefined ? Number(stock) : 100,
      image: resolvedImage,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Chai product added successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Add product error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add product.",
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 2. GET ALL PRODUCTS (Public / Frontend)
 * Supports filtering by category, chaiType, availability, price, search & pagination.
 * -----------------------------------------------------------------------------
 */
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      chaiType,
      chaitype,
      isAvailable,
      search,
      q,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    // Filter by availability (default true for customers unless specified)
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === "true";
    }

    // Filter by category
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    // Filter by chaiType
    const selectedChaiType = chaiType || chaitype;
    if (selectedChaiType) {
      filter.chaiType = selectedChaiType.toLowerCase().trim();
    }

    // Search by name or description
    const searchQuery = search || q;
    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery.trim(), $options: "i" } },
        { description: { $regex: searchQuery.trim(), $options: "i" } },
      ];
    }

    // Price range filter on sizes
    if (minPrice || maxPrice) {
      filter["sizes.price"] = {};
      if (minPrice) filter["sizes.price"].$gte = Number(minPrice);
      if (maxPrice) filter["sizes.price"].$lte = Number(maxPrice);
    }

    // Sorting options
    let sortOptions = { createdAt: -1 }; // newest first
    if (sort === "price_asc") sortOptions = { "sizes.0.price": 1 };
    if (sort === "price_desc") sortOptions = { "sizes.0.price": -1 };
    if (sort === "name_asc") sortOptions = { name: 1 };
    if (sort === "name_desc") sortOptions = { name: -1 };

    // Pagination
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNumber - 1) * pageSize;

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: products.length,
      total: totalCount,
      page: pageNumber,
      totalPages: Math.ceil(totalCount / pageSize),
      products,
    });
  } catch (error) {
    console.error("Get all products error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products.",
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 3. GET SINGLE PRODUCT BY ID (Public / Frontend)
 * -----------------------------------------------------------------------------
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }

    const foundProduct = await Product.findById(id).populate("category", "name slug");

    if (!foundProduct) {
      return res.status(404).json({
        success: false,
        message: "Chai product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product: foundProduct,
    });
  } catch (error) {
    console.error("Get product by ID error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve product.",
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 4. GET PRODUCT BY SLUG (Public / Frontend SEO)
 * E.g., /api/v1/products/slug/masala-chai
 * -----------------------------------------------------------------------------
 */
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Product slug is required.",
      });
    }

    const foundProduct = await Product.findOne({
      slug: slug.toLowerCase().trim(),
    }).populate("category", "name slug");

    if (!foundProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product: foundProduct,
    });
  } catch (error) {
    console.error("Get product by slug error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve product.",
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 5. GET SIGNATURE CHAI PRODUCTS (Frontend Homepage Section)
 * Returns the highlighted signature chais (Masala, Ginger, Elaichi, etc.)
 * -----------------------------------------------------------------------------
 */
const getSignatureChais = async (req, res) => {
  try {
    // Look for popular signature chai types or available items
    const signatureTypes = ["masala", "ginger", "elaichi", "kulhad"];

    const products = await Product.find({
      isAvailable: true,
      chaiType: { $in: signatureTypes },
    })
      .populate("category", "name slug")
      .limit(6);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get signature chais error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve signature chais.",
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 6. UPDATE PRODUCT (Admin Only)
 * -----------------------------------------------------------------------------
 */
const updateProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized. Admin privileges required.",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const {
      name,
      slug,
      description,
      category,
      chaiType,
      chaitype,
      sizes,
      stock,
      image,
      ImageofProduct,
      isAvailable,
    } = req.body;

    if (name) existingProduct.name = name.trim();
    if (description) existingProduct.description = description.trim();
    if (stock !== undefined) existingProduct.stock = Number(stock);
    if (isAvailable !== undefined) existingProduct.isAvailable = Boolean(isAvailable);

    const resolvedImage = image || ImageofProduct;
    if (resolvedImage !== undefined) existingProduct.image = resolvedImage;

    const resolvedChaiType = chaiType || chaitype;
    if (resolvedChaiType) {
      const allowedChaiTypes = [
        "masala",
        "ginger",
        "elaichi",
        "kesar",
        "kulhad",
        "cutting",
        "other",
      ];
      if (!allowedChaiTypes.includes(resolvedChaiType.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Invalid chaiType. Must be one of: ${allowedChaiTypes.join(", ")}`,
        });
      }
      existingProduct.chaiType = resolvedChaiType.toLowerCase();
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID.",
        });
      }
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }
      existingProduct.category = category;
    }

    if (slug) {
      const formattedSlug = slug.toLowerCase().trim();
      const slugConflict = await Product.findOne({
        slug: formattedSlug,
        _id: { $ne: id },
      });
      if (slugConflict) {
        return res.status(400).json({
          success: false,
          message: "Slug is already in use by another product.",
        });
      }
      existingProduct.slug = formattedSlug;
    }

    if (sizes && Array.isArray(sizes) && sizes.length > 0) {
      existingProduct.sizes = sizes.map((s) => ({
        name: s.name.toLowerCase(),
        price: Number(s.price),
        isAvailable: s.isAvailable !== undefined ? Boolean(s.isAvailable) : true,
      }));
    }

    await existingProduct.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: existingProduct,
    });
  } catch (error) {
    console.error("Update product error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update product.",
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 7. DELETE PRODUCT (Admin Only)
 * -----------------------------------------------------------------------------
 */
const deleteProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized. Admin privileges required.",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Product '${deletedProduct.name}' was deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
};

/**
 * -----------------------------------------------------------------------------
 * 8. TOGGLE PRODUCT AVAILABILITY (Admin Quick Action)
 * -----------------------------------------------------------------------------
 */
const toggleProductAvailability = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized. Admin privileges required.",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product is now ${product.isAvailable ? "available" : "unavailable"}.`,
      isAvailable: product.isAvailable,
      product,
    });
  } catch (error) {
    console.error("Toggle availability error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to toggle availability.",
    });
  }
};

module.exports = {
  addproduct,
  createProduct: addproduct, // Semantic alias
  getAllProducts,
  getProducts: getAllProducts, // Semantic alias
  getProductById,
  getProduct: getProductById, // Semantic alias
  getProductBySlug,
  getSignatureChais,
  updateProduct,
  deleteProduct,
  deleteproduct: deleteProduct, // Semantic alias
  toggleProductAvailability,
};
