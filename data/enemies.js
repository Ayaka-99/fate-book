/**
 * enemies.js
 * 敵人資料表：所有戰鬥對手的屬性、技能、特殊機制
 */

const ENEMIES = {
  // ── 第一章 ──────────────────────────────────────────────────────
  wolf: {
    id: 'wolf',
    name: '灰狼', emoji: '🐺',
    hp: 24, atk: 6, def: 2,
    xpReward: 18, goldReward: [2, 6],
    skills: [],
    tags: [],
  },

  bandit: {
    id: 'bandit',
    name: '盜匪', emoji: '🗡️',
    hp: 20, atk: 7, def: 3,
    xpReward: 15, goldReward: [5, 12],
    skills: [
      { name: '偷襲', chance: 0.25, damage: 10, effect: null },
    ],
    tags: [],
  },

  // ── 第二章：礦坑 ────────────────────────────────────────────────
  goblin: {
    id: 'goblin',
    name: '哥布林', emoji: '👺',
    hp: 18, atk: 4, def: 1,
    xpReward: 12, goldReward: [3, 8],
    skills: [],
    tags: [],
  },

  mine_guard: {
    id: 'mine_guard',
    name: '礦坑守衛', emoji: '💂',
    hp: 30, atk: 8, def: 4,
    xpReward: 22, goldReward: [8, 15],
    skills: [
      { name: '盾擊', chance: 0.2, damage: 12, effect: 'slow_2' },
    ],
    tags: [],
  },

  faceless_cultist: {
    id: 'faceless_cultist',
    name: '無面者信徒', emoji: '🕯️',
    hp: 28, atk: 9, def: 3,
    xpReward: 28, goldReward: [6, 14],
    skills: [
      { name: '黑暗詛咒', chance: 0.3, damage: 8, effect: 'poison_2' },
    ],
    tags: ['faceless'],
  },

  // 縫臉師 BOSS（第二章 BOSS）
  seam_master: {
    id: 'seam_master',
    name: '縫臉師', emoji: '🪡',
    hp: 60, atk: 10, def: 4,
    xpReward: 80, goldReward: [25, 40],
    isBoss: true,
    tags: ['faceless'],
    // 特殊機制：三封印符文，依序破壞才能正常傷害
    mechanics: {
      seals: 3,         // 初始封印數
      sealDefBonus: 6,  // 每個封印提供的額外防禦（3封印 = def+18）
      onSealBreak: (state, enemy) => {
        // 可在此觸發動畫或音效（由 UI 層處理）
        console.log(`封印破碎！剩餘：${enemy._sealsLeft}`);
      },
    },
    skills: [
      { name: '黑色能量', chance: 0.3, damage: 15, effect: null },
      { name: '縫合之術', chance: 0.15, damage: 0,  effect: 'poison_2' },
    ],
  },

  // ── 第三章：遺跡 ────────────────────────────────────────────────
  ruin_guard: {
    id: 'ruin_guard',
    name: '遺跡守衛', emoji: '⚰️',
    hp: 35, atk: 9, def: 5,
    xpReward: 30, goldReward: [10, 18],
    skills: [
      { name: '古代之力', chance: 0.25, damage: 14, effect: null },
    ],
    tags: [],
  },

  ruin_guards_group: {
    id: 'ruin_guards_group',
    name: '四名遺跡守衛', emoji: '⚔️',
    hp: 70, atk: 11, def: 5,
    xpReward: 70, goldReward: [20, 35],
    skills: [
      { name: '圍攻', chance: 0.35, damage: 18, effect: null },
    ],
    tags: [],
  },

  // ── 第四章：石像哥德（火焰祭壇） ─────────────────────────────────
  fire_golem: {
    id: 'fire_golem',
    name: '石像哥德', emoji: '🗿',
    hp: 55, atk: 16, def: 8,
    xpReward: 65, goldReward: [15, 28],
    isBoss: true,
    tags: [],
    // 特殊機制：關閉火把後困惑（由 Combat 建構子處理）
    skills: [
      { name: '熔岩拳', chance: 0.3, damage: 20, effect: 'burn_2' },
      { name: '石壁衝撞', chance: 0.2, damage: 22, effect: null },
    ],
  },

  // ── 第七章：最終 BOSS ─────────────────────────────────────────────
  faceless_lord: {
    id: 'faceless_lord',
    name: '無面者首領', emoji: '👁️',
    hp: 100, atk: 18, def: 8,
    xpReward: 200, goldReward: [50, 80],
    isBoss: true,
    tags: ['faceless'],
    mechanics: {
      // 第二階段：HP 低於 40% 時解鎖
      phase2Threshold: 0.4,
      phase2AtkBonus: 5,
      phase2Triggered: false,
    },
    skills: [
      { name: '虛空侵蝕', chance: 0.3,  damage: 20, effect: 'poison_3' },
      { name: '命運撕裂', chance: 0.2,  damage: 28, effect: null },
      { name: '無面詛咒', chance: 0.15, damage: 12, effect: 'burn_2' },
    ],
  },
};
