import React, { useState } from 'react';
import { Survey } from '../types';

const SurveyGame: React.FC = () => {
  const [mode, setMode] = useState<'SETUP' | 'GAME'>('SETUP');
  
  // Setup State
  const [createdSurveys, setCreatedSurveys] = useState<Survey[]>([]);
  const [currentEditQuestion, setCurrentEditQuestion] = useState('');
  const [currentEditOptions, setCurrentEditOptions] = useState(['', '', '']);
  const [playOrder, setPlayOrder] = useState<'SEQUENTIAL' | 'RANDOM'>('SEQUENTIAL');

  // Game State
  const [gameQueue, setGameQueue] = useState<Survey[]>([]);
  const [currentSurveyIndex, setCurrentSurveyIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [currentVotes, setCurrentVotes] = useState<Record<string, number>>({});

  // Background Words
  const bgWords = ["Pizza?", "Sinema?", "Tatil?", "Oyun?", "Kim?", "Ne zaman?", "Parti!", "Yemek?", "Müzik?"];

  // --- SETUP FUNCTIONS ---

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...currentEditOptions];
    updated[index] = value;
    setCurrentEditOptions(updated);
  };

  const addOptionField = () => {
    if (currentEditOptions.length < 6) setCurrentEditOptions([...currentEditOptions, '']);
  };

  const removeOptionField = (index: number) => {
    if (currentEditOptions.length > 2) {
      setCurrentEditOptions(currentEditOptions.filter((_, i) => i !== index));
    }
  };

  const addSurveyToList = () => {
    const validOptions = currentEditOptions.filter(o => o.trim() !== '');
    if (currentEditQuestion.trim() && validOptions.length >= 2) {
      const newSurvey: Survey = {
        id: Date.now().toString() + Math.random().toString(),
        question: currentEditQuestion,
        options: validOptions.map((opt, idx) => ({
          id: `opt-${idx}`,
          text: opt,
          votes: 0
        }))
      };
      
      setCreatedSurveys([...createdSurveys, newSurvey]);
      setCurrentEditQuestion('');
      setCurrentEditOptions(['', '', '']);
    }
  };

  const removeSurvey = (index: number) => {
    setCreatedSurveys(createdSurveys.filter((_, i) => i !== index));
  };

  const startGame = () => {
    if (createdSurveys.length === 0) return;

    let queue = [...createdSurveys];
    if (playOrder === 'RANDOM') {
      queue = queue.sort(() => Math.random() - 0.5);
    }
    
    setGameQueue(queue);
    setCurrentSurveyIndex(0);
    setHasVoted(false);
    // Reset votes for fresh game
    const initialVotes: Record<string, number> = {};
    queue[0].options.forEach(opt => initialVotes[opt.id] = 0);
    setCurrentVotes(initialVotes);
    
    setMode('GAME');
  };

  // --- GAME FUNCTIONS ---

  const handleVote = (optionId: string) => {
    if (hasVoted) return;
    
    setCurrentVotes(prev => ({
      ...prev,
      [optionId]: (prev[optionId] || 0) + 1
    }));
    setHasVoted(true);
  };

  const nextSurvey = () => {
    if (currentSurveyIndex < gameQueue.length - 1) {
      const nextIndex = currentSurveyIndex + 1;
      setCurrentSurveyIndex(nextIndex);
      setHasVoted(false);
      
      // Initialize votes for next survey options
      const initialVotes: Record<string, number> = {};
      gameQueue[nextIndex].options.forEach(opt => initialVotes[opt.id] = 0);
      setCurrentVotes(initialVotes);
    } else {
        // End of game
        alert("Anketler bitti! Yeniden hazırlayabilirsiniz.");
        setMode('SETUP');
    }
  };

  const currentSurvey = gameQueue[currentSurveyIndex];
  const totalVotes = currentSurvey ? currentSurvey.options.reduce((acc, opt) => acc + (currentVotes[opt.id] || 0), 0) : 0;

  if (mode === 'SETUP') {
    return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 pt-4 pb-20 relative min-h-[70vh]">
         {/* Floating Background Words */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
             {bgWords.map((word, i) => (
                 <span 
                    key={i} 
                    className="absolute text-white/5 font-black text-4xl select-none animate-float-up"
                    style={{
                        left: `${Math.random() * 80 + 10}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        fontSize: `${Math.random() * 2 + 1}rem`
                    }}
                 >
                     {word}
                 </span>
             ))}
         </div>

        <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10">
          Anket Listesi Hazırla
        </h2>
        
        {/* Creator Panel */}
        <div className="w-full glass-panel p-6 rounded-3xl mb-6 z-10 border-blue-500/20">
          <div className="mb-4">
            <label className="block text-blue-200 text-xs font-bold mb-2 tracking-wide">YENİ SORU</label>
            <input 
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition"
              placeholder="Soru yaz..."
              value={currentEditQuestion}
              onChange={(e) => setCurrentEditQuestion(e.target.value)}
              disabled={createdSurveys.length >= 20}
            />
          </div>

          <div className="space-y-2 mb-4">
            {currentEditOptions.map((opt, i) => (
              <div key={i} className="flex gap-2">
                 <input 
                    className="flex-1 bg-black/20 border border-white/5 rounded-lg p-2 text-sm focus:border-blue-400 outline-none transition"
                    placeholder={`Seçenek ${i+1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    disabled={createdSurveys.length >= 20}
                 />
                 {currentEditOptions.length > 2 && (
                    <button onClick={() => removeOptionField(i)} className="text-red-400 hover:bg-white/5 rounded px-2">×</button>
                 )}
              </div>
            ))}
             {currentEditOptions.length < 6 && createdSurveys.length < 20 && (
              <button onClick={addOptionField} className="text-xs text-blue-300 hover:text-white font-semibold mt-1">+ Seçenek Ekle</button>
            )}
          </div>
          
          <button 
             onClick={addSurveyToList}
             disabled={createdSurveys.length >= 20}
             className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white btn-3d border-b-blue-800 disabled:opacity-50"
          >
              LİSTEYE EKLE ({createdSurveys.length}/20)
          </button>
        </div>

        {/* List Preview */}
        {createdSurveys.length > 0 && (
            <div className="w-full mb-6 z-10">
                <h3 className="text-white/60 text-sm font-bold mb-2 ml-2">EKLENENLER:</h3>
                <div className="glass-panel rounded-2xl p-2 max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                    {createdSurveys.map((s, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="truncate text-sm font-medium mr-2">{i+1}. {s.question}</span>
                            <button onClick={() => removeSurvey(i)} className="text-red-400 hover:text-white px-2">×</button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Start Controls */}
        <div className="w-full flex flex-col gap-4 z-10 mt-auto">
             <div className="flex bg-black/30 p-1 rounded-xl">
                 <button 
                    onClick={() => setPlayOrder('SEQUENTIAL')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${playOrder === 'SEQUENTIAL' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                 >
                     SIRAYLA
                 </button>
                 <button 
                    onClick={() => setPlayOrder('RANDOM')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${playOrder === 'RANDOM' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                 >
                     KARIŞIK
                 </button>
             </div>
             <button
                onClick={startGame}
                disabled={createdSurveys.length === 0}
                className="w-full py-4 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 btn-3d border-b-cyan-800 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                ANKETLERİ BAŞLAT
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto min-h-[80vh] px-4 pt-4 pb-20 relative">
      {/* Floating Background Words */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
             {bgWords.map((word, i) => (
                 <span 
                    key={i} 
                    className="absolute text-white/5 font-black text-4xl select-none animate-float-up"
                    style={{
                        left: `${Math.random() * 80 + 10}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        fontSize: `${Math.random() * 2 + 1}rem`
                    }}
                 >
                     {word}
                 </span>
             ))}
         </div>

      {/* Progress Indicator */}
      <div className="w-full flex justify-between items-end mb-4 px-2 z-10">
         <h2 className="text-3xl font-black text-white drop-shadow-md">Anket #{currentSurveyIndex + 1}</h2>
         <span className="text-blue-200 font-bold text-sm bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/30">
            {currentSurveyIndex + 1} / {gameQueue.length}
         </span>
      </div>

      {/* Game Card */}
      <div className="w-full glass-panel rounded-3xl p-6 md:p-10 relative overflow-hidden mb-8 shadow-[0_0_40px_rgba(0,0,0,0.2)] z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-white text-center leading-relaxed drop-shadow-md">
            {currentSurvey.question}
            </h3>

            <div className="space-y-4">
            {currentSurvey.options.map((option, idx) => {
                const votes = currentVotes[option.id] || 0;
                const percentage = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
                const barColors = [
                    'from-blue-500 to-blue-400',
                    'from-purple-500 to-purple-400',
                    'from-pink-500 to-pink-400',
                    'from-cyan-500 to-cyan-400',
                    'from-emerald-500 to-emerald-400',
                    'from-orange-500 to-orange-400'
                ];
                const colorClass = barColors[idx % barColors.length];
                
                return (
                <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    disabled={hasVoted}
                    className={`relative w-full h-16 rounded-2xl overflow-hidden group transition-all duration-300 border border-white/5 ${
                    hasVoted ? 'cursor-default' : 'hover:scale-[1.02] cursor-pointer hover:border-white/20 hover:shadow-lg'
                    }`}
                >
                    {/* Background Bar (Percentage) */}
                    <div 
                        className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out bg-gradient-to-r ${colorClass}`}
                        style={{ width: hasVoted ? `${percentage}%` : '0%', opacity: hasVoted ? 1 : 0 }}
                    >
                         {/* Glossy shine on bar */}
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
                    </div>

                    {/* Unvoted Background */}
                    <div className={`absolute inset-0 bg-white/5 transition-opacity ${hasVoted ? 'opacity-0' : 'opacity-100'}`}></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
                    <span className={`font-bold text-lg truncate pr-4 text-shadow-sm ${hasVoted ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                        {option.text}
                    </span>
                    {hasVoted && (
                        <span className="font-black text-xl text-white drop-shadow-md animate-in fade-in zoom-in">{percentage}%</span>
                    )}
                    </div>
                </button>
                );
            })}
            </div>
            
             <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-sm text-blue-200/60 font-medium">
                <span>Toplam <strong className="text-white">{totalVotes}</strong> oy kullanıldı</span>
                {hasVoted && <span className="text-yellow-400 animate-pulse">Teşekkürler!</span>}
            </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex gap-4 w-full z-10">
          <button 
             onClick={() => setMode('SETUP')}
             className="flex-1 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/10 transition backdrop-blur-md"
          >
             ÇIKIŞ YAP
          </button>
          
          {hasVoted && (
            <button 
                onClick={nextSurvey}
                className="flex-1 py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-bold btn-3d border-b-green-700 shadow-lg shadow-green-500/30 animate-in fade-in slide-in-from-right-10"
            >
                {currentSurveyIndex < gameQueue.length - 1 ? 'SIRADAKİ SORU →' : 'BİTİR'}
            </button>
          )}
      </div>
    </div>
  );
};

export default SurveyGame;