
const Product = require('../models/Product');

// @route   GET api/products
// @desc    Get all products with search and filter
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};

        // Price Filter (e.g. min=10&max=100)
        let price = {};
        if (req.query.minPrice || req.query.maxPrice) {
            price.price = {};
            if (req.query.minPrice) price.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) price.price.$lte = Number(req.query.maxPrice);
        }

        // If getting my products (dashboard)
        const userFilter = req.query.user ? { user: req.query.user } : {};

        const products = await Product.find({ ...keyword, ...category, ...price, ...userFilter }).populate('user', 'username avatar');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('user', 'username avatar');
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   POST api/products
// @desc    Create a product
// @access  Private
exports.createProduct = async (req, res) => {
    try {
        const { title, price, description, images, brand, category, stock } = req.body;

        const product = new Product({
            title,
            price,
            user: req.user.id,
            images,
            brand,
            category,
            stock,
            numReviews: 0,
            description
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check user
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await product.deleteOne();

        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
exports.updateProduct = async (req, res) => {
    try {
        const { title, price, description, images, brand, category, stock } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check user
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        product.title = title || product.title;
        product.price = price || product.price;
        product.description = description || product.description;
        product.images = images || product.images;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.stock = stock || product.stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   POST api/products/:id/reviews
// @desc    Create new review
// @access  Private
const { checkModeration } = require('./aiController');

exports.createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        // Moderate Content
        const modResult = checkModeration(comment);
        if (modResult.flagged) {
            return res.status(400).json({ msg: `Review rejected: ${modResult.reason}` });
        }

        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.ratings.find(
                (r) => r.user.toString() === req.user.id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ msg: 'Product already reviewed' });
            }

            const review = {
                name: req.user.username || 'User', // Fallback if name not populated, ideally fetch user
                rating: Number(rating),
                comment,
                user: req.user.id,
            };

            product.ratings.push(review);
            product.numReviews = product.ratings.length;

            product.save();
            res.status(201).json({ msg: 'Review added' });
        } else {
            res.status(404).json({ msg: 'Product not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
