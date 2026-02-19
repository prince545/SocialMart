
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductDetails, createProductReview } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import { ArrowLeft, ShoppingCart, Star, Share2, X, Sparkles, Loader } from 'lucide-react';
import axios from 'axios';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector(state => state.products);
    const [qty, setQty] = useState(1);
    const [showSocialModal, setShowSocialModal] = useState(false);
    const [generatedPost, setGeneratedPost] = useState('');
    const [generatingPost, setGeneratingPost] = useState(false);

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

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error.msg || 'Product not found'}</div>;
    if (!product) return null;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <Link to="/marketplace" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6">
                <ArrowLeft size={20} className="mr-2" />
                Back to Marketplace
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/500'}
                        alt={product.title}
                        className="w-full h-auto object-contain max-h-[500px]"
                    />
                </div>

                {/* Details Section */}
                <div>
                    <div className="mb-4">
                        <span className="text-sm text-blue-600 font-semibold uppercase tracking-wider">{product.brand}</span>
                        <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-2">{product.title}</h1>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.floor(product.averageRating || 0) ? "currentColor" : "none"} className={i < Math.floor(product.averageRating || 0) ? "" : "text-gray-300"} />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">({product.numReviews} reviews)</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">${product.price}</p>
                    </div>

                    <div className="prose prose-blue text-gray-600 mb-6">
                        <p>{product.description}</p>
                    </div>

                    <div className="border-t border-gray-200 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-semibold text-gray-700">Status:</span>
                            <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {product.stock > 0 && (
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-semibold text-gray-700">Quantity:</span>
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    className="border border-gray-300 rounded p-2"
                                >
                                    {[...Array(product.stock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart size={20} />
                                <span>Add to Cart</span>
                            </button>
                            <button
                                onClick={() => handleGenerateSocialPost()}
                                className="flex-1 bg-purple-100 text-purple-700 py-3 px-6 rounded-xl font-semibold hover:bg-purple-200 transition-colors flex items-center justify-center space-x-2"
                            >
                                <Share2 size={20} />
                                <span>Create Ad</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h3>
                    {product.ratings.length === 0 && <p className="text-gray-500 mb-4">No reviews yet.</p>}

                    <div className="space-y-4 mb-8">
                        {product.ratings.map((review, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
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

                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Customer Review</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const rating = e.target.rating.value;
                            const comment = e.target.comment.value;
                            dispatch(createProductReview({ productId: id, reviewData: { rating, comment } }));
                            // We should probably clear form or show success message, but for now simple alert
                            // Also need to handle error if moderation fails
                        }}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Rating</label>
                                <select name="rating" className="w-full border p-2 rounded-lg" required>
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Good</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="1">1 - Poor</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Comment</label>
                                <textarea name="comment" className="w-full border p-2 rounded-lg" rows="3" required></textarea>
                            </div>
                            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium">
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Social Post Modal */}
            {showSocialModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
                        <button onClick={() => setShowSocialModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="text-purple-600" />
                            AI Social Post Generator
                        </h3>

                        {generatingPost ? (
                            <div className="flex flex-col items-center py-8">
                                <Loader className="animate-spin text-purple-600 mb-2" size={32} />
                                <p className="text-gray-500">Writing your perfect ad...</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                                    <p className="text-gray-800 whitespace-pre-wrap">{generatedPost}</p>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedPost);
                                            alert("Copied to clipboard!");
                                        }}
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium"
                                    >
                                        Copy Text
                                    </button>
                                    <button
                                        onClick={handleGenerateSocialPost}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
                                    >
                                        Regenerate
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
