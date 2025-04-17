import QuizResult from '../Database/quiz_results.js';

/**
 * GET /api/quiz-results/:quizId/:userId
 * Retrieve the quiz result for a specific quiz and user.
 * Returns score, pass/fail status, and related attempt reference.
 */
export const getQuizResultByQuizAndUser = async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    const result = await QuizResult.findOne({ quizId, userId });

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(result);
  } catch (err) {
    console.error('Error fetching quiz result by quizId and userId:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/quiz-results/user/:userId
 * Retrieve all quiz results for a specific user.
 * Used for student dashboard or instructor gradebook views.
 */
export const getQuizResultsByUser = async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.params.userId });
    res.json(results);
  } catch (err) {
    console.error('Error fetching quiz results by userId:', err.message);
    res.status(500).json({ error: err.message });
  }
};
