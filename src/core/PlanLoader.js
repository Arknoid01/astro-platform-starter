import testDungeonConfig from '../data/dungeons/test-dungeon.json';

/** Vite glob — all plan JSON files under dungeons */
const planModules = import.meta.glob('../data/dungeons/*/plans/*.json', {
  eager: false,
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
  const prefix = `/data/dungeons/${dungeonId}/plans/floor-${floorIndex}-plan-`;
  return Object.keys(planModules).filter((path) => path.includes(prefix));
}

/**
 * @param {string} path
 * @returns {Promise<DungeonPlan>}
 */
export async function loadPlanByPath(path) {
  const loader = planModules[path];
  if (!loader) {
    throw new Error(`Plan not found: ${path}`);
  }
  const module = await loader();
  return module.default;
}

/**
 * @param {string} dungeonId
 * @param {number} floorIndex
 * @param {number} [planIndex]
 * @returns {Promise<DungeonPlan>}
 */
export async function loadPlan(dungeonId, floorIndex, planIndex = 0) {
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
 * @returns {Promise<DungeonPlan>}
 */
export async function pickRandomPlan(dungeonId, floorIndex, random = Math.random) {
  const paths = listPlanPaths(dungeonId, floorIndex);
  if (paths.length === 0) {
    throw new Error(`No plans for ${dungeonId} floor ${floorIndex}`);
  }

  const index = Math.floor(random() * paths.length);
  return loadPlanByPath(paths[index]);
}
