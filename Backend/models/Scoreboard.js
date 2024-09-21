// models/Scoreboard.js

const mongoose = require('mongoose');

// Define a Scoreboard Schema
const scoreboardSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  percentage: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Scoreboard model
const Scoreboard = mongoose.model('Scoreboard', scoreboardSchema);

module.exports = Scoreboard;