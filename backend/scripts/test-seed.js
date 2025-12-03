import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedScriptPath = path.join(__dirname, 'seed.js');
const seedOutput = path.join(__dirname, '..', 'data', 'seed.json');

try {
  // run seed (import via file:// URL to support Windows paths)
  await import(pathToFileURL(seedScriptPath).href);
  // verify file exists and has inventory array
  const txt = await fs.readFile(seedOutput, 'utf8');
  const obj = JSON.parse(txt);
  if (!obj || !Array.isArray(obj.inventory) || obj.inventory.length === 0) {
    console.error('Seed verification failed: inventory missing or empty');
    process.exit(1);
  }
  console.log('Seed verification passed');
  process.exit(0);
} catch (err) {
  console.error('Seed verification error:', err.message);
  process.exit(1);
}
