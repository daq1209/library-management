/**
 * Wishlist Validation Schemas
 */
import { z } from 'zod';

export const wishlistModifySchema = z.object({
  bookId: z.string().min(1, 'bookId is required')
});

// Reuse validate middleware from auth.schema.js to keep things DRY without adding deps
export { validate } from './auth.schema.js';
