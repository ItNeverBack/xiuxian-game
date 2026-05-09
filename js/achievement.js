// ===== 成就系统 =====

// 稀有度颜色映射
const RARITY_COLORS = {
  common: '#dde2f0',    // 普通 - 白色
  uncommon: '#5b8ce8',  // 精良 - 蓝色
  rare: '#9b6ee8',      // 稀有 - 紫色
  epic: '#e8884a',      // 史诗 - 橙色
  legendary: '#c9a84c'  // 传说 - 金色
};

// 分类名称映射
const CATEGORY_NAMES = {
  realm: '境界',
  event: '命运',
  time: '永恒',
  hidden: '隐藏',
  cultivation: '苦修',
  wealth: '财运',
  adventure: '仙缘',
  pill: '丹道',
  technique: '典籍',
  treasure: '珍藏'
};

// 成就列表
const achievements = [
  // ===== 单局成就 =====
  // 境界成就
  { id: 'R-01', name: '踏入仙途', desc: '突破至筑基期', category: 'realm', rarity: 'common', type: 'single', condition: { type: 'realm', value: 1 } },
  { id: 'R-02', name: '登堂入室', desc: '突破至金丹期', category: 'realm', rarity: 'common', type: 'single', condition: { type: 'realm', value: 2 } },
  { id: 'R-03', name: '神通初成', desc: '突破至元婴期', category: 'realm', rarity: 'uncommon', type: 'single', condition: { type: 'realm', value: 3 } },
  { id: 'R-04', name: '惊天动地', desc: '突破至化神期', category: 'realm', rarity: 'rare', type: 'single', condition: { type: 'realm', value: 4 } },

  // 事件成就
  { id: 'E-01', name: '吉星高照', desc: '单局内连续遇到3次好事', category: 'event', rarity: 'common', type: 'single', condition: { type: 'consecutiveGood', value: 3 } },
  { id: 'E-02', name: '否极泰来', desc: '单局内连续遇到3次坏事后遇到好事', category: 'event', rarity: 'common', type: 'single', condition: { type: 'consecutiveBadThenGood', value: 3 } },
  { id: 'E-03', name: '逢凶化吉', desc: '单局内突发事件完美脱身3次', category: 'event', rarity: 'common', type: 'single', condition: { type: 'perfectEscape', value: 3 } },
  { id: 'E-04', name: '天选之人', desc: '好事触发时气运超过150', category: 'event', rarity: 'uncommon', type: 'single', condition: { type: 'goodEventLuck', value: 150 } },
  { id: 'E-05', name: '大难不死', desc: '单次坏事损失超过寿元的10%但存活', category: 'event', rarity: 'rare', type: 'single', condition: { type: 'surviveBigLoss', value: 0.1 } },

  // 时间成就
  { id: 'Time-01', name: '百年修行', desc: '单局游戏时长达到100游戏年', category: 'time', rarity: 'common', type: 'single', condition: { type: 'gameYears', value: 100 } },
  { id: 'Time-02', name: '千载难逢', desc: '单局游戏时长达到1000游戏年', category: 'time', rarity: 'epic', type: 'single', condition: { type: 'gameYears', value: 1000 } },

  // 隐藏成就
  { id: 'H-01', name: '天命所归', desc: '初始气运超过140', category: 'hidden', rarity: 'uncommon', type: 'single', condition: { type: 'initialLuck', value: 140 }, hidden: true },
  { id: 'H-02', name: '天纵之才', desc: '初始天赋超过140', category: 'hidden', rarity: 'uncommon', type: 'single', condition: { type: 'initialTalent', value: 140 }, hidden: true },
  { id: 'H-03', name: '清心寡欲', desc: '单局内从未使用丹药', category: 'hidden', rarity: 'rare', type: 'single', condition: { type: 'noPillUsed', value: 1 }, hidden: true },
  { id: 'H-04', name: '家财万贯', desc: '单局内财富从未低于0', category: 'hidden', rarity: 'epic', type: 'single', condition: { type: 'wealthNeverNegative', value: 1 }, hidden: true },

  // ===== 累积成就 =====
  // 修炼成就
  { id: 'C-01', name: '初窥门径', desc: '累计修炼次数达到100次', category: 'cultivation', rarity: 'common', type: 'cumulative', condition: { type: 'totalCultivation', value: 100 } },
  { id: 'C-02', name: '持之以恒', desc: '累计修炼次数达到500次', category: 'cultivation', rarity: 'common', type: 'cumulative', condition: { type: 'totalCultivation', value: 500 } },
  { id: 'C-03', name: '勤学苦练', desc: '累计修炼次数达到1000次', category: 'cultivation', rarity: 'uncommon', type: 'cumulative', condition: { type: 'totalCultivation', value: 1000 } },
  { id: 'C-04', name: '废寝忘食', desc: '累计修炼次数达到5000次', category: 'cultivation', rarity: 'rare', type: 'cumulative', condition: { type: 'totalCultivation', value: 5000 } },
  { id: 'C-05', name: '修真传奇', desc: '累计修炼次数达到10000次', category: 'cultivation', rarity: 'epic', type: 'cumulative', condition: { type: 'totalCultivation', value: 10000 } },

  // 财富成就
  { id: 'M-01', name: '小康之家', desc: '累计获得灵石达到1,000', category: 'wealth', rarity: 'common', type: 'cumulative', condition: { type: 'totalWealth', value: 1000 } },
  { id: 'M-02', name: '富甲一方', desc: '累计获得灵石达到10,000', category: 'wealth', rarity: 'common', type: 'cumulative', condition: { type: 'totalWealth', value: 10000 } },
  { id: 'M-03', name: '富可敌国', desc: '累计获得灵石达到100,000', category: 'wealth', rarity: 'uncommon', type: 'cumulative', condition: { type: 'totalWealth', value: 100000 } },
  { id: 'M-04', name: '首富之路', desc: '累计获得灵石达到1,000,000', category: 'wealth', rarity: 'rare', type: 'cumulative', condition: { type: 'totalWealth', value: 1000000 } },

  // 奇遇成就
  { id: 'A-01', name: '初遇仙缘', desc: '完成第一个奇遇', category: 'adventure', rarity: 'common', type: 'cumulative', condition: { type: 'totalAdventure', value: 1 } },
  { id: 'A-02', name: '仙缘广结', desc: '累计完成5个奇遇', category: 'adventure', rarity: 'common', type: 'cumulative', condition: { type: 'totalAdventure', value: 5 } },
  { id: 'A-03', name: '奇遇连连', desc: '累计完成10个奇遇', category: 'adventure', rarity: 'uncommon', type: 'cumulative', condition: { type: 'totalAdventure', value: 10 } },
  { id: 'A-04', name: '仙缘深厚', desc: '累计完成15个奇遇', category: 'adventure', rarity: 'rare', type: 'cumulative', condition: { type: 'totalAdventure', value: 15 } },
  { id: 'A-05', name: '奇遇大师', desc: '累计完成所有22个奇遇', category: 'adventure', rarity: 'epic', type: 'cumulative', condition: { type: 'totalAdventure', value: 22 } },
  { id: 'A-06', name: '艺高胆大', desc: '单局内选择高风险选项并成功', category: 'adventure', rarity: 'common', type: 'single', condition: { type: 'highRiskSuccess', value: 1 } },

  // 丹药成就
  { id: 'P-01', name: '灵丹妙药', desc: '首次使用丹药', category: 'pill', rarity: 'common', type: 'cumulative', condition: { type: 'totalPill', value: 1 } },
  { id: 'P-02', name: '丹道初成', desc: '累计使用丹药达到10次', category: 'pill', rarity: 'common', type: 'cumulative', condition: { type: 'totalPill', value: 10 } },
  { id: 'P-03', name: '丹道宗师', desc: '累计使用丹药达到50次', category: 'pill', rarity: 'uncommon', type: 'cumulative', condition: { type: 'totalPill', value: 50 } },

  // 功法成就
  { id: 'Tc-01', name: '初窥典籍', desc: '首次获得功法', category: 'technique', rarity: 'common', type: 'cumulative', condition: { type: 'totalTechnique', value: 1 } },
  { id: 'Tc-02', name: '略有所得', desc: '累计获得3部功法', category: 'technique', rarity: 'common', type: 'cumulative', condition: { type: 'totalTechnique', value: 3 } },
  { id: 'Tc-03', name: '博览群书', desc: '累计获得6部功法', category: 'technique', rarity: 'uncommon', type: 'cumulative', condition: { type: 'totalTechnique', value: 6 } },
  { id: 'Tc-04', name: '学富五车', desc: '累计获得10部功法', category: 'technique', rarity: 'uncommon', type: 'cumulative', condition: { type: 'totalTechnique', value: 10 } },
  { id: 'Tc-05', name: '博古通今', desc: '累计获得15部功法', category: 'technique', rarity: 'rare', type: 'cumulative', condition: { type: 'totalTechnique', value: 15 } },
  { id: 'Tc-06', name: '典籍至尊', desc: '累计获得全部19部功法', category: 'technique', rarity: 'epic', type: 'cumulative', condition: { type: 'totalTechnique', value: 19 } },

  // 法宝成就
  { id: 'Tr-01', name: '初获法宝', desc: '首次获得法宝', category: 'treasure', rarity: 'common', type: 'cumulative', condition: { type: 'totalTreasure', value: 1 } },
  { id: 'Tr-02', name: '小有收获', desc: '累计获得5件法宝', category: 'treasure', rarity: 'common', type: 'cumulative', condition: { type: 'totalTreasure', value: 5 } },
  { id: 'Tr-03', name: '收藏初成', desc: '累计获得10件法宝', category: 'treasure', rarity: 'uncommon', type: 'cumulative', condition: { type: 'totalTreasure', value: 10 } },
  { id: 'Tr-04', name: '珍藏有加', desc: '累计获得15件法宝', category: 'treasure', rarity: 'uncommon', type: 'cumulative', condition: { type: 'totalTreasure', value: 15 } },
  { id: 'Tr-05', name: '鉴宝大师', desc: '累计获得25件法宝', category: 'treasure', rarity: 'rare', type: 'cumulative', condition: { type: 'totalTreasure', value: 25 } },
  { id: 'Tr-06', name: '珍藏至尊', desc: '累计获得全部约30件法宝', category: 'treasure', rarity: 'epic', type: 'cumulative', condition: { type: 'totalTreasure', value: 30 } }
];

// 成就统计
const TOTAL_ACHIEVEMENTS = achievements.length; // 45
const SINGLE_ACHIEVEMENTS = achievements.filter(a => a.type === 'single').length; // 15
const CUMULATIVE_ACHIEVEMENTS = achievements.filter(a => a.type === 'cumulative').length; // 30

// 获取成就数据
function getAchievementById(id) {
  return achievements.find(a => a.id === id);
}

// 获取分类成就
function getAchievementsByCategory(category) {
  return achievements.filter(a => a.category === category);
}

// 获取稀有度名称
function getRarityName(rarity) {
  const names = {
    common: '普通',
    uncommon: '精良',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  };
  return names[rarity] || rarity;
}
