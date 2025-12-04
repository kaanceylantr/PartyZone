import React from 'react';
import { ViewState } from '../types';
import { HomeIcon, WheelIcon, BottleIcon, SurveyIcon } from './Icons';

interface NavbarProps {
  currentView: ViewState;
  changeView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, changeView }) => {
  const navItems = [
    { id: ViewState.HOME, label: 'Ana Sayfa', icon: HomeIcon },
    { id: ViewState.WHEEL, label: 'Çark', icon: WheelIcon },
    { id: ViewState.BOTTLE, label: 'Şişe', icon: BottleIcon },
    { id: ViewState.SURVEY, label: 'Anket', icon: SurveyIcon },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 md:top-6 md:bottom-auto">
      <nav className="glass-panel rounded-2xl p-2 flex items-center justify-between shadow-2xl border border-white/20 relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"></div>

        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => changeView(item.id)}
              className={`relative flex flex-col items-center justify-center w-full py-2 px-1 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* Active Background Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl pointer-events-none"></div>
              )}
              
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'}`}>
                <item.icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : ''}`} />
              </div>
              
              <span className={`text-[10px] md:text-xs font-bold mt-1 transition-all ${
                isActive ? 'opacity-100 text-white shadow-black drop-shadow-sm' : 'opacity-70 group-hover:opacity-100'
              }`}>
                {item.label}
              </span>

              {/* Active Dot */}
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;