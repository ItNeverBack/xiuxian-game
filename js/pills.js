// ===== 丹药系统数据 =====

// 各境界修炼消耗（灵石/次）
const CULTIVATION_COST = [10, 42, 175, 728, 3028];

// 各境界修炼增长（天赋×中间倍率，约天赋100）
const CULTIVATION_GAIN = [12, 60, 300, 1500, 7500];

// 丹药数据
const pills = [
  // ===== 炼气期丹药（5种）=====
  {
    id: 'pill_lianqi_1',
    name: '凝气丹',
    realmIndex: 0,
    category: '炼气期',
    price: CULTIVATION_COST[0] * 3,  // 30灵石
    cultivationGain: CULTIVATION_GAIN[0] * 3,  // 36修为
    desc: '最基础的修炼丹药，能小幅提升炼气期修士的修为。',
    icon: '💊',
    rarity: 'common'
  },
  {
    id: 'pill_lianqi_2',
    name: '聚灵丹',
    realmIndex: 0,
    category: '炼气期',
    price: CULTIVATION_COST[0] * 5,  // 50灵石
    cultivationGain: CULTIVATION_GAIN[0] * 5,  // 60修为
    desc: '凝聚天地灵气的丹药，炼气期修士修炼的常用辅助。',
    icon: '💊',
    rarity: 'common'
  },
  {
    id: 'pill_lianqi_3',
    name: '化气丹',
    realmIndex: 0,
    category: '炼气期',
    price: CULTIVATION_COST[0] * 7,  // 70灵石
    cultivationGain: CULTIVATION_GAIN[0] * 7,  // 84修为
    desc: '能将灵气高效转化的丹药，修炼效率大幅提升。',
    icon: '💊',
    rarity: 'uncommon'
  },
  {
    id: 'pill_lianqi_4',
    name: '养气丹',
    realmIndex: 0,
    category: '炼气期',
    price: CULTIVATION_COST[0] * 10,  // 100灵石
    cultivationGain: CULTIVATION_GAIN[0] * 10,  // 120修为
    desc: '温养经脉的丹药，服用后修为稳步增长。',
    icon: '💊',
    rarity: 'uncommon'
  },
  {
    id: 'pill_lianqi_5',
    name: '培元丹',
    realmIndex: 0,
    category: '炼气期',
    price: CULTIVATION_COST[0] * 15,  // 150灵石
    cultivationGain: CULTIVATION_GAIN[0] * 15,  // 180修为
    desc: '巩固根基的珍贵丹药，炼气期顶尖修炼资源。',
    icon: '💊',
    rarity: 'rare'
  },

  // ===== 筑基期丹药（4种）=====
  {
    id: 'pill_zhuji_1',
    name: '固元丹',
    realmIndex: 1,
    category: '筑基期',
    price: CULTIVATION_COST[1] * 3,  // 126灵石
    cultivationGain: CULTIVATION_GAIN[1] * 3,  // 180修为
    desc: '筑基期修士常用的修炼丹药，能有效提升修为。',
    icon: '💊',
    rarity: 'uncommon'
  },
  {
    id: 'pill_zhuji_2',
    name: '凝元丹',
    realmIndex: 1,
    category: '筑基期',
    price: CULTIVATION_COST[1] * 6,  // 252灵石
    cultivationGain: CULTIVATION_GAIN[1] * 6,  // 360修为
    desc: '凝聚元气的丹药，筑基期修士修炼的得力助手。',
    icon: '💊',
    rarity: 'uncommon'
  },
  {
    id: 'pill_zhuji_3',
    name: '真元丹',
    realmIndex: 1,
    category: '筑基期',
    price: CULTIVATION_COST[1] * 10,  // 420灵石
    cultivationGain: CULTIVATION_GAIN[1] * 10,  // 600修为
    desc: '蕴含纯正元气的丹药，修炼事半功倍。',
    icon: '💊',
    rarity: 'rare'
  },
  {
    id: 'pill_zhuji_4',
    name: '天元丹',
    realmIndex: 1,
    category: '筑基期',
    price: CULTIVATION_COST[1] * 15,  // 630灵石
    cultivationGain: CULTIVATION_GAIN[1] * 15,  // 900修为
    desc: '沟通天地的丹药，筑基期顶尖修炼资源。',
    icon: '💊',
    rarity: 'rare'
  },

  // ===== 金丹期丹药（3种）=====
  {
    id: 'pill_jindan_1',
    name: '金元丹',
    realmIndex: 2,
    category: '金丹期',
    price: CULTIVATION_COST[2] * 3,  // 525灵石
    cultivationGain: CULTIVATION_GAIN[2] * 3,  // 900修为
    desc: '金丹期修士梦寐以求的修炼丹药，蕴含充沛灵气。',
    icon: '💊',
    rarity: 'rare'
  },
  {
    id: 'pill_jindan_2',
    name: '太极丹',
    realmIndex: 2,
    category: '金丹期',
    price: CULTIVATION_COST[2] * 8,  // 1400灵石
    cultivationGain: CULTIVATION_GAIN[2] * 8,  // 2400修为
    desc: '蕴含太极之力的丹药，修炼如入无人之境。',
    icon: '💊',
    rarity: 'rare'
  },
  {
    id: 'pill_jindan_3',
    name: '大道丹',
    realmIndex: 2,
    category: '金丹期',
    price: CULTIVATION_COST[2] * 15,  // 2625灵石
    cultivationGain: CULTIVATION_GAIN[2] * 15,  // 4500修为
    desc: '蕴含大道法则的丹药，金丹期顶尖修炼资源。',
    icon: '💊',
    rarity: 'epic'
  },

  // ===== 元婴期丹药（2种）=====
  {
    id: 'pill_yuanying_1',
    name: '养婴丹',
    realmIndex: 3,
    category: '元婴期',
    price: CULTIVATION_COST[3] * 3,  // 2184灵石
    cultivationGain: CULTIVATION_GAIN[3] * 3,  // 4500修为
    desc: '专供元婴期大能服用的丹药，炼制极为困难。',
    icon: '💊',
    rarity: 'epic'
  },
  {
    id: 'pill_yuanying_2',
    name: '仙元丹',
    realmIndex: 3,
    category: '元婴期',
    price: CULTIVATION_COST[3] * 12,  // 8736灵石
    cultivationGain: CULTIVATION_GAIN[3] * 12,  // 18000修为
    desc: '蕴含仙元之力的丹药，元婴期顶尖修炼资源。',
    icon: '💊',
    rarity: 'epic'
  }
];

// 获取丹药品质信息
const PILL_RARITY = {
  common: { name: '普通', color: '#9a9a9a' },
  uncommon: { name: '精良', color: '#4ade80' },
  rare: { name: '稀有', color: '#60a5fa' },
  epic: { name: '史诗', color: '#c084fc' },
  legendary: { name: '传说', color: '#fbbf24' }
};

// 根据ID获取丹药
function getPillById(pillId) {
  return pills.find(p => p.id === pillId);
}

// 根据境界获取所有丹药
function getPillsByRealm(realmIndex) {
  return pills.filter(p => p.realmIndex === realmIndex);
}
