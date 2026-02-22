import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Users, Zap, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Home = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
                    return { hours: 24, minutes: 0, seconds: 0 };
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
            <section className="relative overflow-hidden">
                {/* Banner image */}
                <img
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=85"
                    alt="Shopping banner"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="md:w-2/3 lg:w-1/2">
                        {/* Limited Time Offer Badge */}
                        <Badge
                            variant="destructive"
                            className="mb-6 px-4 py-1.5 text-sm font-bold animate-pulse shadow-lg transform -rotate-2 origin-left gap-2 rounded-full"
                        >
                            <Clock className="w-4 h-4" />
                            Limited Time Offer
                        </Badge>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                            Discover Unique Products & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">Connect with Sellers</span>
                        </h1>
                        <p className="text-xl text-indigo-100 mb-8 leading-relaxed max-w-lg">
                            SocialMart is the new way to shop. Browse curated collections, follow your favorite creators, and buy directly from your feed.
                        </p>

                        {/* Countdown Timer */}
                        <div className="flex space-x-4 mb-8 text-white">
                            {[
                                { value: timeLeft.hours, label: 'HRS' },
                                { value: timeLeft.minutes, label: 'MIN' },
                                { value: timeLeft.seconds, label: 'SEC' },
                            ].map((item, i) => (
                                <React.Fragment key={item.label}>
                                    <div className="text-center">
                                        <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 min-w-[60px]">
                                            <span className="text-2xl font-bold">{formatTime(item.value)}</span>
                                        </div>
                                        <span className="text-xs mt-1 block">{item.label}</span>
                                    </div>
                                    {i < 2 && <div className="text-2xl font-bold pt-2">:</div>}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="rounded-full text-indigo-900 bg-white hover:bg-gray-50 shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all"
                            >
                                <Link to="/marketplace">
                                    <ShoppingBag className="w-5 h-5 mr-2" />
                                    Shop Now
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="secondary"
                                className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                            >
                                <Link to="/register">
                                    Get Started
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-3 text-indigo-600 bg-indigo-50 border-indigo-100">Why Choose Us</Badge>
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
                            <Card key={index} className="hover:shadow-md transition-shadow duration-300 border-gray-100">
                                <CardHeader className="pb-0">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                        <feature.icon className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
                            <p className="mt-2 text-gray-500">Explore our most popular collections.</p>
                        </div>
                        <Button asChild variant="link" className="hidden md:flex text-indigo-600 hover:text-indigo-700 p-0">
                            <Link to="/marketplace">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                name: "Men's Fashion",
                                category: "Men's Clothing",
                                color: "from-blue-700/70 to-cyan-500/60",
                                image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80"
                            },
                            {
                                name: "Women's Fashion",
                                category: "Women's Clothing",
                                color: "from-pink-600/70 to-rose-400/60",
                                image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
                            },
                            {
                                name: "Electronics",
                                category: "Electronics",
                                color: "from-purple-700/70 to-indigo-500/60",
                                image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80"
                            },
                            {
                                name: "Beauty",
                                category: "Beauty",
                                color: "from-amber-500/70 to-orange-400/60",
                                image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"
                            }
                        ].map((cat, idx) => (
                            <Link
                                to={`/marketplace?category=${encodeURIComponent(cat.category)}`}
                                key={idx}
                                className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Background photo */}
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color}`} />
                                {/* Label */}
                                <div className="absolute inset-0 flex flex-col justify-end p-5">
                                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-sm group-hover:bg-white/30 transition-all">
                                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow">{cat.name}</h3>
                                        <span className="flex items-center text-white/80 text-sm font-medium">
                                            Shop Collection <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 md:hidden text-center">
                        <Button asChild variant="link" className="text-indigo-600 font-medium hover:text-indigo-700">
                            <Link to="/marketplace">View All Categories</Link>
                        </Button>
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
                        <Button asChild variant="secondary" className="text-indigo-600 bg-white hover:bg-gray-50">
                            <Link to="/register">Get started</Link>
                        </Button>
                        <Button asChild variant="outline" className="text-white border-white hover:bg-indigo-600">
                            <Link to="/feed">View Feed</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};


export default Home;
