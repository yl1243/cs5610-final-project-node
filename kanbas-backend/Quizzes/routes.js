import express from 'express';
import {
  getAllQuizzes,      
  getQuizById,
  updateQuiz,
  publishQuiz,
  previewQuiz
} from './dao.js';

const router = express.Router();

console.log('✅ [Quizzes] Routes initialized');

// 🔹 Health Check / Test
router.get('/test', (req, res) => {
  res.send('✅ Quiz test route is working');
});

// 🔹 Quiz Core APIs
router.get('/', getAllQuizzes);                  // Get all quizzes
router.get('/:quizId/preview', previewQuiz);     // Preview full quiz
router.put('/:quizId/publish', publishQuiz);     // Publish quiz
router.get('/:quizId', getQuizById);             // Get quiz by ID
router.put('/:quizId', updateQuiz);              // Update quiz metadata

export default router;
