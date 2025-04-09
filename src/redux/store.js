import { configureStore } from '@reduxjs/toolkit';
import paymentReducer from './paymentSlice';
import userReducer from './userSlice';

// Export store using named export
export const store = configureStore({
  reducer: {
    payment: paymentReducer,
    user: userReducer,
  },
});
