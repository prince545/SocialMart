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

    const features = [
        { icon: Users, title: 'Community Driven', description: 'Connect with like-minded shoppers and sellers. Share your finds and get inspired.' },
        { icon: Zap, title: 'Instant Checkout', description: 'Buy products directly from your feed with our secure one-click checkout system.' },
        { icon: Star, title: 'Curated Selection', description: 'Discover high-quality unique items hand-picked by our top creators and community.' },
    ];

    const categories = [
        { name: "Men's Fashion", category: "Men's Clothing", color: "from-blue-700/80 to-cyan-500/70", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80" },
        { name: "Women's Fashion", category: "Women's Clothing", color: "from-pink-600/80 to-rose-400/70", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" },
        { name: "Electronics", category: "Electronics", color: "from-violet-700/80 to-indigo-500/70", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80" },
        { name: "Beauty", category: "Beauty", color: "from-amber-600/80 to-orange-400/70", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80" },
    ];

    return (
        <div className="bg-background">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
                <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/5 to-transparent" />
                <div className="container-main relative section-padding">
                    <div className="mx-auto max-w-2xl lg:max-w-3xl">
                        <Badge className="mb-6 inline-flex items-center gap-2 rounded-full border-0 bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                            <Clock className="h-4 w-4" />
                            Limited Time Offer
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-tight">
                            Discover unique products &{' '}
                            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                connect with sellers
                            </span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
                            SocialMart is the new way to shop. Browse curated collections, follow your favorite creators, and buy directly from your feed.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            {[
                                { value: timeLeft.hours, label: 'HRS' },
                                { value: timeLeft.minutes, label: 'MIN' },
                                { value: timeLeft.seconds, label: 'SEC' },
                            ].map((item, i) => (
                                <React.Fragment key={item.label}>
                                    <div className="text-center">
                                        <div className="min-w-[64px] rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
                                            <span className="text-2xl font-bold tabular-nums">{formatTime(item.value)}</span>
                                        </div>
                                        <span className="mt-1 block text-xs font-medium text-white/80">{item.label}</span>
                                    </div>
                                    {i < 2 && <span className="flex items-end pb-2 text-2xl font-bold text-white/60">:</span>}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <Button asChild size="lg" className="rounded-full bg-white text-primary shadow-lg hover:bg-white/95 hover:shadow-xl">
                                <Link to="/marketplace" className="inline-flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5" />
                                    Shop Now
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="secondary" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                                <Link to="/register" className="inline-flex items-center gap-2">
                                    Get Started
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section-padding bg-muted/30">
                <div className="container-main">
                    <div className="mx-auto max-w-2xl text-center">
                        <Badge variant="secondary" className="mb-4 rounded-full border-border bg-primary/10 text-primary">
                            Why Choose Us
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            A better way to shop online
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            We combine the best of social media and e-commerce for a seamless shopping experience.
                        </p>
                    </div>
                    <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                                <CardHeader className="pb-2">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section-padding bg-background">
                <div className="container-main">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Shop by category</h2>
                            <p className="mt-1 text-muted-foreground">Explore our most popular collections.</p>
                        </div>
                        <Button asChild variant="link" className="hidden shrink-0 p-0 text-primary hover:opacity-90 sm:inline-flex">
                            <Link to="/marketplace" className="inline-flex items-center gap-1">
                                View all <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.map((cat) => (
                            <Link
                                to={`/marketplace?category=${encodeURIComponent(cat.category)}`}
                                key={cat.name}
                                className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color}`} />
                                <div className="absolute inset-0 flex flex-col justify-end p-5">
                                    <div className="rounded-xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm transition-colors group-hover:bg-white/25">
                                        <h3 className="text-lg font-bold text-white drop-shadow">{cat.name}</h3>
                                        <span className="mt-1 inline-flex items-center text-sm font-medium text-white/90">
                                            Shop collection <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8 text-center sm:hidden">
                        <Button asChild variant="link" className="text-primary font-medium">
                            <Link to="/marketplace">View all categories</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary py-16 text-primary-foreground lg:py-20">
                <div className="container-main flex flex-col items-center justify-between gap-8 lg:flex-row lg:gap-12">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                            <span className="block">Ready to get started?</span>
                            <span className="block text-white/80">Join SocialMart today.</span>
                        </h2>
                    </div>
                    <div className="flex shrink-0 flex-wrap justify-center gap-4">
                        <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/95">
                            <Link to="/register">Get started</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 text-white hover:bg-white/10">
                            <Link to="/feed">View feed</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
