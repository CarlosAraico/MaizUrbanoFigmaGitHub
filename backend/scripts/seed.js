import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const outFile = path.join(dataDir, 'seed.json');

const seedData = {
  inventory: [
    { id: 'corn-blue', qty: 120 },
    { id: 'corn-yellow-kg', qty: 140 },
    { id: 'masa-premium', qty: 80 },
    { id: 'pack-bio', qty: 200 }
  ],
  processed: []
};

fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(seedData, null, 2), 'utf8');
console.log(`Wrote seed data to ${outFile}`);

export default seedData;
