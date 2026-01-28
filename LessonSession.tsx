
import React, { useState, useEffect, useRef } from 'react';
import { Exercise, ExerciseType, InterfaceLanguage, LocalizedString } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateSpeech, evaluateUserSpeech } from '../services/gemini';
import { playAudio } from './AudioPlayer';

interface LessonSessionProps {
  exercises: Exercise[];
  lang: InterfaceLanguage;
  onComplete: (xp: number, learned: {armenian: string, translation: string}[]) => void;
  onClose: () => void;
}

const LessonSession: React.FC<LessonSessionProps> = ({ exercises, lang, onComplete, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [evaluation, setEvaluation] = useState<{ score: number, feedback: string } | null>(null);
  const [unscrambleSelected, setUnscrambleSelected] = useState<string[]>([]);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const t = TRANSLATIONS[lang];
  const currentExercise = exercises[currentIndex];
  const progress = (currentIndex / exercises.length) * 100;

  const getL = (val: LocalizedString | undefined): string => {
    if (!val) return '';
    return typeof val === 'string' ? val : (val as any)[lang] || (val as any)['en'] || '';
  };

  const handleAudio = async (text?: string) => {
    if (!text || loadingAudio) return;
    setLoadingAudio(true);
    const audioData = await generateSpeech(text);
    if (audioData) await playAudio(audioData);
    setLoadingAudio(false);
  };

  useEffect(() => {
    if (currentExercise?.armenianText) handleAudio(currentExercise.armenianText);
  }, [currentIndex]);

  const checkAnswer = () => {
    let correct = false;
    if (currentExercise.type === ExerciseType.MULTIPLE_CHOICE || currentExercise.type === ExerciseType.FILL_IN_BLANKS) {
      correct = selectedOption === currentExercise.correctAnswer;
    } else if (currentExercise.type === ExerciseType.UNSCRAMBLE) {
      correct = unscrambleSelected.join(' ').trim() === currentExercise.correctAnswer.trim();
    } else if (currentExercise.type === ExerciseType.MATCHING) {
      correct = true; 
    } else if (currentExercise.type === ExerciseType.TRANSLATION) {
      correct = true;
    }
    setIsCorrect(correct);
    setIsChecking(true);
    if (correct) handleAudio(currentExercise.armenianText || currentExercise.correctAnswer);
  };

  const handleContinue = () => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setIsChecking(false);
      setEvaluation(null);
      setMatchedPairs([]);
      setSelectedLeft(null);
      setUnscrambleSelected([]);
    } else {
      setShowVictory(true);
    }
  };

  const ConfettiEffect = () => {
    return (
      <>
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="confetti" 
            style={{ 
              left: `${Math.random() * 100}vw`, 
              backgroundColor: ['#D4AF37', '#8B0000', '#FDFCF0'][Math.floor(Math.random() * 3)],
              animationDelay: `${Math.random() * 2}s`,
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`
            }} 
          />
        ))}
      </>
    );
  };

  if (!currentExercise) return null;

  if (showVictory) {
    const learnedWords = exercises
      .filter(e => e.armenianText && e.translation)
      .map(e => ({ armenian: e.armenianText!, translation: getL(e.translation) }));

    return (
      <div className="fixed inset-0 bg-[#2D3436] z-[100] flex flex-col items-center justify-center p-8 overflow-hidden">
        <ConfettiEffect />
        <div className="w-full max-w-2xl bg-[#FDFCF0] rounded-[4rem] p-12 text-center space-y-10 shadow-[0_20px_100px_rgba(0,0,0,0.5)] border-8 border-[#D4AF37] animate-in zoom-in duration-500 relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#8B0000] rounded-full border-8 border-[#D4AF37] flex items-center justify-center text-7xl shadow-2xl">🦁</div>
          
          <div className="pt-12">
            <h2 className="text-5xl font-royal font-black text-[#8B0000] mb-2">{t.excellent}</h2>
            <p className="text-[#D4AF37] font-black tracking-[0.3em] uppercase text-sm">Level Mastery Unlocked</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border-4 border-gray-100 shadow-sm">
              <p className="text-4xl font-black text-[#8B0000]">+50</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.xp}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border-4 border-gray-100 shadow-sm">
              <p className="text-4xl font-black text-[#D4AF37]">+20</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.gems}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b-2 border-gray-100 pb-2">Ancient Words Learned</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {learnedWords.slice(0, 5).map((w, i) => (
                <span key={i} className="bg-[#8B0000]/5 text-[#8B0000] px-4 py-2 rounded-xl font-bold text-sm">
                  {w.armenian}
                </span>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onComplete(50, learnedWords)} 
            className="w-full bg-[#8B0000] text-[#D4AF37] py-6 rounded-3xl font-royal font-black text-2xl shadow-[0_12px_0_#5A0000] hover:translate-y-1 hover:shadow-[0_8px_0_#5A0000] active:shadow-none active:translate-y-3 transition-all"
          >
            {t.continue}
          </button>
        </div>
      </div>
    );
  }

  const LionComment = () => {
    if (!isChecking) return null;
    const comments = isCorrect 
      ? [
          lang === 'zh-TW' ? "這發音簡直像在唱聖歌！" : "Noble pronunciation!",
          lang === 'zh-TW' ? "利昂為你的智慧感到驕傲。" : "Levon is proud of your wisdom.",
          lang === 'zh-TW' ? "你注定要成為語言的王者。" : "You are destined to rule this tongue."
        ]
      : [
          lang === 'zh-TW' ? "沒關係，連聖山也有迷路的時候。" : "Even Mount Ararat gets cloudy.",
          lang === 'zh-TW' ? "多喝兩口葡萄酒，再來一次！" : "Have some wine and try again.",
          lang === 'zh-TW' ? "利昂會陪著你練習到成功。" : "Levon is here to help."
        ];
    return (
      <div className="flex items-center gap-4 animate-in slide-in-from-left duration-500">
        <div className="w-12 h-12 bg-[#8B0000] rounded-xl flex items-center justify-center text-2xl border-2 border-[#D4AF37]">🦁</div>
        <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border-2 border-[#D4AF37]/20 shadow-sm relative">
          <div className="absolute -left-2 top-0 w-2 h-2 bg-white border-l-2 border-t-2 border-[#D4AF37]/20 -rotate-45"></div>
          <p className="text-xs font-black text-[#8B0000] italic">"{comments[Math.floor(Math.random() * comments.length)]}"</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#FDFCF0] z-50 flex flex-col items-center overflow-y-auto">
      {/* Header with Progress */}
      <div className="w-full max-w-4xl px-8 py-10 flex items-center gap-8 sticky top-0 bg-[#FDFCF0]/90 z-10 backdrop-blur-md">
        <button onClick={onClose} className="text-[#8B0000] text-4xl hover:rotate-90 transition-transform">×</button>
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-[#8B0000] via-[#D4AF37] to-[#8B0000] bg-[length:200%_100%] animate-[gradient_3s_linear_infinite] transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">🍷</span>
          <span className="font-black text-[#8B0000]">5</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl px-8 py-12 flex flex-col pb-48">
        <h2 className="text-4xl font-royal font-black text-[#2D3436] mb-12 leading-tight">{getL(currentExercise.question)}</h2>

        {/* Dynamic Exercise Rendering based on ExerciseType */}
        {currentExercise.type === ExerciseType.EXPLANATION && (
          <div className="flex flex-col items-center text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="group relative">
              <div className="absolute -inset-4 bg-[#D4AF37]/20 rounded-[4.5rem] blur-xl group-hover:bg-[#D4AF37]/40 transition-all"></div>
              <div className="relative text-8xl p-10 bg-white border-8 border-[#D4AF37] rounded-[4rem] shadow-xl cursor-pointer hover:scale-105 transition-transform" onClick={() => handleAudio(currentExercise.armenianText)}>🦁</div>
            </div>
            <div className="space-y-4">
              <span className="bg-[#8B0000] text-[#D4AF37] px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Ancient Scroll</span>
              <h2 className="text-8xl font-royal font-black text-[#2D3436]">{currentExercise.armenianText}</h2>
              <p className="text-3xl font-bold text-[#D4AF37]">"{getL(currentExercise.translation)}"</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-[#D4AF37]/10 shadow-lg text-xl font-bold text-gray-600 leading-relaxed max-w-lg">
              {getL(currentExercise.explanation)}
            </div>
          </div>
        )}

        {currentExercise.type === ExerciseType.FILL_IN_BLANKS && (
          <div className="space-y-16 animate-in fade-in duration-500">
            <div className="p-12 bg-white border-4 border-[#D4AF37]/10 rounded-[3.5rem] shadow-xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#D4AF37]/20"></div>
              <p className="text-5xl font-royal font-black text-[#2D3436] leading-loose">
                {currentExercise.sentenceWithBlank?.split('___').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className={`inline-block min-w-[160px] border-b-8 mx-4 pb-1 transition-all ${selectedOption ? 'text-[#8B0000] border-[#D4AF37] scale-110' : 'border-gray-200 text-transparent'}`}>
                        {selectedOption || '...'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {(Array.isArray(currentExercise.options) ? currentExercise.options : []).map(opt => (
                <button key={opt} onClick={() => {setSelectedOption(opt); handleAudio(opt);}} disabled={isChecking} className={`p-8 text-2xl font-black rounded-3xl border-4 transition-all transform active:scale-95 ${selectedOption === opt ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg -translate-y-1' : 'bg-white border-gray-100 hover:border-[#D4AF37]/30 text-gray-700 shadow-sm'}`}>{opt}</button>
              ))}
            </div>
          </div>
        )}

        {currentExercise.type === ExerciseType.UNSCRAMBLE && (
          <div className="space-y-16 animate-in fade-in duration-500">
            <div className="min-h-[160px] p-10 bg-white border-4 border-[#D4AF37]/10 rounded-[3.5rem] shadow-inner flex flex-wrap gap-4 items-center justify-center relative">
               <div className="absolute top-4 left-6 text-[10px] font-black text-[#D4AF37] uppercase tracking-widest opacity-40">Assemble the Scroll</div>
              {unscrambleSelected.map((word, i) => (
                <button key={i} onClick={() => setUnscrambleSelected(prev => prev.filter((_, idx) => idx !== i))} className="bg-[#8B0000] text-[#D4AF37] px-8 py-4 rounded-2xl font-black shadow-md hover:scale-95 transition-transform animate-in zoom-in">
                  {word}
                </button>
              ))}
              {unscrambleSelected.length === 0 && <span className="text-gray-300 font-black uppercase tracking-[0.3em] text-sm italic">Tap the fragments below...</span>}
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {(Array.isArray(currentExercise.unscrambleWords) ? currentExercise.unscrambleWords : []).map((word, i) => (
                <button 
                  key={i} 
                  disabled={isChecking} 
                  onClick={() => {setUnscrambleSelected([...unscrambleSelected, word]); handleAudio(word);}} 
                  className={`px-10 py-5 rounded-[2rem] border-4 font-black text-2xl transition-all shadow-sm bg-white border-gray-100 hover:border-[#D4AF37] hover:-translate-y-1`}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for other types to keep the file robust */}
        {(currentExercise.type === ExerciseType.MULTIPLE_CHOICE || currentExercise.type === ExerciseType.SPEAKING) && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {currentExercise.armenianText && (
              <div className="flex items-center gap-10 p-10 bg-white border-4 border-[#D4AF37]/10 rounded-[3.5rem] shadow-xl cursor-pointer hover:scale-105 transition-all group" onClick={() => handleAudio(currentExercise.armenianText)}>
                <div className="w-24 h-24 bg-[#D4AF37] text-white rounded-[2rem] flex items-center justify-center text-5xl shadow-lg group-hover:rotate-12 transition-transform">🔊</div>
                <span className="text-8xl font-royal font-black text-[#8B0000]">{currentExercise.armenianText}</span>
              </div>
            )}
            {currentExercise.type === ExerciseType.MULTIPLE_CHOICE && (
              <div className="grid gap-5">
                {(Array.isArray(currentExercise.options) ? currentExercise.options : []).map(opt => (
                  <button key={opt} onClick={() => { setSelectedOption(opt); handleAudio(opt.split(' ')[0]); }} disabled={isChecking} className={`w-full p-10 text-left border-4 rounded-[2.5rem] text-2xl font-black transition-all transform ${selectedOption === opt ? (isChecking ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-[#D4AF37] bg-yellow-50 shadow-md -translate-y-1') : 'bg-white border-gray-100 hover:border-[#D4AF37]/30 shadow-sm'}`}>{opt}</button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Check Bar */}
      <div className={`fixed bottom-0 left-0 right-0 p-12 border-t-8 transition-all duration-700 z-50 ${isChecking ? (isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300') : 'bg-white border-gray-100'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex-1 space-y-2">
            {isChecking && (
              <div className="animate-in slide-in-from-left duration-300">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl text-white shadow-xl ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <div>
                    <p className={`text-3xl font-royal font-black ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>{isCorrect ? t.excellent : t.incorrect}</p>
                    {!isCorrect && <p className="text-red-800/60 font-black text-xs tracking-widest mt-1 uppercase">Answer: {currentExercise.correctAnswer}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <LionComment />
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={isChecking ? handleContinue : checkAnswer} 
            className={`px-24 py-7 rounded-[2.5rem] text-white font-black text-2xl shadow-[0_12px_0_rgba(0,0,0,0.2)] transition-all active:shadow-none active:translate-y-2 active:scale-95 disabled:opacity-30 disabled:grayscale ${isChecking ? (isCorrect ? 'bg-green-600' : 'bg-red-600') : 'bg-[#8B0000]'}`} 
            disabled={!isChecking && currentExercise.type !== ExerciseType.EXPLANATION && !selectedOption && unscrambleSelected.length === 0}
          >
            {isChecking ? t.continue : (currentExercise.type === ExerciseType.EXPLANATION ? t.gotIt : t.check)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonSession;
