/**
 * items.js
 * 道具資料表：所有可拾取/使用/裝備的道具定義
 */

const ITEMS = {
  // ── 消耗品 ──────────────────────────────────────────────────────
  health_potion: {
    name: '生命藥水', emoji: '🧪',
    desc: '恢復 25 HP',
    usable: true,
    use: (state) => { state.applyDelta({ hp: 25 }); },
  },

  mana_potion: {
    name: '魔力藥水', emoji: '💧',
    desc: '恢復 20 MP',
    usable: true,
    use: (state) => { state.applyDelta({ mp: 20 }); },
  },

  antidote: {
    name: '解毒藥', emoji: '🌿',
    desc: '移除中毒狀態',
    usable: true,
    use: (state) => {
      state.player.statusEffects = state.player.statusEffects.filter(e => e.id !== 'poison');
    },
  },

  ether_flask: {
    name: '以太瓶', emoji: '⚗️',
    desc: '恢復 15 HP 和 15 MP',
    usable: true,
    use: (state) => { state.applyDelta({ hp: 15, mp: 15 }); },
  },

  // ── 裝備型道具（戰鬥時自動生效） ───────────────────────────────
  spirit_dagger: {
    name: '靈紋短刀', emoji: '🗡️',
    desc: '能有效傷害無面者術士（對帶有 faceless 標籤的敵人 +8 傷害）',
    usable: false,
    combatBonus: (enemy) => (enemy.tags?.includes('faceless') ? 8 : 0),
  },

  ruin_charm: {
    name: '遺跡護符', emoji: '🔮',
    desc: '進入遺跡時可減少陷阱觸發率',
    usable: false,
    combatBonus: () => 0,
  },

  fate_ring: {
    name: '命運之戒', emoji: '💍',
    desc: '神秘的戒指，據說能感應命運的流動',
    usable: false,
    combatBonus: () => 0,
  },

  leather_armor: {
    name: '皮甲', emoji: '🦺',
    desc: '裝備後提升 DEF +2（裝備時自動生效）',
    usable: false,
    onEquip: (state) => { state.applyDelta({ def: 2 }); },
    combatBonus: () => 0,
  },

  // ── 劇情道具 ────────────────────────────────────────────────────
  torn_map: {
    name: '殘破地圖', emoji: '🗺️',
    desc: '一張殘缺的礦坑地圖，勉強能辨認出通道走向',
    usable: false,
    combatBonus: () => 0,
  },

  black_badge: {
    name: '黑色徽章', emoji: '🏴',
    desc: '刻有無面者符號的徽章，可能有特殊用途',
    usable: false,
    combatBonus: () => 0,
  },

  seam_token: {
    name: '縫臉師令牌', emoji: '🪡',
    desc: '縫臉師的證明，可通過遺跡正門',
    usable: false,
    combatBonus: () => 0,
  },

  locked_book: {
    name: '鎖書', emoji: '📖',
    desc: '一本上了鎖的古書，鎖頭刻有三個石版符號',
    usable: false,
    combatBonus: () => 0,
  },

  notebook: {
    name: '記事本', emoji: '📓',
    desc: '礦坑工人的記事本，記錄著儀式相關內容',
    usable: false,
    combatBonus: () => 0,
  },
};
