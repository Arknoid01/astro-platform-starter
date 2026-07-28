/** Tile codes — miroir de docs/js/constants.js */
const TILE = { FLOOR: 0, WALL: 1, STAIRS: 2, ENTRANCE: 3 };

const PASSABLE = [TILE.FLOOR, TILE.ENTRANCE, TILE.STAIRS];

function manhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Seeded PRNG (mulberry32).
 * @param {number} seed
 */
export function createRng(seed) {
  let state = seed >>> 0;

  return {
    next() {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    int(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    pick(array) {
      return array[this.int(0, array.length - 1)];
    },
  };
}

/**
 * @param {number} width
 * @param {number} height
 * @returns {number[][]}
 */
function createWallGrid(width, height) {
  return Array.from({ length: height }, () => Array(width).fill(TILE.WALL));
}

/**
 * @param {number[][]} tiles
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} code
 */
function carveRect(tiles, x, y, w, h, code) {
  const height = tiles.length;
  const width = tiles[0].length;

  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const ty = y + dy;
      const tx = x + dx;
      if (ty >= 0 && ty < height && tx >= 0 && tx < width) {
        tiles[ty][tx] = code;
      }
    }
  }
}

/**
 * @param {number[][]} tiles
 * @param {number} x1
 * @param {number} x2
 * @param {number} y
 * @param {number} corridorWidth
 */
function carveHorizontalCorridor(tiles, x1, x2, y, corridorWidth) {
  const start = Math.min(x1, x2);
  const end = Math.max(x1, x2);
  const half = Math.floor(corridorWidth / 2);

  for (let x = start; x <= end; x++) {
    for (let offset = -half; offset < corridorWidth - half; offset++) {
      const ty = y + offset;
      if (ty >= 0 && ty < tiles.length && x >= 0 && x < tiles[0].length) {
        tiles[ty][x] = TILE.FLOOR;
      }
    }
  }
}

/**
 * @param {number[][]} tiles
 * @param {number} y1
 * @param {number} y2
 * @param {number} x
 * @param {number} corridorWidth
 */
function carveVerticalCorridor(tiles, y1, y2, x, corridorWidth) {
  const start = Math.min(y1, y2);
  const end = Math.max(y1, y2);
  const half = Math.floor(corridorWidth / 2);

  for (let y = start; y <= end; y++) {
    for (let offset = -half; offset < corridorWidth - half; offset++) {
      const tx = x + offset;
      if (y >= 0 && y < tiles.length && tx >= 0 && tx < tiles[0].length) {
        tiles[y][tx] = TILE.FLOOR;
      }
    }
  }
}

/**
 * @param {number[][]} tiles
 * @param {{ x: number, y: number }} from
 * @returns {Set<string>}
 */
function floodFillReachable(tiles, from) {
  const height = tiles.length;
  const width = tiles[0].length;
  const visited = new Set();
  const queue = [from];
  const key = (c) => `${c.x},${c.y}`;

  visited.add(key(from));

  while (queue.length > 0) {
    const current = queue.shift();
    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const next of neighbors) {
      const k = key(next);
      if (visited.has(k)) {
        continue;
      }
      if (next.y < 0 || next.y >= height || next.x < 0 || next.x >= width) {
        continue;
      }
      if (!PASSABLE.includes(tiles[next.y][next.x])) {
        continue;
      }
      visited.add(k);
      queue.push(next);
    }
  }

  return visited;
}

/**
 * @param {number[][]} tiles
 * @param {{ x: number, y: number }} coord
 * @returns {{ x: number, y: number } | null}
 */
function findPassableNear(tiles, coord) {
  const height = tiles.length;
  const width = tiles[0].length;

  if (PASSABLE.includes(tiles[coord.y][coord.x])) {
    return { ...coord };
  }

  for (let radius = 1; radius <= 4; radius++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = coord.x + dx;
        const y = coord.y + dy;
        if (y >= 0 && y < height && x >= 0 && x < width && PASSABLE.includes(tiles[y][x])) {
          return { x, y };
        }
      }
    }
  }

  return null;
}

/**
 * @param {number[][]} tiles
 * @param {{ x0: number, y0: number, x1: number, y1: number }} room
 * @returns {Array<{ x: number, y: number }>}
 */
function collectFloorTilesInRoom(tiles, room) {
  const markers = [];

  for (let y = room.y0; y <= room.y1; y++) {
    for (let x = room.x0; x <= room.x1; x++) {
      if (tiles[y][x] === TILE.FLOOR) {
        markers.push({ x, y });
      }
    }
  }

  return markers;
}

/**
 * @typedef {object} PlanGeneratorOptions
 * @property {number} [width]
 * @property {number} [height]
 * @property {number} [seed]
 * @property {number} [cellCols]
 * @property {number} [cellRows]
 * @property {number} [corridorWidth]
 * @property {number} [maxAttempts]
 */

/**
 * @typedef {object} DungeonPlan
 * @property {number} seed
 * @property {number} width
 * @property {number} height
 * @property {number[][]} tiles
 * @property {{ entrance: { x: number, y: number }, stairs: { x: number, y: number } }} spawnPoints
 * @property {Array<{ x: number, y: number }>} populationMarkers
 */

/**
 * Generate a dungeon floor plan (rooms + corridors, PMD-style).
 * @param {PlanGeneratorOptions} options
 * @returns {DungeonPlan}
 */
export function generatePlan(options = {}) {
  const {
    width = 40,
    height = 30,
    seed = 1,
    cellCols = 4,
    cellRows = 3,
    corridorWidth = 2,
    maxAttempts = 40,
  } = options;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const attemptSeed = seed + attempt;
    const plan = tryGeneratePlan({
      width,
      height,
      seed: attemptSeed,
      cellCols,
      cellRows,
      corridorWidth,
    });

    if (plan) {
      return plan;
    }
  }

  throw new Error(`Failed to generate a valid plan after ${maxAttempts} attempts (base seed ${seed})`);
}

/**
 * @param {object} params
 * @returns {DungeonPlan | null}
 */
function tryGeneratePlan(params) {
  const { width, height, seed, cellCols, cellRows, corridorWidth } = params;
  const rng = createRng(seed);
  const tiles = createWallGrid(width, height);

  const cellWidth = Math.floor(width / cellCols);
  const cellHeight = Math.floor(height / cellRows);

  /** @type {Array<{ cx: number, cy: number, x0: number, y0: number, x1: number, y1: number, center: { x: number, y: number } }>} */
  const rooms = [];

  for (let cy = 0; cy < cellRows; cy++) {
    for (let cx = 0; cx < cellCols; cx++) {
      const marginMax = Math.max(1, Math.floor(Math.min(cellWidth, cellHeight) / 5));
      const margin = 1 + rng.int(0, marginMax);
      const maxRoomW = cellWidth - margin * 2;
      const maxRoomH = cellHeight - margin * 2;

      if (maxRoomW < 3 || maxRoomH < 3) {
        return null;
      }

      const roomW = rng.int(Math.max(3, maxRoomW - 3), maxRoomW);
      const roomH = rng.int(Math.max(3, maxRoomH - 3), maxRoomH);
      const offsetX = rng.int(0, maxRoomW - roomW);
      const offsetY = rng.int(0, maxRoomH - roomH);

      const x0 = cx * cellWidth + margin + offsetX;
      const y0 = cy * cellHeight + margin + offsetY;
      const x1 = x0 + roomW - 1;
      const y1 = y0 + roomH - 1;

      carveRect(tiles, x0, y0, roomW, roomH, TILE.FLOOR);

      rooms.push({
        cx,
        cy,
        x0,
        y0,
        x1,
        y1,
        center: {
          x: Math.floor((x0 + x1) / 2),
          y: Math.floor((y0 + y1) / 2),
        },
      });
    }
  }

  const roomAt = (cx, cy) => rooms.find((r) => r.cx === cx && r.cy === cy);

  for (let cy = 0; cy < cellRows; cy++) {
    for (let cx = 0; cx < cellCols; cx++) {
      const room = roomAt(cx, cy);
      if (!room) {
        continue;
      }

      const east = roomAt(cx + 1, cy);
      if (east) {
        const corridorY = Math.floor((room.center.y + east.center.y) / 2);
        carveHorizontalCorridor(
          tiles,
          room.center.x,
          east.center.x,
          corridorY,
          corridorWidth
        );
        carveVerticalCorridor(
          tiles,
          room.center.y,
          corridorY,
          room.center.x,
          corridorWidth
        );
        carveVerticalCorridor(
          tiles,
          east.center.y,
          corridorY,
          east.center.x,
          corridorWidth
        );
      }

      const south = roomAt(cx, cy + 1);
      if (south) {
        const corridorX = Math.floor((room.center.x + south.center.x) / 2);
        carveVerticalCorridor(
          tiles,
          room.center.y,
          south.center.y,
          corridorX,
          corridorWidth
        );
        carveHorizontalCorridor(
          tiles,
          room.center.x,
          corridorX,
          room.center.y,
          corridorWidth
        );
        carveHorizontalCorridor(
          tiles,
          south.center.x,
          corridorX,
          south.center.y,
          corridorWidth
        );
      }
    }
  }

  let farthestPair = { a: rooms[0], b: rooms[rooms.length - 1], dist: 0 };

  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const dist = manhattanDistance(rooms[i].center, rooms[j].center);
      if (dist > farthestPair.dist) {
        farthestPair = { a: rooms[i], b: rooms[j], dist };
      }
    }
  }

  const entranceRoom = farthestPair.a;
  const stairsRoom = farthestPair.b;

  const entranceCoord = findPassableNear(tiles, entranceRoom.center);
  const stairsCoord = findPassableNear(tiles, stairsRoom.center);

  if (!entranceCoord || !stairsCoord) {
    return null;
  }

  tiles[entranceCoord.y][entranceCoord.x] = TILE.ENTRANCE;
  tiles[stairsCoord.y][stairsCoord.x] = TILE.STAIRS;

  const reachable = floodFillReachable(tiles, entranceCoord);
  const stairsKey = `${stairsCoord.x},${stairsCoord.y}`;

  if (!reachable.has(stairsKey)) {
    return null;
  }

  const populationMarkers = [];

  for (const room of rooms) {
    const markers = collectFloorTilesInRoom(tiles, room);
    for (const marker of markers) {
      if (
        (marker.x === entranceCoord.x && marker.y === entranceCoord.y) ||
        (marker.x === stairsCoord.x && marker.y === stairsCoord.y)
      ) {
        continue;
      }
      populationMarkers.push(marker);
    }
  }

  return {
    seed,
    width,
    height,
    tiles,
    spawnPoints: {
      entrance: entranceCoord,
      stairs: stairsCoord,
    },
    populationMarkers,
  };
}
