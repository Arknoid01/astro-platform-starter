/**
 * Opens standalone/index.html in the default browser after build:standalone.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'standalone', 'index.html');

if (!existsSync(htmlPath)) {
  console.error('standalone/index.html introuvable — lancez npm run build:standalone');
  process.exit(1);
}

const platform = process.platform;
/** @type {string} */
let command;
/** @type {string[]} */
let args;

if (platform === 'darwin') {
  command = 'open';
  args = [htmlPath];
} else if (platform === 'win32') {
  command = 'cmd';
  args = ['/c', 'start', '', htmlPath];
} else {
  command = 'xdg-open';
  args = [htmlPath];
}

const child = spawn(command, args, { stdio: 'inherit', shell: platform === 'win32' });
child.on('error', (error) => {
  console.error(`Impossible d'ouvrir le navigateur: ${error.message}`);
  console.log(`Ouvrez ce fichier manuellement : ${htmlPath}`);
});
