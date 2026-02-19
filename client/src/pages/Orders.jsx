import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/orders/myorders');
                // Sort by date desc
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-20">Loading orders...</div>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-2 text-gray-500">Start shopping to see your orders here.</p>
                    <Link to="/marketplace" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        Browse Marketplace
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-900">#{order._id.substring(order._id.length - 8).toUpperCase()}</span></p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {order.isDelivered ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Delivered
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <Clock className="w-3 h-3 mr-1" /> In Progress
                                            </span>
                                        )}
                                        <span className="text-lg font-bold text-gray-900 ml-4">${order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {order.orderItems.slice(0, 4).map((item, idx) => (
                                                <img
                                                    key={idx}
                                                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                                                    src={item.image || 'https://via.placeholder.com/50'}
                                                    alt={item.name}
                                                />
                                            ))}
                                            {order.orderItems.length > 4 && (
                                                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-gray-100 text-xs font-medium text-gray-500">
                                                    +{order.orderItems.length - 4}
                                                </div>
                                            )}
                                        </div>
                                        <Link to={`/order/${order._id}`} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm flex items-center">
                                            View Details <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
