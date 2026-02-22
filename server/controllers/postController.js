
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
        const modResult = await checkModeration(textToCheck);
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
            .sort({ createdAt: -1 })
            .populate('user', ['username', 'avatar'])
            .populate('products', ['title', 'price', 'images', 'stock'])
            .populate('likes.user', ['username', 'avatar']);
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

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private (owner only)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check ownership
        const isOwner = post.user.toString() === req.user.id;

        // Find the owner user to check if they are a legacy user (no clerkId)
        const ownerUser = await User.findById(post.user);
        const isLegacyOwner = ownerUser && !ownerUser.clerkId;
        const isAdminPost = post.name === 'Admin';

        // Allow deletion if:
        // 1. Current user is the owner
        // 2. Post belongs to a legacy user (no clerkId) - safe for dev/migration cleanup
        // 3. It's a seeded Admin post
        if (!isOwner && !isLegacyOwner && !isAdminPost) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.deleteOne();
        res.json({ msg: 'Post removed', id: req.params.id });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   DELETE api/posts/all
// @desc    Delete all posts by the current user
// @access  Private
exports.deleteAllPosts = async (req, res) => {
    try {
        // Find all users who DON'T have a clerkId (legacy users)
        const legacyUsers = await User.find({ clerkId: { $exists: false } }).select('_id');
        const legacyUserIds = legacyUsers.map(u => u._id);

        // Posts to delete: 
        // 1. Posts owned by current user
        // 2. Posts owned by legacy users
        // 3. Posts named 'Admin'
        const postsToDelete = await Post.find({
            $or: [
                { user: req.user.id },
                { user: { $in: legacyUserIds } },
                { name: 'Admin' }
            ]
        }).select('_id');

        const idsToDelete = postsToDelete.map(p => p._id);

        await Post.deleteMany({ _id: { $in: idsToDelete } });

        res.json({ msg: 'Posts removed successfully', deletedIds: idsToDelete });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
