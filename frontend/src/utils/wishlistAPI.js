import { http } from './http';

const BASE = '/v1/wishlist';

export const getWishlistAPI = () => http.get(BASE);
export const addToWishlistAPI = (bookId) => http.post(`${BASE}/add`, { bookId: String(bookId) });
export const removeFromWishlistAPI = (bookId) => http.post(`${BASE}/remove`, { bookId: String(bookId) });
export const toggleWishlistAPI = (bookId) => http.post(`${BASE}/toggle`, { bookId: String(bookId) });
