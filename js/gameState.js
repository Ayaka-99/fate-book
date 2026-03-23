/**
 * gameState.js
 * 玩家狀態管理：數值、道具、旗標、升級邏輯
 */

// 初始狀態模板
const DEFAULT_STATE = {
  player: {
    name: '',
    class: '',        // 'swordsman' | 'mage' | 'ranger'
    hp: 100, maxHp: 100,
    mp: 40,  maxMp: 40,
    atk: 14, def: 8,
    lv: 1,   xp: 0,  xpNext: 100,
    gold: 30,
    statusEffects: [], // [{ id, name, duration, value? }]
  },
  inventory: [],      // [{ itemId, count }]，最多 8 格
  flags: new Set(),   // 劇情旗標集合
  currentNode: 'start',
  turn: 0,
  visitedNodes: new Set(),
  combatLog: [],
};

// 升級門檻倍率
const XP_NEXT_MULT = 1.45;
// 道具欄上限
const INVENTORY_LIMIT = 8;

class GameState {
  constructor() {
    this.reset();
  }

  /**
   * 重置為初始狀態
   */
  reset() {
    // 深度複製 DEFAULT_STATE，避免共用參考
    this.player = {
      name: '',
      class: '',
      hp: 100, maxHp: 100,
      mp: 40,  maxMp: 40,
      atk: 14, def: 8,
      lv: 1,   xp: 0,  xpNext: 100,
      gold: 30,
      statusEffects: [],
    };
    this.inventory = [];
    this.flags = new Set();
    this.currentNode = 'start';
    this.turn = 0;
    this.visitedNodes = new Set();
    this.combatLog = [];
  }

  /**
   * 套用數值變化
   * @param {Object} delta - { hp, mp, xp, gold, atk, def }（均為可選，正負皆可）
   * @returns {Object} 實際變化量（升級時回傳 leveledUp: true）
   */
  applyDelta(delta = {}) {
    const p = this.player;
    const result = {};

    if (delta.hp !== undefined) {
      const prev = p.hp;
      p.hp = Math.min(p.maxHp, Math.max(0, p.hp + delta.hp));
      result.hp = p.hp - prev;
    }

    if (delta.mp !== undefined) {
      const prev = p.mp;
      p.mp = Math.min(p.maxMp, Math.max(0, p.mp + delta.mp));
      result.mp = p.mp - prev;
    }

    if (delta.gold !== undefined) {
      p.gold = Math.max(0, p.gold + delta.gold);
      result.gold = delta.gold;
    }

    if (delta.atk !== undefined) {
      p.atk = Math.max(1, p.atk + delta.atk);
      result.atk = delta.atk;
    }

    if (delta.def !== undefined) {
      p.def = Math.max(0, p.def + delta.def);
      result.def = delta.def;
    }

    if (delta.xp !== undefined) {
      p.xp += delta.xp;
      result.xp = delta.xp;
      // 連續升級判斷（可能一次 xp 超過多個門檻）
      while (p.xp >= p.xpNext) {
        this.levelUp();
        result.leveledUp = true;
      }
    }

    return result;
  }

  /**
   * 升級邏輯
   * HP+12, MP+8, ATK+2, DEF+1, xpNext×1.45
   */
  levelUp() {
    const p = this.player;
    p.xp -= p.xpNext;
    p.lv += 1;
    p.maxHp += 12;
    p.hp = Math.min(p.hp + 12, p.maxHp); // 升級順補 12 HP
    p.maxMp += 8;
    p.mp = Math.min(p.mp + 8, p.maxMp);
    p.atk += 2;
    p.def += 1;
    p.xpNext = Math.ceil(p.xpNext * XP_NEXT_MULT);
  }

  // ────────────────────────────────
  // 道具系統
  // ────────────────────────────────

  /**
   * 加入道具
   * @returns {boolean} 成功回傳 true，背包已滿回傳 false
   */
  addItem(itemId) {
    // 若已有同種道具，堆疊數量
    const existing = this.inventory.find(i => i.itemId === itemId);
    if (existing) {
      existing.count += 1;
      return true;
    }
    // 新格子
    if (this.inventory.length >= INVENTORY_LIMIT) return false;
    this.inventory.push({ itemId, count: 1 });
    return true;
  }

  /**
   * 移除道具（count - 1，歸零時移出陣列）
   * @returns {boolean} 成功回傳 true
   */
  removeItem(itemId) {
    const idx = this.inventory.findIndex(i => i.itemId === itemId);
    if (idx === -1) return false;
    this.inventory[idx].count -= 1;
    if (this.inventory[idx].count <= 0) {
      this.inventory.splice(idx, 1);
    }
    return true;
  }

  /**
   * 檢查是否持有道具
   */
  hasItem(itemId) {
    return this.inventory.some(i => i.itemId === itemId);
  }

  // ────────────────────────────────
  // 旗標系統
  // ────────────────────────────────

  /** 設置劇情旗標 */
  setFlag(flag) {
    this.flags.add(flag);
  }

  /** 移除劇情旗標 */
  removeFlag(flag) {
    this.flags.delete(flag);
  }

  /** 檢查旗標是否存在 */
  hasFlag(flag) {
    return this.flags.has(flag);
  }

  // ────────────────────────────────
  // 序列化（供 saveManager 使用）
  // ────────────────────────────────

  /**
   * 轉換成可 JSON 序列化的物件
   * Set 轉為 Array
   */
  toJSON() {
    return {
      player: { ...this.player, statusEffects: [...this.player.statusEffects] },
      inventory: [...this.inventory],
      flags: [...this.flags],
      currentNode: this.currentNode,
      turn: this.turn,
      visitedNodes: [...this.visitedNodes],
      combatLog: [...this.combatLog],
    };
  }

  /**
   * 從 JSON 物件還原狀態
   * Array 轉回 Set
   */
  fromJSON(data) {
    this.player = {
      ...data.player,
      statusEffects: data.player.statusEffects || [],
    };
    this.inventory = data.inventory || [];
    this.flags = new Set(data.flags || []);
    this.currentNode = data.currentNode || 'start';
    this.turn = data.turn || 0;
    this.visitedNodes = new Set(data.visitedNodes || []);
    this.combatLog = data.combatLog || [];
  }
}

// 全域單例，整個遊戲共用
const gameState = new GameState();
