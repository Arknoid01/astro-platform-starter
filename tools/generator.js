/**
 * Offline dungeon plan generator.
 *
 * Usage:
 *   node tools/generator.js
 *   node tools/generator.js --dungeon test-dungeon --floor 0 --count 10
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generatePlan } from '../src/core/PlanGenerator.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function parseArgs(argv) {
  const options = {
    dungeon: 'test-dungeon',
    floor: 0,
    count: 10,
    width: 48,
    height: 36,
    cellCols: 4,
    cellRows: 3,
    corridorWidth: 2,
    baseSeed: 1000,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    switch (arg) {
      case '--dungeon':
        options.dungeon = next;
        i++;
        break;
      case '--floor':
        options.floor = Number(next);
        i++;
        break;
      case '--count':
        options.count = Number(next);
        i++;
        break;
      case '--width':
        options.width = Number(next);
        i++;
        break;
      case '--height':
        options.height = Number(next);
        i++;
        break;
      case '--seed':
        options.baseSeed = Number(next);
        i++;
        break;
      default:
        break;
    }
  }

  return options;
}

const options = parseArgs(process.argv);
const outDir = join(
  rootDir,
  'src/data/dungeons',
  options.dungeon,
  'plans'
);

mkdirSync(outDir, { recursive: true });

let written = 0;

for (let i = 0; i < options.count; i++) {
  const seed = options.baseSeed + i * 137;
  const plan = generatePlan({
    width: options.width,
    height: options.height,
    seed,
    cellCols: options.cellCols,
    cellRows: options.cellRows,
    corridorWidth: options.corridorWidth,
  });

  const filename = `floor-${options.floor}-plan-${i}.json`;
  const filepath = join(outDir, filename);

  writeFileSync(filepath, JSON.stringify(plan, null, 2));
  written++;
  console.log(`✓ ${filename} (seed ${plan.seed}, ${plan.populationMarkers.length} markers)`);
}

console.log(`\nGenerated ${written} plan(s) in ${outDir}`);
