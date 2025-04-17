import express from 'express';
import {
  startQuizAttempt,
  submitQuizAttempt,
  getQuizAttempts,
  getQuizAttemptById
} from './dao.js';
import { validateQuizStart, validateQuizSubmit } from '../middleware/validateRequest.js'; 

const router = express.Router();

console.log('[QuizAttempts] Routes initialized');

// Test route
router.get('/api/quiz-attempts/test', (req, res) => {
  res.send('/api/quiz-attempts/test is working!');
});

// Quiz Attempt Core APIs
router.post('/api/quiz-attempts/:quizId/start', validateQuizStart, startQuizAttempt);          // Start attempt with validation
router.post('/api/quiz-attempts/:quizId/submit', validateQuizSubmit, submitQuizAttempt);        // Submit attempt with validation
router.get('/api/quiz-attempts/:quizId/attempts', getQuizAttempts);         // View all attempts
router.get('/api/quiz-attempts/:quizId/attempts/:attemptId', getQuizAttemptById); // View specific attempt

// Export as a function 
export default (app) => {
  app.use('/api/quiz-attempts', router);
};
