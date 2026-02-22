require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/socialmart';

const checkUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');

        const users = await User.find();
        console.log(`Found ${users.length} users`);

        users.forEach((u, i) => {
            console.log(`User ${i}:`);
            console.log(`  _id: ${u._id}`);
            console.log(`  username: ${u.username}`);
            console.log(`  clerkId: ${u.clerkId}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkUsers();
