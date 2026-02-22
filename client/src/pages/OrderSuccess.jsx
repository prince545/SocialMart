
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center py-16 px-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none"></div>
            <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-6">
                <CheckCircle size={64} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-8">
                Thank you for your purchase. Your order ID is <span className="font-mono bg-gray-100 px-2 py-1 rounded">{id}</span>.
            </p>
            <div className="space-x-4">
                <Link to="/marketplace" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    Continue Shopping
                </Link>
                {/* Future: Link to order details */}
            </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
