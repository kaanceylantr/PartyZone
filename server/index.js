
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const { User, Wheel, SurveyList, NHIEList, StaticData } = require('./models');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// --- PUBLIC ROUTES ---

// 1. Get Questions
app.get('/api/questions', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 10;
    const staticData = await StaticData.findOne({ type: 'questions' });
    const questions = staticData ? staticData.data : [];
    
    // Shuffle and slice
    let pool = [...questions].sort(() => Math.random() - 0.5);
    const selected = pool.slice(0, count);
    
    // If not enough, repeat randoms
    while (selected.length < count && questions.length > 0) {
      selected.push(questions[Math.floor(Math.random() * questions.length)]);
    }

    res.json({ success: true, data: selected });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 2. Get Random Survey
app.get('/api/surveys/random', async (req, res) => {
  try {
    const staticData = await StaticData.findOne({ type: 'surveys' });
    const surveys = staticData ? staticData.data : [];
    if(surveys.length === 0) return res.json({ success: false });

    const randomIndex = Math.floor(Math.random() * surveys.length);
    res.json({ success: true, data: surveys[randomIndex] });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

// 3. Get NHIE Questions
app.get('/api/nhie', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 20;
    const staticData = await StaticData.findOne({ type: 'nhie' });
    const questions = staticData ? staticData.data : [];
    
    let pool = [...questions].sort(() => Math.random() - 0.5);
    res.json({ success: true, data: pool.slice(0, count) });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

// --- USER MANAGEMENT ---

// Update User (and Migrate Content)
app.put('/api/user/:username', async (req, res) => {
    const { username } = req.params;
    const { newUsername } = req.body;
    
    try {
        // Update User Doc
        await User.findOneAndUpdate({ username }, { username: newUsername });

        // Update Content Ownership
        await Wheel.updateMany({ username }, { username: newUsername });
        await SurveyList.updateMany({ username }, { username: newUsername });
        await NHIEList.updateMany({ username }, { username: newUsername });
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Delete User
app.delete('/api/user/:username', async (req, res) => {
    const { username } = req.params;
    try {
        await User.findOneAndDelete({ username });
        await Wheel.deleteMany({ username });
        await SurveyList.deleteMany({ username });
        await NHIEList.deleteMany({ username });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// --- WHEELS ---
app.get('/api/user/:username/wheels', async (req, res) => {
    try {
        const wheels = await Wheel.find({ username: req.params.username });
        // Map _id to id for frontend
        const mapped = wheels.map(w => ({ ...w.toObject(), id: w._id.toString() }));
        res.json({ success: true, data: mapped });
    } catch(e) { res.status(500).json({success: false}) }
});

app.post('/api/user/:username/wheels', async (req, res) => {
    try {
        const { username } = req.params;
        const newWheel = await Wheel.create({ username, ...req.body });
        res.json({ success: true, data: { ...newWheel.toObject(), id: newWheel._id.toString() } });
    } catch(e) { res.status(500).json({success: false}) }
});

app.put('/api/wheels/:id', async (req, res) => {
    try {
        await Wheel.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true });
    } catch(e) { res.status(500).json({success: false}) }
});

app.delete('/api/user/:username/wheels/:id', async (req, res) => {
    try {
        await Wheel.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch(e) { res.status(500).json({success: false}) }
});

// --- SURVEY LISTS ---
app.get('/api/user/:username/surveylists', async (req, res) => {
    try {
        const lists = await SurveyList.find({ username: req.params.username });
        const mapped = lists.map(l => ({ ...l.toObject(), id: l._id.toString() }));
        res.json({ success: true, data: mapped });
    } catch(e) { res.status(500).json({success: false}) }
});

app.post('/api/user/:username/surveylists', async (req, res) => {
    try {
        const { username } = req.params;
        const newList = await SurveyList.create({ username, ...req.body });
        res.json({ success: true, data: { ...newList.toObject(), id: newList._id.toString() } });
    } catch(e) { res.status(500).json({success: false}) }
});

app.put('/api/surveylists/:id', async (req, res) => {
    try {
        await SurveyList.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true });
    } catch(e) { res.status(500).json({success: false}) }
});

app.delete('/api/user/:username/surveylists/:id', async (req, res) => {
    try {
        await SurveyList.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch(e) { res.status(500).json({success: false}) }
});

// --- NHIE LISTS ---
app.get('/api/user/:username/nhielists', async (req, res) => {
    try {
        const lists = await NHIEList.find({ username: req.params.username });
        const mapped = lists.map(l => ({ ...l.toObject(), id: l._id.toString() }));
        res.json({ success: true, data: mapped });
    } catch(e) { res.status(500).json({success: false}) }
});

app.post('/api/user/:username/nhielists', async (req, res) => {
    try {
        const { username } = req.params;
        const newList = await NHIEList.create({ username, ...req.body });
        res.json({ success: true, data: { ...newList.toObject(), id: newList._id.toString() } });
    } catch(e) { res.status(500).json({success: false}) }
});

app.put('/api/nhielists/:id', async (req, res) => {
    try {
        await NHIEList.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true });
    } catch(e) { res.status(500).json({success: false}) }
});

app.delete('/api/user/:username/nhielists/:id', async (req, res) => {
    try {
        await NHIEList.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch(e) { res.status(500).json({success: false}) }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
