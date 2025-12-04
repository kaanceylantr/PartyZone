
// Bu dosya veritabanı katmanını temsil eder.
// Gerçek bir uygulamada burada MongoDB, PostgreSQL vb. bağlantıları olur.

const initialQuestions = [
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
  "Telefondaki son fotoğrafı göster.",
  "Bize bir yeteneğini göster.",
  "Hoşlandığın kişinin baş harfi ne?",
  "En son ne zaman yalan söyledin?",
  "Bir hayvan olsan hangisi olurdun?",
  "Gizli bir takıntın var mı?",
  "En sevdiğin çizgi film karakteri kim?",
  "Yarın dünyanın sonu gelse bugün ne yapardın?",
  "Hiç tutuklandın mı veya polisle başın derde girdi mi?",
  "Vücudunda en sevmediğin yer neresi?"
];

const initialSurveys = [
  {
    id: "s1",
    question: "Hafta sonu için en iyi aktivite?",
    options: [
      { id: "o1", text: "Kamp yapmak", votes: 2 },
      { id: "o2", text: "Film maratonu", votes: 5 },
      { id: "o3", text: "Sabaha kadar parti", votes: 12 },
      { id: "o4", text: "Evde uyumak", votes: 8 }
    ]
  },
  {
    id: "s2",
    question: "Hangi süper gücü istersin?",
    options: [
      { id: "o1", text: "Uçmak", votes: 10 },
      { id: "o2", text: "Görünmezlik", votes: 7 },
      { id: "o3", text: "Zihin Okuma", votes: 15 },
      { id: "o4", text: "Işınlanma", votes: 20 }
    ]
  },
  {
    id: "s3",
    question: "Zombiler bassa ilk kim ölür?",
    options: [
      { id: "o1", text: "En cesur olan", votes: 3 },
      { id: "o2", text: "En sessiz olan", votes: 1 },
      { id: "o3", text: "En çok konuşan", votes: 18 },
      { id: "o4", text: "En yavaş koşan", votes: 12 }
    ]
  }
];

module.exports = {
  questions: initialQuestions,
  surveys: initialSurveys
};
