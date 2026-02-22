
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postReducer from './postSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        products: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer
    },
});

export default store;
