import express from 'express';
import {
  getQuizResultByQuizAndUser,
  getQuizResultsByUser
} from './dao.js';

const router = express.Router();

// Core Quiz Result APIs
router.get('/user/:userId', getQuizResultsByUser);          // Get all results for a user
router.get('/:quizId/:userId', getQuizResultByQuizAndUser); // Get specific quiz result for user

// Export as a function
export default (app) => {
  app.use('/api/quiz-results', router);
};
