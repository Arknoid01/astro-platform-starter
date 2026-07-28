import Phaser from 'phaser';
import { createGameConfig } from './scenes/BootScene.js';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { DungeonScene } from './scenes/DungeonScene.js';

const config = createGameConfig();
config.scene = [BootScene, PreloadScene, DungeonScene];

// eslint-disable-next-line no-new
new Phaser.Game(config);
