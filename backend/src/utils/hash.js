/**
 * Password Hashing Utility
 * 
 * Provides secure password hashing and verification using bcrypt.
 * Uses a salt rounds of 10 for good security/performance balance.
 */

import bcryptjs from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
  return bcryptjs.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against its hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Hashed password to compare against
 * @returns {Promise<boolean>} - True if password matches
 */
export async function verifyPassword(password, hash) {
  return bcryptjs.compare(password, hash);
}
