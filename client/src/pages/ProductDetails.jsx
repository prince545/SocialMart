import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { getProductDetails, createProductReview } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist, getWishlist } from '../redux/wishlistSlice';
import { ArrowLeft, ShoppingCart, Star, Share2, Sparkles, Loader, Heart, ZoomIn, X, Ruler, ChevronRight, Check, Truck, Shield, RotateCcw, Package, Minus, Plus } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isSignedIn } = useUser();
    const { product, loading, error } = useSelector(state => state.products);
    const { items: wishlistItems } = useSelector(state => state.wishlist);
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [zoomImage, setZoomImage] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [showSocialModal, setShowSocialModal] = useState(false);
    const [generatedPost, setGeneratedPost] = useState('');
    const [generatingPost, setGeneratingPost] = useState(false);
    const [reviewRating, setReviewRating] = useState('5');
    const [reviewComment, setReviewComment] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [reviewSummary, setReviewSummary] = useState('');
    const [summarizing, setSummarizing] = useState(false);

    useEffect(() => {
        dispatch(getProductDetails(id));
        if (isSignedIn) {
            dispatch(getWishlist());
        }
    }, [dispatch, id, isSignedIn]);

    useEffect(() => {
        if (wishlistItems.length > 0 && product) {
            setIsWishlisted(wishlistItems.some(item => item._id === product._id));
        }
    }, [wishlistItems, product]);

    useEffect(() => {
        if (product) {
            if (product.sizes && product.sizes.length > 0) {
                setSelectedSize(product.sizes[0]);
            }
            if (product.colors && product.colors.length > 0) {
                setSelectedColor(product.colors[0]);
            }
        }
    }, [product]);

    const handleAddToCart = () => {
        dispatch(addToCart({
            ...product,
            product: product._id,
            qty,
            selectedSize,
            selectedColor
        }));
        navigate('/cart');
    };

    const handleWishlistToggle = () => {
        if (!isSignedIn) {
            alert('Please sign in to add items to wishlist');
            return;
        }
        if (isWishlisted) {
            dispatch(removeFromWishlist(product._id));
        } else {
            dispatch(addToWishlist(product._id));
        }
    };

    const handleImageZoom = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const handleGenerateSocialPost = async () => {
        setShowSocialModal(true);
        setGeneratingPost(true);
        try {
            const { data } = await axios.post('/api/ai/social-post', { product });
            setGeneratedPost(data.post);
        } catch (err) {
            console.error(err);
            setGeneratedPost("Failed to generate post. Please try again.");
        } finally {
            setGeneratingPost(false);
        }
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        dispatch(createProductReview({ productId: id, reviewData: { rating: reviewRating, comment: reviewComment } }));
        setReviewComment('');
    };

    const handleSummarizeReviews = async () => {
        setSummarizing(true);
        try {
            const { data } = await axios.post('/api/ai/summarize-reviews', {
                reviews: product.ratings,
                productTitle: product.title
            });
            setReviewSummary(data.summary);
        } catch (err) {
            console.error(err);
            alert("Failed to summarize reviews");
        } finally {
            setSummarizing(false);
        }
    };

    const discountPercentage = product?.mrp && product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : (product?.discount && product.discount > 0) ? product.discount : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error && !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md text-center">
                    <p className="text-red-500 font-semibold mb-2">Product not found</p>
                    <p className="text-gray-600 text-sm mb-6">
                        This product may have been removed or the link is incorrect. Try browsing the marketplace.
                    </p>
                    <Button asChild>
                        <Link to="/marketplace">Back to Marketplace</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 py-8 px-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,92,246,0.08),transparent_50%)] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Button asChild variant="ghost" className="text-gray-600 hover:text-indigo-600 -ml-2">
                        <Link to="/marketplace" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Marketplace</span>
                        </Link>
                    </Button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                        {/* Image Section */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div
                                className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden aspect-square shadow-inner group cursor-zoom-in"
                                onMouseMove={handleImageZoom}
                                onMouseEnter={() => setZoomImage(true)}
                                onMouseLeave={() => setZoomImage(false)}
                            >
                                <img
                                    src={product.images?.[selectedImageIndex] || product.images?.[0] || 'https://via.placeholder.com/500'}
                                    alt={product.title}
                                    className="w-full h-full object-contain p-4 transition-transform duration-300"
                                    style={{
                                        transform: zoomImage ? `scale(2)` : 'scale(1)',
                                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                    }}
                                />

                                {/* Discount Badge */}
                                {discountPercentage > 0 && (
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-3 py-1 text-sm font-bold shadow-lg">
                                            {discountPercentage}% OFF
                                        </Badge>
                                    </div>
                                )}

                                {/* Zoom Indicator */}
                                {zoomImage && (
                                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                                        <ZoomIn className="w-3 h-3 inline mr-1" />
                                        Zoom Active
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shadow-sm ${selectedImageIndex === index
                                                ? 'border-indigo-600 ring-2 ring-indigo-200 ring-offset-2'
                                                : 'border-gray-200 hover:border-indigo-400'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.title} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info Section */}
                        <div className="space-y-6">
                            {/* Brand & Wishlist */}
                            <div className="flex items-start justify-between">
                                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-3 py-1 text-sm font-semibold">
                                    {product.brand}
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleWishlistToggle}
                                    className="rounded-full hover:bg-red-50"
                                >
                                    <Heart className={`h-6 w-6 transition-all ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
                                </Button>
                            </div>

                            {/* Title */}
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                    {product.title}
                                </h1>

                                {/* Rating */}
                                {product.numReviews > 0 && (
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-5 w-5 ${i < Math.floor(product.averageRating || 0)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">
                                            {product.averageRating?.toFixed(1)} ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Price Section */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                                    {product.mrp && product.mrp > product.price && (
                                        <>
                                            <span className="text-xl text-gray-400 line-through">₹{product.mrp}</span>
                                            <Badge className="bg-red-500 text-white border-0 px-2 py-1 text-sm font-bold">
                                                {discountPercentage}% OFF
                                            </Badge>
                                        </>
                                    )}
                                </div>
                                {product.mrp && product.mrp > product.price && (
                                    <p className="text-green-600 font-semibold text-sm">
                                        You save ₹{(product.mrp - product.price).toFixed(2)}
                                    </p>
                                )}
                            </div>

                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-bold text-gray-900">Select Size</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowSizeGuide(true)}
                                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                                        >
                                            <Ruler className="h-4 w-4 mr-1" />
                                            Size Guide
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-5 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${selectedSize === size
                                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md scale-105'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-400 hover:bg-indigo-50'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Selection */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="space-y-3">
                                    <Label className="text-base font-bold text-gray-900">Select Color</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-5 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${selectedColor === color
                                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md scale-105'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-400 hover:bg-indigo-50'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            {product.stock > 0 && (
                                <div className="flex items-center gap-4">
                                    <Label className="text-base font-bold text-gray-900">Quantity:</Label>
                                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => qty > 1 && setQty(qty - 1)}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                            disabled={qty === 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">{qty}</span>
                                        <button
                                            onClick={() => qty < product.stock && setQty(qty + 1)}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                            disabled={qty >= product.stock}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500">{product.stock} available</span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-14 gap-2 text-base font-bold shadow-lg hover:shadow-xl transition-all"
                                    disabled={product.stock === 0 || (product.sizes && product.sizes.length > 0 && !selectedSize)}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    ADD TO CART
                                </Button>
                                <Button
                                    onClick={handleGenerateSocialPost}
                                    variant="outline"
                                    className="px-6 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 h-14"
                                >
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                                <div className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <Truck className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-gray-900">Free Delivery</p>
                                    <p className="text-xs text-gray-500">On orders ₹500+</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <RotateCcw className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-gray-900">Easy Returns</p>
                                    <p className="text-xs text-gray-500">30 Days</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-gray-900">Warranty</p>
                                    <p className="text-xs text-gray-500">1 Year</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
                    <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                        {product.numReviews > 0 && (
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSummarizeReviews}
                                    disabled={summarizing}
                                    className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 gap-2"
                                >
                                    {summarizing ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    AI Summary
                                </Button>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${i < Math.floor(product.averageRating || 0)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-lg font-semibold text-gray-900">
                                        {product.averageRating?.toFixed(1)} out of 5
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {reviewSummary && (
                        <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <Sparkles size={64} className="text-purple-600" />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <Badge className="bg-purple-600 text-white border-0">AI INSIGHTS</Badge>
                                <h3 className="font-bold text-gray-900">Review Summary</h3>
                            </div>
                            <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                                {reviewSummary.split('\n').map((line, i) => (
                                    <p key={i} className="mb-1">{line}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.ratings.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium mb-1">No reviews yet</p>
                            <p className="text-sm text-gray-400">Be the first to review this product!</p>
                        </div>
                    ) : (
                        <div className="space-y-4 mb-8">
                            {product.ratings.map((review, index) => (
                                <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-bold text-gray-900 mb-1">{review.name}</p>
                                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Write Review Form */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="rating" className="text-sm font-semibold">Your Rating</Label>
                                <Select value={reviewRating} onValueChange={setReviewRating}>
                                    <SelectTrigger id="rating" className="w-full bg-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                                        <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                                        <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                                        <SelectItem value="2">⭐⭐ Fair</SelectItem>
                                        <SelectItem value="1">⭐ Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comment" className="text-sm font-semibold">Your Review</Label>
                                <Textarea
                                    id="comment"
                                    className="bg-white border-gray-300 focus:border-indigo-500"
                                    rows={4}
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                    required
                                    placeholder="Share your experience with this product..."
                                />
                            </div>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 font-semibold">
                                Submit Review
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Size Guide Dialog */}
            <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Ruler className="text-indigo-600 w-6 h-6" />
                            Size Guide
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                            <h4 className="font-bold text-gray-900 mb-3 text-lg">How to Measure</h4>
                            <ol className="list-decimal list-inside space-y-3 text-gray-700">
                                <li>Measure around the fullest part of your chest, keeping the tape measure horizontal.</li>
                                <li>For bottoms, measure around your natural waistline.</li>
                                <li>For length, measure from shoulder to hem (tops) or waist to hem (bottoms).</li>
                            </ol>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                        <th className="border border-indigo-500 px-6 py-3 text-left font-bold">Size</th>
                                        <th className="border border-indigo-500 px-6 py-3 text-center font-bold">Chest (inches)</th>
                                        <th className="border border-indigo-500 px-6 py-3 text-center font-bold">Waist (inches)</th>
                                        <th className="border border-indigo-500 px-6 py-3 text-center font-bold">Length (inches)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {['S', 'M', 'L', 'XL', 'XXL'].map((size, idx) => (
                                        <tr key={size} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="border border-gray-300 px-6 py-3 font-bold text-gray-900">{size}</td>
                                            <td className="border border-gray-300 px-6 py-3 text-center text-gray-700">{['36-38', '38-40', '40-42', '42-44', '44-46'][idx]}</td>
                                            <td className="border border-gray-300 px-6 py-3 text-center text-gray-700">{['30-32', '32-34', '34-36', '36-38', '38-40'][idx]}</td>
                                            <td className="border border-gray-300 px-6 py-3 text-center text-gray-700">{['27', '28', '29', '30', '31'][idx]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Social Post Dialog */}
            <Dialog open={showSocialModal} onOpenChange={setShowSocialModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="text-purple-600 w-5 h-5" />
                            AI Social Post Generator
                        </DialogTitle>
                    </DialogHeader>

                    {generatingPost ? (
                        <div className="flex flex-col items-center py-8">
                            <Loader className="animate-spin text-purple-600 mb-2" size={32} />
                            <p className="text-gray-500">Writing your perfect ad...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <p className="text-gray-800 whitespace-pre-wrap">{generatedPost}</p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedPost);
                                        alert("Copied to clipboard!");
                                    }}
                                >
                                    Copy Text
                                </Button>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                    onClick={handleGenerateSocialPost}
                                >
                                    Regenerate
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductDetails;
