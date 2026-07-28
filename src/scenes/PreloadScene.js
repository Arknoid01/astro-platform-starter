import Phaser from 'phaser';
import { TILE_SIZE } from '../data/constants.js';

/**
 * Generates placeholder textures until real LoRA tilesets are integrated.
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  create() {
    this.#createTileTextures();
    this.#createEntityTexture();
    this.scene.start('DungeonScene');
  }

  #createTileTextures() {
    const floor = this.make.graphics({ add: false });
    floor.fillStyle(0x1a2a3a);
    floor.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    floor.fillStyle(0x243448, 0.4);
    floor.fillRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4);
    floor.generateTexture('tile-floor', TILE_SIZE, TILE_SIZE);
    floor.destroy();

    const wall = this.make.graphics({ add: false });
    wall.fillStyle(0x3a4a5a);
    wall.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    wall.lineStyle(2, 0x5a6a7a);
    wall.strokeRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);
    wall.fillStyle(0x2a3a4a);
    wall.fillRect(4, 4, TILE_SIZE - 8, TILE_SIZE - 8);
    wall.generateTexture('tile-wall', TILE_SIZE, TILE_SIZE);
    wall.destroy();

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
