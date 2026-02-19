
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const seedProducts = async () => {
    try {
        await Product.deleteMany({});

        // Ensure there's a user to assign as creator
        let adminUser = await User.findOne({ email: 'admin@socialmart.com' });
        if (!adminUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);
            adminUser = await User.create({
                username: 'Admin',
                email: 'admin@socialmart.com',
                password: hashedPassword
            });
        }

        const products = [
            {
                title: 'Airpods Wireless Bluetooth Headphones',
                images: ['https://images.unsplash.com/photo-1572569028738-411a0977d4b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Bluetooth technology lets you connect it with compatible devices wirelessly high-quality audio listens.',
                brand: 'Apple',
                category: 'Electronics',
                price: 89.99,
                stock: 10,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'iPhone 13 Pro 256GB Memory',
                images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity.',
                brand: 'Apple',
                category: 'Electronics',
                price: 599.99,
                stock: 7,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Cannon EOS 80D DSLR Camera',
                images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design',
                brand: 'Cannon',
                category: 'Electronics',
                price: 929.99,
                stock: 5,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Sony Playstation 5 Controller',
                images: ['https://images.unsplash.com/photo-1606318801954-d46d46d3360a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'The new PS5 controller features immersive haptic feedback, dynamic adaptive triggers and a built-in microphone.',
                brand: 'Sony',
                category: 'Electronics',
                price: 399.99,
                stock: 11,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Logitech G-Series Gaming Mouse',
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience',
                brand: 'Logitech',
                category: 'Electronics',
                price: 49.99,
                stock: 7,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Amazon Echo Dot 3rd Generation',
                images: ['https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space',
                brand: 'Amazon',
                category: 'Electronics',
                price: 29.99,
                stock: 0,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
        ];

        await Product.insertMany(products);
        console.log('Data Seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedProducts();
