import mongoose from 'mongoose';

/**
 * Helper function to validate quizId format
 * Accepts either a valid MongoDB ObjectId OR a custom string like "Q101", "QQ101"
 */
const isValidQuizId = (id) => {
  return typeof id === 'string' && (mongoose.Types.ObjectId.isValid(id) || /^[A-Za-z]{1,3}\d{2,5}$/.test(id));
};

/**
 * Validation middleware for starting a quiz attempt
 */
export const validateQuizStart = (req, res, next) => {
  const { userId } = req.body;
  const { quizId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required to start a quiz' });
  }

  if (!isValidQuizId(quizId)) {
    return res.status(400).json({ error: 'Invalid quizId format' });
  }

  next();
};

/**
 * Validation middleware for submitting quiz answers
 */
export const validateQuizSubmit = (req, res, next) => {
  const { userId, answers } = req.body;
  const { quizId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  if (!isValidQuizId(quizId)) {
    return res.status(400).json({ error: 'Invalid quizId format' });
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'answers must be a non-empty array' });
  }

  for (let i = 0; i < answers.length; i++) {
    const ans = answers[i];

    // For questionId: allow either ObjectId format or custom string like "Q1", "Q101"
    if (!ans.questionId || (!mongoose.Types.ObjectId.isValid(ans.questionId) && !/^Q\d{1,5}$/.test(ans.questionId))) {
      return res.status(400).json({ error: `Invalid or missing questionId at index ${i}` });
    }

    if (ans.selectedAnswer === undefined || ans.selectedAnswer === null) {
      return res.status(400).json({ error: `selectedAnswer is required at index ${i}` });
    }
  }

  next();
};
