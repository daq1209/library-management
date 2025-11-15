/**
 * Collection helpers for per-user wishlist and cart documents
 * Ensures exactly one wishlist and one cart per user.
 */

/**
 * Ensure wishlist document exists for a user.
 * @param {import('lowdb').Low} db - LowDB instance
 * @param {string} userId - User ID
 * @returns {{ userId: string, items: string[] }} The wishlist document (by reference)
 */
export function ensureWishlist(db, userId) {
  db.data.wishlists ||= [];
  let doc = db.data.wishlists.find(w => w.userId === userId);
  if (!doc) {
    doc = { userId, items: [] };
    db.data.wishlists.push(doc);
  }
  return doc;
}

/**
 * Ensure cart document exists for a user.
 * @param {import('lowdb').Low} db - LowDB instance
 * @param {string} userId - User ID
 * @returns {{ userId: string, items: Array<{bookId: string, qty: number}> }} The cart document (by reference)
 */
export function ensureCart(db, userId) {
  db.data.carts ||= [];
  let doc = db.data.carts.find(c => c.userId === userId);
  if (!doc) {
    doc = { userId, items: [] };
    db.data.carts.push(doc);
  }
  return doc;
}
