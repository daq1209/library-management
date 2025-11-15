/**
 * Wishlist Routes
 */
import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { getWishlist, addToWishlist, removeFromWishlist, toggleWishlist } from '../controllers/wishlist.controller.js';
import { wishlistModifySchema, validate } from '../schemas/wishlist.schema.js';

const router = express.Router();

// Protect all wishlist routes
router.use(authenticate);

router.get('/', getWishlist);
router.post('/add', validate(wishlistModifySchema), addToWishlist);
router.post('/remove', validate(wishlistModifySchema), removeFromWishlist);
// Optional toggle for convenience
router.post('/toggle', validate(wishlistModifySchema), toggleWishlist);

export default router;
