const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

// @route   GET api/wishlist
// @desc    Get user's wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        let userFilter = {};
        if (req.user.id.startsWith('user_')) {
            const dbUser = await User.findOne({ clerkId: req.user.id }).select('_id');
            if (dbUser) {
                userFilter = { user: dbUser._id };
            } else {
                return res.json({ products: [] });
            }
        } else {
            userFilter = { user: req.user.id };
        }

        let wishlist = await Wishlist.findOne(userFilter).populate('products');
        if (!wishlist) {
            wishlist = new Wishlist({ user: userFilter.user, products: [] });
            await wishlist.save();
        }
        res.json(wishlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
    try {
        let userId;
        if (req.user.id.startsWith('user_')) {
            const dbUser = await User.findOne({ clerkId: req.user.id }).select('_id');
            if (!dbUser) {
                return res.status(404).json({ msg: 'User not found' });
            }
            userId = dbUser._id;
        } else {
            userId = req.user.id;
        }

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }

        if (!wishlist.products.includes(req.params.productId)) {
            wishlist.products.push(req.params.productId);
            await wishlist.save();
        }

        await wishlist.populate('products');
        res.json(wishlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE api/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
exports.removeFromWishlist = async (req, res) => {
    try {
        let userId;
        if (req.user.id.startsWith('user_')) {
            const dbUser = await User.findOne({ clerkId: req.user.id }).select('_id');
            if (!dbUser) {
                return res.status(404).json({ msg: 'User not found' });
            }
            userId = dbUser._id;
        } else {
            userId = req.user.id;
        }

        const wishlist = await Wishlist.findOne({ user: userId });
        if (wishlist) {
            wishlist.products = wishlist.products.filter(
                p => p.toString() !== req.params.productId
            );
            await wishlist.save();
            await wishlist.populate('products');
            res.json(wishlist);
        } else {
            res.status(404).json({ msg: 'Wishlist not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
