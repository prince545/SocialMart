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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const SUBCATEGORY_MAP = {
    "Women's Clothing": ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Co-ord Sets', 'Workwear', 'Activewear', 'Party Wear', 'Sleepwear & Loungewear', 'Ethnic & Fusion', 'Lingerie & Intimates', 'Maternity', 'Swim & Beachwear'],
    "Men's Clothing": ['Tops', 'Bottoms', 'Outerwear', 'Ethnic Wear', 'Innerwear & Loungewear', 'Activewear'],
    'Electronics': ['Personal Computing', 'Mobile & Communication', 'Personal Audio', 'Home Audio', 'Visual', 'Cameras & Photography', 'Gaming', 'Kitchen Appliances', 'Utility Appliances', 'Smart Home & Security'],
};

const CAT_ACCENT = {
    "Women's Clothing": { active: 'bg-pink-600 text-white border-pink-600', hover: 'hover:border-pink-400 hover:text-pink-600', activeSide: 'text-pink-600 font-semibold bg-pink-50', badge: 'bg-pink-50 text-pink-700 border-pink-100', badgeX: 'text-pink-400 hover:text-pink-700' },
    "Men's Clothing": { active: 'bg-blue-600 text-white border-blue-600', hover: 'hover:border-blue-400 hover:text-blue-600', activeSide: 'text-blue-600 font-semibold bg-blue-50', badge: 'bg-blue-50 text-blue-700 border-blue-100', badgeX: 'text-blue-400 hover:text-blue-700' },
    'Electronics': { active: 'bg-violet-600 text-white border-violet-600', hover: 'hover:border-violet-400 hover:text-violet-600', activeSide: 'text-violet-600 font-semibold bg-violet-50', badge: 'bg-violet-50 text-violet-700 border-violet-100', badgeX: 'text-violet-400 hover:text-violet-700' },
};

const DEFAULT_ACCENT = {
    active: 'bg-primary text-primary-foreground border-primary',
    hover: 'hover:border-primary hover:text-primary',
    activeSide: 'text-primary font-semibold bg-primary/10',
    badge: 'bg-primary/10 text-primary border-primary/20',
    badgeX: 'text-primary/70 hover:text-primary',
};

const Marketplace = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.products);
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState(() => searchParams.get('category') || '');
    const [subcategory, setSubcategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    useEffect(() => setSubcategory(''), [category]);

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

    const FilterSidebar = () => (
        <div className="space-y-6">
            <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">Categories</h3>
                <div className="space-y-1">
                    <button
                        onClick={() => setCategory('')}
                        className={cn('block w-full rounded-md px-3 py-2 text-left text-sm transition-colors', category === '' ? accent.activeSide : 'text-muted-foreground hover:bg-accent hover:text-foreground')}
                    >
                        All categories
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={cn('block w-full rounded-md px-3 py-2 text-left text-sm transition-colors', category === cat ? accent.activeSide : 'text-muted-foreground hover:bg-accent hover:text-foreground')}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
            {subs.length > 0 && (
                <>
                    <Separator />
                    <div>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">Shop by type</h3>
                        <div className="space-y-1">
                            <button onClick={() => setSubcategory('')} className={cn('block w-full rounded-md px-3 py-2 text-left text-sm transition-colors', subcategory === '' ? accent.activeSide : 'text-muted-foreground hover:bg-accent hover:text-foreground')}>All types</button>
                            {subs.map(sub => (
                                <button key={sub} onClick={() => setSubcategory(sub)} className={cn('block w-full rounded-md px-3 py-2 text-left text-sm transition-colors', subcategory === sub ? accent.activeSide : 'text-muted-foreground hover:bg-accent hover:text-foreground')}>{sub}</button>
                            ))}
                        </div>
                    </div>
                </>
            )}
            <Separator />
            <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">Price range</h3>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Min" className="bg-card" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} />
                    <span className="text-muted-foreground">–</span>
                    <Input type="number" placeholder="Max" className="bg-card" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} />
                </div>
            </div>
            <Separator />
            <Button variant="outline" className="w-full" onClick={handleClearFilters}>Clear filters</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-background py-8 pb-16">
            <div className="container-main">
                <div className="flex flex-col gap-8 lg:flex-row">
                    <aside className="hidden shrink-0 lg:block lg:w-56">
                        <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold text-foreground">Filters</h2>
                            <FilterSidebar />
                        </div>
                    </aside>
                    <main className="min-w-0 flex-1">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="lg:hidden shrink-0">
                                        <SlidersHorizontal size={18} />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-72">
                                    <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                                    <div className="mt-6"><FilterSidebar /></div>
                                </SheetContent>
                            </Sheet>
                            <div className="relative flex-1 min-w-0">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    className="h-10 border-border bg-card pl-10 shadow-sm"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                            {category && (
                                <Badge variant="secondary" className={cn('shrink-0 gap-1 border', accent.badge)}>
                                    {category}
                                    <button type="button" onClick={() => setCategory('')} className={cn('ml-1', accent.badgeX)} aria-label="Remove category"><X size={12} /></button>
                                </Badge>
                            )}
                            {subcategory && (
                                <Badge variant="secondary" className={cn('shrink-0 gap-1 border', accent.badge)}>
                                    {subcategory}
                                    <button type="button" onClick={() => setSubcategory('')} className={cn('ml-1', accent.badgeX)} aria-label="Remove subcategory"><X size={12} /></button>
                                </Badge>
                            )}
                        </div>
                        {subs.length > 0 && (
                            <div className="mb-5 flex flex-wrap gap-2">
                                <button onClick={() => setSubcategory('')} className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-all', subcategory === '' ? accent.active : `border-border bg-card text-muted-foreground ${accent.hover}`)}>All</button>
                                {subs.map(sub => (
                                    <button key={sub} onClick={() => setSubcategory(sub)} className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-all', subcategory === sub ? accent.active : `border-border bg-card text-muted-foreground ${accent.hover}`)}>{sub}</button>
                                ))}
                            </div>
                        )}
                        {loading ? (
                            <div className="flex justify-center py-24">
                                <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-24 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                    <Search className="h-7 w-7 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-foreground">No products found</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Try adjusting filters or search terms.</p>
                                <Button variant="outline" className="mt-6" onClick={handleClearFilters}>Clear filters</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
