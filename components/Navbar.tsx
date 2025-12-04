
import React, { useState } from 'react';
import { ViewState } from '../types';
import { HomeIcon, WheelIcon, BottleIcon, SurveyIcon, HandIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface NavbarProps {
  currentView: ViewState;
  changeView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, changeView }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: ViewState.HOME, label: t('home'), icon: HomeIcon },
    { id: ViewState.WHEEL, label: t('wheel'), icon: WheelIcon },
    { id: ViewState.BOTTLE, label: t('bottle'), icon: BottleIcon },
    { id: ViewState.SURVEY, label: t('survey'), icon: SurveyIcon },
    { id: ViewState.NEVER_HAVE_I_EVER, label: t('never'), icon: HandIcon },
  ];

  const handleProfileClick = () => {
      changeView(ViewState.PROFILE);
      setShowProfileMenu(false);
  };

  return (
    <>
      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
         {/* Language Toggle */}
         <button 
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="glass-button w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white border border-white/20"
         >
             {language === 'tr' ? 'TR' : 'EN'}
         </button>

         {/* Profile / Auth */}
         {user ? (
             <div className="relative">
                 <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="glass-button h-10 pl-2 pr-4 rounded-full flex items-center gap-2 border border-white/20 hover:bg-white/10"
                 >
                     <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold">
                         {user.username.substring(0,2).toUpperCase()}
                     </div>
                     <span className="text-sm font-semibold max-w-[80px] truncate">{user.username}</span>
                 </button>

                 {/* Dropdown */}
                 {showProfileMenu && (
                     <div className="absolute top-12 right-0 w-48 glass-panel rounded-xl p-2 flex flex-col gap-1 border border-white/10 shadow-xl animate-in fade-in zoom-in-95 origin-top-right">
                         <div className="px-3 py-2 text-xs text-gray-400 border-b border-white/10 mb-1">
                             {t('logged_in_as')} <br/> <span className="text-white font-bold">{user.email}</span>
                         </div>
                         <button onClick={handleProfileClick} className="text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition">
                             {t('profile')}
                         </button>
                         <button onClick={logout} className="text-left px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-200 text-sm transition">
                             {t('logout')}
                         </button>
                     </div>
                 )}
                 {/* Click outside closer (simple) */}
                 {showProfileMenu && (
                     <div className="fixed inset-0 z-[-1]" onClick={() => setShowProfileMenu(false)}></div>
                 )}
             </div>
         ) : (
            <button 
                onClick={() => setShowAuthModal(true)}
                className="glass-button h-10 px-4 rounded-full font-bold text-sm text-white border border-white/20 hover:bg-white/10"
            >
                {t('login')}
            </button>
         )}
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4 md:top-6 md:bottom-auto">
        <nav className="glass-panel rounded-2xl p-2 flex items-center justify-between shadow-2xl border border-white/20 relative overflow-hidden">
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
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl pointer-events-none"></div>
                )}
                
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'}`}>
                  <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : ''}`} />
                </div>
                
                <span className={`text-[9px] md:text-[10px] font-bold mt-1 transition-all ${
                  isActive ? 'opacity-100 text-white shadow-black drop-shadow-sm' : 'opacity-70 group-hover:opacity-100'
                }`}>
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
