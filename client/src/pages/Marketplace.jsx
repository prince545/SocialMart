import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';

const Marketplace = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.products);

    // Filter State
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Debounce search/filter dispatch
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(getProducts({
                keyword,
                category,
                minPrice: priceRange.min,
                maxPrice: priceRange.max
            }));
        }, 500);

        return () => clearTimeout(timer);
    }, [dispatch, keyword, category, priceRange]);

    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Beauty', 'Sports'];

    const handleClearFilters = () => {
        setKeyword('');
        setCategory('');
        setPriceRange({ min: '', max: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Desktop & Mobile Drawer */}
                    <div className={`
                        fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300
                        ${showMobileFilters ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
                    `} onClick={() => setShowMobileFilters(false)} />

                    <aside className={`
                        fixed top-0 left-0 h-full w-80 bg-white p-6 shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto lg:w-64 lg:shadow-none lg:bg-transparent lg:p-0
                        ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <div className="flex items-center justify-between mb-6 lg:hidden">
                            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                            <button onClick={() => setShowMobileFilters(false)} className="text-gray-500 hover:text-gray-700">×</button>
                        </div>

                        <div className="space-y-8">
                            {/* Search (Mobile/Sidebar only if needed, can keep main search on top) */}

                            {/* Categories */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Categories</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setCategory('')}
                                        className={`block w-full text-left text-sm ${category === '' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className={`block w-full text-left text-sm ${category === cat ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Price Range</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={handleClearFilters}
                                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Top Bar: Search & Mobile Filter Toggle */}
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <SlidersHorizontal size={20} />
                            </button>

                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <Search className="mx-auto h-12 w-12 text-gray-300" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                                <p className="mt-1 text-gray-500">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
export default Marketplace;
