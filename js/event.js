// ===== 游戏事件池 =====
//
// 基础事件设计（修炼+财富获取）：
// 灵石消耗按1:4.16增长，1年获取财富 = 3年修炼消耗
//
// 炼气期：修炼消耗10灵石/次，修为天赋×0.12；财富获取30灵石/次
// 筑基期：修炼消耗42灵石/次，修为天赋×0.60；财富获取126灵石/次
// 金丹期：修炼消耗175灵石/次，修为天赋×3.0；财富获取525灵石/次
// 元婴期：修炼消耗728灵石/次，修为天赋×15；财富获取2184灵石/次
// 游戏在突破化神时结束

// ===== 游戏事件池 =====
// adventureEvents 已由 adventure.js 定义并暴露到全局
//
// 气运影响机制：
// - 气运 > 80：好事概率×1.5，坏事概率×0.5
// - 气运 50-80：好事概率×1.2，坏事概率×0.7
// - 气运 20-50：正常概率
// - 气运 < 20：好事概率×0.7，坏事概率×1.5

// ===== 炼气期好事事件（修为/财富/寿元）=====
// 基础财富30，修为中间值500
const lianqiGoodEvents = [
  // 寿元好事（1个）
  { text: `偶入一处灵气充沛的<span class="event-highlight">灵泉</span>，泉边修炼数月，身强体健，寿元增加。`, dAttr: { cultivation: rnd(25, 40), lifespan: 10 } },
  // 修为好事（4个）
  { text: `在山中采药时，偶遇一位云游散修，见你根骨不凡，传授你一篇<span class="event-highlight">吐纳心法</span>。`, dAttr: { cultivation: rnd(25, 50) } },
  { text: `路经古潭，潭底竟藏有一枚<span class="event-highlight">润灵丹</span>，服下后灵气充盈。`, dAttr: { cultivation: rnd(30, 60) } },
  { text: `在坊市地摊上，发现一本残破的<span class="event-highlight">基础功法</span>，研读后修炼效率提升。`, dAttr: { cultivation: rnd(35, 70) } },
  { text: `在山洞避雨时，发现前人遗留的<span class="event-highlight">灵液</span>，修为大涨。`, dAttr: { cultivation: rnd(40, 80) } },
  // 财富好事（6个）基础30×2-5倍=60-150
  { text: `帮助一位迷路的凡人孩童，其父是附近富户，赠予你<span class="event-highlight">灵石若干</span>以作答谢。`, dAttr: { wealth: rnd(60, 120) } },
  { text: `路遇劫匪，你出手相助，被救者竟是某修仙家族的子弟，赠予<span class="event-highlight">灵石</span>。`, dAttr: { wealth: rnd(70, 140) } },
  { text: `救下一只受伤的灵雀，它报恩带来一枚<span class="event-highlight">聚灵果</span>，出售后获得灵石。`, dAttr: { wealth: rnd(80, 150) } },
  { text: `在一处废弃矿洞中意外发现残留灵石，收获颇丰。`, dAttr: { wealth: rnd(60, 130) } },
  { text: `帮人鉴定灵材，对方赠予<span class="event-highlight">灵石</span>作为酬谢。`, dAttr: { wealth: rnd(65, 125) } },
  { text: `出售采摘的灵草，换得<span class="event-highlight">灵石</span>若干。`, dAttr: { wealth: rnd(55, 110) } },
];

// ===== 炼气期坏事事件（修为/财富/寿元）=====
const lianqiBadEvents = [
  // 寿元坏事（4个）
  { text: `不慎食用<span class="event-highlight">毒草</span>，虽保住性命但根基受损，寿元有损。`, dAttr: { cultivation: -rnd(12, 25), lifespan: -5 } },
  { text: `夜间修炼时被<span class="event-highlight">阴魂缠身</span>，虽逃脱但本源受损。`, dAttr: { cultivation: -rnd(8, 20), lifespan: -8 } },
  { text: `误入<span class="event-highlight">寒潭</span>，寒气入体，留下暗疾。`, dAttr: { cultivation: -rnd(10, 18), lifespan: -6 } },
  { text: `服用劣质丹药，毒素淤积<span class="event-highlight">经脉</span>，寿元受损。`, dAttr: { cultivation: -rnd(15, 25), lifespan: -7 } },
  // 修为坏事（4个）
  { text: `修炼时心浮气躁，真气岔行，修为倒退。`, dAttr: { cultivation: -rnd(12, 25) } },
  { text: `购买的丹药品质低劣，服用后伤及经脉。`, dAttr: { cultivation: -rnd(15, 30) } },
  { text: `露宿荒野时被毒虫叮咬，数日无法修炼。`, dAttr: { cultivation: -rnd(10, 20) } },
  { text: `被人欺骗购买假灵符，使用时对自身照成伤害。`, dAttr: { cultivation: -rnd(8, 15) } },
  // 财富坏事（3个）好事一半：30-75
  { text: `出门在外遭遇劫匪，身上的灵石被洗劫一空。`, dAttr: { wealth: -rnd(30, 60) } },
  { text: `炼丹失败，浪费了大量灵材。`, dAttr: { wealth: -rnd(35, 70) } },
  { text: `帮人捎带物品却不慎遗失，赔偿后身无分文。`, dAttr: { wealth: -rnd(40, 75) } },
];

// ===== 筑基期好事事件（修为/财富/寿元）=====
// 基础财富126，修为中间值8000
const zhujiGoodEvents = [
  // 寿元好事（1个）
  { text: `在一处<span class="event-highlight">延寿福地</span>闭关修炼，天地元气滋养肉身，寿元大增。`, dAttr: { cultivation: rnd(400, 800), lifespan: 20 } },
  // 修为好事（4个）
  { text: `参加宗门举办的论道大会，听前辈讲解修炼心得，茅塞顿开。`, dAttr: { cultivation: rnd(400, 800) } },
  { text: `偶入前辈洞府遗迹，获得前人遗留的修炼心得。`, dAttr: { cultivation: rnd(500, 1000) } },
  { text: `为宗门立下小功，获赐珍贵灵材辅助修炼。`, dAttr: { cultivation: rnd(450, 900) } },
  { text: `在秘境试炼中表现优异，获得大量修炼资源。`, dAttr: { cultivation: rnd(550, 1100) } },
  // 财富好事（7个）基础126×2-5倍=252-630
  { text: `外出历练时，在一处古迹中获得<span class="event-highlight">筑基丹</span>，换取大量灵石。`, dAttr: { wealth: rnd(252, 500) } },
  { text: `帮助同门渡过难关，师兄赠予灵石与丹药以作答谢。`, dAttr: { wealth: rnd(280, 560) } },
  { text: `在坊市淘宝时，慧眼识珠低价购得上品灵石。`, dAttr: { wealth: rnd(300, 600) } },
  { text: `路见不平拔刀相助，被救者赠予<span class="event-highlight">灵器碎片</span>。`, dAttr: { wealth: rnd(320, 630) } },
  { text: `完成宗门悬赏任务，获得丰厚<span class="event-highlight">灵石奖励</span>。`, dAttr: { wealth: rnd(280, 550) } },
  { text: `炼制丹药成功，品质上乘卖出高价。`, dAttr: { wealth: rnd(300, 580) } },
  { text: `发现一处隐蔽的小型灵矿，开采获得<span class="event-highlight">灵石</span>。`, dAttr: { wealth: rnd(260, 520) } },
];

// ===== 筑基期坏事事件（修为/财富/寿元）=====
const zhujiBadEvents = [
  // 寿元坏事（4个）
  { text: `炼器时<span class="event-highlight">器炉爆炸</span>，火焰灼伤肺腑，寿元受损。`, dAttr: { cultivation: -rnd(200, 400), lifespan: -10 } },
  { text: `修炼时遭<span class="event-highlight">心魔反噬</span>，虽侥幸度过但本源受损。`, dAttr: { cultivation: -rnd(150, 350), lifespan: -12 } },
  { text: `被<span class="event-highlight">邪气入体</span>，侵蚀脏腑，虽驱逐大半但仍留暗疾。`, dAttr: { cultivation: -rnd(180, 400), lifespan: -15 } },
  { text: `修炼时遭<span class="event-highlight">走火入魔</span>，经脉逆转，寿元大损。`, dAttr: { cultivation: -rnd(250, 500), lifespan: -18 } },
  // 修为坏事（4个）
  { text: `外出历练遭遇高阶妖兽，险象环生，身受重伤，修为停滞。`, dAttr: { cultivation: -rnd(200, 400) } },
  { text: `探险古墓时触发机关，被困数月才脱困，修为倒退。`, dAttr: { cultivation: -rnd(250, 500) } },
  { text: `炼制丹药失败，炸炉伤人，反噬严重。`, dAttr: { cultivation: -rnd(180, 350) } },
  { text: `修炼时被心魔入侵，神识受损，修为倒退。`, dAttr: { cultivation: -rnd(220, 450) } },
  // 财富坏事（3个）好事一半：126-315
  { text: `被同门师兄设计陷害，损失大量灵石。`, dAttr: { wealth: -rnd(126, 250) } },
  { text: `被人以假丹药骗取多年积蓄。`, dAttr: { wealth: -rnd(140, 280) } },
  { text: `替人出头得罪了内门弟子，被敲诈勒索。`, dAttr: { wealth: -rnd(150, 300) } },
];

// ===== 金丹期好事事件（修为/财富/寿元）=====
// 基础财富525，修为中间值82500
const jindanGoodEvents = [
  // 寿元好事（1个）
  { text: `服用一株<span class="event-highlight">万年灵芝</span>，肉身得到洗礼，寿元大增。`, dAttr: { cultivation: rnd(4125, 8250), lifespan: 50 } },
  // 修为好事（4个）
  { text: `参加修仙界盛大的拍卖会，竞拍到一株珍贵灵药，修为大涨。`, dAttr: { cultivation: rnd(4125, 8250) } },
  { text: `在天地灵气充沛之地闭关，感应天地法则，修炼事半功倍。`, dAttr: { cultivation: rnd(4500, 9000) } },
  { text: `在一处上古遗迹中获得<span class="event-highlight">金丹期前辈的修炼心得</span>。`, dAttr: { cultivation: rnd(5000, 10000) } },
  { text: `受邀参加大宗门讲道，聆听元婴长老传法，心境大进。`, dAttr: { cultivation: rnd(5500, 11000) } },
  // 财富好事（7个）基础525×2-5倍=1050-2625
  { text: `救治一位垂死的大人物，获得丰厚报酬与珍贵灵材。`, dAttr: { wealth: rnd(1050, 2100) } },
  { text: `炼制丹药大获成功，品质超出预期，卖得高价。`, dAttr: { wealth: rnd(1200, 2400) } },
  { text: `发现一处无人知晓的微型灵脉，开采后收益颇丰。`, dAttr: { wealth: rnd(1300, 2600) } },
  { text: `收下一位天资不凡的弟子，弟子进献孝敬。`, dAttr: { wealth: rnd(1400, 2800) } },
  { text: `受邀主持一场拍卖会，获得高额<span class="event-highlight">佣金</span>。`, dAttr: { wealth: rnd(1100, 2200) } },
  { text: `发现前人遗留的<span class="event-highlight">藏宝图</span>，挖掘后收获大量灵石。`, dAttr: { wealth: rnd(1250, 2500) } },
  { text: `为大势力解决难题，获得<span class="event-highlight">灵石</span>与灵材作为酬谢。`, dAttr: { wealth: rnd(1350, 2700) } },
];

// ===== 金丹期坏事事件（修为/财富/寿元）=====
const jindanBadEvents = [
  // 寿元坏事（4个）
  { text: `金丹修炼时遭遇<span class="event-highlight">丹碎之危</span>，虽勉强保住金丹但本源大损，寿元锐减。`, dAttr: { cultivation: -rnd(2000, 4100), lifespan: -25 } },
  { text: `运行周天时<span class="event-highlight">功法失控</span>，虽侥幸存活但根基重创。`, dAttr: { cultivation: -rnd(1800, 3600), lifespan: -30 } },
  { text: `被<span class="event-highlight">魔道大能</span>追杀，元气大伤，寿元流逝。`, dAttr: { cultivation: -rnd(2500, 5000), lifespan: -35 } },
  { text: `闭关时<span class="event-highlight">神识反噬</span>，识海受损，寿元大减。`, dAttr: { cultivation: -rnd(2200, 4500), lifespan: -28 } },
  // 修为坏事（4个）
  { text: `被敌对势力设下圈套，丹田受损，修为倒退。`, dAttr: { cultivation: -rnd(2000, 4100) } },
  { text: `误入禁地，被上古阵法困住数十年才脱困。`, dAttr: { cultivation: -rnd(2500, 5000) } },
  { text: `修炼时被心魔大举入侵，差点走火入魔。`, dAttr: { cultivation: -rnd(1800, 3600) } },
  { text: `被人暗下慢性毒药，修为逐渐倒退。`, dAttr: { cultivation: -rnd(2200, 4500) } },
  // 财富坏事（3个）好事一半：525-1312
  { text: `得罪了不该得罪的势力，遭到追杀，损失惨重。`, dAttr: { wealth: -rnd(525, 1050) } },
  { text: `炼制高阶丹药时丹炉爆炸，损失大量灵材。`, dAttr: { wealth: -rnd(600, 1200) } },
  { text: `夺宝时遭遇埋伏，险些陨落。`, dAttr: { wealth: -rnd(650, 1300) } },
];

// ===== 元婴期好事事件（修为/财富/寿元）=====
// 基础财富2184，修为中间值700000
const yuanyingGoodEvents = [
  // 寿元好事（1个）
  { text: `服用<span class="event-highlight">真龙之血</span>沐浴肉身，脱胎换骨，寿元暴涨。`, dAttr: { cultivation: rnd(35000, 70000), lifespan: 100 } },
  // 修为好事（4个）
  { text: `受到超级势力邀请参加<span class="event-highlight">仙道大会</span>，结识各方强者，获益匪浅。`, dAttr: { cultivation: rnd(35000, 70000) } },
  { text: `在一处远古遗迹中发现<span class="event-highlight">元婴期修士的传承</span>。`, dAttr: { cultivation: rnd(40000, 80000) } },
  { text: `在天地交汇之地感悟大道，修炼如有神助。`, dAttr: { cultivation: rnd(45000, 90000) } },
  { text: `发现一处沉睡的灵脉，开采后修为大涨。`, dAttr: { cultivation: rnd(50000, 100000) } },
  // 财富好事（7个）基础2184×2-5倍=4368-10920
  { text: `天降祥瑞，各方势力纷纷前来朝贡。`, dAttr: { wealth: rnd(4368, 8736) } },
  { text: `受邀为一国之师，受万民供奉，资源滚滚而来。`, dAttr: { wealth: rnd(5000, 10000) } },
  { text: `炼制出极品丹药，引起轰动，各方势力争相求购。`, dAttr: { wealth: rnd(5500, 11000) } },
  { text: `救治一位即将陨落的元婴真君，获得其报酬。`, dAttr: { wealth: rnd(6000, 12000) } },
  { text: `开辟新的<span class="event-highlight">灵脉资源</span>，开采后收益巨大。`, dAttr: { wealth: rnd(5000, 10000) } },
  { text: `受邀讲道，各方势力纷纷<span class="event-highlight">馈赠</span>。`, dAttr: { wealth: rnd(5500, 10500) } },
  { text: `发现一处<span class="event-highlight">上古遗迹</span>，从中获得大量珍稀灵材。`, dAttr: { wealth: rnd(6000, 11500) } },
];

// ===== 元婴期坏事事件（修为/财富/寿元）=====
const yuanyingBadEvents = [
  // 寿元坏事（4个）
  { text: `元婴修炼时<span class="event-highlight">元婴不稳</span>，险些溃散，损耗大量本源精华。`, dAttr: { cultivation: -rnd(17500, 35000), lifespan: -50 } },
  { text: `渡<span class="event-highlight">天罚之劫</span>时遭遇不祥，寿元被天道削减。`, dAttr: { cultivation: -rnd(20000, 40000), lifespan: -60 } },
  { text: `被<span class="event-highlight">天道反噬</span>，修炼太快引来了天道的惩罚。`, dAttr: { cultivation: -rnd(25000, 50000), lifespan: -70 } },
  { text: `元婴<span class="event-highlight">被邪念侵蚀</span>，虽以大法力驱逐，但寿元大损。`, dAttr: { cultivation: -rnd(22500, 45000), lifespan: -55 } },
  // 修为坏事（4个）
  { text: `被超级势力的强者随手一击重伤，修为大损。`, dAttr: { cultivation: -rnd(17500, 35000) } },
  { text: `闭关时遭人暗算，丹田出现裂痕。`, dAttr: { cultivation: -rnd(20000, 40000) } },
  { text: `探索禁忌之地时被上古邪物侵蚀，需闭关驱邪。`, dAttr: { cultivation: -rnd(22500, 45000) } },
  { text: `修炼时神识被邪灵入侵，需闭关驱邪。`, dAttr: { cultivation: -rnd(25000, 50000) } },
  // 财富坏事（3个）- 元婴期大能级别的财富损失
  { text: `两大<span class="event-highlight">仙门大战</span>波及，你涉及其中，损失惨重。`, dAttr: { wealth: -rnd(6000, 12000) } },
  { text: `你的一座<span class="event-highlight">洞天福地</span>被天劫余波摧毁，无数年积攒的资源毁于一旦。`, dAttr: { wealth: -rnd(7000, 14000) } },
  { text: `无意中触动了<span class="event-highlight">上古禁制</span>，触发天道法则反噬，需赔偿巨额灵石以平息因果。`, dAttr: { wealth: -rnd(5000, 10000) } },
];

// ===== 商店事件系统 =====
// 基础财富数值
const BASE_WEALTH = [30, 126, 525, 2184, 9084]; // 炼气、筑基、金丹、元婴、化神

// 丹药事件数据结构
const pillShopEvents = [
  {
    shopId: 'pill_shop_lianqi',
    shopType: 'pill',
    realmIndex: 0,
    title: '💊 丹药铺',
    desc: '一间弥漫着药香的小店，货架上摆满了各种灵丹妙药。',
    itemDesc: '丹药铺中出售适合炼气期修士服用的修炼丹药。'
  },
  {
    shopId: 'pill_shop_zhuji',
    shopType: 'pill',
    realmIndex: 1,
    title: '💊 丹房',
    desc: '一间布置精致的丹房，炼丹炉中火焰熊熊。',
    itemDesc: '丹房中出售适合筑基期修士服用的修炼丹药。'
  },
  {
    shopId: 'pill_shop_jindan',
    shopType: 'pill',
    realmIndex: 2,
    title: '💊 天丹阁',
    desc: '修仙界著名的丹药阁，每一颗丹药都价值连城。',
    itemDesc: '天丹阁中出售适合金丹期修士服用的修炼丹药。'
  },
  {
    shopId: 'pill_shop_yuanying',
    shopType: 'pill',
    realmIndex: 3,
    title: '💊 仙丹楼',
    desc: '专营高阶丹药的仙丹楼，守卫森严。',
    itemDesc: '仙丹楼中出售适合元婴期修士服用的修炼丹药。'
  }
];

// 商店事件触发次数上限
const SHOP_MAX_TRIGGERS = 3;

// 获取商店门槛（3倍基础财富）
function getShopThreshold(realmIndex) {
  return BASE_WEALTH[realmIndex] * 3;
}

// 获取商店物品售价
function getShopItemPrice(realmIndex, rarity) {
  const base = BASE_WEALTH[realmIndex];
  const multipliers = { common: 2, uncommon: 4, rare: 8 };
  return base * (multipliers[rarity] || 2);
}

// 商店事件数据结构
// shopType: 'technique' 功法商店, 'treasure' 法宝商店
// itemRarities: 可售卖的品质数组
const shopEvents = [
  // ===== 炼气期商店 =====
  {
    shopId: 'shop_lianqi_technique',
    shopType: 'technique',
    realmIndex: 0,
    itemRarities: ['common', 'uncommon', 'rare'],
    title: '📚 功法铺',
    desc: '一间朴素的功法铺，货架上陈列着各种入门功法。',
    itemDesc: '功法铺中陈列着几本适合炼气期的功法秘籍。'
  },
  {
    shopId: 'shop_lianqi_treasure',
    shopType: 'treasure',
    realmIndex: 0,
    itemRarities: ['common', 'uncommon', 'rare'],
    title: '🗡️ 法器店',
    desc: '一家小小的法器店，陈列着各式各样的入门法器。',
    itemDesc: '法器店中摆放着几件适合炼气期的法器灵宝。'
  },
  // ===== 筑基期商店 =====
  {
    shopId: 'shop_zhuji_technique',
    shopType: 'technique',
    realmIndex: 1,
    itemRarities: ['common', 'uncommon', 'rare'],
    title: '📚 功法阁',
    desc: '一座三层高的功法阁，内有无数功法典籍。',
    itemDesc: '功法阁中收藏着几部适合筑基期的功法秘籍。'
  },
  {
    shopId: 'shop_zhuji_treasure',
    shopType: 'treasure',
    realmIndex: 1,
    itemRarities: ['common', 'uncommon', 'rare'],
    title: '🗡️ 法宝斋',
    desc: '一家装潢考究的法宝斋，专营各类法器灵宝。',
    itemDesc: '法宝斋中陈列着几件适合筑基期的法宝灵宝。'
  },
  // ===== 金丹期商店 =====
  {
    shopId: 'shop_jindan_technique',
    shopType: 'technique',
    realmIndex: 2,
    itemRarities: ['common', 'uncommon', 'rare'],
    title: '📚 天机殿',
    desc: '修仙界著名的天机殿，收藏无数珍贵功法典籍。',
    itemDesc: '天机殿中存放着几部适合金丹期的功法秘籍。'
  },
  {
    shopId: 'shop_jindan_treasure',
    shopType: 'treasure',
    realmIndex: 2,
    itemRarities: ['common', 'uncommon', 'rare'],
    title: '🗡️ 万宝楼',
    desc: '修仙界最大的法宝交易所，万宝楼中应有尽有。',
    itemDesc: '万宝楼中展示着几件适合金丹期的法宝灵宝。'
  },
  // ===== 元婴期商店 =====
  {
    shopId: 'shop_yuanying_technique',
    shopType: 'technique',
    realmIndex: 3,
    itemRarities: ['common', 'uncommon', 'rare'],
    title: '📚 道藏阁',
    desc: '收藏上古功法的道藏阁，每一部典籍都价值连城。',
    itemDesc: '道藏阁中珍藏着几部适合元婴期的功法秘籍。'
  },
  {
    shopId: 'shop_yuanying_treasure',
    shopType: 'treasure',
    realmIndex: 3,
    itemRarities: ['common', 'uncommon', 'rare'],
    title: '🗡️ 仙珍坊',
    desc: '专营仙级法宝的仙珍坊，出入皆是大能之辈。',
    itemDesc: '仙珍坊中陈列着几件适合元婴期的法宝灵宝。'
  }
];

// 根据境界获取可用商店事件（检查触发次数和财富门槛）
function getAvailableShopEvents(realmIndex, wealth, triggeredShops) {
  return shopEvents.filter(shop => {
    // 检查境界匹配
    if (shop.realmIndex !== realmIndex) return false;
    // 检查是否已触发上限
    const triggerCount = triggeredShops[shop.shopId] || 0;
    if (triggerCount >= SHOP_MAX_TRIGGERS) return false;
    return true;
  });
}

// 各境界突发事件（基于NUMERIC_DESIGN.md数值设计）
const emergencyEvents = [
  // ===== 炼气期突发事件 =====
  {
    title: '野兽袭击',
    desc: '夜幕降临，你正在山洞中打坐调息，忽然感应到一股腥风扑面而来。睁眼一看，一头双目赤红的野兽正从洞口扑来，獠牙上滴着粘稠的涎水。',
    realmRange: [0, 0],
    outcomes: [
      { desc: '你冷哼一声，周身灵力涌动，一掌将其毙命。从野兽巢穴中发现了些许灵石和灵草。', requires: { power: 500 }, dAttr: { cultivation: rnd(25, 50), wealth: rnd(60, 150) } },
      { desc: '你借助气运之力和灵活的走位成功摆脱野兽追击，并在逃跑途中意外发现一株百年灵芝。', requires: { luck: 130 }, dAttr: { wealth: rnd(30, 75) } },
      { desc: '野兽锋利的爪牙在你身上留下数道深可见骨的伤口，丹田中灵力紊乱，根基受损。', requires: {}, dAttr: { cultivation: -rnd(25, 50), wealth: -rnd(30, 75), lifespan: -rnd(3, 5) } },
    ]
  },
  {
    title: '悬崖采药',
    desc: '你听闻某处悬崖峭壁上生有一株罕见的灵药，便冒险攀爬上去。然而脚下的岩石突然松动，你的身形失去平衡，向着万丈深渊坠去。',
    realmRange: [0, 0],
    outcomes: [
      { desc: '危急时刻你展现出惊人的天赋，在下坠过程中猛然领悟借力之法，借着崖壁上的藤蔓稳住了身形。定睛一看，旁边正有一株千年灵芝！', requires: { talent: 140 }, dAttr: { cultivation: rnd(50, 100), talent: rnd(5, 10) } },
      { desc: '你命不该绝，被冲到下游的一处隐蔽山谷中。谷中竟然有一座前辈遗留的洞府，虽然阵法已失效，但仍有不少灵石遗存。', requires: { luck: 135 }, dAttr: { wealth: rnd(60, 150) } },
      { desc: '你重重摔落在地，体内骨骼碎裂多处，虽然勉强保住性命，但修炼根基已受重创。', requires: {}, dAttr: { cultivation: -rnd(25, 50), lifespan: -rnd(3, 5) } },
    ]
  },
  {
    title: '邪修伏击',
    desc: '归途中你察觉到背后有人跟踪，猛然回头，只见一名浑身笼罩在黑雾中的修士正缓缓逼近。他是这一带有名的邪修，专门截杀落单的修士。',
    realmRange: [0, 0],
    outcomes: [
      { desc: '你眼中有寒光一闪，周身气势爆发，先发制人将其击退。在他仓皇逃窜的储物袋中，你发现了大量抢夺来的灵石。', requires: { power: 480 }, dAttr: { cultivation: rnd(30, 60), wealth: rnd(80, 160) } },
      { desc: '就在邪修即将出手的刹那，天边忽然雷云密布雷劫降临，他不得不分心防御。你趁机逃脱，并顺手取走了他来不及收走的财物。', requires: { luck: 140 }, dAttr: { wealth: rnd(100, 200) } },
      { desc: '你寡不敌众，被邪修炼化为丹，修为倒退，元气大伤。', requires: {}, dAttr: { cultivation: -rnd(40, 80), wealth: -rnd(50, 100), lifespan: -rnd(5, 10) } },
    ]
  },
  {
    title: '瘴气迷阵',
    desc: '为了抄近路，你走进了一片密林。然而林中弥漫着淡淡的青紫色雾气，你意识到这是传说中的毒瘴。正欲退走，却发现来路已被雾气淹没。',
    realmRange: [0, 0],
    outcomes: [
      { desc: '你天资卓绝，迅速洞察了瘴气的流动规律，在瘴气中找到了一条安全通道。更妙的是，你在瘴气源头发现了一株万毒之王——七彩灵芝！', requires: { talent: 145 }, dAttr: { cultivation: rnd(20, 40), lifespan: rnd(5, 10) } },
      { desc: '你的气运在此刻发挥了作用，一阵清风恰好吹散了前方的毒雾，你发现路边竟然长满了疗伤圣品——九叶青莲。', requires: { luck: 130 }, dAttr: { wealth: rnd(40, 100) } },
      { desc: '你吸入过多瘴气中毒，虽然用尽手段逼出毒素，但修为仍倒退不少，寿元也因此减少。', requires: {}, dAttr: { cultivation: -rnd(30, 60), lifespan: -rnd(5, 10) } },
    ]
  },
  {
    title: '山洪暴发',
    desc: '连日暴雨引发山洪，汹涌的洪水裹挟着巨石倾泻而下。你正在山谷中修炼，眨眼间便被卷入洪流之中，四周尽是咆哮的水声和飞溅的泥沙。',
    realmRange: [0, 0],
    outcomes: [
      { desc: '你运起全身灵力，在洪水中劈开一条通道，稳稳落在安全之处。洪水退去后，你发现河床上散落着不少被冲出的灵石。', requires: { power: 520 }, dAttr: { cultivation: rnd(15, 30), wealth: rnd(50, 100) } },
      { desc: '冥冥之中似有天意，洪水将你冲到了一处隐蔽的地下溶洞，里面竟然藏有一座前人遗留的宝库！', requires: { luck: 125 }, dAttr: { wealth: rnd(80, 160) } },
      { desc: '洪水的冲击力太过强大，你的身体多处被撞击骨折，丹田也受到震荡，修为倒退。', requires: {}, dAttr: { cultivation: -rnd(20, 40), lifespan: -rnd(3, 8) } },
    ]
  },

  // ===== 筑基期突发事件 =====
  {
    title: '妖兽拦路',
    desc: '一头足有丈许高的妖兽横亘在山道中央，它浑身覆盖着漆黑的鳞甲，双目如两团幽火死死盯着你。这是一头已经筑基成功的妖兽，正处于饥饿状态的它将你视为送上门的猎物。',
    realmRange: [1, 1],
    outcomes: [
      { desc: '你周身灵力激荡，与妖兽展开激战。凭借强横的实力，你将其斩于掌下。从妖兽腹中取出一枚散发幽光的妖丹，其价值不可估量。', requires: { power: 8000 }, dAttr: { cultivation: rnd(400, 1100), wealth: rnd(252, 630) } },
      { desc: '就在妖兽扑向你的瞬间，天边忽然金光大盛，一道天地异象惊退了妖兽。你借机搜刮了妖兽守护的一处灵矿，满载而归。', requires: { luck: 155 }, dAttr: { cultivation: rnd(200, 550), wealth: rnd(252, 420) } },
      { desc: '妖兽的利爪撕裂了你的护体灵光，在你身上留下深可见骨的伤口。勉强逃脱后，你发现根基已受重创。', requires: {}, dAttr: { cultivation: -rnd(400, 1100), wealth: -rnd(126, 315), lifespan: -rnd(8, 15) } },
    ]
  },
  {
    title: '古修洞府',
    desc: '你在一座荒山的山腹中发现了一处被藤蔓遮蔽的隐秘洞口。洞口处的禁制已经残破不堪，从残留的符文来看，这里曾是一位金丹期古修的修炼之所。',
    realmRange: [1, 1],
    outcomes: [
      { desc: '你天资过人，竟然看懂了洞府中残留的功法残篇。功法奥义涌入识海，你的修炼天赋也随之提升。', requires: { talent: 165 }, dAttr: { cultivation: rnd(800, 2200), talent: rnd(3, 8) } },
      { desc: '你以蛮力破解了残余的禁制，在洞府深处发现了古修遗留的部分宝物。', requires: { power: 7500 }, dAttr: { wealth: rnd(500, 1000) } },
      { desc: '洞府中残存的禁制突然激活，无数飞针向你激射而来。你虽然逃脱，但被困洞中数日，修为大损。', requires: {}, dAttr: { cultivation: -rnd(600, 1200), lifespan: -rnd(8, 15) } },
    ]
  },
  {
    title: '邪修追杀',
    desc: '你无意间撞破了一名邪修正在行凶灭口的场面。他发现你后立刻追杀而来，周身散发着令人作呕的血腥气息。这名邪修修为与你相当，但手中却握着一件诡异的邪器。',
    realmRange: [1, 1],
    outcomes: [
      { desc: '你当机立断，先发制人。在一番激战后，你将邪修斩于剑下，并缴获了他的储物袋和那件邪器。', requires: { power: 8500 }, dAttr: { cultivation: rnd(500, 1300), wealth: rnd(400, 800) } },
      { desc: '你施展遁术逃离，邪修紧追不舍。却在逃跑途中，你发现了一处秘密藏宝地点，所得颇丰。', requires: { luck: 160 }, dAttr: { wealth: rnd(600, 1200) } },
      { desc: '你寡不敌众，被邪修以邪器击伤。虽侥幸逃脱，但已被他种下魔种，修为大损，寿元也受到侵蚀。', requires: {}, dAttr: { cultivation: -rnd(500, 1000), wealth: -rnd(252, 630), lifespan: -rnd(10, 20) } },
    ]
  },
  {
    title: '遗迹陷阱',
    desc: '你在一处上古遗迹的入口处发现了一扇刻满符文的石门。正当你伸手触碰时，石门上的符文突然亮起——这是一道防御机关，无数利刃从墙壁中激射而出。',
    realmRange: [1, 1],
    outcomes: [
      { desc: '你反应迅速，周身灵力化作护盾挡下所有利刃。随后破解了机关核心，在其中发现了上古修士遗留的宝物。', requires: { power: 8500 }, dAttr: { cultivation: rnd(800, 2200), wealth: rnd(400, 800) } },
      { desc: '机关似乎感应到你的气运与众不同，利刃的轨迹诡异地避开了你。你趁机深入遗迹核心，发现了珍贵的宝物。', requires: { luck: 155 }, dAttr: { wealth: rnd(500, 1000) } },
      { desc: '机关的攻击太过密集，你的护体灵光被击破，身上多了数十道伤口。勉强触发石门打开后，你已身受重伤。', requires: {}, dAttr: { cultivation: -rnd(600, 1500), lifespan: -rnd(8, 15) } },
    ]
  },
  {
    title: '地火爆发',
    desc: '你在一处地底溶洞中修炼，忽然感到脚下传来剧烈的震动。滚烫的岩浆从裂缝中喷涌而出，炙热的气息扑面而来，周围的石壁开始融化。',
    realmRange: [1, 1],
    outcomes: [
      { desc: '你运起全身灵力，硬生生在地火中劈开一条安全通道。在躲避地火的过程中，你借助火元气淬炼了肉身，并趁机挖掘了珍贵的火系矿石。', requires: { power: 7800 }, dAttr: { cultivation: rnd(400, 1100), wealth: rnd(100, 250) } },
      { desc: '就在地火即将吞没你的瞬间，溶洞上方突然崩塌，露出了一个隐秘的矿脉。你趁机挖掘了不少珍贵的火系矿石。', requires: { luck: 150 }, dAttr: { wealth: rnd(400, 800) } },
      { desc: '地火的温度远超你的想象，虽然你拼命逃离，但双脚仍被严重灼伤，修为倒退。', requires: {}, dAttr: { cultivation: -rnd(400, 800), lifespan: -rnd(8, 12) } },
    ]
  },
  {
    title: '灵根觉醒',
    desc: '在一处灵气充沛的灵池中沐浴时，你感到体内的灵根开始躁动。这种感觉极其奇妙，仿佛有什么东西即将觉醒...',
    realmRange: [1, 1],
    outcomes: [
      { desc: '你的灵根彻底觉醒！一股磅礴的灵气涌入你的体内，你的修炼天赋大增，对天地灵气的感应更加敏锐。', requires: { talent: 105 }, dAttr: { talent: rnd(5, 10), luck: rnd(3, 6) } },
      { desc: '你的灵根只是部分觉醒，但仍然获得了可观的提升。天地灵气对你的亲和力增强。', requires: { luck: 95 }, dAttr: { talent: rnd(2, 5), luck: rnd(2, 4) } },
      { desc: '灵根觉醒失败，你的身体受到了一定反噬。', requires: {}, dAttr: { talent: -rnd(1, 3), luck: -rnd(1, 2) } },
    ]
  },

  // ===== 金丹期突发事件 =====
  {
    title: '大妖袭击',
    desc: '一只已经金丹大成的妖兽循着你的气息找到了你。它通体赤红，背生双翼，口中喷出的火焰将周围的草木化为灰烬。这是一只真正的金丹期大妖，实力深不可测。',
    realmRange: [2, 2],
    outcomes: [
      { desc: '你与妖兽展开惊天大战，最终凭借强横的实力将其斩杀。你从妖兽体内取出一枚散发灼热气息的金丹，以及一身的珍贵材料。', requires: { power: 82500 }, dAttr: { cultivation: rnd(4125, 11000), wealth: rnd(1050, 2800) } },
      { desc: '就在妖兽即将发动致命一击时，天边忽然雷云密布，妖兽感应到天劫将至，不得不放弃追杀仓皇逃窜。你趁机搜刮了它的巢穴。', requires: { luck: 175 }, dAttr: { wealth: rnd(1050, 2100) } },
      { desc: '你与大妖激战良久，最终还是不敌。金丹期的妖兽在你身上留下难以愈合的伤口，你的修为因此倒退。', requires: {}, dAttr: { cultivation: -rnd(4125, 11000), wealth: -rnd(525, 1400), lifespan: -rnd(12, 25) } },
    ]
  },
  {
    title: '秘境探险',
    desc: '你在一处深山中发现了上古大能开辟的秘境入口。秘境中灵气浓郁，隐约可见亭台楼阁的轮廓。但入口处的禁制散发着危险的气息，似乎在警告闯入者。',
    realmRange: [2, 2],
    outcomes: [
      { desc: '你天赋卓绝，竟然在短时间内参悟了部分禁制的奥义。你深入秘境，领悟了上古大能留下的大道真意，修为突飞猛进。', requires: { talent: 185 }, dAttr: { cultivation: rnd(8250, 22000), talent: rnd(5, 10) } },
      { desc: '你以蛮力破解了部分禁制，虽然触发了防御机制，但仍然成功取走了部分宝物。', requires: { power: 75000 }, dAttr: { wealth: rnd(2100, 4200) } },
      { desc: '秘境中的自毁阵法被触发，你被困其中。虽然最终逃出，但已被困数月，根基受损严重。', requires: {}, dAttr: { cultivation: -rnd(6600, 16500), lifespan: -rnd(15, 25) } },
    ]
  },
  {
    title: '丹毒爆发',
    desc: '你此前服用的丹药中潜藏的丹毒在这一刻突然爆发。一股灼热的毒素从丹田向四肢百骸蔓延，你能感受到金丹在剧烈震颤，似乎随时可能碎裂。',
    realmRange: [2, 2],
    outcomes: [
      { desc: '你运转全身灵力，试图压制丹毒。竟在过程中与毒素形成奇异的平衡，借此机会淬炼了肉身和金丹，修为大涨！', requires: { power: 88000 }, dAttr: { cultivation: rnd(10000, 27500), lifespan: rnd(10, 25) } },
      { desc: '就在丹毒即将失控之际，你的气运发挥了作用。天地间忽然降下一场灵雨，将你体内的丹毒化解大半，还获得了意外领悟。', requires: { luck: 180 }, dAttr: { cultivation: rnd(6600, 16500) } },
      { desc: '丹毒彻底失控，在你体内肆虐。金丹表面出现裂痕，虽然最终勉强压制，但根基已受重创。', requires: {}, dAttr: { cultivation: -rnd(6600, 16500), lifespan: -rnd(20, 40) } },
    ]
  },
  {
    title: '势力追杀',
    desc: '你无意间得罪了一个强大的势力，他们派出数名金丹期高手追杀于你。这些人身着统一制服，阵法娴熟，显然是经过严格训练的杀手。',
    realmRange: [2, 2],
    outcomes: [
      { desc: '你与追杀者展开激战，凭借强横的实力逐一将其击败。从他们的储物袋中，你发现了大量宝物和情报。', requires: { power: 99000 }, dAttr: { cultivation: rnd(6600, 16500), wealth: rnd(3150, 6300) } },
      { desc: '你施展秘法遁入虚空，在逃跑途中意外发现了敌人的一处秘密营地。趁他们追杀你之际，你将其营地中的宝物尽数搜刮。', requires: { luck: 175 }, dAttr: { wealth: rnd(4200, 8400) } },
      { desc: '你寡不敌众，被敌人重伤。虽然侥幸逃脱，但金丹已受创伤，修为大损。', requires: {}, dAttr: { cultivation: -rnd(8250, 22000), lifespan: -rnd(30, 60) } },
    ]
  },
  {
    title: '误入禁地',
    desc: '你在一处山谷中迷失方向，不知不觉走进了一片诡异的区域。这里的天地规则与外界不同，空气中弥漫着腐朽的气息，让人感到极度的不安。',
    realmRange: [2, 2],
    outcomes: [
      { desc: '你凭借过人的天赋，察觉到了禁地运转的规则漏洞。你顺着漏洞深入禁地核心，发现了上古仙人留下的机缘。', requires: { talent: 190 }, dAttr: { cultivation: rnd(10000, 25000), talent: rnd(8, 15) } },
      { desc: '就在你即将被禁地法则侵蚀之际，你的运气发挥了作用。禁地边缘的一株万年宝药散发出清香，驱散了周围的死气，你借机逃脱并采得宝药。', requires: { luck: 170 }, dAttr: { wealth: rnd(3500, 7000) } },
      { desc: '禁地的法则开始侵蚀你的身体，你感到生机在快速流逝。虽然最终逃出，但寿元已大减。', requires: {}, dAttr: { cultivation: -rnd(5500, 14000), lifespan: -rnd(20, 40) } },
    ]
  },
  {
    title: '顿悟天机',
    desc: '修炼之中，你忽感天地灵气变得无比清晰，仿佛有一扇通往天道的大门在眼前敞开。这种玄妙的感觉稍纵即逝...',
    realmRange: [2, 2],
    outcomes: [
      { desc: '你抓住了这次顿悟的机会！天道之门为你敞开，天机涌入你的识海。你的天赋大幅提升，对天道的理解也更加深刻。', requires: { talent: 115 }, dAttr: { talent: rnd(8, 15), luck: rnd(5, 10) } },
      { desc: '你虽然未能完全顿悟，但仍然抓住了部分天机。气运得到了提升。', requires: { luck: 105 }, dAttr: { luck: rnd(4, 8), talent: rnd(2, 4) } },
      { desc: '顿悟失败，你的精神受到一定损耗。', requires: {}, dAttr: { talent: -rnd(1, 3), luck: -rnd(1, 2) } },
    ]
  },

  // ===== 炼气期消耗型突发事件 =====
  {
    title: '灵药救命',
    desc: '你在探险中发现一株极为珍贵的<span class="event-highlight">九转灵芝</span>，但守护它的灵兽正在酣睡。灵芝的效用足以让你根基稳固，但你必须悄悄接近才能采撷。',
    realmRange: [0, 0],
    outcomes: [
      { desc: '你悄悄接近，成功采得灵芝。服下后根基稳固，修为大涨，但消耗了些许灵石。', requires: { wealth: 50 }, dAttr: { cultivation: rnd(60, 120), wealth: -50 } },
      { desc: '你的灵石不够请人帮忙守护，但灵兽被你惊醒。你拼死采得灵芝，却被灵兽反噬，寿元受损。', requires: { lifespan: 8 }, dAttr: { cultivation: rnd(50, 100), lifespan: -8 } },
      { desc: '你悄悄接近，却不慎惊醒灵兽。在逃跑时被追上，受了重伤。', requires: {}, dAttr: { cultivation: -rnd(25, 50), lifespan: -rnd(3, 6) } },
    ]
  },
  {
    title: '坊市淘宝',
    desc: '听闻坊市有一位神秘商人正在出售一件<span class="event-highlight">上古遗物</span>，吸引了不少修士围观。这件遗物对你修炼大有裨益，但商人对灵石情有独钟。',
    realmRange: [0, 0],
    outcomes: [
      { desc: '你豪掷灵石，将遗物收入囊中。遗物中蕴含的灵气让你的修为突飞猛进！', requires: { wealth: 100 }, dAttr: { cultivation: rnd(100, 180), wealth: -100 } },
      { desc: '灵石不够，你以自身寿元精华与商人交易。虽然寿元受损，但获得了遗物。', requires: { lifespan: 12 }, dAttr: { cultivation: rnd(80, 150), lifespan: -12 } },
      { desc: '你囊中羞涩，只能眼睁睁看着他人将遗物买走。', requires: {}, dAttr: { cultivation: -rnd(10, 20) } },
    ]
  },

  // ===== 筑基期消耗型突发事件 =====
  {
    title: '洞府争夺',
    desc: '你发现一处前人遗留的<span class="event-highlight">洞府遗迹</span>，内藏大量资源和功法。但洞府被阵法守护，需要以灵石为引才能开启。',
    realmRange: [1, 1],
    outcomes: [
      { desc: '你献上灵石开启阵法，进入洞府获得了前辈遗留的珍稀资源和功法残篇。', requires: { wealth: 200 }, dAttr: { cultivation: rnd(600, 1200), wealth: -200 } },
      { desc: '灵石不足，你以寿元为代价强行破阵。虽然进入洞府，但寿元有损。', requires: { lifespan: 15 }, dAttr: { cultivation: rnd(500, 1000), lifespan: -15 } },
      { desc: '破阵失败，被阵法反噬，身受重伤。', requires: {}, dAttr: { cultivation: -rnd(250, 500), lifespan: -rnd(8, 15) } },
    ]
  },
  {
    title: '灵丹换命',
    desc: '你得知有一位炼丹宗师正在出售<span class="event-highlight">神丹</span>，此丹不仅能延寿，更能稳固根基。但价格昂贵，或者你可以用自己的寿元精华交换。',
    realmRange: [1, 1],
    outcomes: [
      { desc: '你花费灵石购得丹药，服用后修为大涨，根基更加稳固。', requires: { wealth: 350 }, dAttr: { cultivation: rnd(1000, 1800), wealth: -350 } },
      { desc: '灵石不够，你以二十年寿元交换。虽然寿元减少，但修为突飞猛进。', requires: { lifespan: 20 }, dAttr: { cultivation: rnd(800, 1500), lifespan: -20 } },
      { desc: '你既无灵石也无足够寿元，只能放弃这次机缘。', requires: {}, dAttr: { cultivation: -rnd(200, 400) } },
    ]
  },

  // ===== 金丹期消耗型突发事件 =====
  {
    title: '仙府探险',
    desc: '你探知一处<span class="event-highlight">上古仙府</span>即将开启，内藏仙道机缘。但进入仙府需要献祭灵石作为开启费用，或者以寿元为代价叩开仙门。',
    realmRange: [2, 2],
    outcomes: [
      { desc: '你献上灵石叩开仙府大门，在其中获得了上古仙人的修炼心得和珍稀材料！', requires: { wealth: 1000 }, dAttr: { cultivation: rnd(12000, 25000), wealth: -1000 } },
      { desc: '灵石不够，你以四十年寿元为代价强行进入。虽然寿元有减，但收获颇丰。', requires: { lifespan: 40 }, dAttr: { cultivation: rnd(10000, 20000), lifespan: -40 } },
      { desc: '代价不够，被仙门反噬，根基受损。', requires: {}, dAttr: { cultivation: -rnd(4000, 10000), lifespan: -rnd(15, 30) } },
    ]
  },
  {
    title: '灵脉交易',
    desc: '你获悉一处<span class="event-highlight">微型灵脉</span>正在出售，灵脉中的灵气能让你修炼事半功倍。但价格高昂，或者你可以以自身寿元精华为代价换取。',
    realmRange: [2, 2],
    outcomes: [
      { desc: '你斥灵石购得灵脉开采权，修炼效率大增！', requires: { wealth: 1500 }, dAttr: { cultivation: rnd(15000, 30000), wealth: -1500 } },
      { desc: '灵石不足，你以五十年寿元交换。寿元虽减，但修为大涨。', requires: { lifespan: 50 }, dAttr: { cultivation: rnd(12000, 25000), lifespan: -50 } },
      { desc: '代价不足，交易失败，错失机缘。', requires: {}, dAttr: { cultivation: -rnd(3000, 8000) } },
    ]
  },

  // ===== 元婴期消耗型突发事件 =====
  {
    title: '天道交易',
    desc: '你在修炼中感应到<span class="event-highlight">天道法则</span>的一丝波动。一位神秘存在提出交易：献上灵石或寿元，可换取天道感悟的机会。',
    realmRange: [3, 3],
    outcomes: [
      { desc: '你献上灵石，获得天道感悟的机会。在法则之力的洗礼下，你的修为大涨！', requires: { wealth: 4000 }, dAttr: { cultivation: rnd(30000, 60000), wealth: -4000 } },
      { desc: '灵石不够，你以六十年寿元换取。寿元虽减，但修为有所精进！', requires: { lifespan: 60 }, dAttr: { cultivation: rnd(25000, 50000), lifespan: -60 } },
      { desc: '代价不足，天道不予回应，错失机缘。', requires: {}, dAttr: { cultivation: -rnd(15000, 40000) } },
    ]
  },
  {
    title: '仙缘求索',
    desc: '你得知一位<span class="event-highlight">隐世仙人</span>正在出售一份仙缘，蕴含着突破瓶颈的机缘。他接受灵石或寿元精华作为交换。',
    realmRange: [3, 3],
    outcomes: [
      { desc: '你豪掷灵石购得仙缘！其中的奥义让你的修为大涨！', requires: { wealth: 7000 }, dAttr: { cultivation: rnd(40000, 80000), wealth: -7000 } },
      { desc: '灵石不够，你以八十年寿元交换。寿元虽减，但修为有所提升！', requires: { lifespan: 80 }, dAttr: { cultivation: rnd(35000, 70000), lifespan: -80 } },
      { desc: '代价不足，仙人飘然而去，空留遗憾。', requires: {}, dAttr: { cultivation: -rnd(20000, 50000) } },
    ]
  },

  // ===== 炼气期天赋/气运型消耗事件 =====
  {
    title: '悟道古树',
    desc: '你在一处古迹中发现一棵传说中的<span class="event-highlight">悟道古树</span>，据说在其下打坐可大幅提升悟性。但古树被阵法守护，需要以灵石为引开启悟道机缘。',
    realmRange: [0, 0],
    outcomes: [
      { desc: '你献上灵石开启悟道阵法，在古树下参悟良久，天赋大增！', requires: { wealth: 40 }, dAttr: { talent: rnd(6, 12), wealth: -40 } },
      { desc: '灵石不足，你以八年寿元换取参悟机会。虽然寿元受损，但悟性大幅提升！', requires: { lifespan: 8 }, dAttr: { talent: rnd(5, 10), lifespan: -8 } },
      { desc: '代价不够，古树对你不予理会，你只能空手而归。', requires: {}, dAttr: { talent: -rnd(1, 3) } },
    ]
  },
  {
    title: '气运抽奖',
    desc: '一位神秘商人在坊市举办<span class="event-highlight">气运抽奖</span>活动，奖品是一枚能提升气运的<span class="event-highlight">转运珠</span>。但参与需要缴纳灵石，或者以寿元为赌注。',
    realmRange: [0, 0],
    outcomes: [
      { desc: '你豪掷灵石参与抽奖，幸运抽中转运珠！气运大增！', requires: { wealth: 60 }, dAttr: { luck: rnd(8, 16), wealth: -60 } },
      { desc: '灵石不够，你以十年寿元为赌注。竟然鸿运当头，中得大奖！', requires: { lifespan: 10 }, dAttr: { luck: rnd(10, 18), lifespan: -10 } },
      { desc: '你没有筹码参与抽奖，错失机缘。', requires: {}, dAttr: { luck: -rnd(2, 5) } },
    ]
  },

  // ===== 筑基期天赋/气运型消耗事件 =====
  {
    title: '天骄传承',
    desc: '你发现一处<span class="event-highlight">天骄遗迹</span>，据说是上古天骄陨落后留下的传承。接受传承需要献祭灵石作为拜师礼，或者以寿元为代价换取机缘。',
    realmRange: [1, 1],
    outcomes: [
      { desc: '你献上灵石获得传承资格，天骄的修炼心得让你的悟性大幅提升！', requires: { wealth: 250 }, dAttr: { talent: rnd(8, 14), luck: rnd(4, 8), wealth: -250 } },
      { desc: '灵石不足，你以二十年寿元换取传承。寿元受损，但收获颇丰！', requires: { lifespan: 20 }, dAttr: { talent: rnd(6, 12), luck: rnd(3, 6), lifespan: -20 } },
      { desc: '代价不够，传承之门紧闭，你只能黯然离去。', requires: {}, dAttr: { talent: -rnd(2, 5) } },
    ]
  },
  {
    title: '星辰赐福',
    desc: '在一处<span class="event-highlight">星辰祭坛</span>前，你感应到星辰之力的存在。祭坛接受灵石或寿元献祭，可换取星辰之力的洗礼。',
    realmRange: [1, 1],
    outcomes: [
      { desc: '你以灵石献祭，星辰之力涌入体内，气运大增！', requires: { wealth: 350 }, dAttr: { luck: rnd(10, 18), talent: rnd(4, 8), wealth: -350 } },
      { desc: '灵石不够，你以二十五年寿元换取星辰赐福。虽然寿元受损，但气运暴涨！', requires: { lifespan: 25 }, dAttr: { luck: rnd(12, 20), talent: rnd(3, 6), lifespan: -25 } },
      { desc: '献祭不足，星辰不予回应，你只能叹息离开。', requires: {}, dAttr: { luck: -rnd(3, 6) } },
    ]
  },

  // ===== 金丹期天赋/气运型消耗事件 =====
  {
    title: '天道残卷',
    desc: '你在拍卖会上发现一份<span class="event-highlight">天道残卷</span>，记载着上古大能参悟天道的心得。但价格昂贵，或者你可以用自己的寿元精华交换参悟资格。',
    realmRange: [2, 2],
    outcomes: [
      { desc: '你豪掷灵石购得残卷！其中的奥义让你的天赋和气运同时暴涨！', requires: { wealth: 1500 }, dAttr: { talent: rnd(10, 18), luck: rnd(8, 14), wealth: -1500 } },
      { desc: '灵石不够，你以四十年寿元换取参悟资格。寿元虽减，但收获极大！', requires: { lifespan: 40 }, dAttr: { talent: rnd(8, 14), luck: rnd(6, 12), lifespan: -40 } },
      { desc: '代价不够，残卷与你无缘。', requires: {}, dAttr: { talent: -rnd(3, 6) } },
    ]
  },
  {
    title: '命运长河',
    desc: '你在修炼中偶然触及<span class="event-highlight">命运长河</span>的边缘。命运长河接受献祭，可让你窥见一丝命运的轨迹。',
    realmRange: [2, 2],
    outcomes: [
      { desc: '你以灵石献祭，命运长河为你敞开，天机和气运同时涌入你的识海！', requires: { wealth: 2000 }, dAttr: { talent: rnd(12, 20), luck: rnd(10, 16), wealth: -2000 } },
      { desc: '灵石不足，你以五十年寿元为代价。寿元有减，但获得了命运的眷顾！', requires: { lifespan: 50 }, dAttr: { talent: rnd(10, 16), luck: rnd(8, 14), lifespan: -50 } },
      { desc: '献祭不够，命运长河不予以回应。', requires: {}, dAttr: { luck: -rnd(5, 10) } },
    ]
  },

  // ===== 元婴期天赋/气运型消耗事件 =====
  {
    title: '道祖遗迹',
    desc: '你在一处<span class="event-highlight">道祖遗迹</span>中发现了道祖留下的修炼感悟。这是直达大道的机缘，但需要献祭大量资源。',
    realmRange: [3, 3],
    outcomes: [
      { desc: '你献上灵石获得道祖认可！道祖的感悟让你的天赋和气运暴涨！', requires: { wealth: 5000 }, dAttr: { talent: rnd(14, 24), luck: rnd(12, 20), wealth: -5000 } },
      { desc: '灵石不够，你以七十年寿元换取机缘。寿元受损，但收获远超想象！', requires: { lifespan: 70 }, dAttr: { talent: rnd(12, 20), luck: rnd(10, 16), lifespan: -70 } },
      { desc: '代价不够，道祖不予理会，你只能望洋兴叹。', requires: {}, dAttr: { talent: -rnd(5, 10) } },
    ]
  },
  {
    title: '天机阁',
    desc: '你得知<span class="event-highlight">天机阁</span>正在出售一份天机秘卷，蕴含着窥探天机的奥义。天机阁接受灵石或寿元作为交换。',
    realmRange: [3, 3],
    outcomes: [
      { desc: '你斥灵石购得天机秘卷！其中奥义让你的气运和天赋大幅提升！', requires: { wealth: 8000 }, dAttr: { luck: rnd(16, 28), talent: rnd(12, 20), wealth: -8000 } },
      { desc: '灵石不足，你以九十年寿元交换。寿元虽减，但寿元精华换来的天机奥义远超常人，气运天赋暴涨！', requires: { lifespan: 90 }, dAttr: { luck: rnd(22, 38), talent: rnd(18, 32), lifespan: -90 } },
      { desc: '代价不够，天机阁不予以回应。', requires: {}, dAttr: { luck: -rnd(8, 15) } },
    ]
  },

  // ===== 元婴期突发事件 =====
  {
    title: '元婴妖兽',
    desc: '一只已经凝聚元婴的大妖盯上了你。它盘踞在一座灵山之上，方圆百里的灵气都被它吸纳入体。这是真正的元婴期妖兽，神通广大，已可化为人形。',
    realmRange: [3, 3],
    outcomes: [
      { desc: '你与元婴大妖展开惊天大战，天地为之变色。最终你以绝对实力将其斩杀，从其体内取出一枚散发耀眼光芒的元婴丹。', requires: { power: 700000 }, dAttr: { cultivation: rnd(17500, 50000), wealth: rnd(4368, 10920) } },
      { desc: '就在大妖即将出手的刹那，天劫降临。它不得不分心，你趁机搜刮了它的全部身家。', requires: { luck: 195 }, dAttr: { wealth: rnd(4368, 8736) } },
      { desc: '元婴期妖兽的实力远超你的想象，你被它重伤。虽然侥幸逃脱，但根基已受重创。', requires: {}, dAttr: { cultivation: -rnd(35000, 100000), wealth: -rnd(2184, 6000), lifespan: -rnd(30, 60) } },
    ]
  },
  {
    title: '仙人遗迹',
    desc: '你在一处神秘的虚空中发现了一座上古仙人的遗迹。遗迹散发着浩瀚的仙威，即便是残存的禁制也让你感到心悸。这是真正的仙人手笔！',
    realmRange: [3, 3],
    outcomes: [
      { desc: '你天资卓绝，竟然得到了遗迹中仙道意志的认可。你获得了完整的仙道传承，修为大涨，天赋也随之提升。', requires: { talent: 205 }, dAttr: { cultivation: rnd(50000, 150000), talent: rnd(8, 15) } },
      { desc: '你以强横的战力强行破解了部分禁制，虽然触发了防御机制，但仍然成功取走了部分仙宝。', requires: { power: 630000 }, dAttr: { wealth: rnd(8740, 17480) } },
      { desc: '遗迹中的杀阵被触发，无数仙光向你袭来。你虽然逃脱，但神魂已受创伤。', requires: {}, dAttr: { cultivation: -rnd(70000, 200000), lifespan: -rnd(50, 100) } },
    ]
  },
  {
    title: '魔道袭杀',
    desc: '数名魔道高手突然将你包围。他们是魔道大势力派来夺取你身上宝物的杀手。为首者是一名元婴期的魔修，周身魔气滔天。',
    realmRange: [3, 3],
    outcomes: [
      { desc: '你展现绝对实力，在魔修的包围中杀出一条血路，并将其全部击杀。从他们身上，你缴获了大量魔道宝物。', requires: { power: 770000 }, dAttr: { cultivation: rnd(28000, 80000), wealth: rnd(10920, 21840) } },
      { desc: '就在你即将被围困之际，天边忽然血光大盛——这是魔道内斗的征兆。魔修们不得不撤退，你趁机搜刮了他们的营地。', requires: { luck: 200 }, dAttr: { wealth: rnd(13100, 26200) } },
      { desc: '你寡不敌众，被魔道高手重伤。虽然逃脱，但魔气已侵入体内，根基受损。', requires: {}, dAttr: { cultivation: -rnd(70000, 200000), lifespan: -rnd(50, 100) } },
    ]
  },
  {
    title: '心魔乱神',
    desc: '你在修炼时遭遇了心魔入侵。数不清的幻象涌入你的识海，那是深藏在潜意识中的恐惧、执念和欲望。心魔正在吞噬你的神识。',
    realmRange: [3, 3],
    outcomes: [
      { desc: '你以绝强的意志力镇压心魔，在识海中与其展开终极对决。最终你斩灭心魔，神魂得到淬炼，寿元也因此大增！', requires: { power: 840000 }, dAttr: { cultivation: rnd(50000, 140000), talent: rnd(5, 12), lifespan: rnd(30, 60) } },
      { desc: '就在心魔即将吞噬你的刹那，你的气运爆发。天地元气自动涌入识海，驱散了心魔。你不仅脱困，还获得了意外领悟。', requires: { luck: 195 }, dAttr: { cultivation: rnd(35000, 100000) } },
      { desc: '心魔成功侵蚀了你的部分神魂。虽然最终脱困，但你的神魂已受重创，根基大损。', requires: {}, dAttr: { cultivation: -rnd(100000, 280000), talent: -rnd(3, 8), lifespan: -rnd(40, 80) } },
    ]
  },
  {
    title: '邪灵侵蚀',
    desc: '一片漆黑的邪灵云从远处飘来，笼罩了你修炼的洞府。这些邪灵来自幽冥深处，专门侵蚀修士的神魂。它们发出刺耳的尖啸，向你的识海发起冲击。',
    realmRange: [3, 3],
    outcomes: [
      { desc: '你周身金光大盛，无数法诀打出，将邪灵尽数斩灭。邪灵被灭后留下一颗散发幽光的魂晶，对你的神魂大有裨益。', requires: { power: 980000 }, dAttr: { cultivation: rnd(35000, 100000), wealth: rnd(21840, 43680) } },
      { desc: '就在邪灵即将侵蚀你的瞬间，你的气运爆发。一道金光将邪灵云驱散，你还从中获得了一枚珍贵的魂晶。', requires: { luck: 190 }, dAttr: { wealth: rnd(26200, 52400) } },
      { desc: '邪灵侵入了你的神魂，虽然最终将其驱逐，但你的神魂已受重创，寿元大减。', requires: {}, dAttr: { cultivation: -rnd(105000, 300000), lifespan: -rnd(60, 120) } },
    ]
  },
  {
    title: '空间裂隙',
    desc: '你正在虚空中飞行，忽然一道漆黑的裂缝出现在面前。这是空间裂隙——虚空中最危险的存在之一。裂隙中传出强大的吸力，将你向无尽的黑暗深渊拉去。',
    realmRange: [3, 3],
    outcomes: [
      { desc: '你展现出对战空间的掌控力，强行稳定了周围的空间。你不仅脱困，还领悟了一丝空间法则。', requires: { power: 850000 }, dAttr: { cultivation: rnd(50000, 140000), talent: rnd(5, 12) } },
      { desc: '就在你即将被吸入深渊的刹那，空间裂隙中忽然散发出宝物特有的光芒。你冒险进入裂隙，获得了一件空间至宝。', requires: { luck: 195 }, dAttr: { wealth: rnd(30000, 60000) } },
      { desc: '空间乱流在你身上留下无数伤口，你的身体几乎被撕裂。虽然最终逃出，但根基受损严重。', requires: {}, dAttr: { cultivation: -rnd(90000, 250000), lifespan: -rnd(40, 80) } },
    ]
  },
  {
    title: '天赐福缘',
    desc: '修炼之中，你的识海忽然变得一片清明。一道神秘的力量涌入你的体内，仿佛有神明在为你赐福...',
    realmRange: [3, 3],
    outcomes: [
      { desc: '天赐福缘降临！你的灵根得到极大提升，天赋和气运同时暴涨，对天地大道的感应更加敏锐！', requires: { talent: 135 }, dAttr: { talent: rnd(12, 20), luck: rnd(8, 15) } },
      { desc: '福缘之力部分降临，你感受到了天地对你的一丝眷顾。', requires: { luck: 125 }, dAttr: { luck: rnd(6, 12), talent: rnd(3, 6) } },
      { desc: '福缘之力未能降临，你感到一阵空虚。', requires: {}, dAttr: { luck: -rnd(2, 5) } },
    ]
  },
];

// 随机数工具函数
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// 根据气运计算事件概率倍率
// 气运范围0-200，需要更高气运才能获得好事加成
function getLuckMultiplier(state) {
  const luck = state.attrs.luck;
  let good, bad, adventure;
  
  if (luck > 180) {
    good = 1.5; bad = 0.4; adventure = 10;  // 极吉：大气运者
  } else if (luck > 150) {
    good = 1.3; bad = 0.6; adventure = 7;   // 大吉
  } else if (luck > 120) {
    good = 1.15; bad = 0.8; adventure = 5;  // 吉
  } else if (luck >= 80) {
    good = 1.0; bad = 1.0; adventure = 3;   // 平（正常）
  } else if (luck >= 50) {
    good = 0.85; bad = 1.2; adventure = 2;  // 凶
  } else {
    good = 0.7; bad = 1.5; adventure = 0;   // 大凶（奇遇权重为0，不触发）
  }
  
  return { good, bad, adventure };
}

// 获取当前境界的好事事件
function getGoodEvents(realmIndex) {
  switch(realmIndex) {
    case 0: return lianqiGoodEvents;
    case 1: return zhujiGoodEvents;
    case 2: return jindanGoodEvents;
    case 3: return yuanyingGoodEvents;
    case 4: return [];  // 化神突破后游戏结束，不触发事件
    default: return lianqiGoodEvents;
  }
}

// 获取当前境界的坏事事件
function getBadEvents(realmIndex) {
  switch(realmIndex) {
    case 0: return lianqiBadEvents;
    case 1: return zhujiBadEvents;
    case 2: return jindanBadEvents;
    case 3: return yuanyingBadEvents;
    case 4: return [];  // 化神突破后游戏结束，不触发事件
    default: return lianqiBadEvents;
  }
}

// 获取当前境界的突发事件（多结果依次判定）
function getEmergencyEvents(realmIndex) {
  return emergencyEvents.filter(e =>
    realmIndex >= e.realmRange[0] && realmIndex <= e.realmRange[1]
  );
}

// 处理突发事件：依次检查属性要求，返回匹配的结果
function processEmergencyEvent(emergency) {
  const s = window.state;
  // 各境界中间修为值
  const realmMidCultivation = [500, 8000, 82500, 700000, 6875000];

  // 根据当前境界计算动态战力要求（中间修为的100%-150%随机值）
  function getDynamicPower() {
    const realmIndex = s.realmIndex;
    const midCult = realmMidCultivation[realmIndex] || 500;
    return Math.round(midCult * (1 + Math.random() * 0.5));
  }

  // 先计算此事件所有outcome的动态战力值
  const dynamicPower = getDynamicPower();

  for (let i = 0; i < emergency.outcomes.length; i++) {
    const outcome = emergency.outcomes[i];
    // 如果是最后一个结果（无requires），直接返回
    if (!outcome.requires || Object.keys(outcome.requires).length === 0) {
      return { text: emergency.desc + outcome.desc, dAttr: outcome.dAttr };
    }
    // 检查属性是否满足要求
    let meetsRequirements = true;
    for (const [attr, required] of Object.entries(outcome.requires)) {
      // 战力使用提前计算好的动态值
      const threshold = attr === 'power' ? dynamicPower : required;
      if (s.attrs[attr] < threshold) {
        meetsRequirements = false;
        break;
      }
    }
    if (meetsRequirements) {
      return { text: emergency.desc + outcome.desc, dAttr: outcome.dAttr };
    }
  }
  // 理论上应该总是有最后一个结果作为默认
  const lastOutcome = emergency.outcomes[emergency.outcomes.length - 1];
  return { text: emergency.desc + lastOutcome.desc, dAttr: lastOutcome.dAttr };
}

// 事件选择函数
// excludeAdventure: true 时排除奇遇事件
function pickEvent(realmIndex = 0, excludeAdventure = false) {
  const s = window.state;
  
  // 获取气运影响倍率
  const luckMult = getLuckMultiplier(s);
  
  // 基础权重：修炼40，财富60，好事8，坏事8，奇遇4，战斗6
  // 根据气运调整好事、坏事和奇遇权重
  const goodWeight = Math.round(8 * luckMult.good);
  const badWeight = Math.round(8 * luckMult.bad);
  const adventureWeight = luckMult.adventure; // 奇遇权重直接使用气运影响后的值
  
  // 筛选当前境界适用的奇遇（排除已触发的）
  const triggeredAdventures = s.triggeredAdventures || [];
  const availableAdventures = adventureEvents.filter(a => 
    realmIndex >= a.realmRange[0] && 
    realmIndex <= a.realmRange[1] &&
    !triggeredAdventures.includes(a.title) // 排除已触发过的奇遇
  );
  
  // 获取商店触发记录
  const triggeredShops = s.triggeredShops || {};
  
  // 检查是否有符合条件的商店事件（财富达到门槛）
  const availableShopEvents = getAvailableShopEvents(realmIndex, s.attrs.wealth, triggeredShops);
  
  // 检查是否有符合条件的丹药商店事件
  const availablePillShopEvents = getAvailablePillShopEvents(realmIndex, s.attrs.wealth, triggeredShops);
  
  // 构建当前事件池（修炼+财富合并为基础事件，好事坏事按境界，奇遇战斗通用）
  const currentEventPool = [
    // ===== 基础事件（修炼+财富合并，权重50）=====
    // 触发时根据财富判断：财富足够→修炼事件，财富不足→财富事件
    {
      type: 'base', 
      weight: 50, 
      realmRange: [realmIndex, realmIndex], 
      cultivationTemplates: getCultivationTemplates(realmIndex),
      wealthTemplates: getWealthTemplates(realmIndex)
    },
    // ===== 好事事件（按境界，气运影响权重）=====
    {
      type: 'good', 
      weight: goodWeight,
      templates: getGoodEvents(realmIndex).map(e => (s) => ({ 
        text: e.text, 
        deltas: generateDeltas(e.dAttr), 
        dAttr: e.dAttr 
      }))
    },
    // ===== 坏事事件（按境界，气运影响权重）=====
    {
      type: 'bad', 
      weight: badWeight,
      templates: getBadEvents(realmIndex).map(e => (s) => ({ 
        text: e.text, 
        deltas: generateDeltas(e.dAttr), 
        dAttr: e.dAttr 
      }))
    },
    // ===== 奇遇事件（按境界筛选，受气运影响）=====
    // 注：如果没有可用奇遇，此项不会被添加到池中
  ];
  
  // 如果不排除奇遇，添加奇遇事件到池中
  if (!excludeAdventure && availableAdventures.length > 0) {
    currentEventPool.push({
      type: 'adventure', 
      weight: adventureWeight, 
      isChoice: true, 
      templates: availableAdventures,
      isMultiRing: true
    });
  }
  
  // ===== 突发事件（按境界筛选）=====
  currentEventPool.push({
    type: 'emergency',
    weight: 6,
    realmRange: [realmIndex, realmIndex],
    templates: getEmergencyEvents(realmIndex)
  });
  
  // 如果有符合条件的商店事件，添加到事件池
  if (availableShopEvents.length > 0) {
    currentEventPool.push({
      type: 'shop',
      weight: 4,
      isChoice: true,
      realmRange: [realmIndex, realmIndex],
      templates: availableShopEvents
    });
  }
  
  // 如果有符合条件的丹药商店事件，添加到事件池
  if (availablePillShopEvents.length > 0) {
    currentEventPool.push({
      type: 'pillshop',
      weight: 4,
      isChoice: true,
      realmRange: [realmIndex, realmIndex],
      templates: availablePillShopEvents
    });
  }
  
  const total = currentEventPool.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const ep of currentEventPool) {
    r -= ep.weight;
    if (r <= 0) return ep;
  }
  return currentEventPool[0];
}

// 获取可用的丹药商店事件
function getAvailablePillShopEvents(realmIndex, wealth, triggeredShops) {
  return pillShopEvents.filter(shop => {
    // 检查境界匹配
    if (shop.realmIndex !== realmIndex) return false;
    // 检查是否已触发上限
    const triggerCount = triggeredShops[shop.shopId] || 0;
    if (triggerCount >= SHOP_MAX_TRIGGERS) return false;
    return true;
  });
}

// 生成变化量描述
function generateDeltas(dAttr, adventure) {
  // 如果是发放物品，返回物品详情
  if (dAttr.giveItem && adventure) {
    const typeNames = { technique: '功法', treasure: '法宝' };
    const rarityNames = { common: '普通', uncommon: '优秀', rare: '稀有', epic: '史诗', legendary: '传说' };
    
    // 获取物品详情
    let item = null;
    if (adventure.type === 'technique' && typeof getTechniqueById === 'function') {
      item = getTechniqueById(adventure.itemId);
    } else if (adventure.type === 'treasure' && typeof getTreasureById === 'function') {
      item = getTreasureById(adventure.itemId);
    }
    
    if (item) {
      const effectText = adventure.type === 'technique' 
        ? `战力倍率 ×${item.powerRate}`
        : `战力加成 ×${item.powerBonus}`;
      return [`获得${rarityNames[item.rarity] || ''}${typeNames[adventure.type]}【${item.name}】`, `效果：${effectText}`];
    }
    return [`获得${typeNames[adventure.type]}【${adventure.itemId}】`];
  }
  
  const labels = { cultivation: '修为', power: '战力', talent: '天赋', luck: '气运', wealth: '财富', lifespan: '寿元' };
  return Object.entries(dAttr).map(([k, v]) => {
    return `${labels[k] || k} ${v > 0 ? '+' : ''}${v}`;
  });
}

// 根据境界获取修炼事件模板
function getCultivationTemplates(realmIndex) {
  const configs = [
    // 炼气期
    [
      (s) => {
        const gain = Math.round(s.attrs.talent * 0.10);
        return { text: `吸纳天地灵气，运转大周天，修为精进。`, deltas: [`修为 +${gain}`, `财富 -10`], dAttr: { cultivation: gain, wealth: -10 } };
      },
      (s) => {
        const gain = Math.round(s.attrs.talent * 0.11);
        return { text: `打坐吐纳，灵气入体，丹田充盈。`, deltas: [`修为 +${gain}`, `财富 -10`], dAttr: { cultivation: gain, wealth: -10 } };
      },
      (s) => {
        const gain = Math.round(s.attrs.talent * 0.12);
        return { text: `静心凝神，灵台清明，修炼效率倍增。`, deltas: [`修为 +${gain}`, `财富 -10`], dAttr: { cultivation: gain, wealth: -10 } };
      },
    ],
    // 筑基期
    [
      (s) => {
        const gain = Math.round(s.attrs.talent * 0.50);
        return { text: `运转功法，灵气如潮涌入丹田，修为大涨。`, deltas: [`修为 +${gain}`, `财富 -42`], dAttr: { cultivation: gain, wealth: -42 } };
      },
      (s) => {
        const gain = Math.round(s.attrs.talent * 0.55);
        return { text: `闭关修炼，真气凝聚，离金丹大道更近一步。`, deltas: [`修为 +${gain}`, `财富 -42`], dAttr: { cultivation: gain, wealth: -42 } };
      },
      (s) => {
        const gain = Math.round(s.attrs.talent * 0.60);
        return { text: `以天地为炉，以自身为材，修炼渐入佳境。`, deltas: [`修为 +${gain}`, `财富 -42`], dAttr: { cultivation: gain, wealth: -42 } };
      },
    ],
    // 金丹期
    [
      (s) => {
        const gain = Math.round(s.attrs.talent * 2.50);
        return { text: `丹田中真气翻涌，凝结元婴，指日可待。`, deltas: [`修为 +${gain}`, `财富 -175`], dAttr: { cultivation: gain, wealth: -175 } };
      },
      (s) => {
        const gain = Math.round(s.attrs.talent * 2.75);
        return { text: `感应天地之力，借天地灵气淬炼己身。`, deltas: [`修为 +${gain}`, `财富 -175`], dAttr: { cultivation: gain, wealth: -175 } };
      },
      (s) => {
        const gain = Math.round(s.attrs.talent * 3.0);
        return { text: `金丹隐隐发光，与天地交感，修炼事半功倍。`, deltas: [`修为 +${gain}`, `财富 -175`], dAttr: { cultivation: gain, wealth: -175 } };
      },
    ],
    // 元婴期
    [
      (s) => {
        const gain = Math.round(s.attrs.talent * 12);
        return { text: `神识出游，遨游天地，感悟万物之理。`, deltas: [`修为 +${gain}`, `财富 -728`], dAttr: { cultivation: gain, wealth: -728 } };
      },
      (s) => {
        const gain = Math.round(s.attrs.talent * 13);
        return { text: `元婴日渐凝实，与天地共鸣，修为飞速精进。`, deltas: [`修为 +${gain}`, `财富 -728`], dAttr: { cultivation: gain, wealth: -728 } };
      },
      (s) => {
        const gain = Math.round(s.attrs.talent * 15);
        return { text: `神魂壮大，与天地同寿的奥秘渐显端倪。`, deltas: [`修为 +${gain}`, `财富 -728`], dAttr: { cultivation: gain, wealth: -728 } };
      },
    ],
    // 化神期（突破后游戏结束，不需要修炼模板）
    [],
  ];
  return configs[realmIndex] || configs[0];
}

// 根据境界获取财富事件模板
function getWealthTemplates(realmIndex) {
  const configs = [
    // 炼气期
    [
      (s) => ({ text: `在山中采药，卖得几枚灵石。`, deltas: [`财富 +30`], dAttr: { wealth: 30 } }),
      (s) => ({ text: `帮人代购灵材，赚取些许跑腿费。`, deltas: [`财富 +30`], dAttr: { wealth: 30 } }),
      (s) => ({ text: `出售多余的丹药残渣，积少成多。`, deltas: [`财富 +30`], dAttr: { wealth: 30 } }),
    ],
    // 筑基期
    [
      (s) => ({ text: `在坊市开设摊位，出售炼制的小物件。`, deltas: [`财富 +126`], dAttr: { wealth: 126 } }),
      (s) => ({ text: `接取宗门任务，获取丰厚报酬。`, deltas: [`财富 +126`], dAttr: { wealth: 126 } }),
      (s) => ({ text: `帮人鉴定灵器，赚取鉴定费。`, deltas: [`财富 +126`], dAttr: { wealth: 126 } }),
    ],
    // 金丹期
    [
      (s) => ({ text: `主持一场小型拍卖会，获得主持费用。`, deltas: [`财富 +525`], dAttr: { wealth: 525 } }),
      (s) => ({ text: `出售多年收藏的灵材珍宝。`, deltas: [`财富 +525`], dAttr: { wealth: 525 } }),
      (s) => ({ text: `为后辈指点修行，收取谢礼。`, deltas: [`财富 +525`], dAttr: { wealth: 525 } }),
    ],
    // 元婴期
    [
      (s) => ({ text: `开辟新的灵脉资源，收益颇丰。`, deltas: [`财富 +2184`], dAttr: { wealth: 2184 } }),
      (s) => ({ text: `受邀讲道，获得各方势力馈赠。`, deltas: [`财富 +2184`], dAttr: { wealth: 2184 } }),
      (s) => ({ text: `经营洞府多年积蓄，获得一笔收入。`, deltas: [`财富 +2184`], dAttr: { wealth: 2184 } }),
    ],
    // 化神期（突破后游戏结束，不需要财富模板）
    [],
  ];
  return configs[realmIndex] || configs[0];
}

// 将函数暴露到全局，供其他脚本使用
window.pickEvent = pickEvent;
window.generateDeltas = generateDeltas;
window.processEmergencyEvent = processEmergencyEvent;
