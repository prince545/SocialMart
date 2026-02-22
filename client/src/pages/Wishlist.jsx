import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getWishlist } from '../redux/wishlistSlice';
import { removeFromWishlist } from '../redux/wishlistSlice';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { items: wishlistItems, loading } = useSelector(state => state.wishlist);

    useEffect(() => {
        dispatch(getWishlist());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50/50 via-rose-50/30 to-purple-50/20 py-12 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.08),transparent_50%)] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                        My Wishlist
                    </h1>
                    <p className="text-gray-600">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-6">Start adding items you love!</p>
                        <Link to="/marketplace">
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default Wishlist;
