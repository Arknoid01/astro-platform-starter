function pickRandomPlan(dungeonId, floorIndex) {
  var dungeon = window.DUNGEON_PLANS[dungeonId];
  if (!dungeon) {
    throw new Error('Donjon inconnu : ' + dungeonId);
  }

  var plans = dungeon[floorIndex];
  if (!plans || plans.length === 0) {
    throw new Error('Aucun plan pour ' + dungeonId + ' étage ' + floorIndex);
  }

  var index = Math.floor(Math.random() * plans.length);
  return plans[index];
}
