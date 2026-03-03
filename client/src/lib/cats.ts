export interface CatData {
  id: string;
  number: string;
  name: string;
  cnName: string;
  breed: string;
  role: string;
  location: string;
  color: string;
  colorHex: string;
  accentHex: string;
  bgHex: string;
  emoji: string;
  tags: string[];
  description: string;
  stats: { label: string; value: string | number; unit?: string }[];
  vitals: { label: string; value: number; color: string }[];
  funFacts: string[];
  unsplashId: string;
}

export const CATS: CatData[] = [
  {
    id: "xiaoyu",
    number: "001",
    name: "XIAOYU",
    cnName: "小橘",
    breed: "橘猫",
    role: "图书馆守护者",
    location: "图书馆一楼",
    color: "暖橘",
    colorHex: "#ff7043",
    accentHex: "#ffccbc",
    bgHex: "#fdf8f2",
    emoji: "🍊",
    tags: ["橘猫", "图书馆", "弹力大师", "爱撒娇"],
    description:
      "小橘是图书馆的常驻守护者，以其橘白相间的毛色和活泼的性格著称。它喜欢在书架间穿梭，偶尔会跳上阅览桌，用温暖的眼神陪伴每一位读者。每当有人靠近，它都会发出响亮的呼噜声，价佛在说'欢迎来图书馆'。",
    stats: [
      { label: "品种", value: "橘猫" },
      { label: "毛色", value: "橘白" },
      { label: "性格", value: "活泼外向" },
      { label: "据点", value: "图书馆" },
      { label: "弹力系数", value: "9.8", unit: "m/s²" },
      { label: "呼噜频率", value: "42", unit: "Hz" },
    ],
    vitals: [
      { label: "活跃度", value: 92, color: "#ff7043" },
      { label: "饥饿度", value: 78, color: "#ff8a65" },
      { label: "撒娇指数", value: 88, color: "#ffab91" },
      { label: "好奇心", value: 95, color: "#ff5722" },
    ],
    funFacts: [
      "橘猫中约80%为雄性，这与X染色体上的基因有关",
      "小橘每天在图书馆巡逻距离约2.3公里",
      "它最喜欢的书架是文学区第三排",
      "小橘能准确判断哪位同学会给它投喂",
    ],
    unsplashId: "photo-1574158622682-e40e69881006",
  },
  {
    id: "xueqiu",
    number: "002",
    name: "XUEQIU",
    cnName: "雪球",
    breed: "英国短毛猫",
    role: "月光巡逻队",
    location: "校园小径",
    color: "纯白",
    colorHex: "#4a90d9",
    accentHex: "#b8d4f0",
    bgHex: "#f0f4ff",
    emoji: "🌙",
    tags: ["夜行者", "纯白", "月光系", "神秘"],
    description:
      "雪球是校园夜晚的守护者，纯白的毛发在月光下如同流动的银河。它的眼睛能捕捉最微弱的光线，折射出深邃的蓝色光芒。每到夜晚，雪球便开始它的月光巡逻，守护着沉睡中的校园。",
    stats: [
      { label: "品种", value: "英国短毛猫" },
      { label: "毛色", value: "纯白" },
      { label: "折射率", value: "1.336", unit: "nD" },
      { label: "夜视能力", value: "极强" },
      { label: "据点", value: "校园小径" },
      { label: "巡逻时间", value: "22:00-04:00" },
    ],
    vitals: [
      { label: "神秘感", value: 96, color: "#4a90d9" },
      { label: "夜视能力", value: 99, color: "#2060a0" },
      { label: "警觉度", value: 88, color: "#6aabde" },
      { label: "优雅度", value: 94, color: "#b8d4f0" },
    ],
    funFacts: [
      "猫的眼睛有一层反光层，夜视能力是人类的6倍",
      "雪球的瞳孔可以收缩成细线，精确控制进光量",
      "它能感知到人类无法察觉的超声波",
      "雪球每晚巡逻路线长达4.7公里",
    ],
    unsplashId: "photo-1592194996308-7b43878e84a6",
  },
  {
    id: "momo",
    number: "003",
    name: "MOMO",
    cnName: "墨墨",
    breed: "纯黑猫",
    role: "棱镜折光师",
    location: "理工楼天台",
    color: "纯黑",
    colorHex: "#7c6bff",
    accentHex: "#bdb2ff",
    bgHex: "#f4f0ff",
    emoji: "🔮",
    tags: ["纯黑", "棱镜", "流体运动", "好奇心旺盛"],
    description:
      "墨墨是校园里最神秘的存在，纯黑的毛发能折射出七彩棱镜般的光芒。它喜欢在阳光下打滚，将光线折射成彩虹洒落一地。理工楼天台是它最喜欢的地方，在那里它能看到整个校园。",
    stats: [
      { label: "品种", value: "纯黑猫" },
      { label: "毛色", value: "纯黑" },
      { label: "折光系数", value: "7.2", unit: "λ" },
      { label: "性格", value: "好奇探索" },
      { label: "据点", value: "理工楼天台" },
      { label: "最高速度", value: "12.4", unit: "m/s" },
    ],
    vitals: [
      { label: "好奇心", value: 99, color: "#7c6bff" },
      { label: "灵活度", value: 97, color: "#9b59ff" },
      { label: "神秘感", value: 95, color: "#c46bff" },
      { label: "棱镜折光", value: 88, color: "#bdb2ff" },
    ],
    funFacts: [
      "黑猫的毛发含有大量黑色素，能吸收更多热量",
      "墨墨能以惊人的速度改变运动方向",
      "它的瞳孔在阳光下会变成细如针线的竖缝",
      "墨墨曾在一次追逐中跳越了2.8米的距离",
    ],
    unsplashId: "photo-1518791841217-8f162f1912da",
  },
  {
    id: "tiaowen",
    number: "004",
    name: "TIAOWEN",
    cnName: "条纹",
    breed: "虎斑猫",
    role: "地形拓扑者",
    location: "校园草坪",
    color: "虎斑",
    colorHex: "#5a8a5e",
    accentHex: "#a8d4ab",
    bgHex: "#f2f7f2",
    emoji: "🌿",
    tags: ["虎斑", "草坪", "拓扑", "探险家"],
    description:
      "条纹以一系列引力涟漪的形式存在于校园草坪。它的虎斑纹路如同地形等高线，每一次移动都会在空间中留下拓扑波纹。它是校园里最热爱探险的猫咪，每一片草地都是它的地图。",
    stats: [
      { label: "品种", value: "虎斑猫" },
      { label: "毛色", value: "棕灰虎斑" },
      { label: "等高线密度", value: "0.05", unit: "m" },
      { label: "性格", value: "探索型" },
      { label: "据点", value: "校园草坪" },
      { label: "领地面积", value: "2.4", unit: "km²" },
    ],
    vitals: [
      { label: "探索欲", value: 98, color: "#5a8a5e" },
      { label: "领地意识", value: 85, color: "#4a7a4e" },
      { label: "耐力", value: 92, color: "#6a9a6e" },
      { label: "伪装能力", value: 90, color: "#a8d4ab" },
    ],
    funFacts: [
      "虎斑纹路是猫咪最古老的毛色模式之一",
      "条纹能记住校园内每一条小路的走向",
      "它的领地标记系统精确到每一棵树",
      "条纹每天会巡视领地边界至少三次",
    ],
    unsplashId: "photo-1543466835-00a7907e9de1",
  },
  {
    id: "buding",
    number: "005",
    name: "BUDING",
    cnName: "布丁",
    breed: "布偶猫",
    role: "系统调试员",
    location: "食堂附近",
    color: "奶白浅棕",
    colorHex: "#e8956d",
    accentHex: "#ffd3b6",
    bgHex: "#fdf6f0",
    emoji: "🍮",
    tags: ["布偶猫", "食堂", "慵懒", "撒娇大师"],
    description:
      "布丁是校园里最受欢迎的布偶猫，奶白色的毛发配上浅棕色的花纹，像极了一块刚出炉的布丁甜点。它最喜欢在食堂门口等待好心的同学投喂，撒娇技能满级。",
    stats: [
      { label: "品种", value: "布偶猫" },
      { label: "毛色", value: "奶白+浅棕" },
      { label: "撒娇等级", value: "MAX" },
      { label: "性格", value: "慵懒温顺" },
      { label: "据点", value: "食堂附近" },
      { label: "每日睡眠", value: "16", unit: "小时" },
    ],
    vitals: [
      { label: "撒娇指数", value: 99, color: "#e8956d" },
      { label: "饥饿度", value: 85, color: "#ff8a65" },
      { label: "困倦度", value: 78, color: "#ffab91" },
      { label: "可爱度", value: 97, color: "#ffd3b6" },
    ],
    funFacts: [
      "布偶猫因温顺的性格被称为'猫中狗'",
      "布丁每天能吸引超过50位同学停下来撸猫",
      "它能精准识别出谁的包里有零食",
      "布丁的呼噜声频率在25-50Hz之间，有助于人类减压",
    ],
    unsplashId: "photo-1561948955-570b270e7c36",
  },
  {
    id: "huahua",
    number: "006",
    name: "HUAHUA",
    cnName: "花花",
    breed: "三花猫",
    role: "活版印刷师",
    location: "艺术楼",
    color: "黑白橘三色",
    colorHex: "#3d9a5c",
    accentHex: "#a8d8ab",
    bgHex: "#f2faf4",
    emoji: "🎨",
    tags: ["三花猫", "艺术家", "活泼", "印章"],
    description:
      "花花是校园里最具艺术气质的三花猫，它的三色花纹就像活版印刷的墨迹，每一块颜色都恰到好处地叠印在一起。它最喜欢在艺术楼附近游荡，偶尔会用爪子在地上留下'印章'。",
    stats: [
      { label: "品种", value: "三花猫" },
      { label: "毛色", value: "黑白橘三色" },
      { label: "印章精度", value: "99.8", unit: "%" },
      { label: "性格", value: "活泼好奇" },
      { label: "据点", value: "艺术楼" },
      { label: "创作频率", value: "每日3次" },
    ],
    vitals: [
      { label: "创造力", value: 96, color: "#3d9a5c" },
      { label: "活泼度", value: 94, color: "#2d8a4c" },
      { label: "好奇心", value: 98, color: "#4daa6c" },
      { label: "艺术感", value: 92, color: "#a8d8ab" },
    ],
    funFacts: [
      "三花猫几乎全部为雌性，由X染色体上的基因决定",
      "花花的爪印被同学们收集制作成了明信片",
      "它能识别出超过20种不同的颜料气味",
      "花花在日本被视为幸运的象征",
    ],
    unsplashId: "photo-1529778873920-4da4926a72c2",
  },
];

export const getCatById = (id: string): CatData | undefined =>
  CATS.find((c) => c.id === id);
