/**
 * main.js
 * 遊戲入口：初始化流程、事件綁定、模組協調
 */

// ── 全域物件 ─────────────────────────────────────────────────────
let engine;        // StoryEngine 實例
let currentCombat; // Combat 實例（戰鬥中時）
let writer;        // Typewriter 實例

// ── 初始化 ────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  writer = new Typewriter(document.getElementById('story-text'), 30);

  bindWelcomeScreen();
  bindSaveButtons();
  bindEndingScreen();
});

// ── 歡迎畫面 ──────────────────────────────────────────────────────

function bindWelcomeScreen() {
  const startBtn = document.getElementById('start-btn');
  const nameInput = document.getElementById('hero-name');
  const classRadios = document.querySelectorAll('input[name="hero-class"]');

  // 職業選擇視覺回饋
  classRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
      radio.closest('.class-card')?.classList.add('selected');
    });
  });

  startBtn?.addEventListener('click', () => {
    const name = nameInput?.value.trim();
    if (!name) {
      showToast('請輸入你的名字！', 'warn');
      nameInput?.focus();
      return;
    }

    const selected = document.querySelector('input[name="hero-class"]:checked');
    if (!selected) {
      showToast('請選擇職業！', 'warn');
      return;
    }

    startGame(name, selected.value);
  });
}

/**
 * 開始新遊戲
 * @param {string} name - 玩家名字
 * @param {string} heroClass - 'swordsman' | 'mage' | 'ranger'
 */
function startGame(name, heroClass) {
  // 依職業調整初始數值
  gameState.reset();
  gameState.player.name = name;
  gameState.player.class = heroClass;

  const classAdjust = {
    swordsman: { maxHp: 120, hp: 120, maxMp: 30, mp: 30, atk: 16, def: 10 },
    mage:      { maxHp: 80,  hp: 80,  maxMp: 60, mp: 60, atk: 12, def: 5  },
    ranger:    { maxHp: 100, hp: 100, maxMp: 45, mp: 45, atk: 14, def: 7  },
  };
  Object.assign(gameState.player, classAdjust[heroClass] ?? {});

  resetSessionTimer();

  // 切換到書本介面
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('book').style.display = '';

  // 建立引擎
  engine = new StoryEngine(gameState, {
    onNodeChange:   renderCurrentNode,
    onCombatStart:  startCombat,
    onEnding:       (node) => showEnding(node),
  });

  engine.goTo('start');
}

// ── 節點渲染 ──────────────────────────────────────────────────────

/**
 * 渲染當前劇情節點（由 StoryEngine 呼叫）
 * @param {Object} node
 */
async function renderCurrentNode(node) {
  // 狀態欄
  renderStats(gameState.player);
  renderInventory(gameState.inventory, handleItemUse);
  renderStatusEffects(gameState.player.statusEffects);
  renderTurn(gameState.turn);

  // 清空選項（打字中不可點擊）
  renderChoices([], null);

  // 打字機效果顯示故事文字
  await writer.type(node.text ?? '');

  // 顯示選項
  const choices = engine.getAvailableChoices();
  renderChoices(choices, (idx, choice) => {
    if (writer.isTyping()) {
      writer.skip();
      return;
    }
    // 使用 _originalIdx 確保 condition 過濾後索引仍正確對應原始選項
    engine.choose(choice._originalIdx);
  });
}

// ── 道具使用 ──────────────────────────────────────────────────────

function handleItemUse(itemId) {
  if (!currentCombat) {
    // 非戰鬥狀態：直接使用
    const item = ITEMS[itemId];
    if (!item?.usable) return;
    item.use(gameState);
    gameState.removeItem(itemId);
    renderStats(gameState.player);
    renderInventory(gameState.inventory, handleItemUse);
    showToast(`使用了 ${item.name}！`, 'success');
    return;
  }
  // 戰鬥中的使用交由戰鬥系統處理
  const result = currentCombat.useItem(itemId);
  appendCombatLog(result.log);
  updateCombatPanel(currentCombat.enemy, gameState.player);
  handleCombatTurnEnd();
}

// ── 存檔按鈕 ──────────────────────────────────────────────────────

function bindSaveButtons() {
  document.getElementById('btn-save')?.addEventListener('click', () => {
    showSaveModal('save', handleSave, handleLoad);
  });

  document.getElementById('btn-load')?.addEventListener('click', () => {
    showSaveModal('load', handleSave, handleLoad);
  });

  document.getElementById('modal-close')?.addEventListener('click', hideSaveModal);
}

function handleSave(slot) {
  const node = engine?.currentNode();
  const ok = save(slot, gameState, node?.text ?? '');
  showToast(ok ? '存檔成功！' : '存檔失敗。', ok ? 'success' : 'error');
}

function handleLoad(slot) {
  const data = load(slot);
  if (!data) {
    showToast('讀取失敗或空槽位。', 'error');
    return;
  }
  gameState.fromJSON(data);
  resetSessionTimer();

  if (!engine) {
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('book').style.display = '';
    engine = new StoryEngine(gameState, {
      onNodeChange:  renderCurrentNode,
      onCombatStart: startCombat,
      onEnding:      (node) => showEnding(node),
    });
  }

  const node = STORY[gameState.currentNode];
  if (node) renderCurrentNode(node);
  showToast('讀檔成功！', 'success');
}

// ── 戰鬥流程 ──────────────────────────────────────────────────────

/**
 * 開始戰鬥（由 StoryEngine.onCombatStart 呼叫）
 * @param {Object} combatDef - { enemyId, nextOnWin, nextOnLose }
 * @param {Object} node - 原始節點（用於顯示場景說明）
 */
function startCombat(combatDef, node) {
  try {
    currentCombat = new Combat(gameState.player, combatDef.enemyId, gameState);
  } catch (e) {
    console.error('[Combat] 初始化失敗：', e);
    showToast('戰鬥初始化失敗。', 'error');
    return;
  }

  clearCombatLog();
  appendCombatLog([`⚔️ 戰鬥開始！對手：${currentCombat.enemy.name}`]);
  showCombatPanel(currentCombat.enemy, gameState.player);
  bindCombatButtons(combatDef);
}

/**
 * 綁定戰鬥介面按鈕事件
 */
function bindCombatButtons(combatDef) {
  const panel = document.getElementById('combat-panel');

  // 普通攻擊
  panel.querySelector('#btn-attack')?.addEventListener('click', () => {
    if (!currentCombat) return;
    const result = currentCombat.playerAttack();
    appendCombatLog(result.log);
    handleCombatTurnEnd(combatDef);
  }, { once: false });

  // 技能按鈕（動態產生，用事件委派）
  panel.querySelector('#skill-buttons')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.skill-btn');
    if (!btn || btn.disabled || !currentCombat) return;
    const result = currentCombat.playerSkill(btn.dataset.skillId);
    appendCombatLog(result.log);
    handleCombatTurnEnd(combatDef);
  });

  // 逃跑
  panel.querySelector('#btn-flee')?.addEventListener('click', () => {
    if (!currentCombat) return;
    const result = currentCombat.tryFlee();
    appendCombatLog(result.log);
    if (result.success) {
      endCombat('flee', combatDef);
    }
  });
}

/**
 * 每次玩家行動後：敵人回合 → 狀態效果 → 勝負判斷
 */
function handleCombatTurnEnd(combatDef) {
  if (!currentCombat) return;

  // 勝負確認（玩家可能一刀秒殺）
  const quick = currentCombat.checkWin();
  if (quick !== 'ongoing') {
    endCombat(quick, combatDef);
    return;
  }

  // 敵人回合
  const enemyResult = currentCombat.enemyTurn();
  appendCombatLog(enemyResult.log);

  // 狀態效果
  const dotMsgs = currentCombat.applyStatusEffects();
  if (dotMsgs.length) appendCombatLog(dotMsgs);

  // 更新介面
  updateCombatPanel(currentCombat.enemy, gameState.player);
  renderSkillButtons(gameState.player.class, gameState.player.mp);

  // 最終勝負
  const final = currentCombat.checkWin();
  if (final !== 'ongoing') {
    endCombat(final, combatDef);
  }
}

/**
 * 結束戰鬥，跳轉節點
 * @param {'win'|'lose'|'flee'} result
 */
function endCombat(result, combatDef) {
  hideCombatPanel();
  currentCombat = null;

  if (result === 'win') {
    const xp = combatDef._rewarded?.xpReward ?? 0;
    showToast('戰鬥勝利！', 'success');
    engine.onCombatEnd('win', combatDef);
  } else if (result === 'lose') {
    showToast('你倒下了⋯', 'error');
    engine.onCombatEnd('lose', combatDef);
  } else {
    // 逃跑：回到原節點
    const node = engine.currentNode();
    if (node) renderCurrentNode(node);
  }
}

// ── 結局畫面按鈕 ──────────────────────────────────────────────────

function bindEndingScreen() {
  document.getElementById('btn-restart')?.addEventListener('click', () => {
    document.getElementById('ending-screen')?.classList.remove('ending--visible');
    document.getElementById('book').style.display = 'none';
    document.getElementById('welcome').style.display = '';
    gameState.reset();
    currentCombat = null;
    engine = null;
  });
}

// ── 點擊故事文字跳過打字機 ────────────────────────────────────────

document.addEventListener('click', (e) => {
  if (e.target.id === 'story-text' && writer?.isTyping()) {
    writer.skip();
  }
});
