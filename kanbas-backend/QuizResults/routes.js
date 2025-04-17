import express from 'express';
import {
  getQuizResultByQuizAndUser,
  getQuizResultsByUser
} from './dao.js';

const router = express.Router();

console.log('[QuizResults] Routes initialized');

// Test route
router.get('/api/quiz-results/test', (req, res) => {
  res.send('/api/quiz-results/test is working!');
});

// Quiz Results Core APIs
router.get('/api/quiz-results/user/:userId', getQuizResultsByUser);          // Get all results for a user
router.get('/api/quiz-results/:quizId/:userId', getQuizResultByQuizAndUser); // Get specific quiz result for user

// Export as a function 
export default (app) => {
  app.use('/api/quiz-results', router);
};
