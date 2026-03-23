/**
 * typewriter.js
 * 打字機效果：逐字顯示文字，支援速度調整與跳過
 */

class Typewriter {
  /**
   * @param {HTMLElement} el - 目標容器元素
   * @param {number} speed - 每個字元間隔毫秒（預設 30ms）
   */
  constructor(el, speed = 30) {
    this.el = el;
    this.speed = speed;
    this._timer = null;
    this._resolve = null;
    this._fullText = '';
  }

  /**
   * 開始打字機效果
   * @param {string} text - 要顯示的文字（支援 HTML）
   * @returns {Promise<void>} 完成後 resolve
   */
  type(text) {
    // 停止上一次尚未完成的動畫
    this.skip();

    this._fullText = text;
    this.el.innerHTML = '';

    return new Promise((resolve) => {
      this._resolve = resolve;

      // 將文字拆成字元陣列（處理 HTML 標籤視為整體，不逐字拆標籤）
      const chars = [...text]; // 利用 Unicode 感知的展開
      let idx = 0;

      const next = () => {
        if (idx >= chars.length) {
          this._resolve?.();
          this._resolve = null;
          this._timer = null;
          return;
        }
        // 一次附加一個字元到 textContent（純文字模式，避免 XSS）
        this.el.textContent += chars[idx];
        idx++;
        this._timer = setTimeout(next, this.speed);
      };

      next();
    });
  }

  /**
   * 立即跳過，顯示全文
   */
  skip() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    if (this._fullText) {
      this.el.textContent = this._fullText;
    }
    this._resolve?.();
    this._resolve = null;
  }

  /**
   * 是否正在打字中
   */
  isTyping() {
    return this._timer !== null;
  }

  /**
   * 設定打字速度
   * @param {number} ms
   */
  setSpeed(ms) {
    this.speed = ms;
  }
}
