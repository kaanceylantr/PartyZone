
// FRONTEND API LAYER
import { Survey, SavedWheel, SavedSurveyList, SavedNHIEList } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const FALLBACK_QUESTIONS = [
  "En büyük korkun nedir?",
  "Asla yapmam dediğin bir şeyi yaptın mı?",
  "Çocukluğundaki en komik anın ne?",
  "Bir günlüğüne görünmez olsan ne yapardın?",
  "Issız bir adaya düşsen yanına alacağın 3 şey?",
  "Piyangoyu kazansan ilk ne alırsın?",
  "Hayatının filmi çekilse seni kim oynardı?",
  "Geçmişe gidip bir şeyi değiştirebilsen bu ne olurdu?",
  "En utanç verici anın nedir?",
  "Süper gücün olsa ne olurdu?",
];

const FALLBACK_SURVEY: Survey = {
  id: 'fallback-1',
  question: "Hafta sonu için en iyi aktivite?",
  options: [
    { id: '1', text: "Kamp yapmak", votes: 2 },
    { id: '2', text: "Film maratonu", votes: 5 },
    { id: '3', text: "Sabaha kadar parti", votes: 12 },
    { id: '4', text: "Evde uyumak", votes: 8 }
  ]
};

const FALLBACK_NHIE = [
  "Hiç kopya çekerken yakalanmadım.",
  "Hiç toplu taşımada uyuyakalmadım.",
  "Hiç sahte bir mazeret uydurmadım.",
  "Hiç birine aşıkmış gibi davranmadım.",
  "Hiç telefonumu tuvalete düşürmedim."
];

export const fetchQuestions = async (count: number): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions?count=${count}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    return result.data;
  } catch (error) {
    // Silent fail to fallback
    const shuffled = [...FALLBACK_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
};

export const fetchRandomSurvey = async (): Promise<Survey> => {
  try {
    const response = await fetch(`${API_BASE_URL}/surveys/random`);
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    return result.data;
  } catch (error) {
    return FALLBACK_SURVEY;
  }
};

export const fetchNeverHaveIEver = async (count: number = 20): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/nhie?count=${count}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    return result.data;
  } catch (error) {
     const shuffled = [...FALLBACK_NHIE].sort(() => 0.5 - Math.random());
     return shuffled.slice(0, count);
  }
}

export const getMixedQuestions = async (targetCount: number, userQuestions: string[]): Promise<string[]> => {
  let finalQuestions = [...userQuestions];
  const needed = Math.max(0, targetCount - userQuestions.length);
  
  if (needed > 0) {
    const dbQuestions = await fetchQuestions(needed);
    finalQuestions = [...finalQuestions, ...dbQuestions];
  }

  while(finalQuestions.length < targetCount) {
    finalQuestions.push("Joker Soru: Bir sırrını paylaş!");
  }
  
  return finalQuestions.slice(0, targetCount);
};

// --- USER MANAGEMENT API ---
export const updateUserProfile = async (username: string, newUsername: string) => {
    try {
        await fetch(`${API_BASE_URL}/user/${username}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ newUsername })
        });
    } catch (e) { console.error("Update user failed (Backend unavailable)"); }
};

export const deleteUserProfile = async (username: string) => {
    try {
        await fetch(`${API_BASE_URL}/user/${username}`, { method: 'DELETE' });
    } catch (e) { console.error("Delete user failed (Backend unavailable)"); }
};

// --- CONTENT UPDATE API ---
export const updateWheel = async (id: string, title: string, questions: string[]) => {
    try {
        await fetch(`${API_BASE_URL}/wheels/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title, questions })
        });
    } catch (e) { console.error("Update wheel failed (Backend unavailable)"); }
};

export const updateSurveyList = async (id: string, title: string) => {
    try {
        await fetch(`${API_BASE_URL}/surveylists/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title })
        });
    } catch (e) { console.error("Update survey list failed (Backend unavailable)"); }
};

export const updateNHIEList = async (id: string, title: string, questions: string[]) => {
    try {
        await fetch(`${API_BASE_URL}/nhielists/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title, questions })
        });
    } catch (e) { console.error("Update NHIE list failed (Backend unavailable)"); }
};


// --- USER CONTENT FETCH/SAVE API ---

// WHEELS
export const getUserWheels = async (username: string): Promise<SavedWheel[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${username}/wheels`);
        if (!response.ok) throw new Error("Fetch failed");
        const result = await response.json();
        return result.data;
    } catch {
        const local = localStorage.getItem(`pz_user_${username}_wheels`);
        return local ? JSON.parse(local) : [];
    }
};

export const saveUserWheel = async (username: string, title: string, questions: string[], targetCount: number) => {
    try {
        await fetch(`${API_BASE_URL}/user/${username}/wheels`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title, questions, targetCount })
        });
    } catch {
        // Fallback to local storage
        const key = `pz_user_${username}_wheels`;
        const local = JSON.parse(localStorage.getItem(key) || '[]');
        local.push({ id: Date.now().toString(), username, title, questions, targetCount, createdAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(local));
    }
};

export const deleteUserWheel = async (username: string, id: string) => {
    try {
        await fetch(`${API_BASE_URL}/user/${username}/wheels/${id}`, { method: 'DELETE' });
    } catch {
        const key = `pz_user_${username}_wheels`;
        const local = JSON.parse(localStorage.getItem(key) || '[]') as SavedWheel[];
        const filtered = local.filter(i => i.id !== id);
        localStorage.setItem(key, JSON.stringify(filtered));
    }
};

// SURVEY LISTS
export const getUserSurveyLists = async (username: string): Promise<SavedSurveyList[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${username}/surveylists`);
        if (!response.ok) throw new Error("Fetch failed");
        const result = await response.json();
        return result.data;
    } catch {
         const local = localStorage.getItem(`pz_user_${username}_surveys`);
         return local ? JSON.parse(local) : [];
    }
};

export const saveUserSurveyList = async (username: string, title: string, surveys: Survey[]) => {
    try {
        await fetch(`${API_BASE_URL}/user/${username}/surveylists`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title, surveys })
        });
    } catch {
        const key = `pz_user_${username}_surveys`;
        const local = JSON.parse(localStorage.getItem(key) || '[]');
        local.push({ id: Date.now().toString(), username, title, surveys, createdAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(local));
    }
};

export const deleteUserSurveyList = async (username: string, id: string) => {
     try {
        await fetch(`${API_BASE_URL}/user/${username}/surveylists/${id}`, { method: 'DELETE' });
    } catch {
        const key = `pz_user_${username}_surveys`;
        const local = JSON.parse(localStorage.getItem(key) || '[]') as SavedSurveyList[];
        const filtered = local.filter(i => i.id !== id);
        localStorage.setItem(key, JSON.stringify(filtered));
    }
};

// NHIE LISTS
export const getUserNHIELists = async (username: string): Promise<SavedNHIEList[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${username}/nhielists`);
        if (!response.ok) throw new Error("Fetch failed");
        const result = await response.json();
        return result.data;
    } catch {
         const local = localStorage.getItem(`pz_user_${username}_nhielists`);
         return local ? JSON.parse(local) : [];
    }
};

export const saveUserNHIEList = async (username: string, title: string, questions: string[]) => {
    try {
        await fetch(`${API_BASE_URL}/user/${username}/nhielists`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title, questions })
        });
    } catch {
        const key = `pz_user_${username}_nhielists`;
        const local = JSON.parse(localStorage.getItem(key) || '[]');
        local.push({ id: Date.now().toString(), username, title, questions, createdAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(local));
    }
};

export const deleteUserNHIEList = async (username: string, id: string) => {
     try {
        await fetch(`${API_BASE_URL}/user/${username}/nhielists/${id}`, { method: 'DELETE' });
    } catch {
        const key = `pz_user_${username}_nhielists`;
        const local = JSON.parse(localStorage.getItem(key) || '[]') as SavedNHIEList[];
        const filtered = local.filter(i => i.id !== id);
        localStorage.setItem(key, JSON.stringify(filtered));
    }
};
