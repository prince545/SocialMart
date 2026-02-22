import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Grid3x3, List, Sparkles, Loader } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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

const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left"
            >
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{title}</h3>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {isOpen && (
                <div className="pb-4">
                    {children}
                </div>
            )}
        </div>
    );
};

const Marketplace = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.products);
    const [searchParams] = useSearchParams();

    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState(() => searchParams.get('category') || '');
    const [subcategory, setSubcategory] = useState('');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isSmartSearch, setIsSmartSearch] = useState(false);
    const [isAiSearching, setIsAiSearching] = useState(false);

    useEffect(() => {
        setSubcategory('');
    }, [category]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = {
                keyword,
                category,
                subcategory,
                minPrice: priceRange.min,
                maxPrice: priceRange.max,
            };
            if (brand) params.brand = brand;
            if (size) params.size = size;
            if (color) params.color = color;
            if (sortBy) params.sort = sortBy;
            dispatch(getProducts(params));
        }, 400);
        return () => clearTimeout(timer);
    }, [dispatch, keyword, category, subcategory, brand, size, color, sortBy, priceRange]);

    const handleSmartSearch = async () => {
        if (!keyword.trim()) return;
        setIsAiSearching(true);
        try {
            const { data } = await axios.post('/api/ai/search-intent', { query: keyword });
            // Update filters based on AI intent
            if (data.keyword) setKeyword(data.keyword);
            if (data.category) setCategory(data.category);
            if (data.brand) setBrand(data.brand);
            if (data.minPrice) setPriceRange(prev => ({ ...prev, min: data.minPrice }));
            if (data.maxPrice) setPriceRange(prev => ({ ...prev, max: data.maxPrice }));
            if (data.sort) setSortBy(data.sort);
            if (data.color) setColor(data.color);

            setIsSmartSearch(false); // Turn off after use
        } catch (err) {
            console.error("Smart Search Failed:", err);
        } finally {
            setIsAiSearching(false);
        }
    };

    const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
    const uniqueSizes = [...new Set(products.flatMap(p => p.sizes || []).filter(Boolean))].sort();
    const uniqueColors = [...new Set(products.flatMap(p => p.colors || []).filter(Boolean))].sort();

    const categories = ["Men's Clothing", "Women's Clothing", 'Electronics', 'Books', 'Home', 'Beauty', 'Sports'];

    const handleClearFilters = () => {
        setKeyword('');
        setCategory('');
        setSubcategory('');
        setBrand('');
        setSize('');
        setColor('');
        setSortBy('');
        setPriceRange({ min: '', max: '' });
    };

    const subs = SUBCATEGORY_MAP[category] || [];
    const accent = CAT_ACCENT[category] || DEFAULT_ACCENT;

    const activeFiltersCount = [category, subcategory, brand, size, color, priceRange.min, priceRange.max].filter(Boolean).length;

    const FilterSidebar = () => (
        <div className="space-y-0">
            <FilterSection title="Category" defaultOpen={true}>
                <div className="space-y-1">
                    <button
                        onClick={() => setCategory('')}
                        className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${category === ''
                            ? 'text-indigo-600 font-semibold bg-indigo-50'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${category === cat
                                ? accent.activeSide
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </FilterSection>

            {subs.length > 0 && (
                <FilterSection title="Type" defaultOpen={true}>
                    <div className="space-y-1">
                        <button
                            onClick={() => setSubcategory('')}
                            className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${subcategory === ''
                                ? accent.activeSide
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            All Types
                        </button>
                        {subs.map(sub => (
                            <button
                                key={sub}
                                onClick={() => setSubcategory(sub)}
                                className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${subcategory === sub
                                    ? accent.activeSide
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {uniqueBrands.length > 0 && (
                <FilterSection title="Brand" defaultOpen={false}>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                        <button
                            onClick={() => setBrand('')}
                            className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${brand === ''
                                ? accent.activeSide
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            All Brands
                        </button>
                        {uniqueBrands.map(b => (
                            <button
                                key={b}
                                onClick={() => setBrand(b)}
                                className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${brand === b
                                    ? accent.activeSide
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {uniqueSizes.length > 0 && (
                <FilterSection title="Size" defaultOpen={false}>
                    <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map(s => (
                            <button
                                key={s}
                                onClick={() => setSize(size === s ? '' : s)}
                                className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${size === s
                                    ? accent.active
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {uniqueColors.length > 0 && (
                <FilterSection title="Color" defaultOpen={false}>
                    <div className="flex flex-wrap gap-2">
                        {uniqueColors.map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(color === c ? '' : c)}
                                className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${color === c
                                    ? accent.active
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            <FilterSection title="Price" defaultOpen={false}>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Min ₹"
                            className="bg-white text-sm"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        />
                        <span className="text-gray-400 text-sm">-</span>
                        <Input
                            type="number"
                            placeholder="Max ₹"
                            className="bg-white text-sm"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        />
                    </div>
                </div>
            </FilterSection>

            {activeFiltersCount > 0 && (
                <div className="pt-4">
                    <Button
                        variant="outline"
                        className="w-full text-sm"
                        onClick={handleClearFilters}
                    >
                        Clear All Filters
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 pt-6 pb-12 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none"></div>
            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Desktop Sidebar */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                                    {activeFiltersCount > 0 && (
                                        <Badge className="bg-indigo-600 text-white">
                                            {activeFiltersCount}
                                        </Badge>
                                    )}
                                </div>
                                <FilterSidebar />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 min-w-0">
                            {/* Top Bar */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                                <div className="flex flex-col gap-4">
                                    {/* Search and Sort Row */}
                                    <div className="flex items-center gap-3">
                                        {/* Mobile Filter Button */}
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="outline" size="icon" className="lg:hidden">
                                                    <SlidersHorizontal className="w-4 h-4" />
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent side="left" className="w-80">
                                                <SheetHeader>
                                                    <SheetTitle>Filters</SheetTitle>
                                                </SheetHeader>
                                                <div className="mt-6">
                                                    <FilterSidebar />
                                                </div>
                                            </SheetContent>
                                        </Sheet>

                                        {/* Search */}
                                        <div className="relative flex-1 group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input
                                                type="text"
                                                placeholder={isSmartSearch ? "Describe what you're looking for (e.g. 'cheap blue sneakers')..." : "Search for products, brands and more"}
                                                className={`pl-10 pr-24 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-all ${isSmartSearch ? 'ring-2 ring-purple-500/20 border-purple-400' : ''}`}
                                                value={keyword}
                                                onChange={(e) => setKeyword(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && isSmartSearch && handleSmartSearch()}
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                <button
                                                    onClick={() => setIsSmartSearch(!isSmartSearch)}
                                                    className={`px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${isSmartSearch ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'}`}
                                                    title="Smart Search powered by AI"
                                                >
                                                    <Sparkles className="w-3 h-3" />
                                                    AI
                                                </button>
                                                {isSmartSearch && (
                                                    <Button
                                                        size="sm"
                                                        onClick={handleSmartSearch}
                                                        disabled={isAiSearching || !keyword.trim()}
                                                        className="h-7 bg-purple-600 hover:bg-purple-700 text-white text-xs px-2"
                                                    >
                                                        {isAiSearching ? <Loader className="w-3 h-3 animate-spin" /> : 'Search'}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Sort */}
                                        <Select value={sortBy || "default"} onValueChange={(value) => setSortBy(value === "default" ? "" : value)}>
                                            <SelectTrigger className="w-48 bg-white">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="default">Recommended</SelectItem>
                                                <SelectItem value="newest">Newest First</SelectItem>
                                                <SelectItem value="trending">Popularity</SelectItem>
                                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Active Filters and Product Count */}
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {category && (
                                                <Badge variant="secondary" className="gap-1.5">
                                                    {category}
                                                    <button
                                                        onClick={() => setCategory('')}
                                                        className="hover:bg-gray-200 rounded-full p-0.5"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            )}
                                            {subcategory && (
                                                <Badge variant="secondary" className="gap-1.5">
                                                    {subcategory}
                                                    <button
                                                        onClick={() => setSubcategory('')}
                                                        className="hover:bg-gray-200 rounded-full p-0.5"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            )}
                                            {brand && (
                                                <Badge variant="secondary" className="gap-1.5">
                                                    {brand}
                                                    <button
                                                        onClick={() => setBrand('')}
                                                        className="hover:bg-gray-200 rounded-full p-0.5"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            )}
                                            {size && (
                                                <Badge variant="secondary" className="gap-1.5">
                                                    Size: {size}
                                                    <button
                                                        onClick={() => setSize('')}
                                                        className="hover:bg-gray-200 rounded-full p-0.5"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            )}
                                            {color && (
                                                <Badge variant="secondary" className="gap-1.5">
                                                    Color: {color}
                                                    <button
                                                        onClick={() => setColor('')}
                                                        className="hover:bg-gray-200 rounded-full p-0.5"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            )}
                                            {activeFiltersCount > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleClearFilters}
                                                    className="text-xs h-7"
                                                >
                                                    Clear All
                                                </Button>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {loading ? (
                                                <span>Loading...</span>
                                            ) : (
                                                <span className="font-medium">{products.length} {products.length === 1 ? 'product' : 'products'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subcategory Pills */}
                            {subs.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <button
                                        onClick={() => setSubcategory('')}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${subcategory === ''
                                            ? accent.active
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {subs.map(sub => (
                                        <button
                                            key={sub}
                                            onClick={() => setSubcategory(sub)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${subcategory === sub
                                                ? accent.active
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                                }`}
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
                                <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                                    <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                                    <Button variant="outline" onClick={handleClearFilters}>
                                        Clear All Filters
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {products.map(product => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            onQuickView={(product) => setQuickViewProduct(product)}
                                        />
                                    ))}
                                </div>
                            )}
                        </main>
                    </div>
                </div>

                {/* Quick View Modal */}
                {quickViewProduct && (
                    <QuickView
                        product={quickViewProduct}
                        open={!!quickViewProduct}
                        onOpenChange={(open) => !open && setQuickViewProduct(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default Marketplace;
