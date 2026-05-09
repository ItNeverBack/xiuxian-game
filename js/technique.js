// ===== 功法系统模块 =====
// 功法核心功能：提供战力系数，战力 = 修为 × 战力系数
// 普通功法系数 < 1，高稀有度功法系数 > 1
// 部分功法附带额外效果（天赋、寿元等）

const TECHNIQUE_RARITY = {
  common: { name: '普通', color: '#ffffff', icon: '⬜' },
  uncommon: { name: '优秀', color: '#4ade80', icon: '🟩' },
  rare: { name: '稀有', color: '#60a5fa', icon: '🟦' },
  epic: { name: '史诗', color: '#c084fc', icon: '🟪' },
  legendary: { name: '传说', color: '#fbbf24', icon: '🟨' }
};

// 功法价格倍率（基于各境界基础财富）
const TECHNIQUE_PRICE_MULT = {
  common: 2,      // 基础财富 × 2
  uncommon: 4,    // 基础财富 × 4
  rare: 8,        // 基础财富 × 8
  epic: 15,       // 基础财富 × 15
  legendary: 25   // 基础财富 × 25
};

// 境界基础财富（与 event.js 中 BASE_WEALTH 一致）
const TECHNIQUE_BASE_WEALTH = [30, 126, 525, 2184, 9084];

// 计算功法价格
function getTechniquePrice(technique) {
  const realmIndex = ['炼气', '筑基', '金丹', '元婴', '化神'].indexOf(technique.category);
  const base = TECHNIQUE_BASE_WEALTH[realmIndex] || 30;
  const mult = TECHNIQUE_PRICE_MULT[technique.rarity] || 2;
  return Math.floor(base * mult);
}

// 功法列表
const TECHNIQUES = [
  // ===== 炼气功法（名称简洁） =====
  {
    id: 'tech_jiuxuan',
    name: '引气诀',
    category: '炼气',
    rarity: 'common',
    desc: '最基础的入门功法，引导灵气入体。',
    powerRate: 0.85,
    bonusEffects: [],
    level: 1,
    price: 60  // 30 × 2
  },
  {
    id: 'tech_xuanqing',
    name: '聚气诀',
    category: '炼气',
    rarity: 'common',
    desc: '将灵气汇聚丹田，入门修士常用功法。',
    powerRate: 0.88,
    bonusEffects: [],
    level: 1,
    price: 60  // 30 × 2
  },
  {
    id: 'tech_xuanhuang',
    name: '长生功',
    category: '炼气',
    rarity: 'uncommon',
    desc: '入门级养生功法，稳固根基，延年益寿。',
    powerRate: 0.95,
    bonusEffects: [
      { attr: 'lifespan', type: 'bonus', value: 5, label: '寿元+5' }
    ],
    level: 1,
    price: 120  // 30 × 4
  },
  {
    id: 'tech_wulong',
    name: '吐纳法',
    category: '炼气',
    rarity: 'uncommon',
    desc: '吐故纳新，上古修士常用法门，转化效率颇高。',
    powerRate: 1.00,
    bonusEffects: [],
    level: 1,
    price: 120  // 30 × 4
  },
  {
    id: 'tech_tianyin',
    name: '静心诀',
    category: '炼气',
    rarity: 'rare',
    desc: '心如止水，悟性大增，修炼事半功倍。',
    powerRate: 1.08,
    bonusEffects: [
      { attr: 'talent', type: 'mult', value: 1.05, label: '天赋+5%' }
    ],
    level: 1,
    price: 240  // 30 × 8
  },
  {
    id: 'tech_jiuyin',
    name: '阴煞功',
    category: '炼气',
    rarity: 'rare',
    desc: '阴属功法，修炼极快但伤身损寿。',
    powerRate: 1.15,
    bonusEffects: [
      { attr: 'lifespan', type: 'bonus', value: -15, label: '寿元-15' }
    ],
    level: 1,
    price: 240  // 30 × 8
  },
  {
    id: 'tech_xiuxin',
    name: '问道经',
    category: '炼气',
    rarity: 'epic',
    desc: '上界仙宗流传功法，指引凡人成仙之道。',
    powerRate: 1.25,
    bonusEffects: [
      { attr: 'talent', type: 'mult', value: 1.10, label: '天赋+10%' },
      { attr: 'lifespan', type: 'bonus', value: 20, label: '寿元+20' }
    ],
    level: 1,
    price: 450  // 30 × 15
  },

  // ===== 筑基功法 =====
  {
    id: 'tech_jindan',
    name: '凝元诀',
    category: '筑基',
    rarity: 'common',
    desc: '凝气成液、筑就丹基的筑基入门功法。',
    powerRate: 0.90,
    bonusEffects: [],
    level: 2,
    price: 252  // 126 × 2
  },
  {
    id: 'tech_baiyun',
    name: '腾云法',
    category: '筑基',
    rarity: 'common',
    desc: '采天地灵气入体，可短暂腾云而行。',
    powerRate: 0.92,
    bonusEffects: [],
    level: 2,
    price: 252  // 126 × 2
  },
  {
    id: 'tech_tianlu',
    name: '登天阶',
    category: '筑基',
    rarity: 'uncommon',
    desc: '一步一重天，需坚韧意志，附带延寿之效。',
    powerRate: 1.02,
    bonusEffects: [
      { attr: 'lifespan', type: 'bonus', value: 10, label: '寿元+10' }
    ],
    level: 2,
    price: 504  // 126 × 4
  },
  {
    id: 'tech_wuxing',
    name: '五行轮转诀',
    category: '筑基',
    rarity: 'rare',
    desc: '五行灵气轮转相生，攻守平衡，战力稳定。',
    powerRate: 1.15,
    bonusEffects: [],
    level: 2,
    price: 1008  // 126 × 8
  },
  {
    id: 'tech_zhenshi',
    name: '太古真龙变',
    category: '筑基',
    rarity: 'legendary',
    desc: '太古真龙血脉传承，可化真龙之形。',
    powerRate: 1.50,
    bonusEffects: [
      { attr: 'lifespan', type: 'bonus', value: 50, label: '寿元+50' }
    ],
    level: 2,
    price: 3150  // 126 × 25
  },

  // ===== 金丹功法 =====
  {
    id: 'tech_huashan',
    name: '太虚剑气诀',
    category: '金丹',
    rarity: 'rare',
    desc: '太虚仙门镇宗剑法，剑气无双。',
    powerRate: 1.25,
    bonusEffects: [
      { attr: 'talent', type: 'mult', value: 1.08, label: '天赋+8%' }
    ],
    level: 3,
    price: 4200  // 525 × 8
  },
  {
    id: 'tech_xuanbing',
    name: '玄冰凝魂诀',
    category: '金丹',
    rarity: 'rare',
    desc: '玄冰之力淬炼神魂，攻守兼备。',
    powerRate: 1.18,
    bonusEffects: [
      { attr: 'lifespan', type: 'bonus', value: 15, label: '寿元+15' }
    ],
    level: 3,
    price: 4200  // 525 × 8
  },
  {
    id: 'tech_xiuhua',
    name: '修罗战魂经',
    category: '金丹',
    rarity: 'rare',
    desc: '以战养战，战意越强战力越强。',
    powerRate: 1.22,
    bonusEffects: [
      { attr: 'talent', type: 'mult', value: 1.05, label: '天赋+5%' }
    ],
    level: 3,
    price: 4200  // 525 × 8
  },
  {
    id: 'tech_tianren',
    name: '天人感应法',
    category: '金丹',
    rarity: 'epic',
    desc: '与天地灵气交感，借天地之力为己用。',
    powerRate: 1.40,
    bonusEffects: [
      { attr: 'lifespan', type: 'bonus', value: 40, label: '寿元+40' }
    ],
    level: 3,
    price: 7875  // 525 × 15
  },
  {
    id: 'tech_yinyang',
    name: '阴阳交泰诀',
    category: '金丹',
    rarity: 'legendary',
    desc: '阴阳调和，天地至理，战力登峰造极。',
    powerRate: 1.60,
    bonusEffects: [
      { attr: 'talent', type: 'mult', value: 1.12, label: '天赋+12%' },
      { attr: 'lifespan', type: 'bonus', value: 60, label: '寿元+60' }
    ],
    level: 3,
    price: 13125  // 525 × 25
  },

  // ===== 元婴功法 =====
  {
    id: 'tech_beidou',
    name: '北极紫微诀',
    category: '元婴',
    rarity: 'epic',
    desc: '紫微星君传承，星辰之力加持神魂。',
    powerRate: 1.55,
    bonusEffects: [
      { attr: 'talent', type: 'mult', value: 1.15, label: '天赋+15%' },
      { attr: 'lifespan', type: 'bonus', value: 60, label: '寿元+60' }
    ],
    level: 4,
    price: 32760  // 2184 × 15
  },
  {
    id: 'tech_tianlong',
    name: '天龙御空诀',
    category: '元婴',
    rarity: 'rare',
    desc: '驾驭天龙之力，速度与力量并存。',
    powerRate: 1.35,
    bonusEffects: [
      { attr: 'talent', type: 'mult', value: 1.08, label: '天赋+8%' }
    ],
    level: 4,
    price: 17472  // 2184 × 8
  },
  {
    id: 'tech_diwan',
    name: '地煞轮回功',
    category: '元婴',
    rarity: 'rare',
    desc: '地煞之气淬体，生生不息。',
    powerRate: 1.32,
    bonusEffects: [
      { attr: 'lifespan', type: 'bonus', value: 30, label: '寿元+30' }
    ],
    level: 4,
    price: 17472  // 2184 × 8
  },
  {
    id: 'tech_hundun',
    name: '鸿蒙混沌经',
    category: '元婴',
    rarity: 'legendary',
    desc: '天地未开之时的功法，包罗万象，深不可测。',
    powerRate: 1.75,
    bonusEffects: [
      { attr: 'talent', type: 'mult', value: 1.18, label: '天赋+18%' },
      { attr: 'lifespan', type: 'bonus', value: 80, label: '寿元+80' }
    ],
    level: 4,
    price: 54600  // 2184 × 25
  },
  {
    id: 'tech_xuanmo',
    name: '九幽魔道篇',
    category: '元婴',
    rarity: 'legendary',
    desc: '魔道至尊功法，战力通天但代价惨重。',
    powerRate: 1.85,
    bonusEffects: [
      { attr: 'talent', type: 'mult', value: 1.10, label: '天赋+10%' },
      { attr: 'lifespan', type: 'bonus', value: -40, label: '寿元-40' }
    ],
    level: 4,
    price: 54600  // 2184 × 25
  },

];

// 功法栏容量
const TECHNIQUE_SLOTS = 4;

// 境界名称映射（与 game.js 中的 realms 对应）
const TECH_REALM_NAMES = ['炼气', '筑基', '金丹', '元婴', '化神'];

// 根据境界获取可用功法（当前境界及以下）
function getTechniquesByRealm(realmIndex) {
  const realmName = TECH_REALM_NAMES[realmIndex] || '炼气';
  return TECHNIQUES.filter(t => t.category === realmName);
}

// 随机获取当前境界的功法
function getRandomTechnique(excludeIds = [], realmIndex = 0) {
  const available = getTechniquesByRealm(realmIndex).filter(t => !excludeIds.includes(t.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TECHNIQUE_RARITY,
    TECHNIQUES,
    TECHNIQUE_SLOTS,
    TECH_REALM_NAMES,
    getTechniquesByRealm,
    getRandomTechnique
  };
}
