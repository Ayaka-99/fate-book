/**
 * combat.js
 * 回合制戰鬥系統：玩家行動、敵人 AI、技能、狀態效果
 */

// ── 技能表（依職業） ──────────────────────────────────────────────
const SKILLS = {
  swordsman: [
    { id: 'heavy_slash',  name: '重斬',     mpCost: 8,  dmgMult: 2.0, effect: null },
    { id: 'iron_guard',   name: '鐵壁',     mpCost: 5,  dmgMult: 0,   effect: 'shield_3' },
    { id: 'war_cry',      name: '戰吼',     mpCost: 10, dmgMult: 0,   effect: 'atk_up_3' },
  ],
  mage: [
    { id: 'fireball',     name: '火球',     mpCost: 10, dmgMult: 2.5, effect: 'burn_2' },
    { id: 'ice_lance',    name: '冰槍',     mpCost: 12, dmgMult: 2.2, effect: 'slow_2' },
    { id: 'thunder',      name: '閃電',     mpCost: 15, dmgMult: 3.0, effect: null },
    { id: 'mana_shield',  name: '魔力護盾', mpCost: 8,  dmgMult: 0,   effect: 'shield_5' },
  ],
  ranger: [
    { id: 'precise_shot', name: '精準射擊', mpCost: 6,  dmgMult: 1.8, effect: 'ignore_def' },
    { id: 'poison_arrow', name: '毒箭',     mpCost: 8,  dmgMult: 1.2, effect: 'poison_3' },
    { id: 'evasion',      name: '閃避',     mpCost: 6,  dmgMult: 0,   effect: 'evade_1' },
    { id: 'double_shot',  name: '連射',     mpCost: 10, dmgMult: 1.5, effect: 'double_hit' },
  ],
};

// ── 狀態效果定義 ──────────────────────────────────────────────────
const STATUS_EFFECT_DEFS = {
  shield:  { name: '護盾',  icon: '🛡', type: 'buff' },
  burn:    { name: '燃燒',  icon: '🔥', type: 'debuff' },
  poison:  { name: '中毒',  icon: '☠️', type: 'debuff' },
  slow:    { name: '緩速',  icon: '🐢', type: 'debuff' },
  atk_up:  { name: '強化',  icon: '⚔️', type: 'buff' },
  evade:   { name: '閃避',  icon: '💨', type: 'buff' },
};

// ── 輔助函式 ──────────────────────────────────────────────────────

/** 隨機整數 [min, max] */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 取得玩家裝備道具對特定敵人的戰鬥加成
 * @param {Object} player
 * @param {Object} enemy
 * @returns {number}
 */
function getEquipCombatBonus(player, enemy) {
  if (!window.ITEMS) return 0;
  let bonus = 0;
  for (const { itemId } of (gameState?.inventory ?? [])) {
    const item = ITEMS[itemId];
    if (item?.combatBonus) {
      bonus += item.combatBonus(enemy);
    }
  }
  return bonus;
}

/**
 * 取得玩家當前護盾值（來自狀態效果）
 * @param {Object} player
 * @returns {number}
 */
function getShieldValue(player) {
  const shield = player.statusEffects.find(e => e.id === 'shield');
  return shield?.value ?? 0;
}

/**
 * 取得玩家當前 ATK 修正（來自狀態效果）
 * @param {Object} player
 * @returns {number}
 */
function getAtkMod(player) {
  const atk_up = player.statusEffects.find(e => e.id === 'atk_up');
  return atk_up ? 5 : 0;
}

/**
 * 玩家攻擊敵人的傷害公式
 */
function calcPlayerDmg(player, enemy, skillBonus = 0, ignoreEnemyDef = false) {
  const base = player.atk + getAtkMod(player) + skillBonus;
  const itemBonus = getEquipCombatBonus(player, enemy);
  const enemyDef = ignoreEnemyDef ? 0 : (enemy.currentDef ?? enemy.def);
  const roll = randInt(0, 3);
  return Math.max(1, base + itemBonus - enemyDef + roll);
}

/**
 * 敵人攻擊玩家的傷害公式
 */
function calcEnemyDmg(enemy, player) {
  // 緩速 debuff 降低敵人 atk
  const slowDebuff = player.statusEffects.find(e => e.id === 'slow');
  const enemyAtk = slowDebuff ? Math.max(1, enemy.atk - 3) : enemy.atk;
  const shieldBonus = getShieldValue(player);
  const roll = randInt(0, 2);
  return Math.max(1, enemyAtk - player.def - shieldBonus + roll);
}

// ═══════════════════════════════════════════════════════════════════
// Combat 類別
// ═══════════════════════════════════════════════════════════════════

class Combat {
  /**
   * @param {Object} player - gameState.player
   * @param {string} enemyId - ENEMIES 資料表中的 key
   * @param {Object} state - gameState 整體（需要 inventory、flags 等）
   */
  constructor(player, enemyId, state) {
    this.player = player;
    this.state = state;

    // 從資料表取得敵人資料並建立戰鬥副本
    const template = ENEMIES[enemyId];
    if (!template) throw new Error(`找不到敵人：${enemyId}`);
    this.enemy = {
      ...template,
      currentHp: template.hp,
      currentDef: template.def,
    };

    this.logs = [];    // 戰鬥日誌（每回合累積）
    this.turn = 0;
    this.isOver = false;

    // ── 縫臉師特殊機制初始化 ──
    if (this.enemy.mechanics?.seals !== undefined) {
      this.enemy._sealsLeft = this.enemy.mechanics.seals;
      // 封印提供額外防禦
      this.enemy.currentDef += this.enemy._sealsLeft * this.enemy.mechanics.sealDefBonus;
    }

    // ── 石像哥德特殊機制 ──
    if (enemyId === 'fire_golem' && state.hasFlag('torches_off')) {
      this.enemy.currentDef = 0;
      this.enemy._confused = true; // 困惑：不行動
    }
  }

  /** 加入戰鬥日誌 */
  _log(msg) {
    this.logs.push(msg);
  }

  /** 清空本回合日誌 */
  _clearLog() {
    this.logs = [];
  }

  // ── 玩家行動 ────────────────────────────────────────────────────

  /**
   * 普通攻擊
   * @returns {{ damage: number, log: string[] }}
   */
  playerAttack() {
    this._clearLog();
    let damage = calcPlayerDmg(this.player, this.enemy);

    // 縫臉師：持有靈紋短刀時破壞封印
    damage = this._applySeamMasterMechanic(damage);

    this.enemy.currentHp -= damage;
    this._log(`⚔️ 你攻擊 ${this.enemy.name}，造成 ${damage} 點傷害！`);
    return { damage, log: [...this.logs] };
  }

  /**
   * 技能攻擊
   * @param {string} skillId
   * @returns {{ damage: number, effect: string|null, log: string[] }}
   */
  playerSkill(skillId) {
    this._clearLog();

    // 找到職業技能
    const allSkills = SKILLS[this.player.class] ?? [];
    const skill = allSkills.find(s => s.id === skillId);
    if (!skill) {
      this._log('❌ 未知技能。');
      return { damage: 0, effect: null, log: [...this.logs] };
    }

    // MP 不足
    if (this.player.mp < skill.mpCost) {
      this._log(`❌ MP 不足！需要 ${skill.mpCost} MP。`);
      return { damage: 0, effect: null, log: [...this.logs] };
    }

    this.player.mp -= skill.mpCost;
    let damage = 0;
    let effectApplied = null;

    if (skill.dmgMult > 0) {
      const ignDef = skill.effect === 'ignore_def';
      damage = calcPlayerDmg(this.player, this.enemy, 0, ignDef);
      damage = Math.max(1, Math.floor(damage * skill.dmgMult));

      // 連射：傷害再打一次
      if (skill.effect === 'double_hit') {
        const second = Math.max(1, Math.floor(calcPlayerDmg(this.player, this.enemy) * skill.dmgMult));
        damage += second;
        this._log(`🏹 連射！兩箭各別命中，共 ${damage} 點傷害！`);
      } else {
        damage = this._applySeamMasterMechanic(damage);
        this.enemy.currentHp -= damage;
        this._log(`✨ ${skill.name}！造成 ${damage} 點傷害！`);
      }
    } else {
      // 純輔助技能（無傷害）
      this._log(`✨ 施放 ${skill.name}！`);
    }

    // 套用技能效果
    if (skill.effect && skill.effect !== 'ignore_def' && skill.effect !== 'double_hit') {
      effectApplied = this._applySkillEffect(skill.effect);
    }

    return { damage, effect: effectApplied, log: [...this.logs] };
  }

  /**
   * 使用道具
   * @param {string} itemId
   * @returns {{ healed: number, log: string[] }}
   */
  useItem(itemId) {
    this._clearLog();
    const item = ITEMS[itemId];
    if (!item || !item.usable) {
      this._log('❌ 無法使用這個道具。');
      return { healed: 0, log: [...this.logs] };
    }

    const prevHp = this.player.hp;
    item.use(this.state);
    const healed = this.player.hp - prevHp;
    this.state.removeItem(itemId);
    this._log(`🧪 使用 ${item.name}${healed > 0 ? `，恢復 ${healed} HP` : ''}。`);
    return { healed, log: [...this.logs] };
  }

  /**
   * 嘗試逃跑（成功率 40%）
   * @returns {{ success: boolean, log: string[] }}
   */
  tryFlee() {
    this._clearLog();

    // 閃避狀態提升逃跑成功率至 80%
    const evade = this.player.statusEffects.find(e => e.id === 'evade');
    const chance = evade ? 0.8 : 0.4;

    const success = Math.random() < chance;
    if (success) {
      this._log('💨 你趁機脫身，成功逃跑！');
      this.isOver = true;
    } else {
      this._log('❌ 逃跑失敗！敵人攔住了你！');
    }
    return { success, log: [...this.logs] };
  }

  // ── 敵人行動 ────────────────────────────────────────────────────

  /**
   * 敵人回合
   * @returns {{ damage: number, skillUsed: string|null, log: string[] }}
   */
  enemyTurn() {
    this._clearLog();

    // 石像哥德困惑：跳過行動
    if (this.enemy._confused) {
      this._log(`😵 ${this.enemy.name} 陷入困惑，無法行動！`);
      return { damage: 0, skillUsed: null, log: [...this.logs] };
    }

    let skillUsed = null;
    let damage = 0;

    // 判斷是否使用技能
    const skills = this.enemy.skills ?? [];
    for (const sk of skills) {
      if (Math.random() < sk.chance) {
        skillUsed = sk.name;
        damage = sk.damage;
        // 套用護盾減傷
        const shield = getShieldValue(this.player);
        damage = Math.max(1, damage - shield);
        this.player.hp = Math.max(0, this.player.hp - damage);
        this._log(`💀 ${this.enemy.name} 使用 ${sk.name}！你受到 ${damage} 點傷害！`);
        // 技能附帶效果
        if (sk.effect) {
          this._applyEnemyEffect(sk.effect);
        }
        return { damage, skillUsed, log: [...this.logs] };
      }
    }

    // 普通攻擊
    damage = calcEnemyDmg(this.enemy, this.player);

    // 閃避判定
    const evade = this.player.statusEffects.find(e => e.id === 'evade');
    if (evade && Math.random() < 0.6) {
      this._log(`💨 你閃過了 ${this.enemy.name} 的攻擊！`);
      return { damage: 0, skillUsed: null, log: [...this.logs] };
    }

    this.player.hp = Math.max(0, this.player.hp - damage);
    this._log(`👊 ${this.enemy.name} 攻擊你，造成 ${damage} 點傷害！`);
    return { damage, skillUsed, log: [...this.logs] };
  }

  // ── 回合結尾 ────────────────────────────────────────────────────

  /**
   * 套用回合型狀態效果（燃燒/中毒）並減少持續時間
   * @returns {string[]} 效果訊息列表
   */
  applyStatusEffects() {
    const msgs = [];
    const toRemove = [];

    for (const eff of this.player.statusEffects) {
      // DOT 傷害
      if (eff.id === 'burn') {
        this.player.hp = Math.max(0, this.player.hp - 4);
        msgs.push(`🔥 燃燒效果：受到 4 點傷害！`);
      } else if (eff.id === 'poison') {
        this.player.hp = Math.max(0, this.player.hp - 3);
        msgs.push(`☠️ 中毒效果：受到 3 點傷害！`);
      }

      // 持續時間遞減
      eff.duration -= 1;
      if (eff.duration <= 0) {
        toRemove.push(eff.id);
        const def = STATUS_EFFECT_DEFS[eff.id];
        msgs.push(`${def?.icon ?? ''} ${def?.name ?? eff.id} 效果消退。`);
      }
    }

    // 移除過期效果
    this.player.statusEffects = this.player.statusEffects.filter(
      e => !toRemove.includes(e.id)
    );

    return msgs;
  }

  /**
   * 檢查勝負
   * @returns {'win' | 'lose' | 'ongoing'}
   */
  checkWin() {
    if (this.enemy.currentHp <= 0) {
      // 發放獎勵
      const goldMin = this.enemy.goldReward?.[0] ?? 0;
      const goldMax = this.enemy.goldReward?.[1] ?? 0;
      const gold = randInt(goldMin, goldMax);
      const xp = this.enemy.xpReward ?? 0;
      this.state.applyDelta({ xp, gold });
      // 設置「已擊敗」旗標
      this.state.setFlag(`defeated_${this.enemy.id ?? 'enemy'}`);
      this.isOver = true;
      return 'win';
    }
    if (this.player.hp <= 0) {
      this.isOver = true;
      return 'lose';
    }
    return 'ongoing';
  }

  // ── 私有輔助方法 ─────────────────────────────────────────────────

  /**
   * 縫臉師封印破壞邏輯
   * @param {number} damage
   * @returns {number} 調整後的傷害值
   */
  _applySeamMasterMechanic(damage) {
    if (this.enemy._sealsLeft === undefined) {
      this.enemy.currentHp -= damage;
      return damage;
    }

    const hasDagger = this.state.hasItem('spirit_dagger');
    if (hasDagger && this.enemy._sealsLeft > 0 && damage > 0) {
      // 破壞一個封印
      this.enemy._sealsLeft -= 1;
      const defReduction = this.enemy.mechanics.sealDefBonus;
      this.enemy.currentDef = Math.max(0, this.enemy.currentDef - defReduction);
      this._log(`✨ 靈紋短刀發光！封印符文破碎！（剩餘 ${this.enemy._sealsLeft} 個封印）`);

      // 封印破壞回呼
      if (this.enemy.mechanics.onSealBreak) {
        this.enemy.mechanics.onSealBreak(this.state, this.enemy);
      }
    }
    this.enemy.currentHp -= damage;
    return damage;
  }

  /**
   * 套用玩家技能效果到自身
   * @param {string} effectStr - 如 'shield_3', 'atk_up_3', 'burn_2'...
   * @returns {string} 效果名稱
   */
  _applySkillEffect(effectStr) {
    // effectStr 格式：'effectId_duration'，如 'shield_3'
    const parts = effectStr.split('_');
    const duration = parseInt(parts[parts.length - 1], 10);
    const id = parts.slice(0, -1).join('_');

    // 若已有同種效果，更新持續時間
    const existing = this.player.statusEffects.find(e => e.id === id);
    if (existing) {
      existing.duration = Math.max(existing.duration, duration);
    } else {
      const def = STATUS_EFFECT_DEFS[id] ?? {};
      this.player.statusEffects.push({
        id,
        name: def.name ?? id,
        duration,
        value: id === 'shield' ? duration : undefined,
      });
    }

    const def = STATUS_EFFECT_DEFS[id] ?? {};
    const msg = `${def.icon ?? ''} 獲得 ${def.name ?? id} 效果（${duration} 回合）！`;
    this._log(msg);
    return id;
  }

  /**
   * 套用敵人技能效果到玩家
   * @param {string} effectStr
   */
  _applyEnemyEffect(effectStr) {
    this._applySkillEffect(effectStr);
  }
}
