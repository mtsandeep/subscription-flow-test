import { Database } from 'bun:sqlite';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'db', 'payment.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent access
db.run('PRAGMA journal_mode = WAL');

export default db;

/**
 * Helper function to run database transactions
 * Use this for atomic operations
 *
 * @param {Function} callback - Function that receives db and performs operations
 * @returns {any} Result of the callback
 *
 * @example
 * const result = transaction((db) => {
 *   const user = db.query('SELECT * FROM users WHERE id = ?').get(userId);
 *   db.query('INSERT INTO subscriptions ...').run(...);
 *   return user;
 * });
 */
export function transaction(callback) {
  try {
    db.run('BEGIN');
    const result = callback(db);
    db.run('COMMIT');
    return result;
  } catch (error) {
    db.run('ROLLBACK');
    throw error;
  }
}
