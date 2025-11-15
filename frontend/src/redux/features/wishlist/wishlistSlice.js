import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWishlistAPI, addToWishlistAPI, removeFromWishlistAPI } from "../../../utils/wishlistAPI";
import { getBooks } from "../../../utils/booksCatalog";

const initialState = {
  items: [], // mỗi item: book object (theo _id)
};

// Load wishlist from server and map to book objects
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, thunkAPI) => {
    const [resp, books] = await Promise.all([getWishlistAPI(), getBooks()]);
    const ids = resp.data.items || [];
    const mapped = ids.map(id => books.find(b => String(b._id) === String(id))).filter(Boolean);
    return mapped;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistBooks: (state, action) => {
      state.items = action.payload || [];
    },
    addToWishlist: (state, action) => {
      const b = action.payload;
      const exists = state.items.some((i) => i._id === b._id);
      if (!exists) {
        state.items.push(b);
      }
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i._id !== id);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.items = action.payload || [];
    });
  }
});

export const { setWishlistBooks, addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
