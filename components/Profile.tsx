
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    getUserWheels, getUserSurveyLists, getUserNHIELists, 
    deleteUserWheel, deleteUserSurveyList, deleteUserNHIEList,
    updateUserProfile, deleteUserProfile,
    updateWheel, updateSurveyList, updateNHIEList
} from '../services/api';
import { SavedWheel, SavedSurveyList, SavedNHIEList, ViewState } from '../types';
import { WheelIcon, SurveyIcon, HandIcon } from './Icons';

interface ProfileProps {
  changeView: (view: ViewState) => void;
}

const AVATAR_COLORS = [
    'from-purple-500 to-pink-500', 
    'from-blue-500 to-cyan-500', 
    'from-green-500 to-emerald-500', 
    'from-yellow-500 to-orange-500',
    'from-red-500 to-rose-500',
    'from-gray-500 to-slate-500',
    'from-indigo-500 to-violet-500',
    'from-pink-500 to-rose-500',
];

const Profile: React.FC<ProfileProps> = ({ changeView }) => {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'WHEELS' | 'SURVEYS' | 'NHIE'>('WHEELS');
  
  const [myWheels, setMyWheels] = useState<SavedWheel[]>([]);
  const [mySurveys, setMySurveys] = useState<SavedSurveyList[]>([]);
  const [myNHIE, setMyNHIE] = useState<SavedNHIEList[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showEditContent, setShowEditContent] = useState(false);

  // Settings State
  const [newUsername, setNewUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [password, setPassword] = useState('');
  
  // Edit Content State
  const [editItem, setEditItem] = useState<any>(null); // Type loose for simplicity in one modal
  const [editTitle, setEditTitle] = useState('');
  const [editQuestions, setEditQuestions] = useState<string[]>([]);
  const [editNewQuestion, setEditNewQuestion] = useState('');

  useEffect(() => {
    if (user) {
      loadContent();
      setNewUsername(user.username);
      setSelectedAvatar(user.avatarId || 0);
    }
  }, [user, activeTab]);

  const loadContent = async () => {
    if (!user) return;
    setLoading(true);
    if (activeTab === 'WHEELS') {
        const wheels = await getUserWheels(user.username);
        setMyWheels(wheels);
    } else if (activeTab === 'SURVEYS') {
        const surveys = await getUserSurveyLists(user.username);
        setMySurveys(surveys);
    } else {
        const nhie = await getUserNHIELists(user.username);
        setMyNHIE(nhie);
    }
    setLoading(false);
  };

  // --- ACTIONS ---

  const handleDelete = async (id: string) => {
    if (!user || !window.confirm(t('delete') + '?')) return;

    if (activeTab === 'WHEELS') await deleteUserWheel(user.username, id);
    else if (activeTab === 'SURVEYS') await deleteUserSurveyList(user.username, id);
    else await deleteUserNHIEList(user.username, id);
    
    loadContent();
  };

  const handleLoad = (item: any) => {
    if (activeTab === 'WHEELS') {
      localStorage.setItem('pz_wheel_questions', JSON.stringify(item.questions));
      localStorage.setItem('pz_wheel_count', item.targetCount.toString());
      changeView(ViewState.WHEEL);
    } else if (activeTab === 'SURVEYS') {
      localStorage.setItem('pz_survey_list', JSON.stringify(item.surveys));
      changeView(ViewState.SURVEY);
    } else {
      localStorage.setItem('pz_nhie_load_list', JSON.stringify(item.questions));
      changeView(ViewState.NEVER_HAVE_I_EVER);
    }
  };

  // --- EDIT CONTENT ---
  const openEditModal = (item: any) => {
      setEditItem(item);
      setEditTitle(item.title);
      // For Surveys we don't edit inner questions here, too complex for simple modal
      setEditQuestions(item.questions ? [...item.questions] : []);
      setShowEditContent(true);
  };

  const handleSaveContentEdit = async () => {
      if(!editItem) return;

      if (activeTab === 'WHEELS') {
          await updateWheel(editItem.id, editTitle, editQuestions);
      } else if (activeTab === 'SURVEYS') {
          await updateSurveyList(editItem.id, editTitle);
      } else {
          await updateNHIEList(editItem.id, editTitle, editQuestions);
      }
      setShowEditContent(false);
      loadContent();
  };

  const handleEditAddQ = () => {
      if(editNewQuestion.trim()) {
          setEditQuestions([...editQuestions, editNewQuestion.trim()]);
          setEditNewQuestion('');
      }
  };

  const handleEditRemoveQ = (idx: number) => {
      setEditQuestions(editQuestions.filter((_, i) => i !== idx));
  };

  // --- SETTINGS ---
  const handleSaveSettings = async () => {
      if (!user) return;
      
      if (newUsername !== user.username) {
          // Backend call to migrate data
          await updateUserProfile(user.username, newUsername);
      }
      
      updateProfile(newUsername, selectedAvatar);
      setShowSettings(false);
      
      // Reload content if username changed as the fetch depends on it
      if (newUsername !== user.username) {
          setTimeout(loadContent, 100); 
      }
  };

  const handleDeleteAccount = async () => {
      if (!user) return;
      if (window.confirm(t('delete_account_confirm'))) {
          await deleteUserProfile(user.username);
          deleteAccount();
          changeView(ViewState.HOME);
      }
  };

  if (!user) return <div className="text-center text-white mt-20">{t('login')}</div>;

  return (
    <div className="flex flex-col items-center w-full min-h-[70vh] px-4 pt-4 pb-20">
      {/* Header */}
      <div className="glass-panel w-full max-w-3xl p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-purple-500/20 shadow-[0_0_40px_rgba(139,92,246,0.1)] relative">
         <div className="flex flex-col md:flex-row items-center gap-6">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-tr ${AVATAR_COLORS[user.avatarId || 0]} flex items-center justify-center text-3xl font-black text-white shadow-lg ring-4 ring-white/10`}>
                {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-1">{user.username}</h2>
                <p className="text-gray-400 font-medium">{user.email}</p>
            </div>
         </div>
         <button 
            onClick={() => setShowSettings(true)}
            className="px-5 py-2 glass-button rounded-xl text-sm font-bold text-white hover:bg-white/10"
         >
             ⚙️ {t('settings')}
         </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 w-full max-w-3xl overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('WHEELS')}
            className={`flex-1 min-w-[120px] py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${activeTab === 'WHEELS' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
              <WheelIcon className="w-5 h-5" /> {t('profile_tab_wheels')}
          </button>
          <button 
            onClick={() => setActiveTab('SURVEYS')}
            className={`flex-1 min-w-[120px] py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${activeTab === 'SURVEYS' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
              <SurveyIcon className="w-5 h-5" /> {t('profile_tab_surveys')}
          </button>
          <button 
            onClick={() => setActiveTab('NHIE')}
            className={`flex-1 min-w-[120px] py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${activeTab === 'NHIE' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
              <HandIcon className="w-5 h-5" /> {t('profile_tab_nhie')}
          </button>
      </div>

      {/* Content List */}
      <div className="w-full max-w-3xl">
          {loading ? (
              <div className="text-center py-10 text-gray-500">{t('loading')}</div>
          ) : (
             <div className="grid grid-cols-1 gap-4">
                 {(activeTab === 'WHEELS' ? myWheels : activeTab === 'SURVEYS' ? mySurveys : myNHIE).map((item: any) => (
                     <div key={item.id} className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-white/5 transition">
                         <div className="text-center md:text-left">
                             <h4 className="font-bold text-lg text-white">{item.title}</h4>
                             <p className="text-xs text-white/40 mt-1">
                                 {activeTab === 'SURVEYS' ? item.surveys?.length : item.questions?.length} Items • {new Date(item.createdAt).toLocaleDateString()}
                             </p>
                         </div>
                         <div className="flex gap-2">
                             <button onClick={() => handleLoad(item)} className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-500/20">{t('load')}</button>
                             <button onClick={() => openEditModal(item)} className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/40 transition font-bold">{t('edit')}</button>
                             <button onClick={() => handleDelete(item.id)} className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition font-bold">✕</button>
                         </div>
                     </div>
                 ))}
                 
                 {((activeTab === 'WHEELS' && myWheels.length === 0) || 
                   (activeTab === 'SURVEYS' && mySurveys.length === 0) ||
                   (activeTab === 'NHIE' && myNHIE.length === 0)) && (
                     <div className="text-center text-gray-500 py-10 bg-white/5 rounded-2xl border border-white/5">
                         {t('profile_no_content')}
                     </div>
                 )}
             </div>
          )}
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="glass-panel w-full max-w-lg p-8 rounded-3xl relative overflow-y-auto max-h-[90vh]">
                  <h3 className="text-2xl font-bold text-white mb-6">{t('settings_title')}</h3>
                  
                  {/* Avatar Picker */}
                  <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-400 mb-3">{t('change_avatar')}</label>
                      <div className="flex flex-wrap gap-3">
                          {AVATAR_COLORS.map((color, i) => (
                              <button 
                                key={i}
                                onClick={() => setSelectedAvatar(i)}
                                className={`w-12 h-12 rounded-full bg-gradient-to-tr ${color} transition-transform hover:scale-110 ring-2 ${selectedAvatar === i ? 'ring-white scale-110' : 'ring-transparent'}`}
                              />
                          ))}
                      </div>
                  </div>

                  {/* Username */}
                  <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-400 mb-2">{t('change_username')}</label>
                      <input 
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition"
                      />
                  </div>

                  {/* Password (Simulated) */}
                  <div className="mb-8">
                      <label className="block text-xs font-bold text-gray-400 mb-2">{t('change_password')}</label>
                      <input 
                        type="password"
                        placeholder={t('new_password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition"
                      />
                  </div>

                  <div className="flex flex-col gap-3">
                      <button 
                        onClick={handleSaveSettings}
                        className="w-full py-4 bg-purple-600 rounded-xl font-bold text-white hover:bg-purple-500 btn-3d border-b-purple-800"
                      >
                          {t('save_changes')}
                      </button>
                      <button 
                        onClick={handleDeleteAccount}
                        className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/30 transition border border-red-500/30"
                      >
                          {t('delete_account')}
                      </button>
                      <button 
                        onClick={() => setShowSettings(false)}
                        className="w-full py-3 text-gray-400 hover:text-white transition"
                      >
                          {t('close')}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* EDIT CONTENT MODAL */}
      {showEditContent && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="glass-panel w-full max-w-lg p-8 rounded-3xl relative flex flex-col max-h-[85vh]">
                  <h3 className="text-xl font-bold text-white mb-4">{t('edit_content_title')}</h3>
                  
                  <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-400 mb-2">{t('edit_title_label')}</label>
                      <input 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                      />
                  </div>

                  {/* List Items Editor (Only for Wheel and NHIE) */}
                  {activeTab !== 'SURVEYS' && (
                      <div className="flex-1 overflow-hidden flex flex-col">
                          <label className="block text-xs font-bold text-gray-400 mb-2">{t('edit_items_label')}</label>
                          <div className="flex gap-2 mb-2">
                               <input 
                                    value={editNewQuestion}
                                    onChange={(e) => setEditNewQuestion(e.target.value)}
                                    placeholder={t('add')}
                                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handleEditAddQ()}
                               />
                               <button onClick={handleEditAddQ} className="px-4 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-500">+</button>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 rounded-xl p-2 space-y-2">
                              {editQuestions.map((q, i) => (
                                  <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded-lg text-sm">
                                      <span className="truncate mr-2">{q}</span>
                                      <button onClick={() => handleEditRemoveQ(i)} className="text-red-400 hover:text-red-300">×</button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  <div className="flex gap-3 mt-6">
                      <button 
                        onClick={() => setShowEditContent(false)}
                        className="flex-1 py-3 bg-white/10 rounded-xl font-bold text-gray-300 hover:text-white"
                      >
                          {t('cancel')}
                      </button>
                      <button 
                        onClick={handleSaveContentEdit}
                        className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-500 btn-3d border-b-blue-800"
                      >
                          {t('save')}
                      </button>
                  </div>
              </div>
           </div>
      )}
    </div>
  );
};

export default Profile;
