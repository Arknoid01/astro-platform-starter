import Phaser from 'phaser';
import { TILE, TILE_SIZE } from '../data/constants.js';
import { canStepTo, gridToPixel, DIRECTIONS } from '../core/Grid.js';
import planData from '../data/dungeons/test-dungeon/plans/floor-0-plan-0.json';

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

const TILE_TEXTURE = {
  [TILE.FLOOR]: 'tile-floor',
  [TILE.WALL]: 'tile-wall',
  [TILE.STAIRS]: 'tile-stairs',
  [TILE.ENTRANCE]: 'tile-entrance',
};

const PASSABLE_TILES = [TILE.FLOOR, TILE.ENTRANCE, TILE.STAIRS];

/**
 * Milestone 1: static tileset rendering + single-entity grid movement.
 */
export class DungeonScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DungeonScene' });
  }

  /** @type {number[][]} */
  #tiles;

  /** @type {{ x: number, y: number }} */
  #heroCoord;

  /** @type {Phaser.GameObjects.Sprite} */
  #heroSprite;

  /** @type {Phaser.GameObjects.Graphics} */
  #gridOverlay;

  /** @type {boolean} */
  #showGrid = true;

  /** @type {Phaser.Input.Keyboard.Key[]} */
  #moveKeys;

  create() {
    this.#tiles = planData.tiles;
    this.#heroCoord = { ...planData.spawnPoints.entrance };

    this.#drawMap();
    this.#createGridOverlay();
    this.#createHero();
    this.#setupCamera();
    this.#setupInput();

    this.add
      .text(16, 16, 'Astro RPG — Jalon 1', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#8ab4ff',
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.add
      .text(16, 36, 'Flèches / WASD — une case par action · G — grille', {
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
        const code = this.#tiles[y][x];
        const texture = TILE_TEXTURE[code] ?? 'tile-floor';
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

    this.#moveKeys = this.input.keyboard.addKeys({
      up: KEY_MAP.UP,
      down: KEY_MAP.DOWN,
      left: KEY_MAP.LEFT,
      right: KEY_MAP.RIGHT,
      w: KEY_MAP.W,
      a: KEY_MAP.A,
      s: KEY_MAP.S,
      d: KEY_MAP.D,
      g: Phaser.Input.Keyboard.KeyCodes.G,
    });

    this.input.keyboard.on('keydown', (event) => {
      if (event.code === 'KeyG') {
        this.#showGrid = !this.#showGrid;
        this.#gridOverlay.setVisible(this.#showGrid);
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
