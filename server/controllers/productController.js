
const Product = require('../models/Product');
const User = require('../models/User');
const Post = require('../models/Post');

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
        const subcategory = req.query.subcategory ? { subcategory: req.query.subcategory } : {};
        const brand = req.query.brand ? { brand: { $regex: req.query.brand, $options: 'i' } } : {};
        const size = req.query.size ? { sizes: { $in: [req.query.size] } } : {};
        const color = req.query.color ? { colors: { $in: [req.query.color] } } : {};
        const isNewArrival = req.query.newArrival === 'true' ? { isNewArrival: true } : {};
        const isTrending = req.query.trending === 'true' ? { isTrending: true } : {};

        // Price Filter (e.g. min=10&max=100)
        let price = {};
        if (req.query.minPrice || req.query.maxPrice) {
            price.price = {};
            if (req.query.minPrice) price.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) price.price.$lte = Number(req.query.maxPrice);
        }

        // User filter — support both Clerk string IDs and MongoDB ObjectIds
        let userFilter = {};
        if (req.query.user) {
            const rawUser = req.query.user;
            if (rawUser.startsWith('user_')) {
                // Clerk ID — resolve to MongoDB _id
                const dbUser = await User.findOne({ clerkId: rawUser }).select('_id');
                if (dbUser) {
                    userFilter = { user: dbUser._id };
                } else {
                    // No matching user found — return empty result
                    return res.json([]);
                }
            } else {
                userFilter = { user: rawUser };
            }
        }

        const products = await Product.find({ ...keyword, ...category, ...subcategory, ...price, ...brand, ...size, ...color, ...isNewArrival, ...isTrending, ...userFilter }).populate('user', 'username avatar');

        // Sort by trending/new arrival if requested
        let sortedProducts = products;
        if (req.query.sort === 'trending') {
            sortedProducts = products.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
        } else if (req.query.sort === 'newest') {
            sortedProducts = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (req.query.sort === 'price-low') {
            sortedProducts = products.sort((a, b) => a.price - b.price);
        } else if (req.query.sort === 'price-high') {
            sortedProducts = products.sort((a, b) => b.price - a.price);
        }

        res.json(sortedProducts);
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
        const modResult = await checkModeration(comment);
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

// @route   GET api/products/stats
// @desc    Get counts for homepage
// @access  Public
exports.getStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();

        res.json({
            activeBuyers: totalUsers + 12430, // Mocking some growth as per design
            verifiedSellers: Math.floor(totalUsers / 4) + 3200,
            totalProducts,
            totalPosts,
            satisfactionRate: 99
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/products/categories
// @desc    Get unique categories with representative images
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        const categoryData = await Promise.all(categories.map(async (cat) => {
            const product = await Product.findOne({ category: cat }).select('images');
            return {
                name: cat,
                image: product && product.images && product.images.length > 0
                    ? product.images[0]
                    : 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80',
                count: await Product.countDocuments({ category: cat })
            };
        }));
        res.json(categoryData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
