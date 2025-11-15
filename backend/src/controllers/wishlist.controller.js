/**
 * Wishlist Controller
 */
import db from '../config/db.js';
import { ensureWishlist } from '../utils/collections.js';
import { ApiError } from '../middlewares/error.js';

/**
 * GET /api/v1/wishlist
 * Returns the user's wishlist items
 */
export async function getWishlist(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new ApiError(401, 'Authentication required');

    await db.read();
    const wishlist = ensureWishlist(db, userId);
    await db.write(); // in case it was just created

    return res.json({ items: wishlist.items });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/wishlist/add
 * Body: { bookId }
 * Adds bookId to wishlist if not present
 */
export async function addToWishlist(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { bookId } = req.body;
    if (!userId) throw new ApiError(401, 'Authentication required');

    await db.read();
    const wishlist = ensureWishlist(db, userId);
    const id = String(bookId);
    if (!wishlist.items.includes(id)) {
      wishlist.items.unshift(id);
    }

    await db.write();
    return res.json({ items: wishlist.items });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/wishlist/remove
 * Body: { bookId }
 * Removes bookId from wishlist if present
 */
export async function removeFromWishlist(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { bookId } = req.body;
    if (!userId) throw new ApiError(401, 'Authentication required');

    await db.read();
    const wishlist = ensureWishlist(db, userId);
    const id = String(bookId);
    wishlist.items = wishlist.items.filter(itemId => itemId !== id);

    await db.write();
    return res.json({ items: wishlist.items });
  } catch (err) {
    next(err);
  }
}

/**
 * Optional: toggle wishlist item
 * POST /api/v1/wishlist/toggle
 */
export async function toggleWishlist(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { bookId } = req.body;
    if (!userId) throw new ApiError(401, 'Authentication required');

    await db.read();
    const wishlist = ensureWishlist(db, userId);
    const id = String(bookId);
    if (wishlist.items.includes(id)) {
      wishlist.items = wishlist.items.filter(itemId => itemId !== id);
    } else {
      wishlist.items.unshift(id);
    }

    await db.write();
    return res.json({ items: wishlist.items });
  } catch (err) {
    next(err);
  }
}
