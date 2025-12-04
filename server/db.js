
const mongoose = require('mongoose');
const { StaticData } = require('./models');

// Initial Data for Seeding
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

const neverHaveIEver = [
  "Hiç kopya çekerken yakalanmadım.",
  "Hiç toplu taşımada uyuyakalmadım.",
  "Hiç sahte bir mazeret uydurmadım.",
  "Hiç birine aşıkmış gibi davranmadım.",
  "Hiç telefonumu tuvalete düşürmedim.",
  "Hiç hesabı ödemeden kaçmadım.",
  "Hiç stalk yaparken yanlışlıkla beğeni atmadım.",
  "Hiç arkadaşlarımın sırrını başkasına anlatmadım.",
  "Hiç bir düğünde sarhoş olup rezil olmadım.",
  "Hiç sevgilimin telefonunu gizlice karıştırmadım.",
  "Hiç derste uyurken horlamadım.",
  "Hiç yemeğin içinden çıkan bir şeyi gizlice yemedim.",
  "Hiç yaşımı yalan söylemedim.",
  "Hiç birinin mesajını okuyup görüldü atmadım.",
  "Hiç eski sevgilimi özleyip gece yarısı mesaj atmadım.",
  "Hiç otobüste/minibüste ineceğim durağı kaçırmadım.",
  "Hiç bir kıyafeti giyip etiketi üzerinde iade etmedim.",
  "Hiç havuza/denize işemedim.",
  "Hiç asansörde gaz çıkarmadım.",
  "Hiç birine hediye olarak verilmiş bir şeyi başkasına hediye etmedim.",
  "Hiç günlerce duş almadığım olmadı.",
  "Hiç diş fırçamı başkasınınkiyle karıştırmadım.",
  "Hiç sinemada film izlerken uyuyakalmadım.",
  "Hiç ünlü birine DM atıp cevap beklemedim.",
  "Hiç karaoke yaparken detone olmadım.",
  "Hiç yanlış kişiye yanlış mesaj göndermedim.",
  "Hiç saçımı kendim kesip pişman olmadım.",
  "Hiç bir buluşmada ismini unuttuğum biriyle konuşmaya devam etmedim.",
  "Hiç cüzdanımı unuttum numarası yapmadım.",
  "Hiç bir diziyi izlemediğim halde izlemiş gibi yapmadım."
];

const connectDB = async () => {
  try {
    // Replace with your actual MongoDB connection string from environment variables
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/partyzone';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected Successfully');

    // Seed Data if empty
    await seedData();

  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    console.log('Running in fallback mode (no database persistence for new items)');
  }
};

const seedData = async () => {
  try {
    const qCheck = await StaticData.findOne({ type: 'questions' });
    if (!qCheck) {
      await StaticData.create({ type: 'questions', data: initialQuestions });
      console.log('Seeded Questions');
    }

    const sCheck = await StaticData.findOne({ type: 'surveys' });
    if (!sCheck) {
      await StaticData.create({ type: 'surveys', data: initialSurveys });
      console.log('Seeded Surveys');
    }

    const nCheck = await StaticData.findOne({ type: 'nhie' });
    if (!nCheck) {
      await StaticData.create({ type: 'nhie', data: neverHaveIEver });
      console.log('Seeded NHIE');
    }
  } catch (e) {
    console.error("Seeding error:", e);
  }
};

module.exports = { connectDB };
