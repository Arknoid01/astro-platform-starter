/**
 * Vite marks the IIFE bundle as type="module" — browsers block that on file://.
 * This post-step produces a classic <script> tag for double-click / offline play.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const htmlPath = join(import.meta.dirname, '..', 'dist', 'index.html');
let html = readFileSync(htmlPath, 'utf8');

html = html.replace(
  /<script type="module" crossorigin src="(\.\/game\.js)"><\/script>/,
  '<script src="$1"></script>'
);

// Fallback if Vite changes attribute order
html = html.replace(/type="module"\s*/g, '');
html = html.replace(/\scrossorigin/g, '');

writeFileSync(htmlPath, html);
console.log('dist/index.html → script classique (compatible file://)');
