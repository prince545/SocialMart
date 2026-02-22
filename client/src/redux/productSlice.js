
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Update getProducts to accept query params
export const getProducts = createAsyncThunk('products/getProducts', async (params = {}, { rejectWithValue }) => {
    try {
        // Construct query string
        const query = new URLSearchParams(params).toString();
        const res = await axios.get(`/api/products?${query}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const getProductDetails = createAsyncThunk('products/getProductDetails', async (id, { rejectWithValue, getState }) => {
    if (!id) return rejectWithValue({ msg: 'Invalid product ID' });
    try {
        const res = await axios.get(`/api/products/${id}`);
        return res.data;
    } catch (err) {
        const payload = err.response?.data || { msg: 'Product not found' };
        // If 404, try to use product from list (e.g. user clicked from marketplace)
        if (err.response?.status === 404) {
            const state = getState();
            const fromList = state.products?.products?.find(p => p._id === id);
            if (fromList) return fromList; // Show product from list as fallback
        }
        return rejectWithValue(payload);
    }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/products/${id}`);
        return id; // Return ID to filter out from state
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const createProduct = createAsyncThunk('products/createProduct', async (productData, { rejectWithValue }) => {
    try {
        const res = await axios.post('/api/products', productData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});


export const createProductReview = createAsyncThunk('products/createProductReview', async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
        await axios.post(`/api/products/${productId}/reviews`, reviewData);
        return productId;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const getStats = createAsyncThunk('products/getStats', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/api/products/stats');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const getCategories = createAsyncThunk('products/getCategories', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/api/products/categories');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const getRecommendations = createAsyncThunk('products/getRecommendations', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/api/ai/recommendations');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const initialState = {
    products: [],
    product: null,
    stats: null,
    categories: [],
    recommendations: [],
    loading: true,
    error: {}
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.loading = false;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear previous error when fetching new product
                state.product = null; // Clear previous product so we don't flash old content
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.product = action.payload;
                state.error = null;
                state.loading = false;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.error = action.payload || { msg: 'Product not found' };
                state.loading = false;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(product => product._id !== action.payload);
            })
            .addCase(createProductReview.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createProductReview.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(getRecommendations.fulfilled, (state, action) => {
                state.recommendations = action.payload;
            });
    }
});

export default productSlice.reducer;
