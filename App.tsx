import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import WheelGame from './components/WheelGame';
import BottleGame from './components/BottleGame';
import SurveyGame from './components/SurveyGame';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  const renderView = () => {
    switch (currentView) {
      case ViewState.WHEEL:
        return <WheelGame />;
      case ViewState.BOTTLE:
        return <BottleGame />;
      case ViewState.SURVEY:
        return <SurveyGame />;
      case ViewState.HOME:
      default:
        return <Home changeView={setCurrentView} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-party-bg text-white selection:bg-pink-500 selection:text-white overflow-hidden pb-28 md:pb-0 md:pt-24 font-nunito">
      
      {/* Animated Lava Lamp Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-[20%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        {/* Grid Overlay for texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <Navbar currentView={currentView} changeView={setCurrentView} />

      <main className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 transition-all duration-500 ease-in-out">
        {renderView()}
      </main>
    </div>
  );
};

export default App;