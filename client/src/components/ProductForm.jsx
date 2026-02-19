
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct } from '../redux/productSlice';
import { X, Sparkles, Loader } from 'lucide-react';
import axios from 'axios';

const ProductForm = ({ onClose }) => {
    const dispatch = useDispatch();
    const [generating, setGenerating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        images: '',
        category: 'Electronics',
        brand: '',
        stock: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerateDescription = async () => {
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
                            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                            <input type="number" name="price" value={formData.price} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={handleChange} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
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
                            <input type="text" name="category" value={formData.category} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={handleChange} />
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
