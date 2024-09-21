// routes/scoreboard.js

const express = require('express');
const router = express.Router();
const Scoreboard = require('../models/Scoreboard'); // Import the Scoreboard model

// POST route to save quiz results
router.post('/scoreboard', async (req, res) => {
  const { quizName, correctAnswers, percentage } = req.body;

  const newScore = new Scoreboard({
    quizName,
    correctAnswers,
    percentage,
  });

  try {
    const savedScore = await newScore.save();
    res.status(200).json(savedScore);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

module.exports = router;