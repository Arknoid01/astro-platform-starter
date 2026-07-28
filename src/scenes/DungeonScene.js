import Phaser from 'phaser';
import { TILE, TILE_SIZE } from '../data/constants.js';
import { canStepTo, gridToPixel, DIRECTIONS } from '../core/Grid.js';
import { getTileTextureKey } from '../core/Autotiler.js';
import { pickRandomPlan } from '../core/PlanLoader.js';

const KEY_MAP = {
  UP: Phaser.Input.Keyboard.KeyCodes.UP,
  DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
  LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
  RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
  W: Phaser.Input.Keyboard.KeyCodes.W,
  A: Phaser.Input.Keyboard.KeyCodes.A,
  S: Phaser.Input.Keyboard.KeyCodes.S,
  D: Phaser.Input.Keyboard.KeyCodes.D,
};

const DIR_FROM_KEYS = {
  [KEY_MAP.UP]: DIRECTIONS.N,
  [KEY_MAP.W]: DIRECTIONS.N,
  [KEY_MAP.DOWN]: DIRECTIONS.S,
  [KEY_MAP.S]: DIRECTIONS.S,
  [KEY_MAP.LEFT]: DIRECTIONS.W,
  [KEY_MAP.A]: DIRECTIONS.W,
  [KEY_MAP.RIGHT]: DIRECTIONS.E,
  [KEY_MAP.D]: DIRECTIONS.E,
};

const PASSABLE_TILES = [TILE.FLOOR, TILE.ENTRANCE, TILE.STAIRS];

/**
 * Milestone 2: plan loading + autotiled wall rendering.
 */
export class DungeonScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DungeonScene' });
  }

  /** @type {number[][]} */
  #tiles;

  /** @type {number} */
  #planSeed = 0;

  /** @type {{ x: number, y: number }} */
  #heroCoord;

  /** @type {Phaser.GameObjects.Sprite} */
  #heroSprite;

  /** @type {Phaser.GameObjects.Graphics} */
  #gridOverlay;

  /** @type {Phaser.GameObjects.Text} */
  #infoText;

  /** @type {boolean} */
  #showGrid = true;

  async create() {
    const plan = await pickRandomPlan('test-dungeon', 0);

    this.#tiles = plan.tiles;
    this.#planSeed = plan.seed;
    this.#heroCoord = { ...plan.spawnPoints.entrance };

    this.#drawMap();
    this.#createGridOverlay();
    this.#createHero();
    this.#setupCamera();
    this.#setupInput();

    this.add
      .text(16, 16, 'Astro RPG — Jalon 2', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#8ab4ff',
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.#infoText = this.add
      .text(
        16,
        36,
        `Seed ${plan.seed} · ${plan.populationMarkers.length} emplacements · R — nouveau plan`,
        {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#6a7a8a',
        }
      )
      .setScrollFactor(0)
      .setDepth(100);

    this.add
      .text(16, 54, 'Flèches / WASD · G — grille', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#6a7a8a',
      })
      .setScrollFactor(0)
      .setDepth(100);
  }

  #drawMap() {
    const height = this.#tiles.length;
    const width = this.#tiles[0].length;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const texture = getTileTextureKey(this.#tiles, x, y, this.#planSeed);
        this.add
          .image(x * TILE_SIZE, y * TILE_SIZE, texture)
          .setOrigin(0, 0)
          .setDisplaySize(TILE_SIZE, TILE_SIZE);
      }
    }
  }

  #createGridOverlay() {
    const height = this.#tiles.length;
    const width = this.#tiles[0].length;
    const gfx = this.add.graphics();
    gfx.lineStyle(1, 0xffffff, 0.08);

    for (let x = 0; x <= width; x++) {
      gfx.lineBetween(x * TILE_SIZE, 0, x * TILE_SIZE, height * TILE_SIZE);
    }
    for (let y = 0; y <= height; y++) {
      gfx.lineBetween(0, y * TILE_SIZE, width * TILE_SIZE, y * TILE_SIZE);
    }

    this.#gridOverlay = gfx;
    this.#gridOverlay.setVisible(this.#showGrid);
    this.#gridOverlay.setDepth(5);
  }

  #createHero() {
    const pos = gridToPixel(TILE_SIZE, this.#heroCoord);
    this.#heroSprite = this.add
      .sprite(pos.x, pos.y, 'entity-hero')
      .setDepth(10);
  }

  #setupCamera() {
    const mapWidth = this.#tiles[0].length * TILE_SIZE;
    const mapHeight = this.#tiles.length * TILE_SIZE;
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.#heroSprite, true, 0.12, 0.12);
  }

  #setupInput() {
    if (!this.input.keyboard) {
      return;
    }

    this.input.keyboard.on('keydown', (event) => {
      if (event.code === 'KeyG') {
        this.#showGrid = !this.#showGrid;
        this.#gridOverlay.setVisible(this.#showGrid);
        return;
      }

      if (event.code === 'KeyR') {
        this.scene.restart();
        return;
      }

      const dir = DIR_FROM_KEYS[event.keyCode];
      if (!dir) {
        return;
      }

      this.#tryMove(dir);
    });
  }

  /**
   * @param {{ x: number, y: number }} dir
   */
  #tryMove(dir) {
    const next = {
      x: this.#heroCoord.x + dir.x,
      y: this.#heroCoord.y + dir.y,
    };

    if (!canStepTo(this.#tiles, PASSABLE_TILES, this.#heroCoord, next)) {
      return;
    }

    this.#heroCoord = next;
    const pos = gridToPixel(TILE_SIZE, this.#heroCoord);
    this.#heroSprite.setPosition(pos.x, pos.y);
  }
}
