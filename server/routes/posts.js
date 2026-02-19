
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPost, getPosts, getPost, likePost, commentPost } = require('../controllers/postController');

router.post('/', auth, createPost);
router.get('/', auth, getPosts);
router.get('/:id', auth, getPost);
router.put('/like/:id', auth, likePost);
router.post('/comment/:id', auth, commentPost);

module.exports = router;
