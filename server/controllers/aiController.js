const { GoogleGenAI } = require("@google/genai");
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Initialize Gemini with new SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-2.0-flash";

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

        const prompt = `Create a promotional social media post for a product named "${title}" priced at ₹${price}. 
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

exports.checkModeration = async (text) => {
    try {
        if (!text || text.length < 5) return { flagged: false };

        const prompt = `Classify the following text as 'SAFE' or 'UNSAFE' based on ecommerce community guidelines (no hate speech, spam, harassment, or explicit content). 
        Text: "${text}". 
        Respond ONLY with JSON: { "flagged": boolean, "reason": "string" }.`;

        const response = await ai.getGenerativeModel({ model: MODEL_NAME }).generateContent(prompt);
        let textResult = response.response.text();

        // Clean up markdown code blocks if present
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonResult = JSON.parse(textResult);
        return jsonResult;
    } catch (err) {
        console.error("Gemini Moderation Error:", err);
        // Fallback to basic local check
        const safeText = (text || '').toLowerCase();
        const badWords = ['spam', 'hate', 'badword', 'offensive', 'scam', 'fraud'];
        const found = badWords.find(w => safeText.includes(w));
        return found ? { flagged: true, reason: `Contains inappropriate word: ${found}` } : { flagged: false };
    }
};

// @route   POST api/ai/suggest-chat
// @desc    Suggest a reply based on chat history
// @access  Private
exports.suggestChatReply = async (req, res) => {
    try {
        const { messages, context } = req.body;

        const historyStr = messages
            .slice(-10) // Last 10 messages
            .map(m => `${m.senderModel === 'User' ? 'Other' : 'Me'}: ${m.text}`)
            .join('\n');

        const prompt = `You are a helpful assistant in a social commerce app called SocialMart. 
        Based on this chat history, suggest a natural, short reply for 'Me'.
        History:
        ${historyStr}
        
        Context: ${context || 'General chat'}
        
        Respond ONLY with a single sentence suggestion.`;

        const response = await ai.getGenerativeModel({ model: MODEL_NAME }).generateContent(prompt);
        const suggestion = response.response.text();

        res.json({ suggestion: suggestion.trim() });
    } catch (err) {
        console.error("Gemini Suggest Error:", err);
        res.status(500).json({ error: 'AI suggestion failed' });
    }
};

// @route   POST api/ai/search-intent
// @desc    Translate natural language to search filters
// @access  Public
exports.getSearchIntent = async (req, res) => {
    try {
        const { query } = req.body;

        const prompt = `Translate this user search query into a JSON filter object for an ecommerce app.
        Query: "${query}"
        
        Available fields: keyword, category, minPrice, maxPrice, brand, sort (newest, price-low, price-high).
        
        Respond ONLY with a valid JSON object.
        Example: "cheap blue sneakers" -> { "keyword": "sneakers", "maxPrice": 500, "color": "blue" }`;

        const response = await ai.getGenerativeModel({ model: MODEL_NAME }).generateContent(prompt);
        let textResult = response.response.text();
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonResult = JSON.parse(textResult);
        res.json(jsonResult);
    } catch (err) {
        console.error("Gemini Search Intent Error:", err);
        res.json({ keyword: query }); // Fallback to simple keyword
    }
};

// @route   POST api/ai/summarize-reviews
// @desc    Summarize product reviews
// @access  Public
exports.summarizeReviews = async (req, res) => {
    try {
        const { reviews, productTitle } = req.body;

        if (!reviews || reviews.length === 0) {
            return res.json({ summary: "No reviews to summarize yet." });
        }

        const reviewsText = reviews.map(r => `Rating: ${r.rating}/5, Comment: ${r.comment}`).join('\n---\n');

        const prompt = `Summarize these customer reviews for the product "${productTitle}". 
        Be concise, highlight the pros and cons, and mention the overall sentiment. 
        Keep it under 3-4 bullet points.
        Reviews:
        ${reviewsText}`;

        const response = await ai.getGenerativeModel({ model: MODEL_NAME }).generateContent(prompt);
        const summary = response.response.text();

        res.json({ summary: summary.trim() });
    } catch (err) {
        console.error("Gemini Summary Error:", err);
        res.status(500).json({ error: 'AI summarization failed' });
    }
};

// @route   POST api/ai/price-optimization
// @desc    Get AI price suggestion for a product
// @access  Public
exports.getPriceOptimization = async (req, res) => {
    try {
        const { title, category, brand, description } = req.body;

        const prompt = `Based on these product details, suggest an optimal, competitive price range (Min and Max INR/Rupees) and a recommended "sweet spot" price.
        Product: ${title}
        Category: ${category}
        Brand: ${brand || 'Unknown'}
        Description: ${description || 'N/A'}
        
        Respond ONLY with JSON: { "minPrice": number, "maxPrice": number, "recommendedPrice": number, "reason": "string" }.`;

        const response = await ai.getGenerativeModel({ model: MODEL_NAME }).generateContent(prompt);
        let textResult = response.response.text();
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonResult = JSON.parse(textResult);
        res.json(jsonResult);
    } catch (err) {
        console.error("Gemini Price optimization Error:", err);
        res.status(500).json({ error: 'AI price optimization failed' });
    }
};
