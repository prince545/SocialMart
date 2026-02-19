import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Users, Zap, Star, Clock } from 'lucide-react';

const Home = () => {
    // Countdown Timer Logic
    const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
                    return { hours: 24, minutes: 0, seconds: 0 }; // Reset for demo
                } else if (prev.minutes === 0 && prev.seconds === 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else if (prev.seconds === 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else {
                    return { ...prev, seconds: prev.seconds - 1 };
                }
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (time) => String(time).padStart(2, '0');

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-indigo-900 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-800 opacity-90"></div>
                </div>

                {/* Abstract shape decoration */}
                <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 bg-indigo-800 transform skew-x-12 translate-x-32 opacity-20"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="md:w-2/3 lg:w-1/2">
                        {/* Limited Time Offer Badge */}
                        <div className="inline-flex items-center px-4 py-1 rounded-full bg-red-500 text-white text-sm font-bold mb-6 animate-pulse shadow-lg transform -rotate-2 origin-left">
                            <Clock className="w-4 h-4 mr-2" />
                            Limited Time Offer
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                            Discover Unique Products & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">Connect with Sellers</span>
                        </h1>
                        <p className="text-xl text-indigo-100 mb-8 leading-relaxed max-w-lg">
                            SocialMart is the new way to shop. Browse curated collections, follow your favorite creators, and buy directly from your feed.
                        </p>

                        {/* Countdown Timer Display (Visual Only for impact) */}
                        <div className="flex space-x-4 mb-8 text-white">
                            <div className="text-center">
                                <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 min-w-[60px]">
                                    <span className="text-2xl font-bold">{formatTime(timeLeft.hours)}</span>
                                </div>
                                <span className="text-xs mt-1 block">HRS</span>
                            </div>
                            <div className="text-2xl font-bold pt-2">:</div>
                            <div className="text-center">
                                <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 min-w-[60px]">
                                    <span className="text-2xl font-bold">{formatTime(timeLeft.minutes)}</span>
                                </div>
                                <span className="text-xs mt-1 block">MIN</span>
                            </div>
                            <div className="text-2xl font-bold pt-2">:</div>
                            <div className="text-center">
                                <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 min-w-[60px]">
                                    <span className="text-2xl font-bold">{formatTime(timeLeft.seconds)}</span>
                                </div>
                                <span className="text-xs mt-1 block">SEC</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/marketplace" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-indigo-900 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)]">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Shop Now
                            </Link>
                            <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-transform transform hover:scale-105 active:scale-95 shadow-lg">
                                Get Started
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            A Better Way to Shop Online
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            We combine the best of social media and e-commerce to give you a seamless shopping experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Users,
                                title: "Community Driven",
                                description: "Connect with like-minded shoppers and sellers. Share your finds and get inspired."
                            },
                            {
                                icon: Zap,
                                title: "Instant Checkout",
                                description: "Buy products directly from your feed with our secure one-click checkout system."
                            },
                            {
                                icon: Star,
                                title: "Curated Selection",
                                description: "Discover high-quality unique items hand-picked by our top creators and community."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                                    <feature.icon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section - Glassmorphism */}
            <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
                            <p className="mt-2 text-gray-500">Explore our most popular collections.</p>
                        </div>
                        <Link to="/marketplace" className="hidden md:flex items-center text-indigo-600 font-medium hover:text-indigo-700">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Men's Fashion", color: "from-blue-500 to-cyan-400" },
                            { name: "Women's Fashion", color: "from-pink-500 to-rose-400" },
                            { name: "Electronics", color: "from-purple-500 to-indigo-400" },
                            { name: "Beauty", color: "from-amber-400 to-orange-300" }
                        ].map((category, idx) => (
                            <Link to="/marketplace" key={idx} className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                {/* Background Gradient as placeholder */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`}></div>

                                {/* Glassmorphism Content Box */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                    <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/40 shadow-sm group-hover:bg-white/40 transition-all">
                                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-sm">{category.name}</h3>
                                        <span className="flex items-center text-indigo-50 text-sm font-medium">
                                            Shop Collection <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 md:hidden text-center">
                        <Link to="/marketplace" className="text-indigo-600 font-medium hover:text-indigo-700">
                            View All Categories
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-700">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block text-indigo-200">Start your free trial today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4">
                        <div className="inline-flex rounded-md shadow">
                            <Link to="/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50">
                                Get started
                            </Link>
                        </div>
                        <div className="inline-flex rounded-md shadow">
                            <Link to="/feed" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 border-white">
                                View Feed
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
