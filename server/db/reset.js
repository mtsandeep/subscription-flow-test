import { existsSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'payment.db');
const walPath = join(__dirname, 'payment.db-wal');
const shmPath = join(__dirname, 'payment.db-shm');

const filesToDelete = [dbPath, walPath, shmPath];

for (const file of filesToDelete) {
  if (existsSync(file)) {
    unlinkSync(file);
    console.log(`🗑️  Deleted: ${file}`);
  }
}

console.log('✅ Database reset complete. Run `bun db:seed` to re-seed.\n');
