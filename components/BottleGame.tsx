
import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/SoundManager';
import { BottleIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

const BottleGame: React.FC = () => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'SETUP' | 'GAME'>('SETUP');
  const [players, setPlayers] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState('');
  
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{asker: string, answerer: string} | null>(null);

  useEffect(() => {
    const savedPlayers = localStorage.getItem('pz_bottle_players');
    if (savedPlayers) {
      try {
        setPlayers(JSON.parse(savedPlayers));
      } catch (e) {
        console.error("Failed to parse saved players");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pz_bottle_players', JSON.stringify(players));
  }, [players]);

  const addPlayer = () => {
    if (playerName.trim()) {
      setPlayers([...players, playerName.trim()]);
      setPlayerName('');
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const startGame = () => {
    if (players.length >= 2) {
      setMode('GAME');
      setRotation(0);
      setResult(null);
    }
  };

  const shufflePlayers = () => {
    if (spinning) return;
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    setPlayers(shuffled);
    setResult(null);
  };

  const spinBottle = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);
    
    const randomSpin = 1800 + Math.random() * 1800; 
    const newRotation = rotation + randomSpin;
    
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      calculateResult(newRotation);
      soundManager.playWin();
    }, 3500);
  };

  const calculateResult = (finalRotation: number) => {
    const normalizedRotation = finalRotation % 360;
    const segmentSize = 360 / players.length;

    let winningIndex = Math.round(normalizedRotation / segmentSize);
    winningIndex = winningIndex % players.length;

    const answererIndex = winningIndex;
    const totalPlayers = players.length;
    const askerIndex = (answererIndex + Math.floor(totalPlayers / 2)) % totalPlayers;

    setResult({
      asker: players[askerIndex],
      answerer: players[answererIndex]
    });
  };

  if (mode === 'SETUP') {
    return (
      <div className="flex flex-col items-center w-full min-h-[70vh] max-w-md mx-auto pt-4 relative">
         {/* Background Effect */}
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none z-0">
            <BottleIcon className="w-96 h-96 animate-spin-slow" />
        </div>

        <h2 className="text-4xl font-extrabold mb-8 text-white drop-shadow-md z-10 tracking-tight">
          {t('bottle_setup_title')}
        </h2>
        
        <div className="w-full glass-panel p-6 rounded-3xl mb-8 z-10">
            <div className="flex w-full gap-3 mb-6">
            <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                placeholder={t('bottle_placeholder')}
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition"
            />
            <button 
                onClick={addPlayer}
                className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-xl font-bold btn-3d border-b-green-700"
            >
                {t('add').toUpperCase()}
            </button>
            </div>

            <div className="w-full flex flex-wrap gap-2 max-h-60 overflow-y-auto custom-scrollbar">
            {players.map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 pl-4 pr-2 py-2 rounded-full border border-white/10 group hover:bg-white/10 transition">
                <span className="font-semibold text-sm">{p}</span>
                <button onClick={() => removePlayer(i)} className="text-gray-400 hover:text-red-400 font-bold bg-black/20 rounded-full w-5 h-5 flex items-center justify-center">×</button>
                </div>
            ))}
            {players.length === 0 && <p className="text-gray-500 text-sm w-full text-center py-4">{t('bottle_no_players')}</p>}
            </div>
        </div>

        <button
          onClick={startGame}
          disabled={players.length < 2}
          className={`w-full py-4 rounded-2xl text-xl font-bold text-white btn-3d transition z-10 ${
            players.length < 2 
              ? 'bg-gray-700 border-b-gray-800 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 border-b-emerald-800 hover:brightness-110 shadow-lg shadow-emerald-500/30'
          }`}
        >
          {t('bottle_start_btn')} ({players.length})
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[80vh] relative overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 w-full flex justify-between items-start px-4 z-20">
           <button 
            onClick={() => setMode('SETUP')}
            className="text-sm text-gray-300 hover:text-white glass-button px-4 py-2 rounded-full font-semibold"
          >
            ← {t('setup')}
          </button>
          
           <button 
            onClick={shufflePlayers}
            disabled={spinning}
            className="text-sm flex items-center gap-2 text-emerald-300 hover:text-white glass-button px-4 py-2 rounded-full border-emerald-500/30 transition disabled:opacity-50 font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            {t('bottle_shuffle')}
          </button>
      </div>
     
      {/* Result Indicator */}
      <div className={`absolute top-16 z-20 transition-all duration-500 ${result ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {result && (
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 text-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="text-emerald-300 font-bold text-2xl mb-1 drop-shadow-sm">{result.asker}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">{t('bottle_asks')}</div>
            <div className="text-white text-2xl font-black my-1">⬇</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">{t('bottle_answers')}</div>
            <div className="text-pink-400 font-bold text-2xl mt-1 drop-shadow-sm">{result.answerer}</div>
          </div>
        )}
      </div>

      {/* Game Area */}
      <div className="relative w-[340px] h-[340px] md:w-[450px] md:h-[450px] flex items-center justify-center mt-12 z-0">
        
        {/* Spotlight Effect Under Bottle */}
        <div className="absolute inset-0 bg-radial-gradient from-emerald-500/20 to-transparent opacity-50 blur-2xl pointer-events-none"></div>

        {/* Players Circle */}
        {players.map((player, i) => {
          const angle = (360 / players.length) * i;
          const radius = 160; 
          const style = {
            transform: `rotate(${angle}deg) translate(0, -${radius}px) rotate(-${angle}deg)`,
          };
          
          const isAsker = result?.asker === player;
          const isAnswerer = result?.answerer === player;
          
          return (
            <div 
              key={i}
              className="absolute top-1/2 left-1/2 w-32 -ml-16 text-center flex flex-col items-center justify-center transition-all duration-300 z-10"
              style={style}
            >
              <div className={`w-4 h-4 rounded-full mb-2 border-2 border-black/50 shadow-lg transition-colors duration-500 ${
                isAnswerer ? 'bg-pink-500 shadow-[0_0_15px_#ec4899]' : 
                isAsker ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-gray-700'
              }`}></div>
              <span className={`text-sm font-bold truncate w-full px-2 py-1 rounded-lg backdrop-blur-sm transition-all duration-300 ${
                 isAnswerer ? 'text-pink-300 bg-pink-900/40 scale-110 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 
                 isAsker ? 'text-emerald-300 bg-emerald-900/40 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-gray-400'
              }`}>
                {player}
              </span>
            </div>
          );
        })}

        {/* The Bottle */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <div 
            className="w-32 h-80 flex items-center justify-center transition-transform duration-[3500ms] cubic-bezier(0.2, 0.8, 0.2, 1) pointer-events-auto origin-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer group"
            style={{ transform: `rotate(${rotation}deg)` }}
            onClick={spinBottle}
          >
              <div className="hover:scale-105 transition-transform">
                  {/* SVG Bottle */}
                  <svg width="120" height="340" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Glass Body with Gradient */}
                      <defs>
                        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                          <stop offset="50%" stopColor="rgba(16, 185, 129, 0.2)" />
                          <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
                        </linearGradient>
                      </defs>
                      <path d="M20 80 H80 V280 C80 291.046 71.0457 300 60 300 H40 C28.9543 300 20 291.046 20 280 V80 Z" fill="url(#glassGrad)" stroke="#34d399" strokeWidth="2"/>
                      <path d="M35 20 H65 V80 H35 V20 Z" fill="rgba(16, 185, 129, 0.3)" stroke="#34d399" strokeWidth="2"/>
                      
                      {/* Highlights */}
                      <path d="M25 90 V270" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round"/>
                      <path d="M75 90 V150" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round"/>

                      {/* Bottle Cap (Pointer) */}
                      <path d="M30 0 H70 V20 H30 V0 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1"/>
                      
                      {/* Label */}
                      <rect x="25" y="120" width="50" height="80" rx="4" fill="#fbbf24" stroke="#d97706"/>
                      <text 
                        x="50" 
                        y="160" 
                        fontFamily="'Nunito', sans-serif" 
                        fontSize="20" 
                        fontWeight="bold" 
                        fill="#78350f" 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                        transform="rotate(-90 50 160)" 
                        style={{ letterSpacing: '2px' }}
                      >
                        {t('bottle_label')}
                      </text>
                  </svg>
              </div>
          </div>
        </div>
      </div>

      {/* Helper Text to replace the button */}
      <div className="mt-20 text-emerald-300/80 animate-pulse text-lg font-bold tracking-widest uppercase pointer-events-none select-none">
        {spinning ? t('bottle_spinning') : t('bottle_hint')}
      </div>
    </div>
  );
};

export default BottleGame;
