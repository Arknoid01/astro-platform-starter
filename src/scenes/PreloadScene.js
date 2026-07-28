import Phaser from 'phaser';
import { TILE_SIZE } from '../data/constants.js';
import {
  FLOOR_VARIANT_COUNT,
  WALL_AUTOTILE_COUNT,
} from '../core/Autotiler.js';

/**
 * Generates placeholder textures until real LoRA tilesets are integrated.
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  create() {
    this.#createFloorTextures();
    this.#createWallAutotileTextures();
    this.#createSpecialTileTextures();
    this.#createEntityTexture();
    this.scene.start('DungeonScene');
  }

  #createFloorTextures() {
    const baseColors = [0x1a2a3a, 0x1c2e40, 0x182838, 0x1e3244];

    for (let variant = 0; variant < FLOOR_VARIANT_COUNT; variant++) {
      const gfx = this.make.graphics({ add: false });
      gfx.fillStyle(baseColors[variant]);
      gfx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      gfx.fillStyle(0x243448, 0.25 + variant * 0.05);
      gfx.fillRect(2 + variant, 2, TILE_SIZE - 4 - variant, TILE_SIZE - 4);
      gfx.generateTexture(`tile-floor-${variant}`, TILE_SIZE, TILE_SIZE);
      gfx.destroy();
    }
  }

  #createWallAutotileTextures() {
    for (let mask = 0; mask < WALL_AUTOTILE_COUNT; mask++) {
      const north = (mask & 1) !== 0;
      const east = (mask & 2) !== 0;
      const south = (mask & 4) !== 0;
      const west = (mask & 8) !== 0;

      const gfx = this.make.graphics({ add: false });
      gfx.fillStyle(0x3a4a5a);
      gfx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

      // Darken sides adjacent to floor (open edges)
      if (north) {
        gfx.fillStyle(0x2a3848);
        gfx.fillRect(0, 0, TILE_SIZE, 6);
      }
      if (east) {
        gfx.fillStyle(0x2a3848);
        gfx.fillRect(TILE_SIZE - 6, 0, 6, TILE_SIZE);
      }
      if (south) {
        gfx.fillStyle(0x2a3848);
        gfx.fillRect(0, TILE_SIZE - 6, TILE_SIZE, 6);
      }
      if (west) {
        gfx.fillStyle(0x2a3848);
        gfx.fillRect(0, 0, 6, TILE_SIZE);
      }

      // Highlight solid faces
      gfx.lineStyle(2, 0x5a6a7a);
      if (!north) {
        gfx.lineBetween(0, 1, TILE_SIZE, 1);
      }
      if (!west) {
        gfx.lineBetween(1, 0, 1, TILE_SIZE);
      }

      // Corner markers for debugging autotile (subtle)
      const cornerColor = 0x6a7a8a;
      if (north && east) {
        gfx.fillStyle(cornerColor, 0.3);
        gfx.fillRect(TILE_SIZE - 4, 0, 4, 4);
      }
      if (north && west) {
        gfx.fillStyle(cornerColor, 0.3);
        gfx.fillRect(0, 0, 4, 4);
      }
      if (south && east) {
        gfx.fillStyle(cornerColor, 0.3);
        gfx.fillRect(TILE_SIZE - 4, TILE_SIZE - 4, 4, 4);
      }
      if (south && west) {
        gfx.fillStyle(cornerColor, 0.3);
        gfx.fillRect(0, TILE_SIZE - 4, 4, 4);
      }

      gfx.generateTexture(`tile-wall-${mask}`, TILE_SIZE, TILE_SIZE);
      gfx.destroy();
    }
  }

  #createSpecialTileTextures() {
    const stairs = this.make.graphics({ add: false });
    stairs.fillStyle(0x1a2a3a);
    stairs.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    stairs.fillStyle(0x6a8aba);
    for (let i = 0; i < 4; i++) {
      stairs.fillRect(4 + i * 6, 8 + i * 4, 20 - i * 4, 4);
    }
    stairs.generateTexture('tile-stairs', TILE_SIZE, TILE_SIZE);
    stairs.destroy();

    const entrance = this.make.graphics({ add: false });
    entrance.fillStyle(0x1a2a3a);
    entrance.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    entrance.fillStyle(0x4a8a6a);
    entrance.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, 10);
    entrance.generateTexture('tile-entrance', TILE_SIZE, TILE_SIZE);
    entrance.destroy();
  }

  #createEntityTexture() {
    const hero = this.make.graphics({ add: false });
    hero.fillStyle(0x4a9eff);
    hero.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, 12);
    hero.fillStyle(0xffffff);
    hero.fillCircle(TILE_SIZE / 2 - 4, TILE_SIZE / 2 - 2, 3);
    hero.fillCircle(TILE_SIZE / 2 + 4, TILE_SIZE / 2 - 2, 3);
    hero.generateTexture('entity-hero', TILE_SIZE, TILE_SIZE);
    hero.destroy();
  }
}
