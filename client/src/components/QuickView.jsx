import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '@clerk/clerk-react';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import { ShoppingCart, Heart, X, Star, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const QuickView = ({ product, open, onOpenChange }) => {
    const dispatch = useDispatch();
    const { isSignedIn } = useUser();
    const { items: wishlistItems } = useSelector(state => state.wishlist);
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const isWishlisted = wishlistItems.some(item => item._id === product?._id);

    React.useEffect(() => {
        if (product) {
            if (product.sizes && product.sizes.length > 0) {
                setSelectedSize(product.sizes[0]);
            }
            if (product.colors && product.colors.length > 0) {
                setSelectedColor(product.colors[0]);
            }
        }
    }, [product]);

    if (!product) return null;

    const handleAddToCart = () => {
        dispatch(addToCart({
            ...product,
            product: product._id,
            qty,
            selectedSize,
            selectedColor
        }));
        onOpenChange(false);
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

    const discountPercentage = product.mrp && product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : product.discount || 0;

    const averageRating = product.averageRating || 0;
    const numReviews = product.numReviews || 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200">
                <DialogHeader>
                    <DialogTitle className="sr-only">Quick View: {product.title}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Section */}
                    <div className="space-y-3">
                        <div className="relative bg-gray-50 rounded-lg overflow-hidden aspect-square">
                            <img
                                src={product.images?.[selectedImageIndex] || product.images?.[0] || 'https://via.placeholder.com/400'}
                                alt={product.title}
                                className="w-full h-full object-contain"
                            />
                            {discountPercentage > 0 && (
                                <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                                    {discountPercentage}% OFF
                                </Badge>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {product.images.slice(0, 4).map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${selectedImageIndex === index
                                                ? 'border-indigo-600'
                                                : 'border-gray-200'
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

                    {/* Details Section */}
                    <div className="space-y-4">
                        <div>
                            <Badge variant="secondary" className="text-indigo-600 bg-indigo-50 border-indigo-100 mb-2">
                                {product.brand}
                            </Badge>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.floor(averageRating)
                                                    ? 'fill-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">({numReviews} reviews)</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                                {product.mrp && product.mrp > product.price && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                                        <Badge className="bg-red-500 text-white border-0">
                                            {discountPercentage}% OFF
                                        </Badge>
                                    </>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Size</label>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`px-3 py-1.5 rounded border text-sm font-medium ${selectedSize === s
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setSelectedColor(c)}
                                            className={`px-3 py-1.5 rounded border text-sm font-medium ${selectedColor === c
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        {product.stock > 0 && (
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Quantity</label>
                                <Select value={String(qty)} onValueChange={(v) => setQty(Number(v))}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                                            <SelectItem key={x + 1} value={String(x + 1)}>
                                                {x + 1}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                disabled={product.stock === 0 || (product.sizes && product.sizes.length > 0 && !selectedSize)}
                            >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleWishlistToggle}
                                className="px-4"
                            >
                                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                        </div>

                        <Link
                            to={`/product/${product._id}`}
                            className="block text-center text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                            onClick={() => onOpenChange(false)}
                        >
                            View Full Details →
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QuickView;
