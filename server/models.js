
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String }, // In real app, hash this!
  avatarId: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Wheel Schema
const wheelSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Owner username
  title: { type: String, required: true },
  questions: [String],
  targetCount: { type: Number, default: 8 },
  createdAt: { type: Date, default: Date.now }
});

// Survey List Schema
const surveyOptionSchema = new mongoose.Schema({
  id: String,
  text: String,
  votes: { type: Number, default: 0 }
});

const surveySchema = new mongoose.Schema({
  id: String,
  question: String,
  options: [surveyOptionSchema]
});

const surveyListSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  surveys: [surveySchema],
  createdAt: { type: Date, default: Date.now }
});

// Never Have I Ever List Schema
const nhieListSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  questions: [String],
  createdAt: { type: Date, default: Date.now }
});

// Static Content Schema (For default questions)
const staticDataSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, // 'questions', 'surveys', 'nhie'
  data: mongoose.Schema.Types.Mixed
});

const User = mongoose.model('User', userSchema);
const Wheel = mongoose.model('Wheel', wheelSchema);
const SurveyList = mongoose.model('SurveyList', surveyListSchema);
const NHIEList = mongoose.model('NHIEList', nhieListSchema);
const StaticData = mongoose.model('StaticData', staticDataSchema);

module.exports = { User, Wheel, SurveyList, NHIEList, StaticData };
