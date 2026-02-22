import React from 'react';
import { Link } from 'react-router-dom';
import {
    Heart, Users, Zap, Shield, Star, MessageCircle,
    ShoppingBag, Award, ArrowRight, Sparkles,
    Globe, Coffee, Rocket, Instagram, Twitter, Linkedin, Github,
    Mail, MapPin, Phone, Quote, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
    const stats = [
        { icon: Users, value: '48,000+', label: 'Active Buyers', color: 'blue' },
        { icon: ShoppingBag, value: '3,200+', label: 'Verified Sellers', color: 'green' },
        { icon: Award, value: '120,000+', label: 'Products Listed', color: 'purple' },
        { icon: Star, value: '4.9/5', label: 'Satisfaction Rate', color: 'yellow' },
        { icon: Zap, value: '99%', label: 'On-Time Delivery', color: 'orange' },
        { icon: Heart, value: '50K+', label: 'Daily Active', color: 'pink' },
    ];

    const values = [
        {
            icon: Users,
            title: 'Community First',
            description: 'Every feature we build asks: does this bring people closer together, or does it just extract value from them?',
            color: 'indigo',
        },
        {
            icon: Eye,
            title: 'Radical Transparency',
            description: 'Sellers show their faces. Buyers leave real reviews. No dark patterns, no hidden fees.',
            color: 'green',
        },
        {
            icon: Award,
            title: 'Creator Economics',
            description: 'Sellers keep the majority of what they earn. We take a small platform fee — just enough to keep the lights on.',
            color: 'purple',
        },
        {
            icon: Shield,
            title: 'Safety by Design',
            description: 'AI moderation, verified seller badges, and buyer protection on every order. Trust is the product.',
            color: 'red',
        },
    ];

    const offices = [
        {
            city: 'San Francisco',
            address: '548 Market St, San Francisco, CA 94104',
            icon: '🌉',
        },
        {
            city: 'New York',
            address: '20 W 34th St, New York, NY 10001',
            icon: '🗽',
        },
        {
            city: 'London',
            address: '123 Oxford St, London W1D 2HX',
            icon: '🇬🇧',
        },
        {
            city: 'Bangalore',
            address: 'MG Road, Bangalore, 560001',
            icon: '🇮🇳',
        }
    ];

    const perks = [
        { icon: Globe, text: 'Remote-first culture' },
        { icon: Coffee, text: 'Home office stipend' },
        { icon: Rocket, text: '4-day work week' },
        { icon: Heart, text: 'Wellness allowance' },
        { icon: Users, text: 'Offsite twice a year' },
        { icon: Award, text: 'Equity for all' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-24">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3Eg%3Cg fill='none' fill-rule='evenodd'%3Eg%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]`}></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl shadow-[0_0_50px_rgba(168,85,247,0.2)]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Badge className="inline-flex mb-6 bg-white/20 text-white border-0 px-4 py-2 text-sm">
                        <Heart className="w-4 h-4 mr-2" />
                        Built for community, powered by people
                    </Badge>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        We didn't build another<br />
                        <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                            marketplace.
                        </span>
                        <br />
                        We built a community that happens to sell things.
                    </h1>

                    <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
                        SocialMart is where social media meets commerce — a place where you follow creators,
                        buy from your feed, and actually talk to the people behind the products.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/marketplace">
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-base font-semibold shadow-xl">
                                Start Shopping
                                <ShoppingBag className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-base font-semibold">
                                Start Selling
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-0 px-4 py-1.5">
                                Our Story
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Born from a simple frustration
                            </h2>
                            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    The best products we ever found didn't come from a search bar. They came from a friend's post,
                                    a creator we followed, a seller who actually cared about what they made.
                                </p>
                                <p>
                                    So we asked: <span className="font-semibold text-indigo-600">what if shopping felt like scrolling your feed?</span>
                                    What if you could follow the people behind the products, buy directly from a post,
                                    and actually have a conversation with your seller before you checkout?
                                </p>
                                <p>
                                    That question became SocialMart — a platform where social media and e-commerce aren't two separate tabs,
                                    they're one seamless experience.
                                </p>
                            </div>

                            {/* Vision Quote */}
                            <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <Quote className="w-8 h-8 text-indigo-400 mb-3" />
                                <p className="text-lg italic text-gray-700 mb-4">
                                    "We're building the platform that should have always existed — one that treats creators as partners
                                    and buyers as community members."
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl overflow-hidden shadow-sm">
                                    <img
                                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                                        alt="Collaboration"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl overflow-hidden shadow-sm">
                                    <img
                                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80"
                                        alt="Focus"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 mt-8">
                                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl overflow-hidden shadow-sm">
                                    <img
                                        src="https://images.unsplash.com/photo-1552581234-26160f608093?w=600&q=80"
                                        alt="Growth"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="aspect-square bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl overflow-hidden shadow-sm">
                                    <img
                                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80"
                                        alt="Community"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Our Mission
                    </h2>
                    <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
                        To connect people with products through the power of community —
                        making discovery personal, shopping social, and selling human.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            By the Numbers
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            A community that's growing faster than we ever imagined
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={index} className="text-center p-6 border-gray-200 hover:shadow-md transition-shadow">
                                    <CardContent className="p-0">
                                        <div className={`w-12 h-12 mx-auto bg-${stat.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                                            <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Values
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            The principles that guide every decision we make
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <Card key={index} className="p-8 border-gray-200 hover:shadow-lg transition-all bg-white">
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-14 h-14 bg-${value.color}-100 rounded-xl flex items-center justify-center`}>
                                                <Icon className={`w-7 h-7 text-${value.color}-600`} />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Global Presence */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            A Global Perspective
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Headquartered in the cloud, distributed across the planet to serve a diverse community.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {offices.map((office, index) => (
                            <Card key={index} className="p-6 border-gray-200 hover:shadow-md transition-all">
                                <CardContent className="p-0">
                                    <div className="text-4xl mb-3">{office.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{office.city}</h3>
                                    <p className="text-gray-600 text-sm">{office.address}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Join 48,000+ people already shopping differently
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                        SocialMart is for everyone who believes the best things are made by humans
                        and shared through community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Link to="/register">
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-base font-semibold shadow-xl">
                                Get Started — It's Free
                                <Sparkles className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link to="/marketplace">
                            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-base font-semibold">
                                Browse Marketplace
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
