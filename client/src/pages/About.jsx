import React from 'react';
import { Users, Target, Rocket, Heart, Sparkles, Shield, Award, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-[#FAFAFB] min-h-screen">
            {/* --- Hero Section --- */}
            <section className="relative pt-20 pb-32 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-pink-50/30 -z-10"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)] -z-10"></div>

                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-8 animate-reveal">
                        <Sparkles className="w-4 h-4" /> Our Story
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] animate-reveal [animation-delay:100ms]">
                        Revolutionizing the way the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">World Shops Together.</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-slate-500 font-medium leading-relaxed animate-reveal [animation-delay:200ms]">
                        SocialMart is more than just a marketplace. We're a social commerce ecosystem where discovery meets community, and every purchase tells a story.
                    </p>
                </div>
            </section>

            {/* --- Vision & Mission (Bento Style) --- */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Vision Card */}
                        <div className="lg:col-span-7 group relative overflow-hidden rounded-[40px] bg-slate-900 p-12 text-white">
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                                <Target className="w-64 h-64 rotate-12" />
                            </div>
                            <Badge className="bg-white/20 text-white border-0 mb-6 rounded-full px-4">THE VISION</Badge>
                            <h2 className="text-4xl font-black mb-6">Building a Borderless <br /> Shopping Community.</h2>
                            <p className="text-slate-300 text-lg leading-relaxed max-w-lg font-medium">
                                We envision a future where shopping is as social as sharing a photo. A world where you don't just buy products, you discover them through the eyes of people you trust.
                            </p>
                        </div>

                        {/* Stats Card */}
                        <div className="lg:col-span-5 rounded-[40px] premium-gradient p-12 text-white flex flex-col justify-between">
                            <div>
                                <Badge className="bg-white/20 text-white border-0 mb-8 rounded-full px-4">OUR IMPACT</Badge>
                                <div className="space-y-8">
                                    <div>
                                        <div className="text-5xl font-black mb-1">50K+</div>
                                        <div className="text-indigo-100 font-bold uppercase tracking-wider text-xs">Active Shoppers</div>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-black mb-1">12K+</div>
                                        <div className="text-indigo-100 font-bold uppercase tracking-wider text-xs">Verified Sellers</div>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-black mb-1">99%</div>
                                        <div className="text-indigo-100 font-bold uppercase tracking-wider text-xs">Customer Satisfaction</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="lg:col-span-12 rounded-[40px] bg-white border border-slate-100 p-12 shadow-sm flex flex-col md:flex-row items-center gap-12 group hover:shadow-xl transition-all duration-500">
                            <div className="w-24 h-24 rounded-3xl bg-pink-50 flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                                <Rocket className="w-12 h-12 text-pink-600" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4">Our Daily Mission</h3>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                    To empower creators and small businesses by providing them with the tools to reach a global audience, while giving shoppers a delightful, personalized, and interactive experience that traditional e-commerce lacks.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Core Values Grid --- */}
            <section className="py-24 px-4 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">The Values We Live By</h2>
                        <p className="text-slate-500 font-medium">Integrity, innovation, and community at our core.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Heart, title: "People First", desc: "Every decision we make starts with the impact on our community and our team." },
                            { icon: Shield, title: "Trust & Safety", desc: "We provide a secure environment for every transaction and interaction." },
                            { icon: Globe, title: "Inclusivity", desc: "A marketplace built for everyone, from any corner of the world." },
                            { icon: Award, title: "Excellence", desc: "We strive for perfection in our tech, our service, and our partnerships." }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 rounded-[32px] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-500">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-500">
                                    <item.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Join the Journey --- */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-[50px] bg-slate-900 overflow-hidden py-24 px-8 text-center text-white">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80')] bg-cover bg-center"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to join the <br /> commerce revolution?</h2>
                            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium">
                                Start your journey with SocialMart today and discover a better way to shop and sell.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link to="/marketplace">
                                    <Button size="lg" className="bg-white text-slate-900 hover:bg-indigo-50 rounded-2xl px-12 h-16 font-black text-lg transition-all shadow-2xl">
                                        Explore Items
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="lg" className="bg-transparent border-2 border-white/20 hover:bg-white/10 text-white rounded-2xl px-12 h-16 font-black text-lg transition-all">
                                        Join Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
