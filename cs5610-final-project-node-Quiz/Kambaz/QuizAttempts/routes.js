import express from 'express';
import {
  startQuizAttempt,
  submitQuizAttempt,
  getQuizAttempts,
  getQuizAttemptById
} from './dao.js';
import { validateQuizStart, validateQuizSubmit } from '../middleware/validateRequest.js';

const router = express.Router();

// Core Quiz Attempt APIs
router.post('/:quizId/start', validateQuizStart, startQuizAttempt);
router.post('/:quizId/submit', validateQuizSubmit, submitQuizAttempt);
router.get('/:quizId/attempts', getQuizAttempts);
router.get('/:quizId/attempts/:attemptId', getQuizAttemptById);

// Export router
export default (app) => {
  app.use('/api/quiz-attempts', router);
};
