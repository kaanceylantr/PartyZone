
import React, { useState, useEffect } from 'react';
import { fetchNeverHaveIEver, saveUserNHIEList } from '../services/api';
import { HandIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const NeverHaveIEver: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [mode, setMode] = useState<'SETUP' | 'GAME'>('SETUP');
  
  // Setup State
  const [customList, setCustomList] = useState<string[]>([]);
  const [newInput, setNewInput] = useState('');

  // Game State
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
     // Check if there is a loaded list from Profile
     const loadedList = localStorage.getItem('pz_nhie_load_list');
     if (loadedList) {
         try {
            const parsed = JSON.parse(loadedList);
            setQuestions(parsed);
            setMode('GAME');
            // Clear it so it doesn't auto-load next time if user comes from home
            localStorage.removeItem('pz_nhie_load_list');
         } catch(e) {}
     }
  }, []);

  // --- SETUP ACTIONS ---
  const handleAddQuestion = () => {
      if (newInput.trim()) {
          setCustomList([...customList, newInput.trim()]);
          setNewInput('');
      }
  };

  const handleRemoveQuestion = (index: number) => {
      setCustomList(customList.filter((_, i) => i !== index));
  };

  const startQuickGame = async () => {
    setIsLoading(true);
    const data = await fetchNeverHaveIEver(30);
    setQuestions(data);
    setMode('GAME');
    setCurrentIndex(0);
    setIsLoading(false);
  };

  const startCustomGame = () => {
      if (customList.length === 0) return;
      setQuestions([...customList].sort(() => Math.random() - 0.5)); // Shuffle custom list
      setMode('GAME');
      setCurrentIndex(0);
  };

  const handleSaveList = async () => {
      if (!user) {
          alert(t('login') + '!');
          return;
      }
      if (customList.length < 5) {
          alert("Min 5!");
          return;
      }
      const title = prompt(t('profile_save_title'));
      if (title) {
          await saveUserNHIEList(user.username, title, customList);
          alert(t('profile_saved_success'));
      }
  };

  // --- GAME ACTIONS ---
  const nextCard = () => {
    setAnimate(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % questions.length);
      setAnimate(false);
    }, 300);
  };

  const currentQuestion = questions[currentIndex];

  if (mode === 'SETUP') {
      return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 pt-4 pb-20 min-h-[70vh]">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none z-0">
                <HandIcon className="w-96 h-96 animate-pulse-slow" />
            </div>

            <h2 className="text-4xl font-bold mb-8 text-white z-10">{t('nhie_setup_title')}</h2>
            
            <div className="w-full glass-panel p-6 rounded-3xl mb-8 z-10">
                <div className="flex gap-3 mb-4">
                    <input 
                        value={newInput}
                        onChange={(e) => setNewInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                        placeholder={t('nhie_placeholder')}
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-pink-200/50 outline-none focus:border-pink-500 transition"
                    />
                    <button 
                        onClick={handleAddQuestion}
                        className="bg-pink-600 hover:bg-pink-500 text-white px-5 py-2 rounded-xl font-bold btn-3d border-b-pink-800"
                    >
                        {t('nhie_add_btn')}
                    </button>
                </div>
                
                {customList.length > 0 && (
                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 mb-4">
                        {customList.map((q, i) => (
                            <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="truncate mr-2 text-sm">{i+1}. {q}</span>
                                <button onClick={() => handleRemoveQuestion(i)} className="text-red-400 hover:text-white">×</button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-3">
                    {user && (
                         <button 
                            onClick={handleSaveList}
                            disabled={customList.length === 0}
                            className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold border border-white/10 transition disabled:opacity-50"
                        >
                            {t('nhie_save_btn')}
                        </button>
                    )}
                    <button 
                        onClick={startCustomGame}
                        disabled={customList.length === 0}
                        className="flex-[2] py-3 bg-pink-600 hover:bg-pink-500 rounded-xl font-bold btn-3d border-b-pink-800 disabled:opacity-50 disabled:border-none"
                    >
                        {t('nhie_custom_start')} ({customList.length})
                    </button>
                </div>
            </div>

            <button 
                onClick={startQuickGame}
                className="w-full py-4 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 btn-3d border-b-purple-900 shadow-xl z-10"
            >
                {t('nhie_quick_start')} 🎲
            </button>
        </div>
      );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-[50vh] text-white">{t('loading')}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] px-4 relative overflow-hidden">
        <button 
            onClick={() => setMode('SETUP')}
            className="absolute top-0 left-0 text-sm text-gray-300 hover:text-white glass-button px-4 py-2 rounded-full z-20"
        >
            ← {t('setup')}
        </button>

        {/* Background Icons */}
        <div className="absolute top-10 left-10 opacity-10 animate-bounce-slow">
            <HandIcon className="w-24 h-24 text-pink-500" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 animate-pulse-slow">
            <HandIcon className="w-32 h-32 text-purple-500" />
        </div>

      <div className="max-w-md w-full relative z-10 mt-10">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-sm tracking-tight">
            {t('nhie_title')}
        </h2>

        {/* Card Stack Effect */}
        <div className="relative h-80 w-full perspective-1000">
             {/* Background Card (Decoration) */}
             <div className="absolute top-4 left-4 w-full h-full bg-white/5 rounded-3xl border border-white/5 transform scale-95 -z-10"></div>
             
             {/* Main Card */}
            <div 
                onClick={nextCard}
                className={`absolute inset-0 w-full h-full glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 transition-all duration-300 border-pink-500/20 shadow-[0_10px_40px_rgba(236,72,153,0.2)] group ${
                    animate ? 'translate-x-full opacity-0 rotate-12' : 'translate-x-0 opacity-100 rotate-0'
                }`}
            >
                <div className="mb-6 bg-gradient-to-br from-pink-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-3xl font-bold">✋</span>
                </div>
                
                <p className="text-pink-200 text-xs font-bold tracking-[0.3em] uppercase mb-4">{t('nhie_card_label')}</p>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight select-none">
                    "{currentQuestion}"
                </h3>

                <p className="absolute bottom-6 text-white/30 text-xs font-medium animate-pulse">
                    {t('nhie_tap_hint')}
                </p>
                
                <div className="absolute top-4 right-4 text-xs font-bold bg-white/10 px-2 py-1 rounded">
                    {currentIndex + 1} / {questions.length}
                </div>
            </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center glass-panel p-4 rounded-xl border-white/5">
             <p className="text-gray-300 text-sm">
                 <strong className="text-pink-400">{t('nhie_rule_title')}</strong> {t('nhie_rule_desc')}
             </p>
        </div>
      </div>
    </div>
  );
};

export default NeverHaveIEver;