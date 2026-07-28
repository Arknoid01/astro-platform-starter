/**
 * Lightweight event bus for cross-scene communication (e.g. UIScene ↔ DungeonScene).
 */
export class EventBus {
  /** @type {Map<string, Set<Function>>} */
  #listeners = new Map();

  /**
   * @param {string} event
   * @param {Function} handler
   */
  on(event, handler) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set());
    }
    this.#listeners.get(event).add(handler);
  }

  /**
   * @param {string} event
   * @param {Function} handler
   */
  off(event, handler) {
    const set = this.#listeners.get(event);
    if (set) {
      set.delete(handler);
    }
  }

  /**
   * @param {string} event
   * @param {unknown} [payload]
   */
  emit(event, payload) {
    const set = this.#listeners.get(event);
    if (!set) {
      return;
    }
    for (const handler of set) {
      handler(payload);
    }
  }
}

export const gameEvents = new EventBus();
