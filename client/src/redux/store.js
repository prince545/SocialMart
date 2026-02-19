
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postReducer from './postSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        products: productReducer,
        cart: cartReducer
    },
});

export default store;
