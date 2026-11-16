const Product = require('../models/Product');
const { invalidateCache } = require('../middleware/cacheMiddleware');

const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort } = req.query;

    const query = {};

    // Search filter across name or description
    if (keyword && keyword.trim() !== '') {
      query.$or = [
        { name: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all' && category.trim() !== '') {
      query.category = category;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice && !isNaN(minPrice)) query.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(maxPrice)) query.price.$lte = Number(maxPrice);
    }

    // Sorting logic
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const products = await Product.find(query).sort(sortOptions);
    const categories = await Product.distinct('category');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      categories
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, imageUrl, stockCount, featured } = req.body;

    if (!name || !price || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, price, category, and imageUrl'
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      price: Number(price),
      category: category.trim(),
      imageUrl: imageUrl.trim(),
      stockCount: stockCount !== undefined ? Number(stockCount) : 10,
      featured: Boolean(featured)
    });

    invalidateCache();
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { name, description, price, category, imageUrl, stockCount, featured } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category.trim();
    if (imageUrl !== undefined) product.imageUrl = imageUrl.trim();
    if (stockCount !== undefined) product.stockCount = Number(stockCount);
    if (featured !== undefined) product.featured = Boolean(featured);

    const updatedProduct = await product.save();

    invalidateCache();
    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    invalidateCache();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
};

