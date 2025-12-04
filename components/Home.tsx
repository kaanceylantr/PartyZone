import React from 'react';
import { ViewState } from '../types';
import { WheelIcon, BottleIcon, SurveyIcon } from './Icons';

interface HomeProps {
  changeView: (view: ViewState) => void;
}

const Home: React.FC<HomeProps> = ({ changeView }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 py-8">
      <div className="mb-16 animate-in fade-in zoom-in duration-700 relative">
        <div className="absolute -inset-10 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-3xl rounded-full"></div>
        <h1 className="relative text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] mb-4 tracking-tight">
          PartyZone
        </h1>
        <p className="relative text-lg md:text-2xl text-purple-100/80 font-medium max-w-2xl mx-auto tracking-wide">
          Eğlencenin dijital merkezi. <span className="text-white font-bold text-shadow-glow">Hazır mısın?</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl">
        {/* Card 1: Wheel */}
        <div 
          onClick={() => changeView(ViewState.WHEEL)}
          className="group glass-panel rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20">
              <WheelIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Soru Çarkı</h3>
            <p className="text-purple-200/60 text-sm font-medium">Rastgele sorularla partiyi canlandır.</p>
          </div>
        </div>

        {/* Card 2: Bottle */}
        <div 
          onClick={() => changeView(ViewState.BOTTLE)}
          className="group glass-panel rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20">
              <BottleIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Şişe Çevirmece</h3>
            <p className="text-emerald-200/60 text-sm font-medium">Doğruluk mu Cesaret mi?</p>
          </div>
        </div>

        {/* Card 3: Survey */}
        <div 
          onClick={() => changeView(ViewState.SURVEY)}
          className="group glass-panel rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] cursor-pointer relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20">
              <SurveyIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Anket Simülatörü</h3>
            <p className="text-blue-200/60 text-sm font-medium">Oylama yap, sonuçları gör.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;