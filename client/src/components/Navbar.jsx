import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingCart, Search, Store, Home, LayoutDashboard, MessageCircle, Package } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

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

    const NavLink = ({ link }) => (
        <Link
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                ? 'border-indigo-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
        >
            {link.name}
        </Link>
    );

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

                        <div className="hidden md:ml-8 md:flex md:space-x-6">
                            {navLinks.map((link) => <NavLink key={link.name} link={link} />)}
                        </div>
                    </div>

                    {/* Right Side - Desktop */}
                    <div className="hidden md:flex items-center space-x-3">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search products..."
                                className="w-64 pl-10 pr-4 bg-gray-50 border-gray-200 rounded-full text-sm focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>

                        <Link to="/cart" className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </Link>

                        <SignedIn>
                            <div className="flex items-center gap-1">
                                <Link to="/chat" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors" title="Messages">
                                    <MessageCircle className="w-5 h-5" />
                                </Link>
                                <Link to="/orders" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors" title="My Orders">
                                    <Package className="w-5 h-5" />
                                </Link>
                                <Link to="/dashboard" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors" title="Dashboard">
                                    <LayoutDashboard className="w-5 h-5" />
                                </Link>
                                <div className="flex items-center gap-2 border-l pl-3 ml-1 border-gray-200">
                                    <span className="text-sm font-medium text-gray-700 hidden lg:block">Hi, {clerkUser?.firstName || 'User'}</span>
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <div className="flex items-center gap-2">
                                <SignInButton mode="modal">
                                    <Button variant="ghost" size="sm" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                                        Sign In
                                    </Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                                        Get Started
                                    </Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>

                    {/* Mobile: Sheet drawer */}
                    <div className="flex items-center md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-500">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72 p-0">
                                <SheetHeader className="px-4 py-4 border-b border-gray-100">
                                    <SheetTitle className="flex items-center gap-2 text-left">
                                        <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                                            <Store className="w-4 h-4 text-white" />
                                        </div>
                                        SocialMart
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="px-4 py-3 space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <link.icon className="w-4 h-4" />
                                            {link.name}
                                        </Link>
                                    ))}
                                    <Link
                                        to="/cart"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Cart
                                    </Link>
                                </div>

                                <Separator />

                                <div className="px-4 py-4">
                                    <SignedOut>
                                        <div className="space-y-2">
                                            <SignInButton mode="modal">
                                                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                                                    Sign In
                                                </Button>
                                            </SignInButton>
                                            <SignUpButton mode="modal">
                                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setIsOpen(false)}>
                                                    Get Started
                                                </Button>
                                            </SignUpButton>
                                        </div>
                                    </SignedOut>
                                    <SignedIn>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 p-2">
                                                <UserButton afterSignOutUrl="/" />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-semibold text-gray-900 truncate">{clerkUser?.fullName}</span>
                                                    <span className="text-xs text-gray-500 truncate">{clerkUser?.primaryEmailAddress?.emailAddress}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 pt-2">
                                                <Link to="/chat" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"><MessageCircle className="w-4 h-4" />Chat</Link>
                                                <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"><Package className="w-4 h-4" />Orders</Link>
                                                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"><LayoutDashboard className="w-4 h-4" />Dashboard</Link>
                                            </div>
                                        </div>
                                    </SignedIn>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
