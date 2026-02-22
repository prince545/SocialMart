
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, deleteProduct } from '../redux/productSlice';
import { Plus, Trash2, Edit } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user: clerkUser, isLoaded } = useUser();
    const { products, loading } = useSelector(state => state.products);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (clerkUser) {
            dispatch(getProducts({ user: clerkUser.id }));
        }
    }, [dispatch, clerkUser]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    if (!isLoaded) return <div className="text-center py-10">Loading...</div>;
    if (!clerkUser) return <div className="text-center py-10">Please log in to view dashboard.</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Seller Dashboard</h2>
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700 gap-2">
                    <Plus size={18} />
                    Add Product
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                    </CardContent>
                </Card>
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-gray-900">$0.00</p>
                    </CardContent>
                </Card>
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-gray-900">0</p>
                    </CardContent>
                </Card>
            </div>

            {/* Products Table */}
            <Card className="border-gray-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-gray-500">Loading...</TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">No products found. Start selling!</TableCell>
                            </TableRow>
                        ) : (
                            products.map(product => (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img
                                                className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                                                src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'}
                                                alt=""
                                            />
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{product.title}</div>
                                                <div className="text-xs text-gray-500">{product.brand}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">${product.price}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'} className="text-xs">
                                            {product.stock} left
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 mr-1">
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(product._id)}
                                        >
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
