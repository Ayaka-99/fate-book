# 命運之書 v2.0 — 完整劇情節點文字稿

直接複製此檔案的內容到 `data/story.js` 使用。

---

## 使用方式

```javascript
// data/story.js
const STORY = {
  // 把下面每個節點的內容依序貼入
};
```

---

## 第一章：灰霧鎮

### start
```
text: `灰霧鎮的黃昏帶著一股腐敗的甜味。

你踏入這座邊境小鎮時，鎮民們投來警惕的目光，隨即別過視線。街角一塊告示牌上釘著新鮮的佈告，墨跡猶未乾透。

酒館「破盾」的燈火在暮色中搖曳，鐵匠鋪的鐵砧聲已然沉寂，而鎮外那片古老的遺跡——據說命運之書就藏匿其中——在暮靄中若隱若現。`,
choices: [
  { text: '走向告示牌，仔細閱讀內容', next: 'notice_board' },
  { text: '推開酒館大門，打聽消息', next: 'tavern_enter' },
  { text: '不理會鎮子，直接前往遺跡', next: 'ruins_approach' },
],
onEnter: (s) => { s.applyDelta({ xp: 5 }); }
```

### notice_board
```
text: `告示牌上貼著三張佈告。

第一張是懸賞令：「灰狼幫近日在北方山道出沒，活捉首領賞金三百枚金幣。」第二張是警告：「禁止任何人進入東側遺跡，違者驅逐出鎮。」

第三張字跡潦草，像是匆忙貼上的：「有人知道命運之書下落，見面詳談，可付重酬。落款：R。」

落款只有一個字母，毫無線索。但那提到命運之書——這正是你長途跋涉的目的。`,
choices: [
  { text: '去酒館找出這個「R」是誰', next: 'tavern_enter' },
  { text: '打聽灰狼幫的事，也許能賺些路費', next: 'notice_reward' },
  { text: '先進遺跡，不管告示上的禁令', next: 'ruins_approach' },
],
onEnter: (s) => { s.applyDelta({ xp: 5 }); }
```

### notice_reward
```
text: `一個賣薯餅的老婦人悄聲告訴你，灰狼幫的首領叫做「斷牙」，是個獨眼巨漢，手下有二十多人盤踞在鎮北的廢棄礦坑裡。

「他們不只是劫匪，」老婦人壓低聲音，「有人說他們在替某個神秘組織蒐集古代遺物。最近有幾個外來的探險家進了礦坑，就再也沒出來。」

她往你手裡塞了一顆薯餅，搖搖頭走開了。薯餅有點涼，但味道不錯。`,
choices: [
  { text: '感謝老婦人，去酒館再打聽詳情', next: 'tavern_enter' },
  { text: '直接前往礦坑', next: 'mine_approach' },
],
onEnter: (s) => { s.applyDelta({ xp: 8 }); }
```

### notice_ruins_ban
```
text: `你向路邊的老人詢問遺跡禁令的由來。

「三個月前開始的，」老人嘆了口氣，「鎮長說遺跡附近有不明人士出沒，怕傷到鎮民。但我在這住了六十年，那遺跡從來沒傷過任何人。反倒是那些『不明人士』……」

他壓低聲音：「有人說是一個叫做無面者的組織。他們的人臉上都戴著面具，晚上才出沒。年輕人，你若要進那遺跡，小心著點。」`,
choices: [
  { text: '謝過老人，去酒館了解更多', next: 'tavern_enter' },
  { text: '決定繞道進入遺跡', next: 'ruins_approach' },
],
onEnter: (s) => { s.applyDelta({ xp: 8 }); s.setFlag('knows_faceless'); }
```

### tavern_enter
```
text: `「破盾」酒館裡煙霧瀰漫，充斥著廉價麥酒和汗臭的混合氣味。

角落裡一個戴兜帽的身影正獨自喝酒。吧台後的胖老闆擦著杯子，見你進來，表情複雜——像是認識你，又像是在評估你。一個醉漢趴在桌上鼾睡，手裡還握著一張地圖的邊角。

四周的食客沒有人交談，只是各自盯著杯底。`,
choices: [
  { text: '向老闆打聽「R」的事', next: 'tavern_bartender' },
  { text: '走向角落的神秘人', next: 'tavern_hood' },
  { text: '趁醉漢沉睡，悄悄取走他的地圖', next: 'tavern_steal_map' },
],
onEnter: (s) => { s.applyDelta({ xp: 5 }); }
```

### tavern_bartender
```
text: `老闆聽到「R」這個名字，杯子差點從手中滑落。

「你最好別問這個，」他湊近壓低聲音，「那位羅薇娜女士是個麻煩人物。學者、盜墓賊、還是魔法師——說不清楚。三天前她在角落那桌坐了一整夜，畫了滿桌子的符文，然後消失了。」

他猶豫了一下，從圍裙口袋裡掏出一張折疊的紙條。「她臨走前留下這個，說要給『對命運之書感興趣的旅人』。」`,
choices: [
  { text: '打開紙條閱讀', next: 'tavern_r_note_read' },
  { text: '先去找那個兜帽人，再看紙條', next: 'tavern_hood' },
],
onEnter: (s) => { s.applyDelta({ xp: 10 }); s.addItem('rovena_note'); }
```

### tavern_r_note_read
```
text: `紙條上的字跡細小而工整，夾雜著一些你看不懂的古代符號。

「命運之書並非一本普通的書。它由三塊封印石版組成——分別藏在遺跡深處的三個祭壇中。每個祭壇都有守護者。

第一塊：火焰祭壇，守護者為石像哥德。
第二塊：水鏡祭壇，以謎語為鑰。
第三塊：虛空祭壇，考驗真正的意志。

找到我，我在遺跡的入口等候。——R」

你將紙條小心折好。命運之書竟然是三塊石版……這意味著比你想像的更複雜。`,
choices: [
  { text: '立刻前往遺跡入口找羅薇娜', next: 'ruins_approach' },
  { text: '先去找那個兜帽男人', next: 'tavern_hood' },
  { text: '先去商店補充物資', next: 'shop_enter' },
],
onEnter: (s) => { s.applyDelta({ xp: 15 }); s.setFlag('knows_three_slabs'); }
```

### tavern_hood
```
text: `你走近那個兜帽人，他抬起頭——是個年輕男人，臉上有道舊疤，眼神銳利如刃。

「我知道你在找什麼，」他說，聲音出奇平靜，「命運之書。」

他把一枚古舊的徽章推到桌上。「我是遺跡守衛隊的前成員。兩個月前，有個神秘組織進入遺跡，殺死了我的同伴，奪走了守衛令牌。沒有令牌，遺跡的陷阱會對你無差別攻擊。」

他停頓了一下。「幫我殺了他們的頭目，我帶你安全進入遺跡。」`,
choices: [
  { text: '接受交易，問他頭目在哪', next: 'tavern_hood_deal' },
  { text: '拒絕，問他更多關於組織的情報', next: 'tavern_hood_org' },
  { text: '拒絕，你有自己的方式進入', next: 'ruins_approach' },
],
onEnter: (s) => { s.applyDelta({ xp: 10 }); s.setFlag('met_kalen'); }
```

### tavern_hood_deal
```
text: `他自稱凱倫，告訴你無面者的頭目叫做「縫臉師」，藏身在礦坑最深處。

「他不是普通人，」凱倫警告，「他會縫合自己的傷口——除非先破壞他身上的封印符文，否則普通武器無法真正傷害他。」

他遞給你一把短刀，刀身上刻著奇特的紋路。「這把刀能傷害無面者的術士。帶它去。」

他在礦坑地圖上畫了幾個叉號，把地圖推向你。「我在遺跡正門等你。殺了縫臉師，帶回他身上的守衛令牌。」`,
choices: [
  { text: '前往礦坑', next: 'mine_approach' },
  { text: '先去商店準備物資', next: 'shop_enter' },
],
onEnter: (s) => { s.addItem('spirit_dagger'); s.addItem('mine_map'); s.applyDelta({ xp: 12 }); s.setFlag('accepted_kalen_deal'); }
```

### tavern_hood_org
```
text: `凱倫把自己知道的一切說了出來。

「他們叫做無面者，信仰一個被封印的古老存在。他們相信命運之書能破除所有封印，讓那個存在重返世界。」他的聲音沉了下去，「如果他們得到命運之書，災厄將不可逆轉。」

他從懷裡取出一把短刀，刀身上刻著奇特的紋路，發著幽暗的光。「這把靈紋短刀能傷害無面者的術士，普通武器對他們效果很差。你去礦坑一定需要它。」`,
choices: [
  { text: '與凱倫合作，一起對抗無面者', next: 'tavern_hood_deal' },
  { text: '獨自前往遺跡，小心無面者', next: 'ruins_approach' },
  { text: '先去礦坑調查', next: 'mine_approach' },
],
onEnter: (s) => { s.addItem('spirit_dagger'); s.applyDelta({ xp: 12 }); s.setFlag('knows_faceless_goal'); }
```

### tavern_steal_map
```
text: `你悄悄靠近，正要伸手——醉漢突然睜眼。

「抓賊！」他大叫，雖然站不穩，但動靜驚動了全場。你來不及解釋，酒館老闆已經操起了掃把。

你狼狽逃出酒館，卻在懷裡摸到了半張地圖——逃跑時不知怎的帶了出來。地圖上標著遺跡的側門位置，以及一個用紅叉標注的地點，旁邊寫著潦草的小字。`,
choices: [
  { text: '仔細研究地圖上的紅叉標記', next: 'tavern_map_study' },
  { text: '按照地圖直接找側門', next: 'ruins_side_door' },
],
onEnter: (s) => { s.applyDelta({ xp: 5, hp: -5, gold: -5 }); s.addItem('torn_map'); }
```

### tavern_map_study
```
text: `你找了個暗處仔細研究這半張地圖。

紅叉標注的地點在遺跡最深處，旁邊寫著一行細小的字：「不要靠近虛空祭壇——已有人在那裡等候。」

字跡和告示牌上「R」的字跡幾乎一模一樣。

羅薇娜早就進入遺跡了？還是說這張地圖是她留給某人的警告？你意識到這趟旅程遠比你想像的複雜。`,
choices: [
  { text: '帶著地圖，謹慎進入遺跡正門', next: 'ruins_approach' },
  { text: '回去和那個兜帽男人談談', next: 'tavern_hood' },
  { text: '直接找虛空祭壇，看看那個「等候者」是誰', next: 'ruins_approach' },
],
onEnter: (s) => { s.applyDelta({ xp: 15 }); s.setFlag('knows_rovena_inside'); }
```

### shop_enter
```
text: `鎮上唯一的雜貨店由一個駝背老人經營。

架子上擺著生命藥水（30金）、火把（5金）、解毒藥（20金），還有一件破舊的皮甲（45金）。角落裡有一本用鐵鍊鎖著的舊書，上面貼著「不賣」的標籤，但你的目光就是被它吸住了。

老人察覺到你的視線，嘆了口氣。`,
choices: [
  { text: '購買生命藥水（30金）', next: 'shop_buy_potion', effect: (s) => { s.applyDelta({ gold: -30 }); } },
  { text: '購買皮甲（45金）', next: 'shop_buy_armor', condition: (s) => s.player.gold >= 45, effect: (s) => { s.applyDelta({ gold: -45, def: 2 }); } },
  { text: '試著說服老人賣那本鎖著的書', next: 'shop_locked_book' },
  { text: '謝過老人，離開商店', next: 'ruins_approach' },
]
```

### shop_buy_potion
```
text: `老人慢條斯理地從架子上取下一瓶冒著淡藍色光芒的藥水。

「這是我老伴釀的最後一批，」他說，語氣帶著一絲惆悵，「她說這能讓喝下的人感受到命運的指引。我一直不信，但……買了也沒壞處。」

藥水沉甸甸的，握在手裡帶著微微的溫熱。`,
choices: [
  { text: '再看看其他物品', next: 'shop_enter' },
  { text: '試著說服老人賣那本書', next: 'shop_locked_book' },
  { text: '謝過老人，前往遺跡', next: 'ruins_approach' },
],
onEnter: (s) => { s.addItem('health_potion'); }
```

### shop_locked_book
```
text: `你提出了不少金幣，老人卻不為所動。

「不是錢的問題，」他搖頭，「典當那本書的旅人臨走前說，這本書不能賣給任何真正想要命運之書的人。他說，真正的尋書者不需要副本。」

他看著你的眼睛，像是在看穿你的靈魂。然後，他從抽屜裡取出一枚鑲著暗藍色寶石的戒指，放在你面前。

「但他留下了另一樣東西——說是給第一個問起這本書的人。」`,
choices: [
  { text: '接受戒指，前往遺跡', next: 'ruins_approach' },
  { text: '詢問那個旅人是誰', next: 'shop_ring' },
],
onEnter: (s) => { s.addItem('fate_ring'); s.applyDelta({ xp: 10 }); }
```

### shop_ring
```
text: `「我不知道他的名字，」老人回答，眼神飄向遠方，「只知道他來了又走，像一陣煙。他說他來自遺跡的深處，說他看見了命運之書，但沒有帶走它。」

老人的聲音輕了下來：「他說，有些東西看見了就夠了，不需要帶走。你明白這句話的意思嗎？」

你握著戒指，隱約感到它帶著某種古老的溫度。`,
choices: [
  { text: '謝過老人，前往遺跡', next: 'ruins_approach' },
],
onEnter: (s) => { s.applyDelta({ xp: 10 }); s.setFlag('knows_ring_lore'); }
```

### town_explore
```
text: `你在鎮子裡閒逛，意外聽到了幾段對話。

鐵匠對助手說：「別去鎮北，昨晚又有人聽見礦坑裡傳來吟誦聲。」

兩個孩子在牆角玩耍，其中一個說：「我爸說那個遺跡裡住著書的靈魂，它一直在等著某個特別的人。」另一個反駁：「才不是，是鬼。」

一個女人快步走過，低頭望著地面，嘴裡念念有詞，你隱約聽見：「……別來找我，別來找我……」

小鎮比外表看起來緊繃得多。`,
choices: [
  { text: '去酒館繼續打探消息', next: 'tavern_enter' },
  { text: '前往礦坑方向', next: 'mine_approach' },
  { text: '前往遺跡', next: 'ruins_approach' },
],
onEnter: (s) => { s.applyDelta({ xp: 8 }); }
```

---

## 第二章：廢棄礦坑

### mine_approach
```
text: `廢棄礦坑的入口在鎮北一片枯樹林後面，散發著潮濕的霉臭。

兩個守衛坐在火堆旁打盹，盔甲粗糙但厚實，腰間掛著短刀。礦坑入口上方刻著一個扭曲的臉孔圖案——那是無面者的標誌，和凱倫描述的一模一樣。

遠處傳來一聲低沉的鐘響，像是從地底深處傳來的。`,
choices: [
  { text: '偷偷溜過守衛，潛入礦坑', next: 'mine_sneak' },
  { text: '正面衝突，消滅守衛', next: 'mine_fight_guards' },
  { text: '扮作迷路的旅人靠近', next: 'mine_bluff_enter' },
],
onEnter: (s) => { s.applyDelta({ xp: 5 }); }
```

### mine_sneak
```
text: `你屏住呼吸，貼著礦坑石壁緩緩移動。

守衛的鼾聲在山谷中迴響，其中一人翻了個身，你僵在原地足足停了半分鐘。終於，你溜進了礦坑入口。

內部漆黑，火把照亮前方——牆壁上刻滿了扭曲的符文，地面上有幾個木箱，還有一道向下延伸的坡道。空氣中有股奇怪的香味，像燒焦的皮革。`,
choices: [
  { text: '開啟木箱，看看裡面有什麼', next: 'mine_b1_box' },
  { text: '沿著坡道深入', next: 'mine_b1_corridor' },
],
onEnter: (s) => { s.applyDelta({ xp: 8 }); s.setFlag('entered_mine'); }
```

### mine_fight_guards
```
text: `你拔出武器衝了上去。

第一個守衛來不及反應，被你一擊打倒。第二個站起來，揮刀猛砍——你側身躲過，還擊，對方踉蹌退後，跌倒在火堆旁，昏了過去。

你從他們身上搜出幾枚金幣、一塊乾糧，還有一個黑色徽章，背面刻著「第七煉爐」。`,
choices: [
  { text: '帶著戰利品深入礦坑', next: 'mine_b1_corridor' },
  { text: '先研究這個黑色徽章', next: 'mine_b1_badge' },
],
onEnter: (s) => { s.applyDelta({ hp: -12, xp: 20, gold: 15 }); s.addItem('faceless_badge'); s.setFlag('entered_mine'); }
```

### mine_bluff_enter
```
text: `你裝出一副迷路的樣子走向守衛，「對不起，請問去灰霧鎮怎麼走……」

話沒說完，其中一個守衛站起來，眼睛瞇成一條縫：「你不是鎮民。」

他抽刀。你也抽刀。短暫交鋒後，兩個守衛都倒下了。你的反應勝過了他們的力氣。

拍拍衣服上的灰，你走進了礦坑。`,
choices: [
  { text: '深入礦坑', next: 'mine_b1_corridor' },
],
onEnter: (s) => { s.applyDelta({ hp: -8, xp: 18, gold: 12 }); s.setFlag('entered_mine'); }
```

### mine_b1_corridor
```
text: `第一層走廊又長又黑，牆壁上的符文越往深處越密集，散發著幽綠的微光。

你發現地面上有腳印，不只一種——有人定期在這裡行走。走廊盡頭分成兩條路：左邊是儲藏室，右邊的坡道向下延伸，帶著隱隱的吟誦聲。`,
choices: [
  { text: '進入儲藏室，搜尋物資', next: 'mine_b1_box' },
  { text: '沿著吟誦聲向下走', next: 'mine_b2_enter' },
],
onEnter: (s) => { s.applyDelta({ xp: 5 }); }
```

### mine_b1_box
```
text: `木箱裡有一些零散的物資：一瓶生命藥水、幾根火把，以及一本破舊的記事本。

記事本的最後一頁寫著：「第三層的縫臉師已完成儀式，命運之書的位置已確認。等候上頭指令。祭品準備好了，就差最後一步。——G記」

你的心沉了一下。他們知道命運之書在哪裡，而且儀式已經完成了。`,
choices: [
  { text: '加快腳步，沿坡道向下', next: 'mine_b2_enter' },
],
onEnter: (s) => { s.addItem('health_potion'); s.applyDelta({ xp: 10 }); s.setFlag('found_ritual_note'); }
```

### mine_b1_badge
```
text: `黑色徽章上的符文隱隱發光，你越看越覺得頭暈。

突然，一道聲音在你耳邊響起——不是真實的聲音，而是直接在腦中迴響：「持有者，你已被標記。無面者的眼睛無處不在。」

你趕快把徽章裝進袋子，但那種被注視的感覺久久不散。你開始理解為什麼凱倫說這個組織危險。`,
choices: [
  { text: '強壓不安，深入礦坑', next: 'mine_b1_corridor' },
],
onEnter: (s) => { s.applyDelta({ xp: 8, hp: -5 }); s.setFlag('marked_by_faceless'); }
```

### mine_b2_enter
```
text: `第二層比第一層更冷，空氣中有股焦糊的氣味。

走廊更寬了，牆壁上除了符文，還有一幅幅怪異的壁畫——描繪著一個沉眠中的巨大存在，周圍有無數戴著面具的人膜拜著它。

遠處傳來整齊的吟誦聲，夾雜著偶爾的金屬碰撞聲。你靠近一個轉角，透過縫隙往裡看……`,
choices: [
  { text: '繼續靠近，偷看儀式進行', next: 'mine_b2_altar' },
  { text: '繞過這裡，直奔第三層', next: 'mine_b3_approach' },
],
onEnter: (s) => { s.applyDelta({ xp: 5 }); }
```

### mine_b2_altar
```
text: `你透過石縫看見了一個圓形的房間。

七個戴著無臉面具的人圍成一圈，中央燃著黑色的火焰。他們念著你聽不懂的古語，每念完一段，黑焰就跳動一下，像是有什麼東西在回應。

其中一個人突然回頭，彷彿感受到了你的存在。

你沒有時間猶豫。`,
choices: [
  { text: '衝入房間，打斷儀式', next: 'mine_b2_ambush' },
  { text: '迅速撤退，繞路繼續向下', next: 'mine_b3_approach' },
],
onEnter: (s) => { s.applyDelta({ xp: 10 }); s.setFlag('witnessed_ritual'); }
```

### mine_b2_ambush
```
text: `你衝入房間，七個人同時轉向你。

戰鬥激烈而混亂，黑焰在你們之間熄滅，取而代之的是鐵器撞擊的聲音。你一個打七個，以少敵多，雖然最終擊退了他們，但傷口不輕。

儀式被打斷了。房間裡除了七個倒地的身影，還有一個半完成的法陣，以及法陣中央被燃焦的一張羊皮紙。上面的字跡還能辨認。`,
choices: [
  { text: '撿起羊皮紙，閱讀殘留的文字', next: 'mine_b3_approach' },
],
onEnter: (s) => {
  s.applyDelta({ hp: -22, xp: 35, gold: 20 });
  s.setFlag('disrupted_ritual');
  s.addItem('ritual_scroll');
}
```

### mine_b3_approach
```
text: `第三層的入口是一扇沉重的石門，門上刻著一張縫合的臉——嘴角被縫成永恆的微笑。

推開石門，你看見一個空曠的大廳。大廳中央，一個身影背對著你，站在一個發著黯淡紫光的石台前，低頭不語。

你還沒有開口，他先說話了。`,
choices: [
  { text: '繼續走向他', next: 'seam_master_meet' },
],
onEnter: (s) => { s.applyDelta({ xp: 8 }); }
```

### seam_master_meet
```
text: `「我已在等你了。」

他緩緩轉身。臉上的縫合痕跡比你想像的更多——黑色的粗線從眼角延伸到下巴，嘴角被固定成一個詭異的微笑。但他的眼睛裡沒有瘋狂，只有一種難以言喻的疲憊。

「命運之書選擇了你，所以你來到了這裡。」他說，聲音平靜得像在陳述天氣，「但你能承受它的重量嗎？我見過太多人，以為自己準備好了，卻在最後一刻崩潰。」`,
choices: [
  { text: '直接攻擊，先發制人', next: 'seam_master_fight_a' },
  { text: '謹慎應對，先聽他說完', next: 'seam_master_talk' },
  { text: '仔細觀察他身上的封印符文', next: 'seam_master_analyze' },
],
onEnter: (s) => { s.applyDelta({ xp: 15 }); }
```

### seam_master_talk
```
text: `縫臉師放下法杖，神情出乎意料地平靜。

「無面者並非你想像中的惡徒，」他說，「我們只是想讓那個存在重獲自由。你知道命運之書為什麼被藏起來嗎？因為那些自稱『守護者』的人，害怕命運被改寫。」

「命運，」他指向你，「本該屬於選擇它的人，而不是那些強行守護它的人。」

他從頸間取下一枚令牌，放在地上。「拿去。進入遺跡，自己決定命運之書的歸屬。我等了太久了，已經累了。」`,
choices: [
  { text: '接受令牌，帶著疑問前往遺跡', next: 'mine_escape' },
  { text: '不信任他，攻擊他確保安全', next: 'seam_master_fight_a' },
],
onEnter: (s) => { s.addItem('guardian_token'); s.applyDelta({ xp: 25 }); s.setFlag('got_token_peacefully'); }
```

### seam_master_analyze
```
text: `你仔細觀察縫臉師，發現他左臂上有一個發光的符文，右肩有另一個，胸口還有第三個。

三個封印符文連成三角形，這應該就是讓他刀槍不入的關鍵。要傷害他，必須先破壞這三個符文。

問題是——如何在戰鬥中做到這件事？`,
choices: [
  { text: '用靈紋短刀攻擊封印符文（需要靈紋短刀）', next: 'seam_master_fight_s', condition: (s) => s.hasItem('spirit_dagger') },
  { text: '沒有靈紋短刀，硬拼一場', next: 'seam_master_fight_a' },
  { text: '先聽他說，探清底細', next: 'seam_master_talk' },
],
onEnter: (s) => { s.applyDelta({ xp: 10 }); s.setFlag('analyzed_seam_seals'); }
```

### seam_master_fight_s
```
text: `靈紋短刀在手，你冷靜地逼近縫臉師。

他揮出法杖，你閃開，趁著空隙刺向他左臂的符文——短刀接觸的瞬間，符文碎裂，發出一聲尖銳的嗚鳴。他痛苦地退後。

連續三次，三個符文依次破碎。縫臉師跌倒在地，那個「永恆的微笑」第一次出現了裂縫。

「你……找到了破解的方法，」他抬起頭，眼神裡竟有一絲釋然，「也許你真的是那個值得命運之書的人。」`,
choices: [
  { text: '取走守衛令牌，前往遺跡', next: 'mine_escape' },
],
onEnter: (s) => {
  s.applyDelta({ hp: -10, xp: 45, gold: 30 });
  s.addItem('guardian_token');
  s.setFlag('defeated_seam_master');
  s.setFlag('got_guardian_token');
}
```

### seam_master_fight_a
```
text: `你衝上前，對方舉起法杖，一道黑色能量擊中你的胸口。劇烈的疼痛讓你踉蹌退後。

他身上的符文發光，傷口在你眼前癒合——普通攻擊幾乎無效。你陷入苦戰，一次又一次地攻擊，一次又一次地被擊退。

在最後一刻，你注意到他心口的符文比其他兩個更亮——那是核心符文。你拼盡全力猛擊那個符文，咔嚓一聲，縫臉師轟然倒下。`,
choices: [
  { text: '取走守衛令牌，拖著傷體前往遺跡', next: 'mine_escape' },
],
onEnter: (s) => {
  s.applyDelta({ hp: -35, xp: 35, gold: 20 });
  s.addItem('guardian_token');
  s.setFlag('defeated_seam_master');
  s.setFlag('got_guardian_token');
}
```

### mine_escape
```
text: `帶著守衛令牌，你走出礦坑。

夜已深了，月亮爬上了山頭。你在礦坑外的冷風裡站了片刻，讓傷口的疼痛稍微沉澱。

遠處，遺跡的輪廓在月光下巨大而靜默。三百年了，命運之書在那裡等候，等著一個願意接受它的人。

不知為何，你感覺那個人也許就是你。`,
choices: [
  { text: '前往遺跡正門，找凱倫或羅薇娜', next: 'ruins_approach' },
],
onEnter: (s) => { s.applyDelta({ xp: 10 }); }
```

---

## 第三章：遺跡

### ruins_approach
```
text: `古老遺跡的外牆在月光下呈現一種奇異的白色，彷彿在發光。

石柱橫倒在入口前，上面刻著的文字已被風化得難以辨認。正門緊閉，門縫裡透出微弱的紫光。一個披著灰袍的身影站在門前，背對著你，似乎在研究門上的銘文。

遠處傳來低沉的吟誦聲——無面者已在其中。`,
choices: [
  { text: '開口詢問那個灰袍身影', next: 'ruins_meet_rovena' },
  { text: '持守衛令牌，直接通過正門', next: 'ruins_front_gate', condition: (s) => s.hasItem('guardian_token') },
  { text: '繞到側面找其他入口', next: 'ruins_side_door' },
],
onEnter: (s) => { s.applyDelta({ xp: 5 }); }
```

### ruins_meet_rovena
```
text: `灰袍女人轉過身來——她的年紀比你想像的更輕，眼睛裡帶著一種深邃的疲憊。

「你就是對命運之書感興趣的人，」她說，聲音冷靜，「我是羅薇娜。我研究這座遺跡已有五年，無面者比我早一步行動。如果他們在我找到三塊石版之前先完成儀式，後果難以估量。」

她取出一個古老的護身符遞給你。「這能保護你不受遺跡第一層陷阱的傷害。進去吧，我在外面接應。」`,
choices: [
  { text: '感謝羅薇娜，進入遺跡', next: 'ruins_f1_hall' },
  { text: '詢問她更多關於三塊石版的事', next: 'ruins_rovena_info' },
  { text: '詢問她老師的事', next: 'ruins_rovena_teacher' },
],
onEnter: (s) => { s.addItem('ruins_charm'); s.applyDelta({ xp: 15 }); s.setFlag('met_rovena'); }
```

### ruins_rovena_info
```
text: `羅薇娜細細說明：

「第一塊石版在火焰祭壇，守護者是古老的石像——哥德，純力量試煉。第二塊在水鏡祭壇，以謎語守護，考驗智慧。第三塊……」

她停頓了，視線落向地面，「虛空祭壇是最危險的。它考驗的不是力量或智慧，而是人性。你必須在欲望與犧牲之間做出選擇。」

她抬起頭，神情凝重：「有人在虛空祭壇永遠迷失了。包括我的老師。」`,
choices: [
  { text: '進入遺跡，前往三個祭壇', next: 'ruins_f1_hall' },
],
onEnter: (s) => { s.applyDelta({ xp: 12 }); s.setFlag('knows_altar_details'); }
```

### ruins_rovena_teacher
```
text: `羅薇娜沉默了很長時間。

「他叫塔納，是最偉大的遺跡學者，」她終於開口，「他在虛空祭壇待了三天三夜。出來的時候，他什麼都沒有說。一個月後，他就消失了，只留下一本筆記本，最後一頁只寫著四個字：命運難承。」

她的聲音很平靜，但你看見她的手微微顫著。

「我研究他留下的每一頁筆記，試圖理解虛空祭壇到底問了他什麼問題。到現在，我還沒找到答案。」`,
choices: [
  { text: '進入遺跡，找到那個答案', next: 'ruins_f1_hall' },
],
onEnter: (s) => { s.applyDelta({ xp: 15 }); s.setFlag('knows_teacher_fate'); }
```

### ruins_front_gate
```
text: `你舉起守衛令牌，靠近遺跡正門。

門上的符文發出一陣微光，然後沉寂了。一聲低沉的石頭滾動聲後，正門緩緩打開。

冷空氣從門縫裡湧出，夾帶著古老石頭的氣息，還有一股淡淡的焦糊味。前方是一條寬大的走廊，左右各有一根高大的石柱，上面的火把點著藍白色的火焰。`,
choices: [
  { text: '進入遺跡', next: 'ruins_f1_hall' },
],
onEnter: (s) => { s.applyDelta({ xp: 10 }); s.setFlag('entered_ruins_front'); }
```

### ruins_side_door
```
text: `側門是一扇鏽跡斑斑的鐵門，上面有個奇怪的鎖扣機關，由五個把手組成。

旁邊的石板上刻著提示，文字模糊，但還能辨認：「從火始，以水終，中有土木金。」

你思考著這個謎題——五行相生的順序。`,
choices: [
  { text: '按「火→土→木→金→水」順序撥動', next: 'ruins_side_open' },
  { text: '試著強行拉開', next: 'ruins_side_force' },
  { text: '放棄側門，去正門', next: 'ruins_approach' },
]
```

### ruins_side_open
```
text: `你按照五行相生的順序撥動把手——鎖扣機關發出一連串清脆的聲響，鐵門緩緩打開。

你成功進入遺跡，從一條側走廊進入主殿。頭上的穹頂高聳入雲，幾根粗大的石柱矗立在大廳中央，每根石柱上都刻著一個巨大的符文。

大廳的另一端，三條通道分別通向三個祭壇。`,
choices: [
  { text: '進入大廳，選擇第一個要挑戰的祭壇', next: 'ruins_f1_hall' },
],
onEnter: (s) => { s.applyDelta({ xp: 20 }); s.setFlag('entered_ruins_side'); }
```

### ruins_side_force
```
text: `你用力拉扯鐵門，觸發了某個機關——一根石矛從地面彈出，擦過你的手臂。

你忍著疼痛退後，門還是紋絲不動。`,
choices: [
  { text: '重新研究機關，用正確方式開門', next: 'ruins_side_open' },
  { text: '放棄側門，去正門', next: 'ruins_approach' },
],
onEnter: (s) => { s.applyDelta({ hp: -10, xp: 3 }); }
```

### ruins_mural
```
text: `走廊牆壁上的壁畫描述了一段古老的故事。

一個穿白袍的賢者書寫了命運之書，記錄了未來所有可能發生的命運。但他擔心這力量被濫用，臨終前將書分成三塊，交給三個守護者，並在遺跡中設置試煉。

最後一幅壁畫畫著三塊石版合而為一，中央放出耀眼的光，光裡站著一個模糊的人影——那是未來集齊石版的人嗎？

是你嗎？`,
choices: [
  { text: '帶著這段歷史，繼續深入遺跡', next: 'ruins_f1_hall' },
],
onEnter: (s) => { s.applyDelta({ xp: 15 }); s.setFlag('saw_mural'); }
```

### ruins_f1_hall
```
text: `遺跡的主殿是一個巨大的圓形大廳。

地面上有複雜的石板圖案，某些石板已被觸發的陷阱翻起，可以看見底下的暗箭機關。三個拱形出口各自標記著不同的符文：左邊是跳動的火焰，中間是流動的水波，右邊是一片虛無的黑暗。

一個石台立在大廳中央，台上的銘文用古語寫著：「三個祭壇，每個只能進入一次。集齊三塊石版，命運之書方能復原。」`,
choices: [
  { text: '前往火焰祭壇（力量試煉）', next: 'fire_corridor', condition: (s) => !s.hasFlag('completed_fire_altar') },
  { text: '前往水鏡祭壇（智慧試煉）', next: 'water_corridor', condition: (s) => !s.hasFlag('completed_water_altar') },
  { text: '前往虛空祭壇（人性試煉）', next: 'void_bridge', condition: (s) => !s.hasFlag('completed_void_altar') },
  { text: '三塊石版都到手了，前往命運核心', next: 'core_descent', condition: (s) => s.hasItem('fire_slab') && s.hasItem('water_slab') && s.hasItem('void_slab') },
]
```

---

## 第四章：三個祭壇

### fire_corridor
```
text: `火焰祭壇的通道越走越熱，牆壁上的火把從橙黃色變成了刺眼的白色。地面偶爾有熱氣從縫隙中噴出，你必須小心踩踏。

牆壁上刻著一排排古語，你認出其中幾個字：「力量才是通往真相的鑰匙。弱者無資格持有命運。」

這讓你有些不舒服。但你繼續前進。`,
choices: [
  { text: '進入火焰祭壇大廳', next: 'fire_hall_enter' },
]
```

### fire_hall_enter
```
text: `大廳高如天穹，火把密布四壁，橙紅色的光影在石柱間搖曳。

祭壇在大廳最深處，石版就放在台上，清晰可見。但大廳中央，一個巨大的石像緩緩轉動——它足有三層樓高，手持兩根石矛，眼睛裡嵌著紅寶石，像兩顆燃燒的炭火。

「入侵者，」石像的聲音像石磨碾過鐵片，「要取得火焰石版，你必須在此擊敗我。沒有捷徑，沒有謀略——只有力量。」`,
choices: [
  { text: '迎戰石像', next: 'fire_golem_fight' },
  { text: '觀察大廳，尋找弱點', next: 'fire_golem_analyze' },
  { text: '試圖繞過石像直接取石版', next: 'fire_golem_grab' },
]
```

### fire_golem_analyze
```
text: `你仔細觀察大廳。

火把排列有特定的規律，而石像每次揮矛，都會先看向最近的火焰——它靠感應熱源來追蹤目標。

牆壁上有幾個可以拉動的機關，連接著不同的火把。如果你能關掉所有的火把，石像也許就無法追蹤你的位置……

但這需要在石像的攻擊範圍內快速移動。`,
choices: [
  { text: '快速關閉所有火把', next: 'fire_golem_smart' },
  { text: '算了，正面打過去', next: 'fire_golem_fight' },
],
onEnter: (s) => { s.applyDelta({ xp: 10 }); s.setFlag('torches_analyzed'); }
```

### fire_golem_smart
```
text: `你快速衝向第一個機關，石像的矛砸在你身後，你在最後一瞬間拉動機關，第一排火把熄滅。

又是一次閃避，第二個機關。石像的動作慢了一拍，彷彿真的受到了影響。

最後一個機關，大廳陷入黑暗。石像停止了移動，發出困惑的轟鳴——「……目標……消失……」

你趁機衝到祭壇，雙手握住石版。`,
choices: [
  { text: '帶著石版離開', next: 'fire_slab_obtain' },
],
onEnter: (s) => { s.applyDelta({ hp: -8, xp: 40 }); s.setFlag('torches_off'); }
```

### fire_golem_fight
```
text: `石像的每一擊都帶著地震般的力道，你閃避，還擊，消耗，尋找縫隙。

石像雖然強大，但移動緩慢，你利用這一點不斷製造距離，用技能和武器持續造成傷害。

漫長的消耗戰後，石像胸口的核心發出裂縫，「轟」的一聲坍塌成一堆碎石。

你精疲力盡地站在廢墟中，石版靜靜躺在祭壇上。`,
choices: [
  { text: '取走石版', next: 'fire_slab_obtain' },
],
onEnter: (s) => {
  if (s.hasItem('ruins_charm')) {
    s.applyDelta({ hp: -20, xp: 45 });
  } else {
    s.applyDelta({ hp: -35, xp: 45 });
  }
}
```

### fire_golem_grab
```
text: `你試圖繞過石像，直奔祭壇——石像瞬間轉身，一矛掃來。

你被擊飛，重重砸在牆上，火把散落一地。你掙扎著爬起來，渾身是傷。

繞過石像的方法行不通。`,
choices: [
  { text: '找石像的弱點', next: 'fire_golem_analyze' },
  { text: '硬碰硬，正面迎戰', next: 'fire_golem_fight' },
],
onEnter: (s) => { s.applyDelta({ hp: -20, xp: 5 }); }
```

### fire_slab_obtain
```
text: `石版沉甸甸的，帶著一種奇異的溫熱。

你雙手捧著它，突然感到一陣眩暈——無數的畫面在腦海中閃過，不是你的記憶，而是這塊石版記錄的過去：千百個人的命運，千百段已經結束的故事，在一瞬間湧入你的意識。

然後，一切歸於平靜。你手中只有一塊石版，但你感覺自己彷彿又老了幾歲。`,
choices: [
  { text: '回到主殿，前往下一個祭壇', next: 'ruins_f1_hall' },
],
onEnter: (s) => { s.addItem('fire_slab'); s.applyDelta({ xp: 50 }); s.setFlag('completed_fire_altar'); }
```

### water_corridor
```
text: `水鏡祭壇的通道潮濕，牆壁上覆蓋著翠綠的苔蘚，地面有一層薄薄的積水，映出你的倒影。

倒影中的你和真實的你幾乎一樣，但隱約有些不同——也許是光線的緣故，也許不是。

水聲在走廊裡迴響，像是有人在低聲說話。`,
choices: [
  { text: '進入水鏡祭壇大廳', next: 'water_hall_enter' },
]
```

### water_hall_enter
```
text: `大廳中央是一面巨大的鏡子，高達天花板，鏡面如水波般流動，看不見另一端。

你走近，鏡中出現了你的倒影——但倒影沒有跟著你移動，它只是靜靜地看著你。

一個聲音從鏡中傳出，無性別，無年齡，像風一樣無形：

「我回答謎語才能取得石版。謎語只有一個。請聽好：」`,
choices: [
  { text: '仔細聆聽謎語', next: 'water_riddle_q' },
]
```

### water_riddle_q
```
text: `「我沒有腳，卻能走遍天下。
我沒有嘴，卻能訴說千言。
有人把我藏起，有人找尋我。
我是什麼？」

鏡中的倒影看著你，等待你的回答。大廳裡的水聲停止了，只剩下你的心跳。`,
choices: [
  { text: '「秘密」', next: 'water_riddle_a1' },
  { text: '「命運」', next: 'water_riddle_a2' },
  { text: '「時間」', next: 'water_riddle_a3' },
]
```

### water_riddle_a1
```
text: `「秘密——」

水鏡一陣震動，一道水柱猛地朝你噴來。你被擊退數步，全身濕透，胸口一陣疼痛。

「錯誤，」聲音說，語氣沒有責備，只有陳述，「再想想。」

你站起來，重新面對鏡子。`,
choices: [
  { text: '回答「命運」', next: 'water_riddle_a2' },
  { text: '回答「時間」', next: 'water_riddle_a3' },
],
onEnter: (s) => { s.applyDelta({ hp: -10, xp: 3 }); }
```

### water_riddle_a3
```
text: `「時間——」

水鏡再度震動，你再度被擊中，這次更重。

「再想想，」聲音帶著一絲耐心，「答案就在這個遺跡的名字裡，就在你尋找的東西裡。」

你若有所思地盯著鏡中的自己。`,
choices: [
  { text: '回答「命運」', next: 'water_riddle_a2' },
],
onEnter: (s) => { s.applyDelta({ hp: -10, xp: 3 }); }
```

### water_riddle_a2
```
text: `「命運——」

你說出這個答案的瞬間，水鏡發出耀眼的白光。

「正確，」鏡中的聲音充滿了敬意，「你理解了這個地方的本質。命運沒有形體，卻無處不在；它無聲無息，卻記錄著一切；它被人畏懼隱藏，也被人拼命追尋。」

水鏡靜止下來，成為一面真正的鏡子。石版從水面中緩緩浮起，落入你手中，溫潤而沉重。`,
choices: [
  { text: '帶著石版，回到主殿', next: 'ruins_f1_hall' },
],
onEnter: (s) => { s.addItem('water_slab'); s.applyDelta({ xp: 50 }); s.setFlag('completed_water_altar'); }
```

### void_bridge
```
text: `虛空祭壇的通道兩側沒有牆壁——只有一片徹底的黑暗，深不見底。一條窄窄的石橋向前延伸，踩上去發出空洞的回響。

你不敢向兩側看太久。那黑暗不像是普通的黑暗，它像是在看著你。

橋的盡頭，微弱的白光在搖曳。`,
choices: [
  { text: '謹慎前行，走向白光', next: 'void_hall_enter' },
],
onEnter: (s) => { s.applyDelta({ xp: 8 }); }
```

### void_hall_enter
```
text: `大廳的中央飄浮著一個發光的球體，溫暖而安靜。

旁邊站著一個穿白袍的老人，背對著你，像是在沉思。他聽見你的腳步，緩緩轉過身——那張臉出奇地平靜，眼睛裡有一種你見過的最複雜的情緒。

「我在等你，」他說，聲音像從極遠的地方傳來，「等了三百年了。每個走到這裡的人，我都以為是那個人。但都不是。」

他直視著你。「你是嗎？」`,
choices: [
  { text: '問他在等什麼樣的人', next: 'void_spirit_talk' },
  { text: '說：「我不知道，但我來了」', next: 'void_spirit_talk' },
]
```

### void_spirit_talk
```
text: `書靈向你伸出手，那隻手透明而蒼老。

「每個走到這裡的人，都帶著自己的欲望，」它說，「力量、知識、復仇、愛——我見過太多了。他們都以為自己的欲望是高尚的。也許有些真的是。」

「但我只問你一個問題。」它的眼睛直視著你，彷彿看穿了你來此之前的每一個念頭。

「你拿到命運之書之後，想做什麼？」

大廳的虛空在你身周默默擴張，時間像是靜止了。`,
choices: [
  { text: '「我想改寫自己的命運」', next: 'void_q_self' },
  { text: '「我想阻止無面者得到它」', next: 'void_q_protect' },
  { text: '「我想將它封印，讓無人能使用」', next: 'void_q_seal' },
]
```

### void_q_self
```
text: `書靈沉默了片刻。

「誠實，」它說，「這是這個祭壇聽過最誠實的回答之一。欲望本身並無善惡，問題在於你願意為此付出什麼代價。」

「但命運之書記錄的，是所有人的命運，而非一個人的。若你只改寫自己，這本書的力量便被浪費了一大半。」

書靈向你伸出手。「我不評判。但你必須承諾，在看見命運之書的那一刻，你會再次思考這個問題。」`,
choices: [
  { text: '承諾，接過石版', next: 'void_slab_obtain' },
],
onEnter: (s) => { s.applyDelta({ xp: 25 }); }
```

### void_q_protect
```
text: `「阻止邪惡，」書靈點頭，「這個答案讓許多人脫口而出。但我要問你一件事：」

「如果阻止無面者需要你犧牲自己——你願意嗎？」

這個問題落在沉默的虛空中，像一塊石頭砸進深水。`,
choices: [
  { text: '「願意」', next: 'void_sacrifice_yes' },
  { text: '「我不知道」', next: 'void_sacrifice_unsure' },
  { text: '「不願意，但我會盡力」', next: 'void_sacrifice_honest' },
],
onEnter: (s) => { s.applyDelta({ xp: 15 }); }
```

### void_sacrifice_yes
```
text: `書靈仔細打量你，然後緩緩點頭。

「說出這句話很容易。真正做到，需要在那個時刻來臨時才能證明。」

它的眼中閃過一絲複雜的情緒——不完全是讚許，更像是憐憫。

「但你的眼睛沒有說謊。」它將石版放入你手中，「去吧。願命運站在你這一邊。」`,
choices: [
  { text: '帶著石版，準備完成使命', next: 'void_slab_obtain' },
],
onEnter: (s) => { s.applyDelta({ xp: 35 }); }
```

### void_sacrifice_unsure
```
text: `書靈露出了一個淡淡的笑容，三百年來大概第一次。

「不知道，是最誠實的答案，」它說，「只有不了解恐懼的人才會在未曾面對的時候說『我願意』。你的不確定，反而代表你真正理解了犧牲的重量。」

「這樣的人，才值得持有命運之書。」

石版輕輕落入你的手中，帶著一種難以言說的溫度。`,
choices: [
  { text: '謝過書靈，前往完成使命', next: 'void_slab_obtain' },
],
onEnter: (s) => { s.applyDelta({ xp: 45 }); }
```

### void_sacrifice_honest
```
text: `書靈沉默了很長時間。

「盡力……」它輕聲重複這個詞，像是在品味。

「在所有我聽過的答案中，這個讓我最放心。不逞強，不退縮，只是盡力。命運之書的力量，配得上這樣的人。」

石版帶著溫熱落入你手中，書靈的白光稍微亮了一些。`,
choices: [
  { text: '帶著石版，完成使命', next: 'void_slab_obtain' },
],
onEnter: (s) => { s.applyDelta({ xp: 45 }); }
```

### void_q_seal
```
text: `書靈沉默良久，那道白光停止了搖曳。

「封印它，」它輕聲說，「這個答案……我已等候它三百年了。」

它站起身，白袍在虛空中飄動，神情帶著一種難以言說的釋然——像是一個守了三百年門的老人，終於聽見了敲門聲。

「三百年前，那個書寫命運之書的賢者——他在臨終時說，他希望有一天，有人選擇讓這本書安靜長眠。你是第一個說出這句話的人。」

三塊石版同時從虛空中浮現，落在你面前。`,
choices: [
  { text: '接受三塊石版，走向命運', next: 'core_descent' },
],
onEnter: (s) => {
  s.addItem('fire_slab');
  s.addItem('water_slab');
  s.addItem('void_slab');
  s.applyDelta({ xp: 80 });
  s.setFlag('chose_to_seal');
  s.setFlag('completed_fire_altar');
  s.setFlag('completed_water_altar');
  s.setFlag('completed_void_altar');
}
```

### void_slab_obtain
```
text: `虛空石版比你想像的更輕，幾乎沒有重量，彷彿隨時會消失。

你握著它，感受到一種奇異的眩暈——不是痛苦，而是一種龐大的預感。你看見了無數可能的未來，在你眼前像蝴蝶翅膀一樣展開，又迅速合攏。

你無法看清任何一個，只能感受到它們的存在。

「你現在手上，」書靈的聲音從身後傳來，「有著這個世界過去、現在、未來的一部分。好好珍重。」`,
choices: [
  { text: '回到主殿，前往命運核心', next: 'ruins_f1_hall' },
],
onEnter: (s) => { s.addItem('void_slab'); s.applyDelta({ xp: 50 }); s.setFlag('completed_void_altar'); }
```

---

## 第七章：命運核心

### core_descent
```
text: `三塊石版在你懷裡輕輕顫動，彷彿感受到了彼此的存在。

主殿中央，你一直沒有注意到的一件事——地面上有一個螺旋向下的石梯，入口就在石台正下方。

石梯周圍的空氣在震動，像是有什麼巨大的力量正在甦醒。每走一步，那種感覺就更強烈一分。`,
choices: [
  { text: '走下石梯，前往命運核心', next: 'core_atmosphere' },
]
```

### core_atmosphere
```
text: `命運核心是一個完美的球形空間，比你見過的任何建築都高大。

牆壁是透明的，透過它們，你能看見無數閃爍的光點——不是星星，而是命運的碎片，每一個光點都是一個人的一生。

中央懸浮著一個巨大的空白——那就是命運之書原本所在的位置。三塊石版在你手中劇烈震動，迫不及待地想要回到那個位置。

然後，你聽見了腳步聲。`,
choices: [
  { text: '轉身面對來者', next: 'core_faceless_crash' },
]
```

### core_faceless_crash
```
text: `無面者的首領帶著最後五個成員出現在石梯入口。

他的面具與眾不同——不是白色，而是金色，刻著精細的符文。他指著你懷裡的石版：

「把石版給我。現在。我不想傷人。」

他的聲音異常平靜，但你看見他身後的人已經拔出了武器。

「我們差一點就能讓它甦醒了。差你，最後一步。」`,
choices: [
  { text: '戰鬥，絕不交出石版', next: 'core_boss_fight' },
  { text: '假裝要給他，趁機把三塊石版合在一起', next: 'core_slabs_unite' },
],
onEnter: (s) => { s.applyDelta({ xp: 10 }); }
```

### core_boss_fight
```
text: `金面具首領是你遇過的最強敵人。

他不只有力量——他的動作像是能預知你的下一步，像是他讀過你的命運。也許他真的讀過。

但你手中有三塊石版，而命運核心的力量在你踏入的那一刻就開始流向你。你感到自己比平常更清晰，更精準。

最終，金面具首領倒下了。他摘下面具，露出一張平凡的臉，喃喃說：「我等了一輩子……」`,
choices: [
  { text: '走向命運之書的位置', next: 'core_slabs_unite' },
],
onEnter: (s) => { s.applyDelta({ hp: -30, xp: 80, gold: 50 }); s.setFlag('defeated_faceless_lord'); }
```

### core_slabs_unite
```
text: `三塊石版離開你的手，在空中緩緩上升。

它們開始旋轉，越來越快，越來越亮，彼此靠近——然後，在一聲沉悶的轟響中，合而為一。

光芒讓整個命運核心都白了。等光線稍稍褪去，你看見懸浮在空中的，是一本書。

不是石版了，而是真正的書——薄薄的，樸素的，封面上沒有文字。但你能感受到，整個世界的重量都在那裡。

一個聲音從書中傳出，比書靈更古老，更深遠：「命運之書，重新完整。持有者，你將如何使用它？」`,
choices: [
  { text: '打開書，查看自己的命運', next: 'core_choice_rewrite' },
  { text: '用它的力量封印無面者', next: 'core_choice_seal' },
  { text: '將書交給羅薇娜', next: 'core_choice_give' },
  { text: '讓書回歸虛空，長眠永遠', next: 'ending_truth' },
  { text: '（隱藏）你在虛空祭壇選擇了封印', next: 'ending_sealed_secret', condition: (s) => s.hasFlag('chose_to_seal') },
]
```

### core_choice_rewrite
```
text: `你打開命運之書，在那無盡的光芒中看見了自己的命運。

看見了所有的過去，所有的選擇，所有可能的未來——它們像河流一樣分叉，每一個分叉又再分叉，無窮無盡。

你找到了屬於你的那一頁，伸手，試圖改寫其中一行——

但在那一瞬間，你看見了其他人的命運，與你的命運交織在一起。你的每一個選擇，都連著數十個其他人的命運。改寫自己的一頁，意味著撕碎別人的許多頁。

你的手，慢慢地，停在了半空中。`,
choices: [
  { text: '依然決定改寫命運', next: 'ending_self' },
  { text: '改變心意，讓書回歸虛空', next: 'ending_truth' },
]
```

### core_choice_seal
```
text: `你將命運之書的力量化為一道封印，鎖向無面者的根源。

每一個無面者成員都感到胸口一緊，那個被他們崇拜的古老存在發出憤怒的嘶鳴，然後——沉默。

封印完成。你手中的書在發出最後一道光後，消失了。`,
choices: [
  { text: '走出遺跡', next: 'ending_guardian' },
]
```

### core_choice_give
```
text: `你捧著命運之書，轉身走上石梯。

羅薇娜在遺跡外等候，見你捧著那本書走出來，她整個人都僵在了原地。

「你……確定嗎？」她問，聲音顫抖。

「比任何人都確定，」你說，「你研究它五年了，你比我更清楚它應該怎麼對待。」`,
choices: [
  { text: '將命運之書交給羅薇娜', next: 'ending_trust' },
]
```

---

## 六大結局

### ending_truth
```
text: `你將雙手放在命運之書上，閉上眼睛。

光芒從你的指尖漫延，穿過石版，穿過遺跡的每一塊石頭，向外蔓延——無面者的符文一個個熄滅，縫臉師的法術煙消雲散，所有試圖奪取命運之書的人都被一道無形的力量推開。

然後，命運之書化為一道白光，消散在空氣中。

遺跡的牆壁發出輕輕的嘆息，彷彿三百年的重擔終於卸下。書靈現身於你面前，深深鞠躬：

「謝謝你，旅人。命運之書不再屬於任何人——但它的智慧，已永遠刻在這個世界的每一個角落。」`,
isEnding: true, endType: 'victory',
endTitle: '✦ 真實結局 ✦',
endMsg: '你選擇了最難的一條路——放下擁有的欲望，讓命運回歸本源。這樣的人，才真正配得上命運的恩賜。'
```

### ending_self
```
text: `你改寫了命運之書中屬於你的那一頁。

光芒消退，命運之書合上，緩緩消失在空氣中。你走出遺跡，發現世界並沒有什麼不同——陽光依舊，風依舊，灰霧鎮的炊煙依舊升起。

但你知道，在某個你看不見的地方，命運已悄悄改變了走向。

你不知道這是好是壞，那些被你改變的其他命運，會走向哪裡。

也許只有時間知道。`,
isEnding: true, endType: 'victory',
endTitle: '⚔ 自我的命運 ⚔',
endMsg: '你改寫了自己的命運。代價是什麼，也許只有未來才能告訴你。一個自私但真實的結局。'
```

### ending_guardian
```
text: `無面者失去了信仰，一個個倒下，或逃散，或放下武器。那個被封印三百年的古老存在，又沉入了無法被任何人觸及的深眠。

凱倫和羅薇娜站在遺跡外，看著你走出來——手持空空如也，命運之書在完成封印後消散了。

「值得嗎？」羅薇娜問。

你看了看手心，然後看了看灰霧鎮的燈火，沒有立刻回答。

某些問題不需要當下回答。`,
isEnding: true, endType: 'victory',
endTitle: '🛡 守護者之路 🛡',
endMsg: '你用命運之書換來了和平。書已消失，但世界因你而改變。英雄的代價，是永遠放下那個最強大的力量。'
```

### ending_trust
```
text: `羅薇娜深吸一口氣，將命運之書緊緊抱在胸前。

「我會守護它，」她說，「我發誓。用我老師失去的所有，用我這五年走過的每一步，我發誓。」

夜空下，灰霧鎮的燈火一盞盞亮起。凱倫在遠處向你點頭，然後轉身離開，消失在黑暗中——他的復仇已不再重要了。

你的冒險，以一個出乎意料的方式畫下句點。不是勝利，也不是失敗，而是一份信任。`,
isEnding: true, endType: 'victory',
endTitle: '📖 信任的選擇 📖',
endMsg: '你選擇相信別人，而非獨自承擔命運的重量。這份信任，本身就是一種勇氣。'
```

### ending_sealed_secret
```
text: `書靈在命運核心等著你。

「你來了，」它說，「我知道你會來。從你在虛空祭壇說出那句話的時候，我就知道了。」

你把三塊石版放在它面前，什麼都沒說。

書靈雙手合攏，三塊石版化為白光，融入命運核心的牆壁——不是消失，而是回歸。回到它們本來就屬於的地方。

「三百年，」書靈閉上眼睛，「終於可以休息了。」

遺跡開始緩緩崩塌，從最深處開始，一層一層，但沒有聲音，只有光。你走出遺跡的時候，它已經變成了一片平地。

只剩下一朵從地面裂縫中長出的小花。`,
isEnding: true, endType: 'secret',
endTitle: '🌑 三百年的答案 🌑',
endMsg: '你是三百年來第一個說出正確答案的人。書靈等的不是英雄，而是一個願意放下的人。這是真正的隱藏結局。'
```

### ending_death
```
text: `你的視野開始模糊。

倒下的那一刻，遺跡的石頭地板冰冷而堅硬。你的手指還緊握著武器，但已經沒有力氣了。

命運之書繼續沉眠，等待著下一個人。

也許下一個人，會比你更幸運，或更勇敢，或只是更謹慎。

也許命運本來就屬於那個人，而不是你。`,
isEnding: true, endType: 'dead',
endTitle: '💀 倒下了',
endMsg: '你的生命在古老的遺跡中耗盡。命運之書繼續等待。讀取存檔，重新嘗試。'
```
