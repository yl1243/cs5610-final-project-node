import express from 'express';
import {
  startQuizAttempt,
  submitQuizAttempt,
  getQuizAttempts,
  getQuizAttemptById
} from './dao.js';

const router = express.Router();

console.log('✅ QuizAttempts/routes.js is being executed');

// 🧪 Test route to confirm this module is wired up
router.get('/test', (req, res) => {
  res.send('✅ /api/quiz-attempts/test is working!');
});

/**
 * POST /api/quiz-attempts/:quizId/start
 * Start a new attempt for a specific quiz.
 */
router.post('/:quizId/start', startQuizAttempt);

/**
 * POST /api/quiz-attempts/:quizId/submit
 * Submit answers for the latest quiz attempt.
 */
router.post('/:quizId/submit', submitQuizAttempt);

/**
 * GET /api/quiz-attempts/:quizId/attempts
 * View all attempts for a quiz (faculty access).
 */
router.get('/:quizId/attempts', getQuizAttempts);

/**
 * GET /api/quiz-attempts/:quizId/attempts/:attemptId
 * View a specific attempt in detail.
 */
router.get('/:quizId/attempts/:attemptId', getQuizAttemptById);

export default router;
