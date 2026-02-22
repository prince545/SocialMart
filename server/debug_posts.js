require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/socialmart';

const checkPosts = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');

        const posts = await Post.find().limit(10);
        console.log(`Found ${posts.length} posts`);

        posts.forEach((p, i) => {
            console.log(`Post ${i}:`);
            console.log(`  _id: ${p._id}`);
            console.log(`  name: ${p.name}`);
            console.log(`  user: ${p.user}`);
            console.log(`  userId type: ${typeof p.user}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkPosts();
