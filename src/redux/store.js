import { configureStore } from "@reduxjs/toolkit";
import paymentReducer from "./paymentSlice";

export const store = configureStore({
  reducer: {
    payment: paymentReducer,
  },
});
