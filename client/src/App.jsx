import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy Load Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Feed = lazy(() => import('./pages/Feed'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Chat = lazy(() => import('./pages/Chat'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));

function App() {
    const { getToken } = useAuth();

    useEffect(() => {
        const interceptor = axios.interceptors.request.use(async (config) => {
            try {
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (err) {
                console.error("Failed to get Clerk token", err);
            }
            return config;
        });

        return () => axios.interceptors.request.eject(interceptor);
    }, [getToken]);

    return (
        <Router>
            <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Suspense fallback={<Loading />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/feed" element={<Feed />} />
                            <Route path="/marketplace" element={<Marketplace />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/order-success/:id" element={<OrderSuccess />} />
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/order/:id" element={<OrderDetails />} />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
