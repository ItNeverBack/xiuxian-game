// ===== 游戏状态 =====
window.state = {
  year: 1,
  // 角色对象（包含属性、功法、法宝）
  character: null,
  // 兼容旧代码的属性引用
  attrs: {},
  baseAttrs: {},       // 基础属性（永久）
  bonusAttrs: {},      // 加成属性（来自功法/法宝的临时加成）
  realmIndex: 0,
  realmLayer: 1,
  realmMaxLayer: 5,  // 每境界5层
  selectedFate: { origin: null, talent: [], destiny: null },
  autoPlay: false,
  speed: 1,
  adventures: 1,
  waitingChoice: false,
  waitingBreakthrough: false,  // 等待突破事件处理
  breakthroughNo门Count: 0,   // 连续突破无门次数
  breakthroughStableCount: 0,  // 当前突破稳固根基次数
  breakthroughBonus: 0,        // 稳固根基累积加成(%)
  // 命运池相关
  fatePool: [],
  drawnFates: [],
  selectedFates: [],
  requiredSelections: 3,  // 必须选择3条命运
  // 奇遇状态
  currentAdventure: null,  // 当前奇遇对象
  currentRingIndex: 0,     // 当前第几环
  // 商店触发记录 { shopId: triggerCount }
  triggeredShops: {},
  // 已购买的丹药记录（每次商店出现时，每种丹药只能购买一次）
  pillsBought: [],
  // 已触发的奇遇记录（用于奇遇一次性触发）
  triggeredAdventures: [],
  // 装备栏
  equippedTechnique: null,  // 已装备的功法ID（只允许1个）
  equippedTreasure: null,   // 已装备的法宝ID（只允许1个）
  // 物品栏
  inventory: [],  // { id, type, realmIndex, rarity }
  // 是否是新游戏（首次进入游戏页面）
  isNewGame: false,
  // 是否已触发第一年事件
  firstYearTriggered: false,
  // 当前年份的事件HTML（用于存档）
  currentYearEvent: '',
};

// 境界修为范围配置
// 修为极限值 = 寿元 × 3/4 × 修为倍率 × 100
// 炼气：100×0.75×0.12×100=900，取整1000
// 筑基：200×0.75×0.60×100=9000
// 金丹：300×0.75×3.0×100=67500，取整150000
// 元婴：500×0.75×15×100=562500，取整1250000
// 化神：1000×0.75×75×100=5625000，取整12500000
const realmCultivationRanges = {
  lianqi:   { base: 0,      max: 1000,    span: 1000 },
  zhuji:    { base: 1000,   max: 15000,   span: 14000 },
  jindan:   { base: 15000,  max: 150000,  span: 135000 },
  yuanying: { base: 150000, max: 1250000, span: 1100000 },
  huashen:  { base: 1250000, max: 12500000, span: 11250000 }
};

// 各小境界修为阈值（5层：前期、中期、后期、巅峰、圆满）
// 计算方式：base + span × (layer-1)/5 到 base + span × layer/5
const realmStageThresholds = {
  lianqi: [
    0,    // 前期：0-200
    200,  // 中期：200-400
    400,  // 后期：400-600
    600,  // 巅峰：600-800
    800   // 圆满：800-1000
  ],
  zhuji: [
    1000,   // 前期：1000-3800
    3800,   // 中期：3800-6600
    6600,   // 后期：6600-9400
    9400,   // 巅峰：9400-12200
    12200   // 圆满：12200-15000
  ],
  jindan: [
    15000,   // 前期：15000-42000
    42000,   // 中期：42000-69000
    69000,   // 后期：69000-96000
    96000,   // 巅峰：96000-123000
    123000   // 圆满：123000-150000
  ],
  yuanying: [
    150000,   // 前期：150000-370000
    370000,   // 中期：370000-590000
    590000,   // 后期：590000-810000
    810000,   // 巅峰：810000-1030000
    1030000   // 圆满：1030000-1250000
  ],
  huashen: [
    1250000,    // 前期：1250000-3500000
    3500000,    // 中期：3500000-5750000
    5750000,    // 后期：5750000-8000000
    8000000,    // 巅峰：8000000-10250000
    10250000    // 圆满：10250000-12500000
  ]
};

const realms = [
  { name: '炼气期', layers: 5, lifeBonus: 0, baseCultivation: 0, stageNames: ['前期', '中期', '后期', '巅峰', '圆满'], key: 'lianqi' },
  { name: '筑基期', layers: 5, lifeBonus: 100, baseCultivation: 1000, stageNames: ['前期', '中期', '后期', '巅峰', '圆满'], key: 'zhuji' },
  { name: '金丹期', layers: 5, lifeBonus: 200, baseCultivation: 15000, stageNames: ['前期', '中期', '后期', '巅峰', '圆满'], key: 'jindan' },
  { name: '元婴期', layers: 5, lifeBonus: 300, baseCultivation: 150000, stageNames: ['前期', '中期', '后期', '巅峰', '圆满'], key: 'yuanying' },
  { name: '化神期', layers: 5, lifeBonus: 500, baseCultivation: 1250000, stageNames: ['前期', '中期', '后期', '巅峰', '圆满'], key: 'huashen', maxCultivation: 12500000 }
];

// ===== 粒子背景 =====
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function initStars() {
    stars = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;
    stars.forEach(s => {
      const alpha = 0.1 + 0.5 * Math.abs(Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  
  resize();
  initStars();
  draw();
  window.addEventListener('resize', () => { resize(); initStars(); });
})();

// ===== 工具提示 =====
function showTooltip(el, text, duration = 1500) {
  const tt = document.getElementById('tooltip');
  if (!tt) return;
  const rect = el.getBoundingClientRect();
  tt.textContent = text;
  tt.style.left = rect.left + 'px';
  tt.style.top = (rect.top - 44) + 'px';
  tt.classList.add('visible');
  setTimeout(() => tt.classList.remove('visible'), duration);
}

// ===== 页面切换 =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
  }
}

// ===== 命运池系统 =====

// 初始化角色
function initCharacter() {
  state.character = createCharacter();
  state.character.init(0);
  // 设置炼气期起步修为为0
  state.character.attrs.cultivation = realms[0].baseCultivation;
  state.character.baseAttrs.cultivation = realms[0].baseCultivation;
  // 兼容旧代码
  state.baseAttrs = state.character.baseAttrs;
  state.attrs = state.character.attrs;
  // 初始化加成属性
  state.bonusAttrs = {
    talent: 0,
    luck: 0,
    wealth: 0,
    lifespan: 0
  };
  // 初始化 attrs（后续直接从 baseAttrs + bonusAttrs 计算）
  state.attrs.talent = state.baseAttrs.talent;
  state.attrs.luck = state.baseAttrs.luck;
  state.attrs.wealth = state.baseAttrs.wealth;
  state.attrs.lifespan = state.baseAttrs.lifespan;
}

// 应用命运效果到基础属性（只在游戏开始时调用一次）
function applyFateEffectsToBase() {
  state.selectedFates.forEach(fate => {
    if (fate.effects) {
      fate.effects.forEach(effect => {
        if (effect.attr === 'talent' || effect.attr === 'luck' || effect.attr === 'wealth' || effect.attr === 'lifespan') {
          if (effect.type === 'mult') {
            state.baseAttrs[effect.attr] = Math.round(state.baseAttrs[effect.attr] * effect.value);
          } else if (effect.type === 'add' || effect.type === 'bonus') {
            state.baseAttrs[effect.attr] += effect.value;
          }
        }
      });
    }
  });
}

// 随机初始属性
function randomizeBaseAttrs() {
  // 重新生成角色基础属性
  state.character.baseAttrs = generateBaseAttrs();
  // 设置炼气期起步修为为0
  state.character.baseAttrs.cultivation = realms[0].baseCultivation;
  state.character.attrs = { ...state.character.baseAttrs };
  // 兼容旧代码
  state.baseAttrs = state.character.baseAttrs;
  state.attrs = state.character.attrs;
}

// 获取角色属性（兼容函数）
function getCharacterAttr(attr) {
  if (state.character) {
    return state.character.attrs[attr];
  }
  return state.attrs[attr] || 0;
}

// 抽取命运
function drawFate() {
  // 重新随机初始属性
  randomizeBaseAttrs();
  
  const container = document.getElementById('fate-cards-pool');
  const btn = document.getElementById('btn-draw');
  const redrawBtn = document.getElementById('btn-redraw');
  
  // 清空现有显示
  container.innerHTML = '';
  state.drawnFates = [];
  state.selectedFates = [];
  
  // 记录已抽取的命运ID，用于去重
  const drawnIds = new Set();
  
  // 分离各类别命运
  const originFates = allFates.filter(f => f.category === '出身');
  const otherFates = allFates.filter(f => f.category !== '出身');
  
  // 计算非出身命运的总权重
  const totalWeight = Object.values(rarityWeights).reduce((a, b) => a + b, 0);
  
  // 50%概率包含出身命运，最多1条
  const includeOrigin = Math.random() < 0.5;
  
  if (includeOrigin && originFates.length > 0) {
    // 抽取1条出身命运
    const originFate = originFates[Math.floor(Math.random() * originFates.length)];
    state.drawnFates.push(originFate);
    drawnIds.add(originFate.id);
  }
  
  // 抽取剩余命运（从非出身类别）
  const remaining = 9 - state.drawnFates.length;
  for (let i = 0; i < remaining; i++) {
    let r = Math.random() * totalWeight;
    let selectedRarity = 'uncommon';
    
    // 尝试找到可用的命运（去重）
    let attempts = 0;
    let selectedFate = null;
    
    while (attempts < 20 && !selectedFate) {
      // 根据权重选择稀有度
      r = Math.random() * totalWeight;
      for (const [rarity, weight] of Object.entries(rarityWeights)) {
        r -= weight;
        if (r <= 0) {
          selectedRarity = rarity;
          break;
        }
      }
      
      // 从该稀有度的非出身命运中，排除已抽取的
      const candidates = otherFates.filter(f => f.rarity === selectedRarity && !drawnIds.has(f.id));
      
      if (candidates.length > 0) {
        selectedFate = candidates[Math.floor(Math.random() * candidates.length)];
      }
      
      attempts++;
    }
    
    // 如果找到了可用的命运，添加到结果中
    if (selectedFate) {
      state.drawnFates.push(selectedFate);
      drawnIds.add(selectedFate.id);
    }
  }
  
  // 渲染抽取的命运卡片
  state.drawnFates.forEach((fate, index) => {
    const card = createFateCard(fate, index);
    container.appendChild(card);
  });
  
  // 更新计数
  updateDrawnCount();
  
  // 更新属性显示
  updateFateAttrsDisplay();
  
  // 隐藏抽取按钮，显示重新抽取按钮
  btn.style.display = 'none';
  if (redrawBtn) {
    redrawBtn.style.display = 'inline-block';
  }
}

// 重新抽取
function redrawFate() {
  randomizeBaseAttrs();
  const el = document.getElementById('fate-attr-talent');
  if (el) {
    el.textContent = state.baseAttrs.talent;
  }
  const luckEl = document.getElementById('fate-attr-luck');
  if (luckEl) {
    luckEl.textContent = state.baseAttrs.luck;
  }
  const wealthEl = document.getElementById('fate-attr-wealth');
  if (wealthEl) {
    wealthEl.textContent = state.baseAttrs.wealth;
  }
  const lifespanEl = document.getElementById('fate-attr-lifespan');
  if (lifespanEl) {
    lifespanEl.textContent = state.baseAttrs.lifespan;
  }
  drawFate();
}

// 创建命运卡片
function createFateCard(fate, index) {
  const card = document.createElement('div');
  card.className = `fate-card-pool rarity-${fate.rarity}`;
  card.dataset.index = index;
  
  const effectsHtml = fate.effects.map(e => 
    `<span class="fate-card-effect">${e.label}</span>`
  ).join('');
  
  card.innerHTML = `
    <div class="fate-card-header">
      <span class="fate-card-icon">${fate.icon}</span>
      <div class="fate-card-name-group">
        <div class="fate-card-name">${fate.name}</div>
        <div class="fate-card-category">${fate.category}</div>
      </div>
      <span class="fate-card-rarity">${fate.rarityName}</span>
    </div>
    <div class="fate-card-desc">${fate.desc}</div>
    <div class="fate-card-effects">${effectsHtml}</div>
  `;
  
  card.addEventListener('click', () => selectFateCard(card, index));
  
  return card;
}

// 选择命运卡片
function selectFateCard(card, index) {
  const fate = state.drawnFates[index];
  
  if (card.classList.contains('selected')) {
    // 取消选择
    card.classList.remove('selected');
    state.selectedFates = state.selectedFates.filter(f => f.index !== index);
  } else {
    // 检查是否达到上限
    if (state.selectedFates.length >= state.requiredSelections) {
      showTooltip(card, `最多选择 ${state.requiredSelections} 条命运`, 2000);
      return;
    }
    // 添加选择
    card.classList.add('selected');
    state.selectedFates.push({ ...fate, index });
  }
  
  // 更新选中状态显示
  updateDrawnCount();
  updateFateAttrsDisplay();
}

// 更新抽取计数
function updateDrawnCount() {
  const countEl = document.getElementById('drawn-count');
  const btn = document.getElementById('btn-start-game');
  
  if (countEl) {
    countEl.textContent = state.selectedFates.length;
  }
  
  if (btn) {
    btn.disabled = state.selectedFates.length !== state.requiredSelections;
  }
}

// 计算当前属性（基础属性 + 已选命运效果）
function calculateCurrentAttrs() {
  const currentAttrs = { ...state.baseAttrs };
  
  state.selectedFates.forEach(fate => {
    if (fate.effects) {
      fate.effects.forEach(effect => {
        if (effect.type === 'mult') {
          currentAttrs[effect.attr] = Math.round(currentAttrs[effect.attr] * effect.value);
        } else if (effect.type === 'add' || effect.type === 'bonus') {
          currentAttrs[effect.attr] += effect.value;
        }
      });
    }
  });
  
  return currentAttrs;
}

// 更新命运页面属性显示
function updateFateAttrsDisplay() {
  const currentAttrs = calculateCurrentAttrs();
  
  // 只更新显示的属性：天赋、气运、财富、寿元
  const displayAttrs = ['talent', 'luck', 'wealth', 'lifespan'];
  
  displayAttrs.forEach(attr => {
    const el = document.getElementById(`fate-attr-${attr}`);
    const bonusEl = document.getElementById(`fate-attr-${attr}-bonus`);
    if (el) {
      const baseVal = state.baseAttrs[attr];
      const currentVal = currentAttrs[attr];
      el.textContent = currentVal;
      
      if (bonusEl && currentVal !== baseVal) {
        const diff = currentVal - baseVal;
        const sign = diff > 0 ? '+' : '';
        bonusEl.textContent = `(${sign}${diff})`;
        bonusEl.style.display = 'inline';
      } else if (bonusEl) {
        bonusEl.style.display = 'none';
      }
    }
  });
}

// ===== 开始游戏 =====
function showFatePage() {
  // 重置命运池状态
  state.drawnFates = [];
  state.selectedFates = [];
  
  // 重置抽取按钮
  const btn = document.getElementById('btn-draw');
  if (btn) {
    btn.disabled = false;
    btn.textContent = '🎲 抽取命运';
    btn.style.opacity = '1';
  }
  
  // 清空卡片
  const container = document.getElementById('fate-cards-pool');
  if (container) {
    container.innerHTML = `
      <div class="fate-empty-state">
        <div class="empty-icon">🎴</div>
        <p>点击上方按钮抽取命运</p>
      </div>
    `;
  }
  
  showPage('page-fate');
}

function startGame() {
  if (state.selectedFates.length !== state.requiredSelections) return;
  
  // 应用命运效果到基础属性（只调用一次）
  applyFateEffectsToBase();
  
  // 同步更新 attrs
  state.attrs.talent = state.baseAttrs.talent;
  state.attrs.luck = state.baseAttrs.luck;
  state.attrs.wealth = state.baseAttrs.wealth;
  state.attrs.lifespan = state.baseAttrs.lifespan;
  
  // 标记为新游戏
  state.isNewGame = true;
  
  // 保存到localStorage
  saveGameState();
  
  // 跳转到游戏页面
  window.location.href = 'game.html';
}

// ===== 更新UI =====
function updateAttrs() {
  const cultivationEl = document.getElementById('attr-cultivation');
  const powerEl = document.getElementById('attr-power');
  const talentEl = document.getElementById('attr-talent');
  const luckEl = document.getElementById('attr-luck');
  const wealthEl = document.getElementById('attr-wealth');
  const lifespanEl = document.getElementById('attr-lifespan');
  const topbarYearEl = document.getElementById('topbar-year');
  const statYearsEl = document.getElementById('stat-years');
  const statAdventuresEl = document.getElementById('stat-adventures');

  if (cultivationEl) cultivationEl.textContent = state.attrs.cultivation.toLocaleString();
  if (powerEl) powerEl.textContent = state.attrs.power.toLocaleString();
  if (talentEl) talentEl.textContent = state.attrs.talent;
  if (luckEl) luckEl.textContent = state.attrs.luck;
  if (wealthEl) wealthEl.textContent = state.attrs.wealth.toLocaleString();
  if (lifespanEl) lifespanEl.textContent = state.attrs.lifespan;
  if (topbarYearEl) topbarYearEl.textContent = state.year;
  if (statYearsEl) statYearsEl.textContent = state.year + ' 年';
  if (statAdventuresEl) statAdventuresEl.textContent = state.adventures + ' 次';

  const realm = realms[state.realmIndex];
  const pct = Math.floor(state.realmLayer / realm.layers * 100);
  
  const progressRealmEl = document.getElementById('progress-realm');
  const progressRealmTextEl = document.getElementById('progress-realm-text');
  const charTitleEl = document.getElementById('char-title');
  const topbarRealmEl = document.getElementById('topbar-realm');

  if (progressRealmEl) progressRealmEl.style.width = pct + '%';
  const stageName = realm.stageNames[state.realmLayer - 1] || `第${state.realmLayer}层`;
  if (progressRealmTextEl) progressRealmTextEl.textContent = `${realm.name}${stageName}`;
  if (charTitleEl) charTitleEl.textContent = `${realm.name}${stageName}`;
  if (topbarRealmEl) topbarRealmEl.textContent = realm.name + (state.realmIndex < 9 ? stageName : '');
  
  updateRealmTree();
}

// ===== 推进一年 =====
let autoTimer = null;

function nextYear() {
  if (state.waitingChoice) return;

  // 寿元耗尽检查（寿元<=0时结束游戏）
  if (state.attrs.lifespan <= 0) {
    triggerDeathEnding('lifespan');
    return;
  }

  // 检查是否需要触发突破事件
  if (isAtStageLimit() && !state.waitingBreakthrough) {
    state.waitingBreakthrough = true;
    console.log(`[第${state.year + 1}年] 触发突破事件`);
    triggerBreakthroughEvent();
    return;
  }
  
  if (state.waitingBreakthrough) return;

  state.year++;

  // 更新年份显示
  const topbarYearEl = document.getElementById('topbar-year');
  const statYearsEl = document.getElementById('stat-years');
  if (topbarYearEl) topbarYearEl.textContent = state.year;
  if (statYearsEl) statYearsEl.textContent = state.year + ' 年';

  // 首次触发事件时添加"第一年"标记
  if (!state.firstYearTriggered) {
    state.firstYearTriggered = true;
    addYearMarker('— 踏入修行 · 第一年 —');
  } else {
    addYearMarker(`— 第 ${state.year} 年 —`);
  }

  const ep = window.pickEvent(state.realmIndex);
  console.log(`[第${state.year}年] 选中事件类型: ${ep.type}, isChoice: ${ep.isChoice}`);

  // 处理事件
  if (ep.type === 'adventure' && ep.isChoice) {
    // 奇遇事件
    state.waitingChoice = true;
    const btnNextYear = document.getElementById('btn-next-year');
    if (btnNextYear) btnNextYear.disabled = true;

    if (state.currentAdventure === null) {
      // 开始新奇遇
      state.adventures++;
      const statAdventuresEl = document.getElementById('stat-adventures');
      if (statAdventuresEl) statAdventuresEl.textContent = state.adventures + ' 次';
      
      // 筛选出未触发的奇遇
      const triggeredAdventures = state.triggeredAdventures || [];
      const availableAdventures = ep.templates.filter(a => !triggeredAdventures.includes(a.title));
      
      // 如果没有可用奇遇，跳过奇遇事件，重新选择其他事件
      if (availableAdventures.length === 0) {
        console.log(`[第${state.year}年] 奇遇无可用事件，重新选择`);
        state.waitingChoice = false;
        const btnNextYear = document.getElementById('btn-next-year');
        if (btnNextYear) btnNextYear.disabled = false;
        // 重新选择事件（排除奇遇）
        const newEp = window.pickEvent(state.realmIndex, true);
        if (newEp) {
          console.log(`[第${state.year}年] 重新选中: ${newEp.type}`);
          processEvent(newEp);
        }
        return;
      }
      
      const adventure = availableAdventures[Math.floor(Math.random() * availableAdventures.length)];
      console.log(`[第${state.year}年] 触发奇遇: ${adventure.title}`);
      
      // 确保奇遇有 rings 属性
      if (!adventure.rings || !Array.isArray(adventure.rings)) {
        console.log(`[第${state.year}年] 奇遇无rings，跳过`);
        state.waitingChoice = false;
        const btnNextYear = document.getElementById('btn-next-year');
        if (btnNextYear) btnNextYear.disabled = false;
        return;
      }
      
      // 标记该奇遇已触发（无论结果如何）
      if (!state.triggeredAdventures) state.triggeredAdventures = [];
      state.triggeredAdventures.push(adventure.title);
      
      state.currentAdventure = adventure;
      state.currentRingIndex = 0;
      
      addMultiRingChoice(adventure, 0);
    } else {
      // 继续当前奇遇的下一环
      addMultiRingChoice(state.currentAdventure, state.currentRingIndex);
    }
  } else if (ep.type === 'shop') {
    // 商店事件：显示商店UI
    console.log(`[第${state.year}年] 触发商店事件`);
    const shopEvent = ep.templates[Math.floor(Math.random() * ep.templates.length)];
    state.waitingChoice = true;
    state.currentShop = shopEvent;
    const btnNextYear = document.getElementById('btn-next-year');
    if (btnNextYear) btnNextYear.disabled = true;
    addShopUI(shopEvent);
  } else if (ep.type === 'pillshop') {
    // 丹药商店事件：显示丹药商店UI
    console.log(`[第${state.year}年] 触发丹药商店事件`);
    const shopEvent = ep.templates[Math.floor(Math.random() * ep.templates.length)];
    state.waitingChoice = true;
    state.currentShop = shopEvent;
    const btnNextYear = document.getElementById('btn-next-year');
    if (btnNextYear) btnNextYear.disabled = true;
    addPillShopUI(shopEvent);
  } else if (ep.type === 'base') {
    // 基础事件：根据财富判断触发修炼还是财富事件
    const cultivationCost = window.CULTIVATION_COST?.[state.realmIndex] || 10;
    let tmpl;
    const eventType = state.attrs.wealth >= cultivationCost ? 'cultivation' : 'wealth';
    console.log(`[第${state.year}年] 触发基础事件: ${eventType} (财富${state.attrs.wealth} vs 消耗${cultivationCost})`);
    
    if (state.attrs.wealth >= cultivationCost) {
      // 财富足够，触发修炼事件
      tmpl = ep.cultivationTemplates[Math.floor(Math.random() * ep.cultivationTemplates.length)](state);
      addEvent('cultivation', tmpl.text, tmpl.deltas);
      
      // 记录修炼次数
      let totalCultivation = parseInt(localStorage.getItem('totalCultivation') || '0') + 1;
      localStorage.setItem('totalCultivation', totalCultivation.toString());
    } else {
      // 财富不足，触发财富事件
      tmpl = ep.wealthTemplates[Math.floor(Math.random() * ep.wealthTemplates.length)](state);
      addEvent('wealth', tmpl.text, tmpl.deltas);
      
      // 记录财富获取（如果财富增加了）
      if (tmpl.dAttr && tmpl.dAttr.wealth > 0) {
        let totalWealth = parseInt(localStorage.getItem('totalWealthGained') || '0') + tmpl.dAttr.wealth;
        localStorage.setItem('totalWealthGained', totalWealth.toString());
      }
    }
    
    // 应用属性变化
    if (tmpl.dAttr) {
      applyAttrDelta(tmpl.dAttr);
    }
    
    // 修为上限检查：确保不超过当前小境界上限
    clampCultivation();
    
    // 检查是否到达突破点
    if (tryAdvanceRealm(0)) {
      // 到达突破点，触发突破事件
      console.log(`[第${state.year}年] 修为达到上限，触发突破`);
      triggerBreakthroughEvent();
      return;
    }
    
    updateAttrs();
    saveGameState();
  } else {
    let tmpl;
    if (ep.type === 'emergency') {
      // 突发事件：处理多结果判定
      const emergency = ep.templates[Math.floor(Math.random() * ep.templates.length)];
      console.log(`[第${state.year}年] 触发突发事件: ${emergency.title}`);
      tmpl = window.processEmergencyEvent(emergency);
      tmpl.deltas = window.generateDeltas(tmpl.dAttr);
    } else {
      console.log(`[第${state.year}年] 触发好事/坏事事件: ${ep.type}`);
      tmpl = ep.templates[Math.floor(Math.random() * ep.templates.length)](state);
    }
    addEvent(ep.type, tmpl.text, tmpl.deltas);

    // 应用属性变化
    if (tmpl.dAttr) {
      applyAttrDelta(tmpl.dAttr);
    }

    // 修为上限检查：确保不超过当前小境界上限
    clampCultivation();

    // 检查是否到达突破点
    if (tryAdvanceRealm(0)) {
      // 到达突破点，触发突破事件
      triggerBreakthroughEvent();
      return;
    }

    updateAttrs();
    saveGameState();
  }

  // 年末处理：寿元扣减和检查
  processYearEnd();

  // 检查结局
  if (state.realmIndex >= realms.length - 1) {
    setTimeout(() => showEnding(), 1000);
  }
}

// 年末处理：寿元扣减和检查
function processYearEnd() {
  // 每过一年，寿元减1（从基础寿元中扣除）
  state.baseAttrs.lifespan = Math.max(0, (state.baseAttrs.lifespan || 0) - 1);
  state.attrs.lifespan = state.baseAttrs.lifespan + (state.bonusAttrs?.lifespan || 0);

  // 更新寿元显示
  const lifespanEl = document.getElementById('attr-lifespan');
  if (lifespanEl) lifespanEl.textContent = state.attrs.lifespan;

  // 寿元耗尽检查（会在下一年开始时触发结束）
  // 这里不立即结束，让玩家能进行完当前事件
}

// 触发突破事件
function triggerBreakthroughEvent() {
  const realm = realms[state.realmIndex];
  const isMajor = isMajorBreakthrough();
  const stageName = realm.stageNames[state.realmLayer - 1];
  
  if (isMajor) {
    // 大境界突破事件
    const tmpl = getMajorBreakthroughTemplate(realm, stageName);
    addBreakthroughChoice(tmpl);
  } else {
    // 小境界突破事件
    const tmpl = getMinorBreakthroughTemplate(realm, stageName);
    addBreakthroughChoice(tmpl);
  }
  
  state.waitingChoice = true;
  const btnNextYear = document.getElementById('btn-next-year');
  if (btnNextYear) btnNextYear.disabled = true;
}

// 计算突破加成
function getBreakthroughBonus(ss) {
  // 气运加成：每10点气运 +1% 成功率
  const luckBonus = Math.floor(ss.attrs.luck / 10) * 0.01;
  // 天赋加成：每50点天赋 +2% 成功率
  const talentBonus = Math.floor(ss.attrs.talent / 50) * 0.02;
  // 境界惩罚：境界越高，基础成功率越低
  const realmPenalty = ss.realmIndex * 0.05;
  // 稳固根基加成：每次+3%，最多5次（15%）
  const stableBonus = ss.breakthroughBonus * 0.01;
  
  return { luckBonus, talentBonus, realmPenalty, stableBonus };
}

// 稳固根基描述库
const stableFoundationDescs = [
  '静心凝神，调息养气...',
  '吐纳灵气，巩固丹田...',
  '疏通经脉，稳固真元...',
  '收敛心神，夯实基础...',
  '感悟天地，沉淀道心...',
  '洗涤灵台，净化识海...',
  '凝神静气，打磨根基...',
  '以静制动，厚积薄发...',
  '收摄心神，稳固道基...',
  '闭目养神，涵养真气...',
  '冥想打坐，梳理灵力...',
  '调息入定，夯实修为...',
  '平心静气，温养丹田...',
  '守一抱元，稳固本源...',
  '敛神内视，沉淀精华...',
];

// 获取随机稳固根基描述
function getRandomStableDesc() {
  return stableFoundationDescs[Math.floor(Math.random() * stableFoundationDescs.length)];
}

// 计算当前突破成功率
function calculateSuccessRate(ss, baseRate) {
  const bonus = getBreakthroughBonus(ss);
  return Math.min(0.95, baseRate - bonus.realmPenalty + bonus.luckBonus + bonus.talentBonus + bonus.stableBonus);
}

// 获取小境界突破模板
function getMinorBreakthroughTemplate(realm, stageName) {
  const bonus = getBreakthroughBonus(state);
  const baseRate = 0.70;
  const currentRate = calculateSuccessRate(state, baseRate);
  const canUseStable = state.breakthroughBonus < 15 && currentRate < 0.90;
  
  return {
    title: '🔮 小境界突破',
    desc: `你的修为已至<span class="event-highlight">${realm.name}${stageName}</span>极限，丹田饱满，真气充盈。是否尝试突破至${realm.name}${realm.stageNames[state.realmLayer] || '下一境界'}？`,
    isMajor: false,
    currentRate: currentRate,
    choices: [
      { 
        icon: '⚡', text: '尝试突破', 
        hint: `成功率约${Math.round(currentRate * 100)}%`, 
        risk: 'mid', 
        enabled: true,
        result: (ss) => {
          const successRate = calculateSuccessRate(ss, 0.70);
          const hintText = `成功率约${Math.round(successRate * 100)}%`;
          
          if (Math.random() < successRate) {
            return { breakthroughType: 'success', hint: hintText };
          } else {
            return { breakthroughType: 'no门', hint: hintText };
          }
        }
      },
      { 
        icon: '🧘', text: '稳固根基', 
        hint: canUseStable ? `成功率+3%` : '根基已稳，无需再固', 
        risk: 'safe', 
        enabled: canUseStable,
        result: (ss) => {
          // 增加稳固根基次数和累积加成
          state.breakthroughStableCount++;
          state.breakthroughBonus = Math.min(15, state.breakthroughBonus + 3);
          // 稳固根基不增加无门次数
          state.breakthroughNo门Count = 0;
          const newRate = calculateSuccessRate(state, 0.70);
          const stableDesc = getRandomStableDesc();
          return { 
            breakthroughType: 'stable', 
            hint: `成功率约${Math.round(newRate * 100)}%`, 
            eventText: `🧘 ${stableDesc}道心更加稳固！`
          };
        }
      },
    ]
  };
}

// 获取大境界突破模板
function getMajorBreakthroughTemplate(realm, stageName) {
  const nextRealm = realms[state.realmIndex + 1];
  const isLastRealm = state.realmIndex === realms.length - 1;
  const targetName = isLastRealm ? '化神圆满' : `${nextRealm.name}${nextRealm.stageNames[0]}`;
  
  // 根据境界设置基础成功率（境界越高，难度越大）
  // 炼气/筑基：40%/25%，金丹：30%/18%，元婴：20%/12%
  let fullBaseRate = 0.40;
  let cautiousBaseRate = 0.25;
  if (state.realmIndex === 2) { // 金丹期
    fullBaseRate = 0.30;
    cautiousBaseRate = 0.18;
  } else if (state.realmIndex === 3) { // 元婴期
    fullBaseRate = 0.20;
    cautiousBaseRate = 0.12;
  }
  
  // 计算全力突破和谨慎尝试的当前成功率
  const fullRate = calculateSuccessRate(state, fullBaseRate);
  const cautiousRate = calculateSuccessRate(state, cautiousBaseRate);
  const canUseStable = state.breakthroughBonus < 15 && fullRate < 0.90;
  
  return {
    title: '⚠️ 大境界突破',
    desc: `你的修为已至<span class="event-highlight">${realm.name}${stageName}</span>，即将冲击${targetName}！此乃生死之关，务必慎重！`,
    isMajor: true,
    currentRate: fullRate,
    choices: [
      { 
        icon: '⚡', text: '全力突破', 
        hint: `成功率约${Math.round(fullRate * 100)}%`, 
        risk: 'high', 
        enabled: true,
        result: (ss) => {
          const successRate = calculateSuccessRate(ss, fullBaseRate);
          const hintText = `成功率约${Math.round(successRate * 100)}%`;
          // 失败率25%，死亡率10%，无门率 = 1 - 成功率 - 失败率 - 死亡率
          const failRate = 0.25;
          const deathRate = 0.10;
          
          const roll = Math.random();
          let result = { hint: hintText };
          
          if (roll < successRate) {
            result.breakthroughType = 'success';
          } else if (roll < successRate + failRate) {
            result.breakthroughType = 'fail';
          } else if (roll < successRate + failRate + deathRate) {
            result.breakthroughType = 'death';
          } else {
            result.breakthroughType = 'no门';
          }
          return result;
        }
      },
      { 
        icon: '🔮', text: '谨慎尝试', 
        hint: `成功率约${Math.round(cautiousRate * 100)}%`, 
        risk: 'mid', 
        enabled: true,
        result: (ss) => {
          const bonus = getBreakthroughBonus(ss);
          // 天赋气运加成翻倍
          const successRate = Math.max(0.10, cautiousBaseRate - bonus.realmPenalty + bonus.luckBonus * 1.5 + bonus.talentBonus * 1.5 + bonus.stableBonus);
          // 失败率15%，死亡率10%，无门率较高
          const failRate = 0.15;
          const deathRate = 0.10;
          
          const roll = Math.random();
          let result = { hint: `成功率约${Math.round(successRate * 100)}%` };
          
          if (roll < successRate) {
            result.breakthroughType = 'success';
          } else if (roll < successRate + failRate) {
            result.breakthroughType = 'fail';
          } else if (roll < successRate + failRate + deathRate) {
            result.breakthroughType = 'death';
          } else {
            result.breakthroughType = 'no门';
          }
          return result;
        }
      },
      { 
        icon: '🏯', text: '稳固根基', 
        hint: canUseStable ? `成功率+3%` : '根基已稳，无需再固', 
        risk: 'safe', 
        enabled: canUseStable,
        result: (ss) => {
          // 增加稳固根基次数和累积加成
          state.breakthroughStableCount++;
          state.breakthroughBonus = Math.min(15, state.breakthroughBonus + 3);
          // 稳固根基不增加无门次数
          state.breakthroughNo门Count = 0;
          const newRate = calculateSuccessRate(state, fullBaseRate);
          const stableDesc = getRandomStableDesc();
          return { 
            breakthroughType: 'stable', 
            hint: `成功率约${Math.round(newRate * 100)}%`,
            eventText: `🏯 ${stableDesc}道心更加稳固！`
          };
        }
      },
    ]
  };
}

// 添加突破选择事件
function addBreakthroughChoice(tmpl) {
  const feed = document.getElementById('event-feed');
  if (!feed) return;
  
  const btnHtml = tmpl.choices.map((c, i) => `
    <button class="choice-btn ${c.risk === 'high' ? 'risk-high' : c.risk === 'safe' ? 'risk-safe' : ''} ${c.enabled === false ? 'choice-btn-disabled' : ''}" 
            onclick="resolveBreakthrough(${i}, ${tmpl.isMajor}, this)" ${c.enabled === false ? 'disabled' : ''}>
      <span class="choice-btn-icon">${c.icon}</span>
      <span class="choice-btn-content">
        ${c.text}
        <span class="choice-btn-hint">${c.hint || ''}</span>
      </span>
    </button>`).join('');

  const item = document.createElement('div');
  item.className = 'event-item';
  item.id = 'current-choice';
  item.innerHTML = `
    <div class="choice-box breakthrough-box">
      <div class="choice-title">${tmpl.title}</div>
      <div class="choice-desc">${tmpl.desc}</div>
      <div class="choice-options" data-choices='${JSON.stringify(tmpl.choices.map(c => c.hint))}'>${btnHtml}</div>
    </div>`;
  feed.appendChild(item);

  // 存储选择结果函数
  window._currentBreakthroughResults = tmpl.choices.map(c => c.result);
  window._currentBreakthroughMajor = tmpl.isMajor;
  window._currentBreakthroughTmpl = tmpl;
  feed.scrollTop = feed.scrollHeight;
}

// 处理突破选择结果
function resolveBreakthrough(index, isMajor, btn) {
  if (!state.waitingChoice) return;

  // 检查选项是否可用
  const tmpl = window._currentBreakthroughTmpl;
  const choice = tmpl.choices[index];
  if (choice.enabled === false) return;

  // 禁用所有选项
  const choiceBox = btn.closest('.choice-box');
  choiceBox.querySelectorAll('.choice-btn').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; });
  btn.style.opacity = '1'; btn.style.borderColor = 'var(--gold)';

  // 执行结果
  const resultFn = window._currentBreakthroughResults[index];
  if (resultFn) {
    const result = resultFn(state);
    
    setTimeout(() => {
      // 显示成功率提示
      if (result.hint) {
        const hintEl = btn.querySelector('.choice-btn-hint');
        if (hintEl) hintEl.textContent = result.hint;
      }
      
      // 处理稳固根基
      if (result.breakthroughType === 'stable') {
        // 使用随机描述显示稳固根基事件
        addEvent('breakthrough', result.eventText || `🧘 道心更加稳固，下次突破成功率+3%！`);
        state.waitingChoice = false;
        state.waitingBreakthrough = true; // 继续保持等待突破状态
        
        // 刷新突破选项
        setTimeout(() => {
          triggerBreakthroughEvent();
        }, 500);
        return;
      }
      
      executeBreakthrough(result.breakthroughType);
      
      state.waitingChoice = false;
      state.waitingBreakthrough = false;
      const btnNextYear = document.getElementById('btn-next-year');
      if (btnNextYear) btnNextYear.disabled = false;

      if (state.autoPlay) scheduleAuto();
    }, 300);
  }
}

function applyAttrDelta(delta) {
  let cultivationChanged = false;
  Object.entries(delta).forEach(([k, v]) => {
    if (k === 'cultivation') {
      // 修为直接应用到 attrs.cultivation（不参与 baseAttrs + bonusAttrs 计算）
      state.attrs[k] = Math.max(0, (state.attrs[k] || 0) + v);
      cultivationChanged = true;
    } else if (k === 'power') {
      // 战力跳过（由 recalcPower 计算）
      return;
    } else if (state.baseAttrs[k] !== undefined) {
      // 其他属性（talent/luck/wealth/lifespan）直接应用到 baseAttrs
      state.baseAttrs[k] = Math.max(0, (state.baseAttrs[k] || 0) + v);
      // 同时更新 attrs
      state.attrs[k] = state.baseAttrs[k] + (state.bonusAttrs?.[k] || 0);
    }
  });
  // 修为变化后重新计算战力
  if (cultivationChanged) {
    recalcPower();
  }
  
  // 检测成就
  checkAchievements();
}

// 处理非选择类型事件（基础/好事/坏事/突发事件）
function processEvent(ep) {
  console.log(`[processEvent] 处理事件: type=${ep.type}, isChoice=${ep.isChoice}`);
  if (ep.type === 'shop') {
    // 商店事件：显示商店UI
    const shopEvent = ep.templates[Math.floor(Math.random() * ep.templates.length)];
    state.waitingChoice = true;
    state.currentShop = shopEvent;
    const btnNextYear = document.getElementById('btn-next-year');
    if (btnNextYear) btnNextYear.disabled = true;
    addShopUI(shopEvent);
    return 'shop';
  } else if (ep.type === 'pillshop') {
    // 丹药商店事件：显示丹药商店UI
    const shopEvent = ep.templates[Math.floor(Math.random() * ep.templates.length)];
    state.waitingChoice = true;
    state.currentShop = shopEvent;
    const btnNextYear = document.getElementById('btn-next-year');
    if (btnNextYear) btnNextYear.disabled = true;
    addPillShopUI(shopEvent);
    return 'shop';
  } else if (ep.type === 'base') {
    // 基础事件：根据财富判断触发修炼还是财富事件
    const cultivationCost = window.CULTIVATION_COST?.[state.realmIndex] || 10;
    let tmpl;
    
    if (state.attrs.wealth >= cultivationCost) {
      tmpl = ep.cultivationTemplates[Math.floor(Math.random() * ep.cultivationTemplates.length)](state);
      addEvent('cultivation', tmpl.text, tmpl.deltas);
      
      // 记录修炼次数
      let totalCultivation = parseInt(localStorage.getItem('totalCultivation') || '0') + 1;
      localStorage.setItem('totalCultivation', totalCultivation.toString());
    } else {
      tmpl = ep.wealthTemplates[Math.floor(Math.random() * ep.wealthTemplates.length)](state);
      addEvent('wealth', tmpl.text, tmpl.deltas);
    }
    
    if (tmpl.dAttr) {
      applyAttrDelta(tmpl.dAttr);
    }
    clampCultivation();
    if (tryAdvanceRealm(0)) {
      triggerBreakthroughEvent();
      return 'breakthrough';
    }
    updateAttrs();
    saveGameState();
  } else {
    let tmpl;
    if (ep.type === 'emergency') {
      const emergency = ep.templates[Math.floor(Math.random() * ep.templates.length)];
      tmpl = window.processEmergencyEvent(emergency);
      tmpl.deltas = window.generateDeltas(tmpl.dAttr);
    } else {
      tmpl = ep.templates[Math.floor(Math.random() * ep.templates.length)](state);
    }
    addEvent(ep.type, tmpl.text, tmpl.deltas);
    if (tmpl.dAttr) {
      applyAttrDelta(tmpl.dAttr);
    }
    clampCultivation();
    if (tryAdvanceRealm(0)) {
      triggerBreakthroughEvent();
      return 'breakthrough';
    }
    updateAttrs();
    saveGameState();
  }
  return 'done';
}

// 修为上限检查：事件结束后调用，确保修为不超过当前小境界上限
function clampCultivation() {
  const currentMax = getCurrentStageMax();
  if (state.attrs.cultivation > currentMax) {
    state.attrs.cultivation = currentMax;
  }
}

// 计算当前小境界的突破阈值
function getCurrentStageThreshold() {
  const realm = realms[state.realmIndex];
  const thresholds = realmStageThresholds[realm.key];
  // 返回当前层需要的最低修为
  return thresholds[state.realmLayer - 1] || realm.baseCultivation;
}

// 获取当前境界的修为上限
function getRealmMaxCultivation() {
  const realm = realms[state.realmIndex];
  if (realm.maxCultivation) return realm.maxCultivation;
  return realmCultivationRanges[realm.key].max;
}

// 获取当前小境界的修为上限（下一层阈值或境界上限）
function getCurrentStageMax() {
  const realm = realms[state.realmIndex];
  const thresholds = realmStageThresholds[realm.key];
  const isLastLayer = state.realmLayer >= realm.layers;
  
  if (isLastLayer) {
    // 最后一层，返回境界上限
    return getRealmMaxCultivation();
  } else {
    // 返回下一层的起始值
    return thresholds[state.realmLayer] || getRealmMaxCultivation();
  }
}

// 检查是否到达当前小境界极限（达到当前小境界上限）
function isAtStageLimit() {
  return state.attrs.cultivation >= getCurrentStageMax();
}

// 检查是否是大境界突破（小境界已圆满）
function isMajorBreakthrough() {
  return state.realmLayer >= realms[state.realmIndex].layers;
}

function tryAdvanceRealm(cultGain) {
  // 检查是否到达当前小境界上限
  if (state.attrs.cultivation >= getCurrentStageMax()) {
    // 标记需要突破，阻止普通事件触发
    state.waitingBreakthrough = true;
    return true; // 返回true表示触发了突破
  }
  return false;
}

// 执行突破（小境界或大境界）
function executeBreakthrough(breakthroughType) {
  const realm = realms[state.realmIndex];
  const isMajor = isMajorBreakthrough();
  
  // 稳固根基只在突破成功或失败（修为倒退）时消耗
  // 无门不消耗稳固根基加成
  if (breakthroughType === 'success' || breakthroughType === 'fail') {
    state.breakthroughStableCount = 0;
    state.breakthroughBonus = 0;
  }
  
  if (isMajor) {
    // 大境界突破
    handleMajorBreakthrough(breakthroughType);
  } else {
    // 小境界突破
    handleMinorBreakthrough(breakthroughType);
  }
  
  state.waitingBreakthrough = false;
  state.breakthroughNo门Count = 0; // 突破后重置无门计数
  
  // 清除突破选项框
  const feed = document.getElementById('event-feed');
  if (feed) {
    const breakthroughBox = feed.querySelector('.breakthrough-box');
    if (breakthroughBox) breakthroughBox.remove();
  }
  
  updateAttrs();
  saveGameState();
  
  // 如果是突破无门，立即再次触发突破事件
  if (breakthroughType === 'no门') {
    setTimeout(() => {
      state.waitingBreakthrough = true;
      triggerBreakthroughEvent();
    }, 500);
  } else {
    // 检查境界突破后是否需要再次突破
    setTimeout(() => {
      if (isAtStageLimit() && !state.waitingChoice) {
        state.waitingBreakthrough = true;
      }
    }, 100);
  }
}

// 小境界突破处理
function handleMinorBreakthrough(breakthroughType) {
  const realm = realms[state.realmIndex];
  const oldStageName = realm.stageNames[state.realmLayer - 1];
  const thresholds = realmStageThresholds[realm.key];
  
  if (breakthroughType === 'success') {
    // 突破成功：层数+1，修为重置到新层起点
    state.realmLayer++;
    // 修为重置为下一层的起始值
    state.attrs.cultivation = thresholds[state.realmLayer - 1] || realm.baseCultivation;
    state.character.attrs.cultivation = state.attrs.cultivation;
    const newStageName = realm.stageNames[state.realmLayer - 1];
    addEvent('breakthrough', `💫 恭喜！${realm.name}${oldStageName}突破至<span class="event-highlight">${realm.name}${newStageName}</span>！修为稳固，根基更扎实。`);
  } else {
    // 突破无门：修为不变，无门次数+1
    state.breakthroughNo门Count++;
    const newStageName = realm.stageNames[state.realmLayer - 1];
    addEvent('breakthrough', `😔 突破${realm.name}${newStageName}无门...道阻且长，需更加精进修行。`);
    
    // 检查连续5次无门
    if (state.breakthroughNo门Count >= 5) {
      triggerStuckEnding();
    }
  }
}

// 大境界突破处理
function handleMajorBreakthrough(breakthroughType) {
  const realm = realms[state.realmIndex];
  const nextRealm = realms[state.realmIndex + 1];
  const isLastRealm = state.realmIndex === realms.length - 1;
  
  if (breakthroughType === 'success') {
    // 突破成功
    if (isLastRealm) {
      // 化神圆满，飞升
      state.realmLayer = realm.layers;
      addEvent('breakthrough', `🎉 经过不懈努力，你成功达到<span class="event-highlight">化神圆满</span>！寿元将尽之时，天劫降临，你扛过九天神雷，飞升仙界！`);
      
      // 停止自动播放
      state.autoPlay = false;
      if (autoTimer) clearTimeout(autoTimer);
      const autoBtn = document.getElementById('btn-auto');
      if (autoBtn) autoBtn.classList.remove('active');
      const btnNextYear = document.getElementById('btn-next-year');
      if (btnNextYear) btnNextYear.disabled = true;
      
      setTimeout(() => showEnding(), 2000);
    } else {
      // 进入新境界
      state.realmLayer = 1;
      state.realmIndex++;
      const newRealm = realms[state.realmIndex];
      
      // 清空已购买丹药记录（新境界有新丹药）
      state.pillsBought = [];
      
      // 检测境界成就
      checkRealmAchievements();
      
      // 如果突破进入化神境界，游戏结束
      if (newRealm.name === '化神期') {
        // 寿元增加
        state.baseAttrs.lifespan += newRealm.lifeBonus;
        state.attrs.lifespan = state.baseAttrs.lifespan;
        
        addEvent('breakthrough', `🎉 经过不懈努力，你成功突破至<span class="event-highlight">化神初期</span>！寿元大幅增加，一片新天地在眼前展开。`, 
          [`境界突破`, `寿元 +${newRealm.lifeBonus}`, `恭喜你踏入化神境界！`]);
        updateRealmTree();
        
        // 停止自动播放
        state.autoPlay = false;
        if (autoTimer) clearTimeout(autoTimer);
        const autoBtn = document.getElementById('btn-auto');
        if (autoBtn) autoBtn.classList.remove('active');
        const btnNextYear = document.getElementById('btn-next-year');
        if (btnNextYear) btnNextYear.disabled = true;
        
        // 显示飞升结局（化神突破即游戏结束）
        setTimeout(() => {
          showEnding();
        }, 2000);
        return;
      }
      // 修为重置为新境界第一层的起始值
      state.attrs.cultivation = realmStageThresholds[newRealm.key][0];
      state.character.attrs.cultivation = state.attrs.cultivation;
      
      // 消耗当前装备的功法和法宝，将加成合并到基础属性
      const consumedItems = [];
      
      // 先将 bonusAttrs 合并到 baseAttrs
      if (state.bonusAttrs) {
        if (state.bonusAttrs.talent) {
          state.baseAttrs.talent += state.bonusAttrs.talent;
        }
        if (state.bonusAttrs.luck) {
          state.baseAttrs.luck += state.bonusAttrs.luck;
        }
        if (state.bonusAttrs.wealth) {
          state.baseAttrs.wealth += state.bonusAttrs.wealth;
        }
        if (state.bonusAttrs.lifespan) {
          state.baseAttrs.lifespan += state.bonusAttrs.lifespan;
        }
      }
      
      // 增加境界寿元奖励
      state.baseAttrs.lifespan += newRealm.lifeBonus;
      
      // 统一同步到 attrs
      state.attrs.talent = state.baseAttrs.talent;
      state.attrs.luck = state.baseAttrs.luck;
      state.attrs.wealth = state.baseAttrs.wealth;
      state.attrs.lifespan = state.baseAttrs.lifespan;
      
      // 消耗功法（不放回物品栏）
      if (state.equippedTechnique) {
        const tech = getTechniqueById(state.equippedTechnique);
        if (tech) {
          consumedItems.push(`「${tech.name}」`);
        }
        state.equippedTechnique = null;
      }
      
      // 消耗法宝（不放回物品栏）
      if (state.equippedTreasure) {
        const tre = getTreasureById(state.equippedTreasure);
        if (tre) {
          consumedItems.push(`「${tre.name}」`);
        }
        state.equippedTreasure = null;
      }
      
      // 清空 bonusAttrs
      state.bonusAttrs = {
        talent: 0,
        luck: 0,
        wealth: 0,
        lifespan: 0
      };
      
      // 重新计算战力
      recalcPower();
      
      // 自动出售低境界物品（以售价的一半）
      const soldItems = [];
      let totalRefund = 0;
      for (let i = state.inventory.length - 1; i >= 0; i--) {
        const item = state.inventory[i];
        if (item.realmIndex < state.realmIndex) {
          const data = item.type === 'technique' ? getTechniqueById(item.id) : getTreasureById(item.id);
          if (data && data.price) {
            const sellPrice = Math.floor(data.price * 0.5);
            totalRefund += sellPrice;
            soldItems.push(`「${data.name}」`);
            state.inventory.splice(i, 1);
          }
        }
      }
      
      if (totalRefund > 0) {
        state.attrs.wealth += totalRefund;
        state.baseAttrs.wealth += totalRefund;
      }
      
      const consumeText = consumedItems.length > 0 ? ` 消耗了${consumedItems.join('、')}，其修为精华融入己身。` : '';
      const soldText = soldItems.length > 0 ? ` 低境界${soldItems.join('、')}以半价自动出售，获得${totalRefund}灵石。` : '';
      addEvent('breakthrough', `🎉 经过不懈努力，你成功突破至<span class="event-highlight">${newRealm.name}${newRealm.stageNames[0]}</span>！寿元大幅增加，一片新天地在眼前展开。${consumeText}${soldText}`,
        [`境界突破`, `寿元 +${newRealm.lifeBonus}`, `修为 重置为 ${newRealm.baseCultivation}`]);
      updateRealmTree();
      updateEquipmentUI();
      updateInventoryUI();
    }
  } else if (breakthroughType === 'no门') {
    // 突破无门
    state.breakthroughNo门Count++;
    addEvent('breakthrough', `😔 大境界突破无门...道心受挫，但意志坚定，誓要突破桎梏。`);
    
    if (state.breakthroughNo门Count >= 5) {
      triggerStuckEnding();
    }
  } else if (breakthroughType === 'fail') {
    // 突破失败，修为倒退到当前境界第四层
    state.breakthroughNo门Count = 0; // 失败不计入无门次数
    const fourthLayerCultivation = realmStageThresholds[realm.key][3] || realm.baseCultivation;
    const retrogression = state.attrs.cultivation - fourthLayerCultivation;
    state.attrs.cultivation = fourthLayerCultivation;
    state.character.attrs.cultivation = state.attrs.cultivation;
    addEvent('breakthrough', `💥 突破失败！遭受反噬，修为倒退${retrogression}点...但根基未损，来日再战。`);
  } else if (breakthroughType === 'death') {
    // 突破失败死亡
    triggerDeathEnding('breakthrough');
  }
}

// 触发卡死结局
function triggerStuckEnding() {
  const realm = realms[state.realmIndex];
  const stageName = realm.stageNames[state.realmLayer - 1];
  const years = state.year;
  const cultivation = state.attrs.cultivation;
  const realmText = `${realm.name}${stageName}`;
  
  addEvent('fate', `⏳ 五次突破无门，道途已尽...你在此境界驻足不前，余生再难寸进。`);
  
  // 保存结局数据到 localStorage
  saveEndingData('道途已尽', `修行 ${years} 年 · 止步于 ${realmText} · ${cultivation} 修为`, years, cultivation, state.adventures);
  
  setTimeout(() => {
    localStorage.setItem('gameState', JSON.stringify(state)); // 保存游戏状态
    window.location.href = 'ending.html';
  }, 1500);
}

// 触发死亡结局
function triggerDeathEnding(reason) {
  const realm = realms[state.realmIndex];
  const stageName = realm.stageNames[state.realmLayer - 1];
  const years = state.year;
  const cultivation = state.attrs.cultivation;
  const realmText = `${realm.name}${stageName}`;
  
  let deathText = '';
  if (reason === 'breakthrough') {
    deathText = `💀 突破反噬过重，经脉寸断...身死道消，魂归天地。`;
  } else if (reason === 'lifespan') {
    deathText = `⏳ 寿元耗尽，大限已至...一代修士，就此陨落。`;
  }
  
  addEvent('fate', deathText);
  
  // 保存结局数据到 localStorage
  saveEndingData('身死道消', `修行 ${years} 年 · 陨落于 ${realmText}`, years, cultivation, state.adventures);
  
  setTimeout(() => {
    localStorage.setItem('gameState', JSON.stringify(state)); // 保存游戏状态
    window.location.href = 'ending.html';
  }, 1500);
}

function updateRealmTree() {
  const realmDisplayEl = document.getElementById('realm-display-text');
  if (realmDisplayEl) {
    const realm = realms[state.realmIndex];
    const stageName = realm.stageNames[state.realmLayer - 1] || `第${state.realmLayer}层`;
    realmDisplayEl.textContent = realm.name + '·' + stageName;
  }
}

// ===== 添加事件卡片 =====
function addYearMarker(text) {
  const feed = document.getElementById('event-feed');
  if (!feed) return;
  const el = document.createElement('div');
  el.className = 'event-year-marker';
  el.innerHTML = `— ${text} —`;
  feed.appendChild(el);
  feed.scrollTop = feed.scrollHeight;
}

function addEvent(type, text, deltas = []) {
  const feed = document.getElementById('event-feed');
  if (!feed) {
    console.log(`[addEvent] 错误: event-feed 不存在! type=${type}`);
    return;
  }
  console.log(`[addEvent] 添加事件: type=${type}, text=${text.substring(0, 50)}...`);
  const icons = { normal: '📜', good: '✨', bad: '💢', adventure: '⚡', emergency: '🚨', cultivation: '🔮', fate: '🌟', breakthrough: '⚡', shop: '🏪', pillshop: '💊' };
  const item = document.createElement('div');
  item.className = 'event-item';
  const deltasHtml = deltas.map(d => {
    const cls = d.startsWith('+') || d.includes('+') && !d.includes('-') ? 'delta-up' :
      d.startsWith('-') || d.includes('-') ? 'delta-down' : 'delta-neutral';
    return `<span class="delta-item ${cls}">${d}</span>`;
  }).join('');
  item.innerHTML = `
    <div class="event-card type-${type}">
      <span class="event-type-icon">${icons[type] || '📜'}</span>
      <div class="event-text">${text}</div>
      ${deltasHtml ? `<div class="event-delta">${deltasHtml}</div>` : ''}
    </div>`;
  feed.appendChild(item);
  feed.scrollTop = feed.scrollHeight;
}

// ===== 多环奇遇系统 =====
// 添加多环奇遇选择
function addMultiRingChoice(adventure, ringIndex) {
  const feed = document.getElementById('event-feed');
  if (!feed) return;
  
  // 边界检查：无效索引或-1表示结束
  if (ringIndex < 0 || ringIndex >= adventure.rings.length) {
    console.warn(`无效的 ringIndex: ${ringIndex}，结束奇遇`);
    state.currentAdventure = null;
    state.currentRingIndex = 0;
    saveGameState();
    return;
  }
  
  const ring = adventure.rings[ringIndex];
  
  // 如果是最后一环（choices为空），直接结算
  if (!ring.choices || ring.choices.length === 0) {
    // 显示结算事件
    const reward = ring.finalReward || {};
    const rewardText = generateRewardText(reward, adventure);
    addEvent('adventure', `🎉 ${adventure.title}完成！${rewardText}`, window.generateDeltas(reward, adventure));
    
    // 应用奖励
    if (reward && Object.keys(reward).length > 0) {
      applyAttrDelta(reward);
      // 如果是发放物品（giveItem），执行物品发放
      if (reward.giveItem && adventure.itemId) {
        giveAdventureItem(adventure);
      }
      clampCultivation();
    }
    
    // 重置奇遇状态
    state.currentAdventure = null;
    state.currentRingIndex = 0;
    
    // 记录奇遇完成
    let totalAdventure = parseInt(localStorage.getItem('totalAdventures') || '0') + 1;
    localStorage.setItem('totalAdventures', totalAdventure.toString());
    
    // 检测奇遇成就
    checkCumulativeAchievements();
    
    // 如果是发放物品（giveItem），检测装备成就
    if (reward.giveItem && adventure.itemId) {
      // 更新功法/法宝收集数据
      if (adventure.type === 'technique') {
        let techIds = JSON.parse(localStorage.getItem('unlockedTechniques') || '[]');
        if (!techIds.includes(adventure.itemId)) {
          techIds.push(adventure.itemId);
          localStorage.setItem('unlockedTechniques', JSON.stringify(techIds));
        }
      } else if (adventure.type === 'treasure') {
        let treIds = JSON.parse(localStorage.getItem('unlockedTreasures') || '[]');
        if (!treIds.includes(adventure.itemId)) {
          treIds.push(adventure.itemId);
          localStorage.setItem('unlockedTreasures', JSON.stringify(treIds));
        }
      }
      checkAchievements();
    }
    
    updateAttrs();
    saveGameState();
    
    // 继续游戏
    state.waitingChoice = false;
    const btnNextYear = document.getElementById('btn-next-year');
    if (btnNextYear) btnNextYear.disabled = false;
    if (state.autoPlay) scheduleAuto();
    return;
  }
  
  // 渲染奇遇标题和描述
  const item = document.createElement('div');
  item.className = 'event-item';
  item.id = 'current-choice';
  
  let choicesHtml = '';
  ring.choices.forEach((choice, index) => {
    const meetsRequirements = checkRequirements(choice.requires);
    const disabled = !meetsRequirements ? 'disabled' : '';
    const hint = choice.hint || '';
    const riskClass = choice.risk === 'high' ? 'risk-high' : choice.risk === 'safe' ? 'risk-safe' : '';
    const reqHint = !meetsRequirements ? ` <span class="choice-req">(未满足条件)</span>` : '';
    
    choicesHtml += `
      <button class="choice-btn ${riskClass} ${disabled ? 'choice-btn-disabled' : ''}" 
              onclick="resolveMultiRingChoice(${index}, this)" ${disabled}>
        <span class="choice-btn-icon">${choice.icon}</span>
        <span class="choice-btn-content">
          ${choice.text}
          <span class="choice-btn-hint">${hint}${reqHint}</span>
        </span>
      </button>`;
  });
  
  item.innerHTML = `
    <div class="choice-box adventure-box">
      <div class="choice-title">⚡ ${adventure.title} · 第${ringIndex + 1}环</div>
      <div class="choice-desc">${ring.desc}</div>
      <div class="choice-options">${choicesHtml}</div>
    </div>`;
  
  feed.appendChild(item);
  feed.scrollTop = feed.scrollHeight;
}

// 检查属性要求
function checkRequirements(requires) {
  if (!requires) return true;
  for (const [attr, value] of Object.entries(requires)) {
    if (state.attrs[attr] < value) return false;
  }
  return true;
}

// 生成奖励描述文本
function generateRewardText(reward, adventure) {
  if (!reward || Object.keys(reward).length === 0) return '（无奖励）';
  
  // 如果是发放物品
  if (reward.giveItem && adventure) {
    const rarityNames = { epic: '史诗', legendary: '传说' };
    const typeNames = { technique: '功法', treasure: '法宝' };
    return `获得<span class="event-highlight">${rarityNames[adventure.rarity]}${typeNames[adventure.type]}「${adventure.title.replace(/^[^\s]+\s/, '')}」</span>`;
  }
  
  const labels = { cultivation: '修为', power: '战力', talent: '天赋', luck: '气运', wealth: '财富' };
  const parts = [];
  
  for (const [attr, value] of Object.entries(reward)) {
    if (labels[attr]) {
      parts.push(`<span class="event-highlight">${labels[attr]} ${value > 0 ? '+' : ''}${value}</span>`);
    }
  }
  
  return parts.length > 0 ? parts.join('、') : '（无奖励）';
}

// 处理多环奇遇选择
function resolveMultiRingChoice(index, btn) {
  if (!state.waitingChoice) return;
  
  const adventure = state.currentAdventure;
  const ring = adventure.rings[state.currentRingIndex];
  const choice = ring.choices[index];
  
  // 检查属性要求
  if (!checkRequirements(choice.requires)) return;
  
  // 禁用所有选项
  const choiceBox = btn.closest('.choice-box');
  choiceBox.querySelectorAll('.choice-btn').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; });
  btn.style.opacity = '1'; btn.style.borderColor = 'var(--gold)';
  
  // 延迟处理，给用户反馈时间
  setTimeout(() => {
    // 检查是否结束奇遇
    if (choice.nextRing === -1) {
      // 结束奇遇，结算奖励
      const reward = choice.reward;
      if (reward && Object.keys(reward).length > 0) {
        addEvent('adventure', `你选择离开，${reward ? '获得了部分收获' : '错过了机缘'}。`, window.generateDeltas(reward));
        applyAttrDelta(reward);
        clampCultivation();
      } else {
        addEvent('adventure', `你选择离开，未获得任何奖励。`);
      }
      
      // 重置奇遇状态
      state.currentAdventure = null;
      state.currentRingIndex = 0;
      
      updateAttrs();
      saveGameState();
      
      state.waitingChoice = false;
      const btnNextYear = document.getElementById('btn-next-year');
      if (btnNextYear) btnNextYear.disabled = false;
      if (state.autoPlay) scheduleAuto();
    } else {
      // 进入下一环
      state.currentRingIndex = choice.nextRing;
      
      // 移除当前选择框，添加新环
      const currentItem = document.getElementById('current-choice');
      if (currentItem) {
        currentItem.remove();
      }
      
      addMultiRingChoice(adventure, state.currentRingIndex);
    }
  }, 300);
}

// 发放奇遇中的功法或法宝（放入物品栏）
function giveAdventureItem(adventure) {
  const itemId = adventure.itemId;
  const type = adventure.type;
  const title = adventure.title.replace(/^[^\s]+\s/, '');
  
  // 检查物品是否已存在于物品栏或已装备
  const alreadyInInventory = state.inventory.some(item => item.id === itemId);
  const alreadyEquipped = (type === 'technique' && state.equippedTechnique === itemId) ||
                           (type === 'treasure' && state.equippedTreasure === itemId);
  
  if (alreadyInInventory || alreadyEquipped) {
    addEvent('system', `${type === 'technique' ? '功法' : '法宝'}「${title}」已在物品栏或已装备。`);
    return;
  }
  
  // 获取物品的境界信息
  const realmName = realms[state.realmIndex].name;
  let realmIndex = state.realmIndex;
  
  if (type === 'technique') {
    const tech = getTechniqueById(itemId);
    if (tech) {
      realmIndex = realms.findIndex(r => r.name.replace('期', '') === tech.category);
    }
  } else {
    const tre = getTreasureById(itemId);
    if (tre) {
      realmIndex = realms.findIndex(r => r.name.replace('期', '') === tre.category);
    }
  }
  
  // 放入物品栏
  state.inventory.push({
    id: itemId,
    type: type,
    realmIndex: realmIndex,
    rarity: adventure.rarity || 'epic'
  });
  
  addEvent('system', `获得${type === 'technique' ? '功法' : '法宝'}「${title}」！已存入物品栏，请点击装备。`);
  updateInventoryUI();
}

// 根据ID获取功法
function getTechniqueById(id) {
  return TECHNIQUES.find(t => t.id === id);
}

// 根据ID获取法宝
function getTreasureById(id) {
  return TREASURES.find(t => t.id === id);
}

// ===== 战力计算 =====
// 重新计算角色战力
function recalcPower() {
  // 获取功法增幅
  let techRate = 0.5; // 默认基础增幅
  if (state.equippedTechnique) {
    const tech = getTechniqueById(state.equippedTechnique);
    if (tech) {
      techRate = tech.powerRate;
    }
  }
  
  // 获取法宝增幅
  let treasureRate = 1.0; // 默认基础增幅
  if (state.equippedTreasure) {
    const tre = getTreasureById(state.equippedTreasure);
    if (tre) {
      treasureRate = tre.powerBonus || 1.0;
    }
  }
  
  // 计算战力（基于当前修为）
  const currentCultivation = state.attrs.cultivation || 0;
  state.attrs.power = Math.round(currentCultivation * techRate * treasureRate);
  
  // 从 baseAttrs + bonusAttrs 计算最终属性（命运效果已在初始化时应用）
  state.attrs.talent = (state.baseAttrs.talent || 0) + (state.bonusAttrs?.talent || 0);
  state.attrs.luck = (state.baseAttrs.luck || 0) + (state.bonusAttrs?.luck || 0);
  state.attrs.wealth = (state.baseAttrs.wealth || 0) + (state.bonusAttrs?.wealth || 0);
  state.attrs.lifespan = (state.baseAttrs.lifespan || 0) + (state.bonusAttrs?.lifespan || 0);
}

// 更新 bonusAttrs（根据当前装备计算加成）
function recalcBonusAttrs() {
  // 初始化 bonusAttrs
  state.bonusAttrs = {
    talent: 0,
    luck: 0,
    wealth: 0,
    lifespan: 0
  };
  
  // 获取功法额外效果
  if (state.equippedTechnique) {
    const tech = getTechniqueById(state.equippedTechnique);
    if (tech && tech.bonusEffects) {
      tech.bonusEffects.forEach(effect => {
        if (effect.attr === 'talent' || effect.attr === 'luck' || effect.attr === 'wealth' || effect.attr === 'lifespan') {
          if (effect.type === 'mult') {
            // 乘法加成需要特殊处理，先存储乘数
            if (!state.bonusAttrs._mults) state.bonusAttrs._mults = {};
            state.bonusAttrs._mults[effect.attr] = (state.bonusAttrs._mults[effect.attr] || 1) * effect.value;
          } else if (effect.type === 'bonus' || effect.type === 'add') {
            state.bonusAttrs[effect.attr] += effect.value;
          }
        }
      });
    }
  }
  
  // 应用乘法加成到 baseAttrs
  if (state.bonusAttrs._mults) {
    for (const [attr, mult] of Object.entries(state.bonusAttrs._mults)) {
      const baseValue = state.baseAttrs[attr] || 0;
      const bonusAdd = Math.round(baseValue * (mult - 1));
      state.bonusAttrs[attr] += bonusAdd;
    }
    delete state.bonusAttrs._mults;
  }
}

// ===== 装备系统 =====

// 检查物品是否可以装备（只能装备当前境界的物品）
function canEquipItem(itemId, type) {
  const item = type === 'technique' ? getTechniqueById(itemId) : getTreasureById(itemId);
  if (!item) return { canEquip: false, reason: '物品不存在' };
  
  const itemRealmIndex = realms.findIndex(r => r.name.replace('期', '') === item.category);

  // 只能装备当前境界的物品（不能高于也不能低于当前境界）
  if (itemRealmIndex > state.realmIndex) {
    return { canEquip: false, reason: `需要${item.category}境界才能装备` };
  }
  if (itemRealmIndex < state.realmIndex) {
    return { canEquip: false, reason: `已突破至${realms[state.realmIndex].name}，无法装备低境界物品` };
  }
  
  return { canEquip: true, item, itemRealmIndex };
}

// 装备物品
function equipItem(inventoryIndex) {
  const invItem = state.inventory[inventoryIndex];
  if (!invItem) return;
  
  const check = canEquipItem(invItem.id, invItem.type);
  if (!check.canEquip) {
    showTooltip(document.body, check.reason);
    return;
  }
  
  if (invItem.type === 'technique') {
    equipTechnique(invItem.id);
    // 从物品栏移除
    state.inventory.splice(inventoryIndex, 1);
  } else {
    equipTreasure(invItem.id);
    // 从物品栏移除
    state.inventory.splice(inventoryIndex, 1);
  }
  
  updateEquipmentUI();
  updateInventoryUI();
  updateAttrs();
  saveGameState();
}

// 装备功法
function equipTechnique(techId) {
  const tech = getTechniqueById(techId);
  if (!tech) return;
  
  // 检查境界是否相符（功法境界不能高于当前境界）
  const techRealmIndex = realms.findIndex(r => r.name.replace('期', '') === tech.category);
  if (techRealmIndex > state.realmIndex) {
    addEvent('system', `📖 「${tech.name}」境界要求过高，无法装备！`);
    return;
  }
  
  // 卸下当前装备的功法
  if (state.equippedTechnique) {
    const oldTech = getTechniqueById(state.equippedTechnique);
    // 将旧功法放回物品栏
    state.inventory.push({
      id: state.equippedTechnique,
      type: 'technique',
      realmIndex: realms.findIndex(r => r.name.replace('期', '') === oldTech.category),
      rarity: oldTech.rarity
    });
  }
  
  // 装备新功法
  state.equippedTechnique = techId;
  recalcBonusAttrs();  // 重新计算加成属性
  recalcPower();        // 重新计算战力
  addEvent('system', `📖 装备了功法「${tech.name}」！`);
}

// 装备法宝
function equipTreasure(treId) {
  const tre = getTreasureById(treId);
  if (!tre) return;
  
  // 检查境界是否相符（法宝境界不能高于当前境界）
  const treRealmIndex = realms.findIndex(r => r.name.replace('期', '') === tre.category);
  if (treRealmIndex > state.realmIndex) {
    addEvent('system', `🔮 「${tre.name}」境界要求过高，无法装备！`);
    return;
  }
  
  // 卸下当前装备的法宝
  if (state.equippedTreasure) {
    const oldTre = getTreasureById(state.equippedTreasure);
    // 将旧法宝放回物品栏
    state.inventory.push({
      id: state.equippedTreasure,
      type: 'treasure',
      realmIndex: realms.findIndex(r => r.name.replace('期', '') === oldTre.category),
      rarity: oldTre.rarity
    });
  }
  
  // 装备新法宝
  state.equippedTreasure = treId;
  recalcBonusAttrs();  // 重新计算加成属性
  recalcPower();        // 重新计算战力
  addEvent('system', `🔮 装备了法宝「${tre.name}」！`);
}

// 卸下装备（放入物品栏）
function unequipItem(type) {
  if (type === 'technique' && state.equippedTechnique) {
    const tech = getTechniqueById(state.equippedTechnique);
    state.inventory.push({
      id: state.equippedTechnique,
      type: 'technique',
      realmIndex: realms.findIndex(r => r.name.replace('期', '') === tech.category),
      rarity: tech.rarity
    });
    addEvent('system', `📖 卸下了功法「${tech.name}」。`);
    state.equippedTechnique = null;
  } else if (type === 'treasure' && state.equippedTreasure) {
    const tre = getTreasureById(state.equippedTreasure);
    state.inventory.push({
      id: state.equippedTreasure,
      type: 'treasure',
      realmIndex: realms.findIndex(r => r.name.replace('期', '') === tre.category),
      rarity: tre.rarity
    });
    addEvent('system', `🔮 卸下了法宝「${tre.name}」。`);
    state.equippedTreasure = null;
  }
  
  recalcBonusAttrs();  // 重新计算加成属性
  recalcPower();
  updateEquipmentUI();
  updateInventoryUI();
  updateAttrs();
  saveGameState();
}

// 更新装备UI
function updateEquipmentUI() {
  const equipTechEl = document.getElementById('equipped-technique');
  const equipTreEl = document.getElementById('equipped-treasure');
  
  if (equipTechEl) {
    if (state.equippedTechnique) {
      const tech = getTechniqueById(state.equippedTechnique);
      if (tech) {
        equipTechEl.innerHTML = `
          <div class="equipment-slot equipped">
            <span class="equipment-icon">📖</span>
            <span class="equipment-name" style="color: ${TECHNIQUE_RARITY[tech.rarity]?.color || '#fff'}">${tech.name}</span>
            <span class="equipment-rarity">${TECHNIQUE_RARITY[tech.rarity]?.name || tech.rarity}</span>
            <button class="unequip-btn" onclick="unequipItem('technique')">卸下</button>
          </div>`;
      }
    } else {
      equipTechEl.innerHTML = '<div class="equipment-slot empty">📖 未装备功法</div>';
    }
  }
  
  if (equipTreEl) {
    if (state.equippedTreasure) {
      const tre = getTreasureById(state.equippedTreasure);
      if (tre) {
        equipTreEl.innerHTML = `
          <div class="equipment-slot equipped">
            <span class="equipment-icon">${tre.icon || '💎'}</span>
            <span class="equipment-name" style="color: ${TREASURE_RARITY[tre.rarity]?.color || '#fff'}">${tre.name}</span>
            <span class="equipment-rarity">${TREASURE_RARITY[tre.rarity]?.name || tre.rarity}</span>
            <button class="unequip-btn" onclick="unequipItem('treasure')">卸下</button>
          </div>`;
      }
    } else {
      equipTreEl.innerHTML = '<div class="equipment-slot empty">💎 未装备法宝</div>';
    }
  }
}

// 更新物品栏UI
function updateInventoryUI() {
  const inventoryEl = document.getElementById('inventory-grid');
  if (!inventoryEl) return;
  
  if (state.inventory.length === 0) {
    inventoryEl.innerHTML = '<div class="inventory-empty">物品栏为空</div>';
    return;
  }
  
  inventoryEl.innerHTML = state.inventory.map((item, index) => {
    const data = item.type === 'technique' ? getTechniqueById(item.id) : getTreasureById(item.id);
    const rarityInfo = item.type === 'technique' ? TECHNIQUE_RARITY[item.rarity] : TREASURE_RARITY[item.rarity];
    const canEquip = canEquipItem(item.id, item.type);
    const disabledClass = canEquip.canEquip ? '' : ' inventory-item-disabled';
    const realmName = realms[item.realmIndex]?.name || '未知';
    
    return `
      <div class="inventory-item${disabledClass}" data-index="${index}">
        <div class="inventory-item-header">
          <span class="inventory-item-icon">${item.type === 'technique' ? '📖' : (data?.icon || '💎')}</span>
          <span class="inventory-item-name" style="color: ${rarityInfo?.color || '#fff'}">${data?.name || item.id}</span>
        </div>
        <div class="inventory-item-info">
          <span class="inventory-item-realm">${realmName}</span>
          <span class="inventory-item-rarity">${rarityInfo?.name || item.rarity}</span>
        </div>
        ${canEquip.canEquip ? 
          `<button class="inventory-equip-btn" onclick="equipItem(${index})">装备</button>` :
          `<div class="inventory-item-locked">${canEquip.reason}</div>`}
      </div>`;
  }).join('');
}

// ===== 商店系统 =====
// 显示商店UI
function addShopUI(shopEvent) {
  const feed = document.getElementById('event-feed');
  if (!feed) return;
  
  const realm = realms[state.realmIndex];
  // 去掉 realmName 中的"期"字以匹配 category（如"炼气期" -> "炼气"）
  const realmName = realm.name.replace('期', '');
  
  // 获取当前境界的功法或法宝
  let items = [];
  if (shopEvent.shopType === 'technique') {
    // 功法商店：获取当前境界符合条件的功法
    items = TECHNIQUES.filter(t => 
      t.category === realmName && 
      shopEvent.itemRarities.includes(t.rarity)
    );
  } else {
    // 法宝商店：获取当前境界符合条件的法宝
    items = TREASURES.filter(t => 
      t.category === realmName && 
      shopEvent.itemRarities.includes(t.rarity)
    );
  }
  
  // 检查是否有可购买的物品（不在物品栏且不在装备中）
  const shopItems = items.filter(item => {
    const alreadyInInventory = state.inventory.some(inv => inv.id === item.id);
    const alreadyEquipped = (shopEvent.shopType === 'technique' && state.equippedTechnique === item.id) ||
                           (shopEvent.shopType === 'treasure' && state.equippedTreasure === item.id);
    return !alreadyInInventory && !alreadyEquipped;
  }).map(item => {
    // 使用物品自身的价格属性
    const rarityInfo = shopEvent.shopType === 'technique' 
      ? TECHNIQUE_RARITY[item.rarity] 
      : TREASURE_RARITY[item.rarity];
    return {
      ...item,
      rarityName: rarityInfo.name,
      rarityColor: rarityInfo.color
    };
  });
  
  // 如果没有可购买的物品，打印事件并自动离开
  if (shopItems.length === 0) {
    addEvent('shop', `${shopEvent.title}中所有物品已在物品栏或已装备，你转身离开了。`);
    state.waitingChoice = false;
    const btnNextYear = document.getElementById('btn-next-year');
    if (btnNextYear) btnNextYear.disabled = false;
    if (state.autoPlay) scheduleAuto();
    return;
  }
  
  // 构建物品列表HTML
  const itemsHtml = shopItems.map((item, index) => {
    const canAfford = state.attrs.wealth >= item.price;
    const disabledClass = !canAfford ? ' shop-item-disabled' : '';
    const disabledAttr = !canAfford ? 'disabled' : '';
    const statusText = !canAfford ? '(财富不足)' : '';
    const bonusText = item.bonusEffects && item.bonusEffects.length > 0
      ? `<div class="shop-item-bonus">${item.bonusEffects.map(e => e.label).join(' ')}</div>`
      : (item.powerBonus ? `<div class="shop-item-bonus">战力×${item.powerBonus}</div>` : '');
    
    return `
      <div class="shop-item${disabledClass}">
        <div class="shop-item-header">
          <span class="shop-item-icon">${shopEvent.shopType === 'technique' ? '📖' : (item.icon || '💎')}</span>
          <span class="shop-item-name" style="color: ${item.rarityColor}">${item.name}</span>
          <span class="shop-item-rarity">${item.rarityName}</span>
        </div>
        <div class="shop-item-desc">${item.desc}</div>
        ${bonusText}
        <div class="shop-item-footer">
          <span class="shop-item-price">💰 ${item.price.toLocaleString()}</span>
          <button class="shop-buy-btn ${disabledClass}" onclick="buyShopItem(${index}, this)" ${disabledAttr}>
            购买 ${statusText}
          </button>
        </div>
      </div>`;
  }).join('');
  
  const item = document.createElement('div');
  item.className = 'event-item';
  item.id = 'current-shop';
  item.innerHTML = `
    <div class="choice-box shop-box">
      <div class="choice-title">${shopEvent.title}</div>
      <div class="choice-desc">${shopEvent.itemDesc}</div>
      <div class="shop-items-container">${itemsHtml}</div>
      <div class="shop-footer">
        <div class="shop-balance">💰 当前财富: <span class="wealth-value">${state.attrs.wealth.toLocaleString()}</span></div>
        <button class="choice-btn" onclick="leaveShop()">离开商店</button>
      </div>
    </div>`;
  
  feed.appendChild(item);
  feed.scrollTop = feed.scrollHeight;
  
  // 存储商店数据到全局
  window._currentShopItems = shopItems;
  window._currentShopEvent = shopEvent;
}

// 购买商店物品
function buyShopItem(index, btn) {
  const shopItems = window._currentShopItems;
  const shopEvent = window._currentShopEvent;
  
  if (!shopItems || !shopEvent || !shopItems[index]) return;
  
  const item = shopItems[index];
  
  // 再次检查财富
  if (state.attrs.wealth < item.price) {
    showTooltip(btn, '财富不足！');
    return;
  }
  
  // 扣减财富
  state.attrs.wealth -= item.price;
  
  // 发放物品
  if (shopEvent.shopType === 'technique') {
    giveShopTechnique(item);
  } else {
    giveShopTreasure(item);
  }
  
  // 更新显示
  updateAttrs();
  saveGameState();
  
  // 显示购买成功提示
  const itemName = shopEvent.shopType === 'technique' ? item.name : item.name;
  addEvent('shop', `🏪 购买了<span class="event-highlight">${itemName}</span>！`, [`财富 -${item.price.toLocaleString()}`]);
  
  // 更新商店UI中的财富显示（精确匹配当前商店）
  const currentShop = document.getElementById('current-shop');
  if (currentShop) {
    const wealthSpan = currentShop.querySelector('.wealth-value');
    if (wealthSpan) wealthSpan.textContent = state.attrs.wealth.toLocaleString();
  }
  
  // 标记该商店已触发
  if (!state.triggeredShops) state.triggeredShops = {};
  state.triggeredShops[shopEvent.shopId] = (state.triggeredShops[shopEvent.shopId] || 0) + 1;
  
  // 检测装备成就
  if (shopEvent.shopType === 'technique') {
    // 更新功法收集数据
    let techIds = JSON.parse(localStorage.getItem('unlockedTechniques') || '[]');
    if (!techIds.includes(item.id)) {
      techIds.push(item.id);
      localStorage.setItem('unlockedTechniques', JSON.stringify(techIds));
    }
  } else {
    // 更新法宝收集数据
    let treIds = JSON.parse(localStorage.getItem('unlockedTreasures') || '[]');
    if (!treIds.includes(item.id)) {
      treIds.push(item.id);
      localStorage.setItem('unlockedTreasures', JSON.stringify(treIds));
    }
  }
  
  // 检测成就
  checkAchievements();
  
  // 关闭商店
  closeShop();
  
  // 继续游戏
  state.waitingChoice = false;
  state.currentShop = null;
  const btnNextYear = document.getElementById('btn-next-year');
  if (btnNextYear) btnNextYear.disabled = false;
  if (state.autoPlay) scheduleAuto();
}

// 发放商店购买的功法（放入物品栏）
function giveShopTechnique(item) {
  // 检查物品是否已存在于物品栏或已装备
  const alreadyInInventory = state.inventory.some(inv => inv.id === item.id);
  const alreadyEquipped = state.equippedTechnique === item.id;
  
  if (alreadyInInventory || alreadyEquipped) {
    // 改为财富补偿（退还80%）
    const refund = Math.floor(item.price * 0.8);
    state.attrs.wealth += refund;
    addEvent('system', `功法「${item.name}」已在物品栏或已装备，获得${refund}灵石补偿。`);
    return;
  }
  
  // 放入物品栏
  state.inventory.push({
    id: item.id,
    type: 'technique',
    realmIndex: state.realmIndex,
    rarity: item.rarity
  });
  
  addEvent('system', `获得功法「${item.name}」！已存入物品栏，请点击装备。`);
  updateInventoryUI();
}

// 发放商店购买的法宝（放入物品栏）
function giveShopTreasure(item) {
  // 检查物品是否已存在于物品栏或已装备
  const alreadyInInventory = state.inventory.some(inv => inv.id === item.id);
  const alreadyEquipped = state.equippedTreasure === item.id;
  
  if (alreadyInInventory || alreadyEquipped) {
    // 改为财富补偿（退还80%）
    const refund = Math.floor(item.price * 0.8);
    state.attrs.wealth += refund;
    addEvent('system', `法宝「${item.name}」已在物品栏或已装备，获得${refund}灵石补偿。`);
    return;
  }
  
  // 放入物品栏
  state.inventory.push({
    id: item.id,
    type: 'treasure',
    realmIndex: state.realmIndex,
    rarity: item.rarity
  });
  
  addEvent('system', `获得法宝「${item.name}」！已存入物品栏，请点击装备。`);
  updateInventoryUI();
}

// 离开商店
function leaveShop() {
  // 标记该商店已触发（即使没买东西也算触发）
  const shopEvent = window._currentShopEvent;
  if (shopEvent) {
    if (!state.triggeredShops) state.triggeredShops = {};
    state.triggeredShops[shopEvent.shopId] = (state.triggeredShops[shopEvent.shopId] || 0) + 1;
  }
  
  addEvent('shop', `🏪 你离开了${shopEvent?.title || '商店'}。`);
  closeShop();
  
  state.waitingChoice = false;
  state.currentShop = null;
  const btnNextYear = document.getElementById('btn-next-year');
  if (btnNextYear) btnNextYear.disabled = false;
  if (state.autoPlay) scheduleAuto();
}

// 关闭商店UI
function closeShop() {
  const shopEl = document.getElementById('current-shop');
  if (shopEl) {
    shopEl.remove();
  }
  window._currentShopItems = null;
  window._currentShopEvent = null;
}

// ===== 丹药商店系统 =====
// 显示丹药商店UI
function addPillShopUI(shopEvent) {
  const feed = document.getElementById('event-feed');
  if (!feed) return;
  
  // 移除旧的丹药商店DOM（避免ID冲突）
  const oldShop = document.getElementById('current-shop');
  if (oldShop) oldShop.remove();
  
  // 确保 pillsBought 已初始化（不清空，保留跨会话购买记录）
  if (!state.pillsBought) state.pillsBought = [];
  
  // 获取当前境界的所有丹药
  const realmPills = pills.filter(p => p.realmIndex === state.realmIndex);
  if (realmPills.length === 0) {
    addEvent('pillshop', `💊 没有适合当前境界的丹药。`);
    leavePillShop();
    return;
  }
  
  // 生成丹药列表HTML
  const pillsHtml = realmPills.map(pill => {
    const isBought = state.pillsBought.includes(pill.id);
    const canAfford = state.attrs.wealth >= pill.price;
    const rarityInfo = PILL_RARITY[pill.rarity];
    const canBuy = canAfford && !isBought;
    return `
      <div class="pill-shop-item ${isBought ? 'sold-out' : ''}" id="pill-item-${pill.id}">
        <div class="pill-item-header">
          <span class="pill-item-icon">💊</span>
          <span class="pill-item-name" style="color: ${rarityInfo.color}">${pill.name}</span>
          <span class="pill-item-rarity">${rarityInfo.name}</span>
          ${isBought ? '<span class="sold-badge">已购</span>' : ''}
        </div>
        <div class="pill-item-desc">${pill.desc}</div>
        <div class="pill-item-effect">
          <span class="effect-label">效果：</span>
          <span class="effect-value">修为 +${pill.cultivationGain.toLocaleString()}</span>
        </div>
        <div class="pill-item-footer">
          <span class="pill-item-price">💰 ${pill.price.toLocaleString()}</span>
          <button class="shop-buy-btn ${canBuy ? '' : 'disabled'}" onclick="buyPill('${pill.id}')" ${canBuy ? '' : 'disabled'}>
            ${isBought ? '💊 已售出' : (canAfford ? '💊 购买' : '💊 购买 (财富不足)')}
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  const item = document.createElement('div');
  item.className = 'event-item';
  item.id = 'current-shop';
  item.innerHTML = `
    <div class="choice-box pill-shop-box">
      <div class="choice-title">${shopEvent.title}</div>
      <div class="choice-desc">${shopEvent.itemDesc}</div>
      ${pillsHtml}
      <div class="shop-footer">
        <div class="shop-balance">💰 当前财富: <span class="wealth-value">${state.attrs.wealth.toLocaleString()}</span></div>
        <button class="choice-btn" onclick="leavePillShop()">离开</button>
      </div>
    </div>`;
  
  feed.appendChild(item);
  feed.scrollTop = feed.scrollHeight;
  
  // 存储当前丹药商店数据
  window._currentPillShopEvent = shopEvent;
}

// 购买并服用丹药
function buyPill(pillId) {
  const pill = pills.find(p => p.id === pillId);
  const shopEvent = window._currentPillShopEvent;
  
  if (!pill) return;
  
  // 检查是否已购买（本次商店会话内不可再购买）
  if (state.pillsBought.includes(pillId)) {
    showTooltip(document.body, '该丹药已售出！');
    return;
  }
  
  // 检查财富
  if (state.attrs.wealth < pill.price) {
    showTooltip(document.body, '财富不足！');
    return;
  }
  
  // 扣减财富
  state.attrs.wealth -= pill.price;

  // 增加修为
  const actualGain = pill.cultivationGain;
  state.attrs.cultivation += actualGain;
  
  // 标记该丹药已购买（先标记再保存，防止刷新丢失购买记录）
  state.pillsBought.push(pillId);
  
  // 更新显示
  updateAttrs();
  saveGameState();
  
  // 标记该丹药商店已触发
  if (!state.triggeredShops) state.triggeredShops = {};
  state.triggeredShops[shopEvent.shopId] = (state.triggeredShops[shopEvent.shopId] || 0) + 1;
  
  // 记录使用丹药
  recordPillUsed();
  
  // 更新累积数据
  let totalPillsUsed = parseInt(localStorage.getItem('totalPillsUsed') || '0') + 1;
  localStorage.setItem('totalPillsUsed', totalPillsUsed.toString());
  
  // 检测成就
  checkAchievements();
  
  // 修为上限检查
  clampCultivation();
  
  // 先更新商店UI中的财富显示（即使触发突破也需要显示正确的财富值）
  const shopWealthEl = document.getElementById('current-shop')?.querySelector('.wealth-value');
  if (shopWealthEl) shopWealthEl.textContent = state.attrs.wealth.toLocaleString();
  
  // 检查是否到达突破点
  if (tryAdvanceRealm(0)) {
    // 到达突破点，触发突破事件
    closeShop();
    leavePillShop();
    state.waitingChoice = false;
    state.currentShop = null;
    triggerBreakthroughEvent();
    return;
  }
  
  // 只在商店内部更新显示，不重新创建商店UI
  const currentShop = document.getElementById('current-shop');
  
  // 更新已购买的丹药项
  const pillItem = document.getElementById(`pill-item-${pillId}`);
  if (pillItem) {
    pillItem.classList.add('sold-out');
    pillItem.querySelector('.sold-badge')?.remove();
    pillItem.querySelector('.pill-item-header').insertAdjacentHTML('beforeend', '<span class="sold-badge">已售</span>');
    const btn = pillItem.querySelector('.shop-buy-btn');
    if (btn) {
      btn.classList.add('disabled');
      btn.disabled = true;
      btn.textContent = '💊 已售出';
    }
  }
  
  // 更新所有丹药按钮状态（财富减少后，部分丹药可能买不起）
  if (currentShop) {
    const allPillItems = currentShop.querySelectorAll('.pill-shop-item');
    allPillItems.forEach(item => {
      const itemBtn = item.querySelector('.shop-buy-btn');
      if (!itemBtn || itemBtn.disabled) return;
      // 从item的id中提取pillId
      const itemId = item.id.replace('pill-item-', '');
      const p = pills.find(pp => pp.id === itemId);
      if (p && state.attrs.wealth < p.price) {
        itemBtn.classList.add('disabled');
        itemBtn.disabled = true;
        itemBtn.textContent = '💊 购买 (财富不足)';
      }
    });
  }
  
  // 更新商店UI中的财富显示
  if (currentShop) {
    const wealthSpan = currentShop.querySelector('.wealth-value');
    if (wealthSpan) wealthSpan.textContent = state.attrs.wealth.toLocaleString();
  }
  
  // 在商店标题下方显示购买提示
  const shopBox = currentShop?.querySelector('.pill-shop-box');
  if (shopBox) {
    const existingMsg = shopBox.querySelector('.shop-buy-msg');
    if (existingMsg) existingMsg.remove();
    const msg = document.createElement('div');
    msg.className = 'shop-buy-msg';
    msg.style.cssText = 'color: #4ade80; font-size: 14px; margin: 8px 0; text-align: center;';
    msg.textContent = `💊 购买了${pill.name}！修为 +${actualGain.toLocaleString()}`;
    shopBox.insertBefore(msg, shopBox.querySelector('.pill-shop-item') || shopBox.firstChild);
  }
}

// 离开丹药商店
function leavePillShop() {
  // 标记该丹药商店已触发（即使没买也算触发）
  const shopEvent = window._currentPillShopEvent;
  if (shopEvent) {
    if (!state.triggeredShops) state.triggeredShops = {};
    state.triggeredShops[shopEvent.shopId] = (state.triggeredShops[shopEvent.shopId] || 0) + 1;
  }
  
  addEvent('pillshop', `💊 你离开了${shopEvent?.title || '丹药商店'}。`);
  
  state.waitingChoice = false;
  state.currentShop = null;
  window._currentPill = null;
  window._currentPillShopEvent = null;
  // 不再清空 pillsBought，保留跨会话的购买记录
  const btnNextYear = document.getElementById('btn-next-year');
  if (btnNextYear) btnNextYear.disabled = false;
  if (state.autoPlay) scheduleAuto();
}

function addChoice(tmpl) {
  const feed = document.getElementById('event-feed');
  if (!feed) return;
  const btnHtml = tmpl.choices.map((c, i) => `
    <button class="choice-btn ${c.risk === 'high' ? 'risk-high' : c.risk === 'safe' ? 'risk-safe' : ''}" 
            onclick="resolveChoice(${i}, this)">
      <span class="choice-btn-icon">${c.icon}</span>
      <span class="choice-btn-content">
        ${c.text}
        <span class="choice-btn-hint">${c.hint || ''}</span>
      </span>
    </button>`).join('');

  const item = document.createElement('div');
  item.className = 'event-item';
  item.id = 'current-choice';
  item.innerHTML = `
    <div class="choice-box">
      <div class="choice-title">${tmpl.title}</div>
      <div class="choice-desc">${tmpl.desc}</div>
      <div class="choice-options" data-choices='${JSON.stringify(tmpl.choices.map(c => c.hint))}'>${btnHtml}</div>
    </div>`;
  feed.appendChild(item);

  // 存储选择结果函数
  window._currentChoiceResults = tmpl.choices.map(c => c.result);
  feed.scrollTop = feed.scrollHeight;
}

function resolveChoice(index, btn) {
  if (!state.waitingChoice) return;

  // 禁用所有选项
  const choiceBox = btn.closest('.choice-box');
  choiceBox.querySelectorAll('.choice-btn').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; });
  btn.style.opacity = '1'; btn.style.borderColor = 'var(--gold)';

  // 执行结果
  const resultFn = window._currentChoiceResults[index];
  if (resultFn) {
    const result = resultFn(state);
    if (result.dAttr) applyAttrDelta(result.dAttr);

    setTimeout(() => {
      addEvent('good', result.text,
        Object.entries(result.dAttr || {}).map(([k, v]) => {
          const labels = { cultivation: '修为', power: '战力', talent: '天赋', luck: '气运', wealth: '财富' };
          return `${labels[k] || k} ${v > 0 ? '+' : ''}${v}`;
        }).filter(s => !s.endsWith(' 0'))
      );
      updateAttrs();
      
      // 检查是否到达突破点
      if (tryAdvanceRealm(result.dAttr?.cultivation || 0)) {
        // 到达突破点，触发突破事件
        triggerBreakthroughEvent();
        return;
      }
      
      updateAttrs();
      saveGameState();

      state.waitingChoice = false;
      const btnNextYear = document.getElementById('btn-next-year');
      if (btnNextYear) btnNextYear.disabled = false;

      if (state.autoPlay) scheduleAuto();
    }, 300);
  }
}

// ===== 自动推进 =====
function toggleAuto() {
  state.autoPlay = !state.autoPlay;
  const toggle = document.getElementById('auto-toggle');
  if (toggle) toggle.className = 'toggle-switch' + (state.autoPlay ? ' on' : '');
  if (state.autoPlay && !state.waitingChoice) scheduleAuto();
  else if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
}

function scheduleAuto() {
  if (autoTimer) clearTimeout(autoTimer);
  if (!state.autoPlay || state.waitingChoice) return;
  const delays = { 1: 2000, 2: 1200, 4: 600, 8: 300, 16: 100 };
  const delay = delays[state.speed] || 1200;
  autoTimer = setTimeout(() => { nextYear(); if (state.autoPlay && !state.waitingChoice) scheduleAuto(); }, delay);
}

function setSpeed(btn, spd) {
  state.speed = spd;
  document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (state.autoPlay) { if (autoTimer) clearTimeout(autoTimer); scheduleAuto(); }
}

// ===== 结局 =====
function showEnding() {
  // 保存结局数据到 localStorage
  saveEndingData('飞升成仙', `修行 ${state.year} 年 · 终达大道彼岸`, state.year, state.attrs.cultivation, state.adventures);
  
  setTimeout(() => {
    localStorage.setItem('gameState', JSON.stringify(state)); // 保存游戏状态
    window.location.href = 'ending.html';
  }, 1000);
}

// 保存结局数据
function saveEndingData(title, subtitle, years, cultivation, adventures) {
  const realm = realms[state.realmIndex];
  const stageName = realm.stageNames[state.realmLayer - 1];
  const endingData = {
    title: title,
    subtitle: subtitle,
    years: years,
    cultivation: cultivation,
    power: state.attrs.power,
    adventures: adventures,
    realm: realm.name,
    stageName: stageName
  };
  localStorage.setItem('endingData', JSON.stringify(endingData));
}

function restartGame() {
  localStorage.removeItem('gameState');
  window.location.href = 'index.html';
}

// ===== 游戏状态持久化 =====
function saveGameState() {
  // 获取当前年份的事件DOM内容（从当年标记开始，只保存当前年份的事件）
  const feed = document.getElementById('event-feed');
  let currentYearEvent = '';
  if (feed) {
    // 找到最后一个年份标记，只保存该标记之后的内容
    const markers = feed.querySelectorAll('.event-year-marker');
    if (markers.length > 0) {
      const lastMarker = markers[markers.length - 1];
      currentYearEvent = lastMarker.outerHTML;
      let sibling = lastMarker.nextElementSibling;
      while (sibling) {
        currentYearEvent += sibling.outerHTML;
        sibling = sibling.nextElementSibling;
      }
    } else {
      currentYearEvent = feed.innerHTML;
    }
  }
  
  // 不保存命运池相关状态
  const saveState = { ...state };
  delete saveState.fatePool;
  delete saveState.drawnFates;
  delete saveState.selectedFates;
  // 保留 waitingChoice, waitingBreakthrough, currentAdventure, currentRingIndex, currentShop
  // 因为这些状态需要在继续游戏时恢复
  delete saveState.eventHistory;
  
  // 保存当前年份的事件HTML
  saveState.currentYearEvent = currentYearEvent;
  
  localStorage.setItem('gameState', JSON.stringify(saveState));
}

function loadGameState() {
  const saved = localStorage.getItem('gameState');
  if (saved) {
    const loaded = JSON.parse(saved);
    
    // 检查是否是有效存档（新游戏刚创建时isNewGame=true，currentYearEvent为空）
    const isNewSave = loaded.isNewGame === true && 
                      (!loaded.currentYearEvent || loaded.currentYearEvent.trim() === '');
    
    // 确保突破相关状态被正确初始化
    if (loaded.breakthroughNo门Count === undefined) {
      loaded.breakthroughNo门Count = 0;
    }
    if (loaded.breakthroughStableCount === undefined) {
      loaded.breakthroughStableCount = 0;
    }
    if (loaded.breakthroughBonus === undefined) {
      loaded.breakthroughBonus = 0;
    }
    // 确保商店触发记录被正确初始化
    if (!loaded.triggeredShops) {
      loaded.triggeredShops = {};
    }
    // 确保已购买丹药记录被正确初始化
    if (!loaded.pillsBought) {
      loaded.pillsBought = [];
    }
    // 确保奇遇触发记录被正确初始化
    if (!loaded.triggeredAdventures) {
      loaded.triggeredAdventures = [];
    }
    // 确保装备栏被正确初始化
    if (loaded.equippedTechnique === undefined) {
      loaded.equippedTechnique = null;
    }
    if (loaded.equippedTreasure === undefined) {
      loaded.equippedTreasure = null;
    }
    // 确保物品栏被正确初始化
    if (!loaded.inventory) {
      loaded.inventory = [];
    }
    // 确保 bonusAttrs 被正确初始化（兼容旧存档）
    if (!loaded.bonusAttrs) {
      loaded.bonusAttrs = {
        talent: 0,
        luck: 0,
        wealth: 0,
        lifespan: 0
      };
    }
    // 标记为非新游戏（继续游戏）
    loaded.isNewGame = false;
    // 标记为已有存档，不显示开局提示
    loaded.firstYearTriggered = true;
    // 确保currentYearEvent存在
    if (!loaded.currentYearEvent) {
      loaded.currentYearEvent = '';
    }
    // 删除旧的eventHistory
    delete loaded.eventHistory;
    
    Object.assign(state, loaded);
    // 重新计算加成属性
    recalcBonusAttrs();
    
    return { hasValidSave: !isNewSave };
  }
  return { hasValidSave: false };
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化角色
  initCharacter();
  
  // 初始化成就系统
  initSingleRunAchievements();
  addAchievementButton();
  
  // 如果是命运页面，自动抽取一次
  if (document.getElementById('fate-cards-pool')) {
    drawFate();
    updateFateAttrsDisplay();
  }
  
  // 如果是游戏页面，加载游戏状态
  if (document.getElementById('page-game')) {
    const loaded = loadGameState();
    if (loaded && loaded.hasValidSave) {
      // 有有效存档：恢复当前年份的事件
      if (state.currentYearEvent) {
        const feed = document.getElementById('event-feed');
        if (feed) {
          feed.innerHTML = state.currentYearEvent;
        }
      }
      // 如果处于等待突破状态，重新渲染突破选择框（因为无法保存函数引用）
      if (state.waitingBreakthrough) {
        const currentChoice = document.getElementById('current-choice');
        if (currentChoice) currentChoice.remove();
        triggerBreakthroughEvent();
      }
      // 根据状态禁用"下一年"按钮（等待选择或等待突破时不启用）
      const btnNextYear = document.getElementById('btn-next-year');
      if (btnNextYear) {
        btnNextYear.disabled = state.waitingChoice || state.waitingBreakthrough;
      }
      updateAttrs();
      updateRealmTree();
      updateEquipmentUI();
      updateInventoryUI();
      recalcPower();
    } else {
      // 无存档或新游戏：显示开局事件
      state.firstYearTriggered = true;
      // 新游戏：确保修为从0开始（炼气期起步修为）
      state.attrs.cultivation = realms[0].baseCultivation;
      state.baseAttrs.cultivation = realms[0].baseCultivation;
      updateAttrs();
      addYearMarker('— 踏入修行 · 第一年 —');
      addEvent('fate', '你踏入修仙之路。命运的齿轮悄然转动，修行之旅正式开始。');
    }

    // 页面卸载前保存游戏状态
    window.addEventListener('beforeunload', function() {
      saveGameState();
    });
  }
});

// 退出当前游戏，返回初始界面
function exitGame() {
  if (confirm('确定要退出当前游戏吗？当前进度已保存，可下次继续。')) {
    // 保存当前游戏进度
    saveGameState();
    // 移除 beforeunload 事件防止重复存档
    window.onbeforeunload = null;
    // 跳转到初始界面
    window.location.href = 'index.html';
  }
}

// ===== 成就系统 =====
// 成就检测调用说明：在各种事件发生后调用 checkAchievements() 进行检测

// 初始化单局成就数据
function initSingleRunAchievements() {
  // 检查并初始化隐藏成就
  checkHiddenAchievements();
}

// 检查隐藏成就（初始属性相关）
function checkHiddenAchievements() {
  if (!state.character) return;
  
  // H-01: 天命所归 - 初始气运超过140
  if (state.character.attrs.luck > 140) {
    unlockSingleAchievement('H-01');
  }
  
  // H-02: 天纵之才 - 初始天赋超过140
  if (state.character.attrs.talent > 140) {
    unlockSingleAchievement('H-02');
  }
}

// 解锁单局成就
function unlockSingleAchievement(id) {
  if (!id) return;
  
  // 从localStorage读取当前单局数据
  let singleRun = JSON.parse(localStorage.getItem('achievementSingleRun') || '{}');
  
  if (singleRun[id]) return; // 已经解锁
  
  singleRun[id] = true;
  localStorage.setItem('achievementSingleRun', JSON.stringify(singleRun));
  
  // 显示成就弹窗
  showAchievementToast(id);
}

// 解锁累积成就
function unlockCumulativeAchievement(id) {
  if (!id) return;
  
  // 从localStorage读取累积数据
  let cumulative = JSON.parse(localStorage.getItem('achievementCumulative') || '[]');
  
  if (cumulative.includes(id)) return; // 已经解锁
  
  cumulative.push(id);
  localStorage.setItem('achievementCumulative', JSON.stringify(cumulative));
  
  // 显示成就弹窗
  showAchievementToast(id);
}

// 显示成就弹窗
function showAchievementToast(id) {
  // 防止重复显示
  if (document.getElementById('achievement-toast')?.classList.contains('show')) {
    return;
  }
  
  const overlay = document.getElementById('achievement-toast-overlay');
  const toast = document.getElementById('achievement-toast');
  if (toast) {
    const achievement = window.getAchievementById ? window.getAchievementById(id) : null;
    const toastTitle = document.getElementById('toast-title');
    const toastName = document.getElementById('toast-name');
    
    if (toastTitle) toastTitle.textContent = '成就解锁';
    if (toastName && achievement) {
      toastName.textContent = achievement.name;
      toastName.style.color = window.RARITY_COLORS ? window.RARITY_COLORS[achievement.rarity] : '#c9a84c';
    } else if (toastName) {
      toastName.textContent = id;
    }
    
    // 显示遮罩和弹窗
    if (overlay) {
      overlay.classList.add('show');
    }
    toast.classList.remove('achievement-toast-hide');
    toast.classList.add('show');
    
    // 点击遮罩或弹窗可关闭
    const closeToast = () => {
      toast.classList.remove('show');
      toast.classList.add('achievement-toast-hide');
      if (overlay) {
        overlay.classList.remove('show');
      }
      // 清除事件绑定
      setTimeout(() => {
        if (overlay) overlay.onclick = null;
        toast.onclick = null;
      }, 500);
    };
    
    // 设置关闭事件（延迟添加防止立即触发）
    setTimeout(() => {
      if (overlay) {
        overlay.onclick = closeToast;
      }
      toast.onclick = closeToast;
    }, 100);
    
    // 3秒后自动关闭
    setTimeout(closeToast, 3000);
  }
}

// 检测所有成就
function checkAchievements() {
  // 境界成就检测
  checkRealmAchievements();
  
  // 累积数据检测
  checkCumulativeAchievements();
  
  // 单局状态检测
  checkSingleRunAchievements();
}

// 检测境界成就
function checkRealmAchievements() {
  const realmIndex = state.realmIndex;
  
  // R-01 到 R-04 境界突破成就
  if (realmIndex >= 1) unlockSingleAchievement('R-01'); // 筑基期
  if (realmIndex >= 2) unlockSingleAchievement('R-02'); // 金丹期
  if (realmIndex >= 3) unlockSingleAchievement('R-03'); // 元婴期
  if (realmIndex >= 4) unlockSingleAchievement('R-04'); // 化神期
}

// 检测累积成就
function checkCumulativeAchievements() {
  // 修炼次数
  const totalCultivation = parseInt(localStorage.getItem('totalCultivation') || '0');
  if (totalCultivation >= 100) unlockCumulativeAchievement('C-01');
  if (totalCultivation >= 500) unlockCumulativeAchievement('C-02');
  if (totalCultivation >= 1000) unlockCumulativeAchievement('C-03');
  if (totalCultivation >= 5000) unlockCumulativeAchievement('C-04');
  if (totalCultivation >= 10000) unlockCumulativeAchievement('C-05');
  
  // 财富获取
  const totalWealth = parseInt(localStorage.getItem('totalWealthGained') || '0');
  if (totalWealth >= 1000) unlockCumulativeAchievement('M-01');
  if (totalWealth >= 10000) unlockCumulativeAchievement('M-02');
  if (totalWealth >= 100000) unlockCumulativeAchievement('M-03');
  if (totalWealth >= 1000000) unlockCumulativeAchievement('M-04');
  
  // 奇遇完成
  const totalAdventure = parseInt(localStorage.getItem('totalAdventures') || '0');
  if (totalAdventure >= 1) unlockCumulativeAchievement('A-01');
  if (totalAdventure >= 5) unlockCumulativeAchievement('A-02');
  if (totalAdventure >= 10) unlockCumulativeAchievement('A-03');
  if (totalAdventure >= 15) unlockCumulativeAchievement('A-04');
  if (totalAdventure >= 22) unlockCumulativeAchievement('A-05');
  
  // 丹药使用
  const totalPill = parseInt(localStorage.getItem('totalPillsUsed') || '0');
  if (totalPill >= 1) unlockCumulativeAchievement('P-01');
  if (totalPill >= 10) unlockCumulativeAchievement('P-02');
  if (totalPill >= 50) unlockCumulativeAchievement('P-03');
  
  // 功法收集
  const techIds = JSON.parse(localStorage.getItem('unlockedTechniques') || '[]');
  if (techIds.length >= 1) unlockCumulativeAchievement('Tc-01');
  if (techIds.length >= 3) unlockCumulativeAchievement('Tc-02');
  if (techIds.length >= 6) unlockCumulativeAchievement('Tc-03');
  if (techIds.length >= 10) unlockCumulativeAchievement('Tc-04');
  if (techIds.length >= 15) unlockCumulativeAchievement('Tc-05');
  if (techIds.length >= 19) unlockCumulativeAchievement('Tc-06');
  
  // 法宝收集
  const treIds = JSON.parse(localStorage.getItem('unlockedTreasures') || '[]');
  if (treIds.length >= 1) unlockCumulativeAchievement('Tr-01');
  if (treIds.length >= 5) unlockCumulativeAchievement('Tr-02');
  if (treIds.length >= 10) unlockCumulativeAchievement('Tr-03');
  if (treIds.length >= 15) unlockCumulativeAchievement('Tr-04');
  if (treIds.length >= 25) unlockCumulativeAchievement('Tr-05');
  if (treIds.length >= 30) unlockCumulativeAchievement('Tr-06');
}

// 检测单局成就
function checkSingleRunAchievements() {
  // 从localStorage读取单局数据
  let singleRun = JSON.parse(localStorage.getItem('achievementSingleRun') || '{}');
  
  // E-01: 吉星高照 - 单局内连续遇到3次好事
  if ((singleRun.consecutiveGoodEvents || 0) >= 3) {
    unlockSingleAchievement('E-01');
  }
  
  // E-03: 逢凶化吉 - 单局内突发事件完美脱身3次
  if ((singleRun.perfectEscape || 0) >= 3) {
    unlockSingleAchievement('E-03');
  }
  
  // Time-01/02: 游戏时长
  if (state.year >= 100) unlockSingleAchievement('Time-01');
  if (state.year >= 1000) unlockSingleAchievement('Time-02');
  
  // H-03: 清心寡欲 - 单局内从未使用丹药
  if (!(singleRun.usedPill)) {
    // 需要确保单局结束时检查
  }
  
  // H-04: 家财万贯 - 单局内财富从未低于0
  if (!(singleRun.wealthNegative)) {
    // 需要在财富低于0时设置
  }
}

// 记录好事事件
function recordGoodEvent() {
  let singleRun = JSON.parse(localStorage.getItem('achievementSingleRun') || '{}');
  singleRun.consecutiveGoodEvents = (singleRun.consecutiveGoodEvents || 0) + 1;
  singleRun.consecutiveBadEvents = 0; // 重置坏事计数
  localStorage.setItem('achievementSingleRun', JSON.stringify(singleRun));
  
  // E-04: 天选之人 - 好事触发时气运超过150
  if (state.attrs.luck > 150) {
    unlockSingleAchievement('E-04');
  }
  
  // E-02: 否极泰来 - 连续3次坏事后遇到好事
  if ((singleRun.consecutiveBadEvents >= 3) && (singleRun.consecutiveGoodEvents === 1)) {
    unlockSingleAchievement('E-02');
  }
  
  checkSingleRunAchievements();
}

// 记录坏事事件
function recordBadEvent() {
  let singleRun = JSON.parse(localStorage.getItem('achievementSingleRun') || '{}');
  singleRun.consecutiveBadEvents = (singleRun.consecutiveBadEvents || 0) + 1;
  singleRun.consecutiveGoodEvents = 0; // 重置好事计数
  localStorage.setItem('achievementSingleRun', JSON.stringify(singleRun));
  
  // E-05: 大难不死 - 单次坏事损失超过寿元的10%但存活
  // 由事件系统调用时传入损失比例
  
  checkSingleRunAchievements();
}

// 记录完美脱身
function recordPerfectEscape() {
  let singleRun = JSON.parse(localStorage.getItem('achievementSingleRun') || '{}');
  singleRun.perfectEscape = (singleRun.perfectEscape || 0) + 1;
  localStorage.setItem('achievementSingleRun', JSON.stringify(singleRun));
  checkSingleRunAchievements();
}

// 记录高风险成功
function recordHighRiskSuccess() {
  unlockSingleAchievement('A-06');
}

// 记录使用丹药
function recordPillUsed() {
  let singleRun = JSON.parse(localStorage.getItem('achievementSingleRun') || '{}');
  singleRun.usedPill = true;
  localStorage.setItem('achievementSingleRun', JSON.stringify(singleRun));
  
  // 检查H-03成就（如果本局没用过丹药才能达成）
  // 这个在单局结束时检查
}

// 记录财富低于0
function recordWealthNegative() {
  let singleRun = JSON.parse(localStorage.getItem('achievementSingleRun') || '{}');
  singleRun.wealthNegative = true;
  localStorage.setItem('achievementSingleRun', JSON.stringify(singleRun));
}

// 记录单局结束时检查的成就
function checkSingleRunEndAchievements() {
  let singleRun = JSON.parse(localStorage.getItem('achievementSingleRun') || '{}');
  
  // H-03: 清心寡欲 - 单局内从未使用丹药
  if (!singleRun.usedPill) {
    unlockSingleAchievement('H-03');
  }
  
  // H-04: 家财万贯 - 单局内财富从未低于0
  if (!singleRun.wealthNegative) {
    unlockSingleAchievement('H-04');
  }
}

// 添加成就页面入口按钮到游戏页面
function addAchievementButton() {
  // 在退出按钮旁边添成就按钮
  const exitSection = document.querySelector('.exit-section');
  if (exitSection) {
    // 创建成就按钮容器
    const btnContainer = document.createElement('div');
    btnContainer.className = 'achievement-btn-container';
    
    // 查看成就按钮（与退出游戏样式一致）
    const btn = document.createElement('button');
    btn.className = 'btn-exit-game';
    btn.textContent = '查看成就';
    btn.style.marginBottom = '10px';
    btn.onclick = function() {
      window.location.href = 'achievement.html';
    };
    
    // 退出游戏按钮
    const btnExit = document.createElement('button');
    btnExit.className = 'btn-exit-game';
    btnExit.textContent = '退出游戏';
    btnExit.onclick = exitGame;
    
    btnContainer.appendChild(btn);
    btnContainer.appendChild(btnExit);
    
    // 移除原有的退出按钮
    const oldExitBtn = exitSection.querySelector('.btn-exit-game');
    if (oldExitBtn) oldExitBtn.remove();
    
    exitSection.appendChild(btnContainer);
  }
}
