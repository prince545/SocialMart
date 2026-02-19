
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addOrderItems, getOrderById, getMyOrders } = require('../controllers/orderController');

router.post('/', auth, addOrderItems);
router.get('/myorders', auth, getMyOrders);
router.get('/:id', auth, getOrderById);

module.exports = router;
