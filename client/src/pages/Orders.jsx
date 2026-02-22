import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/orders/myorders');
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-4">
                <Skeleton className="h-10 w-40 mb-8" />
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.06),transparent_50%)] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <Card className="text-center py-20 border-gray-100 shadow-sm">
                        <CardContent className="pt-0 flex flex-col items-center">
                            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
                            <p className="mt-2 text-gray-500">Start shopping to see your orders here.</p>
                            <Button asChild className="mt-6 bg-indigo-600 hover:bg-indigo-700">
                                <Link to="/marketplace">Browse Marketplace</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <Card key={order._id} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Order ID: <span className="font-mono text-gray-900 font-semibold">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {order.isDelivered ? (
                                                <Badge className="bg-green-100 text-green-800 border-green-200 gap-1">
                                                    <CheckCircle className="w-3 h-3" /> Delivered
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1">
                                                    <Clock className="w-3 h-3" /> In Progress
                                                </Badge>
                                            )}
                                            <span className="text-lg font-bold text-gray-900">₹{order.totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
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
                                        <Button asChild variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 gap-1">
                                            <Link to={`/order/${order._id}`}>
                                                View Details <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
