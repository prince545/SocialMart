
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../redux/postSlice';
import { getProducts } from '../redux/productSlice';
import { Image, Send, Tag, Sparkles, Loader, X, Link, Upload } from 'lucide-react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const CreatePost = () => {
    const [caption, setCaption] = useState('');
    const [imageUrl, setImageUrl] = useState('');       // final URL saved to DB
    const [imagePreview, setImagePreview] = useState(''); // preview src
    const [urlInput, setUrlInput] = useState('');        // URL text field
    const [mode, setMode] = useState('file');            // 'file' | 'url'
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [taggedProduct, setTaggedProduct] = useState('none');
    const [generating, setGenerating] = useState(false);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.products);
    const { posting, postError } = useSelector(state => state.posts);
    const { user: clerkUser } = useUser();

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    // Upload file to server, get back a permanent URL
    const uploadFile = async (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Only image files are allowed');
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { data } = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // data.url is a permanent Cloudinary HTTPS URL — use it directly
            setImageUrl(data.url);
            setImagePreview(data.url);
        } catch (err) {
            console.error(err);
            alert('Image upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) uploadFile(file);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
    }, []);

    const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
    const handleDragLeave = () => setDragOver(false);

    const handleUrlConfirm = () => {
        if (!urlInput.trim()) return;
        setImageUrl(urlInput.trim());
        setImagePreview(urlInput.trim());
        setUrlInput('');
    };

    const handleRemoveImage = () => {
        setImageUrl('');
        setImagePreview('');
        setUrlInput('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleGenerateCaption = async () => {
        if (!imagePreview) {
            alert('Please add an image first');
            return;
        }
        setGenerating(true);
        try {
            const { data } = await axios.post('/api/ai/caption', { imageUrl: imagePreview });
            setCaption(data.caption);
        } catch (err) {
            console.error(err);
            alert('Failed to generate caption');
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!caption.trim() || !imageUrl) return;

        const postData = { caption, image: imageUrl };
        if (taggedProduct && taggedProduct !== 'none') postData.products = [taggedProduct];

        dispatch(addPost(postData));
        setCaption('');
        setImageUrl('');
        setImagePreview('');
        setUrlInput('');
        setTaggedProduct('none');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow mb-6">
            <CardContent className="p-4">
                {/* Header row */}
                <div className="flex items-start space-x-3 mb-4">
                    <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-indigo-100">
                        <AvatarImage src={clerkUser?.imageUrl} alt={clerkUser?.firstName} />
                        <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold">
                            {clerkUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="relative">
                            <Textarea
                                className="bg-gray-50 border-gray-200 resize-none pr-10 text-gray-800 placeholder-gray-400 focus:bg-white"
                                rows={2}
                                placeholder={`What's on your mind, ${clerkUser?.firstName || 'User'}?`}
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleGenerateCaption}
                                disabled={generating || !imagePreview}
                                className="absolute right-1 top-1 w-7 h-7 text-purple-500 hover:text-purple-700 hover:bg-purple-50 disabled:opacity-30"
                                title="Generate AI Caption"
                            >
                                {generating ? <Loader size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">

                    {/* Mode toggle */}
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
                        <button
                            type="button"
                            onClick={() => setMode('file')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 transition-colors ${mode === 'file' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Upload size={14} /> Upload File
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('url')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 transition-colors ${mode === 'url' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Link size={14} /> Image URL
                        </button>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    {/* Image area */}
                    {!imagePreview ? (
                        mode === 'file' ? (
                            // Drag & Drop zone
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`flex flex-col items-center justify-center gap-2 w-full h-36 rounded-lg border-2 border-dashed cursor-pointer transition-all
                                ${dragOver
                                        ? 'border-blue-400 bg-blue-50 scale-[1.01]'
                                        : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-gray-100'
                                    }`}
                            >
                                {uploading ? (
                                    <Loader size={28} className="animate-spin text-blue-500" />
                                ) : (
                                    <>
                                        <Image size={28} className={dragOver ? 'text-blue-500' : 'text-gray-400'} />
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium text-blue-600">Click to upload</span> or drag & drop
                                        </p>
                                        <p className="text-xs text-gray-400">PNG, JPG, GIF, WEBP up to 10MB</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            // URL input
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 gap-2">
                                    <Image size={16} className="text-gray-400 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Paste image URL (https://...)"
                                        className="bg-transparent w-full text-sm focus:outline-none text-gray-700 placeholder-gray-400"
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleUrlConfirm()}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleUrlConfirm}
                                    disabled={!urlInput.trim()}
                                    className="bg-blue-600 text-white px-3 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-40 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        )
                    ) : (
                        // Preview
                        <div
                            className="relative rounded-lg overflow-hidden border border-gray-200 h-52 w-full group"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            {uploading && (
                                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                                    <Loader size={28} className="animate-spin text-blue-500" />
                                </div>
                            )}
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={() => { setImagePreview(''); setImageUrl(''); }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                            {/* Remove */}
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white rounded-full p-1 transition-all z-10"
                                title="Remove image"
                            >
                                <X size={14} />
                            </button>
                            {/* Change */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-2 right-2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white rounded-md px-2 py-1 text-xs transition-all z-10"
                            >
                                Change
                            </button>
                            <p className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-1.5 py-0.5 rounded">
                                Drop a new image to replace
                            </p>
                        </div>
                    )}

                    {/* Tag product */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-100 p-2">
                        <Tag size={16} className="text-gray-400 flex-shrink-0" />
                        <Select value={taggedProduct} onValueChange={setTaggedProduct}>
                            <SelectTrigger className="border-0 bg-transparent h-auto py-0 shadow-none focus:ring-0 text-sm text-gray-700">
                                <SelectValue placeholder="Tag a Product (Optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {products.map(product => (
                                    <SelectItem key={product._id} value={product._id}>{product.title} — ${product.price}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end items-center mt-4 pt-3 border-t border-gray-100">
                    {postError && (
                        <p className="text-red-500 text-xs mr-auto">⚠️ {postError}</p>
                    )}
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!caption || !imageUrl || uploading || posting}
                        className="rounded-full bg-indigo-600 hover:bg-indigo-700 gap-2 px-6 shadow-md hover:shadow-lg active:scale-95"
                    >
                        {posting ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                        {posting ? 'Posting...' : 'Post'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CreatePost;
