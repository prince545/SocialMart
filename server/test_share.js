require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/Message');
const Post = require('./models/Post');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/socialmart';

const verifySharing = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');

        // Find a post
        const post = await Post.findOne();
        if (!post) {
            console.error('No posts found to verify sharing');
            process.exit(1);
        }

        // Find two users
        const users = await User.find().limit(2);
        if (users.length < 2) {
            console.error('Need at least 2 users to verify sharing');
            process.exit(1);
        }

        const sender = users[0];
        const receiver = users[1];

        console.log(`Sharing post ${post._id} from ${sender.username} to ${receiver.username}`);

        // Create a message with shared post
        const newMessage = new Message({
            sender: sender._id,
            receiver: receiver._id,
            content: 'Check this out!',
            sharedPost: post._id
        });

        const savedMessage = await newMessage.save();
        console.log('Message saved successfully');

        // Retrieve and populate
        const retrievedMessage = await Message.findById(savedMessage._id).populate('sharedPost');

        if (retrievedMessage.sharedPost && retrievedMessage.sharedPost._id.toString() === post._id.toString()) {
            console.log('Post sharing verification PASSED: Post data populated correctly');
            console.log('Shared Post Image:', retrievedMessage.sharedPost.image);
        } else {
            console.error('Post sharing verification FAILED: Post data not populated');
        }

        // Cleanup
        await Message.deleteOne({ _id: savedMessage._id });
        console.log('Test message cleaned up');

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifySharing();
