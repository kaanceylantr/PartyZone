import React, { useState, useEffect } from 'react';
import { getMixedQuestions } from '../services/api';
import { soundManager } from '../utils/SoundManager';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#06b6d4'];

const WheelGame: React.FC = () => {
  const [mode, setMode] = useState<'SETUP' | 'GAME'>('SETUP');
  const [isLoading, setIsLoading] = useState(false);
  
  // Setup State
  const [targetCount, setTargetCount] = useState(8);
  const [userQuestions, setUserQuestions] = useState<string[]>([]);
  const [newQuestionInput, setNewQuestionInput] = useState('');

  // Game State
  const [questions, setQuestions] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [removeOnFinish, setRemoveOnFinish] = useState(false);

  // --- LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    const savedQuestions = localStorage.getItem('pz_wheel_questions');
    const savedCount = localStorage.getItem('pz_wheel_count');

    if (savedQuestions) {
      try {
        setUserQuestions(JSON.parse(savedQuestions));
      } catch (e) {
        console.error("Failed to parse saved questions");
      }
    }

    if (savedCount) {
      setTargetCount(parseInt(savedCount));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pz_wheel_questions', JSON.stringify(userQuestions));
    localStorage.setItem('pz_wheel_count', targetCount.toString());
  }, [userQuestions, targetCount]);
  // ----------------------------------

  const handleAddQuestion = () => {
    if (newQuestionInput.trim() && userQuestions.length < 20) {
      setUserQuestions([...userQuestions, newQuestionInput.trim()]);
      setNewQuestionInput('');
    }
  };

  const removeUserQuestion = (index: number) => {
    setUserQuestions(userQuestions.filter((_, i) => i !== index));
  };

  const handleStartGame = async () => {
    setIsLoading(true);
    try {
      const finalQuestions = await getMixedQuestions(targetCount, userQuestions);
      setQuestions(finalQuestions);
      setMode('GAME');
      setRotation(0);
      setSelectedQuestion(null);
    } catch (e) {
      console.error("Failed to load questions", e);
      alert("Sorular yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const spinWheel = () => {
    if (spinning || questions.length === 0) return;

    setSpinning(true);
    setSelectedQuestion(null);

    const segmentAngle = 360 / questions.length;
    const randomSegment = Math.floor(Math.random() * questions.length);
    const segmentCenter = (randomSegment * segmentAngle) + (segmentAngle / 2);
    const extraRotation = 1800 + (360 - segmentCenter); 
    const newRotation = rotation + extraRotation;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      
      const winner = questions[randomSegment];
      setSelectedQuestion(winner);
      soundManager.playWin();

      if (removeOnFinish) {
          setTimeout(() => {
             setQuestions(prev => prev.filter((_, i) => i !== randomSegment));
          }, 2000);
      }
    }, 4000);
  };

  const getWheelGradient = () => {
    if (questions.length === 0) return '#333';
    
    const parts = questions.map((_, i) => {
      const color = COLORS[i % COLORS.length];
      const startPercent = (i * 100) / questions.length;
      const endPercent = ((i + 1) * 100) / questions.length;
      return `${color} ${startPercent}% ${endPercent}%`;
    });
    
    return `conic-gradient(from 0deg, ${parts.join(', ')})`;
  };

  if (mode === 'SETUP') {
    return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 pt-4 pb-20">
         <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          Çarkı Hazırla
        </h2>

        {/* Glass Card */}
        <div className="w-full glass-panel p-8 rounded-3xl mb-8">
          <label className="block text-purple-200 text-sm mb-4 font-semibold tracking-wide">DİLİM SAYISI: <span className="text-white text-lg">{targetCount}</span></label>
          <div className="flex items-center gap-4 mb-8">
            <input 
              type="range" 
              min="2" 
              max="20" 
              value={targetCount} 
              onChange={(e) => setTargetCount(parseInt(e.target.value))}
              className="w-full h-3 bg-black/30 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <label className="block text-purple-200 text-sm mb-2 font-semibold tracking-wide">ÖZEL SORULAR ({userQuestions.length}/20)</label>
          <div className="flex gap-3 mb-6">
             <input
              type="text"
              value={newQuestionInput}
              onChange={(e) => setNewQuestionInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
              placeholder="Soru yaz..."
              className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner"
              disabled={userQuestions.length >= 20}
            />
            <button 
              onClick={handleAddQuestion}
              disabled={userQuestions.length >= 20}
              className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl font-bold btn-3d border-b-purple-800 shadow-lg disabled:opacity-50 disabled:border-none"
            >
              EKLE
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {userQuestions.map((q, i) => (
              <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition">
                <span className="truncate mr-2 text-sm">{i+1}. {q}</span>
                <button onClick={() => removeUserQuestion(i)} className="text-red-400 hover:text-red-300 p-1">×</button>
              </div>
            ))}
            {userQuestions.length === 0 && (
               <p className="text-gray-500 text-sm italic text-center py-2">Henüz soru eklemedin.</p>
            )}
          </div>
        </div>

        <button
          onClick={handleStartGame}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 btn-3d border-b-purple-900 shadow-xl shadow-purple-600/20 hover:brightness-110 disabled:opacity-50 disabled:cursor-wait"
        >
          {isLoading ? 'Yükleniyor...' : 'ÇARKI OLUŞTUR'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] px-4 relative">
      <button 
        onClick={() => setMode('SETUP')}
        className="absolute top-0 left-0 text-sm text-gray-300 hover:text-white glass-button px-4 py-2 rounded-full"
      >
        ← Düzenle
      </button>

      {/* Wheel Area */}
      <div className="relative mt-8 mb-12">
        {/* Pointer */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
             <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[48px] border-t-white"></div>
        </div>

        {/* Wheel Container with Neon Rim */}
        <div className="relative p-2 rounded-full bg-gradient-to-b from-gray-700 to-gray-900 shadow-[0_0_40px_rgba(139,92,246,0.6)] border-4 border-gray-600">
            <div 
            className="w-80 h-80 md:w-96 md:h-96 rounded-full border-4 border-white/10 overflow-hidden relative transition-transform duration-[4000ms] cubic-bezier(0.15, 0.85, 0.35, 1.0) shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
            style={{ 
                transform: `rotate(${rotation}deg)`,
                background: getWheelGradient()
            }}
            >
            {questions.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 text-gray-400 font-bold backdrop-blur-sm">
                    BİTTİ
                </div>
            )}
            
            {questions.map((q, i) => {
                const segmentAngle = 360 / questions.length;
                const rotateAngle = (segmentAngle * i) + (segmentAngle / 2);
                return (
                <div
                    key={i}
                    className="absolute top-0 left-1/2 w-1 h-1/2 origin-bottom flex justify-center pt-4"
                    style={{
                    transform: `translateX(-50%) rotate(${rotateAngle}deg)`,
                    }}
                >
                    <span className="text-white font-black text-xl drop-shadow-md select-none transform -translate-y-1">
                    {i + 1}
                    </span>
                </div>
                );
            })}
            
            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-800 rounded-full shadow-[0_0_10px_black] flex items-center justify-center z-20 border-4 border-gray-600">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-inner animate-pulse-slow"></div>
            </div>
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 w-full max-w-xs relative z-20">
        <button
          onClick={spinWheel}
          disabled={spinning || questions.length === 0}
          className={`w-full py-5 rounded-2xl text-2xl font-black text-white tracking-wider shadow-2xl transition-all transform active:scale-95 btn-3d ${
            spinning || questions.length === 0
              ? 'bg-gray-700 border-b-gray-800 cursor-not-allowed text-gray-500' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 border-b-indigo-800 hover:brightness-110 shadow-purple-500/40'
          }`}
        >
          {spinning ? 'DÖNÜYOR...' : 'ÇEVİR!'}
        </button>

        <label className="flex items-center gap-3 cursor-pointer p-3 glass-panel rounded-xl w-full justify-center hover:bg-white/10 transition select-none">
             <div className="relative">
                <input 
                    type="checkbox" 
                    checked={removeOnFinish} 
                    onChange={(e) => setRemoveOnFinish(e.target.checked)}
                    className="sr-only"
                />
                <div className={`w-12 h-7 rounded-full shadow-inner transition duration-300 ${removeOnFinish ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition transform duration-300 ${removeOnFinish ? 'translate-x-5' : 'translate-x-0'}`}></div>
             </div>
             <span className="text-sm text-gray-300 font-medium">Çıkan soruyu sil</span>
        </label>
      </div>

      {/* Result Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass-panel p-8 rounded-3xl max-w-lg w-full text-center animate-bounce-slow shadow-[0_0_50px_rgba(168,85,247,0.4)] border border-purple-500/30">
                <p className="text-purple-300 text-sm uppercase tracking-[0.2em] mb-4 font-bold">GELEN SORU</p>
                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight mb-6 text-shadow-glow">
                    "{selectedQuestion}"
                </h3>
                <button 
                    onClick={() => setSelectedQuestion(null)}
                    className="mt-2 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition border border-white/10"
                >
                    Tamam
                </button>
                {removeOnFinish && (
                    <p className="text-red-400 text-xs mt-4 italic opacity-70">* Bu soru listeden silindi</p>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default WheelGame;