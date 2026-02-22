
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct } from '../redux/productSlice';
import { X, Sparkles, Loader } from 'lucide-react';
import axios from 'axios';

const ProductForm = ({ onClose }) => {
    const dispatch = useDispatch();
    const [generating, setGenerating] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const [priceNote, setPriceNote] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        images: '',
        category: 'Fashion',
        brand: '',
        stock: ''
    });

    const categories = ["Fashion", "Electronics", "Home & Kitchen", "Beauty & Personal Care", "Books", "Sports & Outdoors", "Toys & Games", "Collectibles"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerateDescription = async () => {
        if (!formData.title) return;
        setGenerating(true);
        try {
            const { data } = await axios.post('/api/ai/description', {
                title: formData.title,
                category: formData.category,
                keywords: formData.brand
            });
            setFormData(prev => ({ ...prev, description: data.description }));
        } catch (err) {
            console.error(err);
            alert('Failed to generate description');
        } finally {
            setGenerating(false);
        }
    };

    const handleOptimizePrice = async () => {
        if (!formData.title || !formData.category) {
            alert('Please enter a title and category first');
            return;
        }
        setOptimizing(true);
        try {
            const { data } = await axios.post('/api/ai/price-optimization', {
                title: formData.title,
                category: formData.category,
                brand: formData.brand,
                description: formData.description
            });
            setFormData(prev => ({ ...prev, price: data.recommendedPrice.toString() }));
            setPriceNote(`AI suggests: ₹${data.minPrice} - ₹${data.maxPrice}. ${data.reason}`);
        } catch (err) {
            console.error(err);
            alert('Failed to get price suggestion');
        } finally {
            setOptimizing(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert images string to array
        const productData = {
            ...formData,
            images: formData.images.split(',').map(url => url.trim())
        };
        dispatch(createProduct(productData));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Title</label>
                        <input type="text" name="title" value={formData.title} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={handleChange} />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                <button
                                    type="button"
                                    onClick={handleOptimizePrice}
                                    disabled={optimizing || !formData.title}
                                    className="text-indigo-600 text-xs flex items-center hover:text-indigo-800 disabled:opacity-50"
                                >
                                    {optimizing ? <Loader size={12} className="animate-spin mr-1" /> : <Sparkles size={12} className="mr-1" />}
                                    AI Suggest
                                </button>
                            </div>
                            <input type="number" name="price" value={formData.price} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={handleChange} />
                            {priceNote && <p className="text-[10px] text-indigo-500 mt-1 leading-tight">{priceNote}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mt-5">Stock</label>
                            <input type="number" name="stock" value={formData.stock} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={handleChange} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input type="text" name="images" value={formData.images} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={handleChange} placeholder="Comma separated URLs" />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                onChange={handleChange}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Brand</label>
                            <input type="text" name="brand" value={formData.brand} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={handleChange} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <button
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={generating || !formData.title || !formData.category}
                                className="text-purple-600 text-xs flex items-center hover:text-purple-800 disabled:opacity-50"
                            >
                                {generating ? <Loader size={12} className="animate-spin mr-1" /> : <Sparkles size={12} className="mr-1" />}
                                Generate with AI
                            </button>
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            required
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-semibold">
                        Create Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
