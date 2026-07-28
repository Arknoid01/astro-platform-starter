var DIRECTIONS = {
  N: { x: 0, y: -1 },
  NE: { x: 1, y: -1 },
  E: { x: 1, y: 0 },
  SE: { x: 1, y: 1 },
  S: { x: 0, y: 1 },
  SW: { x: -1, y: 1 },
  W: { x: -1, y: 0 },
  NW: { x: -1, y: -1 },
};

function gridIsInBounds(width, height, coord) {
  return coord.x >= 0 && coord.y >= 0 && coord.x < width && coord.y < height;
}

function gridChebyshevDistance(a, b) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

function gridCanStepTo(matrix, passableCodes, from, to) {
  var height = matrix.length;
  var width = matrix[0] ? matrix[0].length : 0;

  if (!gridIsInBounds(width, height, to)) {
    return false;
  }

  var targetCode = matrix[to.y][to.x];
  if (passableCodes.indexOf(targetCode) === -1) {
    return false;
  }

  if (gridChebyshevDistance(from, to) !== 1) {
    return false;
  }

  if (from.x !== to.x && from.y !== to.y) {
    var corner1 = { x: from.x + (to.x - from.x), y: from.y };
    var corner2 = { x: from.x, y: from.y + (to.y - from.y) };
    return (
      passableCodes.indexOf(matrix[corner1.y][corner1.x]) !== -1 &&
      passableCodes.indexOf(matrix[corner2.y][corner2.x]) !== -1
    );
  }

  return true;
}

function gridToPixel(tileSize, coord) {
  return {
    x: coord.x * tileSize + tileSize / 2,
    y: coord.y * tileSize + tileSize / 2,
  };
}
