
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    createProductReview,
    getStats,
    getCategories
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/stats', getStats);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/', auth, createProduct);
router.delete('/:id', auth, deleteProduct);
router.put('/:id', auth, updateProduct);
router.post('/:id/reviews', auth, createProductReview);

module.exports = router;
