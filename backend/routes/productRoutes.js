const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

router.route('/')
  .get(cacheMiddleware, getProducts)
  .post(protect, admin, createProduct);

router.get('/categories', cacheMiddleware, getCategories);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
