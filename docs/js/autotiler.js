var FLOOR_VARIANT_COUNT = 4;
var WALL_AUTOTILE_COUNT = 16;

function autotileIsOpenNeighbor(tiles, x, y) {
  var height = tiles.length;
  var width = tiles[0] ? tiles[0].length : 0;

  if (y < 0 || y >= height || x < 0 || x >= width) {
    return true;
  }

  return tiles[y][x] !== TILE.WALL;
}

function getWallAutotileIndex(tiles, x, y) {
  var north = autotileIsOpenNeighbor(tiles, x, y - 1);
  var east = autotileIsOpenNeighbor(tiles, x + 1, y);
  var south = autotileIsOpenNeighbor(tiles, x, y + 1);
  var west = autotileIsOpenNeighbor(tiles, x - 1, y);

  return (
    (north ? 1 : 0) |
    (east ? 2 : 0) |
    (south ? 4 : 0) |
    (west ? 8 : 0)
  );
}

function getFloorVariant(x, y, seed) {
  seed = seed || 0;
  var hash = (x * 374761 + y * 668265 + seed * 982451) >>> 0;
  return hash % FLOOR_VARIANT_COUNT;
}

function getTileTextureKey(tiles, x, y, seed) {
  var code = tiles[y][x];

  if (code === TILE.WALL) {
    return 'tile-wall-' + getWallAutotileIndex(tiles, x, y);
  }
  if (code === TILE.STAIRS) {
    return 'tile-stairs';
  }
  if (code === TILE.ENTRANCE) {
    return 'tile-entrance';
  }
  return 'tile-floor-' + getFloorVariant(x, y, seed);
}
