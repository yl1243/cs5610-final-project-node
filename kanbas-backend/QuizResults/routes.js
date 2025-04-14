import express from 'express';
import {
  getQuizResultByQuizAndUser,
  getQuizResultsByUser
} from './dao.js';

const router = express.Router();

/**
 * GET /api/quiz-results/user/:userId
 * Returns all quiz results submitted by the given user.
 * - Useful for a student dashboard, transcript, or overall progress.
 */
router.get('/user/:userId', getQuizResultsByUser);

/**
 * GET /api/quiz-results/:quizId/:userId
 * Retrieves the result of a specific quiz for a specific user.
 * - Used to display final score, pass/fail, and feedback for a quiz.
 */
router.get('/:quizId/:userId', getQuizResultByQuizAndUser);

export default router;

