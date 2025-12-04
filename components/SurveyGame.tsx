import React, { useState } from 'react';
import { fetchRandomSurvey } from '../services/api';
import { Survey } from '../types';
import { SparklesIcon } from './Icons';

const SurveyGame: React.FC = () => {
  const [mode, setMode] = useState<'VIEW' | 'CREATE'>('VIEW');
  const [loading, setLoading] = useState(false);

  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '']);

  const [currentSurvey, setCurrentSurvey] = useState<Survey>({
    id: '1',
    question: 'Bir sonraki buluşmada ne yiyoruz?',
    options: [
      { id: 'opt1', text: 'Pizza Partisi', votes: 2 },
      { id: 'opt2', text: 'Hamburgerler', votes: 5 },
      { id: 'opt3', text: 'Ev Yemeği', votes: 1 },
      { id: 'opt4', text: 'Çiğ Köfte', votes: 8 },
    ]
  });
  const [hasVoted, setHasVoted] = useState(false);

  const loadRandomSurvey = async () => {
    setLoading(true);
    try {
      const data = await fetchRandomSurvey();
      setCurrentSurvey(data);
      setHasVoted(false);
    } catch (e) {
      console.error(e);
      alert("Anket yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOptionChange = (index: number, value: string) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  const addOptionField = () => {
    if (newOptions.length < 6) {
      setNewOptions([...newOptions, '']);
    }
  };

  const removeOptionField = (index: number) => {
    if (newOptions.length > 2) {
      setNewOptions(newOptions.filter((_, i) => i !== index));
    }
  };

  const saveCustomSurvey = () => {
    const validOptions = newOptions.filter(o => o.trim() !== '');
    if (newQuestion.trim() && validOptions.length >= 2) {
      const survey: Survey = {
        id: Date.now().toString(),
        question: newQuestion,
        options: validOptions.map((opt, idx) => ({
          id: `custom-${idx}`,
          text: opt,
          votes: 0
        }))
      };
      setCurrentSurvey(survey);
      setHasVoted(false);
      setMode('VIEW');
      setNewQuestion('');
      setNewOptions(['', '', '']);
    }
  };

  const handleVote = (optionId: string) => {
    if (hasVoted) return;
    const updatedOptions = currentSurvey.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });
    setCurrentSurvey({ ...currentSurvey, options: updatedOptions });
    setHasVoted(true);
  };

  const totalVotes = currentSurvey.options.reduce((acc, curr) => acc + curr.votes, 0);

  if (mode === 'CREATE') {
    return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 pt-4 pb-20">
        <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
          Anket Oluştur
        </h2>
        
        <div className="w-full glass-panel p-8 rounded-3xl space-y-6">
          <div>
            <label className="block text-blue-200 text-sm font-semibold mb-2">SORU</label>
            <input 
              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition"
              placeholder="Örn: Hafta sonu nereye gidelim?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-blue-200 text-sm font-semibold mb-2">SEÇENEKLER</label>
            <div className="space-y-3">
                {newOptions.map((opt, i) => (
                <div key={i} className="flex gap-2">
                    <div className="flex items-center justify-center w-8 h-full text-blue-300 font-bold">{i+1}.</div>
                    <input 
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 focus:border-blue-400 outline-none transition"
                    placeholder={`Seçenek gir...`}
                    value={opt}
                    onChange={(e) => handleCreateOptionChange(i, e.target.value)}
                    />
                    {newOptions.length > 2 && (
                    <button onClick={() => removeOptionField(i)} className="text-red-400 hover:text-white px-3 font-bold bg-white/5 rounded-lg">×</button>
                    )}
                </div>
                ))}
            </div>
            {newOptions.length < 6 && (
              <button onClick={addOptionField} className="mt-4 text-sm text-blue-300 hover:text-white font-semibold flex items-center gap-1">
                  <span className="text-lg">+</span> DAHA FAZLA SEÇENEK
              </button>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={() => setMode('VIEW')}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold text-gray-300 transition"
            >
              İptal
            </button>
            <button 
              onClick={saveCustomSurvey}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-500/30 btn-3d border-b-blue-800"
            >
              OLUŞTUR
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto min-h-[80vh] px-4 pt-4 pb-20">
      <h2 className="text-4xl md:text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
        Anket Simülatörü
      </h2>

      {/* Glass Card */}
      <div className="w-full glass-panel rounded-3xl p-6 md:p-10 relative overflow-hidden mb-8 shadow-[0_0_40px_rgba(0,0,0,0.2)]">
        
        {loading ? (
            <div className="text-center py-12 text-blue-200/50 animate-pulse font-bold tracking-widest">YENİ ANKET GELİYOR...</div>
        ) : (
        <>
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-white text-center leading-relaxed drop-shadow-md">
            {currentSurvey.question}
            </h3>

            <div className="space-y-4">
            {currentSurvey.options.map((option, idx) => {
                const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
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
        </>
        )}
      </div>
      
      {/* Control Buttons */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
         <button 
            onClick={loadRandomSurvey}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold btn-3d border-b-indigo-900 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
             <SparklesIcon className="w-5 h-5" />
             {loading ? 'Yükleniyor...' : 'RASTGELE ANKET'}
          </button>
          
          <button 
            onClick={() => setMode('CREATE')}
            disabled={loading}
            className="flex-1 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/10 transition backdrop-blur-md"
          >
             + KENDİN OLUŞTUR
          </button>
      </div>
    </div>
  );
};

export default SurveyGame;