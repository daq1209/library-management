import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Mỗi item: { ...book, quantity }
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Tăng số lượng (nếu chưa có thì thêm mới với qty = 1)
    addToCart: (state, action) => {
      const book = action.payload;
      const existing = state.cartItems.find((i) => i._id === book._id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        state.cartItems.push({ ...book, quantity: 1 });
      }
    },

    // Giảm số lượng; nếu về 0 thì loại khỏi giỏ
    decrementQty: (state, action) => {
      const id = action.payload;
      const item = state.cartItems.find((i) => i._id === id);
      if (!item) return;
      const next = (item.quantity || 1) - 1;
      if (next <= 0) {
        state.cartItems = state.cartItems.filter((i) => i._id !== id);
      } else {
        item.quantity = next;
      }
    },

    // (Tuỳ chọn) Xoá hẳn 1 sản phẩm khỏi giỏ
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((i) => i._id !== id);
    },
  },
});

export const { addToCart, decrementQty, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
