/* global Phaser, TILE_SIZE, TILE, FLOOR_VARIANT_COUNT, WALL_AUTOTILE_COUNT */

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this.scene.start('PreloadScene');
  }
}

class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  create() {
    this.createFloorTextures();
    this.createWallAutotileTextures();
    this.createSpecialTileTextures();
    this.createEntityTexture();
    this.scene.start('DungeonScene');
  }

  createFloorTextures() {
    var baseColors = [0x1a2a3a, 0x1c2e40, 0x182838, 0x1e3244];

    for (var variant = 0; variant < FLOOR_VARIANT_COUNT; variant++) {
      var gfx = this.make.graphics({ add: false });
      gfx.fillStyle(baseColors[variant]);
      gfx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      gfx.fillStyle(0x243448, 0.25 + variant * 0.05);
      gfx.fillRect(2 + variant, 2, TILE_SIZE - 4 - variant, TILE_SIZE - 4);
      gfx.generateTexture('tile-floor-' + variant, TILE_SIZE, TILE_SIZE);
      gfx.destroy();
    }
  }

  createWallAutotileTextures() {
    for (var mask = 0; mask < WALL_AUTOTILE_COUNT; mask++) {
      var north = (mask & 1) !== 0;
      var east = (mask & 2) !== 0;
      var south = (mask & 4) !== 0;
      var west = (mask & 8) !== 0;

      var gfx = this.make.graphics({ add: false });
      gfx.fillStyle(0x3a4a5a);
      gfx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

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

      gfx.lineStyle(2, 0x5a6a7a);
      if (!north) {
        gfx.lineBetween(0, 1, TILE_SIZE, 1);
      }
      if (!west) {
        gfx.lineBetween(1, 0, 1, TILE_SIZE);
      }

      var cornerColor = 0x6a7a8a;
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

      gfx.generateTexture('tile-wall-' + mask, TILE_SIZE, TILE_SIZE);
      gfx.destroy();
    }
  }

  createSpecialTileTextures() {
    var stairs = this.make.graphics({ add: false });
    stairs.fillStyle(0x1a2a3a);
    stairs.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    stairs.fillStyle(0x6a8aba);
    for (var i = 0; i < 4; i++) {
      stairs.fillRect(4 + i * 6, 8 + i * 4, 20 - i * 4, 4);
    }
    stairs.generateTexture('tile-stairs', TILE_SIZE, TILE_SIZE);
    stairs.destroy();

    var entrance = this.make.graphics({ add: false });
    entrance.fillStyle(0x1a2a3a);
    entrance.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    entrance.fillStyle(0x4a8a6a);
    entrance.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, 10);
    entrance.generateTexture('tile-entrance', TILE_SIZE, TILE_SIZE);
    entrance.destroy();
  }

  createEntityTexture() {
    var hero = this.make.graphics({ add: false });
    hero.fillStyle(0x4a9eff);
    hero.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, 12);
    hero.fillStyle(0xffffff);
    hero.fillCircle(TILE_SIZE / 2 - 4, TILE_SIZE / 2 - 2, 3);
    hero.fillCircle(TILE_SIZE / 2 + 4, TILE_SIZE / 2 - 2, 3);
    hero.generateTexture('entity-hero', TILE_SIZE, TILE_SIZE);
    hero.destroy();
  }
}

class DungeonScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DungeonScene' });
    this.tiles = null;
    this.planSeed = 0;
    this.heroCoord = null;
    this.heroSprite = null;
    this.gridOverlay = null;
    this.showGrid = true;
  }

  create() {
    try {
      var plan = pickRandomPlan('test-dungeon', 0);

      this.tiles = plan.tiles;
      this.planSeed = plan.seed;
      this.heroCoord = {
        x: plan.spawnPoints.entrance.x,
        y: plan.spawnPoints.entrance.y,
      };

      this.drawMap();
      this.createGridOverlay();
      this.createHero();
      this.setupCamera();
      this.setupInput();

      this.add
        .text(16, 16, 'Astro RPG', {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#8ab4ff',
        })
        .setScrollFactor(0)
        .setDepth(100);

      this.add
        .text(
          16,
          36,
          'Seed ' +
            plan.seed +
            ' · ' +
            plan.populationMarkers.length +
            ' emplacements · R — nouveau plan',
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
    } catch (error) {
      var message = error && error.message ? error.message : String(error);
      console.error('DungeonScene:', error);
      this.add
        .text(16, 16, 'Erreur : ' + message, {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#ff6b6b',
          wordWrap: { width: 900 },
        })
        .setScrollFactor(0)
        .setDepth(100);
    }
  }

  drawMap() {
    var height = this.tiles.length;
    var width = this.tiles[0].length;

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var texture = getTileTextureKey(this.tiles, x, y, this.planSeed);
        this.add
          .image(x * TILE_SIZE, y * TILE_SIZE, texture)
          .setOrigin(0, 0)
          .setDisplaySize(TILE_SIZE, TILE_SIZE);
      }
    }
  }

  createGridOverlay() {
    var height = this.tiles.length;
    var width = this.tiles[0].length;
    var gfx = this.add.graphics();
    gfx.lineStyle(1, 0xffffff, 0.08);

    for (var x = 0; x <= width; x++) {
      gfx.lineBetween(x * TILE_SIZE, 0, x * TILE_SIZE, height * TILE_SIZE);
    }
    for (var y = 0; y <= height; y++) {
      gfx.lineBetween(0, y * TILE_SIZE, width * TILE_SIZE, y * TILE_SIZE);
    }

    this.gridOverlay = gfx;
    this.gridOverlay.setVisible(this.showGrid);
    this.gridOverlay.setDepth(5);
  }

  createHero() {
    var pos = gridToPixel(TILE_SIZE, this.heroCoord);
    this.heroSprite = this.add.sprite(pos.x, pos.y, 'entity-hero').setDepth(10);
  }

  setupCamera() {
    var mapWidth = this.tiles[0].length * TILE_SIZE;
    var mapHeight = this.tiles.length * TILE_SIZE;
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.heroSprite, true, 0.12, 0.12);
  }

  setupInput() {
    var self = this;
    var passable = [TILE.FLOOR, TILE.ENTRANCE, TILE.STAIRS];

    var keyMap = {
      UP: Phaser.Input.Keyboard.KeyCodes.UP,
      DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
      LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    };

    var dirFromKeys = {};
    dirFromKeys[keyMap.UP] = DIRECTIONS.N;
    dirFromKeys[keyMap.W] = DIRECTIONS.N;
    dirFromKeys[keyMap.DOWN] = DIRECTIONS.S;
    dirFromKeys[keyMap.S] = DIRECTIONS.S;
    dirFromKeys[keyMap.LEFT] = DIRECTIONS.W;
    dirFromKeys[keyMap.A] = DIRECTIONS.W;
    dirFromKeys[keyMap.RIGHT] = DIRECTIONS.E;
    dirFromKeys[keyMap.D] = DIRECTIONS.E;

    if (!this.input.keyboard) {
      return;
    }

    this.input.keyboard.on('keydown', function (event) {
      if (event.code === 'KeyG') {
        self.showGrid = !self.showGrid;
        self.gridOverlay.setVisible(self.showGrid);
        return;
      }

      if (event.code === 'KeyR') {
        self.scene.restart();
        return;
      }

      var dir = dirFromKeys[event.keyCode];
      if (!dir) {
        return;
      }

      var next = {
        x: self.heroCoord.x + dir.x,
        y: self.heroCoord.y + dir.y,
      };

      if (!gridCanStepTo(self.tiles, passable, self.heroCoord, next)) {
        return;
      }

      self.heroCoord = next;
      var pos = gridToPixel(TILE_SIZE, self.heroCoord);
      self.heroSprite.setPosition(pos.x, pos.y);
    });
  }
}
