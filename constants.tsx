
import { Unit, ExerciseType } from './types';

export const APP_COLORS = {
  primary: '#8B0000', 
  secondary: '#D4AF37', 
  parchment: '#FDFCF0', 
  stone: '#2D3436', 
  accent: '#1E3A8A' 
};

export const DAILY_QUESTS = [
  { id: 'q1', title: { 'en': 'First Echo', 'zh-TW': '最初的迴響', 'zh-CN': '最初的回响', 'ru': 'Первое эхо' }, goal: 1, reward: 50 },
  { id: 'q2', title: { 'en': 'Mountain Climber', 'zh-TW': '聖山攀登者', 'zh-CN': '圣山攀登者', 'ru': 'Горный альпинист' }, goal: 3, reward: 150 },
];

export const SUGGESTED_TOPICS = [
  { 'en': 'Colors of the Kingdom', 'zh-TW': '王國的顏色', 'zh-CN': '王国的颜色' },
  { 'en': 'Counting Ancient Coins', 'zh-TW': '數數古錢幣 (數字)', 'zh-CN': '数数古钱币' },
  { 'en': 'Royal Pets', 'zh-TW': '皇室寵物', 'zh-CN': '皇室宠物' },
  { 'en': 'The King’s Garden', 'zh-TW': '國王的花園', 'zh-CN': '国王的花园' }
];

export const MOCK_UNITS: Unit[] = [
  {
    id: 1,
    location: "Khor Virap (霍爾維拉普)",
    title: {
      'en': "The Magic Alphabet",
      'zh-TW': "魔法字母啟蒙",
      'zh-CN': "魔法字母启蒙",
      'ru': "Магические буквы"
    },
    lessons: [
      {
        id: "l1",
        title: { 'en': "The Mountain 'A'", 'zh-TW': "山峰字母 'A'", 'zh-CN': "山峰字母 'A'", 'ru': "Гора 'A'" },
        description: { 'en': "Learn Ayb", 'zh-TW': "認識第一個字母 Ա", 'zh-CN': "认识第一个字母 Ա", 'ru': "Айб" },
        exercises: [
          {
            id: "e1",
            type: ExerciseType.EXPLANATION,
            question: "Ancient Wisdom",
            armenianText: "Ա (Ayb)",
            translation: "A",
            explanation: {
              'en': "This is 'Ayb'. It looks just like the twin peaks of Mount Ararat!",
              'zh-TW': "這是 'Ayb'。它看起來就像亞拉拉特山的雙峰！",
              'zh-CN': "这是 'Ayb'。它看起来就像亚拉拉特山的双峰！",
              'ru': "Это 'Айб'. Похоже на вершины горы Арарат!"
            },
            correctAnswer: ""
          },
          {
            id: "e_speak",
            type: ExerciseType.SPEAKING,
            question: { 'en': "Say: Ayb", 'zh-TW': "請說：Ayb", 'zh-CN': "请说：Ayb", 'ru': "Скажи: Айб" },
            armenianText: "Ա",
            correctAnswer: "Ayb"
          }
        ]
      },
      {
        id: "l2",
        title: { 'en': "Greetings", 'zh-TW': "皇室問候", 'zh-CN': "皇室问候", 'ru': "Приветствие" },
        description: { 'en': "Say Hello", 'zh-TW': "學習 Barev", 'zh-CN': "学习 Barev", 'ru': "Барев" },
        exercises: [
          {
            id: "e2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: { 'en': "How do you say 'Hello'?", 'zh-TW': "如何用亞美尼亞語說『你好』？", 'zh-CN': "如何用亞美尼亞語說『你好』？", 'ru': "Как сказать 'Привет'?" },
            options: ["Բարև (Barev)", "Ցտեսություն", "Այո", "Ոչ"],
            correctAnswer: "Բարև (Barev)"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    location: "Areni Cave (阿雷尼洞穴)",
    title: {
      'en': "The Royal Banquet",
      'zh-TW': "皇室盛宴：食物",
      'zh-CN': "皇室盛宴：食物",
      'ru': "Королевский банкет"
    },
    lessons: [
      {
        id: "l3",
        title: { 'en': "The Bread of Life", 'zh-TW': "生命之餅", 'zh-CN': "生命之饼", 'ru': "Хлеб жизни" },
        description: { 'en': "Learn Lavash", 'zh-TW': "學習傳統薄餅 Lavash", 'zh-CN': "学习传统薄饼 Lavash", 'ru': "Лаваш" },
        exercises: [
          {
            id: "e3",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: { 'en': "What is 'Hats' (Հաց)?", 'zh-TW': "『Hats』(Հաց) 是什麼意思？", 'zh-CN': "『Hats』(Հաց) 是什么意思？", 'ru': "Что такое 'Хац'?" },
            options: ["Bread (麵包)", "Water", "Wine", "Stone"],
            correctAnswer: "Bread (麵包)"
          }
        ]
      },
      {
        id: "l4",
        title: { 'en': "Sacred Wine", 'zh-TW': "神聖之泉", 'zh-CN': "神圣之泉", 'ru': "Вино" },
        description: { 'en': "Learn Gini", 'zh-TW': "學習美酒 Gini", 'zh-CN': "学习美酒 Gini", 'ru': "Гини" },
        exercises: [
          {
            id: "e4",
            type: ExerciseType.TRANSLATION,
            question: { 'en': "Translate 'Gini'", 'zh-TW': "翻譯 'Գինի' (Gini)", 'zh-CN': "翻译 'Գինի' (Gini)", 'ru': "Переведи 'Гини'" },
            correctAnswer: "Wine",
            armenianText: "Գինի"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    location: "Garni Temple (加尼神廟)",
    title: {
      'en': "Colors & Nature",
      'zh-TW': "自然與色彩",
      'zh-CN': "自然与色彩",
      'ru': "Цвета и природа"
    },
    lessons: [
      {
        id: "l_dynamic_1",
        title: { 'en': "The Blue Sky", 'zh-TW': "蔚藍天空", 'zh-CN': "蔚蓝天空", 'ru': "Синее небо" },
        description: { 'en': "Colors #1", 'zh-TW': "認識基礎顏色", 'zh-CN': "认识基础颜色", 'ru': "Цвета" },
        exercises: [] // Will be populated by AI on click
      }
    ]
  },
  {
    id: 4,
    location: "Mount Ararat (亞拉拉特山)",
    title: {
      'en': "The Sacred Peaks",
      'zh-TW': "神聖巔峰：家庭",
      'zh-CN': "神圣巅峰：家庭",
      'ru': "Священные пики"
    },
    lessons: [
      {
        id: "l_dynamic_2",
        title: { 'en': "My Lineage", 'zh-TW': "我的血脈", 'zh-CN': "我的血脉", 'ru': "Моя семья" },
        description: { 'en': "Family members", 'zh-TW': "家庭成員稱謂", 'zh-CN': "家庭成员称谓", 'ru': "Семья" },
        exercises: []
      }
    ]
  }
];

export const TRANSLATIONS = {
  'en': {
    learn: 'Discovery',
    practice: 'Archives',
    leaderboard: 'Hall of Fame',
    profile: 'Apprentice',
    shop: 'The Bazaar',
    unit: 'Level',
    continue: 'Onward!',
    check: 'Verify',
    excellent: 'Royal Success!',
    incorrect: 'Try once more...',
    streak: 'Flame Days',
    xp: 'Honor',
    gems: 'Onyx',
    startLesson: 'Start Adventure',
    talkToTutor: 'Ask Levon',
    gotIt: 'I see it!',
    newConcept: 'New Discovery',
    tapToHear: 'Hear the Magic',
    hearts: 'Spirit',
    dialect: 'Style',
    eastern: 'Eastern',
    western: 'Western',
    aiPlaceholder: 'Or explore a curious topic...',
    generate: 'Forge Lesson',
    dailyQuest: 'Royal Mission',
    record: 'Speak Now',
    stop: 'Finish',
    evaluating: 'Levon is listening...',
    matching: 'Connect the pairs',
    suggested: 'Levon Suggests'
  },
  'zh-TW': {
    learn: '啟蒙探索',
    practice: '修行室',
    leaderboard: '榮譽榜',
    profile: '小學徒',
    shop: '東方大集',
    unit: '關卡',
    continue: '繼續前進！',
    check: '檢查結果',
    excellent: '太棒了！小王子/公主',
    incorrect: '再試一次，你可以的...',
    streak: '學習火花',
    xp: '榮耀點數',
    gems: '黑瑪瑙',
    startLesson: '開始冒險',
    talkToTutor: '問問利昂',
    gotIt: '我記住了！',
    newConcept: '新發現',
    tapToHear: '聽聽魔法發音',
    hearts: '體力值',
    dialect: '方言類型',
    eastern: '東部方言',
    western: '西部方言',
    aiPlaceholder: '或者，探索一個好奇的主題...',
    generate: '打造課程',
    dailyQuest: '皇室任務',
    record: '按住說話',
    stop: '結束錄音',
    evaluating: '利昂正在傾聽...',
    matching: '將配對連結起來',
    suggested: '利昂的建議'
  },
  'zh-CN': {
    learn: '启蒙探索',
    practice: '修行室',
    leaderboard: '荣誉榜',
    profile: '小学徒',
    shop: '东方大集',
    unit: '关卡',
    continue: '继续前进！',
    check: '检查结果',
    excellent: '太棒了！小王子/公主',
    incorrect: '再试一次，你可以的...',
    streak: '学习火花',
    xp: '荣耀点数',
    gems: '黑玛瑙',
    startLesson: '开始冒险',
    talkToTutor: '问问利昂',
    gotIt: '我記住了！',
    newConcept: '新发现',
    tapToHear: '听听魔法发音',
    hearts: '体力值',
    dialect: '方言类型',
    eastern: '东部方言',
    western: '西部方言',
    aiPlaceholder: '或者，探索一个好奇的主题...',
    generate: '打造课程',
    dailyQuest: '皇室任务',
    record: '按住说话',
    stop: '结束录制',
    evaluating: '利昂正在倾听...',
    matching: '将配对连结起来',
    suggested: '利昂的建议'
  },
  'ru': {
    learn: 'Открытия',
    practice: 'Архив',
    leaderboard: 'Зал Славы',
    profile: 'Ученик',
    shop: 'Базар',
    unit: 'Уровень',
    continue: 'Вперед!',
    check: 'Проверить',
    excellent: 'Королевский успех!',
    incorrect: 'Попробуй еще раз...',
    streak: 'Дни искры',
    xp: 'Честь',
    gems: 'Оникс',
    startLesson: 'Начать приключение',
    talkToTutor: 'Спросить Левона',
    gotIt: 'Я вижу!',
    newConcept: 'Новое открытие',
    tapToHear: 'Слушать магию',
    hearts: 'Дух',
    dialect: 'Стиль',
    eastern: 'Восточный',
    western: 'Западный',
    aiPlaceholder: 'Или изучи новую тему...',
    generate: 'Создать урок',
    dailyQuest: 'Королевская миссия',
    record: 'Говори',
    stop: 'Стоп',
    evaluating: 'Левон слушает...',
    matching: 'Соедини пары',
    suggested: 'Левон советует'
  }
};
