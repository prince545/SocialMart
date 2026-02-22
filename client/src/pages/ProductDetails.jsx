
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductDetails, createProductReview } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import { ArrowLeft, ShoppingCart, Star, Share2, Sparkles, Loader } from 'lucide-react';
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
    const { product, loading, error } = useSelector(state => state.products);
    const [qty, setQty] = useState(1);
    const [showSocialModal, setShowSocialModal] = useState(false);
    const [generatedPost, setGeneratedPost] = useState('');
    const [generatingPost, setGeneratingPost] = useState(false);
    const [reviewRating, setReviewRating] = useState('5');
    const [reviewComment, setReviewComment] = useState('');

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, product: product._id, qty }));
        navigate('/cart');
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

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error.msg || 'Product not found'}</div>;
    if (!product) return null;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <Button asChild variant="ghost" className="mb-6 text-gray-500 hover:text-indigo-600 -ml-2">
                <Link to="/marketplace">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Marketplace
                </Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-center">
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/500'}
                        alt={product.title}
                        className="w-full h-auto object-contain max-h-[500px]"
                    />
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                    <div>
                        <Badge variant="secondary" className="text-indigo-600 bg-indigo-50 border-indigo-100 mb-2">
                            {product.brand}
                        </Badge>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.floor(product.averageRating || 0) ? "currentColor" : "none"} className={i < Math.floor(product.averageRating || 0) ? "" : "text-gray-300"} />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">({product.numReviews} reviews)</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">${product.price}</p>
                    </div>

                    <p className="text-gray-600 leading-relaxed">{product.description}</p>

                    <Separator />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-700">Status:</span>
                            <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'}
                                className={product.stock > 0 ? 'bg-green-100 text-green-800 border-green-200' : ''}>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                        </div>

                        {product.stock > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-700">Quantity:</span>
                                <Select value={String(qty)} onValueChange={(v) => setQty(Number(v))}>
                                    <SelectTrigger className="w-28">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[...Array(product.stock).keys()].map((x) => (
                                            <SelectItem key={x + 1} value={String(x + 1)}>{x + 1}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={handleAddToCart}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-12 gap-2 text-base"
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart size={18} />
                            Add to Cart
                        </Button>
                        <Button
                            onClick={handleGenerateSocialPost}
                            variant="secondary"
                            className="flex-1 bg-purple-100 text-purple-700 hover:bg-purple-200 h-12 gap-2 text-base"
                        >
                            <Share2 size={18} />
                            Create Ad
                        </Button>
                    </div>
                </div>

                {/* Reviews Section - full width */}
                <div className="md:col-span-2 mt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                    {product.ratings.length === 0 && <p className="text-gray-500 mb-4">No reviews yet.</p>}

                    <div className="space-y-4 mb-8">
                        {product.ratings.map((review, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-900">{review.name}</span>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">{review.comment}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="rating">Rating</Label>
                                <Select value={reviewRating} onValueChange={setReviewRating}>
                                    <SelectTrigger id="rating" className="w-48 bg-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 - Excellent</SelectItem>
                                        <SelectItem value="4">4 - Very Good</SelectItem>
                                        <SelectItem value="3">3 - Good</SelectItem>
                                        <SelectItem value="2">2 - Fair</SelectItem>
                                        <SelectItem value="1">1 - Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="comment">Comment</Label>
                                <Textarea
                                    id="comment"
                                    className="bg-white"
                                    rows={3}
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                    required
                                    placeholder="Share your thoughts about this product..."
                                />
                            </div>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                                Submit Review
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

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
