import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart } from '../redux/cartSlice';
import { Trash2, ArrowLeft, ShoppingBag, CreditCard, ShieldCheck } from 'lucide-react';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/checkout');
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const tax = subtotal * 0.08; // Example tax
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <span className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {cartItems.reduce((acc, item) => acc + item.qty, 0)} Items
                    </span>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover great products in our marketplace.</p>
                        <Link
                            to="/marketplace"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                            <ArrowLeft className="mr-2 w-5 h-5" />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                        {/* Cart Items List */}
                        <section className="lg:col-span-7">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                                            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 flex flex-col justify-between h-full">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <Link to={`/product/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                                                            {item.title}
                                                        </Link>
                                                        <p className="mt-1 text-sm text-gray-500">{item.brand || 'Brand'}</p>
                                                    </div>
                                                    <p className="text-lg font-bold text-gray-900">${item.price}</p>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                                                            onClick={() => dispatch(addToCart({ ...item, qty: Math.max(1, item.qty - 1) }))}
                                                            disabled={item.qty <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-3 py-1 text-gray-900 font-medium border-x border-gray-300 min-w-[3rem] text-center">
                                                            {item.qty}
                                                        </span>
                                                        <button
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
                                                            onClick={() => dispatch(addToCart({ ...item, qty: item.qty + 1 }))}
                                                            disabled={item.qty >= item.stock}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCartHandler(item.product)}
                                                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center transition-colors"
                                                    >
                                                        <Trash2 size={16} className="mr-1.5" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Order Summary */}
                        <section className="lg:col-span-5 mt-16 lg:mt-0">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                                <dl className="space-y-4 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <dt>Subtotal</dt>
                                        <dd className="font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt>Estimated Tax (8%)</dt>
                                        <dd className="font-medium text-gray-900">${tax.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt>Shipping estimate</dt>
                                        <dd className="font-medium text-green-600">Free</dd>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                        <dt className="text-base font-bold text-gray-900">Order Total</dt>
                                        <dd className="text-base font-bold text-indigo-600">${total.toFixed(2)}</dd>
                                    </div>
                                </dl>

                                <div className="mt-8">
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center rounded-xl border border-transparent bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                                        disabled={cartItems.length === 0}
                                        onClick={checkoutHandler}
                                    >
                                        Checkout Now
                                    </button>
                                </div>

                                <div className="mt-6 flex justify-center text-center text-xs text-gray-500 space-x-4">
                                    <div className="flex items-center">
                                        <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
                                        Secure Payment
                                    </div>
                                    <div className="flex items-center">
                                        <CreditCard className="w-4 h-4 mr-1 text-blue-500" />
                                        Encrypted Data
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
