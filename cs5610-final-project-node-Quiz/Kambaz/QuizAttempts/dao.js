import mongoose from 'mongoose';
import QuizAttempt from '../Database/quiz_attempts.js';
import Quiz from '../Database/quizzes.js';
import QuizResult from '../Database/quiz_results.js';
import Question from '../Database/questions.js';

async function findQuizById(quizId) {
  return await Quiz.findOne({ _id: quizId }).lean();
}

/**
 * POST /api/quiz-attempts/:quizId/start
 * Initializes a new quiz attempt for a user.
 * - Validates quiz and previous attempts
 * - Returns a new attempt if allowed
 */
export const startQuizAttempt = async (req, res) => {
  try {
    const { userId } = req.body;
    const quizId = req.params.quizId;

    const previousAttempts = await QuizAttempt.find({ quizId: quizId, userId: userId });
    const quiz = await findQuizById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Enforce attempt limits
    if (!quiz.multipleAttempts && previousAttempts.length > 0) {
      return res.status(400).json({ error: 'You already took this quiz' });
    }

    if (quiz.multipleAttempts && previousAttempts.length >= quiz.howManyAttempts) {
      return res.status(400).json({ error: 'Maximum number of attempts reached' });
    }

    const attempt = new QuizAttempt({
      quizId,
      userId,
      attemptNumber: previousAttempts.length + 1,
      answers: []
    });

    await attempt.save();
    res.status(201).json(attempt);
  } catch (err) {
    console.error('Error starting quiz attempt:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/quiz-attempts/:quizId/submit
 * Submits answers, calculates score, and stores result breakdown.
 */
export const submitQuizAttempt = async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const quizId = req.params.quizId;

    const quiz = await findQuizById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const attempt = await QuizAttempt.findOne({ quizId: quizId, userId: userId }).sort({ createdAt: -1 });
    if (!attempt) return res.status(400).json({ error: 'No active attempt found' });

    const allQuestions = await Question.find({ quiz: quizId }).lean();

    let score = 0;
    const breakdown = [];

    for (const answer of answers) {
      const q = allQuestions.find(q => q._id.toString() === answer.questionId);
      if (!q) continue;

      let isCorrect = false;
      if (q.type === 'MULTIPLE_CHOICE') {
        isCorrect = q.correctOptionIndex === answer.selectedAnswer;
      } else if (q.type === 'TRUE_FALSE') {
        isCorrect = q.correctAnswer === answer.selectedAnswer;
      } else if (q.type === 'FILL_BLANK') {
        isCorrect = q.correctAnswers.includes(answer.selectedAnswer);
      }

      const pointsEarned = isCorrect ? q.points : 0;
      score += pointsEarned;

      breakdown.push({
        questionId: q._id,
        correct: isCorrect,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer:
          q.type === 'MULTIPLE_CHOICE' ? q.correctOptionIndex :
          q.type === 'TRUE_FALSE' ? q.correctAnswer :
          q.correctAnswers,
        pointsEarned,
        pointsPossible: q.points
      });
    }

    // Update and save the attempt
    attempt.answers = answers;
    attempt.submittedAt = new Date();
    attempt.score = score;
    await attempt.save();

    // Save or update quiz result summary
    const quizResult = await QuizResult.findOneAndUpdate(
      { quizId, userId },
      {
        quizId,
        userId,
        score,
        maxScore: quiz.points,
        passed: score >= quiz.points * 0.6,
        attemptId: attempt._id,
        submittedAt: new Date(),
        breakdown
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: 'Quiz submitted successfully',
      score,
      passed: score >= quiz.points * 0.6,
      breakdown,
      attempt,
      result: quizResult
    });
  } catch (err) {
    console.error('Error submitting quiz attempt:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/quiz-attempts/:quizId/attempts
 * Returns all attempts made for a given quiz.
 */
export const getQuizAttempts = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const attempts = await QuizAttempt.find({ quizId });
    res.json(attempts);
  } catch (err) {
    console.error('Error fetching quiz attempts:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/quiz-attempts/:quizId/attempts/:attemptId
 * Returns one specific attempt by ID.
 */
export const getQuizAttemptById = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId);
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
    res.json(attempt);
  } catch (err) {
    console.error('Error fetching quiz attempt by ID:', err.message);
    res.status(500).json({ error: err.message });
  }
};
