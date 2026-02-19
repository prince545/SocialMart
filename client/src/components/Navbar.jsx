import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, Store, Home, LayoutDashboard, MessageCircle, Package } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';

const Navbar = () => {
    const { user: clerkUser } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Marketplace', path: '/marketplace', icon: Store },
        { name: 'Feed', path: '/feed', icon: LayoutDashboard },
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Desktop Nav */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-gray-900 tracking-tight">SocialMart</span>
                        </Link>

                        <div className="hidden md:ml-8 md:flex md:space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        </div>

                        <Link to="/cart" className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </Link>

                        <SignedIn>
                            <div className="flex items-center gap-4">
                                <Link to="/chat" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors" title="Messages">
                                    <MessageCircle className="w-6 h-6" />
                                </Link>
                                <Link to="/orders" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors" title="My Orders">
                                    <Package className="w-6 h-6" />
                                </Link>
                                <Link to="/dashboard" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors" title="Dashboard">
                                    <LayoutDashboard className="w-6 h-6" />
                                </Link>
                                <div className="flex items-center gap-2 border-l pl-4 ml-2 border-gray-200">
                                    <span className="text-sm font-medium text-gray-700 hidden lg:block">Hi, {clerkUser?.firstName || 'User'}</span>
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <div className="flex items-center gap-2">
                                <SignInButton mode="modal">
                                    <button className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-2 cursor-pointer">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer">
                                        Get Started
                                    </button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} border-t border-gray-200`}>
                <div className="pt-2 pb-3 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive(link.path)
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="flex items-center gap-3">
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </div>
                        </Link>
                    ))}
                    <Link
                        to="/cart"
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-5 h-5" />
                            Cart
                        </div>
                    </Link>
                </div>

                <div className="pt-4 pb-4 border-t border-gray-200 px-4">
                    <SignedOut>
                        <div className="space-y-2">
                            <SignInButton mode="modal">
                                <button className="block w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer" onClick={() => setIsOpen(false)}>
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="block w-full text-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer" onClick={() => setIsOpen(false)}>
                                    Get Started
                                </button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div className="space-y-2">
                            <Link to="/dashboard" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md" onClick={() => setIsOpen(false)}>
                                Dashboard
                            </Link>
                            <div className="flex items-center gap-3 mb-3">
                                <UserButton afterSignOutUrl="/" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">{clerkUser?.fullName}</span>
                                    <span className="text-xs text-gray-500">{clerkUser?.primaryEmailAddress?.emailAddress}</span>
                                </div>
                            </div>
                        </div>
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
