/**
 * Cart Validation Schemas
 */
import { z } from 'zod';

export const cartAddOrUpdateSchema = z.object({
  bookId: z.string().min(1, 'bookId is required'),
  qty: z.number().int().min(1, 'qty must be at least 1').optional()
});

export const cartRemoveSchema = z.object({
  bookId: z.string().min(1, 'bookId is required')
});

// Reuse validate middleware from auth.schema.js
export { validate } from './auth.schema.js';
