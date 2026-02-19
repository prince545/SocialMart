
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateCaption, getRecommendations, generateProductDescription, generateSocialPost, moderateContentHeader } = require('../controllers/aiController');

router.post('/caption', auth, generateCaption);
router.post('/description', auth, generateProductDescription);
router.get('/recommendations', auth, getRecommendations);
router.post('/social-post', auth, generateSocialPost);
router.post('/moderate', auth, moderateContentHeader);

module.exports = router;
