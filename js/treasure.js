// ===== 法宝系统模块 =====
// 法宝只影响战力，按境界分类

const TREASURE_RARITY = {
  common: { name: '普通', color: '#ffffff', icon: '⬜' },
  uncommon: { name: '优秀', color: '#4ade80', icon: '🟩' },
  rare: { name: '稀有', color: '#60a5fa', icon: '🟦' },
  epic: { name: '史诗', color: '#c084fc', icon: '🟪' },
  legendary: { name: '传说', color: '#fbbf24', icon: '🟨' }
};

// 品质等级映射（数值越小品质越高）
const RARITY_LEVEL = {
  common: 4,      // 普通
  uncommon: 3,   // 优秀
  rare: 2,       // 稀有
  epic: 1,       // 史诗
  legendary: 0   // 传说
};

// 境界名称映射
const TREASURE_REALM_NAMES = ['炼气', '筑基', '金丹', '元婴', '化神'];

// 法宝价格倍率（基于各境界基础财富）
const TREASURE_PRICE_MULT = {
  common: 2,      // 基础财富 × 2
  uncommon: 4,    // 基础财富 × 4
  rare: 8,        // 基础财富 × 8
  epic: 15,       // 基础财富 × 15
  legendary: 25   // 基础财富 × 25
};

// 境界基础财富（与 event.js 中 BASE_WEALTH 一致）
const TREASURE_BASE_WEALTH = [30, 126, 525, 2184, 9084];

// 计算法宝价格
function getTreasurePrice(treasure) {
  const realmIndex = ['炼气', '筑基', '金丹', '元婴', '化神'].indexOf(treasure.category);
  const base = TREASURE_BASE_WEALTH[realmIndex] || 30;
  const mult = TREASURE_PRICE_MULT[treasure.rarity] || 2;
  return Math.floor(base * mult);
}

// 法宝列表（只影响战力，按境界分类）
const TREASURES = [
  // ===== 炼气法宝 =====
  {
    id: 'trea_lianqi_1',
    name: '铁剑',
    category: '炼气',
    rarity: 'common',
    desc: '普通铁剑，勉强能用。',
    powerBonus: 1.05,
    icon: '⚔️',
    level: 1,
    price: 60   // 30 × 2
  },
  {
    id: 'trea_lianqi_2',
    name: '布衣',
    category: '炼气',
    rarity: 'common',
    desc: '最基础的护体衣物。',
    powerBonus: 1.03,
    icon: '👕',
    level: 1,
    price: 60   // 30 × 2
  },
  {
    id: 'trea_lianqi_3',
    name: '木簪',
    category: '炼气',
    rarity: 'uncommon',
    desc: '可稍微凝聚灵气的木簪。',
    powerBonus: 1.08,
    icon: '💮',
    level: 1,
    price: 120  // 30 × 4
  },
  {
    id: 'trea_lianqi_4',
    name: '玄铁剑',
    category: '炼气',
    rarity: 'uncommon',
    desc: '玄铁所铸，锋利异常。',
    powerBonus: 1.12,
    icon: '🗡️',
    level: 1,
    price: 120  // 30 × 4
  },
  {
    id: 'trea_lianqi_5',
    name: '护体玉佩',
    category: '炼气',
    rarity: 'rare',
    desc: '可抵挡部分攻击的玉佩。',
    powerBonus: 1.18,
    icon: '🔮',
    level: 1,
    price: 240  // 30 × 8
  },
  {
    id: 'trea_lianqi_6',
    name: '灵蛇剑',
    category: '炼气',
    rarity: 'rare',
    desc: '灵蛇所化，剑意灵动。',
    powerBonus: 1.22,
    icon: '🐍',
    level: 1,
    price: 240  // 30 × 8
  },
  {
    id: 'trea_lianqi_7',
    name: '离火罩',
    category: '炼气',
    rarity: 'epic',
    desc: '离火精华所炼，攻防兼备。',
    powerBonus: 1.35,
    icon: '🔥',
    level: 1,
    price: 450  // 30 × 15
  },
  {
    id: 'trea_lianqi_8',
    name: '玄天真剑',
    category: '炼气',
    rarity: 'legendary',
    desc: '蕴含玄天真意，神威莫测。',
    powerBonus: 1.50,
    icon: '⚜️',
    level: 1,
    price: 750  // 30 × 25
  },

  // ===== 筑基法宝 =====
  {
    id: 'trea_zhuji_1',
    name: '青铜剑',
    category: '筑基',
    rarity: 'common',
    desc: '青铜所铸，筑基期入门法器。',
    powerBonus: 2.00,
    icon: '⚔️',
    level: 2,
    price: 252  // 126 × 2
  },
  {
    id: 'trea_zhuji_2',
    name: '布甲',
    category: '筑基',
    rarity: 'common',
    desc: '最简单的护体法甲。',
    powerBonus: 2.00,
    icon: '🛡️',
    level: 2,
    price: 252  // 126 × 2
  },
  {
    id: 'trea_zhuji_3',
    name: '灵玉环',
    category: '筑基',
    rarity: 'uncommon',
    desc: '凝聚灵气的玉环。',
    powerBonus: 2.20,
    icon: '💠',
    level: 2,
    price: 504  // 126 × 4
  },
  {
    id: 'trea_zhuji_4',
    name: '寒霜剑',
    category: '筑基',
    rarity: 'uncommon',
    desc: '寒霜之气凝聚的长剑。',
    powerBonus: 2.30,
    icon: '❄️',
    level: 2,
    price: 504  // 126 × 4
  },
  {
    id: 'trea_zhuji_5',
    name: '金丝甲',
    category: '筑基',
    rarity: 'rare',
    desc: '金丝编织，防护力不俗。',
    powerBonus: 2.50,
    icon: '🛡️',
    level: 2,
    price: 1008 // 126 × 8
  },
  {
    id: 'trea_zhuji_6',
    name: '紫电剑',
    category: '筑基',
    rarity: 'rare',
    desc: '紫电凝聚，剑光如电。',
    powerBonus: 2.60,
    icon: '⚡',
    level: 2,
    price: 1008 // 126 × 8
  },
  {
    id: 'trea_zhuji_7',
    name: '玄武盾',
    category: '筑基',
    rarity: 'epic',
    desc: '玄武之力加持，坚不可摧。',
    powerBonus: 2.80,
    icon: '🐢',
    level: 2,
    price: 1890 // 126 × 15
  },
  {
    id: 'trea_zhuji_8',
    name: '太古仙剑',
    category: '筑基',
    rarity: 'legendary',
    desc: '太古仙人遗留，威能惊天。',
    powerBonus: 3.00,
    icon: '⚜️',
    level: 2,
    price: 3150 // 126 × 25
  },

  // ===== 金丹法宝 =====
  {
    id: 'trea_jindan_1',
    name: '银霜剑',
    category: '金丹',
    rarity: 'uncommon',
    desc: '金丹期入门法剑，银芒流转。',
    powerBonus: 4.00,
    icon: '⚔️',
    level: 3,
    price: 2100 // 525 × 4
  },
  {
    id: 'trea_jindan_2',
    name: '云锦袍',
    category: '金丹',
    rarity: 'uncommon',
    desc: '云锦所制，轻盈防护。',
    powerBonus: 4.10,
    icon: '👘',
    level: 3,
    price: 2100 // 525 × 4
  },
  {
    id: 'trea_jindan_3',
    name: '破风剑',
    category: '金丹',
    rarity: 'uncommon',
    desc: '剑意破风，速度极快。',
    powerBonus: 4.20,
    icon: '💨',
    level: 3,
    price: 2100 // 525 × 4
  },
  {
    id: 'trea_jindan_4',
    name: '玄冰甲',
    category: '金丹',
    rarity: 'uncommon',
    desc: '玄冰所炼，冰冷刺骨。',
    powerBonus: 4.30,
    icon: '🧊',
    level: 3,
    price: 2100 // 525 × 4
  },
  {
    id: 'trea_jindan_5',
    name: '灭魂剑',
    category: '金丹',
    rarity: 'rare',
    desc: '专攻神魂，威能惊人。',
    powerBonus: 4.60,
    icon: '💀',
    level: 3,
    price: 4200 // 525 × 8
  },
  {
    id: 'trea_jindan_6',
    name: '金刚圈',
    category: '金丹',
    rarity: 'rare',
    desc: '可攻可守，变化无穷。',
    powerBonus: 4.80,
    icon: '⭕',
    level: 3,
    price: 4200 // 525 × 8
  },
  {
    id: 'trea_jindan_7',
    name: '焚天炉',
    category: '金丹',
    rarity: 'epic',
    desc: '可炼万物，攻防一体。',
    powerBonus: 5.20,
    icon: '🏺',
    level: 3,
    price: 7875 // 525 × 15
  },
  {
    id: 'trea_jindan_8',
    name: '阴阳扇',
    category: '金丹',
    rarity: 'legendary',
    desc: '阴阳调和，可扇动天地。',
    powerBonus: 5.60,
    icon: '🪭',
    level: 3,
    price: 13125 // 525 × 25
  },

  // ===== 元婴法宝 =====
  {
    id: 'trea_yuanying_2',
    name: '天罗袍',
    category: '元婴',
    rarity: 'rare',
    desc: '天罗丝所织，防护周全。',
    powerBonus: 6.00,
    icon: '👘',
    level: 4,
    price: 17472 // 2184 × 8
  },
  {
    id: 'trea_yuanying_1',
    name: '斩魔剑',
    category: '元婴',
    rarity: 'rare',
    desc: '专为斩魔而炼的法剑。',
    powerBonus: 6.20,
    icon: '⚔️',
    level: 4,
    price: 17472 // 2184 × 8
  },
  {
    id: 'trea_yuanying_3',
    name: '星辰剑',
    category: '元婴',
    rarity: 'rare',
    desc: '星辰之力灌注，剑光璀璨。',
    powerBonus: 6.40,
    icon: '⭐',
    level: 4,
    price: 17472 // 2184 × 8
  },
  {
    id: 'trea_yuanying_5',
    name: '万鬼幡',
    category: '元婴',
    rarity: 'rare',
    desc: '万鬼之力加持，威能莫测。',
    powerBonus: 6.60,
    icon: '🚩',
    level: 4,
    price: 17472 // 2184 × 8
  },
  {
    id: 'trea_yuanying_6',
    name: '翻天印',
    category: '元婴',
    rarity: 'rare',
    desc: '可翻天覆地，威力无穷。',
    powerBonus: 6.80,
    icon: '📜',
    level: 4,
    price: 17472 // 2184 × 8
  },
  {
    id: 'trea_yuanying_4',
    name: '玄武战甲',
    category: '元婴',
    rarity: 'epic',
    desc: '玄武战魂所化，坚不可摧。',
    powerBonus: 7.20,
    icon: '🛡️',
    level: 4,
    price: 32760 // 2184 × 15
  },
  {
    id: 'trea_yuanying_7',
    name: '天魔旗',
    category: '元婴',
    rarity: 'epic',
    desc: '天魔残魂所附，凶威滔天。',
    powerBonus: 7.60,
    icon: '🚩',
    level: 4,
    price: 32760 // 2184 × 15
  },
  {
    id: 'trea_yuanying_8',
    name: '盘古斧',
    category: '元婴',
    rarity: 'legendary',
    desc: '开天辟地之威，毁天灭地。',
    powerBonus: 8.00,
    icon: '🪓',
    level: 4,
    price: 54600 // 2184 × 25
  },

];

// 法宝栏容量
const TREASURE_SLOTS = 4;

// 根据境界获取最低可抽取品质
function getMinRarityByRealm(realmIndex) {
  if (realmIndex >= 3) return 'rare';      // 元婴：稀有及以上
  if (realmIndex >= 2) return 'uncommon';  // 金丹：优秀及以上
  return 'common';                          // 炼气、筑基：无限制
}

// 根据境界获取可用法宝（当前境界）
function getTreasuresByRealm(realmIndex) {
  const realmName = TREASURE_REALM_NAMES[realmIndex] || '炼气';
  const minRarity = getMinRarityByRealm(realmIndex);
  const minLevel = RARITY_LEVEL[minRarity];
  
  return TREASURES.filter(t => 
    t.category === realmName && 
    RARITY_LEVEL[t.rarity] <= minLevel
  );
}

// 随机获取当前境界的法宝
function getRandomTreasure(excludeIds = [], realmIndex = 0) {
  const available = getTreasuresByRealm(realmIndex).filter(t => !excludeIds.includes(t.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TREASURE_RARITY,
    RARITY_LEVEL,
    TREASURE_REALM_NAMES,
    TREASURES,
    TREASURE_SLOTS,
    getMinRarityByRealm,
    getTreasuresByRealm,
    getRandomTreasure
  };
}
