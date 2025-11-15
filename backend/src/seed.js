/**
 * Database Seed Script
 * 
 * Creates demo users for testing and presentation:
 * - Admin user (full permissions)
 * - Librarian user (staff permissions)
 * 
 * Run with: npm run seed
 */

import { randomUUID } from 'crypto';
import db, { initDB } from './config/db.js';
import { hashPassword } from './utils/hash.js';

const demoUsers = [
  {
    name: 'Admin User',
    email: 'admin@lib.com',
    password: '123456',
    role: 'admin'
  },
  {
    name: 'Librarian Staff',
    email: 'staff@lib.com',
    password: '123456',
    role: 'librarian'
  },
  {
    name: 'Demo Reader',
    email: 'reader@lib.com',
    password: '123456',
    role: 'reader'
  }
];

async function seed() {
  try {
    console.log('\n🌱 Starting database seeding...\n');

    // Initialize database
    await initDB();

  // Ensure collections exist
  db.data.users ||= [];
  db.data.tokens ||= [];
  db.data.wishlists ||= [];
  db.data.carts ||= [];

  // Clear existing data
  db.data.users = [];
  db.data.tokens = [];
  db.data.wishlists = [];
  db.data.carts = [];
    await db.write();
    console.log('✅ Cleared existing data');

    // Create demo users
    const created = [];
    for (const userData of demoUsers) {
      const passwordHash = await hashPassword(userData.password);
      
      const user = {
        id: randomUUID(),
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role,
        createdAt: new Date().toISOString()
      };

      db.data.users.push(user);
      created.push(user);
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    }

    await db.write();

    // Prefill wishlist and cart for Demo Reader
    const reader = created.find(u => u.email === 'reader@lib.com');
    if (reader) {
      db.data.wishlists.push({ userId: reader.id, items: ['1', '5', '10'] });
      db.data.carts.push({ userId: reader.id, items: [ { bookId: '2', qty: 2 }, { bookId: '7', qty: 1 } ] });
      await db.write();
      console.log('✅ Prefilled wishlist and cart for Demo Reader');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Database seeded successfully!');
    console.log('='.repeat(50));
    console.log('\n📋 Demo Credentials:');
    console.log('─'.repeat(50));
    
    demoUsers.forEach(user => {
      console.log(`\n👤 ${user.role.toUpperCase()}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
    });
    
    console.log('\n' + '─'.repeat(50));
    console.log('💡 You can now login with these credentials\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
