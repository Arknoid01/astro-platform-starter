/**
 * Pure grid logic — no Phaser imports.
 * Handles coordinates, neighbors, line of sight, and diagonal corner rules.
 */

export const DIRECTIONS = {
  N: { x: 0, y: -1 },
  NE: { x: 1, y: -1 },
  E: { x: 1, y: 0 },
  SE: { x: 1, y: 1 },
  S: { x: 0, y: 1 },
  SW: { x: -1, y: 1 },
  W: { x: -1, y: 0 },
  NW: { x: -1, y: -1 },
};

export const CARDINAL_DIRECTIONS = [
  DIRECTIONS.N,
  DIRECTIONS.E,
  DIRECTIONS.S,
  DIRECTIONS.W,
];

export const ALL_DIRECTIONS = Object.values(DIRECTIONS);

/**
 * @param {number} x
 * @param {number} y
 * @returns {{ x: number, y: number }}
 */
export function createCoord(x, y) {
  return { x, y };
}

/**
 * @param {{ x: number, y: number }} a
 * @param {{ x: number, y: number }} b
 * @returns {boolean}
 */
export function coordsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

/**
 * Manhattan distance between two grid cells.
 * @param {{ x: number, y: number }} a
 * @param {{ x: number, y: number }} b
 * @returns {number}
 */
export function manhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Chebyshev distance (8-direction movement cost).
 * @param {{ x: number, y: number }} a
 * @param {{ x: number, y: number }} b
 * @returns {number}
 */
export function chebyshevDistance(a, b) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

/**
 * @param {number} width
 * @param {number} height
 * @param {{ x: number, y: number }} coord
 * @returns {boolean}
 */
export function isInBounds(width, height, coord) {
  return coord.x >= 0 && coord.y >= 0 && coord.x < width && coord.y < height;
}

/**
 * @param {number[][]} matrix Tile codes indexed [y][x]
 * @param {number} walkableCode Tile code considered passable
 * @param {{ x: number, y: number }} coord
 * @returns {boolean}
 */
export function isWalkable(matrix, walkableCode, coord) {
  const height = matrix.length;
  const width = matrix[0]?.length ?? 0;
  if (!isInBounds(width, height, coord)) {
    return false;
  }
  return matrix[coord.y][coord.x] === walkableCode;
}

/**
 * Returns cardinal and diagonal neighbors within bounds.
 * @param {number} width
 * @param {number} height
 * @param {{ x: number, y: number }} coord
 * @param {boolean} includeDiagonals
 * @returns {Array<{ x: number, y: number }>}
 */
export function getNeighbors(width, height, coord, includeDiagonals = true) {
  const dirs = includeDiagonals ? ALL_DIRECTIONS : CARDINAL_DIRECTIONS;
  const neighbors = [];

  for (const dir of dirs) {
    const next = { x: coord.x + dir.x, y: coord.y + dir.y };
    if (isInBounds(width, height, next)) {
      neighbors.push(next);
    }
  }

  return neighbors;
}

/**
 * Diagonal moves are forbidden if they cut through a wall corner.
 * @param {number[][]} matrix
 * @param {number} walkableCode
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} to
 * @returns {boolean}
 */
export function canMoveDiagonally(matrix, walkableCode, from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx === 0 || dy === 0) {
    return true;
  }

  const corner1 = { x: from.x + dx, y: from.y };
  const corner2 = { x: from.x, y: from.y + dy };

  return (
    isWalkable(matrix, walkableCode, corner1) &&
    isWalkable(matrix, walkableCode, corner2)
  );
}

/**
 * @param {number[][]} matrix
 * @param {number} walkableCode
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} to
 * @returns {boolean}
 */
export function canStep(matrix, walkableCode, from, to) {
  if (!isWalkable(matrix, walkableCode, to)) {
    return false;
  }

  const dist = chebyshevDistance(from, to);
  if (dist !== 1) {
    return false;
  }

  if (from.x !== to.x && from.y !== to.y) {
    return canMoveDiagonally(matrix, walkableCode, from, to);
  }

  return true;
}

/**
 * Like canStep but accepts any passable tile code.
 * @param {number[][]} matrix
 * @param {number[]} passableCodes
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} to
 * @returns {boolean}
 */
export function canStepTo(matrix, passableCodes, from, to) {
  const height = matrix.length;
  const width = matrix[0]?.length ?? 0;
  if (!isInBounds(width, height, to)) {
    return false;
  }

  const targetCode = matrix[to.y][to.x];
  if (!passableCodes.includes(targetCode)) {
    return false;
  }

  const dist = chebyshevDistance(from, to);
  if (dist !== 1) {
    return false;
  }

  if (from.x !== to.x && from.y !== to.y) {
    const corner1 = { x: from.x + (to.x - from.x), y: from.y };
    const corner2 = { x: from.x, y: from.y + (to.y - from.y) };
    const cornerPassable = (coord) =>
      passableCodes.includes(matrix[coord.y][coord.x]);
    return cornerPassable(corner1) && cornerPassable(corner2);
  }

  return true;
}

/**
 * Bresenham line of sight on the grid.
 * @param {number[][]} matrix
 * @param {number} blockingCode Tile code that blocks sight
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} to
 * @returns {boolean}
 */
export function hasLineOfSight(matrix, blockingCode, from, to) {
  let x0 = from.x;
  let y0 = from.y;
  const x1 = to.x;
  const y1 = to.y;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    if (x0 === x1 && y0 === y1) {
      break;
    }

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }

    if (x0 === x1 && y0 === y1) {
      break;
    }

    if (matrix[y0]?.[x0] === blockingCode) {
      return false;
    }
  }

  return true;
}

/**
 * Convert grid coordinates to pixel center position.
 * @param {number} tileSize
 * @param {{ x: number, y: number }} coord
 * @returns {{ x: number, y: number }}
 */
export function gridToPixel(tileSize, coord) {
  return {
    x: coord.x * tileSize + tileSize / 2,
    y: coord.y * tileSize + tileSize / 2,
  };
}

/**
 * @param {number} tileSize
 * @param {number} pixelX
 * @param {number} pixelY
 * @returns {{ x: number, y: number }}
 */
export function pixelToGrid(tileSize, pixelX, pixelY) {
  return {
    x: Math.floor(pixelX / tileSize),
    y: Math.floor(pixelY / tileSize),
  };
}
