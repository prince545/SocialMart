
const Order = require('../models/Order');

// @route   POST api/orders
// @desc    Create new order
// @access  Private
exports.addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ msg: 'No order items' });
        } else {
            const order = new Order({
                orderItems,
                user: req.user.id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                // Mock Payment for now
                isPaid: true,
                paidAt: Date.now(),
                paymentResult: {
                    id: 'mock_payment_id',
                    status: 'COMPLETED',
                    update_time: Date.now(),
                    email_address: req.user.email
                }
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            // Check if admin or owner
            if (req.user.id !== order.user._id.toString()) {
                // We could implement anisAdmin check here later
                return res.status(401).json({ msg: 'Not authorized' });
            }
            res.json(order);
        } else {
            res.status(404).json({ msg: 'Order not found' });
        }
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   GET api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
