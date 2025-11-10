import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // mỗi item: book object (theo _id)
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const b = action.payload;
      const exists = state.items.some((i) => i._id === b._id);
      if (!exists) {
        state.items.push(b);
        alert("Đã thêm vào Wishlist");
      } else {
        alert("Sách đã có trong Wishlist");
      }
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i._id !== id);
      alert("Đã xóa khỏi Wishlist");
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
