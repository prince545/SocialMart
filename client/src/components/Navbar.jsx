import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Menu, ShoppingCart, Search, Store, Home, LayoutDashboard,
    MessageCircle, Package, X, TrendingUp, Heart, Sparkles
} from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { useSelector, useDispatch } from 'react-redux';
import { getWishlist } from '../redux/wishlistSlice';
import { Button } from '@/components/ui/button';
import {
    Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';

const Navbar = () => {
    const { user: clerkUser, isSignedIn } = useUser();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const cartCount = useSelector(s => s.cart?.cartItems?.length || 0);
    const wishlistCount = useSelector(s => s.wishlist?.items?.length || 0);

    useEffect(() => {
        if (isSignedIn) {
            dispatch(getWishlist());
        }
    }, [dispatch, isSignedIn]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        setSearchOpen(false);
        setIsOpen(false);
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Marketplace', path: '/marketplace', icon: Store },
        { name: 'Feed', path: '/feed', icon: TrendingUp },
        { name: 'About', path: '/about', icon: Sparkles },
        { name: 'Chat', path: '/chat', icon: MessageCircle },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            `}</style>

            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-600 flex items-center justify-center shadow-md">
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                                SocialMart
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
                            {navLinks.map(link => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.path)
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-2">

                            {/* Desktop Search */}
                            <div ref={searchRef} className="hidden md:block relative">
                                <form onSubmit={handleSearch} className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </form>
                            </div>

                            {/* Mobile Search Toggle */}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="Search"
                            >
                                {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                            </button>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="Cart"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Wishlist */}
                            <SignedIn>
                                <Link
                                    to="/wishlist"
                                    className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                    aria-label="Wishlist"
                                >
                                    <Heart className="w-5 h-5" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute top-0 right-0 w-5 h-5 bg-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {wishlistCount > 9 ? '9+' : wishlistCount}
                                        </span>
                                    )}
                                </Link>
                            </SignedIn>

                            {/* User Menu */}
                            <SignedIn>
                                <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">
                                            {clerkUser?.firstName || 'User'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {clerkUser?.primaryEmailAddress?.emailAddress?.split('@')[0]}
                                        </div>
                                    </div>
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            </SignedIn>

                            <SignedOut>
                                <div className="hidden md:flex items-center gap-2">
                                    <SignInButton mode="modal">
                                        <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                                            Sign In
                                        </Button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                            Get Started
                                        </Button>
                                    </SignUpButton>
                                </div>
                            </SignedOut>

                            {/* Mobile Menu */}
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                        <Menu className="w-5 h-5" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80">
                                    <SheetHeader>
                                        <SheetTitle className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-600 flex items-center justify-center">
                                                <Store className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-lg font-bold">SocialMart</span>
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-1">
                                        {navLinks.map(link => (
                                            <Link
                                                key={link.name}
                                                to={link.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(link.path)
                                                    ? 'bg-indigo-50 text-indigo-700'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <link.icon className="w-5 h-5" />
                                                {link.name}
                                            </Link>
                                        ))}
                                        <Link
                                            to="/cart"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            Cart
                                            {cartCount > 0 && (
                                                <span className="ml-auto bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                        <SignedIn>
                                            <Link
                                                to="/wishlist"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Heart className="w-5 h-5" />
                                                Wishlist
                                                {wishlistCount > 0 && (
                                                    <span className="ml-auto bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                        {wishlistCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <Link
                                                to="/orders"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Package className="w-5 h-5" />
                                                Orders
                                            </Link>
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <LayoutDashboard className="w-5 h-5" />
                                                Dashboard
                                            </Link>
                                        </SignedIn>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <SignedOut>
                                            <div className="space-y-2">
                                                <SignInButton mode="modal">
                                                    <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                                                        Sign In
                                                    </Button>
                                                </SignInButton>
                                                <SignUpButton mode="modal">
                                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsOpen(false)}>
                                                        Get Started
                                                    </Button>
                                                </SignUpButton>
                                            </div>
                                        </SignedOut>
                                        <SignedIn>
                                            <div className="flex items-center gap-3 px-4 py-3">
                                                <UserButton afterSignOutUrl="/" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {clerkUser?.fullName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {clerkUser?.primaryEmailAddress?.emailAddress}
                                                    </div>
                                                </div>
                                            </div>
                                        </SignedIn>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {searchOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white p-4">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                autoFocus
                            />
                        </form>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
