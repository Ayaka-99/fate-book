/**
 * ui.js
 * 介面渲染：故事文字、選項按鈕、狀態欄、背包、存檔 modal、Toast
 */

// ── 常數 ──────────────────────────────────────────────────────────

const CLASS_NAMES = { swordsman: '劍士', mage: '法師', ranger: '遊俠' };
const CLASS_ICONS  = { swordsman: '⚔️', mage: '🔮', ranger: '🏹' };

// ── Toast 通知 ────────────────────────────────────────────────────

/**
 * 顯示右上角 Toast 通知
 * @param {string} msg
 * @param {'info'|'success'|'warn'|'error'} type
 */
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.className = `toast toast--${type} toast--visible`;

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 3000);
}

// ── 狀態欄渲染 ────────────────────────────────────────────────────

/**
 * 更新左頁狀態欄（HP/MP/XP 條 + 數值徽章）
 * @param {Object} player
 */
function renderStats(player) {
  // HP 條
  _setBar('hp-bar', player.hp, player.maxHp);
  _setText('hp-text', `${player.hp} / ${player.maxHp}`);

  // MP 條
  _setBar('mp-bar', player.mp, player.maxMp);
  _setText('mp-text', `${player.mp} / ${player.maxMp}`);

  // XP 條
  _setBar('xp-bar', player.xp, player.xpNext);
  _setText('xp-text', `Lv.${player.lv} — ${player.xp} / ${player.xpNext}`);

  // 數值徽章
  _setText('stat-atk',  player.atk);
  _setText('stat-def',  player.def);
  _setText('stat-gold', player.gold);
}

function _setBar(id, val, max) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.width = `${Math.max(0, Math.min(100, (val / max) * 100))}%`;
}

function _setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── 道具欄渲染 ────────────────────────────────────────────────────

/**
 * 渲染背包 8 格道具欄
 * @param {Array} inventory - [{ itemId, count }]
 * @param {Function} onUse - 點擊道具時的回呼 (itemId)
 */
function renderInventory(inventory, onUse) {
  const grid = document.getElementById('inventory-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const SLOTS = 8;
  for (let i = 0; i < SLOTS; i++) {
    const slot = document.createElement('div');
    slot.className = 'inv-slot';

    const item = inventory[i];
    if (item) {
      const def = (typeof ITEMS !== 'undefined') ? ITEMS[item.itemId] : null;
      slot.innerHTML = `
        <span class="inv-icon">${def?.emoji ?? '?'}</span>
        ${item.count > 1 ? `<span class="inv-count">×${item.count}</span>` : ''}
      `;
      slot.title = def ? `${def.name}\n${def.desc}` : item.itemId;

      if (def?.usable) {
        slot.classList.add('inv-slot--usable');
        slot.addEventListener('click', () => onUse?.(item.itemId));
      }
    }
    grid.appendChild(slot);
  }
}

// ── 狀態效果欄渲染 ─────────────────────────────────────────────────

/**
 * 渲染 buff/debuff 圖示列
 * @param {Array} statusEffects
 */
function renderStatusEffects(statusEffects) {
  const container = document.getElementById('status-effects');
  if (!container) return;

  container.innerHTML = '';

  for (const eff of statusEffects) {
    const span = document.createElement('span');
    span.className = `status-badge status-badge--${eff.type ?? 'buff'}`;
    span.title = `${eff.name}（剩餘 ${eff.duration} 回合）`;
    span.textContent = `${eff.icon ?? eff.id} ${eff.duration}`;
    container.appendChild(span);
  }
}

// ── 選項按鈕渲染 ──────────────────────────────────────────────────

/**
 * 渲染右頁選項按鈕
 * @param {Array} choices - StoryEngine.getAvailableChoices() 的結果
 * @param {Function} onChoose - 點擊回呼 (index)
 */
function renderChoices(choices, onChoose) {
  const container = document.getElementById('choices');
  if (!container) return;

  container.innerHTML = '';

  choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.text;
    btn.addEventListener('click', () => onChoose?.(idx, choice));
    container.appendChild(btn);
  });
}

// ── 回合計數器 ────────────────────────────────────────────────────

function renderTurn(turn) {
  _setText('turn-count', `第 ${turn} 回合`);
}

// ── 存檔 Modal ────────────────────────────────────────────────────

/**
 * 顯示存檔/讀檔 modal
 * @param {'save'|'load'} mode
 * @param {Function} onSave - (slot) 存檔回呼
 * @param {Function} onLoad - (slot) 讀檔回呼
 */
function showSaveModal(mode, onSave, onLoad) {
  const modal = document.getElementById('save-modal');
  if (!modal) return;

  const titleEl = modal.querySelector('.modal-title');
  if (titleEl) titleEl.textContent = mode === 'save' ? '📖 存檔' : '📂 讀檔';

  // 更新每個存檔槽
  const slots = [0, 1, 2, 'auto'];
  slots.forEach(slot => {
    const card = modal.querySelector(`[data-slot="${slot}"]`);
    if (!card) return;

    const info = (typeof getSaveInfo === 'function') ? getSaveInfo(slot) : null;
    const isAuto = slot === 'auto';

    card.querySelector('.slot-label').textContent = isAuto ? '🔄 自動存檔' : `槽位 ${slot + 1}`;

    if (info) {
      card.querySelector('.slot-time').textContent = formatTimestamp(info.timestamp);
      card.querySelector('.slot-detail').textContent =
        `${info.playerName} | Lv.${info.playerLv} | 第 ${info.turn} 回合`;
      card.querySelector('.slot-preview').textContent = info.screenshot;
    } else {
      card.querySelector('.slot-time').textContent = '—';
      card.querySelector('.slot-detail').textContent = '空槽位';
      card.querySelector('.slot-preview').textContent = '';
    }

    // 存入按鈕（自動存檔槽不能手動覆寫）
    const saveBtn = card.querySelector('.btn-save');
    if (saveBtn) {
      if (isAuto || mode === 'load') {
        saveBtn.style.display = 'none';
      } else {
        saveBtn.style.display = '';
        saveBtn.onclick = () => { onSave?.(slot); hideSaveModal(); };
      }
    }

    // 讀取按鈕
    const loadBtn = card.querySelector('.btn-load');
    if (loadBtn) {
      loadBtn.disabled = !info;
      loadBtn.onclick = () => { onLoad?.(slot); hideSaveModal(); };
    }
  });

  modal.classList.add('modal--visible');
}

function hideSaveModal() {
  const modal = document.getElementById('save-modal');
  modal?.classList.remove('modal--visible');
}

// ── 結局畫面 ──────────────────────────────────────────────────────

/**
 * 顯示結局畫面
 * @param {Object} node - 含 endType, endTitle, endMsg 的節點
 */
function showEnding(node) {
  const screen = document.getElementById('ending-screen');
  if (!screen) return;

  screen.querySelector('.ending-type').textContent  = node.endTitle ?? '✦ 結局';
  screen.querySelector('.ending-msg').textContent   = node.endMsg ?? node.text ?? '';
  screen.classList.add('ending--visible');
}

// ── 戰鬥介面 ──────────────────────────────────────────────────────

/**
 * 顯示戰鬥面板
 * @param {Object} enemy - Combat.enemy
 * @param {Object} player - gameState.player
 */
function showCombatPanel(enemy, player) {
  const panel = document.getElementById('combat-panel');
  if (!panel) return;

  // 敵人資訊
  _setText('enemy-name',  `${enemy.emoji ?? ''} ${enemy.name}`);
  _setBar('enemy-hp-bar', enemy.currentHp, enemy.hp);
  _setText('enemy-hp-text', `${enemy.currentHp} / ${enemy.hp}`);

  // 技能按鈕（依職業動態產生）
  renderSkillButtons(player.class, player.mp);

  panel.classList.add('combat--visible');
}

function hideCombatPanel() {
  const panel = document.getElementById('combat-panel');
  panel?.classList.remove('combat--visible');
}

/**
 * 更新戰鬥面板數值（每回合後呼叫）
 */
function updateCombatPanel(enemy, player) {
  _setBar('enemy-hp-bar', enemy.currentHp, enemy.hp);
  _setText('enemy-hp-text', `${enemy.currentHp} / ${enemy.hp}`);
  renderStats(player);
}

/**
 * 渲染技能按鈕
 * @param {string} playerClass
 * @param {number} currentMp
 */
function renderSkillButtons(playerClass, currentMp) {
  const container = document.getElementById('skill-buttons');
  if (!container) return;

  const skills = (typeof SKILLS !== 'undefined') ? (SKILLS[playerClass] ?? []) : [];
  container.innerHTML = '';

  skills.forEach(sk => {
    const btn = document.createElement('button');
    btn.className = 'skill-btn';
    btn.dataset.skillId = sk.id;
    btn.disabled = currentMp < sk.mpCost;
    btn.innerHTML = `<span>${sk.name}</span><span class="skill-cost">${sk.mpCost} MP</span>`;
    container.appendChild(btn);
  });
}

/**
 * 附加戰鬥日誌文字
 * @param {string[]} lines
 */
function appendCombatLog(lines) {
  const log = document.getElementById('combat-log');
  if (!log) return;
  for (const line of lines) {
    const p = document.createElement('p');
    p.textContent = line;
    log.appendChild(p);
  }
  // 自動捲到底
  log.scrollTop = log.scrollHeight;
}

function clearCombatLog() {
  const log = document.getElementById('combat-log');
  if (log) log.innerHTML = '';
}
