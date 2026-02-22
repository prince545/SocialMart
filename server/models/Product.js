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
    subcategory: {
        type: String,
        default: '',
        index: true
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        index: true
    },
    mrp: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    sizes: [{
        type: String,
        default: []
    }],
    colors: [{
        type: String,
        default: []
    }],
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
    },
    isNewArrival: {
        type: Boolean,
        default: false,
        index: true
    },
    isTrending: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

ProductSchema.virtual('averageRating').get(function () {
    if (this.ratings.length === 0) return 0;
    const total = this.ratings.reduce((acc, item) => acc + item.rating, 0);
    return total / this.ratings.length;
});

ProductSchema.virtual('discountPercentage').get(function () {
    if (this.mrp && this.mrp > this.price) {
        return Math.round(((this.mrp - this.price) / this.mrp) * 100);
    }
    return this.discount || 0;
});

module.exports = mongoose.model('Product', ProductSchema);
