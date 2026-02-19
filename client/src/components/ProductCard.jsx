
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent Link navigation
        dispatch(addToCart({ ...product, product: product._id, qty: 1 }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <Link to={`/product/${product._id}`} className="block relative">
                <div className="h-64 bg-gray-100 overflow-hidden relative">
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300'}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                </div>
            </Link>
            <div className="p-5">
                <div className="mb-2">
                    <span className="text-xs font-medium text-pink-500 bg-pink-50 px-2 py-1 rounded-full uppercase tracking-wide">{product.brand || 'Generic'}</span>
                </div>
                <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-gray-900 mb-1 hover:text-indigo-600 transition-colors truncate text-lg">{product.title}</h3>
                </Link>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-extrabold text-gray-900">${product.price}</span>
                    <button
                        onClick={handleAddToCart}
                        className="p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
