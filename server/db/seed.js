import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create database directory if needed
const dbPath = join(__dirname, 'payment.db');
const db = new Database(dbPath);

// Enable WAL mode
db.run('PRAGMA journal_mode = WAL');

// Read and execute seed SQL
const seedSQL = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');

try {
  // Remove single-line comments and split by semicolon
  const statements = seedSQL
    .replace(/--.*$/gm, '')  // Remove -- comments
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    db.run(statement);
  }

  console.log('✅ Database seeded successfully!');

  // Verify data
  const plans = db.query('SELECT * FROM plans').all();
  const coupons = db.query('SELECT * FROM coupons').all();

  console.log('\n📋 Plans:');
  plans.forEach(p => console.log(`   - ${p.name}: ₹${(p.price / 100).toFixed(2)}`));

  console.log('\n🎟️ Coupons:');
  coupons.forEach(c => console.log(`   - ${c.code}: ${c.discount_percent}% off (max ${c.max_uses} uses)`));

  console.log('\n📝 Subscriptions table is empty and ready for data.\n');

} catch (error) {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
} finally {
  db.close();
}
