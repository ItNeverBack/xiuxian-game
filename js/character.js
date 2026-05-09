// ===== 角色系统模块 =====

// ===== 基础属性配置 =====
const ATTR_CONFIG = {
  cultivation: { name: '修为', min: 0, max: Infinity, icon: '⚡' },
  power: { name: '战力', min: 0, max: Infinity, icon: '💪' },
  talent: { name: '天赋', min: 0, max: 200, icon: '🧠' },
  luck: { name: '气运', min: 0, max: 200, icon: '🍀' },
  wealth: { name: '灵石', min: 0, max: Infinity, icon: '💰' },
  lifespan: { name: '寿元', min: 0, max: 999, icon: '⏳' }
};

// 随机基础属性
function generateBaseAttrs() {
  return {
    cultivation: 0,
    power: 0,
    talent: Math.floor(Math.random() * 41) + 70,   // 70-110
    luck: Math.floor(Math.random() * 51) + 50,     // 50-100
    wealth: Math.floor(Math.random() * 101),       // 0-100
    lifespan: Math.floor(Math.random() * 21) + 80 // 80-100
  };
}

// 境界名称映射（供 character.js 使用）
const REALM_NAMES = ['炼气', '筑基', '金丹', '元婴', '化神'];

// ===== 角色对象工厂 =====
function createCharacter() {
  return {
    // 基础属性
    baseAttrs: generateBaseAttrs(),
    attrs: {},
    
    // 当前境界索引
    realmIndex: 0,
    
    // 功法栏
    techniques: [],  // 已装备的功法对象
    
    // 法宝栏
    treasures: [],   // 已装备的法宝对象
    
    // 初始化
    init(realmIndex = 0) {
      this.realmIndex = realmIndex;
      this.attrs = { ...this.baseAttrs };
      this.equipRealmItems();
      this.calculatePower();
    },
    
    // 根据当前境界分配功法和法宝
    equipRealmItems() {
      // 清空现有装备
      this.techniques = [];
      this.treasures = [];
      
      // 根据境界分配功法（填满功法栏）
      const techExcludeIds = [];
      for (let i = 0; i < TECHNIQUE_SLOTS; i++) {
        const tech = getRandomTechnique(techExcludeIds, this.realmIndex);
        if (tech) {
          this.techniques.push(tech);
          techExcludeIds.push(tech.id);
        }
      }
      
      // 根据境界分配法宝（填满法宝栏）
      const treExcludeIds = [];
      for (let i = 0; i < TREASURE_SLOTS; i++) {
        const tre = getRandomTreasure(treExcludeIds, this.realmIndex);
        if (tre) {
          this.treasures.push(tre);
          treExcludeIds.push(tre.id);
        }
      }
      
      this.recalculate();
    },
    
    // 境界突破时调用，更新功法和法宝
    onRealmBreakthrough(newRealmIndex) {
      this.realmIndex = newRealmIndex;
      this.equipRealmItems();
    },
    
    // 计算战力：战力 = 修为 × 功法增幅 × 法宝增幅
    calculatePower() {
      const cultivation = this.attrs.cultivation || 0;
      
      // 获取功法增幅（取所有功法增幅的平均值，功法栏为空时默认0.5）
      let techRate = 0.5;
      if (this.techniques.length > 0) {
        techRate = this.techniques.reduce((sum, tech) => sum + tech.powerRate, 0);
        techRate = techRate / this.techniques.length;
      }
      
      // 获取法宝增幅（取所有法宝增幅的平均值，法宝栏为空时默认1.0）
      let treasureRate = 1.0;
      if (this.treasures.length > 0) {
        treasureRate = this.treasures.reduce((sum, tre) => sum + tre.powerBonus, 0);
        treasureRate = treasureRate / this.treasures.length;
      }
      
      this.attrs.power = Math.round(cultivation * techRate * treasureRate);
      return this.attrs.power;
    },
    
    // 装备功法（手动）
    equipTechnique(technique) {
      if (this.techniques.length >= TECHNIQUE_SLOTS) {
        return false;
      }
      this.techniques.push(technique);
      this.recalculate();
      return true;
    },
    
    // 卸下功法
    unequipTechnique(techId) {
      const idx = this.techniques.findIndex(t => t.id === techId);
      if (idx !== -1) {
        this.techniques.splice(idx, 1);
        this.recalculate();
        return true;
      }
      return false;
    },
    
    // 装备法宝
    equipTreasure(treasure) {
      if (this.treasures.length >= TREASURE_SLOTS) {
        return false;
      }
      this.treasures.push(treasure);
      this.recalculate();
      return true;
    },
    
    // 卸下法宝
    unequipTreasure(treId) {
      const idx = this.treasures.findIndex(t => t.id === treId);
      if (idx !== -1) {
        this.treasures.splice(idx, 1);
        this.recalculate();
        return true;
      }
      return false;
    },
    
    // 重新计算属性（基础 + 命运效果 + 功法额外效果）
    recalculate() {
      // 重置为基础属性
      this.attrs = { ...this.baseAttrs };
      
      // 应用功法额外效果（天赋、寿元等）
      this.techniques.forEach(tech => {
        if (tech.bonusEffects) {
          tech.bonusEffects.forEach(effect => {
            if (effect.type === 'mult') {
              this.attrs[effect.attr] = Math.round(this.attrs[effect.attr] * effect.value);
            } else if (effect.type === 'bonus') {
              this.attrs[effect.attr] += effect.value;
            }
          });
        }
      });
      
      // 重新计算战力（修为 × 功法系数 × 法宝加成）
      this.calculatePower();
    },
    
    // 获取属性显示
    getAttrDisplay(attr) {
      const base = this.baseAttrs[attr];
      const current = this.attrs[attr];
      const config = ATTR_CONFIG[attr];
      
      let diff = current - base;
      let diffStr = '';
      if (diff > 0) diffStr = `+${diff}`;
      else if (diff < 0) diffStr = `${diff}`;
      
      return {
        name: config.name,
        icon: config.icon,
        value: current,
        diff: diffStr,
        bonus: diff !== 0
      };
    },
    
    // 获取当前功法总系数
    getTotalPowerRate() {
      if (this.techniques.length === 0) return 1.0;
      return this.techniques.reduce((sum, tech) => sum + tech.powerRate, 0) / this.techniques.length;
    }
  };
}

// 导出供外部使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ATTR_CONFIG,
    REALM_NAMES,
    TECHNIQUE_RARITY,
    TREASURE_RARITY,
    RARITY_LEVEL,
    TECHNIQUE_SLOTS,
    TREASURE_SLOTS,
    TECHNIQUES,
    TREASURES,
    generateBaseAttrs,
    getTechniquesByRealm,
    getRandomTechnique,
    getTreasuresByRealm,
    getRandomTreasure,
    getMinRarityByRealm,
    createCharacter
  };
}
