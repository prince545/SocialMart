
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress, clearCart } from '../redux/cartSlice';
import axios from 'axios';

import { useAuth } from '@clerk/clerk-react';

const Checkout = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress, cartItems } = cart;
    const { isSignedIn, isLoaded } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    // Step state: 0 = Address, 1 = Review & Pay
    const [step, setStep] = useState(0);

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const submitAddressHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        setStep(1);
    };

    const placeOrderHandler = async () => {
        try {
            const orderData = {
                orderItems: cartItems,
                shippingAddress: { address, city, postalCode, country },
                paymentMethod: 'PayPal',
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            };

            const { data } = await axios.post('/api/orders', orderData);
            dispatch(clearCart());
            navigate(`/order-success/${data._id}`);

        } catch (error) {
            console.error(error);
            alert('Error placing order');
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>

            {/* Progress Steps */}
            <div className="flex items-center mb-8">
                <div className={`flex-1 border-t-4 ${step >= 0 ? 'border-blue-600' : 'border-gray-200'}`}></div>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'} font-bold`}>1</div>
                <div className={`flex-1 border-t-4 ${step >= 1 ? 'border-blue-600' : 'border-gray-200'}`}></div>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'} font-bold`}>2</div>
                <div className={`flex-1 border-t-4 ${step >= 2 ? 'border-blue-600' : 'border-gray-200'}`}></div>
            </div>

            {step === 0 ? (
                <form onSubmit={submitAddressHandler} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Address</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full border p-2 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">City</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full border p-2 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Postal Code</label>
                        <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="w-full border p-2 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Country</label>
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full border p-2 rounded" />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Continue</button>
                </form>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="mb-4">
                        <h3 className="font-semibold">Shipping to:</h3>
                        <p className="text-gray-600">{address}, {city}, {postalCode}, {country}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Items:</h3>
                        {cartItems.map(item => (
                            <div key={item.product} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                                <span>{item.title} x {item.qty}</span>
                                <span>${(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between"><span>Items:</span><span>${itemsPrice.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Shipping:</span><span>${shippingPrice.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Tax:</span><span>${taxPrice.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>${totalPrice}</span></div>
                    </div>

                    <div className="mt-6">
                        <button onClick={placeOrderHandler} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
                            Place Order (Mock Pay)
                        </button>
                        <button onClick={() => setStep(0)} className="w-full mt-2 text-gray-500 hover:text-gray-700">Back</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
