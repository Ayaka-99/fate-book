# 命運之書 v2.0 — Claude Code 專案指引

## 專案概述

一款純手寫分支劇情的奇幻文字 RPG，書本介面，HTML + Vanilla JS，**不使用任何 AI 主持**。
所有劇情節點預先寫好存於 `data/story.js`，玩家的選擇決定路線，AI 不介入執行時邏輯。

---

## 技術棧

- **語言**：HTML5 + CSS3 + Vanilla JavaScript（ES6+）
- **字型**：Google Fonts（Noto Serif TC + Cinzel）
- **存檔**：localStorage（多槽）
- **打包**：無需打包，直接開啟 HTML 即可執行
- **未來升級**：React + TypeScript（v3.0）

---

## 目錄結構

```
fate-book/
├── index.html          # 主入口，書本介面 HTML 結構
├── CLAUDE.md           # 本文件（Claude Code 讀取）
├── css/
│   ├── base.css        # CSS 變數、reset、字型
│   ├── book.css        # 書本介面佈局（雙頁、書脊）
│   ├── ui.css          # 狀態欄、選項按鈕、toast、modal
│   └── animations.css  # 打字機、翻頁、淡入動畫
├── js/
│   ├── main.js         # 入口，初始化流程
│   ├── gameState.js    # 玩家狀態管理（數值、道具、旗標）
│   ├── storyEngine.js  # 劇情節點跳轉、條件判斷、效果套用
│   ├── combat.js       # 戰鬥系統（回合制、技能、狀態效果）
│   ├── saveManager.js  # 存檔/讀檔（3 槽 + 自動存檔）
│   ├── ui.js           # 介面渲染（文字、選項、狀態欄、背包）
│   └── typewriter.js   # 打字機效果
└── data/
    ├── story.js        # 所有劇情節點（100+ nodes）
    ├── enemies.js      # 敵人資料表
    └── items.js        # 道具資料表
```

---

## 核心資料結構

### 劇情節點（story.js）

```javascript
// 每個節點的完整格式
const STORY = {
  node_id: {
    // 必填
    text: `場景描述文字，支援多段落。`,

    // 選項陣列（1~4 個）
    choices: [
      {
        text: '選項顯示文字',
        next: 'target_node_id',

        // 選填：進入條件（回傳 true 才顯示此選項）
        condition: (state) => state.flags.has('got_knife'),

        // 選填：選擇此項的即時效果
        effect: (state) => {
          state.player.gold -= 30;
        },
      }
    ],

    // 選填：進入此節點時自動觸發的效果
    onEnter: (state) => {
      state.applyDelta({ hp: -10, xp: 15, gold: 5 });
      state.addItem('health_potion');
      state.setFlag('visited_tavern');
    },

    // 選填：觸發戰鬥（戰鬥結束後跳 nextOnWin / nextOnLose）
    combat: {
      enemyId: 'goblin',
      nextOnWin: 'after_goblin_fight',
      nextOnLose: 'death_screen',
    },

    // 選填：是否為結局節點
    isEnding: true,
    endType: 'victory', // 'victory' | 'dead' | 'secret'
    endTitle: '✦ 真實結局',
    endMsg: '你選擇了放下，命運因此改變。',
  }
};
```

### 玩家狀態（gameState.js）

```javascript
const DEFAULT_STATE = {
  player: {
    name: '',
    class: '',        // 'swordsman' | 'mage' | 'ranger'
    hp: 100, maxHp: 100,
    mp: 40,  maxMp: 40,
    atk: 14, def: 8,
    lv: 1,   xp: 0,  xpNext: 100,
    gold: 30,
    statusEffects: [], // [{ id, name, duration, onTick }]
  },
  inventory: [],      // [{ itemId, count }]，最多 8 格
  flags: new Set(),   // 劇情旗標集合
  currentNode: 'start',
  turn: 0,
  visitedNodes: new Set(),
  combatLog: [],
};
```

### 道具格式（items.js）

```javascript
const ITEMS = {
  health_potion: {
    name: '生命藥水', emoji: '🧪',
    desc: '恢復 25 HP',
    usable: true,
    use: (state) => { state.applyDelta({ hp: 25 }); }
  },
  spirit_dagger: {
    name: '靈紋短刀', emoji: '🗡️',
    desc: '能有效傷害無面者術士',
    usable: false,   // 裝備型道具，戰鬥時自動生效
    combatBonus: (enemy) => enemy.tags?.includes('faceless') ? 8 : 0,
  },
};
```

### 敵人格式（enemies.js）

```javascript
const ENEMIES = {
  goblin: {
    name: '哥布林', emoji: '👺',
    hp: 18, atk: 4, def: 1,
    xpReward: 12, goldReward: [3, 8],  // 隨機範圍
    skills: [],
    tags: [],
  },
  seam_master: {
    name: '縫臉師', emoji: '🪡',
    hp: 60, atk: 10, def: 4,
    xpReward: 80, goldReward: [25, 40],
    isBoss: true,
    tags: ['faceless'],
    // 特殊機制：三封印符文，依序破壞才能正常傷害
    mechanics: {
      seals: 3,       // 剩餘封印數
      sealDefBonus: 6, // 每個封印提供的額外防禦
      onSealBreak: (state, enemy) => { /* 符文破碎動畫 */ }
    },
    skills: [
      { name: '黑色能量', chance: 0.3, damage: 15, effect: null },
    ]
  },
};
```

---

## 存檔系統規格（saveManager.js）

```javascript
// localStorage key 格式
'fate_book_save_0'   // 手動存檔槽 0
'fate_book_save_1'   // 手動存檔槽 1
'fate_book_save_2'   // 手動存檔槽 2
'fate_book_autosave' // 自動存檔（每次做選擇後自動觸發）

// 存檔資料結構
{
  version: '2.0',
  timestamp: 1700000000000,
  playtime: 3600,          // 秒數
  turn: 42,
  currentNode: 'ruins_floor2',
  player: { ...playerData },
  inventory: [ ...items ],
  flags: [ ...flagsArray ], // Set 轉 Array 才能 JSON 序列化
  visitedNodes: [ ...nodesArray ],
  screenshot: '...',       // 當前場景文字前 50 字，存檔卡片預覽用
}

// 注意：flags 和 visitedNodes 是 Set，存檔時要轉 Array，讀取時轉回 Set
```

---

## 戰鬥系統規格（combat.js）

### 回合流程

```
1. 玩家選擇行動（普通攻擊 / 技能 / 使用道具 / 逃跑）
2. 計算玩家傷害 → 套用敵人特殊機制（如封印符文）
3. 敵人根據 AI 邏輯選擇行動（隨機技能 or 普通攻擊）
4. 計算敵人傷害 → 套用玩家狀態效果
5. 檢查勝負條件
6. 更新狀態效果持續時間（毒、護盾、增幅）
```

### 傷害公式

```javascript
// 玩家攻擊敵人
function calcPlayerDmg(player, enemy, skillBonus = 0) {
  const base = player.atk + skillBonus;
  const itemBonus = getEquipCombatBonus(player, enemy);
  const roll = Math.floor(Math.random() * 4); // 0~3
  return Math.max(1, base + itemBonus - enemy.def + roll);
}

// 敵人攻擊玩家
function calcEnemyDmg(enemy, player) {
  const shieldBonus = player.statusEffects.find(e => e.id === 'shield')?.value ?? 0;
  const roll = Math.floor(Math.random() * 3); // 0~2
  return Math.max(1, enemy.atk - player.def - shieldBonus + roll);
}
```

### 技能表（依職業）

```javascript
const SKILLS = {
  swordsman: [
    { id: 'heavy_slash',  name: '重斬',   mpCost: 8,  dmgMult: 2.0, effect: null },
    { id: 'iron_guard',   name: '鐵壁',   mpCost: 5,  dmgMult: 0,   effect: 'shield_3' },
    { id: 'war_cry',      name: '戰吼',   mpCost: 10, dmgMult: 0,   effect: 'atk_up_3' },
  ],
  mage: [
    { id: 'fireball',     name: '火球',   mpCost: 10, dmgMult: 2.5, effect: 'burn_2' },
    { id: 'ice_lance',    name: '冰槍',   mpCost: 12, dmgMult: 2.2, effect: 'slow_2' },
    { id: 'thunder',      name: '閃電',   mpCost: 15, dmgMult: 3.0, effect: null },
    { id: 'mana_shield',  name: '魔力護盾', mpCost: 8, dmgMult: 0, effect: 'shield_5' },
  ],
  ranger: [
    { id: 'precise_shot', name: '精準射擊', mpCost: 6, dmgMult: 1.8, effect: 'ignore_def' },
    { id: 'poison_arrow', name: '毒箭',   mpCost: 8,  dmgMult: 1.2, effect: 'poison_3' },
    { id: 'evasion',      name: '閃避',   mpCost: 6,  dmgMult: 0,   effect: 'evade_1' },
    { id: 'double_shot',  name: '連射',   mpCost: 10, dmgMult: 1.5, effect: 'double_hit' },
  ],
};
```

### 狀態效果（status effects）

```javascript
const STATUS_EFFECTS = {
  shield:   { name: '護盾', icon: '🛡', type: 'buff',  onHit: (val) => `減傷 ${val}` },
  burn:     { name: '燃燒', icon: '🔥', type: 'debuff', onTurn: (state) => state.applyDelta({ hp: -4 }) },
  poison:   { name: '中毒', icon: '☠️', type: 'debuff', onTurn: (state) => state.applyDelta({ hp: -3 }) },
  slow:     { name: '緩速', icon: '🐢', type: 'debuff', atkMod: -3 },
  atk_up:   { name: '強化', icon: '⚔️', type: 'buff',  atkMod: +5 },
  evade:    { name: '閃避', icon: '💨', type: 'buff',  evadeChance: 0.6 },
};
```

---

## UI 規格（book.css / ui.js）

### 書本佈局

```
┌─────────────────────────────────────────┐
│  HEADER（章節標題 + turn 計數）           │
├──────────────────┬──────────────────────┤
│   LEFT PAGE      │   RIGHT PAGE          │
│                  │                       │
│  故事文字         │  選項 A               │
│  （打字機效果）   │  選項 B               │
│                  │  選項 C               │
│  ──────────────  │  選項 D               │
│  HP ████░░  90   │                       │
│  MP ██░░░░  40   │  [狀態效果圖示列]      │
│  XP ██████  60%  │                       │
│  ⚔14 🛡8 💰30    │  [道具欄 8 格]        │
│  ⭐ Lv3           │                       │
│                  │  [存檔按鈕]            │
├──────────────────┴──────────────────────┤
│  書脊（中央裝飾線）                        │
└─────────────────────────────────────────┘
```

### 存檔 UI（modal）

存檔/讀檔按鈕在右頁底部。點擊後彈出 modal，顯示 3 個手動存檔槽 + 1 個自動存檔，每個槽顯示：
- 存檔時間
- 回合數
- 玩家等級
- 場景預覽文字（前 40 字）
- 存入 / 讀取 按鈕

---

## 劇情節點清單（100+ 節點索引）

以下是所有節點的 ID 對照，實際內容在 `data/story.js`：

### 第一章：灰霧鎮（20 節點）
```
start               → 抵達灰霧鎮，初始場景
notice_board        → 告示牌：三張佈告
notice_reward       → 灰狼幫懸賞細節
notice_ruins_ban    → 遺跡禁令背景
notice_r_message    → 羅薇娜留言線索
tavern_enter        → 酒館破盾入口
tavern_bartender    → 老闆打聽情報
tavern_hood         → 凱倫（神秘人）初遇
tavern_hood_deal    → 凱倫提議交易
tavern_hood_org     → 無面者組織情報
tavern_steal_map    → 偷取醉漢地圖
tavern_map_study    → 研究殘破地圖
tavern_r_note       → 羅薇娜紙條
tavern_r_note_read  → 閱讀紙條內容
shop_enter          → 雜貨店老人
shop_buy_potion     → 購買生命藥水（30g）
shop_buy_armor      → 購買皮甲（45g）
shop_locked_book    → 說服老人交出鎖書
shop_ring           → 取得命運之戒
town_explore        → 鎮上閒逛，隱藏事件
```

### 第二章：礦坑（18 節點）
```
mine_approach       → 礦坑外觀察
mine_sneak          → 潛入礦坑
mine_fight_guards   → 正面擊倒守衛
mine_bluff_enter    → 假裝迷路靠近
mine_b1_corridor    → 第一層走廊
mine_b1_box         → 開啟木箱（道具 + 記事本）
mine_b1_badge       → 黑色徽章事件
mine_b2_enter       → 第二層入口
mine_b2_altar       → 無面者儀式場景
mine_b2_ambush      → 伏兵戰鬥
mine_b3_approach    → 第三層入口，感應到縫臉師
seam_master_meet    → 縫臉師登場對白
seam_master_talk    → 選擇對話（揭露動機）
seam_master_analyze → 分析封印符文位置
seam_master_fight_a → 正面攻擊（高難度）
seam_master_fight_s → 靈紋短刀破符文（智取）
seam_master_token   → 縫臉師主動交出令牌
mine_escape         → 帶著成果離開礦坑
```

### 第三章：遺跡入口（12 節點）
```
ruins_approach      → 夜晚遺跡外觀
ruins_meet_rovena   → 正門遇見羅薇娜
ruins_rovena_info   → 羅薇娜說明三塊石版
ruins_rovena_charm  → 取得遺跡護符
ruins_front_gate    → 持令牌通過正門
ruins_front_fight   → 強攻正門（4 守衛）
ruins_side_door     → 側門謎題（五行相生）
ruins_side_force    → 強行開門觸發陷阱
ruins_waterway      → 地下水道潛入
ruins_crawl_in      → 裂縫潛入（無道具路線）
ruins_mural         → 壁畫揭示書寫者歷史
ruins_f1_hall       → 第一層大廳，三通道入口
```

### 第四章：火焰祭壇（10 節點）
```
fire_corridor       → 進入火焰通道，溫度升高
fire_hall_enter     → 大廳，石像哥德睜眼
fire_golem_talk     → 石像宣告試煉規則
fire_golem_analyze  → 觀察火把機關分布
fire_golem_smart    → 關閉火把，石像失去感知
fire_golem_fight    → 正面戰鬥（高消耗）
fire_golem_grab     → 強行取版（觸發攻擊）
fire_golem_down     → 石像倒下動畫
fire_slab_obtain    → 取得火焰石版，感受「過去」
fire_exit           → 離開火焰祭壇
```

### 第五章：水鏡祭壇（10 節點）
```
water_corridor      → 進入水鏡通道，苔蘚與積水
water_hall_enter    → 中央水鏡，水波流動
water_riddle_q      → 謎語出現
water_riddle_a1     → 回答「秘密」（錯誤）
water_riddle_a2     → 回答「命運」（正確）
water_riddle_a3     → 回答「時間」（錯誤）
water_riddle_fail1  → 第一次回答錯誤懲罰
water_riddle_fail2  → 第二次回答錯誤懲罰
water_slab_obtain   → 取得水鏡石版，感受「現在」
water_exit          → 離開水鏡祭壇
```

### 第六章：虛空祭壇（14 節點）
```
void_bridge         → 石橋橫跨虛空，視覺衝擊
void_hall_enter     → 書靈現身，白袍老人
void_spirit_talk    → 書靈開場白
void_q_self         → 回答「改寫自己的命運」
void_q_protect      → 回答「阻止無面者」
void_q_seal         → 回答「封印它」（隱藏觸發）
void_sacrifice_yes  → 願意犧牲自己
void_sacrifice_no   → 不願意
void_sacrifice_unsure → 不確定（最高評價）
void_sacrifice_honest → 盡力就好（書靈放心）
void_self_glimpse   → 瞥見自己的命運頁
void_self_decide    → 決定是否改寫
void_slab_obtain    → 取得虛空石版，感受「未來」
void_exit           → 離開虛空祭壇
```

### 第七章：命運核心（16 節點）
```
core_descent        → 下降至最深層
core_atmosphere     → 命運核心的環境描寫
core_slabs_unite    → 三塊石版自動聚合
core_book_awakens   → 命運之書復甦，光芒萬丈
core_book_voice     → 書的聲音響起
core_faceless_crash → 無面者最後的衝擊（最終防線）
core_boss_fight     → 無面者首領戰鬥（最終 BOSS）
core_boss_down      → 首領倒下
core_choice_rewrite → 選擇：改寫命運
core_choice_seal    → 選擇：封印無面者
core_choice_give    → 選擇：交給羅薇娜
core_choice_void    → 選擇：讓書回歸虛空
core_rewrite_see    → 看見自己的命運頁
core_rewrite_done   → 確認改寫
ending_truth        → 結局：真實（書回歸虛空）
ending_self         → 結局：自我（改寫命運）
ending_guardian     → 結局：守護者（封印無面者）
ending_trust        → 結局：信任（交給羅薇娜）
ending_sealed_secret→ 結局：隱藏（三百年的答案）
ending_death        → 結局：死亡
```

---

## 開發優先順序

### Sprint 1（第 1 週）— 骨架
1. 建立目錄結構
2. 完成 `gameState.js`（狀態管理、applyDelta、flag 系統）
3. 完成 `storyEngine.js`（節點跳轉、條件判斷、onEnter 觸發）
4. 完成 `book.css` 基礎佈局（雙頁、書脊）
5. 填入約 30 個核心節點（start → ruins_f1_hall）

### Sprint 2（第 2 週）— 核心玩法
1. 完成 `combat.js`（回合制戰鬥、技能、狀態效果）
2. 完成 `saveManager.js`（3 槽 + 自動存檔）
3. 完成存檔 UI modal
4. 填入三個祭壇所有節點（30 節點）
5. 完成道具系統（使用、裝備加成）

### Sprint 3（第 3 週）— 完整內容
1. 填入第七章命運核心所有節點（16 節點）
2. 完成六大結局
3. 完成全部 100+ 節點
4. 戰鬥動畫與音效（選配）
5. RWD 手機版適配

### Sprint 4（第 4 週）— 品質
1. 全流程 QA（每條主線跑完）
2. 補充遺漏選項與邊界情況
3. 效能優化（首屏載入速度）
4. 視覺化編輯器（editor.html，獨立工具）

---

## 常用 Claude Code 指令範例

```bash
# 新增一個劇情節點
"在 data/story.js 的 mine_b2_altar 節點後面，新增一個節點 mine_b2_ritual，描述無面者正在進行儀式的場景，有三個選項：打斷儀式、躲起來觀察、尋找機會偷取儀式道具。打斷儀式觸發戰鬥，偷取道具需要遊俠職業條件。"

# 修改戰鬥系統
"在 js/combat.js 裡，幫縫臉師加入第二階段：當 HP 低於 30% 時，觸發「瘋狂縫合」技能，恢復 15 HP 並提升 ATK +3，但同時破壞一個封印符文（如果還有的話）。"

# 新增存檔功能
"在 js/saveManager.js 裡新增一個 exportSave() 函式，把目前的存檔資料轉成 JSON 字串，讓玩家可以複製貼上分享存檔。同時新增 importSave(jsonStr) 讀取外部存檔。"

# 修改 UI
"在書本右頁底部新增一個狀態效果欄，用小圖示 + 剩餘回合數的方式顯示玩家目前的 buff/debuff（燃燒、護盾、中毒等）。"
```

---

## 注意事項

- `flags` 和 `visitedNodes` 是 `Set`，存入 localStorage 前必須轉成 `Array`，讀取後轉回 `Set`
- 節點 `text` 支援多行，用模板字串（反引號）撰寫，換行用 `\n\n` 分段
- 戰鬥中敵人死亡後需更新 `state.flags`，確保後續節點能判斷「縫臉師已被擊敗」
- 所有傷害計算最低值為 1（避免 0 傷害讓戰鬥永遠不結束）
- 存檔槽讀取失敗（資料損毀）時，靜默忽略，顯示「空槽」，不拋出錯誤

---

## 版本記錄

| 版本 | 說明 |
|------|------|
| v0.1 | MVP：30 節點，無戰鬥，無存檔 |
| v1.0 | 離線完整版：40 節點，基礎戰鬥，無存檔 |
| v2.0 | **當前**：100+ 節點，強化戰鬥，3 槽存檔，技能系統 |
| v3.0 | 計畫：React 重構，Supabase 雲存檔，視覺化編輯器 |
