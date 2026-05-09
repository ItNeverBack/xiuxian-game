// ===== 命运池 - 所有可抽取的命运条目 =====
// 稀有度权重配置
const rarityWeights = {
  'common': 30,      // 普通（白色）
  'uncommon': 35,    // 优秀（绿色）
  'rare': 25,        // 稀有（蓝色）
  'epic': 10,        // 史诗（紫色）
  'legendary': 8,    // 传说（金色）
  'black': 7         // 厄运（黑色）
};

const allFates = [
  // ===== 出身背景（优秀）=====
  {
    id: 'origin_shuxiang',
    name: '书香门第',
    category: '出身',
    icon: '🏡',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '儒道世家，博览群书，对阵法符文有独特领悟，但体弱多病。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.15, label: '天赋+15%' },
      { attr: 'lifespan', type: 'bonus', value: -15, label: '寿元-15' }
    ],
    tags: ['阵法悟性']
  },
  {
    id: 'origin_buyi',
    name: '布衣寒门',
    category: '出身',
    icon: '🌾',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '草根出身，历经磨砺，气运莫名，奇遇频发，但根基薄弱。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.25, label: '气运+25%' },
      { attr: 'talent', type: 'mult', value: 0.85, label: '天赋-15%' }
    ],
    tags: ['逆天改命']
  },
  {
    id: 'origin_huangzu',
    name: '皇族贵胄',
    category: '出身',
    icon: '👑',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '皇室血脉，财富无忧，各方势力皆有助力。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 100, label: '财富+100' }
    ],
    tags: ['人脉广博']
  },
  {
    id: 'origin_pinmin',
    name: '贫苦出身',
    category: '出身',
    icon: '🥣',
    rarity: 'common',
    rarityName: '普通',
    desc: '出身贫寒，家徒四壁，财富匮乏，起步艰难。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: -30, label: '财富-30' }
    ],
    tags: ['白手起家']
  },
  {
    id: 'origin_fujia',
    name: '富家子弟',
    category: '出身',
    icon: '🏛️',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '含着金汤匙出生，家境殷实，起点高于常人。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 200, label: '财富+200' }
    ],
    tags: ['锦衣玉食']
  },
  {
    id: 'origin_zhongyi',
    name: '中医世家',
    category: '出身',
    icon: '🏥',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '世代行医，略懂药理，识草辨药。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.1, label: '天赋+10%' }
    ],
    tags: ['医学传承']
  },
  {
    id: 'origin_wuliu',
    name: '物流世家',
    category: '出身',
    icon: '🐴',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '跑商的家族，走南闯北，见多识广。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.1, label: '气运+10%' },
      { attr: 'wealth', type: 'bonus', value: 30, label: '财富+30' }
    ],
    tags: ['商旅世家']
  },
  {
    id: 'origin_yinshi',
    name: '隐世家族',
    category: '出身',
    icon: '🏔️',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '隐世不出的修士家族，有些底蕴传承。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.12, label: '天赋+12%' }
    ],
    tags: ['隐世传承']
  },
  {
    id: 'origin_lianyi',
    name: '炼器世家',
    category: '出身',
    icon: '🔨',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '世代炼器，有些家传的炼器心得。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 50, label: '财富+50' }
    ],
    tags: ['炼器传承']
  },
  {
    id: 'origin_changshou',
    name: '长寿家族',
    category: '出身',
    icon: '🧓',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '家族多有长寿之人，遗传体质较好。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 15, label: '寿元+15' }
    ],
    tags: ['长寿血脉']
  },
  {
    id: 'origin_xianjian',
    name: '仙剑有灵',
    category: '出身',
    icon: '⚔️',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '机缘巧合得到一把有灵性的剑胚，可逐渐温养。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.08, label: '天赋+8%' },
      { attr: 'luck', type: 'mult', value: 1.1, label: '气运+10%' }
    ],
    tags: ['剑胚认主']
  },
  {
    id: 'origin_xunhou',
    name: '勋侯之后',
    category: '出身',
    icon: '🎖️',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '祖上是功臣，虽已没落，但还有些家底和人脉。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 80, label: '财富+80' },
      { attr: 'luck', type: 'mult', value: 1.1, label: '气运+10%' }
    ],
    tags: ['名门之后']
  },
  {
    id: 'origin_shujian',
    name: '书剑双绝',
    category: '出身',
    icon: '📚',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '出身书香门第又兼修剑道，文武双全。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.18, label: '天赋+18%' },
      { attr: 'lifespan', type: 'bonus', value: 5, label: '寿元+5' }
    ],
    tags: ['文武双全']
  },
  {
    id: 'origin_juxian',
    name: '聚贤山庄',
    category: '出身',
    icon: '🏔️',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '出身名门望族，资源丰富，有良师指导。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.15, label: '天赋+15%' },
      { attr: 'wealth', type: 'bonus', value: 120, label: '财富+120' },
      { attr: 'lifespan', type: 'bonus', value: 10, label: '寿元+10' }
    ],
    tags: ['名门之后']
  },

  // ===== 普通命运（白色）=====
  {
    id: 'common_shufan',
    name: '落榜书生',
    category: '出身',
    icon: '📜',
    rarity: 'common',
    rarityName: '普通',
    desc: '屡试不第的读书人，虽无功名但也识文断字。',
    effects: [
      { attr: 'talent', type: 'mult', value: 0.95, label: '天赋-5%' }
    ],
    tags: ['名落孙山']
  },
  {
    id: 'common_nongmin',
    name: '农户子弟',
    category: '出身',
    icon: '🌾',
    rarity: 'common',
    rarityName: '普通',
    desc: '普通农家出身，勤劳朴实。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 5, label: '寿元+5' }
    ],
    tags: ['农家出身']
  },
  {
    id: 'common_jiangguan',
    name: '将门之后',
    category: '出身',
    icon: '⚔️',
    rarity: 'common',
    rarityName: '普通',
    desc: '祖上是小军官，有些武艺底子。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.05, label: '天赋+5%' }
    ],
    tags: ['武人世家']
  },
  {
    id: 'common_liufang',
    name: '流浪孤儿',
    category: '出身',
    icon: '🎒',
    rarity: 'common',
    rarityName: '普通',
    desc: '四处流浪的孤儿，见多识广但根基不稳。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.05, label: '气运+5%' },
      { attr: 'lifespan', type: 'bonus', value: -3, label: '寿元-3' }
    ],
    tags: ['流浪天涯']
  },
  {
    id: 'common_pingying',
    name: '相貌平平',
    category: '命格',
    icon: '🙈',
    rarity: 'common',
    rarityName: '普通',
    desc: '相貌平平，不引人注目，但也少了些麻烦。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.08, label: '气运+8%' }
    ],
    tags: ['其貌不扬']
  },
  {
    id: 'common_tiruo',
    name: '天生体弱',
    category: '命格',
    icon: '🤒',
    rarity: 'common',
    rarityName: '普通',
    desc: '自幼体弱多病，需要更多时间调养身体。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: -10, label: '寿元-10' }
    ],
    tags: ['体弱多病']
  },
  {
    id: 'common_yizhi',
    name: '意志薄弱',
    category: '命格',
    icon: '🍃',
    rarity: 'common',
    rarityName: '普通',
    desc: '意志不坚，容易被外界诱惑。',
    effects: [
      { attr: 'luck', type: 'mult', value: 0.92, label: '气运-8%' }
    ],
    tags: ['意志不坚']
  },
  {
    id: 'common_yidun',
    name: '反应迟钝',
    category: '天赋',
    icon: '🦥',
    rarity: 'common',
    rarityName: '普通',
    desc: '反应较慢，需要更多时间理解领悟。',
    effects: [
      { attr: 'talent', type: 'mult', value: 0.92, label: '天赋-8%' }
    ],
    tags: ['愚钝木讷']
  },
  {
    id: 'common_poshui',
    name: '破财之相',
    category: '命格',
    icon: '💸',
    rarity: 'common',
    rarityName: '普通',
    desc: '命中注定破财，花钱如流水，难以积攒。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: -30, label: '财富-30' }
    ],
    tags: ['破财之相']
  },
  {
    id: 'common_duoyun',
    name: '命运多舛',
    category: '命格',
    icon: '🌪️',
    rarity: 'common',
    rarityName: '普通',
    desc: '命运起伏不定，时运不济，需坚韧不拔。',
    effects: [
      { attr: 'luck', type: 'mult', value: 0.85, label: '气运-15%' }
    ],
    tags: ['多灾多难']
  },
  {
    id: 'common_duanming',
    name: '短命之兆',
    category: '命格',
    icon: '⏳',
    rarity: 'common',
    rarityName: '普通',
    desc: '天生寿元有亏，需寻找延寿之法。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: -12, label: '寿元-12' }
    ],
    tags: ['寿元有亏']
  },
  {
    id: 'common_zhongcai',
    name: '资质平庸',
    category: '天赋',
    icon: '🌱',
    rarity: 'common',
    rarityName: '普通',
    desc: '天赋普通，无特别出众之处，需要更多努力。',
    effects: [
      { attr: 'talent', type: 'mult', value: 0.85, label: '天赋-15%' }
    ],
    tags: ['资质普通']
  },
  {
    id: 'common_xiaoren',
    name: '小人缠身',
    category: '命格',
    icon: '🐜',
    rarity: 'common',
    rarityName: '普通',
    desc: '身边常有小人作祟，需谨慎行事。',
    effects: [
      { attr: 'luck', type: 'mult', value: 0.8, label: '气运-20%' }
    ],
    tags: ['小人缠身']
  },
  {
    id: 'common_suifeng',
    name: '随风摇摆',
    category: '命格',
    icon: '🍃',
    rarity: 'common',
    rarityName: '普通',
    desc: '意志不坚，容易被外界影响，气运尚可但天赋平平。',
    effects: [
      { attr: 'luck', type: 'mult', value: 0.9, label: '气运-10%' },
      { attr: 'talent', type: 'mult', value: 0.92, label: '天赋-8%' }
    ],
    tags: ['意志薄弱']
  },
  {
    id: 'common_xiaoyuan',
    name: '逍遥散人',
    category: '命格',
    icon: '🌸',
    rarity: 'common',
    rarityName: '普通',
    desc: '放荡不羁爱自由，不喜束缚，随性而为。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 10, label: '寿元+10' },
      { attr: 'luck', type: 'mult', value: 0.95, label: '气运-5%' }
    ],
    tags: ['随性而为']
  },
  {
    id: 'common_jianku',
    name: '艰苦朴素',
    category: '命格',
    icon: '🧵',
    rarity: 'common',
    rarityName: '普通',
    desc: '勤俭节约惯了，财富积累缓慢但稳定，心性坚韧。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 20, label: '财富+20' },
      { attr: 'lifespan', type: 'bonus', value: 8, label: '寿元+8' }
    ],
    tags: ['勤俭持家']
  },
  {
    id: 'common_xingqing',
    name: '性情中人',
    category: '命格',
    icon: '🎭',
    rarity: 'common',
    rarityName: '普通',
    desc: '性格直爽，重情重义，但有时过于冲动。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.05, label: '气运+5%' },
      { attr: 'talent', type: 'mult', value: 0.95, label: '天赋-5%' }
    ],
    tags: ['直来直去']
  },
  {
    id: 'common_tianran',
    name: '天生懒散',
    category: '命格',
    icon: '😴',
    rarity: 'common',
    rarityName: '普通',
    desc: '天生慵懒，不喜争斗，安于现状。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 5, label: '寿元+5' },
      { attr: 'talent', type: 'mult', value: 0.9, label: '天赋-10%' }
    ],
    tags: ['得过且过']
  },
  {
    id: 'common_shimin',
    name: '市井小民',
    category: '出身',
    icon: '🏠',
    rarity: 'common',
    rarityName: '普通',
    desc: '普通市井人家，平平无奇，但也无灾无难。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 5, label: '寿元+5' },
      { attr: 'wealth', type: 'bonus', value: 10, label: '财富+10' }
    ],
    tags: ['平凡是真']
  },
  {
    id: 'common_wuduan',
    name: '五短身材',
    category: '命格',
    icon: '👤',
    rarity: 'common',
    rarityName: '普通',
    desc: '身材矮小，不引人注目，但也少了些麻烦。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.08, label: '气运+8%' },
      { attr: 'talent', type: 'mult', value: 0.95, label: '天赋-5%' }
    ],
    tags: ['低调行事']
  },
  {
    id: 'common_xuetang',
    name: '学堂书生',
    category: '出身',
    icon: '📖',
    rarity: 'common',
    rarityName: '普通',
    desc: '读过几年书，识文断字，但天赋有限。',
    effects: [
      { attr: 'talent', type: 'mult', value: 0.95, label: '天赋-5%' },
      { attr: 'luck', type: 'mult', value: 1.05, label: '气运+5%' }
    ],
    tags: ['书生本色']
  },
  {
    id: 'common_danqin',
    name: '单亲家庭',
    category: '出身',
    icon: '👨‍👧',
    rarity: 'common',
    rarityName: '普通',
    desc: '从小缺乏照顾，独立性强但根基不稳。',
    effects: [
      { attr: 'talent', type: 'mult', value: 0.92, label: '天赋-8%' },
      { attr: 'lifespan', type: 'bonus', value: -5, label: '寿元-5' }
    ],
    tags: ['独立自强']
  },
  {
    id: 'common_wugu',
    name: '五谷不分',
    category: '命格',
    icon: '🌾',
    rarity: 'common',
    rarityName: '普通',
    desc: '不通农事，对灵草辨认困难，但擅长其他。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: -10, label: '财富-10' },
      { attr: 'luck', type: 'mult', value: 1.08, label: '气运+8%' }
    ],
    tags: ['不善务农']
  },

  // ===== 优秀命运（绿色）=====
  {
    id: 'uncommon_tiancai',
    name: '天才儿童',
    category: '天赋',
    icon: '🧒',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '自幼聪明过人，学什么都快。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.15, label: '天赋+15%' }
    ],
    tags: ['天资聪颖']
  },
  {
    id: 'uncommon_jixing',
    name: '吉星高照',
    category: '命格',
    icon: '⭐',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '天生运气好，出门遇贵人。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.2, label: '气运+20%' }
    ],
    tags: ['吉星眷顾']
  },
  {
    id: 'uncommon_ganqi',
    name: '感知敏锐',
    category: '天赋',
    icon: '👓',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '天生对灵气感应特别敏锐。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.1, label: '天赋+10%' }
    ],
    tags: ['感气天赋']
  },
  {
    id: 'uncommon_conghui',
    name: '聪慧敏捷',
    category: '天赋',
    icon: '🧠',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '思维敏捷，但行动迟缓，各有得失。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.12, label: '天赋+12%' },
      { attr: 'lifespan', type: 'bonus', value: -5, label: '寿元-5' }
    ],
    tags: ['动静皆宜']
  },
  {
    id: 'uncommon_houshi',
    name: '人情练达',
    category: '命格',
    icon: '🎭',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '深谙人情世故，官场商场皆能游刃有余。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 80, label: '财富+80' },
      { attr: 'luck', type: 'mult', value: 0.95, label: '气运-5%' }
    ],
    tags: ['人情练达']
  },
  {
    id: 'uncommon_gucai',
    name: '孤才异能',
    category: '天赋',
    icon: '🎁',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '天赋出众但不善交际，常被孤立，独来独往。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.15, label: '天赋+15%' },
      { attr: 'luck', type: 'mult', value: 0.9, label: '气运-10%' }
    ],
    tags: ['天赐禀赋']
  },
  {
    id: 'uncommon_shenpo',
    name: '神魄强壮',
    category: '天赋',
    icon: '🧠',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '神识天生强大，修炼阵法、炼丹事半功倍，但肉身孱弱根基不稳。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.2, label: '天赋+20%' },
      { attr: 'lifespan', type: 'bonus', value: -10, label: '寿元-10' }
    ],
    tags: ['神识强化']
  },
  {
    id: 'uncommon_linggen',
    name: '灵根卓绝',
    category: '天赋',
    icon: '✨',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '灵根天赋出众，但命中注定散财难聚，难以守住家业。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.15, label: '天赋+15%' },
      { attr: 'wealth', type: 'bonus', value: -30, label: '财富-30' }
    ],
    tags: ['根基扎实']
  },
  {
    id: 'uncommon_shouchang',
    name: '寿长运短',
    category: '机缘',
    icon: '🎊',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '寿元绵长，但气运不佳，性格孤僻难合群，常错失良机。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 30, label: '寿元+30' },
      { attr: 'luck', type: 'mult', value: 0.9, label: '气运-10%' }
    ],
    tags: ['福缘深厚']
  },
  {
    id: 'uncommon_shangjia',
    name: '商贾繁盛',
    category: '机缘',
    icon: '🏮',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '生于太平盛世，商贾繁荣财源广进，但修行资质平平悟性不足。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 100, label: '财富+100' },
      { attr: 'talent', type: 'mult', value: 0.9, label: '天赋-10%' }
    ],
    tags: ['国泰民安']
  },
  {
    id: 'uncommon_jianmo',
    name: '剑魔之魂',
    category: '命格',
    icon: '⚔️',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '杀戮中悟道，剑意凌厉，但杀气过重损及寿元根基。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.3, label: '天赋+30%' },
      { attr: 'lifespan', type: 'bonus', value: -30, label: '寿元-30' }
    ],
    tags: ['杀伐果断']
  },
  {
    id: 'uncommon_changqing',
    name: '长青如树',
    category: '命格',
    icon: '🌳',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '天生体质如松柏常青，寿元悠长，不易染病。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 20, label: '寿元+20' }
    ],
    tags: ['体质强健']
  },
  {
    id: 'uncommon_heping',
    name: '和平主义者',
    category: '命格',
    icon: '🕊️',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '厌恶杀伐，潜心修行，但缺乏战斗意志，修炼缓慢却心境平和延年益寿。',
    effects: [
      { attr: 'talent', type: 'mult', value: 0.9, label: '天赋-10%' },
      { attr: 'lifespan', type: 'bonus', value: 30, label: '寿元+30' }
    ],
    tags: ['心境平和']
  },
  {
    id: 'uncommon_guanxing',
    name: '观星问道',
    category: '命格',
    icon: '🔭',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '夜观星象洞悉天机，气运加身，但长期熬夜观测损耗寿元。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.2, label: '气运+20%' },
      { attr: 'lifespan', type: 'bonus', value: -20, label: '寿元-20' }
    ],
    tags: ['洞察天机']
  },
  {
    id: 'uncommon_furen',
    name: '为富不仁',
    category: '命格',
    icon: '💀',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '心狠手辣聚敛财富，但恶名远扬气运受阻。',
    effects: [
      { attr: 'luck', type: 'mult', value: 0.9, label: '气运-10%' },
      { attr: 'wealth', type: 'bonus', value: 400, label: '财富+400' }
    ],
    tags: ['心狠手辣']
  },
  {
    id: 'uncommon_niming',
    name: '逆天改命',
    category: '命格',
    icon: '🔥',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '天生反骨，天赋出众却触怒天道气运受损。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.2, label: '天赋+20%' },
      { attr: 'luck', type: 'mult', value: 0.7, label: '气运-30%' }
    ],
    tags: ['逆天改命']
  },
  {
    id: 'uncommon_kuxiu',
    name: '苦修磨砺',
    category: '命格',
    icon: '💪',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '以苦为乐，历经磨难，根基扎实但耗时良久。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.1, label: '天赋+10%' },
      { attr: 'lifespan', type: 'bonus', value: -10, label: '寿元-10' },
      { attr: 'wealth', type: 'bonus', value: -20, label: '财富-20' }
    ],
    tags: ['意志坚定']
  },
  {
    id: 'uncommon_jinshang',
    name: '奸商本色',
    category: '命格',
    icon: '🧮',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '精于算计，财源广进，但气运受损，声名狼藉。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 150, label: '财富+150' },
      { attr: 'luck', type: 'mult', value: 0.8, label: '气运-20%' }
    ],
    tags: ['唯利是图']
  },
  {
    id: 'uncommon_yinfeng',
    name: '阴风体质',
    category: '天赋',
    icon: '🌑',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '天生阴性体质，修炼阴属功法事半功倍，但阳气不足损寿。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.12, label: '天赋+12%' },
      { attr: 'lifespan', type: 'bonus', value: -12, label: '寿元-12' }
    ],
    tags: ['阴属灵根']
  },
  {
    id: 'uncommon_shanxin',
    name: '善心济世',
    category: '命格',
    icon: '🕊️',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '心怀善念，乐善好施，人脉广泛但家财外散。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.15, label: '气运+15%' },
      { attr: 'wealth', type: 'bonus', value: -50, label: '财富-50' }
    ],
    tags: ['心善济世']
  },
  {
    id: 'uncommon_yangti',
    name: '阳刚体质',
    category: '天赋',
    icon: '☀️',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '天生阳气充沛，修炼阳属功法事半功倍。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.1, label: '天赋+10%' },
      { attr: 'lifespan', type: 'bonus', value: 8, label: '寿元+8' }
    ],
    tags: ['阳属灵根']
  },
  {
    id: 'uncommon_pinliang',
    name: '品性纯良',
    category: '命格',
    icon: '💎',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '心地善良，为人正直，常有贵人相助。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.18, label: '气运+18%' },
      { attr: 'lifespan', type: 'bonus', value: 5, label: '寿元+5' }
    ],
    tags: ['好人好报']
  },
  {
    id: 'uncommon_guha',
    name: '孤寡命格',
    category: '命格',
    icon: '🌙',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '命中注定孤独，无家室牵绊，可专心修炼。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.15, label: '天赋+15%' },
      { attr: 'lifespan', type: 'bonus', value: 10, label: '寿元+10' }
    ],
    tags: ['六亲缘浅']
  },
  {
    id: 'uncommon_shaonian',
    name: '少年老成',
    category: '命格',
    icon: '👴',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '心智早熟，看透世事，修炼稳重但缺乏冲劲。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.12, label: '天赋+12%' },
      { attr: 'luck', type: 'mult', value: 0.92, label: '气运-8%' }
    ],
    tags: ['心智早熟']
  },
  {
    id: 'uncommon_xingke',
    name: '刑克之命',
    category: '命格',
    icon: '⚔️',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '命带刑克，身边的人容易遭殃，但自身运势强盛。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.22, label: '气运+22%' },
      { attr: 'lifespan', type: 'bonus', value: -15, label: '寿元-15' }
    ],
    tags: ['孤星命格']
  },
  {
    id: 'uncommon_baoti',
    name: '宝体天生',
    category: '天赋',
    icon: '💫',
    rarity: 'uncommon',
    rarityName: '优秀',
    desc: '天生宝体，炼体功法进展神速。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.14, label: '天赋+14%' },
      { attr: 'lifespan', type: 'bonus', value: 10, label: '寿元+10' }
    ],
    tags: ['炼体天才']
  },

  // ===== 稀有命运（蓝色）=====
  {
    id: 'rare_lianyao',
    name: '炼药奇才',
    category: '天赋',
    icon: '🌿',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '对草药、丹药有天然敏感，炼药成功率极高。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 150, label: '财富+150' }
    ],
    tags: ['丹道精通']
  },
  {
    id: 'rare_wuxing',
    name: '五行灵根',
    category: '天赋',
    icon: '🔮',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '五行灵根俱全，可修炼任何属性功法。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.25, label: '天赋+25%' }
    ],
    tags: ['五行全能']
  },
  {
    id: 'rare_yinyang',
    name: '阴阳灵根',
    category: '天赋',
    icon: '☯️',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '阴阳灵根兼备，修炼平衡之道，万物皆可。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.2, label: '天赋+20%' },
      { attr: 'lifespan', type: 'bonus', value: 15, label: '寿元+15' }
    ],
    tags: ['阴阳调和']
  },
  {
    id: 'rare_xuling',
    name: '虚灵体质',
    category: '天赋',
    icon: '👻',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '灵魂虚化，修炼神识功法事半功倍，但肉身脆弱。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.18, label: '天赋+18%' },
      { attr: 'lifespan', type: 'bonus', value: -18, label: '寿元-18' },
      { attr: 'luck', type: 'mult', value: 1.1, label: '气运+10%' }
    ],
    tags: ['灵魂虚化']
  },
  {
    id: 'rare_tianyan',
    name: '天眼初开',
    category: '天赋',
    icon: '👁️',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '生而具有神目，能看破虚实，辨别善恶真假。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.2, label: '气运+20%' },
      { attr: 'talent', type: 'mult', value: 1.1, label: '天赋+10%' }
    ],
    tags: ['鉴宝天赋']
  },
  {
    id: 'rare_xiuxian',
    name: '先天慧根',
    category: '天赋',
    icon: '🌟',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '天生聪慧，领悟能力超凡入圣。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.25, label: '天赋+25%' }
    ],
    tags: ['悟性过人']
  },
  {
    id: 'rare_wenquxin',
    name: '文曲星降',
    category: '命格',
    icon: '📚',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '文曲星照耀，聪慧过人，学什么都快。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.3, label: '天赋+30%' }
    ],
    tags: ['文采飞扬']
  },
  {
    id: 'rare_tianci',
    name: '天赐机缘',
    category: '机缘',
    icon: '💫',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '冥冥之中自有天意，奇遇不断，机缘连连。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.35, label: '气运+35%' }
    ],
    tags: ['天意眷顾']
  },
  {
    id: 'rare_longmai',
    name: '龙脉福地',
    category: '机缘',
    icon: '⛰️',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '出身于灵山福地，自幼受灵气滋养，根基扎实。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.2, label: '天赋+20%' },
      { attr: 'lifespan', type: 'bonus', value: 10, label: '寿元+10' }
    ],
    tags: ['福地洞天']
  },
  {
    id: 'rare_guinian',
    name: '龟年鹤寿',
    category: '机缘',
    icon: '🐢',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '寿命绵长，修行时间充裕。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 45, label: '寿元+45' }
    ],
    tags: ['延年益寿']
  },
  {
    id: 'rare_tianlu',
    name: '天禄之身',
    category: '机缘',
    icon: '💰',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '财运亨通，淘宝捡漏如探囊取物。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 200, label: '财富+200' }
    ],
    tags: ['财运亨通']
  },
  {
    id: 'rare_xianlu',
    name: '仙人抚顶',
    category: '机缘',
    icon: '🌙',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '幼年曾受仙人点化，悟道之路平坦顺畅。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.25, label: '天赋+25%' },
      { attr: 'luck', type: 'mult', value: 1.1, label: '气运+10%' }
    ],
    tags: ['仙人指路']
  },
  {
    id: 'rare_fenghua',
    name: '风华绝代',
    category: '命格',
    icon: '🌺',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '容颜出众魅力非凡，人脉广泛。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.25, label: '气运+25%' }
    ],
    tags: ['魅力非凡']
  },
  {
    id: 'rare_ranming',
    name: '燃命催功',
    category: '机缘',
    icon: '🔥',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '修炼速度远超常人，但以燃烧寿元为代价。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.3, label: '天赋+30%' }
    ],
    tags: ['透支本源']
  },
  {
    id: 'rare_danfeng',
    name: '丹凤朝阳',
    category: '命格',
    icon: '🦚',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '如凤凰涅槃，逆境中崛起，越挫越勇。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.3, label: '气运+30%' },
      { attr: 'lifespan', type: 'bonus', value: -10, label: '寿元-10' }
    ],
    tags: ['凤凰命格']
  },
  {
    id: 'rare_zhenxin',
    name: '阵道奇才',
    category: '天赋',
    icon: '🌀',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '对阵道有独特领悟，布阵如神。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.22, label: '天赋+22%' },
      { attr: 'wealth', type: 'bonus', value: 60, label: '财富+60' }
    ],
    tags: ['阵法精通']
  },
  {
    id: 'rare_fengshui',
    name: '风水寻龙',
    category: '机缘',
    icon: '🏯',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '精通风水之道，淘宝捡漏如探囊取物。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 180, label: '财富+180' },
      { attr: 'luck', type: 'mult', value: 1.15, label: '气运+15%' }
    ],
    tags: ['风水宝地']
  },
  {
    id: 'rare_yidao',
    name: '医道传承',
    category: '机缘',
    icon: '⚕️',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '得到医道传承，炼丹炼药皆有天赋。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.2, label: '天赋+20%' },
      { attr: 'wealth', type: 'bonus', value: 100, label: '财富+100' },
      { attr: 'lifespan', type: 'bonus', value: 12, label: '寿元+12' }
    ],
    tags: ['医道传承']
  },
  {
    id: 'rare_tianming',
    name: '天命之人',
    category: '命格',
    icon: '📜',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '冥冥中受天道眷顾，关键时刻总有贵人相助。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.28, label: '气运+28%' },
      { attr: 'talent', type: 'mult', value: 1.1, label: '天赋+10%' }
    ],
    tags: ['天道眷顾']
  },
  {
    id: 'rare_shengjiang',
    name: '神将转世',
    category: '命格',
    icon: '⚔️',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '前世为沙场猛将，今生悟性超群。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.25, label: '天赋+25%' }
    ],
    tags: ['前世记忆']
  },
  {
    id: 'rare_tianzi',
    name: '天资卓越',
    category: '命格',
    icon: '🎯',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '天生骨骼清奇，修炼任何功法都进步神速。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.26, label: '天赋+26%' }
    ],
    tags: ['骨骼清奇']
  },
  {
    id: 'rare_liuli',
    name: '琉璃宝体',
    category: '天赋',
    icon: '💎',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '天生琉璃体质，修炼佛道功法事半功倍。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.18, label: '天赋+18%' },
      { attr: 'lifespan', type: 'bonus', value: 12, label: '寿元+12' }
    ],
    tags: ['琉璃之身']
  },
  {
    id: 'rare_fengliu',
    name: '风流才子',
    category: '命格',
    icon: '🎭',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '才华横溢，魅力非凡，人脉广泛，但情感丰富难以专注修炼。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.25, label: '气运+25%' },
      { attr: 'wealth', type: 'bonus', value: 80, label: '财富+80' },
      { attr: 'lifespan', type: 'bonus', value: -10, label: '寿元-10' }
    ],
    tags: ['魅力四射']
  },
  {
    id: 'rare_xiuxinian',
    name: '惜时如金',
    category: '命格',
    icon: '⏰',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '珍惜每一刻光阴，修炼效率极高，但生活枯燥乏味。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.22, label: '天赋+22%' },
      { attr: 'luck', type: 'mult', value: 0.9, label: '气运-10%' },
      { attr: 'lifespan', type: 'bonus', value: 20, label: '寿元+20' }
    ],
    tags: ['惜时如金']
  },
  {
    id: 'rare_baihu',
    name: '白虎命格',
    category: '命格',
    icon: '🐯',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '白虎星君转世，战意滔天，杀伐果断。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.2, label: '天赋+20%' },
      { attr: 'lifespan', type: 'bonus', value: -12, label: '寿元-12' },
      { attr: 'luck', type: 'mult', value: 1.1, label: '气运+10%' }
    ],
    tags: ['白虎星君']
  },
  {
    id: 'rare_qinglong',
    name: '青龙命格',
    category: '命格',
    icon: '🐉',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '青龙星君转世，运势非凡，天地眷顾。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.35, label: '气运+35%' },
      { attr: 'lifespan', type: 'bonus', value: 20, label: '寿元+20' }
    ],
    tags: ['青龙星君']
  },
  {
    id: 'rare_zhuque',
    name: '朱雀命格',
    category: '命格',
    icon: '🔥',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '朱雀星君转世，浴火重生，修炼速度惊人。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.25, label: '天赋+25%' },
      { attr: 'lifespan', type: 'bonus', value: -15, label: '寿元-15' }
    ],
    tags: ['朱雀星君']
  },
  {
    id: 'rare_xuanwu',
    name: '玄武命格',
    category: '命格',
    icon: '🐢',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '玄武星君转世，攻防兼备，寿元悠长。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 35, label: '寿元+35' },
      { attr: 'talent', type: 'mult', value: 1.1, label: '天赋+10%' }
    ],
    tags: ['玄武星君']
  },
  {
    id: 'rare_youling',
    name: '幽冥之体',
    category: '天赋',
    icon: '👻',
    rarity: 'rare',
    rarityName: '稀有',
    desc: '天生幽冥体质，与鬼魂沟通，修炼鬼道事半功倍。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.15, label: '天赋+15%' },
      { attr: 'luck', type: 'mult', value: 1.2, label: '气运+20%' },
      { attr: 'lifespan', type: 'bonus', value: -8, label: '寿元-8' }
    ],
    tags: ['鬼道天赋']
  },

  // ===== 史诗命运（紫色）=====
  {
    id: 'epic_tianling',
    name: '天灵根',
    category: '天赋',
    icon: '💎',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '五行俱全之灵根，感悟天地大道如探囊取物。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.4, label: '天赋+40%' }
    ],
    tags: ['天纵奇才']
  },
  {
    id: 'epic_tianyan',
    name: '天眼通神',
    category: '天赋',
    icon: '👁️',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '天眼洞开，能看穿一切虚妄，淘宝捡漏如探囊取物。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.3, label: '气运+30%' },
      { attr: 'wealth', type: 'bonus', value: 300, label: '财富+300' },
      { attr: 'talent', type: 'mult', value: 1.1, label: '天赋+10%' }
    ],
    tags: ['洞察天机']
  },
  {
    id: 'epic_wuming',
    name: '无命运者',
    category: '命格',
    icon: '🍀',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '命格空白，不受任何命运束缚，全凭自身努力。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.25, label: '天赋+25%' },
      { attr: 'luck', type: 'mult', value: 1.25, label: '气运+25%' }
    ],
    tags: ['逆天改命']
  },
  {
    id: 'epic_xuanwu',
    name: '玄武庇护',
    category: '命格',
    icon: '🐢',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '北方神兽护佑，寿元绵长，百毒不侵。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 50, label: '寿元+50' }
    ],
    tags: ['防御强化']
  },
  {
    id: 'epic_caishen',
    name: '财神眷顾',
    category: '命格',
    icon: '💰',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '财神眷顾，财源广进，日进斗金。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 400, label: '财富+400' }
    ],
    tags: ['财运亨通']
  },
  {
    id: 'epic_jinshi',
    name: '锦绣前程',
    category: '机缘',
    icon: '🎋',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '前程似锦，荣华富贵唾手可得。',
    effects: [
      { attr: 'wealth', type: 'bonus', value: 300, label: '财富+300' },
      { attr: 'luck', type: 'mult', value: 1.2, label: '气运+20%' }
    ],
    tags: ['前途无量']
  },
  {
    id: 'epic_longyin',
    name: '龙吟体质',
    category: '天赋',
    icon: '🐉',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '体内流淌龙族血脉，天赋能发挥极致，战力无双但龙气反噬。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.3, label: '天赋+30%' },
      { attr: 'lifespan', type: 'bonus', value: -30, label: '寿元-30' },
      { attr: 'luck', type: 'mult', value: 1.15, label: '气运+15%' }
    ],
    tags: ['龙血觉醒']
  },
  {
    id: 'epic_yishuang',
    name: '医武双修',
    category: '机缘',
    icon: '⚕️',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '既能救死扶伤，又能杀伐果断，医武双全。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.22, label: '天赋+22%' },
      { attr: 'wealth', type: 'bonus', value: 200, label: '财富+200' },
      { attr: 'lifespan', type: 'bonus', value: 30, label: '寿元+30' }
    ],
    tags: ['悬壶济世']
  },
  {
    id: 'epic_shengxian',
    name: '圣贤转世',
    category: '命格',
    icon: '📿',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '前世为大能转世，悟性惊人，气运加身，但来历神秘遭人觊觎。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.35, label: '天赋+35%' },
      { attr: 'luck', type: 'mult', value: 1.2, label: '气运+20%' },
      { attr: 'lifespan', type: 'bonus', value: 25, label: '寿元+25' }
    ],
    tags: ['前世记忆']
  },
  {
    id: 'epic_shikong',
    name: '时空灵体',
    category: '天赋',
    icon: '🌀',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '天生时空双属灵根，领悟时空大道，事半功倍。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.35, label: '天赋+35%' },
      { attr: 'luck', type: 'mult', value: 1.15, label: '气运+15%' }
    ],
    tags: ['时空双属']
  },
  {
    id: 'epic_tianmo',
    name: '天魔之躯',
    category: '天赋',
    icon: '👹',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '天生魔道体质，修炼魔功进展神速，战斗力惊人，代价是寿元略有损耗。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.5, label: '天赋+50%' },
      { attr: 'lifespan', type: 'bonus', value: -10, label: '寿元-10' }
    ],
    tags: ['魔道天才']
  },
  {
    id: 'epic_jiuzhuan',
    name: '九转灵体',
    category: '天赋',
    icon: '🔄',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '肉身九转，炼体功法进展神速，攻防兼备。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.28, label: '天赋+28%' },
      { attr: 'lifespan', type: 'bonus', value: 40, label: '寿元+40' }
    ],
    tags: ['炼体极致']
  },
  {
    id: 'epic_qiling',
    name: '器灵亲和',
    category: '天赋',
    icon: '⚔️',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '与器灵天生亲和，炼器悟性超凡，淘宝捡漏易如反掌。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.3, label: '天赋+30%' },
      { attr: 'wealth', type: 'bonus', value: 250, label: '财富+250' }
    ],
    tags: ['炼器天才']
  },
  {
    id: 'epic_tianfu',
    name: '天符之体',
    category: '天赋',
    icon: '📜',
    rarity: 'epic',
    rarityName: '史诗',
    desc: '天生符道体质，符箓天赋卓绝，书写符咒如有神助。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.32, label: '天赋+32%' },
      { attr: 'luck', type: 'mult', value: 1.15, label: '气运+15%' }
    ],
    tags: ['符道精通']
  },

  // ===== 传说命运（金色）=====
  {
    id: 'legendary_tianming',
    name: '天命之子',
    category: '命格',
    icon: '☀️',
    rarity: 'legendary',
    rarityName: '传说',
    desc: '命中注定的主角，关键时刻总有贵人相助，逢凶化吉。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.8, label: '气运+80%' }
    ],
    tags: ['主角光环']
  },
  {
    id: 'legendary_yuelao',
    name: '天命之缘',
    category: '命格',
    icon: '🌙',
    rarity: 'legendary',
    rarityName: '传说',
    desc: '冥冥之中自有天意牵引，命中注定机缘天成，奇遇不断，贵人相随。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.55, label: '气运+55%' },
      { attr: 'talent', type: 'mult', value: 1.12, label: '天赋+12%' },
      { attr: 'lifespan', type: 'bonus', value: 15, label: '寿元+15' }
    ],
    tags: ['天命机缘']
  },
  {
    id: 'legendary_fuhai',
    name: '福泽海润',
    category: '命格',
    icon: '🌊',
    rarity: 'legendary',
    rarityName: '传说',
    desc: '福如东海，寿比南山，一生顺遂无忧。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 80, label: '寿元+80' },
      { attr: 'luck', type: 'mult', value: 1.4, label: '气运+40%' }
    ],
    tags: ['福寿双全']
  },
  {
    id: 'legendary_yongsheng',
    name: '永生之血',
    category: '机缘',
    icon: '🩸',
    rarity: 'legendary',
    rarityName: '传说',
    desc: '血脉中蕴含永生之秘，寿元悠长，时间充裕。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 100, label: '寿元+100' },
      { attr: 'luck', type: 'mult', value: 1.3, label: '气运+30%' }
    ],
    tags: ['永生血脉']
  },
  {
    id: 'legendary_zhutian',
    name: '诸天之子',
    category: '命格',
    icon: '🌌',
    rarity: 'legendary',
    rarityName: '传说',
    desc: '诸天万界宠儿，天地眷顾，修炼之路畅通无阻。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.4, label: '天赋+40%' },
      { attr: 'luck', type: 'mult', value: 1.5, label: '气运+50%' },
      { attr: 'lifespan', type: 'bonus', value: 60, label: '寿元+60' }
    ],
    tags: ['天选之人']
  },
  {
    id: 'legendary_changsheng',
    name: '长生种',
    category: '命格',
    icon: '🌳',
    rarity: 'legendary',
    rarityName: '传说',
    desc: '天生寿元悠长，远超常人，修行时间充裕。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 150, label: '寿元+150' },
      { attr: 'talent', type: 'mult', value: 1.2, label: '天赋+20%' },
      { attr: 'luck', type: 'mult', value: 1.25, label: '气运+25%' }
    ],
    tags: ['寿元悠长']
  },
  {
    id: 'legendary_qiyun',
    name: '气运枢纽',
    category: '命格',
    icon: '🔮',
    rarity: 'legendary',
    rarityName: '传说',
    desc: '天地气运交汇之处，财运、机缘、福运集于一身。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.6, label: '气运+60%' },
      { attr: 'wealth', type: 'bonus', value: 500, label: '财富+500' },
      { attr: 'talent', type: 'mult', value: 1.15, label: '天赋+15%' }
    ],
    tags: ['枢纽命格']
  },
  {
    id: 'legendary_lunhui',
    name: '天道轮回',
    category: '命格',
    icon: '☸️',
    rarity: 'legendary',
    rarityName: '传说',
    desc: '轮回转世之人，携前世记忆而来，悟道如饮水。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.5, label: '天赋+50%' },
      { attr: 'lifespan', type: 'bonus', value: 80, label: '寿元+80' },
      { attr: 'luck', type: 'mult', value: 1.4, label: '气运+40%' }
    ],
    tags: ['轮回转世']
  },
  {
    id: 'legendary_buxiu',
    name: '不朽金身',
    category: '天赋',
    icon: '⚜️',
    rarity: 'legendary',
    rarityName: '传说',
    desc: '肉身不朽不灭，寿元绵长近乎长生，修行时间充裕。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: 120, label: '寿元+120' },
      { attr: 'talent', type: 'mult', value: 1.35, label: '天赋+35%' },
      { attr: 'luck', type: 'mult', value: 1.3, label: '气运+30%' }
    ],
    tags: ['肉身不朽']
  },
  {
    id: 'legendary_wanfayigui',
    name: '万法归一',
    category: '天赋',
    icon: '🌐',
    rarity: 'legendary',
    rarityName: '传说',
    desc: '万法归一，融会贯通，修炼任何功法都能触类旁通。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.55, label: '天赋+55%' },
      { attr: 'luck', type: 'mult', value: 1.35, label: '气运+35%' }
    ],
    tags: ['万法归宗']
  },
  {
    id: 'legendary_zhenlong',
    name: '真龙天子',
    category: '命格',
    icon: '🐲',
    rarity: 'legendary',
    rarityName: '传说',
    desc: '真龙血脉，天生帝王，命格贵不可言。',
    effects: [
      { attr: 'luck', type: 'mult', value: 1.7, label: '气运+70%' },
      { attr: 'wealth', type: 'bonus', value: 600, label: '财富+600' },
      { attr: 'lifespan', type: 'bonus', value: 50, label: '寿元+50' }
    ],
    tags: ['帝王命格']
  },

  // ===== 厄运命运（黑色）=====
  {
    id: 'black_siming',
    name: '死兆降临',
    category: '厄运',
    icon: '💀',
    rarity: 'black',
    rarityName: '厄运',
    desc: '死亡的预兆萦绕不散，寿元被无形之力侵蚀。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: -50, label: '寿元-50' }
    ],
    tags: ['死兆临身']
  },
  {
    id: 'black_yuhun',
    name: '愚昧之魂',
    category: '厄运',
    icon: '🕳️',
    rarity: 'black',
    rarityName: '厄运',
    desc: '灵魂深处被蒙蔽，悟性根基尽毁，难以开窍。',
    effects: [
      { attr: 'talent', type: 'mult', value: 0.5, label: '天赋-50%' }
    ],
    tags: ['愚昧缠身']
  },
  {
    id: 'black_jixing',
    name: '灾星附体',
    category: '厄运',
    icon: '☠️',
    rarity: 'black',
    rarityName: '厄运',
    desc: '灾星附体，霉运缠身，喝凉水都塞牙缝。',
    effects: [
      { attr: 'luck', type: 'mult', value: 0.5, label: '气运-50%' }
    ],
    tags: ['灾星降世']
  },
  {
    id: 'black_tianxie',
    name: '天邪之体',
    category: '厄运',
    icon: '🦀',
    rarity: 'black',
    rarityName: '厄运',
    desc: '天生邪体，修炼邪功进展神速，但遭正道唾弃。',
    effects: [
      { attr: 'talent', type: 'mult', value: 1.2, label: '天赋+20%' },
      { attr: 'luck', type: 'mult', value: 0.5, label: '气运-50%' },
      { attr: 'lifespan', type: 'bonus', value: -25, label: '寿元-25' }
    ],
    tags: ['邪道中人']
  },
  {
    id: 'black_canshi',
    name: '残噬之身',
    category: '厄运',
    icon: '🩸',
    rarity: 'black',
    rarityName: '厄运',
    desc: '身体不断侵蚀自己，修为越高侵蚀越快。',
    effects: [
      { attr: 'lifespan', type: 'bonus', value: -40, label: '寿元-40' },
      { attr: 'talent', type: 'mult', value: 0.7, label: '天赋-30%' },
      { attr: 'luck', type: 'mult', value: 0.6, label: '气运-40%' }
    ],
    tags: ['本源受损']
  }
];

// 命运类别统计
function getFateStats() {
  const stats = {
    byRarity: {},
    byCategory: {},
    total: allFates.length
  };
  
  allFates.forEach(fate => {
    // 按稀有度统计
    stats.byRarity[fate.rarity] = stats.byRarity[fate.rarity] || [];
    stats.byRarity[fate.rarity].push(fate.name);
    
    // 按类别统计
    stats.byCategory[fate.category] = stats.byCategory[fate.category] || [];
    stats.byCategory[fate.category].push(fate.name);
  });
  
  return stats;
}
