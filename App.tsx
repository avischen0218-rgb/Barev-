
import React, { useState, useEffect } from 'react';
import { InterfaceLanguage, UserProgress, LocalizedString, Exercise, Lesson, LearnedWord } from './types';
import { MOCK_UNITS, TRANSLATIONS, SUGGESTED_TOPICS } from './constants';
import LessonSession from './components/LessonSession';
import AITutor from './components/AITutor';
import { generateAIDynamicLesson, generateSpeech } from './services/gemini';
import { playAudio } from './components/AudioPlayer';

const STORAGE_KEY = 'armenilearn_pro_v5_progress';

const App: React.FC = () => {
  const [lang, setLang] = useState<InterfaceLanguage>('zh-TW');
  const [activeTab, setActiveTab] = useState('learn');
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { xp: 0, streak: 0, gems: 500, hearts: 5, lastHeartRefill: Date.now(), level: 1, currentUnit: 1, completedLessons: [], dialect: 'Eastern', learnedWords: [] };
  });

  const [activeLessonExercises, setActiveLessonExercises] = useState<Exercise[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTutor, setShowTutor] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const t = TRANSLATIONS[lang];
  const getL = (val: LocalizedString | undefined): string => {
    if (!val) return '';
    return typeof val === 'string' ? val : (val as any)[lang] || (val as any)['en'] || '';
  };

  const startAILesson = async (topic: string) => {
    if (progress.hearts <= 0) { 
      alert(lang === 'zh-TW' ? "靈力不足！快去市集買點葡萄酒補補身子。" : "Spiritual energy depleted!"); 
      setActiveTab('shop');
      return; 
    }
    setIsGenerating(true);
    const exercises = await generateAIDynamicLesson(topic, lang);
    if (exercises) setActiveLessonExercises(exercises);
    else alert("Lion is resting!");
    setIsGenerating(false);
  };

  const handleLessonComplete = (earnedXp: number, learned: {armenian: string, translation: string}[]) => {
    const newLearnedWords = learned.map(w => ({ ...w, learnedAt: Date.now() }));
    setProgress(p => {
      // Avoid duplicate words in history
      const existingWords = new Set(p.learnedWords.map(w => w.armenian));
      const uniqueNewWords = newLearnedWords.filter(w => !existingWords.has(w.armenian));
      
      return {
        ...p,
        xp: p.xp + earnedXp,
        gems: p.gems + 20,
        hearts: Math.max(0, p.hearts - 1),
        level: Math.floor((p.xp + earnedXp) / 500) + 1,
        learnedWords: [...p.learnedWords, ...uniqueNewWords]
      };
    });
    setActiveLessonExercises(null);
  };

  return (
    <div className="min-h-screen flex bg-[#FDFCF0]">
      {/* Sidebar Navigation */}
      <nav className="w-20 md:w-72 bg-[#2D3436] border-r-8 border-[#D4AF37] h-screen sticky top-0 flex flex-col p-8 z-20">
        <div className="mb-16 group cursor-pointer" onClick={() => setActiveTab('learn')}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#8B0000] rounded-[1.25rem] flex items-center justify-center text-4xl shadow-xl border-2 border-[#D4AF37] transform group-hover:rotate-6 transition-transform">🦁</div>
            <div className="hidden md:block">
              <h1 className="text-3xl font-royal font-black text-[#D4AF37] leading-none">Barev!</h1>
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-1">Kingdom of Speech</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          {[
            { id: 'learn', icon: '🏔️', label: t.learn },
            { id: 'practice', icon: '⛪', label: t.practice },
            { id: 'leaderboard', icon: '🏆', label: t.leaderboard },
            { id: 'shop', icon: '💰', label: t.shop }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-[#D4AF37] text-black shadow-lg scale-105' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              <span className="text-3xl">{item.icon}</span>
              <span className="hidden md:block font-black text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        <select value={lang} onChange={e => setLang(e.target.value as InterfaceLanguage)} className="mt-auto w-full bg-[#1a1a1a] border-2 border-white/10 rounded-2xl p-4 font-black text-[10px] text-white outline-none focus:border-[#D4AF37] cursor-pointer">
          <option value="en">ENGLISH</option>
          <option value="zh-TW">繁體中文</option>
          <option value="zh-CN">简体中文</option>
        </select>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 bg-[#FDFCF0]/95 border-b-4 border-[#D4AF37]/10 p-8 flex justify-between items-center z-10 backdrop-blur-md">
           <div className="flex gap-4">
              <div className="bg-white border-2 border-[#D4AF37]/30 px-5 py-2 rounded-2xl font-black text-[#8B0000] shadow-sm flex items-center gap-3">
                <span className="text-xl">🍷</span> {progress.hearts}
              </div>
              <div className="bg-white border-2 border-[#D4AF37]/30 px-5 py-2 rounded-2xl font-black text-[#8B0000] shadow-sm flex items-center gap-3">
                <span className="text-xl">💠</span> {progress.gems}
              </div>
           </div>
           <div className="px-6 py-2 bg-[#D4AF37] text-black rounded-2xl font-black shadow-lg flex items-center gap-3">
             <span className="animate-pulse">🔥</span> {progress.streak} Days
           </div>
        </header>

        <div className="max-w-4xl mx-auto py-12 px-6">
          {activeTab === 'learn' && (
            <div className="space-y-20 pb-32">
               {/* AI Suggestions */}
               <div className="bg-[#2D3436] p-10 rounded-[3.5rem] border-4 border-[#D4AF37] shadow-2xl space-y-8 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h2 className="text-4xl font-royal font-black text-[#D4AF37] mb-6">{t.suggested}</h2>
                    <div className="flex flex-wrap gap-3">
                      {SUGGESTED_TOPICS.map((topic, i) => (
                        <button key={i} onClick={() => startAILesson(getL(topic))} className="bg-white/5 text-[#D4AF37] px-6 py-3 rounded-2xl font-bold hover:bg-[#D4AF37] hover:text-black transition-all border border-[#D4AF37]/20">
                          {getL(topic)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {isGenerating && (
                    <div className="flex items-center gap-4 text-[#D4AF37] font-black animate-pulse mt-6 bg-white/5 p-4 rounded-2xl">
                      <span className="text-3xl">🦁</span>
                      <span className="text-sm tracking-widest uppercase">Lion is forging a new scroll...</span>
                    </div>
                  )}
               </div>

               {/* Learning Path */}
               <div className="flex flex-col items-center gap-24">
                  {MOCK_UNITS.map(unit => (
                    <div key={unit.id} className="w-full flex flex-col items-center gap-12">
                      <div className="bg-white p-8 border-4 border-[#D4AF37] rounded-[2.5rem] text-center shadow-xl min-w-[340px] relative group hover:scale-105 transition-transform">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#8B0000] text-[#D4AF37] px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase border-2 border-[#D4AF37]">
                          LEVEL {unit.id}
                        </div>
                        <h3 className="text-3xl font-royal font-black pt-2 text-[#2D3436]">{getL(unit.title)}</h3>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic mt-2">📍 {unit.location}</p>
                      </div>
                      <div className="space-y-32">
                        {unit.lessons.map((lesson, idx) => (
                          <div key={lesson.id} className={`flex flex-col items-center ${idx % 2 === 0 ? 'translate-x-16' : '-translate-x-16'}`}>
                            <button 
                              onClick={() => lesson.exercises.length > 0 ? setActiveLessonExercises(lesson.exercises) : startAILesson(getL(lesson.title))} 
                              className="group relative w-32 h-32 rounded-[2.5rem] bg-white border-8 border-[#D4AF37] shadow-[0_16px_0_#B8860B] hover:shadow-[0_4px_0_#B8860B] hover:translate-y-3 active:shadow-none active:translate-y-4 transition-all flex items-center justify-center"
                            >
                              <span className="text-6xl group-hover:scale-110 transition-transform">
                                {lesson.exercises.length > 0 ? '📜' : '✨'}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'practice' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full pb-32">
                {progress.learnedWords.map((word, i) => (
                  <div key={i} className="bg-white p-10 rounded-[3.5rem] shadow-xl border-4 border-white flex flex-col items-center gap-6 hover:border-[#D4AF37]/30 transition-all">
                    <button onClick={() => playAudio(word.armenian)} className="w-20 h-20 bg-[#FDFCF0] rounded-[2rem] flex items-center justify-center text-4xl shadow-inner hover:bg-[#D4AF37] transition-all">🔊</button>
                    <div className="text-center">
                      <h4 className="text-5xl font-royal font-black text-[#8B0000] mb-2">{word.armenian}</h4>
                      <p className="text-xl font-bold text-gray-400 italic">"{word.translation}"</p>
                    </div>
                  </div>
                ))}
                {progress.learnedWords.length === 0 && <div className="col-span-full text-center py-20 opacity-20 text-6xl">🏺</div>}
             </div>
          )}

          {/* Leaderboard and Shop tabs remain consistent */}
        </div>

        {/* Floating AI Button */}
        <button onClick={() => setShowTutor(true)} className="fixed bottom-12 right-12 w-24 h-24 bg-[#2D3436] rounded-[2rem] shadow-2xl text-6xl flex items-center justify-center z-40 hover:scale-110 border-4 border-[#D4AF37]">🦁</button>
      </main>

      {/* Overlays */}
      {activeLessonExercises && (
        <LessonSession 
          exercises={activeLessonExercises} 
          lang={lang} 
          onComplete={handleLessonComplete} 
          onClose={() => setActiveLessonExercises(null)} 
        />
      )}
      {showTutor && <AITutor lang={lang} onClose={() => setShowTutor(false)} />}
    </div>
  );
};

export default App;
