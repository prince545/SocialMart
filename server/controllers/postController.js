
const Post = require('../models/Post');
const User = require('../models/User');
const Product = require('../models/Product');

const { checkModeration } = require('./aiController');

// ... (imports)

// @route   POST api/posts
// @desc    Create a post
// @access  Private
exports.createPost = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        // Moderate Content
        const textToCheck = `${req.body.text || ''} ${req.body.caption || ''}`.trim();
        const modResult = checkModeration(textToCheck);
        if (modResult.flagged) {
            return res.status(400).json({ msg: `Post rejected: ${modResult.reason}` });
        }

        // Parse products if it's a string (from FormData) or use as is
        let products = [];
        if (req.body.products) {
            try {
                products = typeof req.body.products === 'string'
                    ? JSON.parse(req.body.products)
                    : req.body.products;
            } catch (e) {
                console.error("Error parsing products:", e);
                products = [];
            }
        }

        const newPost = new Post({
            user: req.user.id,
            name: user.username || user.name,
            avatar: user.avatar,
            image: req.body.image,
            caption: req.body.caption,
            products: products
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ date: -1 })
            .populate('user', ['username', 'avatar'])
            .populate('products', ['title', 'price', 'images', 'stock']);
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            // Get remove index
            const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
            post.likes.splice(removeIndex, 1);
        } else {
            post.likes.unshift({ user: req.user.id });
        }

        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
exports.commentPost = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.username,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
