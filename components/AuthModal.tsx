
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email) {
        // Simulation of auth
        login(username, email);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl relative shadow-[0_0_50px_rgba(139,92,246,0.3)] border border-purple-500/20">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
            ✕
        </button>

        <h2 className="text-3xl font-black text-white mb-6 text-center drop-shadow-md">
            {isLogin ? t('welcome_back') : t('create_account')}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-xs font-bold text-purple-200 mb-1 ml-1">{t('username')}</label>
                <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                    placeholder="player123"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-purple-200 mb-1 ml-1">{t('email')}</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                    placeholder="user@example.com"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-purple-200 mb-1 ml-1">{t('password')}</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                    placeholder="••••••••"
                />
            </div>

            <button 
                type="submit"
                className="mt-4 w-full py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 btn-3d border-b-purple-800 shadow-lg hover:brightness-110"
            >
                {isLogin ? t('login_action') : t('signup_action')}
            </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-300 hover:text-white underline decoration-purple-500/50 hover:decoration-purple-500"
            >
                {isLogin ? t('no_account') : t('have_account')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
