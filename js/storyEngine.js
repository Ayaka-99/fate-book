/**
 * storyEngine.js
 * 劇情引擎：節點跳轉、條件判斷、效果觸發、戰鬥啟動
 */

class StoryEngine {
  /**
   * @param {GameState} state
   * @param {Object} uiCallbacks - { onNodeChange, onCombatStart, onEnding }
   */
  constructor(state, uiCallbacks = {}) {
    this.state = state;
    this.callbacks = uiCallbacks;
  }

  /**
   * 取得當前節點資料
   * @returns {Object|null}
   */
  currentNode() {
    return STORY[this.state.currentNode] ?? null;
  }

  /**
   * 跳轉到指定節點
   * @param {string} nodeId
   */
  goTo(nodeId) {
    const node = STORY[nodeId];
    if (!node) {
      console.warn(`[StoryEngine] 找不到節點：${nodeId}`);
      return;
    }

    this.state.currentNode = nodeId;
    this.state.visitedNodes.add(nodeId);
    this.state.turn += 1;

    // 觸發 onEnter 效果
    if (node.onEnter) {
      node.onEnter(this.state);
    }

    // 自動存檔
    if (typeof autoSave === 'function') {
      autoSave(this.state, node.text ?? '');
    }

    // 結局節點
    if (node.isEnding) {
      this.callbacks.onEnding?.(node);
      return;
    }

    // 戰鬥節點
    if (node.combat) {
      this.callbacks.onCombatStart?.(node.combat, node);
      return;
    }

    // 通知 UI 更新
    this.callbacks.onNodeChange?.(node);
  }

  /**
   * 玩家選擇某個選項
   * @param {number} originalChoiceIdx - 原始 node.choices 陣列中的索引（非過濾後索引）
   */
  choose(originalChoiceIdx) {
    const node = this.currentNode();
    if (!node?.choices) return;

    // 使用原始索引查找，避免過濾後索引錯位問題
    const choice = node.choices[originalChoiceIdx];
    if (!choice) return;

    // 條件雙重保護（getAvailableChoices 已過濾，此處防止直接呼叫 choose 繞過）
    if (choice.condition && !choice.condition(this.state)) return;

    // 套用選項效果
    if (choice.effect) {
      choice.effect(this.state);
    }

    this.goTo(choice.next);
  }

  /**
   * 取得當前節點所有「可用」選項（過濾掉條件不符的）
   * 每個選項物件附加 _originalIdx，供 choose() 使用正確的原始索引
   * @returns {Array}
   */
  getAvailableChoices() {
    const node = this.currentNode();
    if (!node?.choices) return [];
    return node.choices
      .map((c, originalIdx) => ({ ...c, _originalIdx: originalIdx }))
      .filter(c => !c.condition || c.condition(this.state));
  }

  /**
   * 戰鬥結束後跳轉（由 combat.js 結果呼叫）
   * @param {'win'|'lose'} result
   * @param {Object} combatDef - node.combat 物件
   */
  onCombatEnd(result, combatDef) {
    if (result === 'win') {
      this.goTo(combatDef.nextOnWin);
    } else {
      this.goTo(combatDef.nextOnLose ?? 'death_screen');
    }
  }
}
