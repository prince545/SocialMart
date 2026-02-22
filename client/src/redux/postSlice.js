
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

export const deletePost = createAsyncThunk('posts/deletePost', async ({ id, token }, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const deleteAllPosts = createAsyncThunk('posts/deleteAllPosts', async (token, { rejectWithValue }) => {
    try {
        const res = await axios.delete('/api/posts/all', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data; // Now returns { deletedIds, msg }
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
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(post => post._id !== action.payload);
            })
            .addCase(deleteAllPosts.fulfilled, (state, action) => {
                const deletedIds = action.payload.deletedIds || [];
                if (deletedIds.length > 0) {
                    state.posts = state.posts.filter(p => !deletedIds.includes(p._id));
                } else {
                    // Fallback to clearing all if no IDs returned (backward compatibility)
                    state.posts = [];
                }
                state.error = null;
            })
            .addCase(deleteAllPosts.rejected, (state, action) => {
                state.error = action.payload?.msg || 'Failed to delete all posts';
            });
    }
});

export default postSlice.reducer;
