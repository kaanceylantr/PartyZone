
// FRONTEND API LAYER
// Bu servis Frontend bileşenleri tarafından kullanılır.
// Backend'e istek atar. Backend çalışmıyorsa "Fallback" (Yedek) verileri kullanır.

import { Survey } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// FALLBACK DATA (Sunucu kapalıyken çalışması için yedek veriler)
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

// --- API METHODS ---

export const fetchQuestions = async (count: number): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions?count=${count}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn("Backend'e ulaşılamadı, yedek veriler kullanılıyor:", error);
    // Yedek veriden rastgele seçip döndür
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
    console.warn("Backend'e ulaşılamadı, yedek veri kullanılıyor:", error);
    return FALLBACK_SURVEY;
  }
};

// Yardımcı fonksiyon: Kullanıcı sorularıyla DB sorularını birleştirir
export const getMixedQuestions = async (targetCount: number, userQuestions: string[]): Promise<string[]> => {
  // Kullanıcının girdikleri cepte
  let finalQuestions = [...userQuestions];
  
  // Eksik kalan sayı
  const needed = Math.max(0, targetCount - userQuestions.length);
  
  if (needed > 0) {
    const dbQuestions = await fetchQuestions(needed);
    finalQuestions = [...finalQuestions, ...dbQuestions];
  }

  // Eğer hala sayı tutmuyorsa (çok nadir), başa sar
  while(finalQuestions.length < targetCount) {
    finalQuestions.push("Joker Soru: Bir sırrını paylaş!");
  }
  
  return finalQuestions.slice(0, targetCount);
};
