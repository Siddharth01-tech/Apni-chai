const mongoose = require("mongoose");
const Category = require("../models/category");
const Product = require("../models/product");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const createCategory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized. Admin privileges required.",
      });
    }

    const { name, slug, description, image, isActive, displayOrder } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const trimmedName = name.trim();
    const finalSlug = slug ? slug.trim().toLowerCase() : generateSlug(trimmedName);

    const existingCategory = await Category.findOne({
      $or: [{ name: trimmedName }, { slug: finalSlug }],
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "A category with this name or slug already exists.",
      });
    }

    const category = await Category.create({
      name: trimmedName,
      slug: finalSlug,
      description: description ? description.trim() : "",
      image: image || "",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create category.",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = {};

    if (all !== "true") {
      filter.isActive = true;
    }

    const categories = await Category.find(filter).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve categories.",
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format.",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get category by ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve category.",
    });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Category slug is required.",
      });
    }

    const category = await Category.findOne({
      slug: slug.trim().toLowerCase(),
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get category by slug error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve category.",
    });
  }
};

const updateCategory = async (req, res) => {
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
        message: "Invalid category ID format.",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const { name, slug, description, image, isActive, displayOrder } = req.body;

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = Boolean(isActive);
    if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);

    if (slug) {
      const formattedSlug = slug.trim().toLowerCase();
      const conflict = await Category.findOne({
        slug: formattedSlug,
        _id: { $ne: id },
      });
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: "Slug is already in use by another category.",
        });
      }
      category.slug = formattedSlug;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update category.",
    });
  }
};

const deleteCategory = async (req, res) => {
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
        message: "Invalid category ID format.",
      });
    }

    const associatedProductsCount = await Product.countDocuments({ category: id });
    if (associatedProductsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It currently contains ${associatedProductsCount} products. Reassign or delete those products first.`,
      });
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Category '${deleted.name}' deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete category error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category.",
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};
