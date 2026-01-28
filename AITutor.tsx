
import React, { useState, useEffect } from 'react';
import { ... } from './types';
import { ... } from './gemini';
import { ... } from './constants';

interface AITutorProps {
  lang: InterfaceLanguage;
  onClose: () => void;
}

const AITutor: React.FC<AITutorProps> = ({ lang, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { 
      role: 'ai', 
      text: lang === 'en' 
        ? "Barev! I'm Levon. Welcome to our magical kingdom. What secret words shall we unlock today?" 
        : "Barev! 我是利昂。歡迎來到我們的魔法王國。今天我們該解鎖哪些神祕的單字呢？" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = TRANSLATIONS[lang];

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are "Levon", the wise and friendly lion mascot for the Armenian learning app "Barev!". You represent Armenian royal heritage but speak with the warmth of a storybook narrator. Your goal is to make learning feel like a grand adventure. Respond in ${lang}. Use magical metaphors, Armenian cultural references, and lots of friendly emojis 🦁, ✨, 🏔️, 🏰, 🍷. Always start with a friendly greeting if the context allows. Be incredibly patient and encouraging.`,
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Oops, the magic scroll is blank! Try again." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "The magic connection is weak. Check your spirit (API Key)!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2D3436]/80 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-[#FDFCF0] w-full max-w-xl rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col h-[85vh] border-8 border-[#D4AF37] animate-in zoom-in duration-300">
        <div className="bg-[#2D3436] p-8 flex justify-between items-center border-b-4 border-[#D4AF37]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-4xl shadow-lg border-2 border-white/20">🦁</div>
            <div>
              <h2 className="text-[#D4AF37] text-2xl font-royal font-black tracking-widest uppercase">Levon</h2>
              <p className="text-white/40 text-[10px] font-black tracking-[0.3em]">Royal Mentor • 皇家導師</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white/30">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-6 rounded-[2rem] font-bold shadow-md relative ${
                m.role === 'user' 
                  ? 'bg-[#D4AF37] text-black rounded-tr-none' 
                  : 'bg-white border-2 border-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 text-[#D4AF37] font-black animate-pulse px-4">
              <span className="text-2xl">🦁</span>
              <span className="text-sm uppercase tracking-widest">Levon is consulting the ancient scrolls...</span>
            </div>
          )}
        </div>

        <div className="p-8 bg-white border-t-2 border-gray-100 flex gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-2xl px-6 py-4 font-bold focus:border-[#D4AF37] outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            className="bg-[#2D3436] text-[#D4AF37] w-16 h-16 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
