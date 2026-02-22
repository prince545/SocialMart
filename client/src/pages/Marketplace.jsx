import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { getProducts } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import {
    Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Grid3x3, List,
    Sparkles, Loader, TrendingUp, Star, Clock, Heart, ShoppingBag,
    Filter, ArrowUpDown, Eye, ThumbsUp, Zap, Award, Gift, Percent,
    ChevronLeft, ChevronRight, LayoutGrid, LayoutList, BadgePercent
} from 'lucide-react';
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
    SheetFooter,
    SheetClose,
} from '@/components/ui/sheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';

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
    'Home & Living': [
        'Furniture', 'Decor', 'Kitchen & Dining', 'Bedding', 'Bath',
        'Storage & Organization', 'Lighting', 'Rugs', 'Curtains',
    ],
    'Beauty': [
        'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body',
        'Tools & Accessories', 'Men\'s Grooming', 'Natural & Organic',
    ],
};

const CAT_ACCENT = {
    "Women's Clothing": {
        primary: 'pink',
        gradient: 'from-pink-500 to-rose-500',
        light: 'pink-50',
        text: 'text-pink-600',
        bg: 'bg-pink-600',
        border: 'border-pink-200',
        hover: 'hover:bg-pink-50 hover:text-pink-600',
        active: 'bg-pink-600 text-white border-pink-600',
        badge: 'bg-pink-100 text-pink-700',
    },
    "Men's Clothing": {
        primary: 'blue',
        gradient: 'from-blue-500 to-indigo-600',
        light: 'blue-50',
        text: 'text-blue-600',
        bg: 'bg-blue-600',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-50 hover:text-blue-600',
        active: 'bg-blue-600 text-white border-blue-600',
        badge: 'bg-blue-100 text-blue-700',
    },
    'Electronics': {
        primary: 'violet',
        gradient: 'from-violet-500 to-purple-600',
        light: 'violet-50',
        text: 'text-violet-600',
        bg: 'bg-violet-600',
        border: 'border-violet-200',
        hover: 'hover:bg-violet-50 hover:text-violet-600',
        active: 'bg-violet-600 text-white border-violet-600',
        badge: 'bg-violet-100 text-violet-700',
    },
    'Home & Living': {
        primary: 'emerald',
        gradient: 'from-emerald-500 to-teal-500',
        light: 'emerald-50',
        text: 'text-emerald-600',
        bg: 'bg-emerald-600',
        border: 'border-emerald-200',
        hover: 'hover:bg-emerald-50 hover:text-emerald-600',
        active: 'bg-emerald-600 text-white border-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700',
    },
    'Beauty': {
        primary: 'purple',
        gradient: 'from-purple-500 to-fuchsia-500',
        light: 'purple-50',
        text: 'text-purple-600',
        bg: 'bg-purple-600',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-50 hover:text-purple-600',
        active: 'bg-purple-600 text-white border-purple-600',
        badge: 'bg-purple-100 text-purple-700',
    },
};

const DEFAULT_ACCENT = {
    primary: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    light: 'indigo-50',
    text: 'text-indigo-600',
    bg: 'bg-indigo-600',
    border: 'border-indigo-200',
    hover: 'hover:bg-indigo-50 hover:text-indigo-600',
    active: 'bg-indigo-600 text-white border-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700',
};

const FilterSection = ({ title, children, defaultOpen = true, count }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left group"
            >
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{title}</h3>
                    {count > 0 && (
                        <Badge className="bg-indigo-100 text-indigo-700 text-xs px-1.5">
                            {count}
                        </Badge>
                    )}
                </div>
                {isOpen ?
                    <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" /> :
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                }
            </button>
            {isOpen && (
                <div className="pb-4 animate-slideDown">
                    {children}
                </div>
            )}
        </div>
    );
};

const PriceSlider = ({ min, max, value, onChange }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <div className="space-y-4">
            <Slider
                min={min}
                max={max}
                step={100}
                value={localValue}
                onValueChange={setLocalValue}
                onValueCommit={onChange}
                className="py-4"
            />
            <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Min</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                        <Input
                            type="number"
                            value={localValue[0]}
                            onChange={(e) => {
                                const newVal = [parseInt(e.target.value) || 0, localValue[1]];
                                setLocalValue(newVal);
                                onChange(newVal);
                            }}
                            className="pl-7"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Max</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                        <Input
                            type="number"
                            value={localValue[1]}
                            onChange={(e) => {
                                const newVal = [localValue[0], parseInt(e.target.value) || 0];
                                setLocalValue(newVal);
                                onChange(newVal);
                            }}
                            className="pl-7"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Marketplace = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.products);
    const [searchParams, setSearchParams] = useSearchParams();

    // State
    const [keyword, setKeyword] = useState(() => searchParams.get('q') || '');
    const [category, setCategory] = useState(() => searchParams.get('category') || '');
    const [subcategory, setSubcategory] = useState(() => searchParams.get('subcategory') || '');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || '');
    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('minPrice') || '',
        max: searchParams.get('maxPrice') || ''
    });
    const [rating, setRating] = useState(0);
    const [inStock, setInStock] = useState(false);
    const [onSale, setOnSale] = useState(false);

    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isSmartSearch, setIsSmartSearch] = useState(false);
    const [isAiSearching, setIsAiSearching] = useState(false);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') || 'grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [showFilters, setShowFilters] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [trendingSearches, setTrendingSearches] = useState([
        'Wireless Headphones', 'Sneakers', 'Smart Watch', 'Designer Bag', 'Perfume'
    ]);

    // Get accent based on category
    const accent = CAT_ACCENT[category] || DEFAULT_ACCENT;

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (keyword) params.set('q', keyword);
        if (category) params.set('category', category);
        if (subcategory) params.set('subcategory', subcategory);
        if (sortBy) params.set('sort', sortBy);
        if (priceRange.min) params.set('minPrice', priceRange.min);
        if (priceRange.max) params.set('maxPrice', priceRange.max);
        setSearchParams(params);
    }, [keyword, category, subcategory, sortBy, priceRange, setSearchParams]);

    // Fetch products with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = {
                keyword,
                category,
                subcategory,
                minPrice: priceRange.min,
                maxPrice: priceRange.max,
                rating,
                inStock,
                onSale,
                page: currentPage,
                limit: itemsPerPage,
            };
            if (brand) params.brand = brand;
            if (size) params.size = size;
            if (color) params.color = color;
            if (sortBy) params.sort = sortBy;
            dispatch(getProducts(params));
        }, 400);
        return () => clearTimeout(timer);
    }, [dispatch, keyword, category, subcategory, brand, size, color, sortBy, priceRange, rating, inStock, onSale, currentPage, itemsPerPage]);

    // Reset subcategory when category changes
    useEffect(() => {
        setSubcategory('');
    }, [category]);

    // Load recently viewed from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentlyViewed');
        if (saved) {
            setRecentlyViewed(JSON.parse(saved));
        }
    }, []);

    // Save view mode preference
    useEffect(() => {
        localStorage.setItem('viewMode', viewMode);
    }, [viewMode]);

    const handleSmartSearch = async () => {
        if (!keyword.trim()) return;
        setIsAiSearching(true);
        try {
            const { data } = await axios.post('/api/ai/search-intent', { query: keyword });

            if (data.keyword) setKeyword(data.keyword);
            if (data.category) setCategory(data.category);
            if (data.brand) setBrand(data.brand);
            if (data.minPrice) setPriceRange(prev => ({ ...prev, min: data.minPrice }));
            if (data.maxPrice) setPriceRange(prev => ({ ...prev, max: data.maxPrice }));
            if (data.sort) setSortBy(data.sort);
            if (data.color) setColor(data.color);
            if (data.rating) setRating(data.rating);

            // Add to trending searches
            if (!trendingSearches.includes(keyword)) {
                setTrendingSearches(prev => [keyword, ...prev].slice(0, 5));
            }

            setIsSmartSearch(false);
        } catch (err) {
            console.error("Smart Search Failed:", err);
        } finally {
            setIsAiSearching(false);
        }
    };

    const handleProductClick = (product) => {
        // Add to recently viewed
        const updated = [product, ...recentlyViewed.filter(p => p._id !== product._id)].slice(0, 4);
        setRecentlyViewed(updated);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    };

    // Memoized values
    const uniqueBrands = useMemo(() =>
        [...new Set(products.map(p => p.brand).filter(Boolean))].sort(),
        [products]
    );

    const uniqueSizes = useMemo(() =>
        [...new Set(products.flatMap(p => p.sizes || []).filter(Boolean))].sort(),
        [products]
    );

    const uniqueColors = useMemo(() =>
        [...new Set(products.flatMap(p => p.colors || []).filter(Boolean))].sort(),
        [products]
    );

    const categories = useMemo(() => [
        "Women's Clothing", "Men's Clothing", 'Electronics',
        'Home & Living', 'Beauty', 'Books', 'Sports'
    ], []);

    const subs = SUBCATEGORY_MAP[category] || [];

    const activeFiltersCount = useMemo(() =>
        [category, subcategory, brand, size, color, priceRange.min, priceRange.max, rating, inStock, onSale]
            .filter(Boolean).length,
        [category, subcategory, brand, size, color, priceRange, rating, inStock, onSale]
    );

    const handleClearFilters = useCallback(() => {
        setKeyword('');
        setCategory('');
        setSubcategory('');
        setBrand('');
        setSize('');
        setColor('');
        setSortBy('');
        setPriceRange({ min: '', max: '' });
        setRating(0);
        setInStock(false);
        setOnSale(false);
        setCurrentPage(1);
    }, []);

    const FilterSidebar = () => (
        <div className="space-y-0">
            {/* Category Filter */}
            <FilterSection title="Category" count={category ? 1 : 0}>
                <div className="space-y-1">
                    <button
                        onClick={() => setCategory('')}
                        className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${category === ''
                            ? `${accent.text} font-semibold ${accent.light} bg-opacity-50`
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => {
                        const catAccent = CAT_ACCENT[cat] || DEFAULT_ACCENT;
                        return (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${category === cat
                                    ? `${catAccent.text} font-semibold ${catAccent.light} bg-opacity-50`
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </FilterSection>

            {/* Subcategory Filter */}
            {subs.length > 0 && (
                <FilterSection title="Type" count={subcategory ? 1 : 0}>
                    <div className="space-y-1">
                        <button
                            onClick={() => setSubcategory('')}
                            className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${subcategory === ''
                                ? `${accent.text} font-semibold ${accent.light} bg-opacity-50`
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
                                    ? `${accent.text} font-semibold ${accent.light} bg-opacity-50`
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Price Range */}
            <FilterSection title="Price Range" count={priceRange.min || priceRange.max ? 1 : 0}>
                <PriceSlider
                    min={0}
                    max={50000}
                    value={[
                        priceRange.min ? parseInt(priceRange.min) : 0,
                        priceRange.max ? parseInt(priceRange.max) : 50000
                    ]}
                    onChange={(value) => setPriceRange({ min: value[0], max: value[1] })}
                />
            </FilterSection>

            {/* Rating Filter */}
            <FilterSection title="Customer Rating" count={rating ? 1 : 0}>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map(r => (
                        <button
                            key={r}
                            onClick={() => setRating(rating === r ? 0 : r)}
                            className={`flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors ${rating === r ? `${accent.light} ${accent.text}` : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">& Up</span>
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* Brand Filter */}
            {uniqueBrands.length > 0 && (
                <FilterSection title="Brand" count={brand ? 1 : 0}>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                        <button
                            onClick={() => setBrand('')}
                            className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${brand === ''
                                ? `${accent.text} font-semibold ${accent.light} bg-opacity-50`
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
                                    ? `${accent.text} font-semibold ${accent.light} bg-opacity-50`
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Size Filter */}
            {uniqueSizes.length > 0 && (
                <FilterSection title="Size" count={size ? 1 : 0}>
                    <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map(s => (
                            <button
                                key={s}
                                onClick={() => setSize(size === s ? '' : s)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${size === s
                                    ? `${accent.bg} text-white border-${accent.primary}-600`
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Color Filter */}
            {uniqueColors.length > 0 && (
                <FilterSection title="Color" count={color ? 1 : 0}>
                    <div className="flex flex-wrap gap-2">
                        {uniqueColors.map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(color === c ? '' : c)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${color === c
                                    ? `${accent.bg} text-white border-${accent.primary}-600`
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Additional Filters */}
            <FilterSection title="Availability">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={inStock}
                            onChange={(e) => setInStock(e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={onSale}
                            onChange={(e) => setOnSale(e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">On Sale</span>
                    </label>
                </div>
            </FilterSection>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20 pt-4 pb-12 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Hero Banner for Categories */}
                    {category && (
                        <div className={`mb-6 rounded-2xl bg-gradient-to-r ${accent.gradient} p-6 text-white relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">{category}</h2>
                                <p className="text-white/90 max-w-2xl">
                                    {subs.length > 0 ? `Explore our collection of ${subs.length} categories` : 'Discover amazing products'}
                                </p>
                                {subs.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {subs.slice(0, 5).map(sub => (
                                            <Badge key={sub} className="bg-white/20 text-white border-0 hover:bg-white/30 cursor-pointer"
                                                onClick={() => setSubcategory(sub)}>
                                                {sub}
                                            </Badge>
                                        ))}
                                        {subs.length > 5 && (
                                            <Badge className="bg-white/20 text-white border-0">
                                                +{subs.length - 5} more
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Trending Searches */}
                    {!keyword && !category && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-medium text-gray-700">Trending Searches</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {trendingSearches.map(term => (
                                    <div
                                        key={term}
                                        className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-600 shadow-sm transition-all hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        {term}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Desktop Sidebar */}
                        <aside className="hidden lg:block w-72 flex-shrink-0">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Filter className="w-4 h-4" />
                                        Filters
                                    </h2>
                                    {activeFiltersCount > 0 && (
                                        <Badge className={`bg-gradient-to-r ${accent.gradient} text-white`}>
                                            {activeFiltersCount}
                                        </Badge>
                                    )}
                                </div>
                                <FilterSidebar />

                                {activeFiltersCount > 0 && (
                                    <div className="pt-4 mt-4 border-t border-gray-200">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={handleClearFilters}
                                        >
                                            Clear All Filters
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 min-w-0">

                            {/* Top Bar */}
                            <Card className="mb-6 border-gray-200/80 shadow-sm bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <div className="flex flex-col gap-4">

                                        {/* Search and Actions Row */}
                                        <div className="flex items-center gap-3">

                                            {/* Mobile Filter Button */}
                                            <Sheet open={showFilters} onOpenChange={setShowFilters}>
                                                <SheetTrigger asChild>
                                                    <Button variant="outline" size="icon" className="lg:hidden">
                                                        <SlidersHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent side="left" className="w-80 overflow-y-auto">
                                                    <SheetHeader>
                                                        <SheetTitle className="flex items-center gap-2">
                                                            <Filter className="w-4 h-4" />
                                                            Filters
                                                            {activeFiltersCount > 0 && (
                                                                <Badge className={`bg-gradient-to-r ${accent.gradient} text-white ml-2`}>
                                                                    {activeFiltersCount}
                                                                </Badge>
                                                            )}
                                                        </SheetTitle>
                                                    </SheetHeader>
                                                    <div className="mt-6">
                                                        <FilterSidebar />
                                                    </div>
                                                    <SheetFooter className="mt-6">
                                                        <SheetClose asChild>
                                                            <Button className="w-full" onClick={handleClearFilters}>
                                                                Clear Filters
                                                            </Button>
                                                        </SheetClose>
                                                    </SheetFooter>
                                                </SheetContent>
                                            </Sheet>

                                            {/* Search Input */}
                                            <div className="relative flex-1 group">
                                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isSmartSearch ? 'text-purple-500' : 'text-gray-400 group-focus-within:text-indigo-500'
                                                    }`} />
                                                <Input
                                                    type="text"
                                                    placeholder={isSmartSearch
                                                        ? "Describe what you're looking for..."
                                                        : "Search for products, brands, and more..."
                                                    }
                                                    className={`pl-10 pr-24 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all text-base ${isSmartSearch ? 'ring-2 ring-purple-500/20 border-purple-400' : ''
                                                        }`}
                                                    value={keyword}
                                                    onChange={(e) => setKeyword(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && isSmartSearch && handleSmartSearch()}
                                                />
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    onClick={() => setIsSmartSearch(!isSmartSearch)}
                                                                    className={`px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${isSmartSearch
                                                                        ? 'bg-purple-600 text-white'
                                                                        : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                                                                        }`}
                                                                >
                                                                    <Sparkles className="w-3 h-3" />
                                                                    AI
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Smart Search powered by AI</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    {isSmartSearch && (
                                                        <Button
                                                            size="sm"
                                                            onClick={handleSmartSearch}
                                                            disabled={isAiSearching || !keyword.trim()}
                                                            className="h-7 bg-purple-600 hover:bg-purple-700 text-white text-xs px-2"
                                                        >
                                                            {isAiSearching ?
                                                                <Loader className="w-3 h-3 animate-spin" /> :
                                                                'Search'
                                                            }
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* View Toggle */}
                                            <div className="hidden md:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => setViewMode('grid')}
                                                    className={`p-2 transition-colors ${viewMode === 'grid'
                                                        ? `${accent.bg} text-white`
                                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <LayoutGrid className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setViewMode('list')}
                                                    className={`p-2 transition-colors ${viewMode === 'list'
                                                        ? `${accent.bg} text-white`
                                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <LayoutList className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Sort Dropdown */}
                                            <Select value={sortBy || "default"} onValueChange={(value) => setSortBy(value === "default" ? "" : value)}>
                                                <SelectTrigger className="w-48 bg-white h-12">
                                                    <SelectValue placeholder="Sort by" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="default">Recommended</SelectItem>
                                                    <SelectItem value="newest">Newest First</SelectItem>
                                                    <SelectItem value="trending">Popularity</SelectItem>
                                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                                    <SelectItem value="rating">Top Rated</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Active Filters */}
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {category && (
                                                    <Badge variant="secondary" className={`gap-1.5 ${accent.badge} border-${accent.primary}-200`}>
                                                        {category}
                                                        <button
                                                            onClick={() => setCategory('')}
                                                            className={`hover:bg-${accent.primary}-200 rounded-full p-0.5`}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                )}
                                                {subcategory && (
                                                    <Badge variant="secondary" className={`gap-1.5 ${accent.badge} border-${accent.primary}-200`}>
                                                        {subcategory}
                                                        <button
                                                            onClick={() => setSubcategory('')}
                                                            className={`hover:bg-${accent.primary}-200 rounded-full p-0.5`}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                )}
                                                {brand && (
                                                    <Badge variant="secondary" className={`gap-1.5 ${accent.badge} border-${accent.primary}-200`}>
                                                        {brand}
                                                        <button
                                                            onClick={() => setBrand('')}
                                                            className={`hover:bg-${accent.primary}-200 rounded-full p-0.5`}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                )}
                                                {size && (
                                                    <Badge variant="secondary" className={`gap-1.5 ${accent.badge} border-${accent.primary}-200`}>
                                                        Size: {size}
                                                        <button
                                                            onClick={() => setSize('')}
                                                            className={`hover:bg-${accent.primary}-200 rounded-full p-0.5`}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                )}
                                                {color && (
                                                    <Badge variant="secondary" className={`gap-1.5 ${accent.badge} border-${accent.primary}-200`}>
                                                        Color: {color}
                                                        <button
                                                            onClick={() => setColor('')}
                                                            className={`hover:bg-${accent.primary}-200 rounded-full p-0.5`}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                )}
                                                {priceRange.min && (
                                                    <Badge variant="secondary" className={`gap-1.5 ${accent.badge} border-${accent.primary}-200`}>
                                                        Min: ₹{priceRange.min}
                                                        <button
                                                            onClick={() => setPriceRange(prev => ({ ...prev, min: '' }))}
                                                            className={`hover:bg-${accent.primary}-200 rounded-full p-0.5`}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                )}
                                                {priceRange.max && (
                                                    <Badge variant="secondary" className={`gap-1.5 ${accent.badge} border-${accent.primary}-200`}>
                                                        Max: ₹{priceRange.max}
                                                        <button
                                                            onClick={() => setPriceRange(prev => ({ ...prev, max: '' }))}
                                                            className={`hover:bg-${accent.primary}-200 rounded-full p-0.5`}
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
                                                        className="text-xs h-7 text-gray-500 hover:text-gray-700"
                                                    >
                                                        Clear All
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                {loading ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                        <span>Loading...</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-medium">{products.length} {products.length === 1 ? 'product' : 'products'}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Subcategory Pills */}
                            {subs.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <button
                                        onClick={() => setSubcategory('')}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${subcategory === ''
                                            ? `${accent.active}`
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {subs.map(sub => (
                                        <button
                                            key={sub}
                                            onClick={() => setSubcategory(sub)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all whitespace-nowrap ${subcategory === sub
                                                ? `${accent.active}`
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Product Grid/List */}
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="relative">
                                        <div className={`w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ShoppingBag className={`w-6 h-6 text-indigo-600 animate-pulse`} />
                                        </div>
                                    </div>
                                </div>
                            ) : products.length === 0 ? (
                                <Card className="text-center py-16">
                                    <CardContent>
                                        <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                        <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                                        <Button onClick={handleClearFilters} className={`bg-gradient-to-r ${accent.gradient} text-white`}>
                                            Clear All Filters
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
                                    <div className={viewMode === 'grid'
                                        ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                                        : "space-y-4"
                                    }>
                                        {products.map(product => (
                                            <div
                                                key={product._id}
                                                onClick={() => handleProductClick(product)}
                                                className="transform transition-all duration-300 hover:-translate-y-1"
                                            >
                                                <ProductCard
                                                    product={product}
                                                    onQuickView={(product) => setQuickViewProduct(product)}
                                                    viewMode={viewMode}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {products.length > 0 && (
                                        <div className="mt-8 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(parseInt(v))}>
                                                    <SelectTrigger className="w-20">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="12">12</SelectItem>
                                                        <SelectItem value="24">24</SelectItem>
                                                        <SelectItem value="48">48</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <span className="text-sm text-gray-600">per page</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <span className="text-sm text-gray-600">
                                                    Page {currentPage} of {Math.ceil(products.length / itemsPerPage) || 1}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                                    disabled={currentPage >= Math.ceil(products.length / itemsPerPage)}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </main>
                    </div>

                    {/* Recently Viewed */}
                    {recentlyViewed.length > 0 && (
                        <div className="mt-12">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-indigo-600" />
                                    Recently Viewed
                                </h3>
                                <Button variant="ghost" size="sm" onClick={() => setRecentlyViewed([])}>
                                    Clear
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {recentlyViewed.map(product => (
                                    <Link key={product._id} to={`/product/${product._id}`}>
                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-3">
                                                <img src={product.images?.[0]} alt={product.title} className="w-full aspect-square object-cover rounded-lg mb-2" />
                                                <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                                                <p className="text-sm font-bold text-indigo-600">₹{product.price}</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
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
    );
};

export default Marketplace;
