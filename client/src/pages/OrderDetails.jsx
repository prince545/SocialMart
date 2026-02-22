import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, MapPin, ChevronLeft } from 'lucide-react';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/api/orders/${id}`);
                setOrder(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading order details...</div>;
    if (!order) return <div className="text-center py-20 text-red-500">Order not found.</div>;

    // determine active step based on order status
    // Simple logic for demo: Delivered > Out for Delivery > Shipped > Placed
    // Since we only have 'isDelivered' flag, we will simulate steps if not delivered
    const getStepStatus = () => {
        if (order.isDelivered) return 4;
        // Mock logic for demo purposes
        return 2; // Default to "Shipped" for pending orders
    };

    const currentStep = getStepStatus();

    const steps = [
        { id: 1, name: 'Order Placed', icon: Package, date: new Date(order.createdAt).toLocaleDateString() },
        { id: 2, name: 'Shipped', icon: Truck, date: 'Pending' },
        { id: 3, name: 'Out for Delivery', icon: createTruckIcon(), date: 'Pending' },
        { id: 4, name: 'Delivered', icon: CheckCircle, date: order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'Pending' },
    ];

    function createTruckIcon() {
        // Just reusing Truck for "Out for Delivery" but maybe with different color/style in real app
        return Truck;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.06),transparent_50%)] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <Link to="/orders" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to Orders
                </Link>

                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</h1>
                            <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className="text-2xl font-bold text-indigo-600">₹{order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="p-8 border-b border-gray-100">
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 rounded-full z-0 transition-all duration-1000"
                                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                            ></div>

                            <div className="relative z-10 flex justify-between">
                                {steps.map((step) => {
                                    const isActive = step.id <= currentStep;
                                    const isCompleted = step.id < currentStep;
                                    return (
                                        <div key={step.id} className="flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isActive
                                                    ? 'bg-indigo-600 border-indigo-100 text-white shadow-md scale-110'
                                                    : 'bg-white border-gray-200 text-gray-400'
                                                    }`}
                                            >
                                                <step.icon size={18} />
                                            </div>
                                            <p className={`text-xs font-semibold mt-3 ${isActive ? 'text-indigo-700' : 'text-gray-500'}`}>{step.name}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{step.date}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
                            <div className="space-y-4">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/80'}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                        />
                                        <div className="ml-4 flex-1">
                                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-1 space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                    <MapPin size={16} className="mr-2 text-indigo-500" />
                                    Shipping Address
                                </h3>
                                <div className="text-sm text-gray-600">
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span>₹{order.itemsPrice?.toFixed(2) || (order.totalPrice - (order.shippingPrice || 0) - (order.taxPrice || 0)).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Shipping</span>
                                        <span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice?.toFixed(2) || '0.00'}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Tax</span>
                                        <span>₹{order.taxPrice?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>₹{order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
