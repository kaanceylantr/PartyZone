
import React from 'react';
import { ViewState } from '../types';
import { WheelIcon, BottleIcon, SurveyIcon, HandIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  changeView: (view: ViewState) => void;
}

const Home: React.FC<HomeProps> = ({ changeView }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 py-8">
      <div className="mb-12 animate-in fade-in zoom-in duration-700 relative">
        <div className="absolute -inset-10 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-3xl rounded-full"></div>
        <h1 className="relative text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white drop-shadow-sm mb-4 tracking-tight">
          {t('hero_title')}
        </h1>
        <p className="relative text-lg md:text-2xl text-purple-100/80 font-medium max-w-2xl mx-auto tracking-wide">
          {t('hero_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Card 1: Wheel */}
        <div 
          onClick={() => changeView(ViewState.WHEEL)}
          className="group glass-panel rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] cursor-pointer relative overflow-hidden flex items-center gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20 shrink-0">
              <WheelIcon className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold mb-1 text-white">{t('card_wheel_title')}</h3>
            <p className="text-purple-200/60 text-sm font-medium">{t('card_wheel_desc')}</p>
          </div>
        </div>

        {/* Card 2: Bottle */}
        <div 
          onClick={() => changeView(ViewState.BOTTLE)}
          className="group glass-panel rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] cursor-pointer relative overflow-hidden flex items-center gap-6"
        >
           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20 shrink-0">
              <BottleIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
                <h3 className="text-xl font-bold mb-1 text-white">{t('card_bottle_title')}</h3>
                <p className="text-emerald-200/60 text-sm font-medium">{t('card_bottle_desc')}</p>
            </div>
        </div>

        {/* Card 3: Survey */}
        <div 
          onClick={() => changeView(ViewState.SURVEY)}
          className="group glass-panel rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] cursor-pointer relative overflow-hidden flex items-center gap-6"
        >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20 shrink-0">
              <SurveyIcon className="w-8 h-8 text-white" />
            </div>
             <div className="text-left">
                <h3 className="text-xl font-bold mb-1 text-white">{t('card_survey_title')}</h3>
                <p className="text-blue-200/60 text-sm font-medium">{t('card_survey_desc')}</p>
            </div>
        </div>

        {/* Card 4: Never Have I Ever */}
        <div 
          onClick={() => changeView(ViewState.NEVER_HAVE_I_EVER)}
          className="group glass-panel rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] cursor-pointer relative overflow-hidden flex items-center gap-6"
        >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20 shrink-0">
              <HandIcon className="w-8 h-8 text-white" />
            </div>
             <div className="text-left">
                <h3 className="text-xl font-bold mb-1 text-white">{t('card_never_title')}</h3>
                <p className="text-pink-200/60 text-sm font-medium">{t('card_never_desc')}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
