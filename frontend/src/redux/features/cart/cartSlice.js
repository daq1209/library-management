import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCartAPI } from "../../../utils/cartAPI";
import { getBooks } from "../../../utils/booksCatalog";

const initialState = {
  // Mỗi item: { ...book, quantity }
  cartItems: [],
};

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async () => {
    const [resp, books] = await Promise.all([getCartAPI(), getBooks()]);
    const items = resp.data.items || [];
    // Map { bookId, qty } -> { ...book, quantity: qty }
    const mapped = items.map(({ bookId, qty }) => {
      const book = books.find(b => String(b._id) === String(bookId));
      return book ? { ...book, quantity: qty || 1 } : null;
    }).filter(Boolean);
    return mapped;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartBooks: (state, action) => {
      state.cartItems = action.payload || [];
    },
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
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cartItems = action.payload || [];
    });
  }
});

export const { setCartBooks, addToCart, decrementQty, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
