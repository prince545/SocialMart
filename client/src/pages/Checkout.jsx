
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress, clearCart } from '../redux/cartSlice';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ShoppingBag, CheckCircle } from 'lucide-react';

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
            <div className="flex items-center mb-8 gap-2">
                {[
                    { label: 'Shipping', icon: MapPin },
                    { label: 'Review & Pay', icon: ShoppingBag },
                ].map((s, i) => (
                    <React.Fragment key={s.label}>
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${step >= i ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {i + 1}
                            </div>
                            <span className={`text-sm font-medium hidden sm:block ${step >= i ? 'text-indigo-600' : 'text-gray-400'}`}>{s.label}</span>
                        </div>
                        {i < 1 && <div className={`flex-1 h-0.5 ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
                    </React.Fragment>
                ))}
            </div>

            {step === 0 ? (
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-indigo-600" />
                            Shipping Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitAddressHandler} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="address">Street Address</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    placeholder="123 Main St"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                        placeholder="New York"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input
                                        id="postalCode"
                                        type="text"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        required
                                        placeholder="10001"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                    placeholder="United States"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-11">
                                Continue to Review
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-indigo-600" />
                            Order Review
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Shipping to:</p>
                            <p className="text-gray-600 text-sm">{address}, {city}, {postalCode}, {country}</p>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3">Items:</p>
                            <div className="space-y-2">
                                {cartItems.map(item => (
                                    <div key={item.product} className="flex justify-between text-sm py-1">
                                        <span className="text-gray-700">{item.title} × {item.qty}</span>
                                        <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600"><dt>Subtotal</dt><dd>${itemsPrice.toFixed(2)}</dd></div>
                            <div className="flex justify-between text-gray-600"><dt>Shipping</dt><dd>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</dd></div>
                            <div className="flex justify-between text-gray-600"><dt>Tax (15%)</dt><dd>${taxPrice.toFixed(2)}</dd></div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg text-gray-900"><dt>Total</dt><dd className="text-indigo-600">${totalPrice}</dd></div>
                        </dl>

                        <Button onClick={placeOrderHandler} className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-bold gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Place Order
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => setStep(0)}>
                            ← Back to Shipping
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Checkout;
