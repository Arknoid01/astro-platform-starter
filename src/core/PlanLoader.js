import testDungeonConfig from '../data/dungeons/test-dungeon.json';

/**
 * Vite glob keys look like: ../data/dungeons/<id>/plans/floor-0-plan-0.json
 * (relative to this file — not /data/... URLs).
 */
const planModules = import.meta.glob('../data/dungeons/*/plans/*.json', {
  eager: true,
});

/**
 * @typedef {import('./PlanGenerator.js').DungeonPlan} DungeonPlan
 */

/**
 * @typedef {object} DungeonConfig
 * @property {string} name
 * @property {number} floors
 * @property {number} [plansPerFloor]
 * @property {string} tileset
 */

const dungeonConfigs = {
  'test-dungeon': testDungeonConfig,
};

/**
 * @param {string} dungeonId
 * @returns {DungeonConfig}
 */
export function getDungeonConfig(dungeonId) {
  const config = dungeonConfigs[dungeonId];
  if (!config) {
    throw new Error(`Unknown dungeon: ${dungeonId}`);
  }
  return config;
}

/**
 * @param {string} dungeonId
 * @param {number} floorIndex
 * @returns {string[]}
 */
export function listPlanPaths(dungeonId, floorIndex) {
  const needle = `dungeons/${dungeonId}/plans/floor-${floorIndex}-plan-`;
  return Object.keys(planModules).filter((path) => path.includes(needle));
}

/**
 * @param {string} path
 * @returns {DungeonPlan}
 */
export function loadPlanByPath(path) {
  const module = planModules[path];
  if (!module) {
    throw new Error(`Plan not found: ${path}`);
  }
  return module.default;
}

/**
 * @param {string} dungeonId
 * @param {number} floorIndex
 * @param {number} [planIndex]
 * @returns {DungeonPlan}
 */
export function loadPlan(dungeonId, floorIndex, planIndex = 0) {
  const paths = listPlanPaths(dungeonId, floorIndex);
  if (paths.length === 0) {
    throw new Error(`No plans for ${dungeonId} floor ${floorIndex}`);
  }

  const index = Math.min(planIndex, paths.length - 1);
  return loadPlanByPath(paths[index]);
}

/**
 * @param {string} dungeonId
 * @param {number} floorIndex
 * @param {() => number} [random]
 * @returns {DungeonPlan}
 */
export function pickRandomPlan(dungeonId, floorIndex, random = Math.random) {
  const paths = listPlanPaths(dungeonId, floorIndex);
  if (paths.length === 0) {
    throw new Error(
      `No plans for ${dungeonId} floor ${floorIndex} (checked ${Object.keys(planModules).length} glob entries)`
    );
  }

  const index = Math.floor(random() * paths.length);
  return loadPlanByPath(paths[index]);
}
