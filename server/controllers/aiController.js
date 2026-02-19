const { GoogleGenAI } = require("@google/genai");
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Initialize Gemini with new SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

// Helper: fetch remote image as base64
function fetchImageAsBase64(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => {
                const buf = Buffer.concat(chunks);
                resolve({ data: buf.toString('base64'), mimeType: res.headers['content-type'] || 'image/jpeg' });
            });
            res.on('error', reject);
        }).on('error', reject);
    });
}

// @route   POST api/ai/caption
// @desc    Generate a caption for an image using Gemini Vision
// @access  Private
exports.generateCaption = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        let imagePart = null;

        if (imageUrl && !imageUrl.includes('placeholder')) {
            try {
                let base64Data, mimeType;

                // Local upload path: /uploads/filename.jpg
                if (imageUrl.includes('/uploads/')) {
                    const filename = imageUrl.split('/uploads/')[1];
                    const filepath = path.join(__dirname, '..', 'uploads', filename);
                    if (fs.existsSync(filepath)) {
                        const buf = fs.readFileSync(filepath);
                        base64Data = buf.toString('base64');
                        const ext = path.extname(filename).slice(1).toLowerCase();
                        mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
                    }
                }
                // External URL or base64 data URL
                else if (imageUrl.startsWith('data:image')) {
                    const match = imageUrl.match(/^data:(image\/\w+);base64,(.+)$/);
                    if (match) { mimeType = match[1]; base64Data = match[2]; }
                } else if (imageUrl.startsWith('http')) {
                    const result = await fetchImageAsBase64(imageUrl);
                    base64Data = result.data;
                    mimeType = result.mimeType;
                }

                if (base64Data) {
                    imagePart = { inlineData: { data: base64Data, mimeType } };
                }
            } catch (imgErr) {
                console.warn('Could not load image for Gemini:', imgErr.message);
            }
        }

        const textPart = { text: "Generate a short, catchy, engaging social media caption for this image. Include relevant emojis and 5-7 hashtags. Keep it under 3 sentences." };

        const parts = imagePart ? [imagePart, textPart] : [{ text: "Generate a short, catchy Instagram caption for a lifestyle/product image. Include emojis and hashtags." }];

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{ role: "user", parts }]
        });

        const caption = response.candidates[0].content.parts[0].text;
        res.json({ caption: caption.replace(/\n/g, ' ').trim() });
    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: 'AI generation failed', details: err.message });
    }
};

// @route   POST api/ai/description
// @desc    Generate a product description
// @access  Private
exports.generateProductDescription = async (req, res) => {
    try {
        const { title, category, keywords } = req.body;

        const prompt = `Write a compelling ecommerce product description for a "${title}" in the category "${category}". 
        Keywords to include: ${keywords}. 
        Make it persuasive, highlighting features and benefits. Keep it under 100 words.`;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const description = response.candidates[0].content.parts[0].text;

        res.json({ description: description.trim() });
    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: 'AI generation failed' });
    }
};

// @route   GET api/ai/recommendations
// @desc    Get product recommendations (Simulated + AI Enhancement Idea)
// @access  Private
exports.getRecommendations = async (req, res) => {
    try {
        // Real-time AI recommendation usually needs user history + vector DB.
        // We will keep the random logic but maybe enhance it later. 
        const Product = require('../models/Product');
        const count = await Product.countDocuments();
        if (count === 0) return res.json([]);

        let products;
        if (count <= 3) {
            products = await Product.find();
        } else {
            const random = Math.floor(Math.random() * (count - 3));
            products = await Product.find().skip(random < 0 ? 0 : random).limit(3);
        }

        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/ai/social-post
// @desc    Generate a social media post
// @access  Private
exports.generateSocialPost = async (req, res) => {
    try {
        const { product } = req.body;
        const title = product.title || "Amazing Product";
        const price = product.price || "Check it out";

        const prompt = `Create a promotional social media post for a product named "${title}" priced at $${price}. 
        Use an exciting tone, include emojis, and call to action. 3 variations.`;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const post = response.candidates[0].content.parts[0].text;

        res.json({ post: post.trim() });
    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: 'AI generation failed' });
    }
};

// @route   POST api/ai/moderate
// @desc    Check content for moderation
// @access  Private
exports.moderateContentHeader = async (req, res) => {
    try {
        const { text } = req.body;

        const prompt = `Classify the following text as 'SAFE' or 'UNSAFE' based on ecommerce community guidelines (no hate speech, spam, or explicit content). 
        Text: "${text}". 
        Respond ONLY with JSON: { "flagged": boolean, "reason": "string" }.`;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        let textResult = response.candidates[0].content.parts[0].text;

        // Clean up markdown code blocks if present
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonResult = JSON.parse(textResult);

        res.json(jsonResult);
    } catch (err) {
        console.error("Gemini Error:", err);
        // Fallback to basic
        const badWords = ['spam', 'hate', 'badword', 'offensive'];
        const found = badWords.find(w => text.toLowerCase().includes(w));
        res.json(found ? { flagged: true, reason: `Contains inappropriate word: ${found}` } : { flagged: false });
    }
};

exports.checkModeration = (text) => {
    const safeText = (text || '').toLowerCase();
    const badWords = ['spam', 'hate', 'badword', 'offensive'];
    const found = badWords.find(w => safeText.includes(w));
    return found ? { flagged: true, reason: `Contains inappropriate word: ${found}` } : { flagged: false };
};
