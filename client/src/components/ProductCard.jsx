import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '@clerk/clerk-react';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist, getWishlist } from '../redux/wishlistSlice';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProductCard = ({ product, onQuickView }) => {
    const dispatch = useDispatch();
    const { isSignedIn } = useUser();
    const { items: wishlistItems } = useSelector(state => state.wishlist);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageHover, setImageHover] = useState(false);

    useEffect(() => {
        if (wishlistItems.length > 0) {
            setIsWishlisted(wishlistItems.some(item => item._id === product._id));
        }
    }, [wishlistItems, product._id]);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({ ...product, product: product._id, qty: 1 }));
    };

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
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

    // Calculate discount percentage - only show if there's an actual discount
    let discountPercentage = 0;
    if (product.mrp && product.mrp > product.price) {
        discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    } else if (product.discount && product.discount > 0) {
        discountPercentage = product.discount;
    }

    const averageRating = product.averageRating || 0;
    const numReviews = product.numReviews || 0;

    return (
        <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 shadow-sm bg-white h-full flex flex-col cursor-pointer">
            <Link to={`/product/${product._id}`} className="block relative flex-shrink-0 cursor-pointer">
                {/* ... (rest of image container stays same) ... */}
                {/* Image Container */}
                <div
                    className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer"
                    onMouseEnter={() => setImageHover(true)}
                    onMouseLeave={() => setImageHover(false)}
                >
                    {/* Main Image */}
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300'}
                        alt={product.title}
                        className={`w-full h-full object-cover transition-all duration-500 ${imageHover && product.images?.[1] ? 'opacity-0' : 'opacity-100'
                            }`}
                        loading="lazy"
                    />
                    {/* Hover Image */}
                    {product.images?.[1] && (
                        <img
                            src={product.images[1]}
                            alt={product.title}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${imageHover ? 'opacity-100' : 'opacity-0'
                                }`}
                        />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {discountPercentage > 0 && (
                            <Badge className="bg-red-500 text-white border-0 px-2 py-1 text-xs font-bold">
                                {discountPercentage}% OFF
                            </Badge>
                        )}
                        {product.isNewArrival && (
                            <Badge className="bg-green-500 text-white border-0 px-2 py-1 text-xs font-bold">
                                NEW
                            </Badge>
                        )}
                        {product.isTrending && (
                            <Badge className="bg-orange-500 text-white border-0 px-2 py-1 text-xs font-bold">
                                TRENDING
                            </Badge>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-md cursor-pointer active:scale-90 transition-transform"
                            onClick={handleWishlistToggle}
                            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <Heart
                                className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                            />
                        </Button>
                        {onQuickView && (
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-md cursor-pointer active:scale-90 transition-transform"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onQuickView(product);
                                }}
                                aria-label="Quick view"
                            >
                                <Eye className="h-4 w-4 text-gray-600" />
                            </Button>
                        )}
                    </div>

                    {/* Stock Badge */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Badge className="bg-gray-800 text-white px-4 py-2 text-sm font-semibold">
                                OUT OF STOCK
                            </Badge>
                        </div>
                    )}
                </div>
            </Link>

            <CardHeader className="p-4 pb-2 flex-grow">
                <div className="mb-1.5">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {product.brand || 'Generic'}
                    </span>
                </div>
                <Link to={`/product/${product._id}`} className="cursor-pointer">
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-2 text-sm leading-snug cursor-pointer">
                        {product.title}
                    </h3>
                </Link>

                {/* Rating */}
                {numReviews > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < Math.floor(averageRating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({numReviews})</span>
                    </div>
                )}
            </CardHeader>

            <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-gray-900">₹{product.price}</span>
                        {product.mrp > product.price && (
                            <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                        )}
                    </div>
                    {discountPercentage > 0 && (
                        <span className="text-xs text-green-600 font-medium">{discountPercentage}% off</span>
                    )}
                </div>
                <Button
                    onClick={handleAddToCart}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 h-8 text-xs font-semibold transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                    disabled={product.stock === 0}
                    aria-label="Add to cart"
                >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                    ADD
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
