// Kambaz/QuizResults/routes.js
import express from 'express';
import {
  getQuizResultByQuizAndUser,
  getQuizResultsByUser
} from './dao.js';
import { validateQuizAnswers } from '../middleware/validateAnswers.js';
import Question from '../Database/questions.js';

const router = express.Router();

console.log('[QuizResults] Routes initialized');

// Test route
router.get('/test', (req, res) => {
  res.send('/test is working!');
});

// Add this before your existing routes
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Debug endpoint to check questions directly
router.get('/debug-questions/:quizId', async (req, res) => {
  try {
    console.log('Looking for questions with quizId:', req.params.quizId);
    const questions = await Question.find({ quizId: req.params.quizId });
    console.log('Found questions count:', questions.length);
    res.json({
      quizId: req.params.quizId,
      count: questions.length,
      questions: questions
    });
  } catch (err) {
    console.error('Error finding questions:', err);
    res.status(500).json({ error: err.message });
  }
});

// Quiz Results Core APIs
router.get('/user/:userId', getQuizResultsByUser);
router.get('/:quizId/:userId', getQuizResultByQuizAndUser);

// Validation endpoint
console.log('Registering POST /validate endpoint');
router.post('/validate', validateQuizAnswers);

// Add this to your routes.js
router.post('/test-post', (req, res) => {
  console.log('Received test POST with data:', req.body);
  res.json({ success: true, receivedData: req.body });
});

// Export as a function (keeping this pattern)
export default (app) => {
  app.use('/api/quiz-results', router);
};