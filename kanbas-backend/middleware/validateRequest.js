import mongoose from 'mongoose';

/**
 * Validation middleware for starting a quiz attempt
 * Ensures userId exists and quizId is a valid MongoDB ObjectId
 */
export const validateQuizStart = (req, res, next) => {
  const { userId } = req.body;
  const { quizId } = req.params;

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ error: 'userId is required to start a quiz' });
  }

  // Validate quizId format
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({ error: 'Invalid quizId format' });
  }

  // Proceed to controller if valid
  next();
};

/**
 * Validation middleware for submitting quiz answers
 * Ensures userId, quizId, and answers array are valid
 * Each answer must have a valid questionId and selectedAnswer
 */
export const validateQuizSubmit = (req, res, next) => {
  const { userId, answers } = req.body;
  const { quizId } = req.params;

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // Validate quizId format
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({ error: 'Invalid quizId format' });
  }

  // Ensure answers is a non-empty array
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'answers must be a non-empty array' });
  }

  // Validate each answer object
  for (let i = 0; i < answers.length; i++) {
    const ans = answers[i];

    // Check for valid questionId
    if (!ans.questionId || !mongoose.Types.ObjectId.isValid(ans.questionId)) {
      return res.status(400).json({ error: `Invalid or missing questionId at index ${i}` });
    }

    // Ensure selectedAnswer is provided (can be string, number, etc.)
    if (ans.selectedAnswer === undefined || ans.selectedAnswer === null) {
      return res.status(400).json({ error: `selectedAnswer is required at index ${i}` });
    }
  }

  // All validations passed — continue
  next();
};
