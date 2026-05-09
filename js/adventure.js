// ===== 奇遇系统（多环选择）=====
// 根据 technique.js 和 treasure.js 中的 epic/legendary 品质物品生成
// 中间退出：奖励财富或寿元
// 最终奖励：获得功法或法宝本身（通过 giveItem: true 标记）
// 数据结构：{ title, desc, realmRange, type, rarity, itemId, rings: [{ desc, choices: [{...}] }] }

// ===== 炼气期奇遇 =====
// 炼气期奇遇：战力要求=500，气运要求≥150，天赋要求≥145
// 功法奇遇：问道经 (epic)
const lianqiWenDaoAdventure = {
  title: '📜 问道经',
  desc: '上界仙宗流传功法，指引凡人成仙之道...',
  realmRange: [0, 0],
  type: 'technique',
  rarity: 'epic',
  itemId: 'tech_xiuxin',
  rings: [
    {
      desc: '仙宗遗迹的入口处，有一座古朴的石碑，上面刻着「问道者，先问己心」。你需要选择进入的方式...',
      choices: [
        { icon: '⚔️', text: '以力破阵，强行闯入', hint: '高风险 / 需战力≥500', risk: 'high', requires: { power: 500 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应禁制破绽', hint: '中风险 / 需气运≥150', risk: 'mid', requires: { luck: 150 }, nextRing: 2 },
        { icon: '🚪', text: '风险太大，转身离去', hint: '无奖励', risk: 'safe', nextRing: -1, reward: { wealth: 70 } },
      ]
    },
    {
      desc: '你成功进入遗迹内部，发现一处灵气充沛的修炼室，室内悬浮着一卷散发微光的经文...',
      choices: [
        { icon: '📖', text: '立刻参悟经文奥秘', hint: '高风险 / 需天赋≥145', risk: 'high', requires: { talent: 145 }, nextRing: 3 },
        { icon: '🏃', text: '取走副本先行离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 120 } },
      ]
    },
    {
      desc: '经文奥义涌入识海，你感到修炼天赋得到提升，似乎可以更进一步...',
      choices: [
        { icon: '⚡', text: '尝试获得完整传承', hint: '高风险 / 需气运≥165', risk: 'high', requires: { luck: 165 }, nextRing: 3 },
        { icon: '🙏', text: '见好就收，接受当前领悟', hint: '获得灵石奖励', risk: 'safe', nextRing: -1, reward: { wealth: 150 } },
      ]
    },
    {
      desc: '你成功获得《问道经》的完整传承！上界仙宗的心法融入你的修炼体系，天赋大增，寿元也有所增长！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 法宝奇遇：离火罩 (epic)
const lianqiLiHuoAdventure = {
  title: '🔥 离火罩',
  desc: '离火精华所炼，攻防兼备的炼气至宝...',
  realmRange: [0, 0],
  type: 'treasure',
  rarity: 'epic',
  itemId: 'trea_lianqi_7',
  rings: [
    {
      desc: '你发现一处火属性灵脉的核心区域，炙热的气息扑面而来，一尊古朴的火罩悬浮在岩浆之上...',
      choices: [
        { icon: '🔥', text: '以灵力压制火焰收取', hint: '高风险 / 需战力≥500', risk: 'high', requires: { power: 500 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应宝物灵性', hint: '中风险 / 需气运≥155', risk: 'mid', requires: { luck: 155 }, nextRing: 2 },
        { icon: '🚪', text: '此地太过危险，暂时离开', hint: '无奖励', risk: 'safe', nextRing: -1, reward: { wealth: 75 } },
      ]
    },
    {
      desc: '离火罩的灵性被你的气运所引，开始缓缓向你靠近，似乎可以尝试认主...',
      choices: [
        { icon: '🩸', text: '滴血认主，建立契约', hint: '高风险 / 需天赋≥150', risk: 'high', requires: { talent: 150 }, nextRing: 3 },
        { icon: '🏃', text: '不敢冒险，悄然离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 80 } },
      ]
    },
    {
      desc: '你与离火罩建立了初步联系，感受到其中蕴含的强大火属灵力...',
      choices: [
        { icon: '⚡', text: '尝试完全炼化离火罩', hint: '高风险 / 需战力≥650', risk: 'high', requires: { power: 650 }, nextRing: 3 },
        { icon: '🙏', text: '接受当前状态，徐徐图之', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 3 } },
      ]
    },
    {
      desc: '离火罩彻底认主！其蕴含的离火精华融入你的身体，战力大增！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 法宝奇遇：玄天真剑 (legendary)
const lianqiXuanTianAdventure = {
  title: '⚜️ 玄天真剑',
  desc: '蕴含玄天真意，神威莫测的炼气至宝...',
  realmRange: [0, 0],
  type: 'treasure',
  rarity: 'legendary',
  itemId: 'trea_lianqi_8',
  rings: [
    {
      desc: '天降异象，一柄散发玄天之气的神剑从天而降，直插入你面前的土地中，剑意凌冽...',
      choices: [
        { icon: '⚔️', text: '以战力压制神剑剑意', hint: '高风险 / 需战力≥720', risk: 'high', requires: { power: 720 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应剑中真意', hint: '中风险 / 需气运≥160', risk: 'mid', requires: { luck: 160 }, nextRing: 2 },
        { icon: '🚪', text: '神剑不凡，恐难驾驭，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 60 } },
      ]
    },
    {
      desc: '神剑剑意收敛，似乎在试探你的资质。你发现剑身上刻有「玄天」二字...',
      choices: [
        { icon: '🩸', text: '以精血为引，强行认主', hint: '高风险 / 需天赋≥155', risk: 'high', requires: { talent: 155 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃机缘', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 100 } },
      ]
    },
    {
      desc: '你与神剑建立了联系，感受到其中蕴含的玄天真意正在觉醒...',
      choices: [
        { icon: '⚡', text: '尝试完全激发神剑威力', hint: '高风险 / 需气运≥170', risk: 'high', requires: { luck: 170 }, nextRing: 3 },
        { icon: '🙏', text: '稳扎稳打，逐步炼化', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 5 } },
      ]
    },
    {
      desc: '玄天真剑彻底认主！剑中蕴含的玄天真意融入你的修炼体系，战力和天赋均得到极大提升！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// ===== 筑基期奇遇 =====
// 筑基期奇遇：战力要求=8000，气运要求≥100，天赋要求≥105
// 功法奇遇：太古真龙变 (legendary)
const zhujiTaiGuAdventure = {
  title: '🐉 太古真龙变',
  desc: '太古真龙血脉传承，可化真龙之形...',
  realmRange: [1, 1],
  type: 'technique',
  rarity: 'legendary',
  itemId: 'tech_zhenshi',
  rings: [
    {
      desc: '在一处远古龙族遗迹中，发现一枚散发龙威的龙蛋，以及刻在石壁上的功法残篇...',
      choices: [
        { icon: '⚔️', text: '以强横实力强行收取', hint: '高风险 / 需战力≥8000', risk: 'high', requires: { power: 8000 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应龙族血脉', hint: '中风险 / 需气运≥100', risk: 'mid', requires: { luck: 100 }, nextRing: 2 },
        { icon: '🚪', text: '龙威太强，暂避锋芒', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 280 } },
      ]
    },
    {
      desc: '你成功进入遗迹深处，发现功法完整刻在一座龙骨之上，似乎需要做出选择...',
      choices: [
        { icon: '🩸', text: '以血脉之力激活传承', hint: '高风险 / 需天赋≥105', risk: 'high', requires: { talent: 105 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 480 } },
      ]
    },
    {
      desc: '功法奥义开始融入你的身体，你感到血脉中有什么东西在苏醒...',
      choices: [
        { icon: '🐉', text: '接受龙族血脉传承', hint: '高风险 / 需战力≥9600', risk: 'high', requires: { power: 9600 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受部分传承', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 8 } },
      ]
    },
    {
      desc: '太古真龙血脉融入你的体内，你获得了《太古真龙变》的完整传承！战力大增，寿元暴涨！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 法宝奇遇：玄武盾 (epic)
const zhujiXuanWuAdventure = {
  title: '🐢 玄武盾',
  desc: '玄武之力加持，坚不可摧的筑基法宝...',
  realmRange: [1, 1],
  type: 'treasure',
  rarity: 'epic',
  itemId: 'trea_zhuji_7',
  rings: [
    {
      desc: '你在一处上古遗迹中发现一面散发厚重气息的盾牌，似乎是传说中的玄武之盾...',
      choices: [
        { icon: '⚔️', text: '以战力压制盾灵', hint: '高风险 / 需战力≥8500', risk: 'high', requires: { power: 8500 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应玄武意志', hint: '中风险 / 需气运≥105', risk: 'mid', requires: { luck: 105 }, nextRing: 2 },
        { icon: '🚪', text: '气息太沉，放弃探索', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 300 } },
      ]
    },
    {
      desc: '玄武盾的灵性被你的气运引动，显现出一头玄武虚影，似乎在审视你...',
      choices: [
        { icon: '🩸', text: '以精血祭炼玄武盾', hint: '高风险 / 需天赋≥110', risk: 'high', requires: { talent: 110 }, nextRing: 3 },
        { icon: '🏃', text: '不敢涉险，悄然退去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 400 } },
      ]
    },
    {
      desc: '你与玄武盾建立了初步联系，感受到其中蕴含的玄武之力正在觉醒...',
      choices: [
        { icon: '⚡', text: '尝试完全激发玄武之力', hint: '高风险 / 需战力≥10200', risk: 'high', requires: { power: 10200 }, nextRing: 3 },
        { icon: '🙏', text: '接受当前力量，徐徐图之', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 5 } },
      ]
    },
    {
      desc: '玄武盾彻底认主！其蕴含的玄武之力融入你的身体，战力和防御大增！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 法宝奇遇：太古仙剑 (legendary)
const zhujiTaiGuXianAdventure = {
  title: '⚜️ 太古仙剑',
  desc: '太古仙人遗留，威能惊天的筑基至宝...',
  realmRange: [1, 1],
  type: 'treasure',
  rarity: 'legendary',
  itemId: 'trea_zhuji_8',
  rings: [
    {
      desc: '在太古仙人遗留的洞府中，你发现一柄悬浮于虚空中的神剑，剑气冲霄...',
      choices: [
        { icon: '⚔️', text: '以绝对实力压制仙剑', hint: '高风险 / 需战力≥11500', risk: 'high', requires: { power: 11500 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应仙人之念', hint: '中风险 / 需气运≥108', risk: 'mid', requires: { luck: 108 }, nextRing: 2 },
        { icon: '🚪', text: '仙剑之威深不可测，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 380 } },
      ]
    },
    {
      desc: '仙剑剑灵似乎感应到了你的存在，开始散发出温和的剑意，似乎可以接近...',
      choices: [
        { icon: '🩸', text: '以精血为媒，强行认主', hint: '高风险 / 需天赋≥112', risk: 'high', requires: { talent: 112 }, nextRing: 3 },
        { icon: '🏃', text: '不敢冒险，取走部分离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 520 } },
      ]
    },
    {
      desc: '仙剑认主成功！你感到剑中蕴含的太古仙人之念正在涌入你的识海...',
      choices: [
        { icon: '⚡', text: '接受完整仙道传承', hint: '高风险 / 需气运≥112', risk: 'high', requires: { luck: 112 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受部分传承', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 10 } },
      ]
    },
    {
      desc: '太古仙剑彻底认主！其蕴含的仙道之力融入你的身体，战力、天赋、修为大增！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// ===== 金丹期奇遇 =====
// 金丹期奇遇：战力要求=82500，气运要求≥118，天赋要求≥118
// 功法奇遇：阴阳交泰诀 (legendary)
const jindanYinYangAdventure = {
  title: '☯️ 阴阳交泰诀',
  desc: '阴阳调和，天地至理，战力登峰造极...',
  realmRange: [2, 2],
  type: 'technique',
  rarity: 'legendary',
  itemId: 'tech_yinyang',
  rings: [
    {
      desc: '你在一处天地灵气交汇之地，发现一枚散发阴阳二气的玉简，似乎是上古大能所留...',
      choices: [
        { icon: '⚔️', text: '以实力强行感悟', hint: '高风险 / 需战力≥82500', risk: 'high', requires: { power: 82500 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应阴阳本源', hint: '中风险 / 需气运≥118', risk: 'mid', requires: { luck: 118 }, nextRing: 2 },
        { icon: '🚪', text: '阴阳之力深不可测，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 1100 } },
      ]
    },
    {
      desc: '玉简中的阴阳之力被你的气运引动，开始显现出一幅阴阳鱼的图案...',
      choices: [
        { icon: '🌀', text: '尝试领悟阴阳真意', hint: '高风险 / 需天赋≥118', risk: 'high', requires: { talent: 118 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 1500 } },
      ]
    },
    {
      desc: '阴阳真意开始融入你的识海，你感到对天地至理的理解飞速提升...',
      choices: [
        { icon: '⚡', text: '冲击完整阴阳大道', hint: '高风险 / 需战力≥99000', risk: 'high', requires: { power: 99000 }, nextRing: 3 },
        { icon: '🙏', text: '稳扎稳打，接受部分传承', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 15 } },
      ]
    },
    {
      desc: '阴阳交泰诀彻底融入你的修炼体系！天地至理化为己用，战力登峰造极，寿元大涨！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 功法奇遇：天人感应法 (epic)
const jindanTianRenAdventure = {
  title: '🌟 天人感应法',
  desc: '与天地灵气交感，借天地之力为己用...',
  realmRange: [2, 2],
  type: 'technique',
  rarity: 'epic',
  itemId: 'tech_tianren',
  rings: [
    {
      desc: '在天人交汇之地，你感应到一缕特殊的灵气，似乎蕴含着天人之道...',
      choices: [
        { icon: '⚔️', text: '以强横实力强行感悟', hint: '高风险 / 需战力≥91000', risk: 'high', requires: { power: 91000 }, nextRing: 1 },
        { icon: '💫', text: '以气运沟通天人', hint: '中风险 / 需气运≥120', risk: 'mid', requires: { luck: 120 }, nextRing: 2 },
        { icon: '🚪', text: '天人之力难以捉摸，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 1200 } },
      ]
    },
    {
      desc: '天人之力回应了你的感应，一缕天机显现，似乎可以更进一步...',
      choices: [
        { icon: '🌀', text: '尝试融合天机', hint: '高风险 / 需天赋≥122', risk: 'high', requires: { talent: 122 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 1600 } },
      ]
    },
    {
      desc: '天机融入你的神识，你感到与天地的联系变得更加紧密...',
      choices: [
        { icon: '⚡', text: '尝试获得完整天人感应', hint: '高风险 / 需气运≥125', risk: 'high', requires: { luck: 125 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受当前感悟', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 10 } },
      ]
    },
    {
      desc: '天人感应法彻底融入你的修炼体系！你与天地灵气交感，战力大增，寿元提升！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 法宝奇遇：阴阳扇 (legendary)
const jindanYinYangFanAdventure = {
  title: '🪭 阴阳扇',
  desc: '阴阳调和，可扇动天地的金丹至宝...',
  realmRange: [2, 2],
  type: 'treasure',
  rarity: 'legendary',
  itemId: 'trea_jindan_8',
  rings: [
    {
      desc: '你在一处阴阳交汇之地，发现一柄散发黑白二气的宝扇，似乎蕴含着天地至理...',
      choices: [
        { icon: '⚔️', text: '以实力压制阴阳之力', hint: '高风险 / 需战力≥116000', risk: 'high', requires: { power: 116000 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应阴阳本源', hint: '中风险 / 需气运≥125', risk: 'mid', requires: { luck: 125 }, nextRing: 2 },
        { icon: '🚪', text: '阴阳之力太过危险，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 1300 } },
      ]
    },
    {
      desc: '阴阳扇的器灵被你的气运引动，开始显现出太极图案，似乎可以尝试认主...',
      choices: [
        { icon: '🩸', text: '以精血开启器灵', hint: '高风险 / 需天赋≥128', risk: 'high', requires: { talent: 128 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 1800 } },
      ]
    },
    {
      desc: '你与阴阳扇建立了联系，感受到其中蕴含的阴阳之力正在苏醒...',
      choices: [
        { icon: '⚡', text: '尝试激发完整阴阳之力', hint: '高风险 / 需战力≥123750', risk: 'high', requires: { power: 123750 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受当前力量', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 12 } },
      ]
    },
    {
      desc: '阴阳扇彻底认主！其蕴含的阴阳之力融入你的身体，可扇动天地，战力大增！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 法宝奇遇：焚天炉 (epic)
const jindanFenTianAdventure = {
  title: '🏺 焚天炉',
  desc: '可炼万物，攻防一体的金丹法宝...',
  realmRange: [2, 2],
  type: 'treasure',
  rarity: 'epic',
  itemId: 'trea_jindan_7',
  rings: [
    {
      desc: '在一处上古炼器师的遗迹中，你发现一尊散发炙热气息的丹炉，似乎蕴含焚天之威...',
      choices: [
        { icon: '🔥', text: '以强横实力压制炉火', hint: '高风险 / 需战力≥82500', risk: 'high', requires: { power: 82500 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应炉灵', hint: '中风险 / 需气运≥118', risk: 'mid', requires: { luck: 118 }, nextRing: 2 },
        { icon: '🚪', text: '焚天之威难以驾驭，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 1400 } },
      ]
    },
    {
      desc: '焚天炉的炉灵被你的气运引动，炉火开始温和地跳动，似乎可以接近...',
      choices: [
        { icon: '🩸', text: '以精血祭炼炉灵', hint: '高风险 / 需天赋≥125', risk: 'high', requires: { talent: 125 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 1800 } },
      ]
    },
    {
      desc: '你与焚天炉建立了联系，感受到其中蕴含的焚天之力正在觉醒...',
      choices: [
        { icon: '⚡', text: '尝试激发焚天之威', hint: '高风险 / 需战力≥99000', risk: 'high', requires: { power: 99000 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受当前力量', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 8 } },
      ]
    },
    {
      desc: '焚天炉彻底认主！其蕴含的焚天之力融入你的身体，战力和修为大增！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// ===== 元婴期奇遇 =====
// 元婴期奇遇：战力要求=700000，气运要求≥138，天赋要求≥140
// 功法奇遇：鸿蒙混沌经 (legendary)
const yuanyingHongMengAdventure = {
  title: '🌪️ 鸿蒙混沌经',
  desc: '天地未开之时的功法，包罗万象，深不可测...',
  realmRange: [3, 3],
  type: 'technique',
  rarity: 'legendary',
  itemId: 'tech_hundun',
  rings: [
    {
      desc: '在混沌未开之地，你发现一枚散发混沌之气的玉简，似乎蕴含着天地初开的奥秘...',
      choices: [
        { icon: '🌀', text: '以实力镇压混沌', hint: '高风险 / 需战力≥700000', risk: 'high', requires: { power: 700000 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应混沌本源', hint: '中风险 / 需气运≥138', risk: 'mid', requires: { luck: 138 }, nextRing: 2 },
        { icon: '🚪', text: '混沌之力深不可测，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 5000 } },
      ]
    },
    {
      desc: '混沌之力被你的气运引动，开始显现出天地初开时的景象...',
      choices: [
        { icon: '🌀', text: '尝试融入混沌感悟', hint: '高风险 / 需天赋≥140', risk: 'high', requires: { talent: 140 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 6500 } },
      ]
    },
    {
      desc: '混沌真意开始融入你的识海，你感到对天地的理解突破了新的境界...',
      choices: [
        { icon: '⚡', text: '冲击完整混沌大道', hint: '高风险 / 需战力≥910000', risk: 'high', requires: { power: 910000 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受当前感悟', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 20 } },
      ]
    },
    {
      desc: '鸿蒙混沌经彻底融入你的修炼体系！天地至理化为己用，战力登峰，天赋暴涨，寿元大增！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 功法奇遇：九幽魔道篇 (legendary)
const yuanyingMoDaoAdventure = {
  title: '💀 九幽魔道篇',
  desc: '魔道至尊功法，战力通天但代价惨重...',
  realmRange: [3, 3],
  type: 'technique',
  rarity: 'legendary',
  itemId: 'tech_xuanmo',
  rings: [
    {
      desc: '在九幽魔地深处，你发现一枚散发魔气的玉简，似乎蕴含着魔道至尊的传承...',
      choices: [
        { icon: '⚔️', text: '以绝对实力压制魔气', hint: '高风险 / 需战力≥770000', risk: 'high', requires: { power: 770000 }, nextRing: 1 },
        { icon: '💫', text: '以魔道气运感应传承', hint: '中风险 / 需气运≥142', risk: 'mid', requires: { luck: 142 }, nextRing: 2 },
        { icon: '🚪', text: '魔道太过危险，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 5200 } },
      ]
    },
    {
      desc: '魔道传承被你的气运引动，魔气开始向你汇聚...',
      choices: [
        { icon: '💀', text: '以魔道之心接受传承', hint: '高风险 / 需天赋≥145', risk: 'high', requires: { talent: 145 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 6800 } },
      ]
    },
    {
      desc: '魔道之力开始融入你的身体，你感到战力暴涨，但也感受到一丝不安...',
      choices: [
        { icon: '⚡', text: '接受完整魔道传承', hint: '高风险 / 需战力≥980000', risk: 'high', requires: { power: 980000 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受部分传承', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 15 } },
      ]
    },
    {
      desc: '九幽魔道篇彻底融入你的修炼体系！魔道至尊之力为你所用，战力通天！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 功法奇遇：北极紫微诀 (epic)
const yuanyingBeiJiAdventure = {
  title: '⭐ 北极紫微诀',
  desc: '紫微星君传承，星辰之力加持神魂...',
  realmRange: [3, 3],
  type: 'technique',
  rarity: 'epic',
  itemId: 'tech_beidou',
  rings: [
    {
      desc: '在北极星君遗迹中，你发现一枚散发星光的玉简，似乎蕴含着星辰之力...',
      choices: [
        { icon: '⚔️', text: '以实力感应星辰', hint: '高风险 / 需战力≥840000', risk: 'high', requires: { power: 840000 }, nextRing: 1 },
        { icon: '💫', text: '以气运沟通星辰意志', hint: '中风险 / 需气运≥140', risk: 'mid', requires: { luck: 140 }, nextRing: 2 },
        { icon: '🚪', text: '星辰之力高不可攀，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 4800 } },
      ]
    },
    {
      desc: '星辰之力回应了你的感应，北极紫微星的投影开始显现...',
      choices: [
        { icon: '⭐', text: '尝试接受星君传承', hint: '高风险 / 需天赋≥142', risk: 'high', requires: { talent: 142 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 6000 } },
      ]
    },
    {
      desc: '星辰之力开始融入你的神魂，你感到神识大涨，对天道的理解加深...',
      choices: [
        { icon: '⚡', text: '冲击完整星辰传承', hint: '高风险 / 需气运≥145', risk: 'high', requires: { luck: 145 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受当前传承', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 18 } },
      ]
    },
    {
      desc: '北极紫微诀彻底融入你的修炼体系！星辰之力加持神魂，天赋和修为大增！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 法宝奇遇：盘古斧 (legendary)
const yuanyingPanGuAdventure = {
  title: '🪓 盘古斧',
  desc: '开天辟地之威，毁天灭地的元婴至宝...',
  realmRange: [3, 3],
  type: 'treasure',
  rarity: 'legendary',
  itemId: 'trea_yuanying_8',
  rings: [
    {
      desc: '在开天辟地遗迹中，你发现一柄散发混沌之气的巨斧，似乎蕴含着开天之力...',
      choices: [
        { icon: '⚔️', text: '以绝对实力镇压斧灵', hint: '高风险 / 需战力≥1050000', risk: 'high', requires: { power: 1050000 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应开天意志', hint: '中风险 / 需气运≥148', risk: 'mid', requires: { luck: 148 }, nextRing: 2 },
        { icon: '🚪', text: '开天之力太过恐怖，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 6000 } },
      ]
    },
    {
      desc: '盘古斧的斧灵被你的气运引动，散发出一丝温和的开天之气...',
      choices: [
        { icon: '🩸', text: '以精血祭炼斧灵', hint: '高风险 / 需天赋≥150', risk: 'high', requires: { talent: 150 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 7200 } },
      ]
    },
    {
      desc: '你与盘古斧建立了联系，感受到其中蕴含的开天之力正在觉醒...',
      choices: [
        { icon: '⚡', text: '尝试激发完整开天之威', hint: '高风险 / 需战力≥980000', risk: 'high', requires: { power: 980000 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受当前力量', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 25 } },
      ]
    },
    {
      desc: '盘古斧彻底认主！其蕴含的开天之力融入你的身体，可毁天灭地，战力暴涨！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 法宝奇遇：天魔旗 (epic)
const yuanyingTianMoAdventure = {
  title: '🚩 天魔旗',
  desc: '天魔残魂所附，凶威滔天的元婴法宝...',
  realmRange: [3, 3],
  type: 'treasure',
  rarity: 'epic',
  itemId: 'trea_yuanying_7',
  rings: [
    {
      desc: '在九幽魔地深处，你发现一杆散发滔天魔气的旗帜，似乎蕴含着天魔之力...',
      choices: [
        { icon: '⚔️', text: '以绝对实力压制魔旗', hint: '高风险 / 需战力≥875000', risk: 'high', requires: { power: 875000 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应天魔意志', hint: '中风险 / 需气运≥145', risk: 'mid', requires: { luck: 145 }, nextRing: 2 },
        { icon: '🚪', text: '天魔之力太过恐怖，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 5500 } },
      ]
    },
    {
      desc: '天魔旗的魔灵被你的气运引动，开始显化出天魔虚影...',
      choices: [
        { icon: '💀', text: '以魔道之心接受传承', hint: '高风险 / 需天赋≥148', risk: 'high', requires: { talent: 148 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 6800 } },
      ]
    },
    {
      desc: '天魔之力开始融入你的神魂，你感到战力暴涨，但也感受到一丝魔道反噬...',
      choices: [
        { icon: '⚡', text: '尝试完全掌控天魔之力', hint: '高风险 / 需战力≥1025000', risk: 'high', requires: { power: 1025000 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受当前力量', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 15 } },
      ]
    },
    {
      desc: '天魔旗彻底认主！其蕴含的天魔之力为你所用，凶威滔天，战力暴涨！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 法宝奇遇：玄武战甲 (epic)
const yuanyingXuanWuArmorAdventure = {
  title: '🛡️ 玄武战甲',
  desc: '玄武战魂所化，坚不可摧的元婴法宝...',
  realmRange: [3, 3],
  type: 'treasure',
  rarity: 'epic',
  itemId: 'trea_yuanying_4',
  rings: [
    {
      desc: '在玄武遗迹深处，你发现一副散发厚重气息的战甲，似乎蕴含着玄武战魂...',
      choices: [
        { icon: '⚔️', text: '以实力压制战魂', hint: '高风险 / 需战力≥910000', risk: 'high', requires: { power: 910000 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应玄武意志', hint: '中风险 / 需气运≥150', risk: 'mid', requires: { luck: 150 }, nextRing: 2 },
        { icon: '🚪', text: '玄武之威难以驾驭，离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 5600 } },
      ]
    },
    {
      desc: '玄武战甲的战魂被你的气运引动，开始显化出玄武虚影...',
      choices: [
        { icon: '🩸', text: '以精血祭炼战魂', hint: '高风险 / 需天赋≥152', risk: 'high', requires: { talent: 152 }, nextRing: 3 },
        { icon: '🏃', text: '风险太大，放弃离去', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 6800 } },
      ]
    },
    {
      desc: '玄武战魂开始融入你的身体，你感到防御大增，但也感受到一丝沉重...',
      choices: [
        { icon: '⚡', text: '尝试完全激发玄武之力', hint: '高风险 / 需战力≥945000', risk: 'high', requires: { power: 945000 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受当前力量', hint: '获得寿元奖励', risk: 'safe', nextRing: -1, reward: { lifespan: 12 } },
      ]
    },
    {
      desc: '玄武战甲彻底认主！其蕴含的玄武战魂为你所用，坚不可摧，战力大增！',
      choices: [],
      finalReward: { giveItem: true },
    }
  ]
};

// 游戏在突破化神时结束，无化神奇遇
// （化神相关奇遇已删除）


// ===== 导出普通奇遇 =====
const lianqiImmortalGuideAdventure = {
  title: '🌟 仙人指路',
  desc: '云游仙人见你天资不凡，指点一二...',
  realmRange: [0, 0],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '一位仙风道骨的云游仙人出现在你面前，他打量了你一番，露出赞许之色...',
      choices: [
        { icon: '🙏', text: '恭敬请教修炼之道', hint: '中风险 / 需气运≥85', risk: 'mid', requires: { luck: 85 }, nextRing: 1 },
        { icon: '💫', text: '以诚心打动仙人', hint: '低风险 / 需气运≥75', risk: 'mid', requires: { luck: 75 }, nextRing: 2 },
        { icon: '🚪', text: '无缘错过，转身离去', hint: '无奖励', risk: 'safe', nextRing: -1 },
      ]
    },
    {
      desc: '仙人微微一笑，传授你一篇入门心法口诀，并指引你前往一处灵气充沛之地...',
      choices: [
        { icon: '📖', text: '立刻前往仙人指引之地', hint: '中风险 / 需天赋≥95', risk: 'mid', requires: { talent: 95 }, nextRing: 3 },
        { icon: '🙏', text: '感激不尽，告辞离去', hint: '获得灵石奖励', risk: 'safe', nextRing: -1, reward: { wealth: 50 } },
      ]
    },
    {
      desc: '你的真诚打动了仙人，他赐予你一枚洗髓丹，助你改善修炼资质...',
      choices: [
        { icon: '✨', text: '接受仙人恩赐', hint: '获得天赋和财富', risk: 'safe', nextRing: -1, reward: { talent: 3, wealth: 80 } },
      ]
    },
    {
      desc: '你到达仙人指引之地，在一处灵泉中沐浴，体质得到极大改善！天赋大增！',
      choices: [],
      finalReward: { talent: 5, luck: 3, wealth: 120 },
    }
  ]
};

// 普通奇遇：古修洞府探索
const lianqiCaveExploreAdventure = {
  title: '🏔️ 古修洞府',
  desc: '发现一处远古修士遗留的洞府...',
  realmRange: [0, 0],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '你在山中采药时，无意间发现一处隐蔽的洞府入口，洞口刻着古老的符文...',
      choices: [
        { icon: '⚔️', text: '以实力破开禁制', hint: '高风险 / 需战力≥450', risk: 'high', requires: { power: 450 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应禁制破绽', hint: '中风险 / 需气运≥95', risk: 'mid', requires: { luck: 95 }, nextRing: 2 },
        { icon: '🚪', text: '贸然闯入恐有危险，离去', hint: '无奖励', risk: 'safe', nextRing: -1 },
      ]
    },
    {
      desc: '你成功进入洞府内部，发现一处灵石矿脉，还有古修遗留的一些心得笔记...',
      choices: [
        { icon: '⛏️', text: '开采灵石矿脉', hint: '中风险 / 需战力≥520', risk: 'mid', requires: { power: 520 }, nextRing: 3 },
        { icon: '📖', text: '研读古修心得', hint: '中风险 / 需天赋≥100', risk: 'mid', requires: { talent: 100 }, nextRing: 3 },
      ]
    },
    {
      desc: '你开采了大量灵石，收获颇丰！古修士的财富尽归你有！',
      choices: [],
      finalReward: { wealth: 180 },
    },
    {
      desc: '你仔细研读古修心得，领悟到一些修炼诀窍，天赋有所提升！',
      choices: [],
      finalReward: { talent: 4, wealth: 80 },
    },
  ]
};

// 普通奇遇：天材地宝
const lianqiHerbGatheringAdventure = {
  title: '🌿 灵药采摘',
  desc: '发现一处灵气充沛的灵药园...',
  realmRange: [0, 0],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '你在山野间发现一片散发浓郁灵气的药园，其中生长着几株珍稀灵药...',
      choices: [
        { icon: '🌱', text: '小心翼翼采摘灵药', hint: '低风险 / 需天赋≥88', risk: 'mid', requires: { talent: 88 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应灵药年份', hint: '低风险 / 需气运≥82', risk: 'mid', requires: { luck: 82 }, nextRing: 2 },
        { icon: '🚪', text: '灵药珍贵必有守护，离去', hint: '无奖励', risk: 'safe', nextRing: -1 },
      ]
    },
    {
      desc: '你成功采摘到品质上佳的灵药，可以换取大量灵石！',
      choices: [
        { icon: '💰', text: '直接出售灵药', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 100 } },
        { icon: '✨', text: '自己炼化吸收', hint: '获得天赋和财富', risk: 'safe', nextRing: -1, reward: { talent: 2, wealth: 60 } },
      ]
    },
    {
      desc: '你以气运感应到一株百年灵药，价值连城！但采摘过程颇为惊险...',
      choices: [
        { icon: '⚡', text: '冒险采摘百年灵药', hint: '高风险 / 需战力≥480', risk: 'high', requires: { power: 480 }, nextRing: 3 },
        { icon: '🙏', text: '见好就收，取走普通灵药', hint: '获得灵石', risk: 'safe', nextRing: -1, reward: { wealth: 90 } },
      ]
    },
    {
      desc: '你成功采摘到百年灵药！其蕴含的灵气被你吸收，天赋大增！',
      choices: [],
      finalReward: { talent: 6, wealth: 150 },
    },
  ]
};

// ===== 筑基期普通奇遇 =====
// 普通奇遇：上古遗迹
const zhujiAncientRuinsAdventure = {
  title: '🏛️ 上古遗迹',
  desc: '发现一处蕴含上古秘密的遗迹...',
  realmRange: [1, 1],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '你在探索时发现一处被时间掩埋的上古遗迹，墙壁上刻满了神秘的符文...',
      choices: [
        { icon: '⚔️', text: '强行破阵进入核心', hint: '高风险 / 需战力≥7500', risk: 'high', requires: { power: 7500 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应遗迹意志', hint: '中风险 / 需气运≥110', risk: 'mid', requires: { luck: 110 }, nextRing: 2 },
        { icon: '🚪', text: '遗迹深不可测，离去', hint: '获得少量灵石', risk: 'safe', nextRing: -1, reward: { wealth: 200 } },
      ]
    },
    {
      desc: '遗迹大门缓缓开启，你发现一处上古修士的藏宝室，内有大量灵石和灵材...',
      choices: [
        { icon: '💰', text: '收取所有宝物', hint: '高风险 / 需战力≥8800', risk: 'high', requires: { power: 8800 }, nextRing: 3 },
        { icon: '📖', text: '先研读墙壁符文', hint: '中风险 / 需天赋≥115', risk: 'mid', requires: { talent: 115 }, nextRing: 3 },
      ]
    },
    {
      desc: '你成功收取了上古修士的遗产！一夜暴富！',
      choices: [],
      finalReward: { wealth: 600 },
    },
    {
      desc: '墙壁符文记载着上古修炼心得，你领悟了部分奥秘，天赋大增！',
      choices: [],
      finalReward: { talent: 6, wealth: 350 },
    },
  ]
};

// 普通奇遇：灵兽认主
const zhujiBeastTamingAdventure = {
  title: '🦊 灵兽认主',
  desc: '遇到一只通灵的小兽...',
  realmRange: [1, 1],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '一只散发灵光的幼兽出现在你面前，它似乎对你颇有好感，绕着你打转...',
      choices: [
        { icon: '💫', text: '以气运与其沟通', hint: '中风险 / 需气运≥105', risk: 'mid', requires: { luck: 105 }, nextRing: 1 },
        { icon: '🩸', text: '滴血尝试认主', hint: '高风险 / 需天赋≥122', risk: 'high', requires: { talent: 122 }, nextRing: 2 },
        { icon: '🚪', text: '灵兽难驯，暂且离去', hint: '无奖励', risk: 'safe', nextRing: -1 },
      ]
    },
    {
      desc: '幼兽与你建立了心灵联系，它告诉你一处隐秘的宝地，似乎是它的巢穴...',
      choices: [
        { icon: '✨', text: '跟随幼兽前往宝地', hint: '获得气运和财富', risk: 'safe', nextRing: -1, reward: { luck: 5, wealth: 400 } },
      ]
    },
    {
      desc: '你与幼兽滴血认主成功！它认你为主，并将一处藏宝地点告诉你...',
      choices: [
        { icon: '💎', text: '前往幼兽指引之地', hint: '获得大量财富和天赋', risk: 'safe', nextRing: -1, reward: { wealth: 550, talent: 4 } },
      ]
    },
  ]
};

// 普通奇遇：丹道传承
const zhujiAlchemyAdventure = {
  title: '🏺 丹道传承',
  desc: '遇到一位隐世炼丹师...',
  realmRange: [1, 1],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '一位白发苍苍的隐世炼丹师在山中采药，你偶遇了他，交谈之下颇为投缘...',
      choices: [
        { icon: '📖', text: '诚恳请教炼丹之术', hint: '中风险 / 需天赋≥175', risk: 'mid', requires: { talent: 175 }, nextRing: 1 },
        { icon: '💰', text: '请求购买他的丹药', hint: '需财富≥500', risk: 'safe', nextRing: 2 },
        { icon: '🚪', text: '萍水相逢，告辞离去', hint: '无奖励', risk: 'safe', nextRing: -1 },
      ]
    },
    {
      desc: '炼丹师欣赏你的诚恳，决定传授你一些炼丹心得，并送你一炉灵丹...',
      choices: [],
      finalReward: { talent: 5, luck: 3 },
    },
    {
      desc: '炼丹师被你诚意打动，将多年珍藏的丹药低价转让，换取了一笔可观的灵石...',
      choices: [],
      finalReward: { wealth: 450 },
    },
  ]
};

// ===== 金丹期普通奇遇 =====
// 普通奇遇：悟道石碑
const jindanSteleAdventure = {
  title: '📜 悟道石碑',
  desc: '发现一块蕴含天地至理的上古石碑...',
  realmRange: [2, 2],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '你在古迹中偶然发现一块散发大道气息的石碑，上面刻满了晦涩难懂的符文...',
      choices: [
        { icon: '🧠', text: '静心参悟石碑奥秘', hint: '高风险 / 需天赋≥185', risk: 'high', requires: { talent: 185 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应大道真意', hint: '中风险 / 需气运≥190', risk: 'mid', requires: { luck: 190 }, nextRing: 2 },
        { icon: '🚪', text: '道法深奥难以领悟，离去', hint: '无奖励', risk: 'safe', nextRing: -1 },
      ]
    },
    {
      desc: '你成功领悟石碑的部分奥秘，天赋和气运都有所提升！',
      choices: [],
      finalReward: { talent: 8, luck: 5 },
    },
    {
      desc: '石碑的符文开始闪烁，大道真意涌入你的识海...',
      choices: [
        { icon: '⚡', text: '全力参悟大道', hint: '高风险 / 需战力≥105000', risk: 'high', requires: { power: 105000 }, nextRing: 3 },
        { icon: '🙏', text: '保守接受部分感悟', hint: '获得天赋', risk: 'safe', nextRing: -1, reward: { talent: 6 } },
      ]
    },
    {
      desc: '你完全领悟了石碑的奥秘！天赋暴涨，对天道的理解达到新的境界！',
      choices: [],
      finalReward: { talent: 12, luck: 8 },
    },
  ]
};

// 普通奇遇：天材地宝探索
const jindanTreasureGatheringAdventure = {
  title: '💎 天材地宝',
  desc: '发现一处蕴含珍稀灵材的秘境...',
  realmRange: [2, 2],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '你在一处隐秘山谷中发现大量珍稀灵材，这些灵材可以换取巨额财富...',
      choices: [
        { icon: '⛏️', text: '大规模采集灵材', hint: '高风险 / 需战力≥95000', risk: 'high', requires: { power: 95000 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应最珍贵灵材', hint: '中风险 / 需气运≥185', risk: 'mid', requires: { luck: 185 }, nextRing: 2 },
        { icon: '🚪', text: '此地或有危险，离去', hint: '获得少量财富', risk: 'safe', nextRing: -1, reward: { wealth: 800 } },
      ]
    },
    {
      desc: '你收获了大量珍稀灵材！一夜暴富！',
      choices: [],
      finalReward: { wealth: 2500 },
    },
    {
      desc: '你以气运感应到一处隐藏的宝地，似乎有更珍贵的宝物...',
      choices: [
        { icon: '✨', text: '探索隐藏宝地', hint: '高风险 / 需战力≥110000', risk: 'high', requires: { power: 110000 }, nextRing: 3 },
        { icon: '🙏', text: '见好就收，离去', hint: '获得财富', risk: 'safe', nextRing: -1, reward: { wealth: 1800 } },
      ]
    },
    {
      desc: '你发现了一处上古宝库！获得巨额财富和珍稀灵材，天赋也有所提升！',
      choices: [],
      finalReward: { wealth: 4000, talent: 5 },
    },
  ]
};

// 普通奇遇：秘境探险
const jindanSecretRealmAdventure = {
  title: '🌀 秘境探险',
  desc: '发现一处神秘的小世界入口...',
  realmRange: [2, 2],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '空间裂缝中显现出一处神秘的小世界入口，其中灵气浓郁，似乎蕴含机缘...',
      choices: [
        { icon: '⚔️', text: '以实力强行进入', hint: '高风险 / 需战力≥100000', risk: 'high', requires: { power: 100000 }, nextRing: 1 },
        { icon: '💫', text: '以气运寻找稳定入口', hint: '中风险 / 需气运≥122', risk: 'mid', requires: { luck: 122 }, nextRing: 2 },
        { icon: '🚪', text: '空间裂缝危险莫测，离去', hint: '无奖励', risk: 'safe', nextRing: -1 },
      ]
    },
    {
      desc: '你成功进入小世界，发现其中竟然有一处寿元灵泉！',
      choices: [
        { icon: '⛲', text: '沐浴寿元灵泉', hint: '获得寿元', risk: 'safe', nextRing: -1, reward: { lifespan: 18 } },
        { icon: '💰', text: '收取灵泉水出售', hint: '获得大量财富', risk: 'safe', nextRing: -1, reward: { wealth: 2200 } },
      ]
    },
    {
      desc: '你以气运稳定了空间入口，成功进入小世界...',
      choices: [
        { icon: '✨', text: '深入探索小世界', hint: '获得气运和天赋', risk: 'safe', nextRing: -1, reward: { luck: 8, talent: 6 } },
      ]
    },
  ]
};

// ===== 元婴期普通奇遇 =====
// 普通奇遇：星辰感悟
const yuanyingStarInsightAdventure = {
  title: '⭐ 星辰感悟',
  desc: '感应到北极星辰的召唤...',
  realmRange: [3, 3],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '夜空中的北极星突然大放光芒，一缕星辰之力降临到你身上，召唤你前往...',
      choices: [
        { icon: '⚔️', text: '以实力飞升星辰', hint: '高风险 / 需战力≥750000', risk: 'high', requires: { power: 750000 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应星辰意志', hint: '中风险 / 需气运≥145', risk: 'mid', requires: { luck: 145 }, nextRing: 2 },
        { icon: '🚪', text: '星辰之力高不可攀，离去', hint: '无奖励', risk: 'safe', nextRing: -1 },
      ]
    },
    {
      desc: '你飞升星辰，发现星君遗迹，获得星君的部分传承！天赋暴涨！',
      choices: [],
      finalReward: { talent: 15, luck: 10 },
    },
    {
      desc: '星辰意志回应了你，赐予你一丝星辰本源...',
      choices: [
        { icon: '✨', text: '接受星辰本源', hint: '获得天赋和气运', risk: 'safe', nextRing: -1, reward: { talent: 12, luck: 8 } },
      ]
    },
  ]
};

// 普通奇遇：远古传承
const yuanyingAncientLegacyAdventure = {
  title: '🏛️ 远古传承',
  desc: '发现远古大能的遗迹...',
  realmRange: [3, 3],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '你在混沌虚空中发现一座远古大能的遗迹，其中蕴含着惊人的财富...',
      choices: [
        { icon: '⚔️', text: '以绝对实力破阵', hint: '高风险 / 需战力≥900000', risk: 'high', requires: { power: 900000 }, nextRing: 1 },
        { icon: '💫', text: '以气运感应遗迹入口', hint: '中风险 / 需气运≥138', risk: 'mid', requires: { luck: 138 }, nextRing: 2 },
        { icon: '🚪', text: '遗迹危险未知，离去', hint: '获得财富', risk: 'safe', nextRing: -1, reward: { wealth: 4500 } },
      ]
    },
    {
      desc: '你成功破开禁制，获得远古大能遗留的全部财富！',
      choices: [],
      finalReward: { wealth: 12000 },
    },
    {
      desc: '遗迹大门开启，其中不仅有财富，还有远古大能的修炼心得...',
      choices: [
        { icon: '📖', text: '研读远古修炼心得', hint: '获得天赋和财富', risk: 'safe', nextRing: -1, reward: { talent: 10, wealth: 8000 } },
      ]
    },
  ]
};

// 普通奇遇：天地灵脉
const yuanyingSpiritVeinAdventure = {
  title: '⛰️ 天地灵脉',
  desc: '发现一条蕴含磅礴灵气的灵脉...',
  realmRange: [3, 3],
  type: 'normal',
  rarity: 'common',
  rings: [
    {
      desc: '你发现一条隐藏在山脉深处的巨型灵脉，其中灵气充沛到近乎液化...',
      choices: [
        { icon: '⛏️', text: '开采灵脉核心', hint: '高风险 / 需战力≥850000', risk: 'high', requires: { power: 850000 }, nextRing: 1 },
        { icon: '💫', text: '以气运沟通灵脉意志', hint: '中风险 / 需气运≥135', risk: 'mid', requires: { luck: 135 }, nextRing: 2 },
        { icon: '🚪', text: '灵脉之力难以驾驭，离去', hint: '获得少量财富', risk: 'safe', nextRing: -1, reward: { wealth: 5000 } },
      ]
    },
    {
      desc: '你成功开采了灵脉核心，获得海量灵石！还吸收了部分灵气，天赋提升！',
      choices: [],
      finalReward: { wealth: 15000, talent: 8 },
    },
    {
      desc: '灵脉意志被你气运打动，主动献上一缕本源灵气...',
      choices: [
        { icon: '✨', text: '接受灵脉本源', hint: '获得气运和寿元', risk: 'safe', nextRing: -1, reward: { luck: 12, lifespan: 25 } },
      ]
    },
  ]
};


// ===== 导出普通奇遇 =====

// 合并所有奇遇事件（基于 epic/legendary 品质物品 + 普通奇遇）
const adventureEvents = [
  // ===== 炼气期 =====
  // 功法/法宝奇遇
  lianqiWenDaoAdventure,
  lianqiLiHuoAdventure,
  lianqiXuanTianAdventure,
  // 普通奇遇
  lianqiImmortalGuideAdventure,
  lianqiCaveExploreAdventure,
  lianqiHerbGatheringAdventure,
  // ===== 筑基期 =====
  // 功法/法宝奇遇
  zhujiTaiGuAdventure,
  zhujiXuanWuAdventure,
  zhujiTaiGuXianAdventure,
  // 普通奇遇
  zhujiAncientRuinsAdventure,
  zhujiBeastTamingAdventure,
  zhujiAlchemyAdventure,
  // ===== 金丹期 =====
  // 功法/法宝奇遇
  jindanYinYangAdventure,
  jindanTianRenAdventure,
  jindanYinYangFanAdventure,
  jindanFenTianAdventure,
  // 普通奇遇
  jindanSteleAdventure,
  jindanTreasureGatheringAdventure,
  jindanSecretRealmAdventure,
  // ===== 元婴期 =====
  // 功法/法宝奇遇
  yuanyingHongMengAdventure,
  yuanyingMoDaoAdventure,
  yuanyingBeiJiAdventure,
  yuanyingPanGuAdventure,
  yuanyingTianMoAdventure,
  yuanyingXuanWuArmorAdventure,
  // 普通奇遇
  yuanyingStarInsightAdventure,
  yuanyingAncientLegacyAdventure,
  yuanyingSpiritVeinAdventure,
  // 游戏在突破化神时结束，无化神奇遇
];

// 暴露到全局
window.adventureEvents = adventureEvents;
