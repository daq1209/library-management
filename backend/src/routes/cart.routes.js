/**
 * Cart Routes
 */
import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { getCart, addToCart, updateCart, removeFromCart, clearCart } from '../controllers/cart.controller.js';
import { cartAddOrUpdateSchema, cartRemoveSchema, validate } from '../schemas/cart.schema.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/add', validate(cartAddOrUpdateSchema), addToCart);
router.post('/update', validate(cartAddOrUpdateSchema), updateCart);
router.post('/remove', validate(cartRemoveSchema), removeFromCart);
router.post('/clear', clearCart);

export default router;
