require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');
const Product = require('./models/Product');

async function verifyDB() {
    try {
        console.log("Connecting to DB:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        console.log("Fetching Posts...");
        try {
            const posts = await Post.find()
                .sort({ date: -1 })
                .populate('user', ['username', 'avatar'])
                .populate('products', ['title', 'price', 'images', 'stock'])
                .limit(5);
            console.log(`✅ Fetched ${posts.length} posts`);
            if (posts.length > 0) {
                console.log("Sample Post:", JSON.stringify(posts[0], null, 2));
            }
        } catch (e) {
            console.error("❌ Error fetching posts:", e);
        }

        console.log("Fetching User...");
        const user = await User.findOne();
        if (user) {
            console.log("✅ Found user:", user.username);
        } else {
            console.log("❌ No users found");
        }

    } catch (e) {
        console.error("❌ DB Connection Error:", e);
    } finally {
        await mongoose.disconnect();
    }
}

verifyDB();
