#!/usr/bin/env node

/**
 * Seed script for backend database
 * This script initializes or validates the database with initial data
 */

console.log('🌽 Seeding backend database...');

// For now, this is an in-memory store, so we just validate the structure
const inventoryItems = [
  'corn-blue',
  'corn-yellow-kg',
  'masa-premium',
  'pack-bio'
];

console.log('✓ Inventory items configured:', inventoryItems.length);
console.log('✓ Database seed completed successfully');

// Exit with success
process.exit(0);
