/**
 * saveManager.js
 * 存檔/讀檔管理：3 個手動存檔槽 + 1 個自動存檔
 * 使用 localStorage 儲存，flags/visitedNodes 為 Set 需轉換
 */

const SAVE_VERSION = '2.0';

// localStorage key 對應
const SAVE_KEYS = {
  0: 'fate_book_save_0',
  1: 'fate_book_save_1',
  2: 'fate_book_save_2',
  auto: 'fate_book_autosave',
};

// 遊戲開始時間，用於計算 playtime
let _sessionStart = Date.now();

/** 重置 session 計時（開始新遊戲或讀檔時呼叫） */
function resetSessionTimer() {
  _sessionStart = Date.now();
}

/**
 * 取得當前 session 已經過秒數
 */
function getSessionSeconds() {
  return Math.floor((Date.now() - _sessionStart) / 1000);
}

/**
 * 存檔到指定槽
 * @param {number|'auto'} slot - 0/1/2 或 'auto'
 * @param {GameState} state
 * @param {string} [sceneText] - 當前場景文字（用於存檔卡片預覽）
 */
function save(slot, state, sceneText = '') {
  const key = SAVE_KEYS[slot];
  if (!key) return false;

  try {
    const data = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      playtime: getSessionSeconds(),
      turn: state.turn,
      currentNode: state.currentNode,
      player: { ...state.player, statusEffects: [...state.player.statusEffects] },
      inventory: [...state.inventory],
      flags: [...state.flags],           // Set → Array
      visitedNodes: [...state.visitedNodes], // Set → Array
      screenshot: sceneText.slice(0, 40), // 前 40 字作為預覽
    };

    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    // localStorage 可能因隱私模式或容量不足而失敗，靜默忽略
    console.warn('[SaveManager] 存檔失敗：', e);
    return false;
  }
}

/**
 * 讀取存檔，回傳還原後的狀態物件（供 gameState.fromJSON 使用）
 * 讀取失敗回傳 null
 * @param {number|'auto'} slot
 * @returns {Object|null}
 */
function load(slot) {
  const key = SAVE_KEYS[slot];
  if (!key) return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const data = JSON.parse(raw);

    // 版本檢查（未來升級時可在此做資料遷移）
    if (!data.version) return null;

    // 還原 Set（Array → Set 由 gameState.fromJSON 處理）
    return data;
  } catch (e) {
    console.warn('[SaveManager] 讀取失敗：', e);
    return null;
  }
}

/**
 * 自動存檔
 * @param {GameState} state
 * @param {string} [sceneText]
 */
function autoSave(state, sceneText = '') {
  return save('auto', state, sceneText);
}

/**
 * 取得存檔摘要（用於存檔卡片顯示）
 * @param {number|'auto'} slot
 * @returns {{ timestamp, turn, playerLv, playerName, screenshot } | null}
 */
function getSaveInfo(slot) {
  const key = SAVE_KEYS[slot];
  if (!key) return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const data = JSON.parse(raw);
    return {
      timestamp: data.timestamp,
      turn: data.turn,
      playerLv: data.player?.lv ?? 1,
      playerName: data.player?.name ?? '???',
      playerClass: data.player?.class ?? '',
      screenshot: data.screenshot ?? '',
    };
  } catch (e) {
    return null;
  }
}

/**
 * 刪除存檔
 * @param {number|'auto'} slot
 */
function deleteSave(slot) {
  const key = SAVE_KEYS[slot];
  if (!key) return;
  localStorage.removeItem(key);
}

/**
 * 檢查存檔槽是否有資料
 * @param {number|'auto'} slot
 */
function hasSave(slot) {
  const key = SAVE_KEYS[slot];
  if (!key) return false;
  return localStorage.getItem(key) !== null;
}

/**
 * 將指定存檔槽匯出為 Base64 字串（供玩家複製分享）
 * @param {number|'auto'} slot
 * @returns {string|null}
 */
function exportSave(slot) {
  const key = SAVE_KEYS[slot];
  if (!key) return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    // btoa 只支援 ASCII，先用 encodeURIComponent 處理中文
    return btoa(encodeURIComponent(raw));
  } catch (e) {
    console.warn('[SaveManager] 匯出失敗：', e);
    return null;
  }
}

/**
 * 從 Base64 字串匯入存檔，寫入 slot 0
 * @param {string} str - exportSave 產生的 Base64 字串
 * @returns {boolean}
 */
function importSave(str) {
  try {
    const raw = decodeURIComponent(atob(str));
    const data = JSON.parse(raw);

    // 基本驗證
    if (!data.version || !data.player) return false;

    localStorage.setItem(SAVE_KEYS[0], raw);
    return true;
  } catch (e) {
    console.warn('[SaveManager] 匯入失敗：', e);
    return false;
  }
}

/**
 * 格式化時間戳記為易讀字串
 * @param {number} timestamp
 */
function formatTimestamp(timestamp) {
  if (!timestamp) return '—';
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
