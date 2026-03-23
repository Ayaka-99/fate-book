/**
 * story.js
 * 劇情節點資料：所有分支劇情的完整定義
 * 格式說明見 CLAUDE.md 的「核心資料結構」章節
 */

const STORY = {

  // ═══════════════════════════════════════════════════════════════
  // 第一章：灰霧鎮
  // ═══════════════════════════════════════════════════════════════

  start: {
    text: `灰霧鎮。

你拖著疲憊的步伐抵達這座被薄霧籠罩的邊陲小鎮。石板路上積著前夜的雨水，木造建築的招牌在晨風中嘎吱作響。

鎮口的告示牌聚著幾名居民，竊竊私語。遠處，酒館傳來低沉的人聲。

你是來尋找什麼的？記憶中有個模糊的名字——羅薇娜。還有，那本據說能改寫命運的書。`,
    choices: [
      { text: '走向告示牌查看佈告', next: 'notice_board' },
      { text: '先進酒館打聽情報', next: 'tavern_enter' },
      { text: '找間雜貨店補充物資', next: 'shop_enter' },
    ],
  },

  notice_board: {
    text: `告示牌前站著三、四名居民，你擠過去，看見上面貼著三張佈告：

一張是懸賞通緝：「灰狼幫首領，賞金 200 金幣，生死不論。」
一張是禁令公告：「前往北方遺跡者，格殺勿論。落款：鎮長辦公室。」
一張是手寫紙條，字跡凌亂：「R——我已進入礦坑，等你。勿輕舉妄動。」

最後那張紙條讓你心頭一緊。R，是羅薇娜？`,
    choices: [
      { text: '細看懸賞告示', next: 'notice_reward' },
      { text: '研究遺跡禁令細節', next: 'notice_ruins_ban' },
      { text: '取下那張手寫紙條', next: 'notice_r_message' },
    ],
  },

  notice_reward: {
    text: `懸賞通緝貼著一幅粗糙的人像畫：一個蒙面男人，左耳戴著黑色耳環。

旁邊的居民低聲說：「灰狼幫最近跟礦坑那邊有勾結，帶走了好幾個礦工……上頭說是自願的，但誰信啊？」

你將這條線索記在心裡。`,
    choices: [
      { text: '回到告示牌前', next: 'notice_board' },
      { text: '去酒館打聽灰狼幫', next: 'tavern_enter' },
    ],
  },

  notice_ruins_ban: {
    text: `禁令公告的落款是「鎮長辦公室，三個月前」。

旁邊的文字解釋原因：「遺跡內部發生連續失蹤事件，五名探險者入內後未回，第六名倖存者精神崩潰，口中不斷重複『它在寫、它在寫』。」

禁令背後，顯然有更多不能說的事。`,
    choices: [
      { text: '回到告示牌前', next: 'notice_board' },
      { text: '去酒館找人打聽遺跡', next: 'tavern_enter' },
    ],
  },

  notice_r_message: {
    text: `你將那張手寫紙條收入懷中。

「等你。勿輕舉妄動。」——這是羅薇娜的字跡嗎？你印象中她的字更工整，但在匆忙中也許……

落款時間是四天前。礦坑。你的目標變得清晰了。`,
    onEnter: (state) => { state.setFlag('found_r_note'); },
    choices: [
      { text: '前往酒館繼續打聽', next: 'tavern_enter' },
      { text: '直接前往礦坑', next: 'mine_approach' },
    ],
  },

  tavern_enter: {
    text: `「破盾酒館」——招牌上掛著一面真正破掉的木盾，幽默又滄桑。

推門進去，煙草與麥酒的氣味撲鼻而來。幾名礦工模樣的男子圍坐喝酒，角落裡有個戴著風帽的人靠著牆獨坐。

老闆是個禿頭壯漢，正在擦拭酒杯。`,
    choices: [
      { text: '找老闆打聽情報', next: 'tavern_bartender' },
      { text: '靠近角落的神秘人', next: 'tavern_hood' },
      { text: '趁醉漢不注意，偷看他攤開的地圖', next: 'tavern_steal_map' },
    ],
  },

  tavern_bartender: {
    text: `老闆瞇起眼打量你，然後放下酒杯。

「礦坑？」他搖搖頭，「三週前開始有人半夜進進出出。不是礦工——礦工我都認識。穿著黑衣，臉上蒙著布。帶著燈籠，往礦坑方向去。」

他壓低聲音：「我問過鎮長，他說『沒這回事』。你懂的。」

一旁的礦工插嘴：「昨天礦坑傳出怪聲，像是有人在吟誦什麼……」`,
    choices: [
      { text: '詢問那位神秘人是誰', next: 'tavern_hood' },
      { text: '打聽羅薇娜的下落', next: 'tavern_r_note' },
      { text: '謝過老闆，離開酒館', next: 'start' },
    ],
  },

  tavern_hood: {
    text: `你走近那個戴風帽的人。

對方沒有抬頭，只是輕描淡寫地說：「我知道你在找什麼。坐下。」

你坐下後，她緩緩拉下風帽——是個年輕女性，灰色眼睛帶著疲憊，卻透著精明。

「我叫凱倫。我是……你應該說是獨立工作者。我們有共同的目標。」`,
    choices: [
      { text: '「你怎麼知道我在找什麼？」', next: 'tavern_hood_deal' },
      { text: '「無面者組織是什麼？」', next: 'tavern_hood_org' },
    ],
  },

  tavern_hood_deal: {
    text: `凱倫微微一笑：「因為你看了那張紙條。R 留的那張。」

她把一個小布包推過來：「裡面是礦坑第二層的入口記號——蠟筆畫的，不起眼，但你找不到會在裡面迷路三天。」

「條件是：如果你找到令牌，給我看一眼原件。就這樣。我不留著它。」

她的眼神坦然，沒有欺騙的跡象。`,
    onEnter: (state) => { state.setFlag('met_kallen'); },
    choices: [
      { text: '接受交易', next: 'tavern_hood_org', effect: (state) => { state.setFlag('kallen_deal'); } },
      { text: '拒絕，自己想辦法', next: 'tavern_bartender' },
    ],
  },

  tavern_hood_org: {
    text: `「無面者，」凱倫說，「不是一個人——是一種存在。或者說，一種信仰。」

「他們相信命運是可以被『編寫』的。那本書——命運之書——據說就是工具。三百年前有人用它改寫了整個王朝的歷史，然後把它藏進遺跡。」

「縫臉師是他們的儀式執行者，專門負責在礦坑進行某種準備儀式。準備什麼？」她頓了頓，「為命運之書的復甦做準備。」`,
    choices: [
      { text: '前往礦坑', next: 'mine_approach' },
      { text: '先去雜貨店備齊道具', next: 'shop_enter' },
    ],
  },

  tavern_steal_map: {
    text: `那個醉漢把一張舊地圖攤在桌上，頭已經歪著快睡著了。

你悄悄靠近，快手抽出地圖塞進袖口。

回到角落仔細看：是礦坑的局部平面圖，幾個通道用紅筆標記，其中一條畫著問號，旁邊寫著「二層，祭壇？」`,
    onEnter: (state) => { state.addItem('torn_map'); },
    choices: [
      { text: '繼續打聽，找老闆問問', next: 'tavern_bartender' },
      { text: '帶著地圖直接去礦坑', next: 'mine_approach' },
    ],
  },

  tavern_map_study: {
    text: `你在燭光下仔細研究那張地圖。

礦坑有三層：第一層是主礦道，第二層有個標記著「祭壇」的房間，第三層入口被標注了骷髏警告。

地圖的角落有一行小字：「持黑色徽章者可通過封印門。」`,
    choices: [
      { text: '去礦坑', next: 'mine_approach' },
    ],
  },

  tavern_r_note: {
    text: `老闆想了想：「羅薇娜……高個子的女人？穿著旅行服？」

「她四天前來過。點了一杯茶，在那個角落坐了一個小時，寫了什麼東西，然後離開了。」他搖搖頭，「沒再見到她。」

你心裡有些不安。四天了。`,
    choices: [
      { text: '謝謝老闆，去礦坑找羅薇娜', next: 'mine_approach' },
      { text: '先去準備一下', next: 'shop_enter' },
    ],
  },

  shop_enter: {
    text: `「舊物雜貨」的木門推開時會發出鈴聲。老人從帳布後探出頭，戴著厚厚的眼鏡。

「唷，旅人。」他揮手示意你進來，「藥水還有幾瓶，甲冑就那一件……還有一本鎖著的書，但那個不賣。」

他特別強調「不賣」，目光卻不自然地飄向書架角落。`,
    choices: [
      { text: '購買生命藥水（30 金幣）', next: 'shop_buy_potion', condition: (state) => state.player.gold >= 30 },
      { text: '購買皮甲（45 金幣）', next: 'shop_buy_armor', condition: (state) => state.player.gold >= 45 },
      { text: '詢問那本鎖著的書', next: 'shop_locked_book' },
      { text: '離開雜貨店', next: 'start' },
    ],
  },

  shop_buy_potion: {
    text: `老人從架子上取下一個藍色小瓶，瓶塞用蠟封住。

「這個，能救命。」他遞給你，收下三十枚金幣。`,
    onEnter: (state) => {
      state.applyDelta({ gold: -30 });
      state.addItem('health_potion');
    },
    choices: [
      { text: '繼續購物', next: 'shop_enter' },
      { text: '離開雜貨店', next: 'start' },
    ],
  },

  shop_buy_armor: {
    text: `老人從掛架上取下一件棕色皮甲，皮革有些磨損，但針腳結實。

「礦坑裡黑暗，但有時候刀子比黑暗更危險。」他意有所指地說。`,
    onEnter: (state) => {
      state.applyDelta({ gold: -45, def: 2 });
      state.addItem('leather_armor');
    },
    choices: [
      { text: '繼續購物', next: 'shop_enter' },
      { text: '離開雜貨店', next: 'start' },
    ],
  },

  shop_locked_book: {
    text: `老人板起臉：「說了不賣。這本書是……委託保管的。有人說，找到合適的人再轉交。」

他打量你片刻，歎了口氣：「但你這眼神，不像普通旅人。」

他從腰間取出鑰匙，猶豫著：「書裡說，持書者能在遺跡中感應到石版的位置……你，真的打算去那裡嗎？」`,
    choices: [
      { text: '「是，我必須去。」', next: 'shop_ring' },
      { text: '「只是路過而已。」', next: 'shop_enter' },
    ],
  },

  shop_ring: {
    text: `老人點點頭，把鑰匙插進書鎖，書本緩緩展開——裡面是空的，只有一枚戒指靜靜地躺在凹槽裡。

「命運之戒。」他說，「保管它的人說，戒指會找到它的主人。看來……就是你了。」

你接過戒指戴上，指尖有一絲微微的溫熱感。`,
    onEnter: (state) => {
      state.addItem('fate_ring');
      state.setFlag('has_fate_ring');
    },
    choices: [
      { text: '道謝後前往礦坑', next: 'mine_approach' },
    ],
  },

  town_explore: {
    text: `你在鎮上閒晃，石板路的縫隙間長著雜草，幾個孩子在空地上玩耍。

一個小女孩突然跑到你面前，塞給你一朵乾燥的小白花：「給你，旅行的人。我媽媽說這個能帶來好運。」

然後跑走了。

你握著那朵花，感覺心裡莫名地平靜了一些。`,
    onEnter: (state) => { state.applyDelta({ hp: 5 }); }, // 小小治癒
    choices: [
      { text: '前往礦坑', next: 'mine_approach' },
      { text: '回酒館休息', next: 'tavern_enter' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 第二章：礦坑
  // ═══════════════════════════════════════════════════════════════

  mine_approach: {
    text: `礦坑入口在鎮子北方半里路，被一圈簡陋的木柵欄圍著。

入口處的木牌寫著「禁止進入——危險」，但木牌已經歪斜，顯然沒人認真執法。

兩名守衛百無聊賴地靠著木柵，手中的火炬搖曳著。他們看起來不像正規軍，更像是被臨時僱來的混混。`,
    choices: [
      { text: '趁守衛不注意，從側邊潛入', next: 'mine_sneak' },
      { text: '正面衝上去擊倒守衛', next: 'mine_fight_guards' },
      { text: '裝作迷路的旅人靠近搭話', next: 'mine_bluff_enter' },
    ],
  },

  mine_sneak: {
    text: `你繞到柵欄側面，找到一處木板鬆動的縫隙，側著身子擠了進去。

守衛的說話聲漸漸遠去，礦坑入口就在眼前——黑暗的洞口像是一隻張開的嘴，呼出潮濕的地底氣息。

你點燃隨身帶來的火炬，踏入黑暗。`,
    onEnter: (state) => { state.setFlag('entered_mine_stealthy'); },
    choices: [
      { text: '進入第一層走廊', next: 'mine_b1_corridor' },
    ],
  },

  mine_fight_guards: {
    text: `你直接走向守衛。對方反應慢了半拍——你已經出手了。`,
    combat: {
      enemyId: 'mine_guard',
      nextOnWin: 'mine_b1_corridor',
      nextOnLose: 'death_screen',
    },
  },

  mine_bluff_enter: {
    text: `你搖搖晃晃地走向守衛，裝出一副迷路的樣子：「請問……請問這是去鎮子的路嗎？我走了好久……」

守衛面面相覷，其中一個不耐煩地揮手：「走走走，往南邊去！礦坑裡不准進！」

就在他們的注意力轉向時，你悄悄繞過了木柵，從另一側的陰影中滑入礦坑。`,
    choices: [
      { text: '趁機進入礦坑', next: 'mine_b1_corridor' },
    ],
  },

  mine_b1_corridor: {
    text: `礦坑第一層是人工開鑿的走廊，牆上殘留著礦工留下的蠟燭台，大多已熄滅。

你的火炬照亮了前方：一條向左拐的主道，和一個被木箱半遮住的側室。

走廊的空氣潮濕而沉重，遠處傳來低沉的回聲——像是有人在吟唱。`,
    choices: [
      { text: '檢查那些木箱', next: 'mine_b1_box' },
      { text: '注意到牆上有個黑色徽章', next: 'mine_b1_badge' },
      { text: '沿主道繼續向下', next: 'mine_b2_enter' },
    ],
  },

  mine_b1_box: {
    text: `木箱裡裝著幾樣物品：一瓶生命藥水、一把短劍（但你已有武器）、還有一本皮革封面的記事本。

記事本的第一頁寫著：「儀式需要三個條件：鮮血、誓言、石版的共鳴。縫臉師說，三個條件齊備的那一夜，書就會甦醒。」

你把記事本收起，這是重要線索。`,
    onEnter: (state) => {
      state.addItem('health_potion');
      state.addItem('notebook');
      state.setFlag('found_notebook');
    },
    choices: [
      { text: '繼續探索走廊', next: 'mine_b1_corridor' },
    ],
  },

  mine_b1_badge: {
    text: `牆縫裡楔著一個黑色的金屬徽章，幾乎完全隱沒在陰影中，不是刻意找的話根本看不見。

徽章正面刻著一個沒有五官的人臉輪廓——無面者的標誌。

背面刻著一個數字：「三」。

這或許就是凱倫提到的「黑色徽章」。`,
    onEnter: (state) => { state.addItem('black_badge'); state.setFlag('found_badge'); },
    choices: [
      { text: '繼續探索', next: 'mine_b1_corridor' },
    ],
  },

  mine_b2_enter: {
    text: `沿著向下的坡道走了約十分鐘，空氣明顯變得更沉。

前方出現一扇鐵門，旁邊有個小龕，裡面插著一根蠟燭。蠟燭旁有個金屬托架，形狀恰好能放置一枚徽章。

門縫裡透出橘紅色的光芒，還有若有若無的吟唱聲。`,
    choices: [
      {
        text: '將黑色徽章插入托架',
        next: 'mine_b2_altar',
        condition: (state) => state.hasItem('black_badge'),
      },
      { text: '強行撬門（需要花費體力）', next: 'mine_b2_altar', effect: (state) => { state.applyDelta({ hp: -10 }); } },
    ],
  },

  mine_b2_altar: {
    text: `鐵門緩緩開啟，或者被你撬開了一道縫，你擠進去。

裡面是一個圓形的儀式房間。中央有個石製祭壇，上面刻著複雜的符文。七、八根蠟燭燃燒著，黑色火焰——不是橘色，是真正的黑色。

三個穿黑袍的人圍著祭壇低吟。他們還沒發現你。`,
    choices: [
      { text: '打斷儀式！衝出去攻擊他們', next: 'mine_b2_ambush' },
      { text: '躲起來，觀察儀式細節', next: 'mine_b3_approach', effect: (state) => { state.setFlag('witnessed_ritual'); } },
      {
        text: '趁亂偷取祭壇上的物品（遊俠職業更易成功）',
        next: 'mine_b2_altar',
        condition: (state) => state.player.class === 'ranger',
        effect: (state) => { state.addItem('spirit_dagger'); state.setFlag('stole_dagger'); },
      },
    ],
  },

  mine_b2_ambush: {
    text: `你衝出去，三個黑袍人迅速轉身——其中兩個拔出短刀。一個倉皇逃竄，消失在暗道裡。

「阻止者——必死！」`,
    combat: {
      enemyId: 'faceless_cultist',
      nextOnWin: 'mine_b3_approach',
      nextOnLose: 'death_screen',
    },
  },

  mine_b3_approach: {
    text: `第三層的入口是一條螺旋下降的石梯。

走到一半，你突然感到一陣強烈的壓迫感——不是身體上的，而是像有什麼意識在掃描你。

然後你聽到他的聲音，從下方傳來，清晰得令人不安：

「你終於來了。我等了三天。」`,
    choices: [
      { text: '繼續走下去', next: 'seam_master_meet' },
    ],
  },

  seam_master_meet: {
    text: `他站在最底層的中央，燭光打在臉上——或者說，打在那張臉應該在的地方。

縫臉師的臉是一片白布，布上繡著密密麻麻的黑色細線，勾勒出不成形的五官。脖子上掛著三個符文圓盤，隨著呼吸輕輕搖擺。

「你是來拿令牌的，」他說，語氣平靜，像是在陳述事實，「還是來殺我的？」`,
    choices: [
      { text: '「我要拿令牌。」', next: 'seam_master_talk' },
      { text: '直接拔刀進攻', next: 'seam_master_fight_a' },
      { text: '先觀察他身上的符文', next: 'seam_master_analyze' },
    ],
  },

  seam_master_talk: {
    text: `縫臉師微微側頭：「那麼，你知道令牌的用途？」

「遺跡的門需要它，」你說。

「正確。」他停頓，「但你知道嗎——令牌本身不重要。重要的是命運之書能否接受持書人。三百年了，每一個試圖開書的人，都被書本身……拒絕了。」

「你覺得自己不一樣？」他的聲音帶著奇異的好奇，不像是嘲弄。`,
    choices: [
      { text: '「我不知道。但我必須試試。」', next: 'seam_master_token' },
      { text: '「你為什麼要幫我？」', next: 'seam_master_analyze' },
      { text: '趁他說話時發動攻擊', next: 'seam_master_fight_a' },
    ],
  },

  seam_master_analyze: {
    text: `你仔細觀察他身上的三個符文圓盤——每一個都以細線縫在皮膚上，散發著微弱的黑光。

你想起記事本裡的記述：「封印符文，破壞後防禦大幅下降。」

持有靈紋短刀的話，應該可以有效破壞這些符文。`,
    choices: [
      {
        text: '用靈紋短刀攻擊符文弱點！',
        next: 'seam_master_fight_s',
        condition: (state) => state.hasItem('spirit_dagger'),
      },
      { text: '正面交戰（高難度）', next: 'seam_master_fight_a' },
      { text: '繼續對話，嘗試說服他', next: 'seam_master_talk' },
    ],
  },

  seam_master_fight_a: {
    text: `你決定以武力解決問題。縫臉師嘆了一聲，三個符文圓盤同時發出黑光——戰鬥開始了。`,
    combat: {
      enemyId: 'seam_master',
      nextOnWin: 'seam_master_token',
      nextOnLose: 'death_screen',
    },
  },

  seam_master_fight_s: {
    text: `「靈紋短刀，」縫臉師說，語氣變得嚴肅，「你有備而來。」

「那麼，來吧。讓我看看你是否配得上那本書。」

戰鬥開始，但你掌握著符文的弱點——優勢在你這邊。`,
    combat: {
      enemyId: 'seam_master',
      nextOnWin: 'seam_master_token',
      nextOnLose: 'death_screen',
    },
  },

  seam_master_token: {
    text: `縫臉師從懷中取出一個刻有遺跡符號的金屬令牌，遞給你。

「拿著。」他說，「我等了三百年，等一個能開啟那本書的人。也許是你，也許不是。」

他轉身，慢慢走向更深的黑暗：「羅薇娜在遺跡裡。她比你更早到達。小心一些。」

那個奇異的身影消失在黑暗中，只剩下微微搖曳的蠟燭火焰。`,
    onEnter: (state) => {
      state.addItem('seam_token');
      state.setFlag('has_seam_token');
      state.applyDelta({ xp: 50 });
    },
    choices: [
      { text: '離開礦坑，前往遺跡', next: 'mine_escape' },
    ],
  },

  mine_escape: {
    text: `你沿著原路返回，礦坑的黑暗逐漸被入口的灰色天光替換。

你走出礦坑，深深吸了一口外面的空氣——夾著草腥味和晨露的冷空氣，感覺特別真實。

令牌在懷裡，沉甸甸的。遺跡就在北方，等著你。`,
    onEnter: (state) => { state.applyDelta({ hp: 10 }); }, // 離開礦坑稍作喘息
    choices: [
      { text: '直接前往遺跡入口', next: 'ruins_approach' },
      { text: '回鎮上補充物資再出發', next: 'shop_enter' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 第三章：遺跡入口
  // ═══════════════════════════════════════════════════════════════

  ruins_approach: {
    text: `遺跡在夜色中顯得格外壯觀。

石造的拱門高達十公尺，刻著已無人讀得懂的古代文字。拱門兩側各有一個石台，石台上的火盆燃著冷藍色的火焰——不需要任何燃料，三百年來從未熄滅。

這裡不像是廢棄的，更像是在等待。`,
    choices: [
      { text: '查看正門入口', next: 'ruins_front_gate' },
      { text: '尋找側門或其他入口', next: 'ruins_side_door' },
      { text: '找找地下水道', next: 'ruins_waterway' },
    ],
  },

  ruins_meet_rovena: {
    text: `「你終於來了。」

那個聲音從拱門的陰影中傳來。一個高挑的身影走出來——正是羅薇娜，風塵僕僕，但眼神銳利而平靜。

「我在這裡等了兩天。」她說，「礦坑那邊你解決了嗎？」

你把遭遇說了一遍。她點點頭，若有所思：「縫臉師讓你走……比我想的複雜。」`,
    choices: [
      { text: '詢問她關於三塊石版', next: 'ruins_rovena_info' },
      { text: '直接進入遺跡', next: 'ruins_front_gate' },
    ],
  },

  ruins_rovena_info: {
    text: `「三塊石版，」羅薇娜展開一張羊皮紙地圖，「分別存放在三個祭壇：火焰、水鏡、虛空。」

「石版是命運之書的鑰匙，集齊三塊才能開啟最深層的命運核心。」她停頓，「書就在那裡。」

「但是……」她皺眉，「每個祭壇都有守護者。還有，無面者已經知道我們來了。」`,
    onEnter: (state) => { state.setFlag('knows_three_slabs'); },
    choices: [
      { text: '接過她給的遺跡護符', next: 'ruins_rovena_charm' },
      { text: '進入遺跡', next: 'ruins_front_gate' },
    ],
  },

  ruins_rovena_charm: {
    text: `羅薇娜從頸間取下一個小護符，遞給你：「這是遺跡的共鳴符，能讓你感應到石版的方向。我有兩個。」

你接過護符，掛在脖子上——它微微發暖，像是回應了什麼。

「我們分頭行動，」她說，「效率更高，而且——如果其中一個人出了意外，另一個還能繼續。」

那最後半句話，她說得很平靜。`,
    onEnter: (state) => {
      state.addItem('ruin_charm');
      state.setFlag('has_rovena_charm');
    },
    choices: [
      { text: '進入遺跡', next: 'ruins_front_gate' },
    ],
  },

  ruins_front_gate: {
    text: `正門有四名守衛，手持長矛，鎧甲上刻著無面者的符號。

他們看見你，其中一個喝道：「持令牌者可入，無令牌者——殺！」

幸好你有。或者沒有。`,
    choices: [
      {
        text: '出示縫臉師令牌',
        next: 'ruins_f1_hall',
        condition: (state) => state.hasItem('seam_token'),
      },
      { text: '強行突破四名守衛', next: 'ruins_front_fight' },
      { text: '退後，找其他入口', next: 'ruins_approach' },
    ],
  },

  ruins_front_fight: {
    text: `你沒有令牌，或者選擇了更直接的方式。

四名守衛同時衝上來——`,
    combat: {
      enemyId: 'ruin_guards_group',
      nextOnWin: 'ruins_f1_hall',
      nextOnLose: 'death_screen',
    },
  },

  ruins_side_door: {
    text: `繞到側面，你發現了一扇較小的石門，門上刻著五個符號：金、木、水、火、土。

符號旁邊有五個可旋轉的圓盤，每個圓盤上都有五行符號可以選擇。

門縫裡透出微光——顯然是通的，只是被謎題鎖住了。`,
    choices: [
      { text: '依照「五行相生」順序旋轉（金生水、水生木、木生火、火生土、土生金）', next: 'ruins_f1_hall' },
      { text: '強行推開（觸發陷阱）', next: 'ruins_side_force' },
      { text: '放棄，找其他入口', next: 'ruins_approach' },
    ],
  },

  ruins_side_force: {
    text: `你用力推門，石門發出一聲巨響——然後地板突然陷下去，你急忙往後跳，堪堪避過一道射出的石箭。

陷阱。你抹了把冷汗，腿上被蹭到一道傷口。`,
    onEnter: (state) => { state.applyDelta({ hp: -15 }); },
    choices: [
      { text: '正確解開謎題再試', next: 'ruins_f1_hall' },
      { text: '去找正門入口', next: 'ruins_front_gate' },
    ],
  },

  ruins_waterway: {
    text: `沿著遺跡外牆摸索，你找到一個排水口——石縫之間，足夠側身爬過去。

你沾了一身苔蘚和積水，但成功繞過了守衛，從地下水道進入遺跡內部。`,
    onEnter: (state) => { state.setFlag('entered_via_waterway'); },
    choices: [
      { text: '進入第一層大廳', next: 'ruins_f1_hall' },
    ],
  },

  ruins_crawl_in: {
    text: `你找到一道裂縫，細心的眼睛才能發現它——石牆裡的一條暗縫，剛好容得下一個身形瘦削的人通過。

你硬擠了進去，出來的那一刻衣服撕破了一道口子，但你在遺跡裡面了。`,
    choices: [
      { text: '進入大廳', next: 'ruins_f1_hall' },
    ],
  },

  ruins_mural: {
    text: `第一層的走廊牆上覆蓋著精細的壁畫，描繪著某個古代故事。

你看見一個身著白袍的人站在一本發光的書前，周圍的人跪拜著。然後畫面轉換——那個人把書藏進了地底。

最後一格壁畫幾乎磨損殆盡，只能勉強看出：那個人站著，面對著一個無臉的影子。

書靈，或者，無面者首領？`,
    onEnter: (state) => { state.setFlag('saw_mural'); },
    choices: [
      { text: '繼續前進', next: 'ruins_f1_hall' },
    ],
  },

  ruins_f1_hall: {
    text: `第一層大廳高大空曠，四根石柱支撐著穹頂。

地板中央刻著一個三叉的符號——三條路，分別通往三個祭壇。

左側走廊：熱氣隱隱透出，石壁上有燒焦的痕跡。（火焰祭壇）
右側走廊：空氣潮濕，帶著苔蘚的氣息。（水鏡祭壇）
中央走廊：完全黑暗，沒有盡頭。（虛空祭壇）`,
    onEnter: (state) => { state.setFlag('reached_ruins_hall'); },
    choices: [
      { text: '進入左側走廊（火焰祭壇）', next: 'fire_corridor' },
      { text: '進入右側走廊（水鏡祭壇）', next: 'water_corridor' },
      { text: '進入中央黑暗走廊（虛空祭壇）', next: 'void_bridge' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 第四章：火焰祭壇
  // ═══════════════════════════════════════════════════════════════

  fire_corridor: {
    text: `走廊越來越熱。

石壁上的古代壁畫被熱氣薰得黯淡，但依稀可辨認出火焰與戰鬥的圖樣。地板上有著規律的火把座，間隔約兩公尺一個。

你發現了一件事：所有的火把都是點燃的——而且火焰會在你靠近時稍微偏向你。像是在追蹤。

前方傳來低沉的石頭磨動聲。`,
    choices: [
      { text: '繼續向前進入大廳', next: 'fire_hall_enter' },
      { text: '先嘗試關閉幾個火把', next: 'fire_golem_analyze' },
    ],
  },

  fire_hall_enter: {
    text: `大廳中央，一個兩公尺高的石像緩緩轉過頭來。

它的眼睛燃燒著橘紅色的火焰，全身由深灰色的岩石構成，每個關節的縫隙都透著火光。

「進入火焰祭壇者，」它的聲音像是石頭碾過石頭，「必須通過試煉。」`,
    choices: [
      { text: '詢問試煉的規則', next: 'fire_golem_talk' },
      { text: '直接攻擊石像', next: 'fire_golem_fight' },
      { text: '仔細觀察周圍的機關', next: 'fire_golem_analyze' },
    ],
  },

  fire_golem_talk: {
    text: `石像緩緩說：「試煉很簡單。你必須在我的守護下，觸碰祭壇上的石版。」

「但如果你觸碰石版前，被我擊倒，就是失敗。」

「你可以使用任何方式——包括欺騙。」

最後那句話讓你愣了一下。它在提示你什麼嗎？`,
    choices: [
      { text: '「欺騙？你是在告訴我什麼？」', next: 'fire_golem_analyze' },
      { text: '接受試煉，正面戰鬥', next: 'fire_golem_fight' },
    ],
  },

  fire_golem_analyze: {
    text: `你環視整個大廳。

火把座以環形排列，石像站在中央——你注意到它的眼睛會追蹤火光移動。每當火把搖曳，它的眼睛就會轉向。

「是感光的，」你低聲自語，「它靠火焰感知位置……」

如果把大廳的火把全部關閉，石像就無法感知你的位置。`,
    onEnter: (state) => { state.setFlag('understands_golem'); },
    choices: [
      { text: '逐一關閉所有火把，趁石像困惑取得石版', next: 'fire_golem_smart' },
      { text: '還是直接打吧', next: 'fire_golem_fight' },
    ],
  },

  fire_golem_smart: {
    text: `你繞著大廳邊緣走，一個一個地關閉火把。

石像的眼睛開始不規律地轉動，動作也變得遲緩，像是陷入困惑。最後一個火把熄滅的瞬間，它完全靜止了。

你快步走向祭壇中央，伸出手，觸碰了石版——`,
    onEnter: (state) => {
      state.setFlag('torches_off');
    },
    choices: [
      { text: '取得火焰石版', next: 'fire_slab_obtain' },
    ],
  },

  fire_golem_fight: {
    text: `石像的眼睛燃燒得更亮了。

「很好，」它說，「正面的勇氣，也是試煉的一種。」

戰鬥開始了。`,
    combat: {
      enemyId: 'fire_golem',
      nextOnWin: 'fire_golem_down',
      nextOnLose: 'death_screen',
    },
  },

  fire_golem_grab: {
    text: `你試圖強行搶奪石版——石像的手掌在你的手腕上猛地合攏。

劇烈的疼痛傳來，你被拋出去，撞在石柱上。`,
    onEnter: (state) => { state.applyDelta({ hp: -20 }); },
    choices: [
      { text: '爬起來繼續戰鬥', next: 'fire_golem_fight' },
    ],
  },

  fire_golem_down: {
    text: `石像緩緩倒下，橘紅色的眼火熄滅，變成普通的石頭。

它倒地的瞬間，大廳裡的所有火把同時熄滅，然後又重新點燃——但這次火焰是平靜的白色。

試煉完成了。`,
    choices: [
      { text: '走向祭壇取得石版', next: 'fire_slab_obtain' },
    ],
  },

  fire_slab_obtain: {
    text: `你的手觸碰到火焰石版的瞬間——

一片記憶湧入你的腦海，不是你的記憶。是「過去」。

你看見三百年前那個書靈站在同樣的祭壇前，做出同樣的動作，只是他的眼睛裡有更多的悲傷。

然後記憶消散，你手中握著一塊深紅色的石版，邊緣雕刻著火焰的圖案，溫熱的，像有生命在跳動。`,
    onEnter: (state) => {
      state.addItem('fire_slab' );
      state.setFlag('has_fire_slab');
      state.applyDelta({ xp: 60 });
    },
    choices: [
      { text: '離開火焰祭壇，前往下一個', next: 'fire_exit' },
    ],
  },

  fire_exit: {
    text: `走廊的溫度隨著你的離開逐漸下降，那些追蹤你的火把火焰也平靜下來，恢復為普通的暖光。

你回到第一層大廳，石版在懷中散發著安定的溫度。

還有兩個祭壇在等著你。`,
    choices: [
      { text: '前往水鏡祭壇', next: 'water_corridor' },
      { text: '前往虛空祭壇', next: 'void_bridge' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 第五章：水鏡祭壇
  // ═══════════════════════════════════════════════════════════════

  water_corridor: {
    text: `走廊的地板濕滑，積著淺淺的水，每一步都濺起漣漪。

苔蘚覆蓋著牆壁，在火炬光下呈現深綠色。前方傳來輕柔的水流聲，像是某個巨大的水體在緩緩流動。

走廊的盡頭，一扇沒有門的拱形開口，可以看見裡面的水光反射在天花板上。`,
    choices: [
      { text: '走入水鏡祭壇', next: 'water_hall_enter' },
    ],
  },

  water_hall_enter: {
    text: `大廳中央是一面圓形的水鏡——直徑約五公尺，水面平靜如鏡，倒映著穹頂的星圖壁畫。

沒有守護者，只有水。

你靠近水鏡，水面突然泛起漣漪，然後文字浮現，清晰地顯示在水面上：

「持有者，回答我的問題。」`,
    choices: [
      { text: '「好，請問吧。」', next: 'water_riddle_q' },
    ],
  },

  water_riddle_q: {
    text: `水面的文字緩緩流動，像是有人在一筆一畫地書寫：

「有一樣東西，人人都擁有，但沒有人能真正看見它。你試圖保護它，卻常常在不知不覺中傷害它。它決定了你今天的每一個選擇。

它是什麼？」`,
    choices: [
      { text: '「秘密。」', next: 'water_riddle_a1' },
      { text: '「命運。」', next: 'water_riddle_a2' },
      { text: '「時間。」', next: 'water_riddle_a3' },
    ],
  },

  water_riddle_a1: {
    text: `水面急速收縮，掀起一道小波浪。

「不正確。」文字浮現，語氣平靜，「你還有機會。」`,
    onEnter: (state) => {
      state.setFlag('water_wrong_1');
      state.applyDelta({ hp: -8 });
    },
    choices: [
      { text: '再次思考，重新回答', next: 'water_riddle_q' },
    ],
  },

  water_riddle_a2: {
    text: `水面靜止了片刻。

然後，從水鏡的中心浮出一道白光，那光緩緩凝聚成一個石版的形狀——

「正確。」

石版從水中升起，落在你伸出的手中。`,
    choices: [
      { text: '接住石版', next: 'water_slab_obtain' },
    ],
  },

  water_riddle_a3: {
    text: `水面急速收縮，掀起一道小波浪。

「不正確。」文字浮現，「命運有時間的成分，但並非全部。再想想。」`,
    onEnter: (state) => {
      if (state.hasFlag('water_wrong_1')) {
        // 第二次答錯，懲罰更重
        state.applyDelta({ hp: -15 });
      } else {
        state.setFlag('water_wrong_1');
        state.applyDelta({ hp: -8 });
      }
    },
    choices: [
      { text: '重新回答', next: 'water_riddle_q' },
    ],
  },

  water_riddle_fail1: {
    text: `水面猛地翻騰，一道水柱打在你身上，寒意刺入骨髓。

「你的思考還不夠清晰，」水面文字說，「再想想。」`,
    onEnter: (state) => { state.applyDelta({ hp: -12 }); },
    choices: [
      { text: '重新作答', next: 'water_riddle_q' },
    ],
  },

  water_riddle_fail2: {
    text: `水面再次翻騰，這次更猛烈，你幾乎站立不穩。

身上的濕意讓你感到虛弱，但你咬牙撐著。`,
    onEnter: (state) => { state.applyDelta({ hp: -20 }); },
    choices: [
      { text: '最後一次機會，重新作答', next: 'water_riddle_q' },
    ],
  },

  water_slab_obtain: {
    text: `石版在你手中——水藍色，邊緣的刻紋在水光下閃爍。

觸碰它的瞬間，你感受到了「現在」。

不是時間的流逝，而是這一刻的完整性——這個當下的重量，以及它與過去和未來的連結。那種感覺很難用語言描述，但你明白了。

命運，就是每一個「現在」疊加起來的東西。`,
    onEnter: (state) => {
      state.addItem('water_slab');
      state.setFlag('has_water_slab');
      state.applyDelta({ xp: 60 });
    },
    choices: [
      { text: '離開水鏡祭壇', next: 'water_exit' },
    ],
  },

  water_exit: {
    text: `走廊的水漸漸退去，石板路重新變得乾燥。

你回到第一層大廳，兩塊石版在懷中，一個溫熱，一個清涼，像是兩個不同的呼吸節奏。

只剩下最後一個祭壇了。虛空。`,
    choices: [
      { text: '前往虛空祭壇', next: 'void_bridge' },
      {
        text: '先去火焰祭壇（如果還沒去）',
        next: 'fire_corridor',
        condition: (state) => !state.hasFlag('has_fire_slab'),
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 第六章：虛空祭壇
  // ═══════════════════════════════════════════════════════════════

  void_bridge: {
    text: `中央走廊的黑暗是真正的黑暗——你的火炬在這裡只能照亮腳下半公尺的範圍。

然後走廊突然中斷，一道石橋橫跨在黑暗之上。橋下，你無法看見底部，只聽得見極其遙遠的回聲，像是從無限深處傳來的。

橋的另一端有一扇開著的拱門，透出白色的光。`,
    choices: [
      { text: '走過石橋', next: 'void_hall_enter' },
    ],
  },

  void_hall_enter: {
    text: `越過石橋，進入一個空曠的圓形廳堂。

沒有壁畫，沒有火把，沒有機關——只有白色的光從穹頂漫射下來，來源不明。

廳堂中央漂浮著一個人形的光影，沒有確切的輪廓，只是一種存在的感覺。

「你來了，」光影說，聲音像是很多人在同時說話，「我等著你。」`,
    choices: [
      { text: '「你是誰？」', next: 'void_spirit_talk' },
    ],
  },

  void_spirit_talk: {
    text: `「我是這本書的記憶，」光影說，「或者說，書靈——三百年前決定把書封藏於此的那個人的意志，殘留下來的碎片。」

「你是來取石版的，」它繼續，「石版在這裡。但在給你之前，我有一個問題。」

它停頓，白光微微收縮：「你為什麼要開啟命運之書？」`,
    choices: [
      { text: '「我想改寫自己的命運。」', next: 'void_q_self' },
      { text: '「我想阻止無面者利用它。」', next: 'void_q_protect' },
      { text: '「我想把它永遠封印。」', next: 'void_q_seal' },
    ],
  },

  void_q_self: {
    text: `書靈沉默了片刻。

「誠實的回答。」它說，「我見過太多人說著崇高的理由，卻滿心自私。你至少——誠實。」

「但你知道嗎，」它的語氣變得輕柔，「改寫命運，意味著你必須先看清它。看清命運，並不是一件舒適的事。」`,
    choices: [
      { text: '「我準備好了。」', next: 'void_self_glimpse' },
      { text: '「也許……我沒有想得那麼清楚。」', next: 'void_sacrifice_unsure' },
    ],
  },

  void_q_protect: {
    text: `書靈的光芒稍微溫暖了一些。

「守護的意志，」它說，「三百年前那個人也是這樣說的。」

「但守護需要代價。你願意付出什麼？」`,
    choices: [
      { text: '「我願意犧牲自己。」', next: 'void_sacrifice_yes' },
      { text: '「我不確定。」', next: 'void_sacrifice_unsure' },
      { text: '「我盡我所能，但我不願為此付出生命。」', next: 'void_sacrifice_honest' },
    ],
  },

  void_q_seal: {
    text: `書靈靜止了。

然後，出乎意料地，它輕輕笑了：「封印它……你是第一個說這個的人。」

「所有來過這裡的人，不是想用它，就是想毀掉它。你說封印，是指讓它繼續存在，但不讓任何人使用？」`,
    onEnter: (state) => { state.setFlag('wants_to_seal'); },
    choices: [
      { text: '「是的。包括我自己。」', next: 'void_sacrifice_unsure' },
      { text: '「其實，我不確定那是最好的答案。」', next: 'void_spirit_talk' },
    ],
  },

  void_sacrifice_yes: {
    text: `書靈的光芒黯淡了一瞬。

「那不是我希望的答案，」它說，「三百年前的那個人選擇了犧牲，換來的是三百年的封印。但問題從未真正解決。」

「犧牲不是答案，它只是推遲。」

它的語氣帶著一絲悲傷：「再想想，你真正的答案是什麼？」`,
    choices: [
      { text: '「那我不知道……」', next: 'void_sacrifice_unsure' },
      { text: '「保護我在乎的人。」', next: 'void_sacrifice_honest' },
    ],
  },

  void_sacrifice_no: {
    text: `書靈微微震動，然後平靜下來。

「不願意，」它說，「這是誠實的。」

「我見過太多人說願意，卻在最後一刻退縮。你的誠實，我很欣賞。」

「那麼，你打算怎麼做？」`,
    choices: [
      { text: '「盡我所能，不過分承諾。」', next: 'void_sacrifice_honest' },
    ],
  },

  void_sacrifice_unsure: {
    text: `書靈的光芒溫柔地搖曳。

「不確定，」它說，「這是最好的答案。」

你愣了一下。

「三百年來，每一個來這裡的人，都太確定了，」它繼續，「確定自己的目的，確定自己的犧牲，確定自己是對的。但命運從來不是確定的東西。」

「不確定的人，才有可能真正做出選擇。」`,
    onEnter: (state) => { state.setFlag('gave_best_answer'); },
    choices: [
      { text: '接受書靈的話，取得石版', next: 'void_slab_obtain' },
    ],
  },

  void_sacrifice_honest: {
    text: `書靈沉默片刻，然後說：「盡力，然後接受結果。」

「這樣的態度……讓我放心。」

它的光芒穩定下來，不再搖曳：「背負著必須成功的重量，往往會讓人做出錯誤的選擇。你的回答，讓我覺得你可以信任。」`,
    onEnter: (state) => { state.setFlag('void_spirit_trusts'); },
    choices: [
      { text: '接過石版', next: 'void_slab_obtain' },
    ],
  },

  void_self_glimpse: {
    text: `書靈伸出一道光，輕輕觸碰你的額頭。

你看見了——你自己的命運頁，薄薄的一頁，寫滿了文字。你試圖閱讀，但文字不斷流動，像是活著的。

只有最後一行是靜止的：「選擇，然後繼續走。」

當你回過神來，書靈正平靜地看著你。`,
    choices: [
      { text: '「我不想改寫它了。」', next: 'void_slab_obtain' },
      { text: '「我想改寫那最後一行。」', next: 'void_self_decide' },
    ],
  },

  void_self_decide: {
    text: `書靈的表情——雖然沒有臉，你卻感覺到了某種表情——變得認真。

「你可以，」它說，「但你要知道：改寫命運頁，意味著放棄那個結果，換成另一個結果。你不知道新的結果會更好還是更壞。」

「三百年前那個人改寫了自己的命運頁。他選擇了封藏這本書，而非使用它。那是他的答案。」

「你的答案，是什麼？」`,
    choices: [
      { text: '「不改了。讓命運按照它的方式走。」', next: 'void_slab_obtain' },
      { text: '「我要改寫。」', next: 'void_slab_obtain', effect: (state) => { state.setFlag('decided_to_rewrite'); } },
    ],
  },

  void_slab_obtain: {
    text: `書靈緩緩退後，光芒中凝聚出一塊石版，向你飄來。

你接住它——白色，邊緣的刻紋在白光下幾乎透明。

觸碰的瞬間，你感受到了「未來」。

不是預言，而是可能性的重量——所有可能發生的事情同時壓在你的感知上，讓你短暫地無法呼吸。然後，歸於平靜。

命運，是無數可能性中，你選擇走的那一條。`,
    onEnter: (state) => {
      state.addItem('void_slab');
      state.setFlag('has_void_slab');
      state.applyDelta({ xp: 80 });
    },
    choices: [
      { text: '離開虛空祭壇', next: 'void_exit' },
    ],
  },

  void_exit: {
    text: `你走回石橋，橋下的黑暗依然深邃，但你的步伐更穩了。

三塊石版在懷中，各自輕輕震動，像是在互相呼應。

第一層大廳，然後是更深的地方——命運核心。

你感覺到護符的溫度在上升，它在引導你。`,
    choices: [
      { text: '前往命運核心', next: 'core_descent' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 第七章：命運核心
  // ═══════════════════════════════════════════════════════════════

  core_descent: {
    text: `三塊石版讓你感應到了一條隱藏的通道——在第一層大廳的地板下，一扇石板被三個石版的共鳴頂開了。

你往下走，螺旋石梯的盡頭透出一種特別的光，不是火光，不是白光，而是像書頁被光透過的那種黃色。`,
    choices: [
      { text: '繼續下降', next: 'core_atmosphere' },
    ],
  },

  core_atmosphere: {
    text: `最深層。

空間不大，卻有種無限延伸的錯覺。四壁上密密麻麻地刻著文字，從地板延伸到頂端，每一個字都在微微發光。

中央有一個石台，石台上——空的。

但你感覺得到，那裡有什麼。`,
    choices: [
      { text: '走向石台', next: 'core_slabs_unite' },
    ],
  },

  core_slabs_unite: {
    text: `你站在石台前，把三塊石版取出。

它們從你的手中飄出，自動排列成三角形，懸浮在石台上方。三塊石版開始旋轉，速度越來越快，三種顏色的光——深紅、水藍、純白——交織在一起。

然後，一本書出現了。

從無到有，從光到實體，一本約有三公分厚的古書，靜靜地放在你的手邊。`,
    choices: [
      { text: '伸手觸碰那本書', next: 'core_book_awakens' },
    ],
  },

  core_book_awakens: {
    text: `你的手指碰到書脊的瞬間——

光芒萬丈。

不是比喻，是真正的光，從書中透出，映亮了整個深層空間，映亮了四壁的所有文字，映亮了你閉上的眼皮。

然後，一切歸靜。

書在你手中，封面上沒有任何文字，只有一個壓花的輪廓——是你的輪廓。

命運之書，接受了你。`,
    onEnter: (state) => { state.setFlag('book_awakened'); },
    choices: [
      { text: '打開書，聽書的聲音', next: 'core_book_voice' },
    ],
  },

  core_book_voice: {
    text: `書翻開了第一頁。

文字不是印刷的，而是在你翻開的瞬間才出現的，用一種你不認識卻能理解的語言寫著：

「持書者，你已到達終點，也是起點。此書的力量在你手中，你可以選擇如何使用它——或者，選擇放下它。

命運從不強求。」

就在這時，你聽見了腳步聲，從你走來的方向——很多的腳步聲。`,
    choices: [
      { text: '準備戰鬥，迎接來者', next: 'core_faceless_crash' },
    ],
  },

  core_faceless_crash: {
    text: `十幾個黑袍人湧入，最前方的人摘下了兜帽——

高大，沒有表情，或者說沒有臉，只有一個平滑的面孔，中央有一個緩緩旋轉的黑色渦旋。

「書，」那個聲音從渦旋中傳來，像是從很深的地方浮上來，「給我。」

這就是無面者首領。三百年來一直等待命運之書的那個存在。`,
    choices: [
      { text: '緊握著書，準備最後的戰鬥', next: 'core_boss_fight' },
    ],
  },

  core_boss_fight: {
    text: `「你等了三百年，」你說，「等這本書。但它不是為你開啟的。」

無面者首領的黑色渦旋急速收縮，然後爆發——

「那就從你身上搶走！」

最後決戰，開始。`,
    combat: {
      enemyId: 'faceless_lord',
      nextOnWin: 'core_boss_down',
      nextOnLose: 'ending_death',
    },
  },

  core_boss_down: {
    text: `無面者首領倒下了。

那個黑色的渦旋緩緩消散，其他黑袍人在首領倒下的瞬間逃竄，消失在通道裡。

沉默降臨，只剩下書在你手中，以及迴盪在深層空間裡的你的呼吸聲。

命運之書在等待你的決定。`,
    onEnter: (state) => {
      state.setFlag('defeated_faceless_lord');
      state.applyDelta({ xp: 200, gold: 60 });
    },
    choices: [
      { text: '翻開書，改寫自己的命運', next: 'core_choice_rewrite' },
      { text: '將無面者的力量封印在書中', next: 'core_choice_seal' },
      { text: '把書交給羅薇娜保管', next: 'core_choice_give' },
      { text: '讓書回歸虛空，消失於世間', next: 'core_choice_void' },
    ],
  },

  core_choice_rewrite: {
    text: `你翻到書的深處，找到了那一頁——你自己的命運頁。

文字密密麻麻，記錄著你走到今天的每一步。最後一行，你清楚地看見了：

「選擇，然後繼續走。」

那支無形的筆懸在你的指尖，等待你。`,
    choices: [
      { text: '改寫最後一行', next: 'core_rewrite_see' },
      { text: '合上書，不改了', next: 'ending_truth' },
    ],
  },

  core_choice_seal: {
    text: `你把書合上，集中意念，將無面者首領殘餘的黑色力量引入書中。

書顫動了，封面的壓花灼燒發光，然後沉靜下來——更重了，像是裝進了什麼沉重的東西。

「封印完成，」書靈的聲音從書中傳來，「但你需要繼續守護它。」`,
    choices: [
      { text: '接受守護者的命運', next: 'ending_guardian' },
    ],
  },

  core_choice_give: {
    text: `你看向通道入口——羅薇娜站在那裡，不知何時來到的，靜靜地看著你。

「你一直在這裡，」你說。

「我一直跟著，」她說，「但這一路的選擇，都是你做的。」

你把書伸向她：「你比我更清楚它的歷史，也更清楚它的危險。你來保管。」`,
    choices: [
      { text: '將書交給羅薇娜', next: 'ending_trust' },
    ],
  },

  core_choice_void: {
    text: `你抱著書，走向虛空祭壇的方向——那個深淵之上的石橋。

你站在橋邊，俯視著無底的黑暗。

書靈的聲音輕輕響起：「你確定嗎？回歸虛空的書，三百年內不會再現世。」

「我知道，」你說，「但世界不需要一本能改變命運的書。世界需要的，是能做出選擇的人。」`,
    choices: [
      { text: '將書放入虛空', next: 'ending_truth' },
    ],
  },

  core_rewrite_see: {
    text: `你在命運頁最後一行的旁邊，寫下了新的文字——你的文字。

不是改變結局，而是加上了一行：「選擇之後，不後悔。」

書頁上的文字靜止了，然後緩緩發光，像是被接受了。

你合上書，感覺有什麼東西在心裡輕輕落定。`,
    choices: [
      { text: '離開遺跡', next: 'ending_self' },
    ],
  },

  core_rewrite_done: {
    text: `改寫完成了。

那一頁，那幾個字，就這樣存在於書中，也存在於某種更深的地方。

你不知道這是否真的改變了什麼。但你做了選擇，而那就是一切。`,
    choices: [
      { text: '離開遺跡', next: 'ending_self' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 結局節點
  // ═══════════════════════════════════════════════════════════════

  ending_truth: {
    isEnding: true,
    endType: 'victory',
    endTitle: '✦ 真實結局：回歸',
    endMsg: '書消失在黑暗中，沒有聲音，沒有光芒。世界繼續運轉，沒有人知道那本書存在過。但你知道。有時候，最好的選擇，是放手。',
    text: `命運之書沉入黑暗，消失無蹤。

你站在橋上，手是空的，心是平靜的。

世界繼續它的運轉，無數的命運繼續交織，沒有一本書來決定它們。只有無數的選擇，互相影響，成就了那個叫做「未來」的東西。

你轉身，往出口走去。

後來，有人問你在遺跡裡發現了什麼。你說：「一本書。」「什麼書？」「一本讀完就消失的書。」對方笑你說謊。但你也笑了。`,
  },

  ending_self: {
    isEnding: true,
    endType: 'victory',
    endTitle: '✦ 自我結局：不後悔',
    endMsg: '你改寫的不是命運的走向，而是面對命運的方式。那一行字，讓你在每一個選擇之後，都能繼續前行。',
    text: `你帶著命運之書走出遺跡，晨光剛好照在石板路上。

書在你懷裡，不輕也不重，像是一個承諾。你不打算用它改寫太多——只是那一行字，那一個決定，讓你明白了自己是誰。

羅薇娜在遺跡外等你，她看見你出來的樣子，問：「解決了？」

「解決了。」

「書呢？」

「還在。但現在知道怎麼用它了——或者說，怎麼不用它。」

她點點頭，沒有再問。有些答案不需要說明。`,
  },

  ending_guardian: {
    isEnding: true,
    endType: 'victory',
    endTitle: '✦ 守護者結局：封印長存',
    endMsg: '封印無面者的代價是永遠守護那本書。但你選擇了，而選擇本身，就是一種自由。',
    text: `命運之書沉重地壓在你的肩上，不是實體上的重量，而是那份責任的重量。

書靈說，守護者不一定要孤獨。它說，你可以找到繼承者，找到一個值得信任的人，在你老去之前，把這份責任傳遞下去。

也許羅薇娜就是那個人。也許是你在路上遇見的某個陌生人。

你走出遺跡，抬頭看著灰霧鎮方向升起的炊煙，意識到一件事：任務還沒結束，但旅程，正要開始。`,
  },

  ending_trust: {
    isEnding: true,
    endType: 'victory',
    endTitle: '✦ 信任結局：命運同行',
    endMsg: '把書交給羅薇娜，不是逃避，而是信任。命運之書有了新的守護者，而你有了並肩同行的人。',
    text: `羅薇娜接過書，輕輕把它放進旅行包裡，像是在安置一個睡著的孩子。

「你就這樣放心了？」她問。

「不放心，」你說，「但我信任你。」

她停頓了一下，然後點頭：「那我就不能讓你失望了。」

你們一起走出遺跡，灰霧鎮的方向，太陽正在升起。

命運之書換了守護者，無面者的威脅暫時解除，世界繼續它的故事。你也繼續你的——只是從今天起，你不再是孤身一人了。`,
  },

  ending_sealed_secret: {
    isEnding: true,
    endType: 'secret',
    endTitle: '✦ 隱藏結局：三百年的答案',
    endMsg: '書靈等了三百年的問題，終於有了它認為正確的答案。命運之書，找到了真正的歸宿。',
    text: `書靈的聲音最後一次響起：「你是第一個，給出這個答案的人。」

「什麼答案？」你問。

「『我不確定。』」它說，「三百年來，每一個來到這裡的人，都太確定了。確定自己的目的，確定自己的犧牲。但命運不是確定的東西。你的不確定，正是命運真正的樣子。」

書自動合上，然後消失——不是沉入黑暗，而是真正地消失，化成無數微小的光點，散逸在空氣中。

「它去哪了？」你問空氣。

「回到寫它的人身邊，」書靈的聲音越來越遠，「回到每一個做過選擇的人身邊。它一直都在，只是沒有形體了。」

你站在空空的石台前，空空的手，空空的心——但不空洞，而是平靜。`,
  },

  ending_death: {
    isEnding: true,
    endType: 'dead',
    endTitle: '✦ 終局：倒下',
    endMsg: '你倒下了。但故事沒有結束——命運之書還在那裡，等待下一個人。',
    text: `你倒在命運核心的石板上，無面者首領的黑色力量壓過了你的意志。

命運之書從你的手中滑落，落在地板上，靜靜地等待。

意識消散之前，你看見書頁自己翻動，停在一個你來不及閱讀的頁面上。

也許下一個人，會做出不同的選擇。`,
  },

  // 死亡通用節點
  death_screen: {
    isEnding: true,
    endType: 'dead',
    endTitle: '✦ 你倒下了',
    endMsg: '在這個世界裡，命運有時殘酷。但每一次倒下，都是一次新的開始。',
    text: `你的力量耗盡，倒在黑暗之中。

也許你可以做出不同的選擇。也許命運，只是在等你再試一次。`,
  },
};
