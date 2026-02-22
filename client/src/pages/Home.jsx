import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { getProducts, getStats, getCategories, getRecommendations } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import ProductCard from '../components/ProductCard';
import {
    ArrowRight, ShoppingBag, Zap, Star, TrendingUp,
    Shield, Heart, Sparkles, ChevronRight, Gift, Truck,
    HeadphonesIcon, Award, Percent, Flame, Eye, Home as HomeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const { products, stats, categories: dynamicCategories, recommendations } = useSelector(state => state.products);
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 30, seconds: 0 });
    const [activeTab, setActiveTab] = useState('trending');
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Filter products for the selected category spotlight, prioritizing trending/new arrivals
    const categoryProducts = selectedCategory
        ? products
            .filter(p => p.category === selectedCategory)
            .sort((a, b) => {
                if (a.isTrending && !b.isTrending) return -1;
                if (!a.isTrending && b.isTrending) return 1;
                if (a.isNewArrival && !b.isNewArrival) return -1;
                if (!a.isNewArrival && b.isNewArrival) return 1;
                return 0;
            })
            .slice(0, 4)
        : [];

    useEffect(() => {
        // Fetch products without strict trending filter to ensure we have data for all tabs
        dispatch(getProducts({ limit: 24 }));
        dispatch(getStats());
        dispatch(getCategories());
        dispatch(getRecommendations());
    }, [dispatch]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0)
                    return { hours: 23, minutes: 59, seconds: 59 };
                if (prev.minutes === 0 && prev.seconds === 0)
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.seconds === 0)
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                return { ...prev, seconds: prev.seconds - 1 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Robust filtering logic: use flags if they exist, otherwise use fallback samples
    const trendingProducts = products.some(p => p.isTrending)
        ? products.filter(p => p.isTrending).slice(0, 8)
        : products.slice(0, 8); // Fallback: first 8 products

    const newArrivalProducts = products.some(p => p.isNewArrival)
        ? products.filter(p => p.isNewArrival).slice(0, 8)
        : products.slice(8, 16); // Fallback: next 8 products

    const bestSellers = products.slice(0, 8);

    const handleQuickPurchase = (product) => {
        dispatch(addToCart({ ...product, product: product._id, qty: 1 }));
        if (isSignedIn) {
            navigate('/checkout');
        } else {
            navigate('/login?redirect=/checkout');
        }
    };

    const premiumCategories = [
        {
            name: "Men's Clothing",
            image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80",
            badge: "NEW",
            color: "from-blue-500/80 to-indigo-600/80"
        },
        {
            name: "Women's Clothing",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
            badge: "HOT",
            color: "from-pink-500/80 to-rose-600/80"
        },
        {
            name: "Electronics",
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
            badge: "BEST",
            color: "from-violet-500/80 to-purple-600/80"
        },
        {
            name: "Beauty",
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
            badge: "HOT",
            color: "from-amber-400/80 to-orange-500/80"
        },
        {
            name: "Home",
            image: "https://images.unsplash.com/photo-1513519247388-4e2837139a2b?w=600&q=80",
            badge: "NEW",
            color: "from-emerald-500/80 to-teal-600/80"
        }
    ];

    const fmt = (n) => String(n).padStart(2, '0');

    return (
        <div className="bg-[#FAFAFB]">
            {/* --- Premium Announcement Bar --- */}
            <div className="bg-slate-900 border-b border-white/5 py-2.5 px-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
                <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6 text-[13px] md:text-sm font-medium text-white/90">
                        <span className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-indigo-400" />
                            Free Delivery on ₹500+
                        </span>
                        <span className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-6">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            Secure Payments
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] md:text-sm text-indigo-300 font-bold tracking-tight">
                        <span className="animate-pulse">LIMITED TIME:</span>
                        <span className="text-white">Use code MART25 for 25% OFF</span>
                    </div>
                </div>
            </div>

            {/* --- Bento Hero Section --- */}
            <section className="relative pt-8 pb-16 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">

                    {/* Main Feature Bento Item */}
                    <div className="lg:col-span-8 relative group overflow-hidden rounded-[32px] bg-slate-900 animate-reveal">
                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
                            alt="Collection"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-950/20 to-transparent"></div>
                        <div className="relative h-full p-8 md:p-14 flex flex-col justify-end">
                            <Badge className="w-fit mb-6 bg-white/10 backdrop-blur-md border-white/20 text-white rounded-full px-4 py-1">
                                <Sparkles className="w-3.5 h-3.5 mr-2 text-yellow-400" />
                                New Season Arrival
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] max-w-2xl text-balance">
                                Elevate Your Lifestyle with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Curated Collections.</span>
                            </h1>
                            <p className="text-lg text-white/70 mb-10 max-w-lg text-balance">
                                Discover thousands of premium products across tech, fashion, and home essentials. Quality guaranteed.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/marketplace">
                                    <Button className="btn-premium px-10 rounded-2xl h-14 text-base">
                                        Explore Marketplace
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Button className="btn-glass px-10 rounded-2xl h-14 text-base">
                                    Our Story
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Bento Items (Vertical Stack) */}
                    <div className="lg:col-span-4 grid grid-rows-2 gap-6">
                        {/* Upper Small Bento */}
                        <div className="relative group overflow-hidden rounded-[32px] bg-indigo-600 animate-reveal" style={{ animationDelay: '0.1s' }}>
                            <img
                                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
                                alt="Electronics"
                                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-transparent"></div>
                            <div className="relative p-8 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Zap className="text-white w-6 h-6" />
                                    </div>
                                    <Badge className="bg-orange-500 text-white border-0">SAVE 40%</Badge>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Tech Essentials</h3>
                                    <p className="text-white/70 text-sm mb-4">Latest gadgets for your daily workflow.</p>
                                    <Link to="/marketplace?category=Electronics" className="text-white font-bold flex items-center gap-1 group/link">
                                        Shop Now <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Lower Small Bento (Flash Sale) */}
                        <div className="relative group overflow-hidden rounded-[32px] bg-white border border-slate-100 shadow-sm animate-reveal" style={{ animationDelay: '0.2s' }}>
                            <div className="absolute top-0 right-0 p-8">
                                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center animate-pulse">
                                    <Flame className="text-rose-500 w-10 h-10" />
                                </div>
                            </div>
                            <div className="relative p-8 h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Flash Sale</h3>
                                    <p className="text-slate-500 text-sm">Ends in:</p>
                                    <div className="flex gap-2 mt-3">
                                        <div className="bg-slate-900 text-white rounded-xl p-2 min-w-[50px] text-center">
                                            <div className="text-lg font-bold leading-tight">{fmt(timeLeft.hours)}</div>
                                            <div className="text-[10px] uppercase opacity-60">Hrs</div>
                                        </div>
                                        <div className="bg-slate-900 text-white rounded-xl p-2 min-w-[50px] text-center">
                                            <div className="text-lg font-bold leading-tight">{fmt(timeLeft.minutes)}</div>
                                            <div className="text-[10px] uppercase opacity-60">Min</div>
                                        </div>
                                        <div className="bg-slate-900 text-white rounded-xl p-2 min-w-[50px] text-center">
                                            <div className="text-lg font-bold leading-tight">{fmt(timeLeft.seconds)}</div>
                                            <div className="text-[10px] uppercase opacity-60">Sec</div>
                                        </div>
                                    </div>
                                </div>
                                <Link to="/marketplace" className="w-fit">
                                    <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-6">
                                        View Deals
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Premium Category Cards --- */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Shop by Category</h2>
                            <p className="text-slate-500 font-medium">Explore our curated collections and trending styles.</p>
                        </div>
                        <Link to="/marketplace" className="text-indigo-600 font-bold flex items-center gap-1 group">
                            View All Showcase <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {premiumCategories.map((cat, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                                className={`relative h-[380px] rounded-[32px] overflow-hidden cursor-pointer group transition-all duration-500 ${selectedCategory === cat.name ? 'ring-4 ring-indigo-500 scale-[0.98]' : 'hover:-translate-y-2'
                                    }`}
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-b ${cat.color} mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity`}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                                <div className="absolute top-6 left-6">
                                    <Badge className="bg-white/20 backdrop-blur-md border-white/20 text-white font-bold px-3 py-1 rounded-full text-[10px]">
                                        {cat.badge}
                                    </Badge>
                                </div>

                                <div className="absolute bottom-8 left-6 right-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                                    <div className="flex items-center gap-2 text-white/80 text-sm font-bold group-hover:text-white transition-colors">
                                        Shop Collection <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Category Products Spotlight */}
                    {selectedCategory && (
                        <div className="mt-16 animate-reveal bg-slate-50 rounded-[40px] p-8 md:p-12 border border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-indigo-500" />
                                    <h3 className="text-2xl font-bold text-slate-900">{selectedCategory} Spotlight</h3>
                                </div>
                                <Link to={`/marketplace?category=${selectedCategory}`} className="text-indigo-600 font-bold text-sm">
                                    View Full Category
                                </Link>
                            </div>

                            {categoryProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {categoryProducts.map(product => (
                                        <div key={product._id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-slate-400 font-medium">No products found in this category yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* --- Featured Products Tabs --- */}

            {/* --- Featured Products Tabs --- */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 rounded-full mb-3 px-4">
                                Our Recommendations
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                                Fresh Trends for You
                            </h2>
                        </div>

                        <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                            {[
                                { id: 'trending', label: 'Trending' },
                                { id: 'new', label: 'New Arrival' },
                                { id: 'bestsellers', label: 'Bestseller' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 animate-reveal">
                        {(activeTab === 'trending' ? trendingProducts :
                            activeTab === 'new' ? newArrivalProducts : bestSellers).map((product) => (
                                <div key={product._id} className="card-hover">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link to="/marketplace">
                            <Button variant="outline" className="border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 rounded-2xl h-14 px-12 text-base font-bold transition-all">
                                Explore Full Marketplace
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- AI Personalization Section --- */}
            {recommendations && recommendations.length > 0 && (
                <section className="py-24 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-900 z-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.2),transparent_70%)] opacity-50"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.8),rgba(15,23,42,1))]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    <span className="text-indigo-400 font-bold uppercase tracking-wider text-xs">AI-Powered Experience</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-extrabold text-white">Suggested for You</h2>
                            </div>
                            <Button className="btn-glass px-6 rounded-xl hidden md:flex">
                                Recalculate Likes
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recommendations.slice(0, 4).map(product => (
                                <div key={product._id} className="group relative overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:bg-white/10 transition-all duration-500">
                                    <Link to={`/product/${product._id}`}>
                                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                                            <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-indigo-600/90 text-[10px] font-bold">MATCH 98%</Badge>
                                            </div>
                                        </div>
                                        <h4 className="text-white font-bold mb-1 line-clamp-1">{product.title}</h4>
                                        <p className="text-indigo-300 font-black text-lg">₹{product.price}</p>
                                    </Link>
                                    <button
                                        onClick={() => handleQuickPurchase(product)}
                                        className="mt-4 w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all active:scale-95 cursor-pointer shadow-lg hover:bg-slate-50"
                                    >
                                        Quick Purchase
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- Features Grid --- */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { icon: Truck, title: "Next-Day Delivery", desc: "Available on orders over ₹1000 across India." },
                            { icon: Shield, title: "Safe Transaction", desc: "Industry-standard encryption for all your payments." },
                            { icon: HeadphonesIcon, title: "Human Support", desc: "No bots here. Real humans ready to help 24/7." },
                            { icon: Award, title: "Curated Brands", desc: "We only partner with brands that share our values." }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left group">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-indigo-200">
                                    <item.icon className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Modern Newsletter --- */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-[40px] premium-gradient p-12 md:p-24 overflow-hidden text-center text-white">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] animate-pulse"></div>
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <Badge className="bg-white/20 text-white border-0 mb-6 rounded-full px-6 py-1">JOIN THE CLUB</Badge>
                            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Get <span className="text-yellow-400 underline decoration-wavy underline-offset-8">25% Off</span> Your First Haul.</h2>
                            <p className="text-lg md:text-xl opacity-80 mb-12">Sign up for our newsletter and join over 50k+ savvy shoppers receiving exclusive weekly drops.</p>

                            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-xl rounded-[28px] border border-white/20">
                                <input
                                    type="email"
                                    placeholder="yourname@email.com"
                                    className="flex-1 px-8 py-5 bg-transparent text-white placeholder-white/50 outline-none font-medium"
                                />
                                <Button className="bg-white text-indigo-600 hover:bg-slate-100 rounded-2xl h-14 px-10 text-base font-black shadow-xl">
                                    Subscribe Now
                                </Button>
                            </div>
                            <p className="mt-6 text-sm opacity-50 font-medium">No spam, just pure vibes. Unsubscribe at any time.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;