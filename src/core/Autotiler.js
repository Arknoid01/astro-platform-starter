import { TILE } from '../data/constants.js';

/** Number of floor visual variants */
export const FLOOR_VARIANT_COUNT = 4;

/** Wall autotile indices: 4-bit mask (N=1, E=2, S=4, W=8) — floor adjacent on that side */
export const WALL_AUTOTILE_COUNT = 16;

/**
 * @param {number[][]} tiles
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
function isOpenNeighbor(tiles, x, y) {
  const height = tiles.length;
  const width = tiles[0]?.length ?? 0;

  if (y < 0 || y >= height || x < 0 || x >= width) {
    return true;
  }

  return tiles[y][x] !== TILE.WALL;
}

/**
 * Cardinal bitmask for wall autotiling (floor on adjacent side → bit set).
 * @param {number[][]} tiles
 * @param {number} x
 * @param {number} y
 * @returns {number} 0–15
 */
export function getWallAutotileIndex(tiles, x, y) {
  const north = isOpenNeighbor(tiles, x, y - 1);
  const east = isOpenNeighbor(tiles, x + 1, y);
  const south = isOpenNeighbor(tiles, x, y + 1);
  const west = isOpenNeighbor(tiles, x - 1, y);

  return (
    (north ? 1 : 0) |
    (east ? 2 : 0) |
    (south ? 4 : 0) |
    (west ? 8 : 0)
  );
}

/**
 * Deterministic floor variant for visual variety.
 * @param {number} x
 * @param {number} y
 * @param {number} [seed]
 * @returns {number} 0–3
 */
export function getFloorVariant(x, y, seed = 0) {
  const hash = (x * 374761 + y * 668265 + seed * 982451) >>> 0;
  return hash % FLOOR_VARIANT_COUNT;
}

/**
 * Texture key for a logical tile at render time.
 * @param {number[][]} tiles
 * @param {number} x
 * @param {number} y
 * @param {number} [seed]
 * @returns {string}
 */
export function getTileTextureKey(tiles, x, y, seed = 0) {
  const code = tiles[y][x];

  switch (code) {
    case TILE.WALL:
      return `tile-wall-${getWallAutotileIndex(tiles, x, y)}`;
    case TILE.STAIRS:
      return 'tile-stairs';
    case TILE.ENTRANCE:
      return 'tile-entrance';
    case TILE.FLOOR:
    default:
      return `tile-floor-${getFloorVariant(x, y, seed)}`;
  }
}
