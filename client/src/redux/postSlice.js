
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const getPosts = createAsyncThunk('posts/getPosts', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/api/posts');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const addPost = createAsyncThunk('posts/addPost', async (formData, { rejectWithValue }) => {
    try {
        const res = await axios.post('/api/posts', formData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const addLike = createAsyncThunk('posts/addLike', async (id, { rejectWithValue }) => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`, null);
        return { id, likes: res.data };
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const addComment = createAsyncThunk('posts/addComment', async ({ postId, formData }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`/api/posts/comment/${postId}`, formData);
        return { postId, comments: res.data };
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const initialState = {
    posts: [],
    post: null,
    loading: true,
    posting: false,
    postError: null,
    error: {}
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.loading = false;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(addPost.pending, (state) => {
                state.posting = true;
                state.postError = null;
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
                state.posting = false;
                state.postError = null;
            })
            .addCase(addPost.rejected, (state, action) => {
                state.posting = false;
                state.postError = action.payload?.msg || 'Failed to create post';
            })
            .addCase(addLike.fulfilled, (state, action) => {
                state.posts = state.posts.map(post =>
                    post._id === action.payload.id ? { ...post, likes: action.payload.likes } : post
                );
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.posts = state.posts.map(post =>
                    post._id === action.payload.postId ? { ...post, comments: action.payload.comments } : post
                );
            });
    }
});

export default postSlice.reducer;
