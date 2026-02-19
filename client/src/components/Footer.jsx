import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">SocialMart</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Your one-stop destination for social commerce. Connect, share, and shop in a vibrant community.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Shop</h4>
                        <ul className="space-y-3">
                            <li><Link to="/marketplace" className="text-gray-500 hover:text-indigo-600 text-sm">Marketplace</Link></li>
                            <li><Link to="/feed" className="text-gray-500 hover:text-indigo-600 text-sm">Latest Feed</Link></li>
                            <li><Link to="/cart" className="text-gray-500 hover:text-indigo-600 text-sm">My Cart</Link></li>
                            <li><Link to="/dashboard" className="text-gray-500 hover:text-indigo-600 text-sm">My Account</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Help Center</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start text-gray-500 text-sm">
                                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400" />
                                <span>123 Commerce St, Tech City, TC 90210</span>
                            </li>
                            <li className="flex items-center text-gray-500 text-sm">
                                <Phone className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center text-gray-500 text-sm">
                                <Mail className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400" />
                                <span>support@socialmart.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} SocialMart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
