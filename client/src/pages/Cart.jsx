import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { addToCart, removeFromCart } from '../redux/cartSlice';
import { Trash2, ArrowLeft, ShoppingBag, CreditCard, ShieldCheck, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        if (isSignedIn) {
            navigate('/checkout');
        } else {
            navigate('/login?redirect=/checkout');
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/30 py-12 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 text-sm">
                            {cartItems.reduce((acc, item) => acc + item.qty, 0)} Items
                        </Badge>
                    </div>

                    {cartItems.length === 0 ? (
                        <Card className="text-center py-24 shadow-sm border-gray-100">
                            <CardContent className="pt-0 flex flex-col items-center">
                                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShoppingBag className="w-10 h-10 text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                                <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything yet. Discover great products in our marketplace.</p>
                                <Button asChild>
                                    <Link to="/marketplace">
                                        <ArrowLeft className="mr-2 w-4 h-4" />
                                        Start Shopping
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                            {/* Cart Items */}
                            <section className="lg:col-span-7">
                                <Card className="border-gray-100 shadow-sm overflow-hidden">
                                    <ul className="divide-y divide-gray-100">
                                        {cartItems.map((item) => (
                                            <li key={item.product} className="p-6 sm:flex sm:items-start">
                                                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden sm:w-32 sm:h-32 border border-gray-200">
                                                    <img
                                                        src={item.images?.[0] || 'https://via.placeholder.com/150'}
                                                        alt={item.title}
                                                        className="w-full h-full object-center object-cover"
                                                    />
                                                </div>
                                                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 flex flex-col justify-between">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <Link to={`/product/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                                                                {item.title}
                                                            </Link>
                                                            <p className="mt-1 text-sm text-gray-500">{item.brand || 'Brand'}</p>
                                                        </div>
                                                        <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-none border-r border-gray-200"
                                                                onClick={() => dispatch(addToCart({ ...item, qty: Math.max(1, item.qty - 1) }))}
                                                                disabled={item.qty <= 1}
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </Button>
                                                            <span className="px-4 py-1 text-gray-900 font-medium min-w-[2.5rem] text-center text-sm">
                                                                {item.qty}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-none border-l border-gray-200"
                                                                onClick={() => dispatch(addToCart({ ...item, qty: item.qty + 1 }))}
                                                                disabled={item.qty >= item.stock}
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => removeFromCartHandler(item.product)}
                                                        >
                                                            <Trash2 size={15} className="mr-1.5" />
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </section>

                            {/* Order Summary */}
                            <section className="lg:col-span-5 mt-10 lg:mt-0">
                                <Card className="border-gray-100 shadow-sm sticky top-24">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg">Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <dl className="space-y-3 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <dt>Subtotal</dt>
                                                <dd className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt>Estimated Tax (8%)</dt>
                                                <dd className="font-medium text-gray-900">₹{tax.toFixed(2)}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt>Shipping</dt>
                                                <dd className="font-medium text-green-600">Free</dd>
                                            </div>
                                        </dl>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-bold text-gray-900">Order Total</span>
                                            <span className="text-base font-bold text-indigo-600">₹{total.toFixed(2)}</span>
                                        </div>

                                        <Button
                                            type="button"
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base font-bold mt-2 active:scale-[0.98] transition-all"
                                            disabled={cartItems.length === 0}
                                            onClick={checkoutHandler}
                                        >
                                            Checkout Now
                                        </Button>

                                        <div className="flex justify-center text-xs text-gray-500 gap-6 pt-1">
                                            <div className="flex items-center gap-1">
                                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                                Secure Payment
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CreditCard className="w-4 h-4 text-blue-500" />
                                                Encrypted Data
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
