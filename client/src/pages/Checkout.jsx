
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
import { MapPin, ShoppingBag, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';

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

    // Mock Payment State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');

    const [step, setStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 1000 ? 0 : 50;
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const submitAddressHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        setStep(1);
    };

    const submitPaymentHandler = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const placeOrderHandler = async () => {
        setIsProcessing(true);
        // Simulate payment delay
        setTimeout(async () => {
            try {
                const orderData = {
                    orderItems: cartItems,
                    shippingAddress: { address, city, postalCode, country },
                    paymentMethod: 'Credit Card (Mock)',
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
                setIsProcessing(false);
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/20 py-8 px-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none"></div>
            <div className="max-w-3xl mx-auto relative z-10">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>

                {/* Progress Steps */}
                <div className="flex items-center mb-8 gap-2">
                    {[
                        { label: 'Shipping', icon: MapPin },
                        { label: 'Payment', icon: CreditCard },
                        { label: 'Review', icon: ShoppingBag },
                    ].map((s, i) => (
                        <React.Fragment key={s.label}>
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${step >= i ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {i + 1}
                                </div>
                                <span className={`text-sm font-medium hidden sm:block ${step >= i ? 'text-indigo-600' : 'text-gray-400'}`}>{s.label}</span>
                            </div>
                            {i < 2 && <div className={`flex-1 h-0.5 ${step > i ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                {step === 0 && (
                    <Card className="border-gray-100 shadow-sm animate-reveal">
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
                                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 active:scale-[0.98] transition-all">
                                    Continue to Payment
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {step === 1 && (
                    <Card className="border-gray-100 shadow-sm animate-reveal">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-indigo-600" />
                                Payment Method
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitPaymentHandler} className="space-y-6">
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl mb-6 flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-indigo-900">Secure Checkout</p>
                                        <p className="text-xs text-indigo-600 font-medium">Your payment details are encrypted and never stored on our servers.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cardName">Cardholder Name</Label>
                                        <Input
                                            id="cardName"
                                            placeholder="John Doe"
                                            required
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cardNumber">Card Number</Label>
                                        <div className="relative">
                                            <Input
                                                id="cardNumber"
                                                placeholder="0000 0000 0000 0000"
                                                maxLength={19}
                                                required
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                                            />
                                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry">Expiry Date</Label>
                                            <Input
                                                id="expiry"
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                required
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value.replace(/^(\d{2})(\d{0,2})/, '$1/$2'))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvv">CVV</Label>
                                            <Input
                                                id="cvv"
                                                type="password"
                                                placeholder="***"
                                                maxLength={3}
                                                required
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-base font-bold active:scale-[0.98] transition-all">
                                        Continue to Review
                                    </Button>
                                    <Button variant="ghost" type="button" className="w-full" onClick={() => setStep(0)}>
                                        ← Back to Shipping
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {step === 2 && (
                    <Card className="border-gray-100 shadow-sm animate-reveal relative overflow-hidden">
                        {isProcessing && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Payment</h3>
                                <p className="text-slate-500 font-medium">Please do not refresh the page or click back.</p>
                                <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bank-Level Security</span>
                                </div>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                                Order Review
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping to</p>
                                    <p className="text-slate-900 text-sm font-semibold">{address}</p>
                                    <p className="text-slate-600 text-sm">{city}, {postalCode}</p>
                                    <p className="text-slate-600 text-sm">{country}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Method</p>
                                    <p className="text-slate-900 text-sm font-semibold flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-indigo-600" />
                                        •••• •••• •••• {cardNumber.slice(-4) || '4242'}
                                    </p>
                                    <p className="text-slate-600 text-sm">{cardName}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items</p>
                                <div className="space-y-3">
                                    {cartItems.map(item => (
                                        <div key={item.product} className="flex justify-between text-sm items-center py-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                                                    <img src={item.images?.[0]} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-slate-700 font-medium">{item.title}</span>
                                            </div>
                                            <span className="font-bold text-slate-900">₹{(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between text-slate-500 font-medium"><dt>Subtotal</dt><dd>₹{itemsPrice.toFixed(2)}</dd></div>
                                <div className="flex justify-between text-slate-500 font-medium"><dt>Shipping</dt><dd>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toFixed(2)}`}</dd></div>
                                <div className="flex justify-between text-slate-500 font-medium"><dt>Tax (18%)</dt><dd>₹{taxPrice.toFixed(2)}</dd></div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-black text-xl text-slate-900"><dt>Total Amount</dt><dd className="text-indigo-600">₹{totalPrice}</dd></div>
                            </dl>

                            <Button onClick={placeOrderHandler} className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 text-lg font-black gap-2 shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all">
                                <CheckCircle className="w-5 h-5" />
                                Confirm & Pay ₹{totalPrice}
                            </Button>
                            <Button variant="ghost" className="w-full h-12 font-bold text-slate-500" onClick={() => setStep(1)} disabled={isProcessing}>
                                ← Back to Payment
                            </Button>

                            <div className="flex justify-center items-center gap-4 pt-2 grayscale opacity-50">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Checkout;
