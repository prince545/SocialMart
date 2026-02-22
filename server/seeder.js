
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
            // ─── Electronics ─────────────────────────────────────────────────────
            // ── PERSONAL COMPUTING ────────────────────────────────────────────────
            {
                title: 'MacBook Pro 14" M3 Chip',
                images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'],
                description: 'Apple M3 chip with extraordinary performance, all-day battery, and a stunning Liquid Retina XDR display.',
                brand: 'Apple', category: 'Electronics', subcategory: 'Personal Computing', price: 1999.99, stock: 4,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Dell XPS 15 Laptop',
                images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'],
                description: 'Intel Core i7 with 16GB RAM, OLED display, and a sleek aluminium chassis — a powerhouse for creators.',
                brand: 'Dell', category: 'Electronics', subcategory: 'Personal Computing', price: 1499.99, stock: 6,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'iPad Pro 12.9" M2',
                images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'],
                description: 'Stunning Liquid Retina XDR display, M2 chip, and support for Apple Pencil — the ultimate tablet.',
                brand: 'Apple', category: 'Electronics', subcategory: 'Personal Computing', price: 1099.99, stock: 8,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Kindle Paperwhite',
                images: ['https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80'],
                description: 'Waterproof e-reader with a 6.8" glare-free display and weeks of battery life.',
                brand: 'Amazon', category: 'Electronics', subcategory: 'Personal Computing', price: 139.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Logitech MX Master 3 Mouse',
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'],
                description: 'Advanced wireless mouse designed for power users with hyper-fast scroll and ergonomic design.',
                brand: 'Logitech', category: 'Electronics', subcategory: 'Personal Computing', price: 99.99, stock: 22,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── MOBILE & COMMUNICATION ────────────────────────────────────────────
            {
                title: 'iPhone 15 Pro 256GB',
                images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'],
                description: 'Titanium design, A17 Pro chip, and a pro camera system — Apple\'s most powerful iPhone.',
                brand: 'Apple', category: 'Electronics', subcategory: 'Mobile & Communication', price: 999.99, stock: 7,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Samsung Galaxy S24 Ultra',
                images: ['https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800&q=80'],
                description: 'Built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3 — Android at its finest.',
                brand: 'Samsung', category: 'Electronics', subcategory: 'Mobile & Communication', price: 1199.99, stock: 6,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Apple Watch Series 9',
                images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
                description: 'Double Tap gesture, brighter display, and carbon-neutral — Apple\'s smartest watch yet.',
                brand: 'Apple', category: 'Electronics', subcategory: 'Mobile & Communication', price: 399.99, stock: 15,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Anker Power Bank 26800mAh',
                images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80'],
                description: 'Massive 26800mAh capacity with PowerIQ fast charging — never run out of battery.',
                brand: 'Anker', category: 'Electronics', subcategory: 'Mobile & Communication', price: 54.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── PERSONAL AUDIO ────────────────────────────────────────────────────
            {
                title: 'AirPods Pro (2nd Gen)',
                images: ['https://images.unsplash.com/photo-1572569028738-411a0977d4b9?w=800&q=80'],
                description: 'Active noise cancellation, Adaptive Transparency, and spatial audio — best-in-class TWS.',
                brand: 'Apple', category: 'Electronics', subcategory: 'Personal Audio', price: 249.99, stock: 12,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Sony WH-1000XM5 Headphones',
                images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
                description: 'Industry-leading noise cancellation, 30-hour battery, and exceptional sound quality.',
                brand: 'Sony', category: 'Electronics', subcategory: 'Personal Audio', price: 349.99, stock: 10,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'boAt Rockerz Neckband',
                images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80'],
                description: 'Lightweight neckband with deep bass, 20-hour playback, and magnetic earbuds.',
                brand: 'boAt', category: 'Electronics', subcategory: 'Personal Audio', price: 29.99, stock: 50,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── HOME AUDIO ────────────────────────────────────────────────────────
            {
                title: 'JBL PartyBox 310 Speaker',
                images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'],
                description: 'Powerful portable party speaker with 240W output, light show, and 18-hour battery.',
                brand: 'JBL', category: 'Electronics', subcategory: 'Home Audio', price: 349.99, stock: 8,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Sonos Beam Soundbar Gen 2',
                images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'],
                description: 'Compact soundbar with Dolby Atmos, Apple AirPlay 2, and voice assistant support.',
                brand: 'Sonos', category: 'Electronics', subcategory: 'Home Audio', price: 449.99, stock: 6,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── VISUAL ────────────────────────────────────────────────────────────
            {
                title: 'Samsung 55" 4K QLED TV',
                images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=800&q=80'],
                description: 'QLED technology with quantum dots for vivid colors, HDR, and built-in smart TV features.',
                brand: 'Samsung', category: 'Electronics', subcategory: 'Visual', price: 799.99, stock: 5,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Fire TV Stick 4K Max',
                images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80'],
                description: 'Stream in 4K with HDR, Wi-Fi 6 support, and Alexa voice remote built-in.',
                brand: 'Amazon', category: 'Electronics', subcategory: 'Visual', price: 54.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'BenQ DLP Full HD Projector',
                images: ['https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80'],
                description: '3500-lumen brightness, Full HD, and 1.3x optical zoom — cinema at home.',
                brand: 'BenQ', category: 'Electronics', subcategory: 'Visual', price: 699.99, stock: 4,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── CAMERAS & PHOTOGRAPHY ─────────────────────────────────────────────
            {
                title: 'GoPro HERO12 Black',
                images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'],
                description: '5.3K video, HyperSmooth 6.0 stabilisation, and waterproof to 10m — the action cam.',
                brand: 'GoPro', category: 'Electronics', subcategory: 'Cameras & Photography', price: 399.99, stock: 9,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Sony Alpha ZV-E10 Mirrorless',
                images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80'],
                description: 'APS-C sensor mirrorless camera, perfect for vlogging with flip screen and excellent autofocus.',
                brand: 'Sony', category: 'Electronics', subcategory: 'Cameras & Photography', price: 749.99, stock: 7,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'DJI Mini 4 Pro Drone',
                images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80'],
                description: '4K HDR camera drone under 249g — no licence required in most countries.',
                brand: 'DJI', category: 'Electronics', subcategory: 'Cameras & Photography', price: 759.99, stock: 5,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── GAMING ────────────────────────────────────────────────────────────
            {
                title: 'Sony PlayStation 5 Slim',
                images: ['https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=800&q=80'],
                description: 'Next-gen gaming with lightning-fast SSD, 4K gaming, and haptic feedback DualSense controller.',
                brand: 'Sony', category: 'Electronics', subcategory: 'Gaming', price: 449.99, stock: 6,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Xbox Series X',
                images: ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80'],
                description: '4K gaming at 120fps, 1TB SSD, and backward compatibility with thousands of titles.',
                brand: 'Microsoft', category: 'Electronics', subcategory: 'Gaming', price: 499.99, stock: 5,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Nintendo Switch OLED',
                images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80'],
                description: 'Vibrant 7" OLED display, enhanced audio, 64GB internal storage — play anywhere.',
                brand: 'Nintendo', category: 'Electronics', subcategory: 'Gaming', price: 349.99, stock: 10,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Razer DeathAdder V3 Gaming Mouse',
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'],
                description: 'Ultra-lightweight design, 30K DPI optical sensor, and ergonomic grip for competitive gaming.',
                brand: 'Razer', category: 'Electronics', subcategory: 'Gaming', price: 79.99, stock: 18,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── KITCHEN APPLIANCES ────────────────────────────────────────────────
            {
                title: 'Instant Pot Duo 7-in-1',
                images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80'],
                description: 'Multi-use pressure cooker, slow cooker, rice cooker and more in one device.',
                brand: 'Instant Pot', category: 'Electronics', subcategory: 'Kitchen Appliances', price: 79.99, stock: 15,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Philips Air Fryer XXL',
                images: ['https://images.unsplash.com/photo-1585325701165-7b799c89f9fb?w=800&q=80'],
                description: 'TurboStar technology cooks crispy food with up to 90% less fat — healthier indulgence.',
                brand: 'Philips', category: 'Electronics', subcategory: 'Kitchen Appliances', price: 199.99, stock: 12,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Nespresso Vertuo Next Coffee Maker',
                images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'],
                description: 'Single-serve coffee maker with Centrifusion technology — barista-quality at home.',
                brand: 'Nespresso', category: 'Electronics', subcategory: 'Kitchen Appliances', price: 149.99, stock: 14,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── UTILITY APPLIANCES ────────────────────────────────────────────────
            {
                title: 'Dyson V15 Detect Vacuum',
                images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
                description: 'Laser-powered dust detection, 60 min battery, and HEPA filtration — whole-home cleaning.',
                brand: 'Dyson', category: 'Electronics', subcategory: 'Utility Appliances', price: 699.99, stock: 6,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'iRobot Roomba j7+ Robot Vacuum',
                images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'],
                description: 'PrecisionVision navigation, auto-empty base, and learns your home\'s layout over time.',
                brand: 'iRobot', category: 'Electronics', subcategory: 'Utility Appliances', price: 599.99, stock: 5,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Dyson Purifier Hot+Cool',
                images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80'],
                description: 'HEPA + activated carbon filtration, heating & cooling in one — purifies the whole room.',
                brand: 'Dyson', category: 'Electronics', subcategory: 'Utility Appliances', price: 549.99, stock: 4,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── SMART HOME & SECURITY ─────────────────────────────────────────────
            {
                title: 'Philips Hue Starter Kit',
                images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80'],
                description: '4 Hue colour bulbs + Bridge — automate and control your home lighting from anywhere.',
                brand: 'Philips', category: 'Electronics', subcategory: 'Smart Home & Security', price: 149.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Ring Video Doorbell Pro 2',
                images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
                description: '1536p HD video, 3D motion detection, and bird\'s-eye view — see everything at your door.',
                brand: 'Ring', category: 'Electronics', subcategory: 'Smart Home & Security', price: 249.99, stock: 10,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Amazon Echo Show 10',
                images: ['https://images.unsplash.com/photo-1512446816042-444d641267d4?w=800&q=80'],
                description: '10.1" HD display with motion — follows you around the room while you cook or call.',
                brand: 'Amazon', category: 'Electronics', subcategory: 'Smart Home & Security', price: 249.99, stock: 8,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'TP-Link Kasa Smart Plug (4-Pack)',
                images: ['https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&q=80'],
                description: 'Wi-Fi smart plugs with energy monitoring — control any device from your phone.',
                brand: 'TP-Link', category: 'Electronics', subcategory: 'Smart Home & Security', price: 34.99, stock: 40,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            // ─── Men's Clothing ──────────────────────────────────────────────────
            // ── TOPS ──────────────────────────────────────────────────────────────
            {
                title: 'Classic White Oxford Shirt',
                images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80'],
                description: 'Crisp, tailored white oxford shirt in 100% cotton — perfect for office or smart-casual.',
                brand: 'BritishStyle', category: "Men's Clothing", subcategory: 'Tops', price: 44.99, stock: 40,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Premium Graphic Tee',
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
                description: 'Soft ring-spun cotton graphic t-shirt with a relaxed, modern fit.',
                brand: 'StreetCo', category: "Men's Clothing", subcategory: 'Tops', price: 24.99, stock: 50,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Linen Summer Shirt',
                images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'],
                description: 'Breezy linen shirt ideal for summer vacations and beach outings.',
                brand: 'SummerVibes', category: "Men's Clothing", subcategory: 'Tops', price: 34.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Polo Shirt — Piqué Cotton',
                images: ['https://images.unsplash.com/photo-1521341057461-6eb5f40b07ab?w=800&q=80'],
                description: 'Classic piqué polo shirt with three-button placket — smart casual perfection.',
                brand: 'RalphFit', category: "Men's Clothing", subcategory: 'Tops', price: 39.99, stock: 45,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Henley Long-Sleeve Shirt',
                images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'],
                description: 'Soft cotton henley with a relaxed fit — layer it or wear it solo.',
                brand: 'EasyWear', category: "Men's Clothing", subcategory: 'Tops', price: 27.99, stock: 38,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Flannel Check Casual Shirt',
                images: ['https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=800&q=80'],
                description: 'Warm brushed flannel shirt in a classic check — ideal for weekends.',
                brand: 'WildRoots', category: "Men's Clothing", subcategory: 'Tops', price: 36.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── BOTTOMS ───────────────────────────────────────────────────────────
            {
                title: 'Slim-Fit Chino Trousers',
                images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80'],
                description: 'Versatile slim-fit chinos in stretch fabric — from work to weekend.',
                brand: 'UrbanThread', category: "Men's Clothing", subcategory: 'Bottoms', price: 54.99, stock: 35,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Classic Blue Denim Jeans',
                images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80'],
                description: 'Durable mid-wash slim jeans with stretch for all-day comfort.',
                brand: 'DenimKing', category: "Men's Clothing", subcategory: 'Bottoms', price: 59.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Athletic Jogger Pants',
                images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80'],
                description: 'Tapered jogger pants in moisture-wicking fabric — gym to street.',
                brand: 'ActiveMen', category: "Men's Clothing", subcategory: 'Bottoms', price: 44.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Cargo Shorts — Multi-Pocket',
                images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&q=80'],
                description: 'Durable cargo shorts with multiple pockets — practical and stylish.',
                brand: 'OutdoorGear', category: "Men's Clothing", subcategory: 'Bottoms', price: 34.99, stock: 42,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Straight-Fit Formal Trousers',
                images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4d7a?w=800&q=80'],
                description: 'Tailored straight-cut formal trousers in premium wool-blend fabric.',
                brand: 'SuitUp', category: "Men's Clothing", subcategory: 'Bottoms', price: 64.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Tapered Chino Shorts',
                images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80'],
                description: 'Smart tapered chino shorts in stretch cotton — relaxed but polished.',
                brand: 'UrbanThread', category: "Men's Clothing", subcategory: 'Bottoms', price: 29.99, stock: 40,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── OUTERWEAR ─────────────────────────────────────────────────────────
            {
                title: 'Slim Fit Formal Blazer',
                images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'],
                description: 'A sharp slim-fit blazer perfect for business meetings and formal events.',
                brand: 'UrbanStyle', category: "Men's Clothing", subcategory: 'Outerwear', price: 89.99, stock: 18,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Hooded Zip-Up Sweatshirt',
                images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'],
                description: 'Warm zip-up hoodie with kangaroo pocket — the ultimate casual layer.',
                brand: 'ComfortWear', category: "Men's Clothing", subcategory: 'Outerwear', price: 39.99, stock: 35,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Winter Puffer Jacket',
                images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'],
                description: 'Insulated puffer jacket for cold-weather adventures — lightweight yet warm.',
                brand: 'NorthWear', category: "Men's Clothing", subcategory: 'Outerwear', price: 119.99, stock: 14,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: "Men's Leather Biker Jacket",
                images: ['https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80'],
                description: 'Classic faux-leather biker jacket with quilted lining and silver hardware.',
                brand: 'MotoEdge', category: "Men's Clothing", subcategory: 'Outerwear', price: 139.99, stock: 12,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Denim Jacket — Washed',
                images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80'],
                description: 'Stone-washed denim jacket with a vintage feel — the ultimate layering piece.',
                brand: 'DenimKing', category: "Men's Clothing", subcategory: 'Outerwear', price: 69.99, stock: 22,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Bomber Jacket — Satin Finish',
                images: ['https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80'],
                description: 'Sleek satin bomber jacket with ribbed cuffs and collar — street-ready style.',
                brand: 'UrbanStyle', category: "Men's Clothing", subcategory: 'Outerwear', price: 79.99, stock: 16,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── ETHNIC WEAR ───────────────────────────────────────────────────────
            {
                title: 'Embroidered Nehru Jacket',
                images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'],
                description: 'Elegant Nehru collar jacket with subtle embroidery — perfect for festive occasions.',
                brand: 'EthnicKing', category: "Men's Clothing", subcategory: 'Ethnic Wear', price: 69.99, stock: 15,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Straight-Cut Cotton Kurta',
                images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'],
                description: 'Classic straight-cut cotton kurta in white — timeless and versatile.',
                brand: 'EthnicKing', category: "Men's Clothing", subcategory: 'Ethnic Wear', price: 44.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Sherwani Festive Set',
                images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80'],
                description: 'Regal full-length sherwani with intricate embroidery — ideal for weddings.',
                brand: 'RoyalEthnic', category: "Men's Clothing", subcategory: 'Ethnic Wear', price: 249.99, stock: 5,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Dhoti Pants — Cotton',
                images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
                description: 'Traditional dhoti pants in soft cotton — pair with a kurta for ethnic events.',
                brand: 'IndianRoots', category: "Men's Clothing", subcategory: 'Ethnic Wear', price: 34.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── INNERWEAR & LOUNGEWEAR ────────────────────────────────────────────
            {
                title: 'Boxer Briefs Pack (3-Pack)',
                images: ['https://images.unsplash.com/photo-1495459166760-29c4e3a83f92?w=800&q=80'],
                description: 'Soft stretch boxer briefs with moisture-wicking fabric — everyday comfort essentials.',
                brand: 'InnerFit', category: "Men's Clothing", subcategory: 'Innerwear & Loungewear', price: 24.99, stock: 60,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Cotton Pajama Set',
                images: ['https://images.unsplash.com/photo-1604176424472-17cd740f74aa?w=800&q=80'],
                description: 'Soft cotton pajama shirt and pants set — perfect for a relaxed night in.',
                brand: 'LazyDay', category: "Men's Clothing", subcategory: 'Innerwear & Loungewear', price: 34.99, stock: 35,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Ribbed Muscle Vest',
                images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'],
                description: 'Fitted ribbed cotton muscle vest — great as innerwear or a gym layer.',
                brand: 'InnerFit', category: "Men's Clothing", subcategory: 'Innerwear & Loungewear', price: 14.99, stock: 70,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── ACTIVEWEAR ────────────────────────────────────────────────────────
            {
                title: 'Dry-Fit Training Tee',
                images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'],
                description: 'Ultra-lightweight dry-fit t-shirt with anti-odor fabric — built for performance.',
                brand: 'ActiveMen', category: "Men's Clothing", subcategory: 'Activewear', price: 27.99, stock: 50,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Compression Running Tights',
                images: ['https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?w=800&q=80'],
                description: 'Full-length compression tights with flatlock seams — engineered for runners.',
                brand: 'ActiveMen', category: "Men's Clothing", subcategory: 'Activewear', price: 39.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Zip-Up Tracksuit Set',
                images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80'],
                description: 'Matching zip-up jacket and jogger set in moisture-wicking polyester — gym to street.',
                brand: 'SportZone', category: "Men's Clothing", subcategory: 'Activewear', price: 69.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Athletic Gym Shorts',
                images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80'],
                description: 'Lightweight mesh-lined gym shorts with elastic waistband — maximum flex.',
                brand: 'SportZone', category: "Men's Clothing", subcategory: 'Activewear', price: 22.99, stock: 45,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Slim-Fit Chino Trousers',
                images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80'],
                description: 'Versatile slim-fit chinos in stretch fabric — from work to weekend.',
                brand: 'UrbanThread',
                category: "Men's Clothing",
                price: 54.99,
                stock: 35,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Slim Fit Formal Blazer',
                images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'],
                description: 'A sharp slim-fit blazer perfect for business meetings and formal events.',
                brand: 'UrbanStyle',
                category: "Men's Clothing",
                price: 89.99,
                stock: 18,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Premium Graphic Tee',
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
                description: 'Soft ring-spun cotton graphic t-shirt with a relaxed, modern fit.',
                brand: 'StreetCo',
                category: "Men's Clothing",
                price: 24.99,
                stock: 50,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Classic Blue Denim Jeans',
                images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80'],
                description: 'Durable mid-wash slim jeans with stretch for all-day comfort.',
                brand: 'DenimKing',
                category: "Men's Clothing",
                price: 59.99,
                stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Hooded Zip-Up Sweatshirt',
                images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'],
                description: 'Warm zip-up hoodie with kangaroo pocket — the ultimate casual layer.',
                brand: 'ComfortWear',
                category: "Men's Clothing",
                price: 39.99,
                stock: 35,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Winter Puffer Jacket',
                images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'],
                description: 'Insulated puffer jacket for cold-weather adventures — lightweight yet warm.',
                brand: 'NorthWear',
                category: "Men's Clothing",
                price: 119.99,
                stock: 14,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Linen Summer Shirt',
                images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'],
                description: 'Breezy linen shirt ideal for summer vacations and beach outings.',
                brand: 'SummerVibes',
                category: "Men's Clothing",
                price: 34.99,
                stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Athletic Jogger Pants',
                images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80'],
                description: 'Tapered jogger pants in moisture-wicking fabric — gym to street.',
                brand: 'ActiveMen',
                category: "Men's Clothing",
                price: 44.99,
                stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Men\'s Leather Biker Jacket',
                images: ['https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80'],
                description: 'Classic faux-leather biker jacket with quilted lining and silver hardware.',
                brand: 'MotoEdge',
                category: "Men's Clothing",
                price: 139.99,
                stock: 12,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ─── Women's Clothing ────────────────────────────────────────────────
            // ── TOPS ──────────────────────────────────────────────────────────────
            {
                title: 'White Linen Blouse',
                images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80'],
                description: 'Breezy loose-fit linen blouse — effortlessly chic for any casual setting.',
                brand: 'PureBlouse', category: "Women's Clothing", subcategory: 'Tops', price: 29.99, stock: 40,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Women\'s Crop Top — Ribbed',
                images: ['https://images.unsplash.com/photo-1503342250614-4ddc8e5ae5b5?w=800&q=80'],
                description: 'Fitted ribbed crop top with a square neckline — pairs great with high-waist bottoms.',
                brand: 'CropQueen', category: "Women's Clothing", subcategory: 'Tops', price: 19.99, stock: 55,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Floral Camisole Tunic',
                images: ['https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&q=80'],
                description: 'Lightweight floral-print camisole tunic — ideal for layering or wearing solo.',
                brand: 'SummerSilk', category: "Women's Clothing", subcategory: 'Tops', price: 24.99, stock: 35,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Striped Casual T-Shirt',
                images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'],
                description: 'Classic navy-and-white Breton striped t-shirt in 100% organic cotton.',
                brand: 'StripeStyle', category: "Women's Clothing", subcategory: 'Tops', price: 22.99, stock: 60,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Off-Shoulder Boho Blouse',
                images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'],
                description: 'Romantic off-shoulder blouse with embroidery — a festival-ready essential.',
                brand: 'BohoChic', category: "Women's Clothing", subcategory: 'Tops', price: 34.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── BOTTOMS ───────────────────────────────────────────────────────────
            {
                title: 'High-Waist Skinny Jeans',
                images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80'],
                description: 'Super-stretch high-waist skinny jeans that sculpt your silhouette perfectly.',
                brand: 'DenimDiva', category: "Women's Clothing", subcategory: 'Bottoms', price: 64.99, stock: 28,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Mom-Fit High-Rise Jeans',
                images: ['https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=800&q=80'],
                description: 'Vintage-inspired mom jeans with a relaxed fit and tapered leg — retro cool.',
                brand: 'VintageDenim', category: "Women's Clothing", subcategory: 'Bottoms', price: 59.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Pleated Midi Skirt',
                images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80'],
                description: 'Flowy satin pleated midi skirt — elegant, versatile, day-to-night ready.',
                brand: 'StyleHer', category: "Women's Clothing", subcategory: 'Bottoms', price: 44.99, stock: 18,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Wide-Leg Palazzo Pants',
                images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
                description: 'Flowy wide-leg palazzo pants in crepe fabric — comfortable and stunning.',
                brand: 'PalazzoWear', category: "Women's Clothing", subcategory: 'Bottoms', price: 49.99, stock: 22,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Mini Denim Skirt',
                images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4d7a?w=800&q=80'],
                description: 'Classic button-front mini denim skirt — a timeless wardrobe staple.',
                brand: 'DenimDiva', category: "Women's Clothing", subcategory: 'Bottoms', price: 34.99, stock: 32,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Yoga Leggings — High Waist',
                images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80'],
                description: 'Non-see-through high-waist leggings in 4-way stretch — perfect for yoga & gym.',
                brand: 'FlexFem', category: "Women's Clothing", subcategory: 'Bottoms', price: 39.99, stock: 45,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── DRESSES ───────────────────────────────────────────────────────────
            {
                title: 'Floral Wrap Dress',
                images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80'],
                description: 'Elegant floral chiffon wrap dress — perfect for brunches and celebrations.',
                brand: 'BloomFashion', category: "Women's Clothing", subcategory: 'Dresses', price: 59.99, stock: 22,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'White A-Line Sundress',
                images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80'],
                description: 'Breezy white A-line sundress with ruffle hem — the ultimate summer staple.',
                brand: 'SunDress', category: "Women's Clothing", subcategory: 'Dresses', price: 44.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Silk Evening Gown',
                images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80'],
                description: 'Dramatic floor-length silk gown with a deep V and slit — red-carpet ready.',
                brand: 'LuxeFashion', category: "Women's Clothing", subcategory: 'Dresses', price: 199.99, stock: 6,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Bodycon Cocktail Dress',
                images: ['https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=800&q=80'],
                description: 'Form-fitting lace bodycon dress — make a statement at every party.',
                brand: 'NightGlam', category: "Women's Clothing", subcategory: 'Dresses', price: 79.99, stock: 15,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── OUTERWEAR ─────────────────────────────────────────────────────────
            {
                title: "Women's Trench Coat",
                images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e4?w=800&q=80'],
                description: 'Classic double-breasted belted trench coat — timeless and sophisticated.',
                brand: 'CoatCouture', category: "Women's Clothing", subcategory: 'Outerwear', price: 159.99, stock: 10,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Cropped Denim Jacket',
                images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80'],
                description: 'Vintage-wash cropped denim jacket — throw it over any outfit for instant cool.',
                brand: 'DenimDiva', category: "Women's Clothing", subcategory: 'Outerwear', price: 69.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Chunky Knit Cardigan',
                images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'],
                description: 'Cozy oversized chunky cardigan — the perfect autumn layering piece.',
                brand: 'KnitCo', category: "Women's Clothing", subcategory: 'Outerwear', price: 54.99, stock: 18,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Faux-Leather Biker Jacket',
                images: ['https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80'],
                description: 'Edgy faux-leather biker jacket with silver zipper hardware — instant rockstar.',
                brand: 'MotoEdge', category: "Women's Clothing", subcategory: 'Outerwear', price: 119.99, stock: 12,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Women\'s Puffer Jacket',
                images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'],
                description: 'Ultra-light down-fill puffer jacket — warm, chic, and packable.',
                brand: 'NorthWear', category: "Women's Clothing", subcategory: 'Outerwear', price: 109.99, stock: 14,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── CO-ORD SETS ───────────────────────────────────────────────────────
            {
                title: 'Floral Co-ord Set',
                images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80'],
                description: 'Matching floral crop top and wide-leg pants set — effortlessly stylish.',
                brand: 'SetStyle', category: "Women's Clothing", subcategory: 'Co-ord Sets', price: 74.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Pastel Blazer Co-ord Set',
                images: ['https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80'],
                description: 'Powder-pink blazer and trouser co-ord set — workspace glam at its finest.',
                brand: 'SetStyle', category: "Women's Clothing", subcategory: 'Co-ord Sets', price: 89.99, stock: 16,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── WORKWEAR ──────────────────────────────────────────────────────────
            {
                title: 'Women\'s Formal Blazer',
                images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4d7a?w=800&q=80'],
                description: 'Structured double-button blazer in premium suiting fabric — boardroom confidence.',
                brand: 'OfficePro', category: "Women's Clothing", subcategory: 'Workwear', price: 89.99, stock: 15,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Pencil-Fit Formal Trousers',
                images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
                description: 'Tailored pencil-cut trousers in stretch fabric — polished and comfortable all day.',
                brand: 'OfficePro', category: "Women's Clothing", subcategory: 'Workwear', price: 54.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── ACTIVEWEAR ────────────────────────────────────────────────────────
            {
                title: 'Sports Bra — Padded Support',
                images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80'],
                description: 'Medium-impact padded sports bra with moisture-wicking fabric — great for yoga & HIIT.',
                brand: 'FlexFem', category: "Women's Clothing", subcategory: 'Activewear', price: 29.99, stock: 50,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Zip-Up Tracksuit Set',
                images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80'],
                description: 'Matching zip-up hoodie and jogger set in moisture-wicking fabric — gym to street.',
                brand: 'ActiveFem', category: "Women's Clothing", subcategory: 'Activewear', price: 64.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── PARTY / EVENING WEAR ──────────────────────────────────────────────
            {
                title: 'Sequined Mini Dress',
                images: ['https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80'],
                description: 'Dazzling disco-ball sequin mini dress — dance the night away in style.',
                brand: 'GlitterQueen', category: "Women's Clothing", subcategory: 'Party Wear', price: 89.99, stock: 12,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Halter-Neck Satin Gown',
                images: ['https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80'],
                description: 'Bias-cut halter satin gown in champagne — the epitome of evening elegance.',
                brand: 'LuxEvening', category: "Women's Clothing", subcategory: 'Party Wear', price: 179.99, stock: 8,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── SLEEPWEAR & LOUNGEWEAR ────────────────────────────────────────────
            {
                title: 'Satin Pajama Set',
                images: ['https://images.unsplash.com/photo-1604176424472-17cd740f74aa?w=800&q=80'],
                description: 'Silky satin pajama top and pants set — luxurious comfort for bedtime.',
                brand: 'DreamSleep', category: "Women's Clothing", subcategory: 'Sleepwear & Loungewear', price: 44.99, stock: 35,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Cosy Lounge Set — Tie-Dye',
                images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'],
                description: 'Super-soft French terry tie-dye hoodie-and-shorts lounge set — ultimate home comfort.',
                brand: 'LazyDay', category: "Women's Clothing", subcategory: 'Sleepwear & Loungewear', price: 49.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── ETHNIC & FUSION WEAR ──────────────────────────────────────────────
            {
                title: 'Embroidered Anarkali Kurta',
                images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'],
                description: 'Floor-length Anarkali kurta with intricate thread embroidery — timeless ethnic grace.',
                brand: 'EthnicHues', category: "Women's Clothing", subcategory: 'Ethnic & Fusion', price: 74.99, stock: 18,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Salwar Kameez Suit Set',
                images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80'],
                description: 'Classic cotton salwar kameez with dupatta — comfortable, elegant ethnic wear.',
                brand: 'IndianRoots', category: "Women's Clothing", subcategory: 'Ethnic & Fusion', price: 59.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Lehenga Choli — Festive',
                images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80'],
                description: 'Regal embroidered lehenga choli set in deep red — perfect for weddings and festivals.',
                brand: 'RoyalEthnic', category: "Women's Clothing", subcategory: 'Ethnic & Fusion', price: 224.99, stock: 6,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Silk Banarasi Saree',
                images: ['https://images.unsplash.com/photo-1610189155104-fe82e3ae1e86?w=800&q=80'],
                description: 'Traditional Banarasi silk saree with gold zari border — opulent and timeless.',
                brand: 'WeaveCraft', category: "Women's Clothing", subcategory: 'Ethnic & Fusion', price: 149.99, stock: 8,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Kurti with Jeans Fusion Set',
                images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80'],
                description: 'Printed A-line kurti paired with slim-fit jeans — the perfect Indo-Western combo.',
                brand: 'FusionWear', category: "Women's Clothing", subcategory: 'Ethnic & Fusion', price: 54.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Printed Sharara Set',
                images: ['https://images.unsplash.com/photo-1603006905003-be475563bc7f?w=800&q=80'],
                description: 'Flared sharara set with matching printed top and dupatta — festive & fashionable.',
                brand: 'EthnicHues', category: "Women's Clothing", subcategory: 'Ethnic & Fusion', price: 84.99, stock: 15,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── LINGERIE & INTIMATES ──────────────────────────────────────────────
            {
                title: 'Lace Bralette Set',
                images: ['https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800&q=80'],
                description: 'Delicate floral lace bralette and brief set — elegant and comfortable.',
                brand: 'LaceLux', category: "Women's Clothing", subcategory: 'Lingerie & Intimates', price: 34.99, stock: 40,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Satin Bodysuit',
                images: ['https://images.unsplash.com/photo-1604176424472-17cd740f74aa?w=800&q=80'],
                description: 'Sleek satin bodysuit with snap closure — seamless under pants or skirts.',
                brand: 'BodyForm', category: "Women's Clothing", subcategory: 'Lingerie & Intimates', price: 39.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'High-Waist Shaper Shorts',
                images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'],
                description: 'Firm-control high-waist shaper shorts for a smooth silhouette under any outfit.',
                brand: 'ShapeWear', category: "Women's Clothing", subcategory: 'Lingerie & Intimates', price: 27.99, stock: 35,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── MATERNITY WEAR ────────────────────────────────────────────────────
            {
                title: 'Maternity Wrap Dress',
                images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80'],
                description: 'Adjustable wrap dress designed for growing bumps — comfort meets style.',
                brand: 'MomToWear', category: "Women's Clothing", subcategory: 'Maternity', price: 49.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Over-Bump Maternity Jeans',
                images: ['https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=800&q=80'],
                description: 'Stretchy over-bump waistband jeans for maximum comfort throughout pregnancy.',
                brand: 'MomToWear', category: "Women's Clothing", subcategory: 'Maternity', price: 54.99, stock: 18,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── SWIM & BEACHWEAR ──────────────────────────────────────────────────
            {
                title: 'Tropical Print Bikini Set',
                images: ['https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&q=80'],
                description: 'Vibrant tropical print bikini with underwire top and tie-waist bottoms — pool perfect.',
                brand: 'SunKissed', category: "Women's Clothing", subcategory: 'Swim & Beachwear', price: 44.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'One-Piece Swimsuit — Ruched',
                images: ['https://images.unsplash.com/photo-1570976447640-ac859083963f?w=800&q=80'],
                description: 'Flattering ruched one-piece swimsuit with tummy control — beach-chic confidence.',
                brand: 'SunKissed', category: "Women's Clothing", subcategory: 'Swim & Beachwear', price: 54.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Cover-Up Beach Sarong',
                images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'],
                description: 'Lightweight chiffon sarong with floral print — wrap it as a skirt, dress or scarf.',
                brand: 'BeachVibes', category: "Women's Clothing", subcategory: 'Swim & Beachwear', price: 19.99, stock: 40,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Women\'s Crop Top — Ribbed',
                images: ['https://images.unsplash.com/photo-1503342250614-4ddc8e5ae5b5?w=800&q=80'],
                description: 'Fitted ribbed crop top with a square neckline — pairs great with high-waist bottoms.',
                brand: 'CropQueen', category: "Women's Clothing", price: 19.99, stock: 55,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Floral Camisole Tunic',
                images: ['https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&q=80'],
                description: 'Lightweight floral-print camisole tunic — ideal for layering or wearing solo.',
                brand: 'SummerSilk', category: "Women's Clothing", price: 24.99, stock: 35,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Striped Casual T-Shirt',
                images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'],
                description: 'Classic navy-and-white Breton striped t-shirt in 100% organic cotton.',
                brand: 'StripeStyle', category: "Women's Clothing", price: 22.99, stock: 60,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Off-Shoulder Boho Blouse',
                images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'],
                description: 'Romantic off-shoulder blouse with embroidery — a festival-ready essential.',
                brand: 'BohoChic', category: "Women's Clothing", price: 34.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── BOTTOMS ───────────────────────────────────────────────────────────
            {
                title: 'High-Waist Skinny Jeans',
                images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80'],
                description: 'Super-stretch high-waist skinny jeans that sculpt your silhouette perfectly.',
                brand: 'DenimDiva', category: "Women's Clothing", price: 64.99, stock: 28,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Mom-Fit High-Rise Jeans',
                images: ['https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=800&q=80'],
                description: 'Vintage-inspired mom jeans with a relaxed fit and tapered leg — retro cool.',
                brand: 'VintageDenim', category: "Women's Clothing", price: 59.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Pleated Midi Skirt',
                images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80'],
                description: 'Flowy satin pleated midi skirt — elegant, versatile, day-to-night ready.',
                brand: 'StyleHer', category: "Women's Clothing", price: 44.99, stock: 18,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Wide-Leg Palazzo Pants',
                images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
                description: 'Flowy wide-leg palazzo pants in crepe fabric — comfortable and stunning.',
                brand: 'PalazzoWear', category: "Women's Clothing", price: 49.99, stock: 22,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Mini Denim Skirt',
                images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4d7a?w=800&q=80'],
                description: 'Classic button-front mini denim skirt — a timeless wardrobe staple.',
                brand: 'DenimDiva', category: "Women's Clothing", price: 34.99, stock: 32,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Yoga Leggings — High Waist',
                images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80'],
                description: 'Non-see-through high-waist leggings in 4-way stretch — perfect for yoga & gym.',
                brand: 'FlexFem', category: "Women's Clothing", price: 39.99, stock: 45,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── DRESSES ───────────────────────────────────────────────────────────
            {
                title: 'Floral Wrap Dress',
                images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80'],
                description: 'Elegant floral chiffon wrap dress — perfect for brunches and celebrations.',
                brand: 'BloomFashion', category: "Women's Clothing", price: 59.99, stock: 22,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'White A-Line Sundress',
                images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80'],
                description: 'Breezy white A-line sundress with ruffle hem — the ultimate summer staple.',
                brand: 'SunDress', category: "Women's Clothing", price: 44.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Silk Evening Gown',
                images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80'],
                description: 'Dramatic floor-length silk gown with a deep V and slit — red-carpet ready.',
                brand: 'LuxeFashion', category: "Women's Clothing", price: 199.99, stock: 6,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Bodycon Cocktail Dress',
                images: ['https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=800&q=80'],
                description: 'Form-fitting lace bodycon dress — make a statement at every party.',
                brand: 'NightGlam', category: "Women's Clothing", price: 79.99, stock: 15,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── OUTERWEAR ─────────────────────────────────────────────────────────
            {
                title: "Women's Trench Coat",
                images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e4?w=800&q=80'],
                description: 'Classic double-breasted belted trench coat — timeless and sophisticated.',
                brand: 'CoatCouture', category: "Women's Clothing", price: 159.99, stock: 10,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Cropped Denim Jacket',
                images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80'],
                description: 'Vintage-wash cropped denim jacket — throw it over any outfit for instant cool.',
                brand: 'DenimDiva', category: "Women's Clothing", price: 69.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Chunky Knit Cardigan',
                images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'],
                description: 'Cozy oversized chunky cardigan — the perfect autumn layering piece.',
                brand: 'KnitCo', category: "Women's Clothing", price: 54.99, stock: 18,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Faux-Leather Biker Jacket',
                images: ['https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80'],
                description: 'Edgy faux-leather biker jacket with silver zipper hardware — instant rockstar.',
                brand: 'MotoEdge', category: "Women's Clothing", price: 119.99, stock: 12,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Women\'s Puffer Jacket',
                images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'],
                description: 'Ultra-light down-fill puffer jacket — warm, chic, and packable.',
                brand: 'NorthWear', category: "Women's Clothing", price: 109.99, stock: 14,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── CO-ORD SETS ───────────────────────────────────────────────────────
            {
                title: 'Floral Co-ord Set',
                images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80'],
                description: 'Matching floral crop top and wide-leg pants set — effortlessly stylish.',
                brand: 'SetStyle', category: "Women's Clothing", price: 74.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Pastel Blazer Co-ord Set',
                images: ['https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80'],
                description: 'Powder-pink blazer and trouser co-ord set — workspace glam at its finest.',
                brand: 'SetStyle', category: "Women's Clothing", price: 89.99, stock: 16,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── WORKWEAR ──────────────────────────────────────────────────────────
            {
                title: 'Women\'s Formal Blazer',
                images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4d7a?w=800&q=80'],
                description: 'Structured double-button blazer in premium suiting fabric — boardroom confidence.',
                brand: 'OfficePro', category: "Women's Clothing", price: 89.99, stock: 15,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Pencil-Fit Formal Trousers',
                images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
                description: 'Tailored pencil-cut trousers in stretch fabric — polished and comfortable all day.',
                brand: 'OfficePro', category: "Women's Clothing", price: 54.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── ACTIVEWEAR ────────────────────────────────────────────────────────
            {
                title: 'Sports Bra — Padded Support',
                images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80'],
                description: 'Medium-impact padded sports bra with moisture-wicking fabric — great for yoga & HIIT.',
                brand: 'FlexFem', category: "Women's Clothing", price: 29.99, stock: 50,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Zip-Up Tracksuit Set',
                images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80'],
                description: 'Matching zip-up hoodie and jogger set in moisture-wicking fabric — gym to street.',
                brand: 'ActiveFem', category: "Women's Clothing", price: 64.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── PARTY / EVENING WEAR ──────────────────────────────────────────────
            {
                title: 'Sequined Mini Dress',
                images: ['https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80'],
                description: 'Dazzling disco-ball sequin mini dress — dance the night away in style.',
                brand: 'GlitterQueen', category: "Women's Clothing", price: 89.99, stock: 12,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Halter-Neck Satin Gown',
                images: ['https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80'],
                description: 'Bias-cut halter satin gown in champagne — the epitome of evening elegance.',
                brand: 'LuxEvening', category: "Women's Clothing", price: 179.99, stock: 8,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── SLEEPWEAR & LOUNGEWEAR ────────────────────────────────────────────
            {
                title: 'Satin Pajama Set',
                images: ['https://images.unsplash.com/photo-1604176424472-17cd740f74aa?w=800&q=80'],
                description: 'Silky satin pajama top and pants set — luxurious comfort for bedtime.',
                brand: 'DreamSleep', category: "Women's Clothing", price: 44.99, stock: 35,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Cosy Lounge Set — Tie-Dye',
                images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'],
                description: 'Super-soft French terry tie-dye hoodie-and-shorts lounge set — ultimate home comfort.',
                brand: 'LazyDay', category: "Women's Clothing", price: 49.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── ETHNIC & FUSION WEAR ──────────────────────────────────────────────
            {
                title: 'Embroidered Anarkali Kurta',
                images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'],
                description: 'Floor-length Anarkali kurta with intricate thread embroidery — timeless ethnic grace.',
                brand: 'EthnicHues', category: "Women's Clothing", price: 74.99, stock: 18,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Salwar Kameez Suit Set',
                images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80'],
                description: 'Classic cotton salwar kameez with dupatta — comfortable, elegant ethnic wear.',
                brand: 'IndianRoots', category: "Women's Clothing", price: 59.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Lehenga Choli — Festive',
                images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80'],
                description: 'Regal embroidered lehenga choli set in deep red — perfect for weddings and festivals.',
                brand: 'RoyalEthnic', category: "Women's Clothing", price: 224.99, stock: 6,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Silk Banarasi Saree',
                images: ['https://images.unsplash.com/photo-1610189155104-fe82e3ae1e86?w=800&q=80'],
                description: 'Traditional Banarasi silk saree with gold zari border — opulent and timeless.',
                brand: 'WeaveCraft', category: "Women's Clothing", price: 149.99, stock: 8,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Kurti with Jeans Fusion Set',
                images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80'],
                description: 'Printed A-line kurti paired with slim-fit jeans — the perfect Indo-Western combo.',
                brand: 'FusionWear', category: "Women's Clothing", price: 54.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Printed Sharara Set',
                images: ['https://images.unsplash.com/photo-1603006905003-be475563bc7f?w=800&q=80'],
                description: 'Flared sharara set with matching printed top and dupatta — festive & fashionable.',
                brand: 'EthnicHues', category: "Women's Clothing", price: 84.99, stock: 15,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── LINGERIE & INTIMATES ──────────────────────────────────────────────
            {
                title: 'Lace Bralette Set',
                images: ['https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800&q=80'],
                description: 'Delicate floral lace bralette and brief set — elegant and comfortable.',
                brand: 'LaceLux', category: "Women's Clothing", price: 34.99, stock: 40,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Satin Bodysuit',
                images: ['https://images.unsplash.com/photo-1604176424472-17cd740f74aa?w=800&q=80'],
                description: 'Sleek satin bodysuit with snap closure — seamless under pants or skirts.',
                brand: 'BodyForm', category: "Women's Clothing", price: 39.99, stock: 30,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'High-Waist Shaper Shorts',
                images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'],
                description: 'Firm-control high-waist shaper shorts for a smooth silhouette under any outfit.',
                brand: 'ShapeWear', category: "Women's Clothing", price: 27.99, stock: 35,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── MATERNITY WEAR ────────────────────────────────────────────────────
            {
                title: 'Maternity Wrap Dress',
                images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80'],
                description: 'Adjustable wrap dress designed for growing bumps — comfort meets style.',
                brand: 'MomToWear', category: "Women's Clothing", price: 49.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Over-Bump Maternity Jeans',
                images: ['https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=800&q=80'],
                description: 'Stretchy over-bump waistband jeans for maximum comfort throughout pregnancy.',
                brand: 'MomToWear', category: "Women's Clothing", price: 54.99, stock: 18,
                ratings: [], numReviews: 0, user: adminUser._id
            },

            // ── SWIM & BEACHWEAR ──────────────────────────────────────────────────
            {
                title: 'Tropical Print Bikini Set',
                images: ['https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&q=80'],
                description: 'Vibrant tropical print bikini with underwire top and tie-waist bottoms — pool perfect.',
                brand: 'SunKissed', category: "Women's Clothing", price: 44.99, stock: 25,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'One-Piece Swimsuit — Ruched',
                images: ['https://images.unsplash.com/photo-1570976447640-ac859083963f?w=800&q=80'],
                description: 'Flattering ruched one-piece swimsuit with tummy control — beach-chic confidence.',
                brand: 'SunKissed', category: "Women's Clothing", price: 54.99, stock: 20,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            {
                title: 'Cover-Up Beach Sarong',
                images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'],
                description: 'Lightweight chiffon sarong with floral print — wrap it as a skirt, dress or scarf.',
                brand: 'BeachVibes', category: "Women's Clothing", price: 19.99, stock: 40,
                ratings: [], numReviews: 0, user: adminUser._id
            },
            // Books
            {
                title: 'The Great Gatsby',
                images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'The classic novel by F. Scott Fitzgerald.',
                brand: 'Penguin Books',
                category: 'Books',
                price: 12.99,
                stock: 20,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Clean Code',
                images: ['https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'A Handbook of Agile Software Craftsmanship by Robert C. Martin.',
                brand: 'Prentice Hall',
                category: 'Books',
                price: 35.50,
                stock: 15,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Atomic Habits',
                images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.',
                brand: 'Avery',
                category: 'Books',
                price: 16.99,
                stock: 35,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'The Pragmatic Programmer',
                images: ['https://images.unsplash.com/photo-1550399105-c4db5fb85c18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Your Journey to Mastery â€“ essential reading for every developer.',
                brand: 'Addison-Wesley',
                category: 'Books',
                price: 39.99,
                stock: 12,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Thinking, Fast and Slow',
                images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: "Daniel Kahneman's groundbreaking exploration of the two systems that drive the way we think.",
                brand: 'Farrar, Straus and Giroux',
                category: 'Books',
                price: 14.99,
                stock: 22,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Sapiens: A Brief History of Humankind',
                images: ['https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: "Yuval Noah Harari's sweeping narrative of history and the future of our species.",
                brand: 'Harper',
                category: 'Books',
                price: 17.99,
                stock: 28,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'To Kill a Mockingbird',
                images: ['https://images.unsplash.com/photo-1491841651911-c44e40571f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: "Harper Lee's Pulitzer Prize-winning masterwork of honor and injustice in the deep South.",
                brand: 'Harper Perennial',
                category: 'Books',
                price: 11.99,
                stock: 18,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            // Home
            {
                title: 'Modern Coffee Table',
                images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'A sleek and modern coffee table for your living room.',
                brand: 'HomeStyle',
                category: 'Home',
                price: 120.00,
                stock: 5,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Scented Candle Set',
                images: ['https://images.unsplash.com/photo-1603006905003-be475563bc7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Relaxing scented candles for a cozy atmosphere.',
                brand: 'AromaHome',
                category: 'Home',
                price: 19.99,
                stock: 40,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Ceramic Dinner Set (12 Pieces)',
                images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Elegant ceramic dinner set for family dining â€“ includes plates, bowls and mugs.',
                brand: 'TableLux',
                category: 'Home',
                price: 79.99,
                stock: 12,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'LED Floor Lamp',
                images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Modern LED floor lamp with adjustable brightness and warm/cool light modes.',
                brand: 'LightCraft',
                category: 'Home',
                price: 55.00,
                stock: 17,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Bamboo Storage Organizer',
                images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Eco-friendly bamboo desktop organizer with multiple compartments for a tidy workspace.',
                brand: 'EcoOrganize',
                category: 'Home',
                price: 34.99,
                stock: 25,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Plush Throw Blanket',
                images: ['https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Super soft and cozy throw blanket, perfect for lounging on the sofa.',
                brand: 'CozyNest',
                category: 'Home',
                price: 29.99,
                stock: 32,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Smart Air Purifier',
                images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'HEPA filter air purifier with smartphone control and real-time air quality monitoring.',
                brand: 'PureAir',
                category: 'Home',
                price: 149.99,
                stock: 8,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            // Beauty
            {
                title: 'Hydrating Face Moisturizer',
                images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Keeps your skin hydrated and glowing throughout the day.',
                brand: 'GlowSkin',
                category: 'Beauty',
                price: 15.99,
                stock: 25,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Natural Lip Balm',
                images: ['https://images.unsplash.com/photo-1599305090598-fe179d396267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Organic and natural lip balm for soft lips.',
                brand: 'PureBeauty',
                category: 'Beauty',
                price: 4.50,
                stock: 100,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Vitamin C Serum',
                images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Brightening Vitamin C serum to reduce dark spots and even out skin tone.',
                brand: 'GlowSkin',
                category: 'Beauty',
                price: 22.99,
                stock: 40,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Volumizing Mascara',
                images: ['https://images.unsplash.com/photo-1631214500004-34b8c04f5ba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Buildable, clump-free formula for dramatic volume and length.',
                brand: 'LashLux',
                category: 'Beauty',
                price: 12.99,
                stock: 60,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Rose Water Toner',
                images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Alcohol-free rose water toner to refresh, hydrate and balance skin pH.',
                brand: 'NaturalGlow',
                category: 'Beauty',
                price: 9.99,
                stock: 55,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Argan Oil Hair Mask',
                images: ['https://images.unsplash.com/photo-1519735777090-ec97162dc266?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Deep conditioning hair mask with Moroccan argan oil for silky, frizz-free hair.',
                brand: 'HairLux',
                category: 'Beauty',
                price: 17.50,
                stock: 30,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Retinol Night Cream',
                images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Anti-aging retinol night cream to reduce fine lines and boost collagen.',
                brand: 'AgelessSkin',
                category: 'Beauty',
                price: 28.99,
                stock: 20,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            // Sports
            {
                title: 'Yoga Mat',
                images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Eco-friendly non-slip yoga mat for your workout.',
                brand: 'YogaPro',
                category: 'Sports',
                price: 29.99,
                stock: 20,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Dumbbell Set 10kg',
                images: ['https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'A set of adjustable dumbbells for strength training.',
                brand: 'FitLife',
                category: 'Sports',
                price: 45.00,
                stock: 10,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Running Shoes - Men',
                images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Lightweight and cushioned running shoes for maximum comfort and performance.',
                brand: 'SpeedRun',
                category: 'Sports',
                price: 79.99,
                stock: 18,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Resistance Bands Set',
                images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Set of 5 resistance bands with varying tension for full-body workouts.',
                brand: 'FlexFit',
                category: 'Sports',
                price: 19.99,
                stock: 40,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Jump Rope â€“ Speed Cable',
                images: ['https://images.unsplash.com/photo-1606889464198-fcb18894cf50?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Professional speed jump rope with ball bearings for smooth, fast rotations.',
                brand: 'JumpKing',
                category: 'Sports',
                price: 14.99,
                stock: 50,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Foam Roller for Recovery',
                images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'High-density foam roller to relieve muscle soreness and improve flexibility.',
                brand: 'RecoverPro',
                category: 'Sports',
                price: 24.99,
                stock: 28,
                ratings: [],
                numReviews: 0,
                user: adminUser._id
            },
            {
                title: 'Basketball â€“ Official Size 7',
                images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
                description: 'Indoor/outdoor official size 7 basketball with superior grip and durable rubber cover.',
                brand: 'HoopsElite',
                category: 'Sports',
                price: 34.99,
                stock: 15,
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

