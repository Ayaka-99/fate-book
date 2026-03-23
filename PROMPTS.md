# 命運之書 v2.0 — Claude Code 提示詞手冊

使用方式：在你的專案根目錄開啟 Claude Code（`claude`），
直接複製以下提示詞貼入終端機即可。

---

## 一、專案初始化

### 1-1 建立完整目錄結構

```
請幫我建立一個名為 fate-book 的專案目錄，結構如下：

fate-book/
├── index.html
├── CLAUDE.md（已存在，不要覆蓋）
├── css/
│   ├── base.css
│   ├── book.css
│   ├── ui.css
│   └── animations.css
├── js/
│   ├── main.js
│   ├── gameState.js
│   ├── storyEngine.js
│   ├── combat.js
│   ├── saveManager.js
│   ├── ui.js
│   └── typewriter.js
└── data/
    ├── story.js
    ├── enemies.js
    └── items.js

每個檔案先建立空的骨架（帶有頂部說明注釋），不需要實作內容。
```

---

### 1-2 建立 gameState.js

```
請實作 js/gameState.js，規格如下：

- 匯出一個 GameState 類別
- 包含 DEFAULT_STATE 物件（玩家數值、道具、旗標、當前節點、回合數）
- 方法：
  - applyDelta({ hp, mp, xp, gold, atk, def })：套用數值變化，HP/MP 不超過上限，自動觸發升級判斷
  - addItem(itemId)：加入道具，超過 8 格時回傳 false
  - removeItem(itemId)：移除道具
  - hasItem(itemId)：檢查是否持有
  - setFlag(flag)：設置劇情旗標
  - hasFlag(flag)：檢查旗標
  - levelUp()：升級邏輯（HP+12, MP+8, ATK+2, DEF+1, xpNext×1.45）
  - reset()：重置為初始狀態

旗標（flags）和已訪問節點（visitedNodes）使用 Set 儲存。
```

---

### 1-3 建立 saveManager.js

```
請實作 js/saveManager.js，規格如下：

localStorage key：
- fate_book_save_0、fate_book_save_1、fate_book_save_2（手動存檔槽）
- fate_book_autosave（自動存檔）

匯出函式：
- save(slot, gameState)：存檔到指定槽（0/1/2）
  - 存檔資料包含：version, timestamp, playtime, turn, currentNode, player, inventory, flags（Array）, visitedNodes（Array）, screenshot（場景文字前 40 字）
  - flags 和 visitedNodes 是 Set，存入前轉 Array
- load(slot)：讀取存檔，回傳 GameState 物件（flags 和 visitedNodes 轉回 Set）
- autoSave(gameState)：自動存檔（同 save，但存到 autosave key）
- getSaveInfo(slot)：回傳存檔摘要（timestamp, turn, playerLv, screenshot），用於存檔卡片顯示
- deleteSave(slot)：刪除存檔
- hasSave(slot)：檢查存檔是否存在
- exportSave(slot)：把存檔轉成 base64 字串供玩家複製
- importSave(str)：把 base64 字串轉回存檔並寫入 slot 0

讀取失敗時靜默回傳 null，不拋出錯誤。
```

---

### 1-4 建立 combat.js

```
請實作 js/combat.js，規格如下：

傷害公式：
- 玩家攻擊敵人：Math.max(1, player.atk + skillBonus + itemBonus - enemy.def + random(0,3))
- 敵人攻擊玩家：Math.max(1, enemy.atk - player.def - shieldBonus + random(0,2))

匯出 Combat 類別，方法：
- constructor(player, enemyId, state)：初始化戰鬥，從 ENEMIES 資料表取得敵人資料
- playerAttack()：普通攻擊，回傳 { damage, isCrit, log }
- playerSkill(skillId)：技能攻擊，消耗 MP，回傳 { damage, effect, log }
- useItem(itemId)：使用道具，回傳 { healed, log }
- tryFlee()：逃跑（成功率 40%），回傳 { success, log }
- enemyTurn()：敵人行動，根據技能 chance 隨機選擇，回傳 { damage, skillUsed, log }
- checkWin()：回傳 'win' | 'lose' | 'ongoing'
- applyStatusEffects()：每回合結尾套用燃燒/毒素等 DOT 效果

縫臉師特殊機制（seam_master）：
- 剛開始時 def += seals × sealDefBonus（3 個封印 = def+18）
- 每次玩家攻擊，如果持有靈紋短刀（spirit_dagger），且傷害 > 0，破壞一個封印，def 降低 sealDefBonus
- 封印破壞時顯示特殊訊息

BOSS 石像哥德（fire_golem）：
- 如果玩家先執行了「關閉火把」行動（hasFlag('torches_off')），則 golem.def = 0，且每回合不行動（困惑狀態）
- 否則正常戰鬥，但 atk 極高
```

---

### 1-5 建立書本介面 HTML + CSS

```
請幫我完成 index.html 和對應的 CSS 檔案，建立命運之書的書本介面：

HTML 結構：
1. 歡迎頁面（#welcome）：全螢幕遮罩，含英雄名字輸入、三職業選擇（劍士/法師/遊俠）、開始按鈕
2. 書本（#book）：雙頁佈局，中央有書脊裝飾線
   - 左頁（#left-page）：故事文字區 + 角色狀態欄（HP/MP/XP 條 + 數值徽章 + 道具欄 8 格）
   - 右頁（#right-page）：回合數顯示 + 選項按鈕列表 + 存讀檔按鈕
3. 戰鬥介面（#combat-panel）：疊在書本上的半透明遮罩，顯示敵人資訊、戰鬥日誌、行動按鈕
4. 存檔 modal（#save-modal）：4 個存檔槽卡片（3 手動 + 1 自動）
5. 結局畫面（#ending-screen）：全螢幕，標題 + 結局文字 + 重新開始按鈕
6. Toast 通知（#toast）：右上角短暫提示

視覺風格：
- 背景：深褐色木紋質感（#1a0e04）
- 左頁：米色羊皮紙（#f5ead8）
- 右頁：略深米色（#ede0c4）
- 強調色：金色（#c9a84c）
- 字型：Noto Serif TC（正文）+ Cinzel（標題）
- 書脊：中央 8px 漸層棕色線 + 陰影

動畫：
- 打字機效果（逐字顯示，速度可調）
- 選項按鈕：hover 時左邊框變金色、文字位移
- 存檔槽：hover 微微上浮
- Toast：從右滑入，3 秒後滑出
```

---

## 二、劇情節點填充

### 2-1 填入第一章（灰霧鎮 20 節點）

```
請在 data/story.js 填入第一章「灰霧鎮」的所有節點，節點 ID 對照：
start, notice_board, notice_reward, notice_ruins_ban, notice_r_message,
tavern_enter, tavern_bartender, tavern_hood, tavern_hood_deal, tavern_hood_org,
tavern_steal_map, tavern_map_study, tavern_r_note, tavern_r_note_read,
shop_enter, shop_buy_potion, shop_buy_armor, shop_locked_book, shop_ring, town_explore

劇情摘要請參考 CLAUDE.md 的世界觀設定。每個節點需要：
- 2~4 段生動的場景描述文字（共 80~150 字）
- 2~4 個選項
- 適當的 onEnter 效果（XP 獎勵、道具、旗標）
- 條件分支（如需要特定道具才能顯示的選項）

特別注意：
- start 節點：黃昏抵達灰霧鎮，帶著腐敗甜味的空氣，鎮民警惕眼神
- tavern_hood：凱倫的臉上有舊疤，眼神銳利，第一句話讓玩家震驚
- shop_locked_book：老人說「真正的尋書者不需要副本」，強調命運之戒的神秘性
```

---

### 2-2 填入第二章（礦坑 18 節點）

```
請在 data/story.js 填入第二章「廢棄礦坑」的所有節點：
mine_approach, mine_sneak, mine_fight_guards, mine_bluff_enter,
mine_b1_corridor, mine_b1_box, mine_b1_badge,
mine_b2_enter, mine_b2_altar, mine_b2_ambush,
mine_b3_approach, seam_master_meet, seam_master_talk,
seam_master_analyze, seam_master_fight_a, seam_master_fight_s,
seam_master_token, mine_escape

重點設計：
- mine_b1_badge：黑色徽章有心靈感應，聽到「你已被標記」的聲音，HP -5
- mine_b2_altar：玩家看到無面者的儀式，感受到黑暗力量的壓迫
- seam_master_meet：縫臉師說「我已在等你」，語氣平靜而非憤怒，製造懸念
- seam_master_talk：縫臉師說出「命運之書不應被那些強行守護它的人壟斷」，揭示複雜動機
- seam_master_fight_s：使用靈紋短刀時，加入 condition: (state) => state.hasItem('spirit_dagger')
- seam_master_token：取得守衛令牌，設置旗標 'has_guardian_token'
```

---

### 2-3 填入三個祭壇（34 節點）

```
請在 data/story.js 填入火焰、水鏡、虛空三個祭壇的所有節點。

火焰祭壇（10 節點）重點：
- fire_golem_smart：需要 hasFlag('torches_analyzed')，成功設置 hasFlag('torches_off')，石像失去感知
- fire_golem_fight：觸發戰鬥，combat: { enemyId: 'fire_golem', nextOnWin: 'fire_golem_down', nextOnLose: 'death_screen' }
- fire_slab_obtain：取得道具 'fire_slab'，文字描述玩家感受到無數過去的記憶湧入

水鏡祭壇（10 節點）重點：
- water_riddle_a2（正確答案「命運」）：觸發 onEnter 設置 hasFlag('riddle_solved')，addItem('water_slab')
- 錯誤答案：applyDelta({ hp: -10 })，回到重新作答的選項

虛空祭壇（14 節點）重點：
- void_sacrifice_unsure：書靈說「不知道，是最誠實的答案」，這是最高評價，XP +45
- void_q_seal：觸發隱藏旗標 'chose_to_seal'，這個旗標在最終章影響結局
- void_slab_obtain：取得道具 'void_slab'，三塊石版都到手時顯示特殊提示
```

---

### 2-4 填入第七章（命運核心 16 節點 + 6 結局）

```
請在 data/story.js 填入第七章「命運核心」所有節點：
core_descent, core_atmosphere, core_slabs_unite, core_book_awakens,
core_book_voice, core_faceless_crash, core_boss_fight, core_boss_down,
core_choice_rewrite, core_choice_seal, core_choice_give, core_choice_void,
core_rewrite_see, core_rewrite_done,
ending_truth, ending_self, ending_guardian, ending_trust,
ending_sealed_secret, ending_death

重點設計：
- core_slabs_unite：三塊石版條件 condition: (s) => s.hasItem('fire_slab') && s.hasItem('water_slab') && s.hasItem('void_slab')
- core_boss_fight：最終 BOSS 戰，combat: { enemyId: 'faceless_lord', nextOnWin: 'core_boss_down', nextOnLose: 'death_screen' }
- ending_sealed_secret：只有當 hasFlag('chose_to_seal') 時才能從 void_exit 觸發，這是隱藏結局
- ending_truth：isEnding: true，endType: 'victory'，endTitle: '✦ 真實結局 ✦'
- ending_death：isEnding: true，endType: 'dead'，提供讀取存檔選項

每個結局需要：50~100 字的結局文字 + endTitle + endMsg（一句話主題總結）
```

---

## 三、強化功能

### 3-1 戰鬥 UI

```
請在 js/ui.js 實作完整的戰鬥 UI，顯示在 #combat-panel 內：

佈局：
- 上方：敵人資訊（名稱、emoji、HP 條、狀態效果圖示）
- 中間：戰鬥日誌（最新 5 條記錄，玩家行動用金色、敵人行動用紅色、系統訊息用灰色）
- 下方：四個行動按鈕（普通攻擊、技能選單、使用道具、逃跑）

技能選單：點擊「技能」後展開子選單，顯示職業技能列表，每個技能顯示名稱 + MP 消耗，MP 不足的技能顯示為灰色禁用狀態。

特殊效果：
- 玩家受到傷害時，左頁 HP 條閃紅光
- 敵人受到傷害時，敵人 emoji 輕微震動
- 升級時，整個畫面短暫金色光效
- BOSS 封印符文破壞時，顯示裂縫動畫
```

---

### 3-2 存檔 Modal UI

```
請在 js/ui.js 實作存檔/讀檔 modal，需求如下：

Modal 有兩個頁籤：「存檔」和「讀檔」

每個存檔槽顯示：
- 存檔時間（格式：YYYY/MM/DD HH:mm）
- 角色等級 + 職業
- 當前回合數
- 場景預覽文字（前 40 字，灰色細字）
- 空槽顯示「空存檔」

存檔頁籤：點擊槽位後確認是否覆蓋（若有資料），再執行存檔
讀檔頁籤：點擊槽位後確認是否讀取，執行後回到對應的遊戲節點

自動存檔槽：每次做選擇後自動觸發，modal 中顯示「自動存檔」標籤但不能手動存入

另外在右頁底部加入兩個按鈕：💾 存檔 / 📂 讀檔，點擊後打開 modal
```

---

### 3-3 狀態效果系統

```
請在 js/combat.js 完善狀態效果系統：

效果列表：
- shield（護盾）：減少受到的傷害，持續 N 回合
- burn（燃燒）：每回合損失 4 HP，持續 N 回合
- poison（中毒）：每回合損失 3 HP，持續 N 回合
- slow（緩速）：ATK -3，持續 N 回合
- atk_up（強化）：ATK +5，持續 N 回合
- evade（閃避）：60% 機率完全閃避下一次攻擊，持續 1 次

每回合結尾：
1. 套用 DOT 效果（燃燒/中毒）
2. 減少所有效果的剩餘回合數
3. 移除到期的效果
4. 更新 UI 的狀態效果圖示欄

在右頁顯示一排狀態效果小圖示（emoji + 剩餘回合數），buff 用金色背景、debuff 用紅色背景
```

---

### 3-4 道具使用整合

```
請確保道具系統正確整合：

戰鬥中：
- 點擊「使用道具」展開背包
- 只顯示可用道具（usable: true）
- 使用後從背包移除，套用效果，消耗半個回合（敵人立刻反擊）

非戰鬥中：
- 點擊背包格子可使用可用道具
- 不可用道具（裝備型）顯示 tooltip 說明效果
- 靈紋短刀在戰鬥 UI 的敵人旁顯示「有效」標籤（當敵人有 'faceless' tag 時）

命運之戒（fate_ring）：
- 在虛空祭壇所有選項上顯示一個微小的「♦」標記
- 選擇時讓書靈多說一句話（需要加入 condition 判斷）
```

---

## 四、視覺化劇情編輯器

### 4-1 建立獨立的 editor.html

```
請建立一個獨立的視覺化劇情編輯器 editor.html，功能如下：

左側：節點列表（搜尋 + 篩選）
中間：畫布（節點圖，用 SVG 或 Canvas 繪製節點方塊和連線箭頭）
右側：節點編輯面板

節點圖：
- 每個節點顯示為一個方塊（ID + 場景文字前 20 字）
- 選項連線顯示為帶箭頭的線，線上顯示選項文字
- 拖拉節點方塊可以移動位置
- 滾輪縮放畫布

右側編輯面板：
- 點擊節點後，右側顯示該節點的所有欄位（text, choices, onEnter, combat, isEnding）
- 每個欄位都可以直接編輯
- 新增/刪除選項
- 選項的 next 欄位可以從節點列表下拉選擇
- 儲存按鈕：把修改寫回資料，並匯出成 story.js 可貼入的格式

工具列：
- 新增節點
- 刪除節點（確認後）
- 匯入 JSON
- 匯出 JSON
- 匯出為 story.js 格式
```

---

## 五、除錯與優化

### 5-1 全流程 QA 指令

```
請幫我測試以下三條主線是否能完整跑通：

路線 A（情報路線）：
start → notice_board → tavern_enter → tavern_hood → tavern_hood_org → mine_approach → mine_sneak → mine_b1_corridor → mine_b2_enter → seam_master_meet → seam_master_fight_s → mine_escape → ruins_approach → ruins_front_gate → ruins_f1_hall → fire_hall_enter → fire_golem_fight → fire_slab_obtain → water_hall_enter → water_riddle_a2 → water_slab_obtain → void_hall_enter → void_q_protect → void_sacrifice_unsure → void_slab_obtain → core_descent → core_boss_fight → core_choice_void → ending_truth

路線 B（學術路線）：
start → notice_board → tavern_r_note → shop_enter → shop_ring → ruins_approach → ruins_meet_rovena → ruins_f1_hall → water_hall_enter → water_riddle_a2 → fire_hall_enter → fire_golem_smart → void_hall_enter → void_q_seal → void_slab_obtain → core_descent → ending_sealed_secret

路線 C（強行路線）：
start → ruins_approach → ruins_crawl_in → ruins_mural → ruins_f1_hall → fire_hall_enter → fire_golem_grab → fire_golem_fight → ...

對每條路線檢查：
1. 所有節點 ID 都存在於 story.js
2. 條件分支的旗標都有在前置節點中設置
3. 所有 combat 節點的 enemyId 都存在於 enemies.js
4. 所有 onEnter addItem 的 itemId 都存在於 items.js
5. 最終能到達 isEnding: true 的節點
```

---

### 5-2 常用除錯指令

```
# 找出所有 next 指向不存在節點的選項
請掃描 data/story.js，找出所有 choices 中 next 欄位指向的節點 ID 在 STORY 物件中找不到對應 key 的情況，列出「[來源節點] → [不存在的目標節點]」清單。

# 找出孤立節點（沒有任何其他節點指向它的節點）
請掃描 data/story.js，找出所有沒有被任何 choices.next 引用的節點（除了 start 節點），列出孤立節點清單。

# 確認所有道具 ID 正確
請掃描 data/story.js 中所有 addItem() 呼叫的 itemId，對照 data/items.js 確認都存在。

# 確認存檔系統正常
請在 js/saveManager.js 加入一個 testSaveLoad() 函式，建立一個假的 GameState，存入 slot 0，再讀取出來，比對兩者的 player、inventory、flags 是否完全一致，在 console 輸出測試結果。
```

---

## 六、世界觀速查（給 Claude Code 生成劇情用）

### 核心設定

- **書寫者**：三百年前的賢者，創造命運之書後將其分成三塊石版
- **命運之書**：火焰石版（過去）+ 水鏡石版（現在）+ 虛空石版（未來）合體後的神器
- **書靈**：命運之書的意識具現，三百年孤獨守護，等待「願意放下的人」
- **無面者**：信仰古老被封印存在，相信命運之書能破除所有封印
- **縫臉師**：無面者頭目，臉上有黑色縫合痕跡，其實相信「命運應屬於選擇者」

### NPC 性格

- **凱倫**：冷靜、言簡意賅、背後有秘密、不輕易信任他人
- **羅薇娜**：疲憊但堅定、學術語氣、老師之死讓她有些偏執
- **縫臉師**：平靜、哲學性、不是純粹的惡反派
- **書靈**：溫和、洞察力強、不評判只陳述、等了三百年終於放鬆

### 語言風格

- 說書人口吻，文學性強
- 用感官描寫強化氛圍（氣味、溫度、聲音）
- 對話簡短有力，避免冗長說明
- 關鍵時刻用短句製造節奏感

---

## 七、完整劇情文字備份

以下是所有已確認的劇情文字，可直接複製到 data/story.js：

### 第一幕節點文字

**start**
```
灰霧鎮的黃昏帶著一股腐敗的甜味。

你踏入這座邊境小鎮時，鎮民們投來警惕的目光，隨即別過視線。街角一塊告示牌上釘著新鮮的佈告，墨跡猶未乾透。

酒館「破盾」的燈火在暮色中搖曳，鐵匠鋪的鐵砧聲已然沉寂，而鎮外那片古老的遺跡——據說命運之書就藏匿其中——在暮靄中若隱若現。
```

**tavern_hood**
```
你走近那個兜帽人，他抬起頭——是個年輕男人，臉上有道舊疤，眼神銳利如刃。

「我知道你在找什麼，」他說，聲音出奇平靜，「命運之書。」

他把一枚古舊的徽章推到桌上。「我是遺跡守衛隊的前成員。兩個月前，有個神秘組織的人進入遺跡，殺死了我的同伴，奪走了守衛令牌。沒有令牌，遺跡的陷阱會對你無差別攻擊。」

他停頓了一下，眼中閃過一絲難以辨識的情緒。「幫我殺了他們的頭目，我帶你安全進入遺跡。」
```

**seam_master_meet**
```
礦坑越深越冷，牆壁上的符文越來越密集，散發著幽綠的微光。

你聽見前方有低沉的吟誦聲，繞過一個彎，看見了那個人——縫臉師。

他的臉上真的有縫合的痕跡，粗糙的黑線縱橫交錯，嘴角被縫成一個永恆的微笑。他沒有回頭，但開口說：

「我已在等你了。命運之書選擇了你，所以你來到了這裡。但你能承受它的重量嗎？」

他緩緩轉身，手持一根刻滿符文的法杖，眼神裡沒有一絲敵意。
```

**void_spirit_talk**
```
書靈向你伸出手，那隻手透明而蒼老。

「每個走到這裡的人，都帶著自己的欲望，」它說，聲音像從極深的地方傳來，「力量、知識、復仇、愛——我見過太多了。」

「但我只問你一個問題。」它的眼睛直視著你，彷彿看穿了你來此之前的每一個念頭。

「你拿到命運之書之後，想做什麼？」

大廳的虛空在你身周默默擴張，時間像是靜止了。
```

**ending_truth**
```
你將雙手放在命運之書上，閉上眼睛。

光芒從你的指尖漫延，穿過石版，穿過遺跡的每一塊石頭，向外蔓延——無面者的符文一個個熄滅，縫臉師的法術煙消雲散。

然後，命運之書化為一道白光，消散在空氣中。

遺跡的牆壁發出輕輕的嘆息，彷彿三百年的重擔終於卸下。書靈現身於你面前，深深鞠躬。

「謝謝你，旅人。命運之書不再屬於任何人——但它的智慧，已永遠刻在這個世界的每一個角落。」

夜空下，灰霧鎮的燈火一盞盞亮起。
```
