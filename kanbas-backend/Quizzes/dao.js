import Quiz from '../Database/quiz.js';

/**
 * GET /api/quizzes
 * Fetch all quizzes from the database.
 */
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.error('❌ Error fetching all quizzes:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/quizzes/:quizId
 * Retrieve quiz metadata by ID.
 * Includes title, availability, settings, etc.
 */
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.quizId });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error('❌ Error fetching quiz by ID:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/quizzes/:quizId
 * Update quiz metadata (e.g., title, dueDate, timeLimit).
 */
export const updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findOneAndUpdate(
      { _id: req.params.quizId },
      req.body,
      { new: true }
    );
    if (!updatedQuiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(updatedQuiz);
  } catch (err) {
    console.error('❌ Error updating quiz:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/quizzes/:quizId/publish
 * Mark the quiz as published (available to students).
 */
export const publishQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.quizId },
      { published: true },
      { new: true }
    );
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error('❌ Error publishing quiz:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/quizzes/:quizId/preview
 * Returns quiz metadata only.
 * Placeholder for when questions are added in the future.
 */
export const previewQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.quizId });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // 🚧 Question model not implemented yet
    res.json({
      quiz,
      questions: [] // Will populate this once Question model is ready
    });
  } catch (err) {
    console.error('❌ Error previewing quiz:', err.message);
    res.status(500).json({ error: err.message });
  }
};
