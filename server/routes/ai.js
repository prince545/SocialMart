
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateCaption, getRecommendations, generateProductDescription, generateSocialPost, moderateContentHeader, suggestChatReply, getSearchIntent, summarizeReviews, getPriceOptimization } = require('../controllers/aiController');

router.post('/caption', auth, generateCaption);
router.post('/description', auth, generateProductDescription);
router.get('/recommendations', auth, getRecommendations);
router.post('/social-post', auth, generateSocialPost);
router.post('/moderate', auth, moderateContentHeader);
router.post('/suggest-chat', auth, suggestChatReply);
router.post('/search-intent', auth, getSearchIntent);
router.post('/summarize-reviews', auth, summarizeReviews);
router.post('/price-optimization', auth, getPriceOptimization);

module.exports = router;
