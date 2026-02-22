import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, deleteProduct } from '../redux/productSlice';
import { Plus, Trash2, Edit, Package, DollarSign, ShoppingBag } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user: clerkUser, isLoaded } = useUser();
    const { products, loading } = useSelector(state => state.products);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (clerkUser) dispatch(getProducts({ user: clerkUser.id }));
    }, [dispatch, clerkUser]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) dispatch(deleteProduct(id));
    };

    if (!isLoaded) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /></div>;
    if (!clerkUser) return <div className="container-main py-12 text-center text-muted-foreground">Please sign in to view your dashboard.</div>;

    const stats = [
        { label: 'Total products', value: products.length, icon: Package, className: 'text-primary' },
        { label: 'Total sales', value: '$0.00', icon: DollarSign, className: 'text-emerald-600' },
        { label: 'Orders', value: '0', icon: ShoppingBag, className: 'text-violet-600' },
    ];

    return (
        <div className="container-main section-padding">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Seller dashboard</h1>
                <Button onClick={() => setShowForm(true)} className="shrink-0 gap-2 bg-primary text-primary-foreground hover:opacity-90">
                    <Plus size={18} />
                    Add product
                </Button>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {stats.map((s) => (
                    <Card key={s.label} className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{s.label}</CardTitle>
                            <s.icon className={cn('h-5 w-5', s.className)} />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-foreground">{s.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="overflow-hidden border-border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="text-foreground">Product</TableHead>
                            <TableHead className="text-foreground">Price</TableHead>
                            <TableHead className="text-foreground">Category</TableHead>
                            <TableHead className="text-foreground">Stock</TableHead>
                            <TableHead className="text-right text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Loading…</TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">No products yet. Add your first product to start selling.</TableCell>
                            </TableRow>
                        ) : (
                            products.map(product => (
                                <TableRow key={product._id} className="hover:bg-muted/30">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.images?.[0] || 'https://via.placeholder.com/150'}
                                                alt=""
                                                className="h-11 w-11 shrink-0 rounded-lg object-cover"
                                            />
                                            <div>
                                                <div className="font-medium text-foreground">{product.title}</div>
                                                <div className="text-xs text-muted-foreground">{product.brand}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">${product.price}</TableCell>
                                    <TableCell><Badge variant="secondary" className="text-xs">{product.category}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'} className="text-xs">
                                            {product.stock} left
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 mr-1">
                                            <Edit size={16} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(product._id)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {showForm && <ProductForm onClose={() => setShowForm(false)} />}
        </div>
    );
};

export default Dashboard;
