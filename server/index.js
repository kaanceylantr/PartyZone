
const express = require('express');
const cors = require('cors');
const { questions, surveys } = require('./db');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Frontend'den gelen isteklere izin ver
app.use(express.json());

// --- ROUTES ---

// 1. Soru Çarkı için Soru Getir
// İstenilen sayıda (count) rastgele soru döner.
// Eğer kullanıcı soru gönderdiyse (exclude), onları hariç tutar.
app.get('/api/questions', (req, res) => {
  const count = parseInt(req.query.count) || 10;
  
  // Veritabanındaki tüm soruları kopyala
  let pool = [...questions];
  
  // Karıştır
  pool.sort(() => Math.random() - 0.5);
  
  // İstenilen adette gönder
  const selected = pool.slice(0, count);
  
  // Eğer yetmezse başa dönüp tekrar ekle (döngüsel)
  while (selected.length < count) {
    const random = questions[Math.floor(Math.random() * questions.length)];
    selected.push(random);
  }

  res.json({ success: true, data: selected });
});

// 2. Rastgele Anket Getir
app.get('/api/surveys/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * surveys.length);
  res.json({ success: true, data: surveys[randomIndex] });
});

// 3. Yeni Anket Oluştur (Opsiyonel - Backend'e kaydetmek için)
app.post('/api/surveys', (req, res) => {
  const newSurvey = {
    id: Date.now().toString(),
    ...req.body,
    options: req.body.options.map((opt, i) => ({
      id: `opt-${Date.now()}-${i}`,
      text: opt,
      votes: 0
    }))
  };
  
  // Gerçek DB'ye kayıt burada yapılır
  surveys.push(newSurvey);
  
  res.json({ success: true, data: newSurvey });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
