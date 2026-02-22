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
import { cn } from '@/lib/utils';

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
            className={cn(
                'inline-flex items-center gap-2 px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200',
                isActive(link.path)
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
            )}
        >
            {link.name}
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <div className="container-main">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 shrink-0">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                                <Store className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-semibold tracking-tight text-foreground">SocialMart</span>
                        </Link>
                        <div className="hidden md:flex md:gap-1">
                            {navLinks.map((link) => (
                                <NavLink key={link.name} link={link} />
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex md:items-center md:gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                className="h-9 w-64 rounded-full border-border bg-muted/50 pl-9 text-sm focus:bg-card transition-colors"
                            />
                        </div>
                        <Link
                            to="/cart"
                            className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            aria-label="Cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
                        </Link>
                        <SignedIn>
                            <div className="ml-2 flex items-center gap-1 border-l border-border pl-3">
                                <Link to="/chat" className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" title="Messages">
                                    <MessageCircle className="h-5 w-5" />
                                </Link>
                                <Link to="/orders" className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" title="My Orders">
                                    <Package className="h-5 w-5" />
                                </Link>
                                <Link to="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" title="Dashboard">
                                    <LayoutDashboard className="h-5 w-5" />
                                </Link>
                                <div className="flex items-center gap-2 pl-1">
                                    <span className="hidden text-sm font-medium text-muted-foreground lg:block">Hi, {clerkUser?.firstName || 'User'}</span>
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <div className="ml-2 flex items-center gap-2">
                                <SignInButton mode="modal">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                        Sign In
                                    </Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:opacity-90 shadow-sm">
                                        Get Started
                                    </Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>

                    <div className="flex items-center md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72 p-0">
                                <SheetHeader className="border-b border-border px-4 py-4">
                                    <SheetTitle className="flex items-center gap-2 text-left">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                            <Store className="h-4 w-4" />
                                        </div>
                                        SocialMart
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="space-y-1 px-4 py-3">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                                isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                            )}
                                        >
                                            <link.icon className="h-4 w-4 shrink-0" />
                                            {link.name}
                                        </Link>
                                    ))}
                                    <Link
                                        to="/cart"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                    >
                                        <ShoppingCart className="h-4 w-4 shrink-0" />
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
                                                <Button className="w-full bg-primary text-primary-foreground hover:opacity-90" onClick={() => setIsOpen(false)}>
                                                    Get Started
                                                </Button>
                                            </SignUpButton>
                                        </div>
                                    </SignedOut>
                                    <SignedIn>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 rounded-lg p-2">
                                                <UserButton afterSignOutUrl="/" />
                                                <div className="min-w-0 flex flex-col">
                                                    <span className="truncate text-sm font-semibold text-foreground">{clerkUser?.fullName}</span>
                                                    <span className="truncate text-xs text-muted-foreground">{clerkUser?.primaryEmailAddress?.emailAddress}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Link to="/chat" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><MessageCircle className="h-4 w-4" />Chat</Link>
                                                <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><Package className="h-4 w-4" />Orders</Link>
                                                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
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
