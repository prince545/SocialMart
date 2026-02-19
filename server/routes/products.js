
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProducts, getProductById, createProduct, deleteProduct, updateProduct, createProductReview } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', auth, createProduct);
router.delete('/:id', auth, deleteProduct);
router.put('/:id', auth, updateProduct);
router.post('/:id/reviews', auth, createProductReview);

module.exports = router;
