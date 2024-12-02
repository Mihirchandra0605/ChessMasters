import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardHolderName: "",
  errors: {},
  isSubmitted: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    updatePaymentDetails: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    submitPayment: (state) => {
      state.isSubmitted = true;
    },
  },
});

export const { updatePaymentDetails, submitPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
