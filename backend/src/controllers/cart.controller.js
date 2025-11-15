/**
 * Cart Controller
 */
import db from '../config/db.js';
import { ensureCart } from '../utils/collections.js';
import { ApiError } from '../middlewares/error.js';

/**
 * GET /api/v1/cart
 */
export async function getCart(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new ApiError(401, 'Authentication required');

    await db.read();
    const cart = ensureCart(db, userId);
    await db.write();
    return res.json({ items: cart.items });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/cart/add
 * Body: { bookId, qty? }
 * If exists, increase qty; else add new with qty>=1
 */
export async function addToCart(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { bookId } = req.body;
    let { qty } = req.body;
    if (!userId) throw new ApiError(401, 'Authentication required');
    qty = Math.max(1, Number(qty || 1));

    await db.read();
    const cart = ensureCart(db, userId);

    const found = cart.items.find(i => i.bookId === bookId);
    if (found) {
      found.qty = Math.max(1, (found.qty || 1) + qty);
    } else {
      cart.items.unshift({ bookId, qty });
    }

    await db.write();
    return res.json({ items: cart.items });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/cart/update
 * Body: { bookId, qty }
 * Sets qty to exact number (>=1)
 */
export async function updateCart(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { bookId, qty } = req.body;
    if (!userId) throw new ApiError(401, 'Authentication required');

    await db.read();
    const cart = ensureCart(db, userId);

    const item = cart.items.find(i => i.bookId === bookId);
    if (item) {
      item.qty = Math.max(1, Number(qty));
    } else {
      // If item doesn't exist, add it with the specified qty
      cart.items.unshift({ bookId, qty: Math.max(1, Number(qty)) });
    }

    await db.write();
    return res.json({ items: cart.items });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/cart/remove
 * Body: { bookId }
 */
export async function removeFromCart(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { bookId } = req.body;
    if (!userId) throw new ApiError(401, 'Authentication required');

    await db.read();
    const cart = ensureCart(db, userId);
    cart.items = cart.items.filter(i => i.bookId !== bookId);
    await db.write();
    return res.json({ items: cart.items });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/cart/clear
 */
export async function clearCart(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new ApiError(401, 'Authentication required');

    await db.read();
    const cart = ensureCart(db, userId);
    cart.items = [];
    await db.write();
    return res.json({ items: cart.items });
  } catch (err) {
    next(err);
  }
}
