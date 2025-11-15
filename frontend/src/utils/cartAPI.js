import { http } from './http';

const BASE = '/v1/cart';

export const getCartAPI = () => http.get(BASE);
export const addToCartAPI = (bookId, qty = 1) => http.post(`${BASE}/add`, { bookId: String(bookId), qty });
export const updateCartAPI = (bookId, qty) => http.post(`${BASE}/update`, { bookId: String(bookId), qty });
export const removeFromCartAPI = (bookId) => http.post(`${BASE}/remove`, { bookId: String(bookId) });
export const clearCartAPI = () => http.post(`${BASE}/clear`);
