
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, deleteProduct } from '../redux/productSlice';
import { Plus, Trash2, Edit } from 'lucide-react';
import ProductForm from '../components/ProductForm';

import { useUser } from '@clerk/clerk-react';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user: clerkUser, isLoaded } = useUser();
    const { products, loading } = useSelector(state => state.products);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (clerkUser) {
            // Fetch only my products
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
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-green-700"
                >
                    <Plus size={20} />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Stats Cards (Placeholder) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Products</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Sales</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">$0.00</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Orders</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No products found. Start selling!</td></tr>
                        ) : (
                            products.map(product => (
                                <tr key={product._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                                <div className="text-sm text-gray-500">{product.brand}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && <ProductForm onClose={() => setShowForm(false)} />}
        </div>
    );
};

export default Dashboard;
