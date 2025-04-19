import mongoose from 'mongoose';

/**
 * Subdocument schema for an individual answer in a quiz attempt.
 * Stores:
 * - The question ID
 * - The selected answer (type varies by question format)
 */
const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  selectedAnswer: {
    type: mongoose.Schema.Types.Mixed, // Supports index, string, boolean, etc.
    required: true
  }
});

/**
 * Main schema for QuizAttempt.
 * Tracks a single attempt of a user taking a specific quiz.
 */
const quizAttemptSchema = new mongoose.Schema({
  quizId: {
    type: String,
    ref: 'Quiz',
    required: true
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  answers: {
    type: [answerSchema],
    default: []
  },
  score: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date
  },
  attemptNumber: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Export the model
const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;

