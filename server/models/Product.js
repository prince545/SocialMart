const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    images: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        index: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    ratings: [ratingSchema],
    numReviews: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

ProductSchema.virtual('averageRating').get(function () {
    if (this.ratings.length === 0) return 0;
    const total = this.ratings.reduce((acc, item) => acc + item.rating, 0);
    return total / this.ratings.length;
});

module.exports = mongoose.model('Product', ProductSchema);
