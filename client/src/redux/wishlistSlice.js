import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWishlist = createAsyncThunk('wishlist/getWishlist', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/api/wishlist');
        return res.data.products || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || { msg: 'Failed to fetch wishlist' });
    }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (productId, { rejectWithValue }) => {
    try {
        const res = await axios.post(`/api/wishlist/${productId}`);
        return res.data.products || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || { msg: 'Failed to add to wishlist' });
    }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`/api/wishlist/${productId}`);
        return res.data.products || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || { msg: 'Failed to remove from wishlist' });
    }
});

const initialState = {
    items: [],
    loading: false,
    error: null
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
            });
    }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
