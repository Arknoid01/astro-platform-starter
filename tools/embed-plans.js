/**
 * Lit les JSON de plans et génère docs/js/plans-data.js (aucun fetch en jeu).
 * Usage (outil dev uniquement) : node tools/embed-plans.js
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const plansDir = join(root, 'src/data/dungeons/test-dungeon/plans');
const outFile = join(root, 'docs/js/plans-data.js');

const plans = [];

for (let i = 0; i < 100; i++) {
  const file = join(plansDir, `floor-0-plan-${i}.json`);
  if (!existsSync(file)) {
    break;
  }
  plans.push(JSON.parse(readFileSync(file, 'utf8')));
}

if (plans.length === 0) {
  console.error('Aucun plan trouvé dans', plansDir);
  process.exit(1);
}

const data = {
  'test-dungeon': {
    0: plans,
  },
};

writeFileSync(
  outFile,
  `/* Données de donjon intégrées — ne pas éditer à la main */\nwindow.DUNGEON_PLANS = ${JSON.stringify(data)};\n`
);

console.log(`✓ ${plans.length} plan(s) → docs/js/plans-data.js`);
