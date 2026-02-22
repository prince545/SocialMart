import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

// Subcategory definitions per category
const SUBCATEGORY_MAP = {
    "Women's Clothing": [
        'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Co-ord Sets',
        'Workwear', 'Activewear', 'Party Wear', 'Sleepwear & Loungewear',
        'Ethnic & Fusion', 'Lingerie & Intimates', 'Maternity', 'Swim & Beachwear',
    ],
    "Men's Clothing": [
        'Tops', 'Bottoms', 'Outerwear', 'Ethnic Wear',
        'Innerwear & Loungewear', 'Activewear',
    ],
    'Electronics': [
        'Personal Computing', 'Mobile & Communication', 'Personal Audio',
        'Home Audio', 'Visual', 'Cameras & Photography', 'Gaming',
        'Kitchen Appliances', 'Utility Appliances', 'Smart Home & Security',
    ],
};

// Accent colours per category
const CAT_ACCENT = {
    "Women's Clothing": { active: 'bg-pink-600 text-white border-pink-600', hover: 'hover:border-pink-400 hover:text-pink-600', activeSide: 'text-pink-600 font-semibold bg-pink-50', badge: 'bg-pink-50 text-pink-700 border-pink-100', badgeX: 'text-pink-400 hover:text-pink-700' },
    "Men's Clothing": { active: 'bg-blue-600 text-white border-blue-600', hover: 'hover:border-blue-400 hover:text-blue-600', activeSide: 'text-blue-600 font-semibold bg-blue-50', badge: 'bg-blue-50 text-blue-700 border-blue-100', badgeX: 'text-blue-400 hover:text-blue-700' },
    'Electronics': { active: 'bg-violet-600 text-white border-violet-600', hover: 'hover:border-violet-400 hover:text-violet-600', activeSide: 'text-violet-600 font-semibold bg-violet-50', badge: 'bg-violet-50 text-violet-700 border-violet-100', badgeX: 'text-violet-400 hover:text-violet-700' },
};

const DEFAULT_ACCENT = {
    active: 'bg-indigo-600 text-white border-indigo-600',
    hover: 'hover:border-indigo-400 hover:text-indigo-600',
    activeSide: 'text-indigo-600 font-semibold bg-indigo-50',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    badgeX: 'text-indigo-400 hover:text-indigo-700',
};

const Marketplace = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.products);
    const [searchParams] = useSearchParams();

    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState(() => searchParams.get('category') || '');
    const [subcategory, setSubcategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    // Reset subcategory when category changes
    useEffect(() => {
        setSubcategory('');
    }, [category]);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(getProducts({ keyword, category, subcategory, minPrice: priceRange.min, maxPrice: priceRange.max }));
        }, 400);
        return () => clearTimeout(timer);
    }, [dispatch, keyword, category, subcategory, priceRange]);

    const categories = ["Men's Clothing", "Women's Clothing", 'Electronics', 'Books', 'Home', 'Beauty', 'Sports'];

    const handleClearFilters = () => {
        setKeyword('');
        setCategory('');
        setSubcategory('');
        setPriceRange({ min: '', max: '' });
    };

    const subs = SUBCATEGORY_MAP[category] || [];
    const accent = CAT_ACCENT[category] || DEFAULT_ACCENT;
    const subLabel = category === 'Electronics' ? 'Shop By Type' : 'Shop By Type';

    const FilterSidebar = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-1.5">
                    <button
                        onClick={() => setCategory('')}
                        className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${category === '' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${category === cat ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Subcategory filter — shown when a category with subcategories is active */}
            {subs.length > 0 && (
                <>
                    <Separator />
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{subLabel}</h3>
                        <div className="space-y-1.5">
                            <button
                                onClick={() => setSubcategory('')}
                                className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${subcategory === '' ? accent.activeSide : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                All Types
                            </button>
                            {subs.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => setSubcategory(sub)}
                                    className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${subcategory === sub ? accent.activeSide : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <Separator />

            <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Min" className="bg-white" value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} />
                    <span className="text-gray-400">–</span>
                    <Input type="number" placeholder="Max" className="bg-white" value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} />
                </div>
            </div>

            <Separator />

            <Button variant="outline" className="w-full" onClick={handleClearFilters}>
                Clear All Filters
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-56 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Filters</h2>
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Top Bar */}
                        <div className="flex items-center gap-3 mb-4">
                            {/* Mobile Filter Sheet */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="lg:hidden flex-shrink-0">
                                        <SlidersHorizontal size={18} />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-72">
                                    <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                                    <div className="mt-6"><FilterSidebar /></div>
                                </SheetContent>
                            </Sheet>

                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    className="pl-10 bg-white shadow-sm border-gray-200"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>

                            {/* Active filter badges */}
                            {category && (
                                <Badge variant="secondary" className={`flex-shrink-0 gap-1 border ${accent.badge}`}>
                                    {category}
                                    <button onClick={() => setCategory('')} className={`ml-1 ${accent.badgeX}`}><X size={12} /></button>
                                </Badge>
                            )}
                            {subcategory && (
                                <Badge variant="secondary" className={`flex-shrink-0 gap-1 border ${accent.badge}`}>
                                    {subcategory}
                                    <button onClick={() => setSubcategory('')} className={`ml-1 ${accent.badgeX}`}><X size={12} /></button>
                                </Badge>
                            )}
                        </div>

                        {/* Subcategory pill-row — shown when a category has subcategories */}
                        {subs.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                <button
                                    onClick={() => setSubcategory('')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${subcategory === '' ? accent.active : `bg-white text-gray-600 border-gray-200 ${accent.hover}`}`}
                                >
                                    All
                                </button>
                                {subs.map(sub => (
                                    <button
                                        key={sub}
                                        onClick={() => setSubcategory(sub)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${subcategory === sub ? accent.active : `bg-white text-gray-600 border-gray-200 ${accent.hover}`}`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        )}

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
                                <Button variant="outline" className="mt-4" onClick={handleClearFilters}>Clear Filters</Button>
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
