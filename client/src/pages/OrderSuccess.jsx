
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
    const { id } = useParams();

    return (
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
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
    );
};

export default OrderSuccess;
